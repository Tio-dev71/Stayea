"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChevronDown } from "lucide-react"
import type { RevenueDataPoint } from "@/features/admin-dashboard/stayea-admin-mock-data"
import { REVENUE_CHART_DATA_VI } from "@/features/admin-dashboard/stayea-admin-mock-data"

interface StayeaAdminRevenueChartProps {
  data?: readonly RevenueDataPoint[]
}

export function StayeaAdminRevenueChart({
  data = REVENUE_CHART_DATA_VI,
}: StayeaAdminRevenueChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          Doanh thu theo thời gian
        </h2>

        {/* Filter Dropdown: 7 ngày qua */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
        >
          <span>7 ngày qua</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-56 sm:h-64 pt-2">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data as RevenueDataPoint[]}
              margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="stayeaRevenueGradVI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1b7a4e" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#1b7a4e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val}Tr`)}
                dx={-4}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0 && payload[0]?.payload) {
                    const item = payload[0].payload as RevenueDataPoint
                    return (
                      <div className="bg-white rounded-xl px-3.5 py-2 text-xs shadow-lg border border-slate-200 text-left">
                        <p className="text-slate-400 font-medium text-[11px]">{item.fullDate}</p>
                        <p className="text-slate-900 font-bold text-sm mt-0.5">
                          {item.displayAmount}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1b7a4e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#stayeaRevenueGradVI)"
                dot={{ r: 4, fill: "#1b7a4e", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#1b7a4e", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl text-xs text-slate-400 animate-pulse">
            Đang tải biểu đồ...
          </div>
        )}
      </div>
    </div>
  )
}
