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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Tình trạng đặt phòng
        </h2>
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body: Donut on Left, Legend on Right */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
        {/* Donut Chart with Centered Total */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.payload) {
                      const item = payload[0].payload as BookingStatusSlice
                      return (
                        <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg border border-slate-800">
                          <span className="font-semibold">{item.status}: </span>
                          <span className="text-emerald-400">{item.percentage}% ({item.count})</span>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Pie
                  data={data as BookingStatusSlice[]}
                  dataKey="percentage"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl text-xs text-slate-400 animate-pulse">
              Đang tải...
            </div>
          )}

          {/* Center Text Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {totalBookings.toLocaleString("vi-VN")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1">
              Tổng đặt phòng
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="flex-1 w-full space-y-2.5 text-xs sm:text-sm pl-2">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 font-medium">{item.status}</span>
              </div>
              <span className="text-slate-900 font-bold">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
