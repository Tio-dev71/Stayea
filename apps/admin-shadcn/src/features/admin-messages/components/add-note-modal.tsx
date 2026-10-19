"use client"

import { useState } from "react"
import { X, StickyNote, Plus } from "lucide-react"

interface AddNoteModalProps {
  isOpen: boolean
  customerName: string
  onClose: () => void
  onSaveNote: (content: string) => void
}

export function AddNoteModal({
  isOpen,
  customerName,
  onClose,
  onSaveNote,
}: AddNoteModalProps) {
  const [content, setContent] = useState("")

  if (!isOpen) return null

  const handleSave = () => {
    if (!content.trim()) return
    onSaveNote(content.trim())
    setContent("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-amber-600 flex items-center justify-center">
              <StickyNote className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Thêm ghi chú khách hàng
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ghi chú nội bộ cho {customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Nội dung ghi chú
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ví dụ: Khách quan tâm tour biển đảo, yêu cầu ăn chay..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={!content.trim()}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Lưu ghi chú</span>
          </button>
        </div>
      </div>
    </div>
  )
}
