"use client"

import { useState } from "react"
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react"

interface ExportMarketingModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
  }) => void
}

export function ExportMarketingModal({
  isOpen,
  onClose,
  onExport,
}: ExportMarketingModalProps) {
  const [format, setFormat] = useState<"xlsx" | "pdf" | "csv">("xlsx")
  const [timeframe, setTimeframe] = useState("01/06/2024 - 31/08/2024")
  const [includeChannels, setIncludeChannels] = useState(true)

  if (!isOpen) return null

  const handleExport = () => {
    onExport({
      format,
      timeframe,
      includeChannels,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Xuất báo cáo Marketing</h3>
              <p className="text-xs text-slate-500">Tải về dữ liệu chiến dịch và số liệu phân tích</p>
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Format selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Định dạng tệp</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat("xlsx")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  format === "xlsx"
                    ? "border-[#007a48] bg-[#e6f7f0]/40 text-[#007a48] font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mb-1 text-emerald-600" />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  format === "pdf"
                    ? "border-[#007a48] bg-[#e6f7f0]/40 text-[#007a48] font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium"
                }`}
              >
                <FileText className="w-5 h-5 mb-1 text-red-500" />
                <span>PDF (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  format === "csv"
                    ? "border-[#007a48] bg-[#e6f7f0]/40 text-[#007a48] font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium"
                }`}
              >
                <FileText className="w-5 h-5 mb-1 text-blue-500" />
                <span>CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Khoảng thời gian báo cáo</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#007a48] text-slate-800 font-medium"
            >
              <option value="01/06/2024 - 31/08/2024">Kỳ hiện tại (01/06/2024 - 31/08/2024)</option>
              <option value="Tháng 8/2024">Tháng 8/2024</option>
              <option value="Quý 2/2024">Quý 2/2024</option>
              <option value="Cả năm 2024">Cả năm 2024</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeChannels}
                onChange={(e) => setIncludeChannels(e.target.checked)}
                className="rounded border-slate-300 text-[#007a48] focus:ring-[#007a48]"
              />
              <span className="text-slate-700 font-medium">Bao gồm bảng phân rã chi tiết từng kênh</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#007a48] text-white rounded-xl font-semibold hover:bg-[#00663c] transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác nhận xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
