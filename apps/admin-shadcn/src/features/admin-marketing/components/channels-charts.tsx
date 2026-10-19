"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts"
import {
  MOCK_CHANNEL_TIMELINE_TRENDS,
  MOCK_CHANNEL_REACH_DONUT,
  MOCK_CHANNEL_BOOKINGS_BAR,
  MOCK_CHANNEL_REVENUE_BAR,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type {
  ChannelTimelineTrendPoint,
  ChannelReachDonutItem,
  ChannelBookingsBarItem,
  ChannelRevenueBarItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ChannelsChartsProps {
  timelineData?: ChannelTimelineTrendPoint[]
  donutData?: ChannelReachDonutItem[]
  bookingsData?: ChannelBookingsBarItem[]
  revenueData?: ChannelRevenueBarItem[]
}

export function ChannelsCharts({
  timelineData = MOCK_CHANNEL_TIMELINE_TRENDS,
  donutData = MOCK_CHANNEL_REACH_DONUT,
  bookingsData = MOCK_CHANNEL_BOOKINGS_BAR,
  revenueData = MOCK_CHANNEL_REVENUE_BAR,
}: ChannelsChartsProps) {
  // Max revenue for proportional bar width
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenueNum))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. TOP-LEFT: Xu hướng hiệu quả theo kênh (Line Chart) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Xu hướng hiệu quả theo kênh
          </h3>

          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
              <span>Facebook</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#ea4335]" />
              <span>Google</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#e1306c]" />
              <span>Instagram</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#0068ff]" />
              <span>Zalo</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#64748b]" />
              <span>Khác</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                dy={6}
              />
              <YAxis
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val}K`)}
              />
              <RechartsTooltip
                formatter={(val: any) => [`${val}K lượt`, ""]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="facebook"
                stroke="#1877f2"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#1877f2" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="google"
                stroke="#ea4335"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#ea4335" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="instagram"
                stroke="#e1306c"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#e1306c" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="zalo"
                stroke="#0068ff"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#0068ff" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="email"
                stroke="#10b981"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#10b981" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="other"
                stroke="#64748b"
                strokeWidth={1.8}
                dot={{ r: 2, fill: "#64748b" }}
                activeDot={{ r: 3.5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. TOP-RIGHT: Tỷ lệ lượt tiếp cận theo kênh (Donut Chart) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-3">
          Tỷ lệ lượt tiếp cận theo kênh
        </h3>

        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut Chart with center value */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="percent"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={1.5}
                  isAnimationActive={false}
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                258.4K
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                Lượt tiếp cận
              </span>
            </div>
          </div>

          {/* Right Legend List */}
          <div className="flex-1 w-full flex flex-col justify-center space-y-2.5">
            {donutData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs text-slate-700"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-slate-500">
                  <span className="font-semibold text-slate-900">{item.percent}%</span>
                  <span>({item.formattedReach})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT: Lượt đặt phòng theo kênh (Bar Chart) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-2">
          Lượt đặt phòng theo kênh
        </h3>

        <div className="h-64 sm:h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bookingsData}
              margin={{ top: 22, right: 10, left: -20, bottom: 0 }}
              barSize={32}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="channel"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
                dy={6}
              />
              <YAxis
                domain={[0, 1500]}
                ticks={[0, 300, 600, 900, 1200, 1500]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : val.toLocaleString("vi-VN"))}
              />
              <RechartsTooltip
                formatter={(val: any) => [`${typeof val === "number" ? val.toLocaleString("vi-VN") : val} đơn`, "Lượt đặt phòng"]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="orders"
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
              >
                {bookingsData.map((entry) => (
                  <Cell key={entry.channel} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="orders"
                  position="top"
                  formatter={(val: any) => (typeof val === "number" ? val.toLocaleString("vi-VN") : String(val ?? ""))}
                  style={{ fill: "#1e293b", fontSize: "11px", fontWeight: 600 }}
                  offset={6}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT: Doanh thu theo kênh (Horizontal Progress Bars) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-4">
          Doanh thu theo kênh
        </h3>

        <div className="flex-1 flex flex-col justify-around space-y-3.5 my-auto">
          {revenueData.map((item) => {
            const pct = Math.max(4, Math.round((item.revenueNum / maxRevenue) * 100))

            return (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                {/* Channel Name */}
                <span className="w-24 sm:w-28 text-slate-600 font-medium truncate">
                  {item.channel}
                </span>

                {/* Progress Bar Container */}
                <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Formatted Revenue */}
                <span className="w-18 text-right font-bold text-slate-900 shrink-0">
                  {item.revenueFormatted}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
