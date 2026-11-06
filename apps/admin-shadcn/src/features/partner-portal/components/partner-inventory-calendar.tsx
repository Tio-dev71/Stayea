"use client"

import { useState, useEffect } from "react"
import {
  Calendar as CalendarIcon,
  Check,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Unlock,
} from "lucide-react"
import { toast } from "sonner"
import { stayeaApi } from "@/lib/stayea-api-service"
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
  const [savedNotice, setSavedNotice] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0]

  const serviceTotalUnits =
    Number(activeService?.attributes?.totalUnits) ||
    Number(activeService?.attributes?.capacity) ||
    (activeService?.serviceType === "transport" ? 5 : activeService?.serviceType === "experience" ? 20 : 1)

  const unitName =
    activeService?.serviceType === "transport"
      ? "xe"
      : activeService?.serviceType === "experience"
      ? "vé"
      : "phòng"

  const [batchSlots, setBatchSlots] = useState<number>(serviceTotalUnits)

  // Update batch slots when activeService changes
  useEffect(() => {
    setBatchSlots(serviceTotalUnits)
  }, [selectedServiceId, serviceTotalUnits])

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
        slots: serviceTotalUnits,
        isWeekend,
      }
    })
  })

  // Load backend inventory records for selected service
  useEffect(() => {
    if (!selectedServiceId) return
    let isCancelled = false

    async function loadInventory() {
      try {
        const records = await stayeaApi.getPartnerInventory(selectedServiceId)
        if (isCancelled || !Array.isArray(records) || records.length === 0) {
          // If no inventory exists in backend, reset to current service total units
          setCalendarDays((prev) =>
            prev.map((d) => ({
              ...d,
              slots: serviceTotalUnits,
              isAvailable: true,
            }))
          )
          return
        }

        const recordMap = new Map(records.map((r: any) => [r.date, r]))
        setCalendarDays((prev) =>
          prev.map((d) => {
            const matched = recordMap.get(d.date) as any
            if (matched) {
              const totalSlots = matched.totalSlots !== undefined && matched.totalSlots !== null
                ? Number(matched.totalSlots)
                : serviceTotalUnits
              return {
                ...d,
                isAvailable: matched.isAvailable ?? true,
                slots: totalSlots,
                priceOverride: matched.priceOverride ? Number(matched.priceOverride) : undefined,
              }
            }
            return {
              ...d,
              slots: serviceTotalUnits,
            }
          })
        )
      } catch (err) {
        console.error("Error loading partner inventory:", err)
      }
    }

    loadInventory()
    return () => {
      isCancelled = true
    }
  }, [selectedServiceId, serviceTotalUnits])

  const syncDaysToBackend = async (days: DaySlot[]) => {
    if (!selectedServiceId) return
    setIsSyncing(true)
    const dates = days.map((d) => ({
      date: d.date,
      isAvailable: d.isAvailable,
      totalSlots: d.slots,
      priceOverride: d.priceOverride,
    }))

    try {
      const ok = await stayeaApi.bulkUpdatePartnerInventory({
        serviceId: selectedServiceId,
        dates,
      })
      if (ok) {
        setSavedNotice(true)
        setTimeout(() => setSavedNotice(false), 2500)
      }
    } catch {
      toast.error("Không thể đồng bộ lịch tồn kho lên máy chủ.")
    } finally {
      setIsSyncing(false)
    }
  }

  // Toggle Day Availability (Open / Close)
  const toggleDayAvailability = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setCalendarDays((prev) => {
      const updated = [...prev]
      const current = updated[index]
      if (current) {
        const nextAvail = !current.isAvailable
        updated[index] = {
          ...current,
          isAvailable: nextAvail,
          slots: nextAvail ? (current.slots > 0 ? current.slots : serviceTotalUnits) : 0,
        }
      }
      syncDaysToBackend(updated)
      return updated
    })
  }

  // Adjust slots for a single day (+1 or -1)
  const adjustDaySlots = (index: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCalendarDays((prev) => {
      const updated = [...prev]
      const current = updated[index]
      if (current) {
        const newSlots = Math.max(0, current.slots + delta)
        updated[index] = {
          ...current,
          slots: newSlots,
          isAvailable: newSlots > 0,
        }
      }
      syncDaysToBackend(updated)
      return updated
    })
  }

  // Bulk Apply Total Units to entire month
  const handleApplyBatchSlots = () => {
    const targetSlots = Math.max(1, Number(batchSlots) || 1)
    setCalendarDays((prev) => {
      const updated = prev.map((d) => ({
        ...d,
        slots: targetSlots,
        isAvailable: true,
      }))
      syncDaysToBackend(updated)
      return updated
    })
    toast.success(`Đã cập nhật toàn bộ tháng thành ${targetSlots} ${unitName}/ngày!`)
  }

  const handleBulkOpenWeekend = () => {
    setCalendarDays((prev) => {
      const updated = prev.map((d) =>
        d.isWeekend ? { ...d, isAvailable: true, slots: Math.max(1, d.slots || serviceTotalUnits) } : d
      )
      syncDaysToBackend(updated)
      return updated
    })
    toast.success("Đã mở nhận khách các ngày cuối tuần!")
  }

  const handleBulkCloseMonth = () => {
    setCalendarDays((prev) => {
      const updated = prev.map((d) => ({ ...d, isAvailable: false, slots: 0 }))
      syncDaysToBackend(updated)
      return updated
    })
    toast.info("Đã đóng nhận khách toàn bộ tháng.")
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
      {/* Top Selector & Service Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Chọn dịch vụ điều chỉnh lịch & tồn chỗ:
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="mt-1 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-600 w-full md:w-auto shadow-xs"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({Number.parseInt(s.price).toLocaleString("vi-VN")} ₫/{s.unit || "đêm"}) — {Number(s.attributes?.totalUnits) || 1} {s.serviceType === "transport" ? "xe" : "chỗ"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Capacity Insight Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span>Sức chứa sẵn có: </span>
            <strong className="text-emerald-950 font-extrabold">{serviceTotalUnits} {unitName}</strong>
            <span className="text-[11px] text-emerald-700 block">
              Cho phép nhiều khách cùng đặt lịch trong cùng một ngày
            </span>
          </div>
        </div>
      </div>

      {/* BATCH INVENTORY CONTROLS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Batch Slots Input Form */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-700">
              Cài đặt số lượng sẵn có mỗi ngày:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 shadow-xs">
              <input
                type="number"
                min={1}
                max={500}
                value={batchSlots}
                onChange={(e) => setBatchSlots(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-transparent text-center font-bold text-sm text-emerald-800 focus:outline-none"
              />
              <span className="text-xs text-slate-500 pr-1">{unitName}/ngày</span>
            </div>
            <button
              onClick={handleApplyBatchSlots}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Áp dụng toàn tháng</span>
            </button>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkOpenWeekend}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              Mở Cuối Tuần
            </button>
            <button
              onClick={handleBulkCloseMonth}
              className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              Đóng Cả Tháng
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Month Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{selectedMonth}</span>
              <span className="text-xs font-normal text-slate-500">
                (Bấm Bật/Tắt khóa hoặc dùng nút &quot;+ / -&quot; để tăng giảm số lượng từng ngày)
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {isSyncing && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                <span>Đang lưu...</span>
              </span>
            )}
            {savedNotice && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                <Check className="w-3.5 h-3.5" /> Đã lưu lịch & tồn chỗ!
              </span>
            )}
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-2 mt-4 text-center text-xs font-semibold text-slate-500">
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div className="text-emerald-700 font-bold">T7 (Cuối tuần)</div>
          <div className="text-emerald-700 font-bold">CN (Cuối tuần)</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {calendarDays.map((slot, idx) => {
            const isAvail = slot.isAvailable && slot.slots > 0
            const basePrice = activeService ? Number.parseInt(activeService.price) : 1500000
            const dayPrice = basePrice + (slot.priceOverride || 0)

            return (
              <div
                key={slot.date}
                className={`group relative flex flex-col justify-between p-2 sm:p-2.5 rounded-xl border min-h-[105px] transition-all ${
                  isAvail
                    ? "bg-emerald-50/30 border-emerald-200 hover:border-emerald-400 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-60 text-slate-400"
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      slot.isWeekend ? "text-emerald-800" : "text-slate-900"
                    }`}
                  >
                    {slot.dayNumber}
                  </span>

                  {/* Toggle Lock / Unlock button */}
                  <button
                    type="button"
                    onClick={(e) => toggleDayAvailability(idx, e)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title={isAvail ? "Bấm để Đóng ngày này" : "Bấm để Mở ngày này"}
                  >
                    {isAvail ? (
                      <Unlock className="w-3 h-3 text-emerald-700" />
                    ) : (
                      <Lock className="w-3 h-3 text-rose-500" />
                    )}
                  </button>
                </div>

                {/* Status & Price */}
                <div className="my-1">
                  <div className="text-[11px] font-bold text-emerald-800">
                    {dayPrice.toLocaleString("vi-VN")} ₫
                  </div>

                  {/* Slot Counter with Direct Increment / Decrement */}
                  {isAvail ? (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-emerald-100">
                      <span className="text-[10px] font-semibold text-emerald-900">
                        Còn {slot.slots} {unitName}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={(e) => adjustDaySlots(idx, -1, e)}
                          className="w-4 h-4 rounded bg-slate-200/80 hover:bg-rose-100 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Giảm 1 chỗ"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => adjustDaySlots(idx, 1, e)}
                          className="w-4 h-4 rounded bg-slate-200/80 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Tăng 1 chỗ"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-100 text-center">
                      Đã đóng / Hết
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-700">Đang mở bán (Còn phòng/xe nhận khách)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Đã đóng / Hết chỗ</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            * Lịch khả dụng và số lượng chỗ được đồng bộ tức thời trên ứng dụng khách hàng STAYEA.
          </div>
        </div>
      </div>
    </div>
  )
}
