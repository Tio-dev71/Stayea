"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import {
  MOCK_MARKETING_KPIS,
  MOCK_MARKETING_TIMELINE,
  MOCK_MARKETING_CHANNELS,
  MOCK_MARKETING_ORDERS_BY_CHANNEL,
  MOCK_MARKETING_CONVERSION_FUNNEL,
  MOCK_TOP_MARKETING_CAMPAIGNS,
} from "./stayea-admin-marketing-mock-data"
import type { MarketingCampaignItem } from "./stayea-admin-marketing-mock-data"
import { MarketingHeader } from "./components/marketing-header"
import { MarketingKpiCards } from "./components/marketing-kpi-cards"
import { MarketingCategoryTabs } from "./components/marketing-category-tabs"
import { MarketingCharts } from "./components/marketing-charts"
import { MarketingCampaignsTable } from "./components/marketing-campaigns-table"
import { MarketingRightSidebar } from "./components/marketing-right-sidebar"
import { CreateCampaignModal } from "./components/create-campaign-modal"
import { AdvancedFilterModal } from "./components/advanced-filter-modal"
import { ExportMarketingModal } from "./components/export-marketing-modal"
import { StayeaAdminCampaignsPage } from "./stayea-admin-campaigns-page"
import { StayeaAdminChannelsPage } from "./stayea-admin-channels-page"
import { StayeaAdminContentPage } from "./stayea-admin-content-page"
import { StayeaAdminAdsPage } from "./stayea-admin-ads-page"
import { StayeaAdminEmailPage } from "./stayea-admin-email-page"
import { StayeaAdminSeoPage } from "./stayea-admin-seo-page"

function getInitialCategoryTab(): string {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes("seo")) return "seo";
    if (hash.includes("email")) return "email-marketing";
    if (hash.includes("quang-cao") || hash.includes("ads")) return "quang-cao";
    if (hash.includes("noi-dung") || hash.includes("content")) return "noi-dung";
    if (hash.includes("kenh-marketing") || hash.includes("channel")) return "kenh-marketing";
    if (hash.includes("chien-dich") || hash.includes("campaign")) return "chien-dich";
  }
  return "tong-quan";
}

