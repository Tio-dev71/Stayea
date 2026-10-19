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
  Globe,
  Building,
  BookmarkCheck,
  Compass,
  Users2,
  Car,
  ArrowRight,
} from "lucide-react"
import {
  MOCK_BOOKING_TIMELINE,
  MOCK_BOOKING_STATUS_SLICES,
  MOCK_BOOKING_PRODUCT_TYPES,
  MOCK_BOOKING_CHANNELS,
} from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"
import type {
  BookingTimelinePoint,
  BookingStatusSlice,
  BookingProductTypeItem,
  BookingChannelItem,
} from "@/features/admin-reports/stayea-admin-reports-bookings-mock-data"

function getChannelIcon(icon: BookingChannelItem["icon"]) {
  switch (icon) {
    case "website":
      return <Globe className="w-3.5 h-3.5 text-emerald-600" />
    case "booking-engine":
      return <BookmarkCheck className="w-3.5 h-3.5 text-sky-600" />
    case "ota":
      return <Building className="w-3.5 h-3.5 text-orange-500" />
    case "experience":
      return <Compass className="w-3.5 h-3.5 text-cyan-600" />
    case "partner":
      return <Users2 className="w-3.5 h-3.5 text-purple-600" />
    case "other":
      return <Car className="w-3.5 h-3.5 text-slate-500" />
    default:
      return <Globe className="w-3.5 h-3.5 text-emerald-600" />
  }
}

interface ReportsBookingsChartsProps {
  timeline?: BookingTimelinePoint[]
  statusSlices?: BookingStatusSlice[]
  productTypes?: BookingProductTypeItem[]
  channels?: BookingChannelItem[]
  onViewProductDetails?: () => void
  onViewChannelDetails?: () => void
}

export function ReportsBookingsCharts({
  timeline = MOCK_BOOKING_TIMELINE,
  statusSlices = MOCK_BOOKING_STATUS_SLICES,
  productTypes = MOCK_BOOKING_PRODUCT_TYPES,
  channels = MOCK_BOOKING_CHANNELS,
  onViewProductDetails,
  onViewChannelDetails,
}: ReportsBookingsChartsProps) {
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

  // Bar data formatted with label for zero/null
  const barData = productTypes.map((item) => ({
    ...item,
    displayCount: item.count === null ? 0 : item.count,
    labelTop: item.count === null ? "-" : item.count.toString(),
  }))

  return (
    <div className="space-y-4">
      {/* Row 1: Số lượng đặt phòng theo thời gian & Tỷ lệ trạng thái */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 1. Số lượng đặt phòng theo thời gian */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Số lượng đặt phòng theo thời gian
            </h3>

            {/* Legends */}
            <div className="flex items-center gap-3.5 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007a48] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Thành công</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Đang xử lý</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shrink-0" />
                <span className="text-slate-600 text-[11px] sm:text-xs">Đã hủy</span>
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
                  <linearGradient id="bookingSuccessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007a48" stopOpacity={0.25} />
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
                  domain={[0, 250]}
                  ticks={[0, 50, 100, 150, 200, 250]}
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
                            Thành công: {payload[0]?.value}
                          </p>
                          <p className="text-sky-300">
                            Đang xử lý: {payload[1]?.value}
                          </p>
                          <p className="text-rose-400">
                            Đã hủy: {payload[2]?.value}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  stroke="#007a48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#bookingSuccessGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="canceled"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Tỷ lệ trạng thái đặt phòng */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Tỷ lệ trạng thái đặt phòng
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center flex-1">
            {/* Donut Chart with center label */}
            <div className="sm:col-span-6 relative flex items-center justify-center h-52 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={2.5}
                    dataKey="percent"
                  >
                    {statusSlices.map((entry) => (
                      <Cell key={`status-slice-${entry.status}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const data = payload[0].payload as BookingStatusSlice
                        return (
                          <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                            <span className="font-semibold">{data.status}:</span>{" "}
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
                  1.248
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  Tổng đặt phòng
                </span>
              </div>
            </div>

            {/* Legend list on the right */}
            <div className="sm:col-span-6 space-y-3 text-xs">
              {statusSlices.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[11px] sm:text-xs truncate">{item.status}</span>
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

      {/* Row 2: Đặt phòng theo loại sản phẩm & Đặt phòng theo kênh */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* 3. Đặt phòng theo loại sản phẩm (Bar Chart) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Đặt phòng theo loại sản phẩm
            </h3>
            <button
              type="button"
              onClick={onViewProductDetails}
              className="text-xs sm:text-[12px] font-semibold text-[#007a48] hover:text-[#00683d] flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 22, right: 10, left: -20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fontSize: 10.5, fill: "#64748b" }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 600]}
                  ticks={[0, 200, 400, 600]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]) {
                      const item = payload[0].payload as {
                        type: string
                        count: number | null
                      }
                      return (
                        <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-xs shadow-md">
                          <span className="font-semibold">{item.type}:</span>{" "}
                          {item.count === null ? "Chưa có" : `${item.count} đơn`}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="displayCount"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={38}
                >
                  <LabelList
                    dataKey="labelTop"
                    position="top"
                    style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }}
                  />
                  {barData.map((entry) => (
                    <Cell key={`bar-${entry.type}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Đặt phòng theo kênh (Horizontal progress bars) */}
        <div className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
              Đặt phòng theo kênh
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

          <div className="space-y-3.5 py-1 flex-1 flex flex-col justify-center">
            {channels.map((ch) => (
              <div key={ch.channel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getChannelIcon(ch.icon)}
                    </span>
                    <span className="font-medium text-slate-800">{ch.channel}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {ch.percent}%{" "}
                    <span className="text-slate-400 font-normal">({ch.countFormatted})</span>
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ch.percent}%`,
                      backgroundColor: ch.color,
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
