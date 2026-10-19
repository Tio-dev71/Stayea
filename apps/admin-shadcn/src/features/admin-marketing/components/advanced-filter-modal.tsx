"use client"

import { useState } from "react"
import { X, SlidersHorizontal, RotateCcw } from "lucide-react"

interface AdvancedFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: {
    minBudget: string
    maxBudget: string
    targetAudience: string
    onlyActive: boolean
  }) => void
}

export function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
}: AdvancedFilterModalProps) {
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [targetAudience, setTargetAudience] = useState("all")
  const [onlyActive, setOnlyActive] = useState(false)

  if (!isOpen) return null

  const handleReset = () => {
    setMinBudget("")
    setMaxBudget("")
    setTargetAudience("all")
    setOnlyActive(false)
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    onApply({
      minBudget,
      maxBudget,
      targetAudience,
      onlyActive,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e6f7f0] text-[#007a48] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Bộ lọc nâng cao</h3>
              <p className="text-xs text-slate-500">Tùy biến tiêu chí chiến dịch marketing</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ngân sách tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="VD: 5000000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#007a48] focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ngân sách tối đa (VNĐ)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="VD: 50000000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#007a48] focus:bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Đối tượng mục tiêu
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#007a48] text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">Tất cả đối tượng</option>
              <option value="domestic">Khách du lịch nội địa</option>
              <option value="international">Khách quốc tế</option>
              <option value="family">Gia đình & Nhóm bạn</option>
              <option value="couples">Cặp đôi & Trăng mật</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="onlyActive"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
              className="rounded border-slate-300 text-[#007a48] focus:ring-[#007a48] cursor-pointer"
            />
            <label htmlFor="onlyActive" className="text-slate-700 font-medium cursor-pointer">
              Chỉ hiển thị chiến dịch đang hoạt động có chỉ số cao
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#007a48] text-white rounded-xl font-semibold hover:bg-[#00663c] transition-colors shadow-xs"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
