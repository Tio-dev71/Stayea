"use client"

import { Coins, Bed, Palmtree, Gift, Percent, ArrowRight } from "lucide-react"
import { STAYEA_CLUB_POINTS_HISTORY } from "@/features/landing/data/stayea-mock-data"
import type { StayeaClubPointsTransaction } from "@/features/landing/data/stayea-mock-data"

interface StayeaClubPointsHistoryProps {
  readonly onViewAllHistory?: () => void
}

function renderActivityIcon(type: StayeaClubPointsTransaction["iconType"]) {
  const className = "w-4 h-4 text-slate-500 shrink-0"
  switch (type) {
    case "bed":
      return <Bed className={className} />
    case "palmtree":
      return <Palmtree className={className} />
    case "gift":
      return <Gift className={className} />
    case "percent":
      return <Percent className={className} />
    default:
      return <Coins className={className} />
  }
}

export function StayeaClubPointsHistory({ onViewAllHistory }: StayeaClubPointsHistoryProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2 text-[#0A2239]">
            <Coins className="w-5 h-5 text-[#1E40AF]" />
            <h3 className="text-base font-bold text-[#0A2239]">
              Lịch sử tích điểm
            </h3>
          </div>

          <button
            type="button"
            onClick={onViewAllHistory}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table Content */}
        {STAYEA_CLUB_POINTS_HISTORY.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Coins className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-semibold text-slate-600">Chưa có giao dịch tích điểm nào</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Điểm thưởng sẽ tự động tích lũy khi bạn hoàn tất các chuyến đi và dịch vụ trên STAYEA.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-100">
                  <th className="pb-2.5 font-medium">Ngày</th>
                  <th className="pb-2.5 font-medium pl-2">Hoạt động</th>
                  <th className="pb-2.5 font-medium text-right">Điểm</th>
                  <th className="pb-2.5 font-medium text-right pr-1">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STAYEA_CLUB_POINTS_HISTORY.map((tx: StayeaClubPointsTransaction) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 pl-2 pr-3">
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <div className="p-1 rounded bg-slate-100">
                          {renderActivityIcon(tx.iconType)}
                        </div>
                        <span className="line-clamp-1">{tx.activity}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap font-bold">
                      <span className={tx.isPositive ? "text-emerald-600" : "text-rose-600"}>
                        {tx.points}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-1 text-slate-500 whitespace-nowrap">
                      {tx.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
