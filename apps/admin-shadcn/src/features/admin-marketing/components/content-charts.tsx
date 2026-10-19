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
  MOCK_CONTENT_TIMELINE,
  MOCK_CONTENT_FORMAT_DONUT,
  MOCK_CONTENT_CHANNELS_BAR,
  MOCK_CONTENT_TOPICS_LIST,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type {
  ContentTimelinePoint,
  ContentFormatDonutItem,
  ContentChannelBarItem,
  ContentTopicItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ContentChartsProps {
  timelineData?: ContentTimelinePoint[]
  donutData?: ContentFormatDonutItem[]
  channelBarsData?: ContentChannelBarItem[]
  topicsData?: ContentTopicItem[]
  onViewAllTopics?: () => void
}

export function ContentCharts({
  timelineData = MOCK_CONTENT_TIMELINE,
  donutData = MOCK_CONTENT_FORMAT_DONUT,
  channelBarsData = MOCK_CONTENT_CHANNELS_BAR,
  topicsData = MOCK_CONTENT_TOPICS_LIST,
  onViewAllTopics,
}: ContentChartsProps) {
  // Max topic percent for bar scaling
  const maxTopicPercent = Math.max(...topicsData.map((t) => t.percent))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. TOP-LEFT: Hiệu quả nội dung theo thời gian (Line Chart 3 series) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Hiệu quả nội dung theo thời gian
          </h3>

          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
              <span>Lượt xem</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#007a48]" />
              <span>Lượt tương tác</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span>Lượt nhấp liên kết</span>
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
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val}K`)}
              />
              <RechartsTooltip
                formatter={(val: any, name: any) => [
                  `${val}K`,
                  name === "views"
                    ? "Lượt xem"
                    : name === "engagement"
                    ? "Lượt tương tác"
                    : "Lượt nhấp liên kết",
                ]}
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
                dataKey="views"
                stroke="#0284c7"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#0284c7" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#007a48"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#007a48" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#f59e0b"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#f59e0b" }}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. TOP-RIGHT: Phân bổ nội dung theo định dạng (Donut Chart) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-3">
          Phân bổ nội dung theo định dạng
        </h3>

        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut Chart with center value */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="count"
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
                320
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                Nội dung
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
                  <span>({item.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM-LEFT: Hiệu quả nội dung theo kênh (Dual Bar Chart) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Hiệu quả nội dung theo kênh
          </h3>

          {/* Legends */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
              <span>Lượt xem</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Lượt tương tác →</span>
            </div>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={channelBarsData}
              margin={{ top: 22, right: 10, left: -20, bottom: 0 }}
              barGap={4}
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
                domain={[0, 400]}
                ticks={[0, 100, 200, 300, 400]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val}K`)}
              />
              <RechartsTooltip
                formatter={(val: any, name: any) => [
                  `${val}K`,
                  name === "views" ? "Lượt xem" : "Lượt tương tác",
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  fontSize: "12px",
                }}
              />
              {/* Blue Bar: Lượt xem */}
              <Bar
                dataKey="views"
                fill="#1877f2"
                radius={[4, 4, 0, 0]}
                barSize={18}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="views"
                  position="top"
                  formatter={(val: any) => `${val}K`}
                  style={{ fill: "#1e293b", fontSize: "10px", fontWeight: 700 }}
                  offset={6}
                />
              </Bar>

              {/* Green Bar: Lượt tương tác */}
              <Bar
                dataKey="engagement"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={18}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT: Top chủ đề nội dung (Horizontal Progress Bars) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Top chủ đề nội dung
          </h3>
          <button
            type="button"
            onClick={onViewAllTopics}
            className="text-[11px] font-semibold text-[#007a48] hover:text-[#00653b] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-around space-y-2.5 my-auto">
          {topicsData.map((item) => {
            const pct = Math.max(5, Math.round((item.percent / maxTopicPercent) * 100))

            return (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                {/* Topic Name */}
                <span className="w-32 sm:w-36 text-slate-600 font-medium truncate">
                  {item.name}
                </span>

                {/* Progress Bar Container */}
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Formatted Value: % (count) */}
                <span className="w-16 text-right font-medium text-slate-700 shrink-0">
                  <span className="font-semibold text-slate-900">{item.percent}%</span>{" "}
                  <span className="text-slate-400">({item.count})</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
