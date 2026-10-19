"use client"

import {
  Navigation,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { MOCK_CHANNEL_PAGE_KPIS } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"
import type { ChannelPageKpi } from "@/features/admin-marketing/stayea-admin-marketing-mock-data"

interface ChannelsKpiCardsProps {
  items?: ChannelPageKpi[]
  onKpiClick?: (id: string) => void
}

export function ChannelsKpiCards({
  items = MOCK_CHANNEL_PAGE_KPIS,
  onKpiClick,
}: ChannelsKpiCardsProps) {
  const getIconConfig = (type: ChannelPageKpi["iconType"]) => {
    switch (type) {
      case "pointer":
        return {
          icon: Navigation,
          bg: "bg-emerald-50",
          text: "text-[#007a48]",
        }
      case "users":
        return {
          icon: Users,
          bg: "bg-amber-50",
          text: "text-amber-600",
        }
      case "cart":
        return {
          icon: ShoppingCart,
          bg: "bg-sky-50",
          text: "text-sky-600",
        }
      case "revenue":
        return {
          icon: DollarSign,
          bg: "bg-emerald-50",
          text: "text-emerald-600",
        }
      case "roas":
        return {
          icon: BarChart3,
          bg: "bg-amber-50",
          text: "text-amber-600",
        }
      default:
        return {
          icon: TrendingUp,
          bg: "bg-slate-50",
          text: "text-slate-600",
        }
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {items.map((kpi) => {
        const { icon: IconComp, bg, text } = getIconConfig(kpi.iconType)

        return (
          <div
            key={kpi.id}
            onClick={() => onKpiClick?.(kpi.id)}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex items-center gap-3.5"
          >
            {/* Left Circular Icon Badge */}
            <div
              className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${bg} ${text}`}
            >
              <IconComp className="w-5 h-5" />
            </div>

            {/* Right Details */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 truncate">
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {kpi.value}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span className="font-semibold">{kpi.trend}</span>
                <span className="text-slate-400 truncate font-normal">
                  {kpi.comparisonText}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
