"use client"

import { useState } from "react"
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
} from "lucide-react"

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
    includePartners: boolean
  }) => void
}

export function ExportReportModal({
  isOpen,
  onClose,
  onExport,
}: ExportReportModalProps) {
  const [format, setFormat] = useState<"xlsx" | "pdf" | "csv">("xlsx")
  const [timeframe, setTimeframe] = useState("01/06/2024 - 31/08/2024")
  const [includePartners, setIncludePartners] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      onExport({ format, timeframe, includePartners })
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f7ee] text-[#007a48] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Xuất báo cáo doanh thu
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tải xuống dữ liệu đối soát và thanh toán
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Timeframe option */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Khoảng thời gian báo cáo</span>
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="01/06/2024 - 31/08/2024">
                Kỳ hiện tại (01/06/2024 - 31/08/2024)
              </option>
              <option value="30-days">30 ngày gần nhất</option>
              <option value="q2-2024">Quý 2/2024</option>
              <option value="ytd">Từ đầu năm đến nay (YTD)</option>
            </select>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Định dạng tệp
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "xlsx", label: "Excel (.xlsx)", desc: "Đầy đủ công thức" },
                { id: "pdf", label: "PDF Document", desc: "Trình ký & in ấn" },
                { id: "csv", label: "CSV Data", desc: "Dữ liệu thô" },
              ].map((item) => {
                const isSelected = format === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id as "xlsx" | "pdf" | "csv")}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#007a48] bg-[#e8f7ee]/50 text-[#007a48] ring-1 ring-[#007a48]"
                        : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <span className="font-bold text-xs">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {item.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Checkbox option */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600">
            <input
              type="checkbox"
              checked={includePartners}
              onChange={(e) => setIncludePartners(e.target.checked)}
              className="rounded-md border-slate-300 text-[#007a48] focus:ring-emerald-500/20"
            />
            <span>Bao gồm chi tiết hoa hồng và thông tin đối tác liên kết</span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải báo cáo ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
