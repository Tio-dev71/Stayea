"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
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
  ExperienceTimelinePoint,
  ExperienceCategorySlice,
  ExperienceChannelRevenueItem,
  CustomerAgeSlice,
} from "@/features/admin-experiences/stayea-admin-experience-report-mock-data"
import {
  MOCK_CUSTOMER_AGE_DONUT,
  MOCK_CUSTOMER_GROUP_DONUT,
} from "@/features/admin-experiences/stayea-admin-experience-report-mock-data"

interface ExperienceReportChartsProps {
  timeline: ExperienceTimelinePoint[]
  categoriesDonut: ExperienceCategorySlice[]
  channelRevenues: ExperienceChannelRevenueItem[]
  onViewChannelDetail?: () => void
}

export function ExperienceReportCharts({
  timeline,
  categoriesDonut,
  channelRevenues,
  onViewChannelDetail,
}: ExperienceReportChartsProps) {
  const [customerSegmentMode, setCustomerSegmentMode] = useState<"age" | "group">("age")

  const currentCustomerData: CustomerAgeSlice[] =
    customerSegmentMode === "age"
      ? MOCK_CUSTOMER_AGE_DONUT
      : MOCK_CUSTOMER_GROUP_DONUT

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. LƯỢT ĐẶT TOUR THEO THỜI GIAN */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Lượt đặt tour theo thời gian
          </h2>
          {/* Legends */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Lượt đặt tour</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Khách tham gia</span>
            </div>
          </div>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeline}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tourBookingsGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007a48" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#007a48" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="none"
                fill="url(#tourBookingsGlow)"
              />
              <Line
                type="monotone"
                dataKey="bookings"
                name="Lượt đặt tour"
                stroke="#007a48"
                strokeWidth={2}
                dot={{ r: 3, fill: "#007a48" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="guests"
                name="Khách tham gia"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0284c7" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. PHÂN LOẠI TRẢI NGHIỆM & TOUR */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Phân loại trải nghiệm & tour
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[210px]">
          {/* Donut chart */}
          <div className="relative w-[150px] h-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percent"
                >
                  {categoriesDonut.map((entry) => (
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
                1.250
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Lượt đặt tour
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 flex-1 min-w-[170px]">
            {categoriesDonut.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium text-[11px] truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px] shrink-0">
                  {item.percent}% ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DOANH THU TOUR THEO KÊNH */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Doanh thu tour theo kênh
          </h2>
          <button
            type="button"
            onClick={onViewChannelDetail}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <span>→</span>
          </button>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={channelRevenues}
              margin={{ top: 20, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="channel"
                interval={0}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}M`}
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Tooltip
                formatter={(val: any) => [`${val}M VNĐ`, "Doanh thu"]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="revenueM"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  fontSize: 10,
                  fill: "#1e293b",
                  fontWeight: 600,
                  formatter: (v: any) => `${Number(v).toFixed(1)}M`,
                }}
              >
                {channelRevenues.map((entry) => (
                  <Cell key={entry.channel} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. LOẠI KHÁCH HÀNG THAM GIA TOUR */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Loại khách hàng tham gia tour
          </h2>
          {/* Segment filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setCustomerSegmentMode("age")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                customerSegmentMode === "age"
                  ? "bg-[#007a48] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Độ tuổi
            </button>
            <button
              type="button"
              onClick={() => setCustomerSegmentMode("group")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                customerSegmentMode === "group"
                  ? "bg-[#007a48] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Nhóm khách
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[210px]">
          {/* Donut chart */}
          <div className="relative w-[150px] h-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentCustomerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percent"
                >
                  {currentCustomerData.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
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
                2.980
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Khách tham gia
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 flex-1 min-w-[170px]">
            {currentCustomerData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium text-[11px] truncate">
                    {item.label}
                  </span>
                </div>
                <span className="text-slate-500 font-semibold text-[11px] shrink-0">
                  {item.percent}% ({item.countFormatted})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
