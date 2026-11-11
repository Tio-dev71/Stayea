"use client"

import { useEffect, useRef } from "react"

export interface StayeaStreamEvent<T = any> {
  event: string
  channel: string
  payload: T
  timestamp: number
}

type EventHandler<T = any> = (payload: T, rawEvent: StayeaStreamEvent<T>) => void

function getRealtimeStreamUrl(channel: string): string {
  const ch = encodeURIComponent(channel.trim())
  const apiBase =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : ""

  const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase
  return `${cleanBase}/api/stayea/realtime/stream?channel=${ch}`
}

/**
 * Low-level client manager for SSE Stream with auto-reconnection and backoff
 */
export function subscribeToStayeaStream(
  channel: string,
  onEvent: (event: StayeaStreamEvent) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }

  let eventSource: EventSource | null = null
  let isClosed = false
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  let retryCount = 0

  function connect() {
    if (isClosed) return

    try {
      const url = getRealtimeStreamUrl(channel)
      eventSource = new EventSource(url, { withCredentials: true })

      eventSource.onopen = () => {
        retryCount = 0
        // console.debug(`[Stayea Realtime] Connected to channel: ${channel}`)
      }

      eventSource.onmessage = (e) => {
        try {
          if (!e.data) return
          const parsed = JSON.parse(e.data) as StayeaStreamEvent
          if (parsed && parsed.event && parsed.event !== "ping") {
            onEvent(parsed)
          }
        } catch {
          // ignore heartbeat parsing
        }
      }

      eventSource.onerror = (err) => {
        if (eventSource) {
          eventSource.close()
          eventSource = null
        }
        if (onError) onError(err)

        if (!isClosed) {
          // Exponential backoff: 2s, 4s, 8s, max 15s
          const delay = Math.min(15000, 2000 * Math.pow(1.5, retryCount))
          retryCount++
          reconnectTimeout = setTimeout(connect, delay)
        }
      }
    } catch (err) {
      if (onError) onError(err)
      if (!isClosed) {
        reconnectTimeout = setTimeout(connect, 5000)
      }
    }
  }

  connect()

  return () => {
    isClosed = true
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }
}

/**
 * React Hook to subscribe to Stayea Realtime Events in any component
 *
 * Example:
 * useStayeaRealtime(`partner:${partnerId}`, {
 *   "partner:order:created": (data) => reloadOrders(),
 *   "pms:room:updated": (data) => updateRoomRack(data),
 * })
 */
export function useStayeaRealtime(
  channel: string | null | undefined,
  handlers: Record<string, EventHandler>
) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    if (!channel || channel.trim() === "") return

    const unsubscribe = subscribeToStayeaStream(
      channel,
      (evt) => {
        const handler = handlersRef.current[evt.event]
        if (typeof handler === "function") {
          handler(evt.payload, evt)
        }
        // Also support generic wildcard handler if defined
        const allHandler = handlersRef.current["*"]
        if (typeof allHandler === "function") {
          allHandler(evt.payload, evt)
        }
      },
      () => {
        // silent error handling with auto reconnect
      }
    )

    return () => {
      unsubscribe()
    }
  }, [channel])
}

