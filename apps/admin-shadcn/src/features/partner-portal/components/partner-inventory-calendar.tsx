"use client"

import { useState } from "react"
import {
  Calendar as CalendarIcon,
  Check,
  Lock,
} from "lucide-react"
import type { PartnerServiceData } from "../types"

interface PartnerInventoryCalendarProps {
  services: PartnerServiceData[]
  initialServiceId?: string
}

interface DaySlot {
  date: string
  dayNumber: number
  isAvailable: boolean
  slots: number
  priceOverride?: number
  isWeekend?: boolean
}

export function PartnerInventoryCalendar({
  services,
  initialServiceId,
}: PartnerInventoryCalendarProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[0]?.id || ""
  )
  const [selectedMonth] = useState("Tháng 11 / 2026")

  // Generate 30 days for current calendar (Nov 2026)
  const [calendarDays, setCalendarDays] = useState<DaySlot[]>(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1
      const dayStr = day < 10 ? `0${day}` : `${day}`
      const date = `2026-11-${dayStr}`
      const isWeekend = (day + 5) % 7 === 0 || (day + 5) % 7 === 6

      return {
        date,
        dayNumber: day,
        isAvailable: true,
        slots: 1,
        isWeekend,
      }
    })
  })

  const [savedNotice, setSavedNotice] = useState(false)

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0]

  const toggleDayAvailability = (index: number) => {
    setCalendarDays((prev) => {
      const updated = [...prev]
      const current = updated[index]
      if (current) {
        updated[index] = {
          ...current,
          isAvailable: !current.isAvailable,
          slots: current.isAvailable ? 0 : 2,
        }
      }
      return updated
    })
  }

  const handleBulkOpenWeekend = () => {
    setCalendarDays((prev) =>
      prev.map((d) => (d.isWeekend ? { ...d, isAvailable: true, slots: 2 } : d))
    )
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  const handleBulkCloseMonth = () => {
    setCalendarDays((prev) => prev.map((d) => ({ ...d, isAvailable: false, slots: 0 })))
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  const handleResetOpen = () => {
    setCalendarDays((prev) => prev.map((d) => ({ ...d, isAvailable: true, slots: 2 })))
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
        <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">Chưa có dịch vụ nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Vui lòng thêm dịch vụ ở tab &quot;Quản lý Dịch vụ&quot; trước khi cài đặt lịch và tồn kho.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Chọn dịch vụ điều chỉnh lịch & giá:
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="mt-1 bg-slate-800 border border-slate-700 text-sm font-semibold text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({Number.parseInt(s.price).toLocaleString("vi-VN")} ₫/{s.unit || "đêm"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetOpen}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium transition-colors"
          >
            Mở Toàn Bộ Tháng
          </button>
          <button
            onClick={handleBulkOpenWeekend}
            className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-800/50 text-blue-300 hover:bg-blue-900/60 text-xs font-medium transition-colors"
          >
            Mở Cuối Tuần
          </button>
          <button
            onClick={handleBulkCloseMonth}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-900/50 text-rose-300 hover:bg-rose-900/40 text-xs font-medium transition-colors"
          >
            Đóng Nhận Khách Tháng
          </button>
        </div>
      </div>

      {/* Calendar View Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Month Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{selectedMonth}</span>
              <span className="text-xs font-normal text-slate-400">
                (Bấm trực tiếp vào từng ngày để Bật/Tắt còn phòng hoặc còn xe)
              </span>
            </h3>
          </div>

          {savedNotice && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Đã lưu lịch khả dụng!
            </span>
          )}
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-2 mt-4 text-center text-xs font-semibold text-slate-400">
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div className="text-emerald-400">T7 (Cuối tuần)</div>
          <div className="text-emerald-400">CN (Cuối tuần)</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {calendarDays.map((slot, idx) => {
            const isAvail = slot.isAvailable
            const basePrice = activeService ? Number.parseInt(activeService.price) : 1500000
            const dayPrice = basePrice + (slot.priceOverride || 0)

            if (services.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
        <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">Chưa có dịch vụ nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Vui lòng thêm dịch vụ ở tab &quot;Quản lý Dịch vụ&quot; trước khi cài đặt lịch và tồn kho.
        </p>
      </div>
    )
  }

  return (
              <div
                key={slot.date}
                onClick={() => toggleDayAvailability(idx)}
                className={`cursor-pointer group relative flex flex-col justify-between p-2.5 rounded-xl border min-h-[90px] transition-all hover:scale-[1.03] ${
                  isAvail
                    ? "bg-slate-800/90 border-slate-700 hover:border-emerald-500 shadow-xs"
                    : "bg-slate-950/80 border-slate-800/60 opacity-60"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      slot.isWeekend ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {slot.dayNumber}
                  </span>
                  {isAvail ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>

                {/* Status & Price */}
                <div className="mt-2 text-right">
                  {isAvail ? (
                    <>
                      <div className="text-[11px] font-bold text-emerald-300">
                        {dayPrice.toLocaleString("vi-VN")} ₫
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {slot.slots > 0 ? `Còn ${slot.slots} chỗ` : "Còn nhận"}
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/60 inline-block">
                      Đã đóng / Hết
                    </div>
                  )}
                </div>

                {/* Hover instruction hint */}
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold text-emerald-200">
                  {isAvail ? "Bấm để Đóng" : "Bấm để Mở"}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Đang mở bán (AI & Khách có thể đặt)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Đã đóng / Kín lịch (Báo hết phòng/xe)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            * Dữ liệu tồn kho được AI Agent và hệ thống tra cứu tự động theo thời gian thực.
          </div>
        </div>
      </div>
    </div>
  )
}
