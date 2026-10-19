"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type {
  EmailTimelinePoint,
  EmailTypeDonutItem,
  EmailDeviceBarItem,
  EmailSegmentItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface EmailChartsProps {
  timeline: EmailTimelinePoint[]
  emailTypes: EmailTypeDonutItem[]
  deviceBars: EmailDeviceBarItem[]
  segments: EmailSegmentItem[]
  onViewTypeDetails?: () => void
  onViewSegmentDetails?: () => void
}

function renderDeviceBarLabel(props: any) {
  const { x, y, width, value } = props
  if (!value) return null
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#475569"
      textAnchor="middle"
      fontSize={10}
      fontWeight={600}
    >
      {value}%
    </text>
  )
}

export function EmailCharts({
  timeline,
  emailTypes,
  deviceBars,
  segments,
  onViewTypeDetails,
  onViewSegmentDetails,
}: EmailChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. HIỆU QUẢ EMAIL MARKETING THEO THỜI GIAN */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Hiệu quả email marketing theo thời gian
          </h2>
          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Email gửi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Mở email</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-slate-600 text-[11px]">Nhấp link</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
              <span className="text-slate-600 text-[11px]">Chuyển đổi</span>
            </div>
          </div>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeline}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}K`}
                domain={[0, 60]}
                ticks={[0, 10, 20, 30, 40, 50, 60]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${val}K`, ""]}
              />
              <Line
                type="monotone"
                dataKey="sent"
                name="Email gửi"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0284c7" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="opened"
                name="Mở email"
                stroke="#007a48"
                strokeWidth={2}
                dot={{ r: 3, fill: "#007a48" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="clicked"
                name="Nhấp link"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                name="Chuyển đổi"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ec4899" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. HIỆU QUẢ THEO LOẠI EMAIL */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Hiệu quả theo loại email
          </h2>
          <button
            type="button"
            onClick={onViewTypeDetails}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <span>→</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[210px]">
          {/* Donut chart */}
          <div className="relative w-[150px] h-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emailTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percent"
                >
                  {emailTypes.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900 leading-none">
                120K
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Email gửi
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 flex-1 min-w-[170px]">
            {emailTypes.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px]">
                  {item.percent}% ({item.amount})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TỶ LỆ MỞ & TỶ LỆ NHẤP THEO THIẾT BỊ */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Tỷ lệ mở & Tỷ lệ nhấp theo thiết bị
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Tỷ lệ mở</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Tỷ lệ nhấp</span>
            </div>
          </div>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={deviceBars}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="device"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${val}%`, ""]}
              />
              <Bar
                dataKey="openRate"
                name="Tỷ lệ mở"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
                barSize={24}
                label={renderDeviceBarLabel}
              />
              <Bar
                dataKey="clickRate"
                name="Tỷ lệ nhấp"
                fill="#007a48"
                radius={[4, 4, 0, 0]}
                barSize={24}
                label={renderDeviceBarLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. HIỆU QUẢ THEO PHÂN KHÚC KHÁCH HÀNG */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Hiệu quả theo phân khúc khách hàng
          </h2>
          <button
            type="button"
            onClick={onViewSegmentDetails}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <span>→</span>
          </button>
        </div>

        {/* Progress List */}
        <div className="space-y-3 my-auto py-1">
          {segments.map((seg) => (
            <div key={seg.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{seg.name}</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {seg.percent}% ({seg.count})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
  )
}
