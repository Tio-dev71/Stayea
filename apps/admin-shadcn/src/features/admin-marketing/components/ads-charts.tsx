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
  AdsTimelinePoint,
  AdsChannelDonutItem,
  AdsCostRevenueBarItem,
  AdsFunnelStageItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface AdsChartsProps {
  timeline: AdsTimelinePoint[]
  channelDonut: AdsChannelDonutItem[]
  costRevenueBars: AdsCostRevenueBarItem[]
  funnelStages: AdsFunnelStageItem[]
}

// Custom Top Label for Bar Chart
function renderBarLabel(props: any) {
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
      {value}M
    </text>
  )
}

export function AdsCharts({
  timeline,
  channelDonut,
  costRevenueBars,
  funnelStages,
}: AdsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. HIỆU QUẢ QUẢNG CÁO THEO THỜI GIAN */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Hiệu quả quảng cáo theo thời gian
          </h2>
          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Chi phí</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Lượt hiển thị</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-slate-600 text-[11px]">Lượt nhấp</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-slate-600 text-[11px]">Lượt chuyển đổi</span>
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
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(val: any) => [`${val}K`, ""]}
              />
              <Line
                type="monotone"
                dataKey="cost"
                name="Chi phí"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0284c7" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="impressions"
                name="Lượt hiển thị"
                stroke="#007a48"
                strokeWidth={2}
                dot={{ r: 3, fill: "#007a48" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                name="Lượt nhấp"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                name="Lượt chuyển đổi"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#8b5cf6" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. PHÂN BỔ CHI PHÍ QUẢNG CÁO THEO KÊNH */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Phân bổ chi phí quảng cáo theo kênh
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[210px]">
          {/* Donut chart */}
          <div className="relative w-[150px] h-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percent"
                >
                  {channelDonut.map((entry) => (
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
                85.0M
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                tổng chi phí
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 flex-1 min-w-[170px]">
            {channelDonut.map((item) => (
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

      {/* 3. CHI PHÍ VÀ DOANH THU THEO KÊNH */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Chi phí và doanh thu theo kênh
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Chi phí</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Doanh thu</span>
            </div>
          </div>
        </div>

        <div className="h-[210px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={costRevenueBars}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="channel"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}M`}
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`${val}M VNĐ`, ""]}
              />
              <Bar
                dataKey="cost"
                name="Chi phí"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
                barSize={18}
                label={renderBarLabel}
              />
              <Bar
                dataKey="revenue"
                name="Doanh thu"
                fill="#007a48"
                radius={[4, 4, 0, 0]}
                barSize={18}
                label={renderBarLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. PHỄU CHUYỂN ĐỔI QUẢNG CÁO (TỔNG) */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Phễu chuyển đổi quảng cáo (Tổng)
        </h2>

        {/* Funnel Layout */}
        <div className="flex items-center justify-between h-[210px] px-2">
          {/* Left: Stage labels */}
          <div className="flex flex-col justify-between h-[180px] text-xs text-slate-700 font-medium py-1">
            <span>Hiển thị</span>
            <span>Nhấp chuột</span>
            <span>Truy cập website</span>
            <span>Đặt phòng/Đăng ký</span>
          </div>

          {/* Center: Funnel graphic */}
          <div className="flex flex-col items-center justify-between h-[180px] w-[180px]">
            <svg
              viewBox="0 0 200 160"
              className="w-full h-full overflow-visible drop-shadow-xs"
            >
              {/* Stage 1: Hiển thị */}
              <polygon
                points="10,0 190,0 165,36 35,36"
                fill="#0284c7"
                className="transition-opacity hover:opacity-90"
              />
              {/* Stage 2: Nhấp chuột */}
              <polygon
                points="36,40 164,40 142,76 58,76"
                fill="#06b6d4"
                className="transition-opacity hover:opacity-90"
              />
              {/* Stage 3: Truy cập website */}
              <polygon
                points="59,80 141,80 123,116 77,116"
                fill="#10b981"
                className="transition-opacity hover:opacity-90"
              />
              {/* Stage 4: Đặt phòng/Đăng ký */}
              <polygon
                points="78,120 122,120 108,156 92,156"
                fill="#f59e0b"
                className="transition-opacity hover:opacity-90"
              />
            </svg>
          </div>

          {/* Right: Numbers and Percentage */}
          <div className="flex flex-col justify-between h-[180px] text-right py-1">
            {funnelStages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-end gap-3 text-xs">
                <span className="font-bold text-slate-800">{stage.count}</span>
                <span className="text-slate-400 font-medium min-w-[40px] text-right">
                  {stage.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
