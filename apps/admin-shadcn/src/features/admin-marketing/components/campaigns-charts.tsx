"use client"

import { useState, useEffect } from "react"
import {
  AreaChart,
  Area,
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
import { ArrowRight } from "lucide-react"
import type {
  MarketingTimelinePoint,
  CampaignTypeShareItem,
  MarketingOrdersByChannelItem,
  CampaignCostRoasItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import {
  MOCK_MARKETING_TIMELINE,
  MOCK_CAMPAIGN_TYPES_DONUT,
  MOCK_CAMPAIGN_BOOKINGS_BY_CHANNEL,
  MOCK_CAMPAIGN_COST_ROAS_TOP5,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface CampaignsChartsProps {
  timelineData?: MarketingTimelinePoint[]
  campaignTypes?: CampaignTypeShareItem[]
  bookingsByChannel?: MarketingOrdersByChannelItem[]
  costRoasData?: CampaignCostRoasItem[]
  onViewChannelDetails?: () => void
  onViewCostRoasDetails?: () => void
}

export function CampaignsCharts({
  timelineData = MOCK_MARKETING_TIMELINE,
  campaignTypes = MOCK_CAMPAIGN_TYPES_DONUT,
  bookingsByChannel = MOCK_CAMPAIGN_BOOKINGS_BY_CHANNEL,
  costRoasData = MOCK_CAMPAIGN_COST_ROAS_TOP5,
  onViewChannelDetails,
  onViewCostRoasDetails,
}: CampaignsChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
        <div className="h-72 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
        <div className="h-72 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
        <div className="h-72 bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Timeline Area Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 1. Left Chart: Hiệu quả chiến dịch theo thời gian (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Hiệu quả chiến dịch theo thời gian
            </h3>
            {/* Legend badges */}
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
                <span>Lượt tiếp cận</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span>Lượt tương tác</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Lượt đặt phòng</span>
              </span>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="campReachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007a48" stopOpacity={0.16} />
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
                  domain={[0, 80]}
                  ticks={[0, 20, 40, 60, 80]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(val) => (val === 0 ? "0" : `${val}K`)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-xs text-white rounded-xl p-2.5 text-xs shadow-xl border border-slate-700/50 space-y-1">
                          <p className="font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-1">
                            Thời gian: {label}
                          </p>
                          {payload.map((entry) => (
                            <div key={entry.dataKey as string} className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                {entry.dataKey === "reach" ? "Tiếp cận" : entry.dataKey === "engagement" ? "Tương tác" : "Đặt phòng"}:
                              </span>
                              <span className="font-bold text-white">
                                {Number(entry.value).toLocaleString("vi-VN")}K
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  isAnimationActive={false}
                  stroke="#007a48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#campReachGrad)"
                  dot={{ r: 3.5, fill: "#007a48", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#007a48" }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  isAnimationActive={false}
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={0}
                  dot={{ r: 3.5, fill: "#0284c7", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#0284c7" }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  isAnimationActive={false}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={0}
                  dot={{ r: 3.5, fill: "#f59e0b", strokeWidth: 1.5, stroke: "#fff" }}
                  activeDot={{ r: 5, fill: "#f59e0b" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Right Chart: Hiệu quả theo loại chiến dịch (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Hiệu quả theo loại chiến dịch
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1 flex-1">
            {/* Donut Chart with center 24 Chiến dịch */}
            <div className="sm:col-span-6 relative w-full h-48 sm:h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignTypes}
                    isAnimationActive={false}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={2.5}
                    dataKey="percentage"
                  >
                    {campaignTypes.map((entry) => (
                      <Cell key={`type-slice-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as CampaignTypeShareItem
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.name}:</span>{" "}
                            {data.percentage}% ({data.count})
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Tâm Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  24
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Chiến dịch
                </span>
              </div>
            </div>

            {/* Chú giải bên phải */}
            <div className="sm:col-span-6 space-y-1.5 text-[11px] sm:text-xs">
              {campaignTypes.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2 hover:bg-slate-50 px-1 py-0.5 rounded transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {item.percentage}% ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Lượt đặt phòng theo kênh & Chi phí / ROAS Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 3. Lượt đặt phòng theo kênh (Bar Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Lượt đặt phòng theo kênh
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
                data={bookingsByChannel}
                margin={{ top: 22, right: 10, left: -15, bottom: 10 }}
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
                  domain={[0, 1500]}
                  ticks={[0, 300, 600, 900, 1200, 1500]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]) {
                      const item = payload[0].payload as MarketingOrdersByChannelItem
                      return (
                        <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                          <span className="font-semibold">{item.channel}:</span>{" "}
                          {item.orders.toLocaleString("vi-VN")} đơn đặt phòng
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false}>
                  <LabelList
                    dataKey="orders"
                    position="top"
                    offset={5}
                    fill="#1e293b"
                    fontSize={11}
                    fontWeight={700}
                    formatter={(val: unknown) => typeof val === "number" ? val.toLocaleString("vi-VN") : String(val ?? "")}
                  />
                  {bookingsByChannel.map((entry) => (
                    <Cell key={`bar-camp-channel-${entry.channel}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Chi phí & ROAS theo chiến dịch (Top 5) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Chi phí & ROAS theo chiến dịch (Top 5)
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>Chi phí</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>ROAS</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onViewCostRoasDetails}
                className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer ml-1"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5 Horizontal Bars with Title, Blue Bar, Cost Formatted, and Green ROAS */}
          <div className="space-y-3.5 pt-1 pb-2 flex-1 flex flex-col justify-around">
            {costRoasData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-semibold truncate max-w-[220px] sm:max-w-[280px]">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Blue Bar representation */}
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-sm overflow-hidden flex items-center">
                    <div
                      className="h-full bg-[#2563eb] rounded-xs transition-all duration-300"
                      style={{ width: `${item.barWidthPercent}%` }}
                    />
                  </div>
                  {/* Cost Formatted */}
                  <span className="text-xs font-semibold text-slate-800 w-24 text-right shrink-0">
                    {item.costFormatted}
                  </span>
                  {/* ROAS Badge */}
                  <span className="text-xs font-extrabold text-[#10b981] w-8 text-right shrink-0">
                    {item.roas}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