interface StayeaAdminMarketingPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminMarketingPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminMarketingPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateRange, setDateRange] = useState("01/06/2024 - 31/08/2024")
  const [comparisonPeriod, setComparisonPeriod] = useState("3 tháng trước")
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(getInitialCategoryTab)

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [initialModalStep, setInitialModalStep] = useState(1)

  // Check URL hash on load for auto-open create modal or steps
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const handleHashChange = () => {
        const hash = window.location.hash.toLowerCase()
        if (hash.includes("chien-dich") || hash.includes("campaign")) {
          setActiveCategoryTab("chien-dich")
        } else if (hash.includes("kenh-marketing") || hash.includes("channel")) {
          setActiveCategoryTab("kenh-marketing")
        } else if (hash.includes("noi-dung") || hash.includes("content")) {
          setActiveCategoryTab("noi-dung")
        } else if (hash.includes("quang-cao") || hash.includes("ads")) {
          setActiveCategoryTab("quang-cao")
        } else if (hash.includes("seo")) {
          setActiveCategoryTab("seo")
        } else if (hash.includes("email")) {
          setActiveCategoryTab("email-marketing")
        } else if (hash === "#marketing" || hash === "#admin-marketing") {
          setActiveCategoryTab("tong-quan")
        }
      }
      handleHashChange()
      window.addEventListener("hashchange", handleHashChange)
      const hash = window.location.hash.toLowerCase()
      if (
        hash.includes("step5") ||
        hash.includes("step-5") ||
        hash.includes("xem-truoc") ||
        hash.includes("xuat-ban") ||
        hash.includes("publish")
      ) {
        setInitialModalStep(5)
        setIsCreateModalOpen(true)
      } else if (
        hash.includes("step4") ||
        hash.includes("step-4") ||
        hash.includes("lich-trinh") ||
        hash.includes("schedule")
      ) {
        setInitialModalStep(4)
        setIsCreateModalOpen(true)
      } else if (
        hash.includes("step3") ||
        hash.includes("step-3") ||
        hash.includes("doi-tuong") ||
        hash.includes("ngan-sach")
      ) {
        setInitialModalStep(3)
        setIsCreateModalOpen(true)
      } else if (
        hash.includes("step2") ||
        hash.includes("step-2") ||
        hash.includes("noi-dung") ||
        hash.includes("kenh")
      ) {
        setInitialModalStep(2)
        setIsCreateModalOpen(true)
      } else if (
        hash.includes("create") ||
        hash.includes("tao-chien-dich") ||
        hash.includes("new-campaign")
      ) {
        setInitialModalStep(1)
        setIsCreateModalOpen(true)
      }
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const handleExport = (options: {
    format: "xlsx" | "pdf" | "csv"
    timeframe: string
  }) => {
    toast.success("Xuất báo cáo thành công!", {
      description: `Đã kết xuất báo cáo Marketing định dạng .${options.format.toUpperCase()} cho kỳ ${options.timeframe}.`,
    })
  }

  const handleCreateCampaign = (newCamp: {
    title: string
    subtitle: string
    channel: string
    channelType: string
    startDate: string
    endDate: string
    budget: number
  }) => {
    toast.success("Tạo chiến dịch mới thành công!", {
      description: `Chiến dịch "${newCamp.title}" trên kênh ${newCamp.channel} đã được kích hoạt.`,
    })
    setIsCreateModalOpen(false)
  }

  const handleCampaignAction = (campaign: MarketingCampaignItem, action: string) => {
    switch (action) {
      case "view":
        toast.info(`Chi tiết chiến dịch "${campaign.title}"`, {
          description: `ROAS: ${campaign.roas} | Tiếp cận: ${campaign.reachFormatted} | Đặt phòng: ${campaign.ordersCount}`,
        })
        break
      case "edit":
        toast.info(`Mở trình chỉnh sửa chiến dịch "${campaign.title}"`)
        setIsCreateModalOpen(true)
        break
      case "pause":
        toast.warning(`Đã tạm dừng chiến dịch "${campaign.title}"`)
        break
      case "resume":
        toast.success(`Đã tiếp tục chạy chiến dịch "${campaign.title}"`)
        break
      case "delete":
        toast.error(`Đã xoá chiến dịch "${campaign.title}"`)
        break
      default:
        toast.info(`Thao tác trên chiến dịch "${campaign.title}"`)
    }
  }

  if (activeCategoryTab === "chien-dich") {
    return (
      <StayeaAdminCampaignsPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchToOverview={() => setActiveCategoryTab("tong-quan")}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          window.location.hash = `#${tab}`
        }}
      />
    )
  }

  if (activeCategoryTab === "kenh-marketing") {
    return (
      <StayeaAdminChannelsPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          if (tab === "chien-dich") {
            window.location.hash = "#chien-dich"
          } else if (tab === "tong-quan") {
            window.location.hash = "#marketing"
          } else if (tab === "kenh-marketing") {
            window.location.hash = "#kenh-marketing"
          } else if (tab === "noi-dung") {
            window.location.hash = "#noi-dung"
          } else if (tab === "quang-cao") {
            window.location.hash = "#quang-cao"
          } else if (tab === "email-marketing" || tab === "email") {
            window.location.hash = "#email-marketing"
          } else if (tab === "seo") {
            window.location.hash = "#seo"
          }
        }}
      />
    )
  }



  if (activeCategoryTab === "seo") {
    return (
      <StayeaAdminSeoPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          if (tab === "chien-dich") {
            window.location.hash = "#chien-dich"
          } else if (tab === "tong-quan") {
            window.location.hash = "#marketing"
          } else if (tab === "kenh-marketing") {
            window.location.hash = "#kenh-marketing"
          } else if (tab === "noi-dung") {
            window.location.hash = "#noi-dung"
          } else if (tab === "quang-cao") {
            window.location.hash = "#quang-cao"
          } else if (tab === "email-marketing" || tab === "email") {
            window.location.hash = "#email-marketing"
          } else if (tab === "seo") {
            window.location.hash = "#seo"
          }
        }}
      />
    )
  }

  if (activeCategoryTab === "email-marketing" || activeCategoryTab === "email") {
    return (
      <StayeaAdminEmailPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          if (tab === "chien-dich") {
            window.location.hash = "#chien-dich"
          } else if (tab === "tong-quan") {
            window.location.hash = "#marketing"
          } else if (tab === "kenh-marketing") {
            window.location.hash = "#kenh-marketing"
          } else if (tab === "noi-dung") {
            window.location.hash = "#noi-dung"
          } else if (tab === "quang-cao") {
            window.location.hash = "#quang-cao"
          } else if (tab === "email-marketing" || tab === "email") {
            window.location.hash = "#email-marketing"
          } else if (tab === "seo") {
            window.location.hash = "#seo"
          }
        }}
      />
    )
  }

  if (activeCategoryTab === "quang-cao") {
    return (
      <StayeaAdminAdsPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          if (tab === "chien-dich") {
            window.location.hash = "#chien-dich"
          } else if (tab === "tong-quan") {
            window.location.hash = "#marketing"
          } else if (tab === "kenh-marketing") {
            window.location.hash = "#kenh-marketing"
          } else if (tab === "noi-dung") {
            window.location.hash = "#noi-dung"
          } else if (tab === "quang-cao") {
            window.location.hash = "#quang-cao"
          } else if (tab === "email-marketing" || tab === "email") {
            window.location.hash = "#email-marketing"
          } else if (tab === "seo") {
            window.location.hash = "#seo"
          }
        }}
      />
    )
  }

  if (activeCategoryTab === "noi-dung") {
    return (
      <StayeaAdminContentPage
        onNavigateLanding={onNavigateLanding}
        onNavigateTab={onNavigateTab}
        onSwitchCategoryTab={(tab) => {
          setActiveCategoryTab(tab)
          if (tab === "chien-dich") {
            window.location.hash = "#chien-dich"
          } else if (tab === "tong-quan") {
            window.location.hash = "#marketing"
          } else if (tab === "kenh-marketing") {
            window.location.hash = "#kenh-marketing"
          } else if (tab === "noi-dung") {
            window.location.hash = "#noi-dung"
          } else if (tab === "quang-cao") {
            window.location.hash = "#quang-cao"
          } else if (tab === "email-marketing" || tab === "email") {
            window.location.hash = "#email-marketing"
          } else if (tab === "seo") {
            window.location.hash = "#seo"
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* 1. Header Admin Stayea */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc dữ liệu báo cáo marketing...",
            })
          }
        }}
      />

      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* 2. Responsive Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <StayeaAdminSidebar
            activeTab="marketing"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={onNavigateTab}
            onExplorePhuQuoc={() => {
              window.location.hash = "phu-quoc"
              onNavigateLanding?.()
            }}
          />
        </div>

        {/* 3. Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-7 py-6">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {/* Top Page Header (Báo cáo Marketing + Filters + Actions) */}
            <MarketingHeader
              dateRange={dateRange}
              setDateRange={setDateRange}
              comparisonPeriod={comparisonPeriod}
              setComparisonPeriod={setComparisonPeriod}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />

            {/* Top KPI Cards (4 cards) */}
            <MarketingKpiCards items={MOCK_MARKETING_KPIS} />

            {/* 9 Category Tabs below KPI cards */}
            <MarketingCategoryTabs
              activeTab={activeCategoryTab}
              setActiveTab={(tab) => {
                setActiveCategoryTab(tab)
                if (tab === "tong-quan") {
                  toast.info("Đang hiển thị: Tổng quan báo cáo marketing")
                } else if (tab === "chien-dich") {
                  window.location.hash = "#chien-dich"
                } else if (tab === "kenh-marketing") {
                  window.location.hash = "#kenh-marketing"
                } else if (tab === "noi-dung") {
                  window.location.hash = "#noi-dung"
                } else if (tab === "quang-cao") {
                  window.location.hash = "#quang-cao"
                } else if (tab === "email-marketing" || tab === "email") {
                  window.location.hash = "#email-marketing"
                }
              }}
            />

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left Main Column (~73% on xl screens) */}
              <div className="xl:col-span-9 space-y-5">
                {/* 4 Charts: Row 1 (Timeline & Donut) + Row 2 (Bar Chart & Funnel) */}
                <MarketingCharts
                  timelineData={MOCK_MARKETING_TIMELINE}
                  channelData={MOCK_MARKETING_CHANNELS}
                  ordersByChannel={MOCK_MARKETING_ORDERS_BY_CHANNEL}
                  funnelStages={MOCK_MARKETING_CONVERSION_FUNNEL}
                  onViewChannelDetails={() => {
                    toast.info(
                      "Chi tiết 6 kênh: Facebook (38%), Google (24%), Instagram (18%), Email (8%), Zalo (7%), TikTok (5%)."
                    )
                  }}
                  onViewOrdersByChannelDetails={() => {
                    toast.info(
                      "Chi tiết lượt đặt theo kênh: Facebook dẫn đầu với 1.250 đơn, Google 980 đơn."
                    )
                  }}
                  onViewFunnelDetails={() => {
                    toast.info(
                      "Chi tiết phễu chuyển đổi: Tỷ lệ chuyển đổi chung từ Tiếp cận đến Đặt phòng đạt 1.5%."
                    )
                  }}
                />

                {/* Top Campaigns Table */}
                <MarketingCampaignsTable
                  campaigns={MOCK_TOP_MARKETING_CAMPAIGNS}
                  onViewAll={() => {
                    toast.info("Xem toàn bộ 24 chiến dịch marketing đang triển khai")
                  }}
                  onActionClick={handleCampaignAction}
                />
              </div>

              {/* Right Sidebar Column (~27% on xl screens) */}
              <div className="xl:col-span-3">
                <MarketingRightSidebar
                  onSelectReport={(reportId) => {
                    toast.info(`Mở báo cáo chuyên đề: ${reportId}`)
                  }}
                  onQuickActionClick={(actionKey) => {
                    if (actionKey === "create-campaign") {
                      setInitialModalStep(1)
                      setIsCreateModalOpen(true)
                    } else if (actionKey === "export-report") {
                      setIsExportModalOpen(true)
                    } else if (actionKey === "manage-ads") {
                      toast.info("Mở trình quản lý quảng cáo đa kênh")
                    } else if (actionKey === "schedule-content") {
                      toast.info("Mở lịch biên tập & xuất bản nội dung")
                    }
                  }}
                  onExportReport={() => setIsExportModalOpen(true)}
                />
              </div>
            </div>

            {/* Footer Admin Stayea */}
            <div className="pt-4">
              <StayeaAdminFooter />
            </div>
          </div>
        </main>
      </div>

      {/* 4. Modals */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
        initialStep={initialModalStep}
      />

      <AdvancedFilterModal
        isOpen={isAdvancedFilterOpen}
        onClose={() => setIsAdvancedFilterOpen(false)}
        onApply={() => {
          toast.success("Đã áp dụng bộ lọc nâng cao!")
        }}
      />

      <ExportMarketingModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  )
}
