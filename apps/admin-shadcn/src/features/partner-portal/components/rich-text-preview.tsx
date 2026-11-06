"use client"

import React from "react"
import { CheckCircle2, ChevronRight, Info } from "lucide-react"

interface RichTextPreviewProps {
  content: string
  className?: string
  variant?: "light" | "dark"
}

/**
 * Parses inline formatting like **bold** and *italic* safely into React elements
 */
function parseInlineFormatting(text: string, isLight: boolean = true): React.ReactNode[] {
  // Regex to split by bold (**text**) or italic (*text*)
  const parts: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0

  while (remaining.length > 0) {
    // Check for bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Check for italic *text*
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)

    // Find whichever matches first
    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : -1
    const italicIdx = italicMatch ? remaining.indexOf(italicMatch[0]) : -1

    if (boldIdx !== -1 && (italicIdx === -1 || boldIdx <= italicIdx)) {
      if (boldIdx > 0) {
        parts.push(remaining.slice(0, boldIdx))
      }
      parts.push(
        <strong
          key={`bold-${keyIdx++}`}
          className={`font-bold tracking-wide ${isLight ? "text-slate-900 font-extrabold" : "text-white"}`}
        >
          {boldMatch![1]}
        </strong>
      )
      remaining = remaining.slice(boldIdx + boldMatch![0].length)
    } else if (italicIdx !== -1) {
      if (italicIdx > 0) {
        parts.push(remaining.slice(0, italicIdx))
      }
      parts.push(
        <em
          key={`italic-${keyIdx++}`}
          className={`italic ${isLight ? "text-slate-600" : "text-slate-300"}`}
        >
          {italicMatch![1]}
        </em>
      )
      remaining = remaining.slice(italicIdx + italicMatch![0].length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return parts
}

/**
 * Lightweight, zero-dependency Markdown / Rich-text renderer for service descriptions
 */
export function RichTextPreview({ content, className = "", variant = "light" }: RichTextPreviewProps) {
  const isLight = variant === "light"

  if (!content || !content.trim()) {
    return (
      <div className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"} italic py-4 text-center ${className}`}>
        Chưa có nội dung mô tả để hiển thị xem trước.
      </div>
    )
  }

  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  let listBuffer: { type: "bullet" | "number"; items: string[] } | null = null

  const flushList = () => {
    if (!listBuffer) return
    const currentList = listBuffer
    listBuffer = null

    if (currentList.type === "bullet") {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-xs leading-relaxed ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  isLight ? "bg-emerald-600" : "bg-emerald-400"
                }`}
              />
              <span>{parseInlineFormatting(item, isLight)}</span>
            </li>
          ))}
        </ul>
      )
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-2 text-xs leading-relaxed ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0 border ${
                  isLight
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {idx + 1}
              </span>
              <span>{parseInlineFormatting(item, isLight)}</span>
            </li>
          ))}
        </ol>
      )
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    if (rawLine === undefined) continue
    const trimmed = rawLine.trim()

    // Empty line -> flush list and add small space
    if (!trimmed) {
      flushList()
      elements.push(<div key={`empty-${i}`} className="h-2" />)
      continue
    }

    // Heading 3: ### Heading
    if (trimmed.startsWith("### ")) {
      flushList()
      const title = trimmed.replace(/^###\s+/, "")
      elements.push(
        <h4
          key={`h4-${i}`}
          className={`text-sm font-bold mt-4 mb-2 flex items-center gap-1.5 border-b pb-1 ${
            isLight
              ? "text-emerald-800 border-slate-200"
              : "text-emerald-300 border-slate-800"
          }`}
        >
          <ChevronRight className={`w-3.5 h-3.5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />
          <span>{parseInlineFormatting(title, isLight)}</span>
        </h4>
      )
      continue
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith("## ")) {
      flushList()
      const title = trimmed.replace(/^##\s+/, "")
      elements.push(
        <h3
          key={`h3-${i}`}
          className={`text-base font-bold mt-4 mb-2 border-b pb-1.5 ${
            isLight
              ? "text-slate-900 border-emerald-600/30"
              : "text-white border-emerald-900/60"
          }`}
        >
          {parseInlineFormatting(title, isLight)}
        </h3>
      )
      continue
    }

    // Blockquote / Callout: > text
    if (trimmed.startsWith("> ")) {
      flushList()
      const calloutText = trimmed.replace(/^>\s+/, "")
      elements.push(
        <div
          key={`quote-${i}`}
          className={`my-3 p-3 rounded-xl border border-l-4 text-xs leading-relaxed flex items-start gap-2.5 shadow-xs ${
            isLight
              ? "bg-emerald-50/70 border-emerald-200 border-l-emerald-600 text-emerald-950"
              : "bg-emerald-950/30 border-emerald-800/40 border-l-emerald-400 text-emerald-200/90"
          }`}
        >
          <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />
          <div className="flex-1">{parseInlineFormatting(calloutText, isLight)}</div>
        </div>
      )
      continue
    }

    // Checklist / Included: [x] or ✅
    if (trimmed.startsWith("✅ ") || trimmed.startsWith("- [x] ")) {
      flushList()
      const checkText = trimmed.replace(/^(✅\s+|- \[x\]\s+)/, "")
      elements.push(
        <div
          key={`check-${i}`}
          className={`flex items-center gap-2 text-xs py-1 ${
            isLight ? "text-slate-800 font-medium" : "text-slate-200"
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-emerald-600" : "text-emerald-400"}`} />
          <span>{parseInlineFormatting(checkText, isLight)}</span>
        </div>
      )
      continue
    }

    // Bullet list: - item or * item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.replace(/^[-*]\s+/, "")
      if (listBuffer && listBuffer.type === "bullet") {
        listBuffer.items.push(itemText)
      } else {
        flushList()
        listBuffer = { type: "bullet", items: [itemText] }
      }
      continue
    }

    // Numbered list: 1. item
    const numMatch = trimmed.match(/^\d+\.\s+(.+)/)
    if (numMatch && numMatch[1]) {
      const itemText = numMatch[1]
      if (listBuffer && listBuffer.type === "number") {
        listBuffer.items.push(itemText)
      } else {
        flushList()
        listBuffer = { type: "number", items: [itemText] }
      }
      continue
    }

    // Normal paragraph
    flushList()
    elements.push(
      <p
        key={`p-${i}`}
        className={`text-xs leading-relaxed my-1 ${
          isLight ? "text-slate-700" : "text-slate-300"
        }`}
      >
        {parseInlineFormatting(trimmed, isLight)}
      </p>
    )
  }

  flushList()

  return <div className={`space-y-1 ${className}`}>{elements}</div>
}

