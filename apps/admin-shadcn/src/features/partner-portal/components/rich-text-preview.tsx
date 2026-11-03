"use client"

import React from "react"
import { CheckCircle2, ChevronRight, Info } from "lucide-react"

interface RichTextPreviewProps {
  content: string
  className?: string
}

/**
 * Parses inline formatting like **bold** and *italic* safely into React elements
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
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
        <strong key={`bold-${keyIdx++}`} className="font-bold text-white tracking-wide">
          {boldMatch![1]}
        </strong>
      )
      remaining = remaining.slice(boldIdx + boldMatch![0].length)
    } else if (italicIdx !== -1) {
      if (italicIdx > 0) {
        parts.push(remaining.slice(0, italicIdx))
      }
      parts.push(
        <em key={`italic-${keyIdx++}`} className="italic text-slate-300">
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
export function RichTextPreview({ content, className = "" }: RichTextPreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className={`text-xs text-slate-500 italic py-4 text-center ${className}`}>
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
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      )
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5 shrink-0 border border-emerald-500/30">
                {idx + 1}
              </span>
              <span>{parseInlineFormatting(item)}</span>
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
          className="text-sm font-bold text-emerald-300 mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-1"
        >
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>{parseInlineFormatting(title)}</span>
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
          className="text-base font-bold text-white mt-4 mb-2 border-b border-emerald-900/60 pb-1.5"
        >
          {parseInlineFormatting(title)}
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
          className="my-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 border-l-4 border-l-emerald-400 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2.5 shadow-xs"
        >
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">{parseInlineFormatting(calloutText)}</div>
        </div>
      )
      continue
    }

    // Checklist / Included: [x] or ✅
    if (trimmed.startsWith("✅ ") || trimmed.startsWith("- [x] ")) {
      flushList()
      const checkText = trimmed.replace(/^(✅\s+|- \[x\]\s+)/, "")
      elements.push(
        <div key={`check-${i}`} className="flex items-center gap-2 text-xs text-slate-200 py-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{parseInlineFormatting(checkText)}</span>
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
      <p key={`p-${i}`} className="text-xs text-slate-300 leading-relaxed my-1">
        {parseInlineFormatting(trimmed)}
      </p>
    )
  }

  flushList()

  return <div className={`space-y-1 ${className}`}>{elements}</div>
}

