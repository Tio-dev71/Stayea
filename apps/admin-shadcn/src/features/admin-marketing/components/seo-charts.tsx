"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { ArrowUp } from "lucide-react"
import type {
  SeoTimelinePoint,
  SeoRankDistributionItem,
  SeoTopPageItem,
  SeoTopKeywordItem,
} from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface SeoChartsProps {
  timeline: SeoTimelinePoint[]
  rankDistribution: SeoRankDistributionItem[]
  topPages: SeoTopPageItem[]
  topRankedKeywords: SeoTopKeywordItem[]
  onViewAllTopPages?: () => void
  onViewAllTopKeywords?: () => void
}

export function SeoCharts({
  timeline,
  rankDistribution,
  topPages,
  topRankedKeywords,
  onViewAllTopPages,
  onViewAllTopKeywords,
}: SeoChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. LƯU LƯỢNG TRUY CẬP TỰ NHIÊN THEO THỜI GIAN */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Lưu lượng truy cập tự nhiên theo thời gian
          </h2>
          {/* Legends */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#007a48]" />
              <span className="text-slate-600 text-[11px]">Tổng truy cập</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-slate-600 text-[11px]">Từ khóa thương hiệu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-slate-600 text-[11px]">Từ khóa không thương hiệu</span>
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
                <linearGradient id="totalTrafficGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007a48" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#007a48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="totalTraffic"
                stroke="none"
                fill="url(#totalTrafficGlow)"
              />
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
                domain={[0, 120]}
                ticks={[0, 20, 40, 60, 80, 100, 120]}
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
                dataKey="totalTraffic"
                name="Tổng truy cập"
                stroke="#007a48"
                strokeWidth={2}
                dot={{ r: 3, fill: "#007a48" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="brandTraffic"
                name="Từ khóa thương hiệu"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0284c7" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="nonBrandTraffic"
                name="Từ khóa không thương hiệu"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. PHÂN BỔ THỨ HẠNG TỪ KHÓA */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Phân bổ thứ hạng từ khóa
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-[210px]">
          {/* Donut chart */}
          <div className="relative w-[150px] h-[150px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rankDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="percent"
                >
                  {rankDistribution.map((entry) => (
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
                8.620
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Tổng từ khóa
              </span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-1.5 flex-1 min-w-[170px]">
            {rankDistribution.map((item) => (
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
                  {item.countFormatted} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TOP TRANG ĐƯỢC TRUY CẬP TỰ NHIÊN */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Top trang được truy cập tự nhiên
          </h2>
          <button
            type="button"
            onClick={onViewAllTopPages}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem chi tiết</span>
            <span>→</span>
          </button>
        </div>

        {/* Progress List */}
        <div className="space-y-2.5 my-auto py-1">
          {topPages.map((page) => (
            <div key={page.id} className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2 w-32 shrink-0">
                <span className="text-slate-400 font-semibold w-3 text-center">{page.order}</span>
                <span className="font-medium text-slate-700 truncate">{page.pageTitle}</span>
              </div>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${page.percent * 2.5}%`,
                    backgroundColor: page.color,
                  }}
                />
              </div>
              <span className="text-slate-600 font-medium text-[11px] min-w-[75px] text-right">
                {page.visits}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TỪ KHÓA CÓ THỨ HẠNG CAO NHẤT */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Từ khóa có thứ hạng cao nhất
          </h2>
          <button
            type="button"
            onClick={onViewAllTopKeywords}
            className="text-[11px] font-semibold text-[#007a48] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        {/* Mini Table */}
        <div className="overflow-x-auto my-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-medium">
                <th className="py-1.5 px-1 font-medium w-6">#</th>
                <th className="py-1.5 px-2 font-medium">Từ khóa</th>
                <th className="py-1.5 px-2 font-medium text-center">Vị trí</th>
                <th className="py-1.5 px-2 font-medium text-right">Lượt tìm kiếm/tháng</th>
                <th className="py-1.5 px-1 font-medium text-center">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {topRankedKeywords.map((kw) => (
                <tr key={kw.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2 px-1 text-slate-400 font-semibold">{kw.order}</td>
                  <td className="py-2 px-2 font-medium text-slate-800">{kw.keyword}</td>
                  <td className="py-2 px-2 text-center font-bold text-slate-800">{kw.position}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{kw.monthlySearches}</td>
                  <td className="py-2 px-1 text-center">
                    <span className="inline-flex items-center text-emerald-600 font-bold">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
