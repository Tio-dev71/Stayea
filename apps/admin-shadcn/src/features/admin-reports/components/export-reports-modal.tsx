"use client"

import { useState } from "react"
import { X, Download, FileSpreadsheet, FileText, FileCode2 } from "lucide-react"

interface ExportReportsModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includeChannels: boolean
    includeTours: boolean
    includeCustomers: boolean
  }) => void
  currentTimeframe: string
}

export function ExportReportsModal({
  isOpen,
  onClose,
  onExport,
  currentTimeframe,
}: ExportReportsModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"xlsx" | "pdf" | "csv">("xlsx")
  const [timeframe, setTimeframe] = useState(currentTimeframe)
  const [includeChannels, setIncludeChannels] = useState(true)
  const [includeTours, setIncludeTours] = useState(true)
  const [includeCustomers, setIncludeCustomers] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleDownload = () => {
    setIsExporting(true)
    setTimeout(() => {
      onExport({
        format: selectedFormat,
        timeframe,
        includeChannels,
        includeTours,
        includeCustomers,
      })
      setIsExporting(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Xuất dữ liệu báo cáo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn định dạng và các hạng mục cần kết xuất
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-[13px]">
          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Định dạng tệp tải về
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* XLSX */}
              <button
                type="button"
                onClick={() => setSelectedFormat("xlsx")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  selectedFormat === "xlsx"
                    ? "border-[#007a48] bg-emerald-50/40 text-[#007a48] font-semibold ring-1 ring-[#007a48]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 mb-1 text-emerald-600" />
                <span className="text-xs">Excel (.xlsx)</span>
              </button>

              {/* PDF */}
              <button
                type="button"
                onClick={() => setSelectedFormat("pdf")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  selectedFormat === "pdf"
                    ? "border-rose-500 bg-rose-50/40 text-rose-600 font-semibold ring-1 ring-rose-500"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-6 h-6 mb-1 text-rose-600" />
                <span className="text-xs">Bản in (.pdf)</span>
              </button>

              {/* CSV */}
              <button
                type="button"
                onClick={() => setSelectedFormat("csv")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  selectedFormat === "csv"
                    ? "border-sky-500 bg-sky-50/40 text-sky-600 font-semibold ring-1 ring-sky-500"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FileCode2 className="w-6 h-6 mb-1 text-sky-600" />
                <span className="text-xs">Dữ liệu (.csv)</span>
              </button>
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Khoảng thời gian báo cáo
            </label>
            <input
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#007a48]"
            />
          </div>

          {/* Additional inclusion checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Các chỉ số chi tiết đi kèm
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeChannels}
                  onChange={(e) => setIncludeChannels(e.target.checked)}
                  className="rounded text-[#007a48] focus:ring-[#007a48] w-4 h-4"
                />
                <span className="text-slate-600">Phân rã doanh thu theo kênh bán</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTours}
                  onChange={(e) => setIncludeTours(e.target.checked)}
                  className="rounded text-[#007a48] focus:ring-[#007a48] w-4 h-4"
                />
                <span className="text-slate-600">Danh sách top tour & trải nghiệm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCustomers}
                  onChange={(e) => setIncludeCustomers(e.target.checked)}
                  className="rounded text-[#007a48] focus:ring-[#007a48] w-4 h-4"
                />
                <span className="text-slate-600">Nguồn tiếp cận khách hàng mới</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-slate-100 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#007a48] hover:bg-[#00683d] transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <span>Đang tạo tệp...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Tải xuống</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
