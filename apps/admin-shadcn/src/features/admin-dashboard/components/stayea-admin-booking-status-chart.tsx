"use client"

import { useState, useEffect, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight } from "lucide-react"
import type { BookingStatusSlice } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { BOOKING_STATUS_DATA_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminBookingStatusChartProps {
  data?: readonly BookingStatusSlice[]
  onViewDetails?: () => void
}

export function StayeaAdminBookingStatusChart({
  data = BOOKING_STATUS_DATA_VI,
  onViewDetails,
}: StayeaAdminBookingStatusChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalBookings = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  const hasData = useMemo(() => {
    return totalBookings > 0 || data.some((d) => d.count > 0 || d.percentage > 0)
  }, [totalBookings, data])

  const activeSlices = useMemo(() => {
    return (data as BookingStatusSlice[]).filter((d) => d.count > 0 || d.percentage > 0)
  }, [data])

  const completionRate = useMemo(() => {
    const completed = data.find((d) => d.status.toLowerCase().includes("hoàn thành"))
    return completed ? completed.percentage : 0
  }, [data])

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Tình trạng đặt phòng
        </h2>
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors shrink-0"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body: Donut on Left, Legend on Right */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 my-auto py-2">
        {/* Donut Chart with Centered Total */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* 1. Subtle Background Track Ring (Always visible even when 0) */}
                <Pie
                  data={[{ value: 1 }]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={54}
                  fill="#f8fafc"
                  stroke="#e2e8f0"
                  strokeWidth={1.5}
                  isAnimationActive={false}
                />

                {/* 2. Tooltip when active */}
                {hasData && (
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const item = payload[0].payload as BookingStatusSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg border border-slate-800">
                            <span className="font-semibold">{item.status}: </span>
                            <span className="text-emerald-400 font-bold">{item.percentage}%</span>
                            <span className="text-slate-400 ml-1">({item.count} đơn)</span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                )}

                {/* 3. Real Data Slices */}
                {hasData && (
                  <Pie
                    data={activeSlices}
                    dataKey="percentage"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={54}
                    paddingAngle={activeSlices.length > 1 ? 2 : 0}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {activeSlices.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                )}
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl text-xs text-slate-400 animate-pulse">
              Đang tải...
            </div>
          )}

          {/* Center Text Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {totalBookings.toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1 tracking-tight">
              Tổng đặt phòng
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="flex-1 min-w-0 space-y-2 sm:space-y-2.5">
          {data.map((item) => (
            <div key={item.status} className="group">
              <div className="flex items-center justify-between gap-1 text-xs mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 font-medium whitespace-nowrap truncate">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {item.count > 0 && (
                    <span className="text-[11px] text-slate-400 font-medium tabular-nums">
                      {item.count}
                    </span>
                  )}
                  <span className="text-slate-900 font-bold tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hasData ? Math.max(item.percentage, 0) : 0}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stat / Status */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate">
          Tỷ lệ hoàn thành:{" "}
          <strong className="text-slate-900 font-semibold">{completionRate}%</strong>
        </span>
        <span className="inline-flex items-center gap-1 shrink-0 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Thời gian thực</span>
        </span>
      </div>
    </div>
  )
}
