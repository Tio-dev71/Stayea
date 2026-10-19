"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts"
import {
  Users,
  Heart,
  Smile,
  Briefcase,
  Globe,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react"
import {
  MOCK_CUSTOMER_TIMELINE,
  MOCK_CUSTOMER_STRUCTURE,
  MOCK_CUSTOMER_CHANNELS,
  MOCK_CUSTOMER_SEGMENTS,
} from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"
import type {
  CustomerTimelinePoint,
  CustomerStructureSlice,
  CustomerChannelBarItem,
  CustomerSegmentItem,
} from "@/features/admin-reports/stayea-admin-reports-customers-mock-data"

function getSegmentIcon(icon: CustomerSegmentItem["icon"]) {
  switch (icon) {
    case "family":
      return <Users className="w-3.5 h-3.5 text-emerald-600" />
    case "couple":
      return <Heart className="w-3.5 h-3.5 text-sky-600" />
    case "friends":
      return <Smile className="w-3.5 h-3.5 text-amber-500" />
    case "business":
      return <Briefcase className="w-3.5 h-3.5 text-purple-600" />
    case "international":
      return <Globe className="w-3.5 h-3.5 text-slate-500" />
    case "other":
      return <MoreHorizontal className="w-3.5 h-3.5 text-teal-600" />
    default:
      return <Users className="w-3.5 h-3.5 text-emerald-600" />
  }
}

interface ReportsCustomersChartsProps {
  timeline?: CustomerTimelinePoint[]
  structureSlices?: CustomerStructureSlice[]
  channels?: CustomerChannelBarItem[]
  segments?: CustomerSegmentItem[]
  onViewChannelDetails?: () => void
  onViewSegmentDetails?: () => void
}

export function ReportsCustomersCharts({
  timeline = MOCK_CUSTOMER_TIMELINE,
  structureSlices = MOCK_CUSTOMER_STRUCTURE,
  channels = MOCK_CUSTOMER_CHANNELS,
  segments = MOCK_CUSTOMER_SEGMENTS,
  onViewChannelDetails,
  onViewSegmentDetails,
}: ReportsCustomersChartsProps) {
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
      {/* Row 1: Số lượng khách hàng theo thời gian & Cơ cấu khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 1. Số lượng khách hàng theo thời gian */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Số lượng khách hàng theo thời gian
            </h3>

            {/* Legends */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007a48] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Tổng khách hàng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Khách hàng mới</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Khách hàng quay lại</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeline}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="customerTotalGradient" x1="0" y1="0" x2="0" y2="1">
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
                  domain={[0, 2500]}
                  ticks={[0, 500, 1000, 1500, 2000, 2500]}
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
                            Tổng khách: {payload[0]?.value}
                          </p>
                          <p className="text-sky-300">
                            Khách mới: {payload[1]?.value}
                          </p>
                          <p className="text-amber-400">
                            Khách quay lại: {payload[2]?.value}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#007a48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#customerTotalGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="returning"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Cơ cấu khách hàng */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Cơ cấu khách hàng
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center flex-1">
            {/* Donut Chart with center label */}
            <div className="sm:col-span-6 relative flex items-center justify-center h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={structureSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2.5}
                    dataKey="percent"
                  >
                    {structureSlices.map((entry) => (
                      <Cell key={`struct-slice-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as CustomerStructureSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.name}:</span>{" "}
                            {data.percent}% ({data.countFormatted})
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
                <span className="text-xl sm:text-[24px] font-bold text-slate-900 leading-none">
                  8.420
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  Tổng khách hàng
                </span>
              </div>
            </div>

            {/* Legend list on the right */}
            <div className="sm:col-span-6 space-y-3 text-xs">
              {structureSlices.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.legendColor ?? item.color }}
                    />
                    <span className="text-[11px] sm:text-xs truncate">{item.name}</span>
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

      {/* Row 2: Khách hàng mới theo kênh & Phân khúc khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 3. Khách hàng mới theo kênh (Bar Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Khách hàng mới theo kênh
            </h3>
            <button
              type="button"
              onClick={onViewChannelDetails}
              className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channels}
                margin={{ top: 22, right: 10, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="channel"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 1000]}
                  ticks={[0, 200, 400, 600, 800, 1000]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]) {
                      const item = payload[0].payload as CustomerChannelBarItem
                      return (
                        <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                          <span className="font-semibold">{item.channel}:</span>{" "}
                          {item.count} khách mới
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={38}
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }}
                  />
                  {channels.map((entry) => (
                    <Cell key={`cust-channel-${entry.channel}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Phân khúc khách hàng (Horizontal progress bars) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Phân khúc khách hàng
            </h3>
            <button
              type="button"
              onClick={onViewSegmentDetails}
              className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 py-1 flex-1 flex flex-col justify-center">
            {segments.map((seg) => (
              <div key={seg.segment} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getSegmentIcon(seg.icon)}
                    </span>
                    <span className="font-medium text-slate-800">{seg.segment}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {seg.percent}%{" "}
                    <span className="text-slate-400 font-normal">({seg.countFormatted})</span>
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${seg.percent}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
