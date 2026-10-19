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
  MarketingChannelSlice,
  MarketingOrdersByChannelItem,
  MarketingFunnelStage,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import {
  MOCK_MARKETING_TIMELINE,
  MOCK_MARKETING_CHANNELS,
  MOCK_MARKETING_ORDERS_BY_CHANNEL,
  MOCK_MARKETING_CONVERSION_FUNNEL,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface MarketingChartsProps {
  timelineData?: MarketingTimelinePoint[]
  channelData?: MarketingChannelSlice[]
  ordersByChannel?: MarketingOrdersByChannelItem[]
  funnelStages?: MarketingFunnelStage[]
  onViewChannelDetails?: () => void
  onViewOrdersByChannelDetails?: () => void
  onViewFunnelDetails?: () => void
}

export function MarketingCharts({
  timelineData = MOCK_MARKETING_TIMELINE,
  channelData = MOCK_MARKETING_CHANNELS,
  ordersByChannel = MOCK_MARKETING_ORDERS_BY_CHANNEL,
  funnelStages = MOCK_MARKETING_CONVERSION_FUNNEL,
  onViewChannelDetails,
  onViewOrdersByChannelDetails,
  onViewFunnelDetails,
}: MarketingChartsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 h-72 animate-pulse" />
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 h-72 animate-pulse" />
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 h-72 animate-pulse" />
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 h-72 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Hiệu quả theo thời gian & Hiệu quả theo kênh */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 1. Left Chart: Hiệu quả marketing theo thời gian (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Hiệu quả marketing theo thời gian
            </h3>

            {/* Legends */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007a48] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Tiếp cận</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Tương tác</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Đặt hàng</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="mktReachGrad" x1="0" y1="0" x2="0" y2="1">
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
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(val) => (val === 0 ? "0" : `${val}K`)}
                  domain={[0, 80]}
                  ticks={[0, 20, 40, 60, 80]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.payload) {
                      const item = payload[0].payload as MarketingTimelinePoint
                      return (
                        <div className="bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-lg space-y-1">
                          <p className="font-semibold border-b border-slate-700 pb-1">
                            Ngày {item.date}
                          </p>
                          <p className="text-emerald-400">
                            Tiếp cận: <span className="font-bold">{item.reach}K</span>
                          </p>
                          <p className="text-sky-300">
                            Tương tác: <span className="font-bold">{item.engagement}K</span>
                          </p>
                          <p className="text-amber-300">
                            Đặt hàng: <span className="font-bold">{item.orders}K</span>
                          </p>
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
                  fill="url(#mktReachGrad)"
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

        {/* 2. Right Chart: Hiệu quả theo kênh marketing (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Hiệu quả theo kênh marketing
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

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-1 flex-1">
            {/* Donut Chart */}
            <div className="sm:col-span-6 relative w-full h-48 sm:h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={2.5}
                    dataKey="percentage"
                    isAnimationActive={false}
                  >
                    {channelData.map((entry) => (
                      <Cell key={`channel-slice-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as MarketingChannelSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.name}:</span>{" "}
                            {data.percentage}% ({data.value})
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
                <span className="text-xl sm:text-[22px] font-bold text-slate-900 leading-none">
                  258.4K
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  Lượt tiếp cận
                </span>
              </div>
            </div>

            {/* Legend list on right */}
            <div className="sm:col-span-6 space-y-2 text-xs">
              {channelData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] sm:text-xs truncate">{item.name}</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 shrink-0">
                    {item.percentage}%{" "}
                    <span className="text-slate-400 font-normal">({item.value})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Lượt đặt hàng theo kênh marketing & Phễu chuyển đổi marketing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 3. Lượt đặt hàng theo kênh marketing (Bar Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Lượt đặt hàng theo kênh marketing
            </h3>
            <button
              type="button"
              onClick={onViewOrdersByChannelDetails}
              className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordersByChannel}
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
                          {item.orders.toLocaleString("vi-VN")} đơn đặt hàng
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
                  {ordersByChannel.map((entry) => (
                    <Cell key={`bar-channel-${entry.channel}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Phễu chuyển đổi marketing (Funnel) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Phễu chuyển đổi marketing
            </h3>
            <button
              type="button"
              onClick={onViewFunnelDetails}
              className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Funnel Layout with SVG Center Silhouette */}
          <div className="flex items-center justify-between gap-3 py-1 flex-1">
            {/* Left Stage Labels */}
            <div className="flex flex-col justify-between h-[210px] text-xs font-medium text-slate-700">
              {funnelStages.map((stage) => (
                <div key={`stage-lbl-${stage.id}`} className="flex items-center gap-1.5 h-8">
                  <span className="truncate">{stage.stage}</span>
                </div>
              ))}
            </div>

            {/* Center Funnel Graphic */}
            <div className="relative flex items-center justify-center shrink-0 w-36 sm:w-44 h-[210px]">
              <svg
                viewBox="0 0 160 190"
                className="w-full h-full drop-shadow-2xs overflow-visible"
              >
                {/* 1. Tiếp cận (Green #007a48) */}
                <polygon
                  points="6,8 154,8 141,38 19,38"
                  fill="#007a48"
                  rx="3"
                />
                {/* 2. Lượt truy cập (Blue #0284c7) */}
                <polygon
                  points="21,44 139,44 126,74 34,74"
                  fill="#0284c7"
                  rx="3"
                />
                {/* 3. Tương tác (Purple #8b5cf6) */}
                <polygon
                  points="36,80 124,80 111,110 49,110"
                  fill="#8b5cf6"
                  rx="3"
                />
                {/* 4. Thêm vào yêu thích (Amber #f59e0b) */}
                <polygon
                  points="51,116 109,116 98,146 62,146"
                  fill="#f59e0b"
                  rx="3"
                />
                {/* 5. Đặt phòng (Coral Red #ef4444) */}
                <polygon
                  points="64,152 96,152 86,182 74,182"
                  fill="#ef4444"
                  rx="3"
                />
              </svg>
            </div>

            {/* Right Counts & Conversion % */}
            <div className="flex flex-col justify-between h-[210px] text-xs text-right">
              {funnelStages.map((stage) => (
                <div
                  key={`stage-val-${stage.id}`}
                  className="flex items-center justify-end gap-3 h-8"
                >
                  <span className="font-bold text-slate-900">{stage.countFormatted}</span>
                  <span className="text-slate-400 font-medium w-11 text-right">
                    {stage.conversionRate}
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
