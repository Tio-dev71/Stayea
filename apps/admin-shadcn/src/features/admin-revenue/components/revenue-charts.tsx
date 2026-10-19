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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowRight } from "lucide-react"
import type {
  RevenueTimelinePoint,
  RevenueCategorySlice,
} from "@/features/admin-revenue/stayea-admin-revenue-mock-data"
import {
  MOCK_REVENUE_TIMELINE,
  MOCK_REVENUE_CATEGORIES,
} from "@/features/admin-revenue/stayea-admin-revenue-mock-data"

interface RevenueChartsProps {
  timelineData?: RevenueTimelinePoint[]
  categoryData?: RevenueCategorySlice[]
  onViewCategoryDetails?: () => void
}

export function RevenueCharts({
  timelineData = MOCK_REVENUE_TIMELINE,
  categoryData = MOCK_REVENUE_CATEGORIES,
  onViewCategoryDetails,
}: RevenueChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* 1. Left Card (~58% -> 7 cols on lg): Doanh thu theo thời gian */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        {/* Header with Title & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Doanh thu theo thời gian
          </h2>

          {/* Legends: Green dot (Tổng doanh thu), Blue dot (Doanh thu đã thanh toán) */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48] shrink-0" />
              <span className="text-slate-600 text-[11px] sm:text-xs">Tổng doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0" />
              <span className="text-slate-600 text-[11px] sm:text-xs">Doanh thu đã thanh toán</span>
            </div>
          </div>
        </div>

        {/* Dual Area Chart Canvas */}
        <div className="w-full h-56 sm:h-64 pt-1">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007a48" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#007a48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
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
                  domain={[0, 50]}
                  ticks={[0, 10, 20, 30, 40, 50]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(val) => (val === 0 ? "0" : `${val}M`)}
                  dx={-4}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.payload) {
                      const item = payload[0].payload as RevenueTimelinePoint
                      return (
                        <div className="bg-white rounded-xl px-3.5 py-2 text-xs shadow-lg border border-slate-200 text-left space-y-1">
                          <p className="text-slate-400 font-medium text-[11px] pb-1 border-b border-slate-100">
                            {item.fullDate}
                          </p>
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-2 h-2 rounded-full bg-[#007a48]" />
                              Tổng doanh thu:
                            </span>
                            <span className="font-bold text-slate-900">{item.displayTotal}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                              Đã thanh toán:
                            </span>
                            <span className="font-bold text-[#0284c7]">{item.displayPaid}</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                {/* Top Green Spline: Total Revenue */}
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#007a48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGreenGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#007a48", stroke: "#ffffff", strokeWidth: 2 }}
                />

                {/* Bottom Blue Spline: Paid Revenue */}
                <Area
                  type="monotone"
                  dataKey="paidRevenue"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueBlueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
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

      {/* 2. Right Card (~42% -> 5 cols on lg): Doanh thu theo loại hình */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Doanh thu theo loại hình
          </h2>
          <button
            type="button"
            onClick={onViewCategoryDetails}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#007a48] hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content: Donut on Left + Legend List on Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1 flex-1">
          {/* Donut Chart with Center Text */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const item = payload[0].payload as RevenueCategorySlice
                        return (
                          <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg border border-slate-800">
                            <span className="font-semibold">{item.name}: </span>
                            <span className="text-emerald-400 font-bold">
                              {item.percentage}% ({item.valueFormatted})
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={categoryData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
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
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                425.3M
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Tổng doanh thu
              </span>
            </div>
          </div>

          {/* Legend Items List on Right */}
          <div className="flex-1 w-full space-y-1 text-xs pl-0.5">
            {categoryData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-1.5 text-[11px]"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-slate-900 font-bold shrink-0">
                  {item.percentage}%{" "}
                  <span className="text-slate-400 font-normal">
                    ({item.valueFormatted})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
