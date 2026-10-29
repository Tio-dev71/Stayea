"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronDown, SlidersHorizontal, Download, X, Check } from "lucide-react"

interface BookingsFilterBarProps {
  onSearchChange?: (val: string) => void
  onStatusChange?: (status: string) => void
  onPaymentChange?: (payment: string) => void
  onAdvancedFilter?: () => void
  onExport?: () => void
  statusValue?: string
  paymentValue?: string
}

const STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Chờ xác nhận", value: "Chờ xác nhận" },
  { label: "Đã xác nhận", value: "Đã xác nhận" },
  { label: "Đang lưu trú", value: "Đang lưu trú" },
  { label: "Đã hoàn tất", value: "Đã hoàn tất" },
  { label: "Đã hủy", value: "Đã hủy" },
]

const PAYMENT_OPTIONS = [
  { label: "Tất cả thanh toán", value: "all" },
  { label: "Đã thanh toán", value: "Đã thanh toán" },
  { label: "Cọc 50%", value: "Cọc 50%" },
  { label: "Chờ thanh toán", value: "Chờ thanh toán" },
]

export function BookingsFilterBar({
  onSearchChange,
  onStatusChange,
  onPaymentChange,
  onAdvancedFilter,
  onExport,
  statusValue = "all",
  paymentValue = "all",
}: BookingsFilterBarProps) {
  const [searchVal, setSearchVal] = useState("")
  const [openDropdown, setOpenDropdown] = useState<"status" | "payment" | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3" ref={dropdownRef}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* 1. Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value)
              onSearchChange?.(e.target.value)
            }}
            placeholder="Tìm kiếm theo mã đặt chỗ, tên khách hàng, bất động sản..."
            className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-8 py-2 border border-slate-200/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal("")
                onSearchChange?.("")
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trạng thái Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium shadow-2xs transition-colors ${
                statusValue !== "all"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span>
                {STATUS_OPTIONS.find((s) => s.value === statusValue)?.label || "Trạng thái"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === "status" && (
              <div className="absolute left-0 top-11 w-44 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-30 text-left text-xs animate-in fade-in duration-100">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onStatusChange?.(opt.value)
                      setOpenDropdown(null)
                    }}
                    className="w-full px-3 py-2 text-slate-700 hover:bg-emerald-50/60 flex items-center justify-between transition-colors"
                  >
                    <span className={opt.value === statusValue ? "font-bold text-emerald-700" : ""}>
                      {opt.label}
                    </span>
                    {opt.value === statusValue && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thanh toán Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "payment" ? null : "payment")}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium shadow-2xs transition-colors ${
                paymentValue !== "all"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span>
                {PAYMENT_OPTIONS.find((p) => p.value === paymentValue)?.label || "Thanh toán"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === "payment" && (
              <div className="absolute left-0 top-11 w-44 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-30 text-left text-xs animate-in fade-in duration-100">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onPaymentChange?.(opt.value)
                      setOpenDropdown(null)
                    }}
                    className="w-full px-3 py-2 text-slate-700 hover:bg-emerald-50/60 flex items-center justify-between transition-colors"
                  >
                    <span className={opt.value === paymentValue ? "font-bold text-emerald-700" : ""}>
                      {opt.label}
                    </span>
                    {opt.value === paymentValue && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bộ lọc nâng cao */}
          {onAdvancedFilter && (
            <button
              type="button"
              onClick={onAdvancedFilter}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Lọc nâng cao</span>
            </button>
          )}

          {/* Xuất file CSV */}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất file</span>
          </button>
        </div>
      </div>
    </div>
  )
}

