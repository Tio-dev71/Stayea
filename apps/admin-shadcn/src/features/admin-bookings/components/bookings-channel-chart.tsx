"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight } from "lucide-react"
import type { ChannelSlice } from "@/features/admin-bookings/stayea-admin-bookings-mock-data"

interface BookingsChannelChartProps {
  data?: readonly ChannelSlice[]
  totalCount?: number
  onViewDetails?: () => void
}

export function BookingsChannelChart({
  data = [],
  totalCount = 0,
  onViewDetails,
}: BookingsChannelChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const displayData: ChannelSlice[] =
    totalCount > 0 && data.length > 0
      ? (data as ChannelSlice[])
      : [{ channel: "Chưa có dữ liệu", percentage: 100, color: "#e2e8f0" }]

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Tình trạng đặt phòng theo kênh
        </h3>
        <button
          type="button"
          onClick={onViewDetails}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b7a4e] hover:text-emerald-800 hover:underline transition-colors shrink-0"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Donut and Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
        {/* Donut */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {totalCount > 0 && (
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const item = payload[0].payload as ChannelSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg border border-slate-800">
                            <span className="font-semibold">{item.channel}: </span>
                            <span className="text-emerald-400">{item.percentage}%</span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                )}
                <Pie
                  data={displayData}
                  dataKey="percentage"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={totalCount > 0 ? 2 : 0}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {displayData.map((entry) => (
                    <Cell key={entry.channel} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl text-xs text-slate-400 animate-pulse">
              Đang tải...
            </div>
          )}

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">
              Tổng đặt phòng
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {totalCount === 0 || data.length === 0 ? (
            <div className="text-center sm:text-left text-xs text-slate-400 py-2">
              Chưa có dữ liệu đặt phòng theo kênh OTA.
            </div>
          ) : (
            data.map((item) => (
              <div key={item.channel} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium truncate">
                    {item.channel}
                  </span>
                </div>
                <span className="text-slate-900 font-bold text-[11px]">
                  {item.percentage}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
