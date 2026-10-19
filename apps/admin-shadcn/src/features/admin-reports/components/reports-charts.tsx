"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  MOCK_REPORT_REVENUE_TIMELINE,
  MOCK_REPORT_CHANNELS,
  MOCK_REPORT_TRAFFIC_CONVERSION,
  MOCK_REPORT_CUSTOMER_SOURCES,
} from "@/features/admin-reports/stayea-admin-reports-mock-data"
import type {
  ReportTimelinePoint,
  ReportChannelSlice,
  ReportTrafficPoint,
  ReportCustomerSourceSlice,
} from "@/features/admin-reports/stayea-admin-reports-mock-data"

interface ReportsChartsProps {
  revenueTimeline?: ReportTimelinePoint[]
  channels?: ReportChannelSlice[]
  trafficConversion?: ReportTrafficPoint[]
  customerSources?: ReportCustomerSourceSlice[]
}

export function ReportsCharts({
  revenueTimeline = MOCK_REPORT_REVENUE_TIMELINE,
  channels = MOCK_REPORT_CHANNELS,
  trafficConversion = MOCK_REPORT_TRAFFIC_CONVERSION,
  customerSources = MOCK_REPORT_CUSTOMER_SOURCES,
}: ReportsChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-72 bg-slate-100/70 border border-slate-200/80 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Doanh thu theo thời gian & Doanh thu theo kênh */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 1. Doanh thu theo thời gian */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Doanh thu theo thời gian
            </h3>

            {/* Legends */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007a48] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Doanh thu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-[#38bdf8] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">3 tháng trước</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTimeline}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007a48" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#007a48" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 50]}
                  ticks={[0, 10, 20, 30, 40, 50]}
                  tickFormatter={(val) => `${val}M`}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      return (
                        <div className="bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700">
                          <p className="font-semibold text-slate-300 pb-1 border-b border-slate-700/60 mb-1">
                            Ngày {label}
                          </p>
                          <p className="text-emerald-400 font-bold">
                            Doanh thu: {payload[0]?.value}M đ
                          </p>
                          {payload[1] && (
                            <p className="text-sky-300 text-[11px]">
                              3 tháng trước: {payload[1]?.value}M đ
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#007a48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="previousRevenue"
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={0}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Doanh thu theo kênh */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Doanh thu theo kênh
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center flex-1">
            {/* Donut Chart with center label */}
            <div className="sm:col-span-6 relative flex items-center justify-center h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channels}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2.5}
                    dataKey="percent"
                  >
                    {channels.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as ReportChannelSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.name}:</span>{" "}
                            {data.percent}% ({data.valueFormatted})
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center text in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg sm:text-[22px] font-bold text-slate-900 leading-none">
                  425.3M
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  Tổng doanh thu
                </span>
              </div>
            </div>

            {/* Legend list on the right */}
            <div className="sm:col-span-6 space-y-2 text-xs">
              {channels.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] sm:text-xs truncate">{item.name}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 shrink-0">
                    {item.percent}%{" "}
                    <span className="text-slate-400 font-normal">({item.valueFormatted})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Lượt truy cập & Chuyển đổi + Khách hàng mới theo nguồn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 3. Lượt truy cập & Chuyển đổi (Dual Axis Composed Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Lượt truy cập & Chuyển đổi
            </h3>

            {/* Legends */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Lượt truy cập</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Tỷ lệ chuyển đổi</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trafficConversion}
                margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 40]}
                  ticks={[0, 10, 20, 30, 40]}
                  tickFormatter={(val) => `${val}K`}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 8]}
                  ticks={[0, 2, 4, 6, 8]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      return (
                        <div className="bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700">
                          <p className="font-semibold text-slate-300 pb-1 border-b border-slate-700/60 mb-1">
                            Ngày {label}
                          </p>
                          <p className="text-teal-400 font-medium">
                            Lượt truy cập: {payload[0]?.value}K
                          </p>
                          <p className="text-blue-400 font-bold">
                            Chuyển đổi: {payload[1]?.value}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="visits"
                  fill="#2dd4bf"
                  radius={[3, 3, 0, 0]}
                  opacity={0.8}
                  maxBarSize={15}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  stroke="#2563eb"
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: "#2563eb", strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: "#2563eb" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Khách hàng mới theo nguồn (Donut Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Khách hàng mới theo nguồn
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center flex-1">
            {/* Donut Chart with center label */}
            <div className="sm:col-span-6 relative flex items-center justify-center h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2.5}
                    dataKey="percent"
                  >
                    {customerSources.map((entry) => (
                      <Cell key={`cell-${entry.source}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as ReportCustomerSourceSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.source}:</span>{" "}
                            {data.percent}% ({data.countFormatted} khách)
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center text in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg sm:text-[24px] font-bold text-slate-900 leading-none">
                  892
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  Khách hàng mới
                </span>
              </div>
            </div>

            {/* Legend list on the right */}
            <div className="sm:col-span-6 space-y-2 text-xs">
              {customerSources.map((item) => (
                <div
                  key={item.source}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] sm:text-xs truncate">{item.source}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 shrink-0">
                    {item.percent}%{" "}
                    <span className="text-slate-400 font-normal">({item.countFormatted})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
