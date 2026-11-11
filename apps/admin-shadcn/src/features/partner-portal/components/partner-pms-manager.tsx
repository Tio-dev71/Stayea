"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  AlertTriangle,
  ArrowRightLeft,
  BarChart3,
  Bed,
  BedDouble,
  Calendar,
  Check,
  Clock,
  DoorClosed,
  DoorOpen,
  Filter,
  Layers,
  LogOut,
  Package,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  User,
  UserCheck,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "motion/react"
import { PageTransition } from "@/components/animations/page-transition"
import { useStayeaRealtime } from "@/lib/stayea-realtime"
import {
  stayeaApi,
  type PmsRoom,
  type PmsRoomType,
  type PmsReservation,
  type PmsFolioDetails,
  type PmsServiceItem,
  type PmsInventoryTransaction,
  type PmsOperationalReports,
} from "@/lib/stayea-api-service"
import type { PartnerProfileData } from "../types"

interface PartnerPmsManagerProps {
  profile: PartnerProfileData | null
}

type PmsSubTab = "rack" | "reservations" | "inventory" | "reports" | "setup"

export function PartnerPmsManager({ profile }: PartnerPmsManagerProps) {
  const partnerId = profile?.id

  // Sub-tabs navigation
  const [currentSubTab, setCurrentSubTab] = useState<PmsSubTab>("rack")
  const [isLoading, setIsLoading] = useState(false)

  // Core Data
  const [rooms, setRooms] = useState<PmsRoom[]>([])
  const [roomTypes, setRoomTypes] = useState<PmsRoomType[]>([])
  const [reservations, setReservations] = useState<PmsReservation[]>([])
  const [serviceItems, setServiceItems] = useState<PmsServiceItem[]>([])
  const [inventoryTransactions, setInventoryTransactions] = useState<PmsInventoryTransaction[]>([])
  const [reports, setReports] = useState<PmsOperationalReports | null>(null)

  // Filters for Rack
  const [floorFilter, setFloorFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Modals state
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false)
  const [isStayFolioModalOpen, setIsStayFolioModalOpen] = useState(false)
  const [activeReservationId, setActiveReservationId] = useState<string | null>(null)
  const [activeFolioDetails, setActiveFolioDetails] = useState<PmsFolioDetails | null>(null)
  const [isFolioLoading, setIsFolioLoading] = useState(false)

  // Setup Modals
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false)
  const [isNewRoomTypeModalOpen, setIsNewRoomTypeModalOpen] = useState(false)
  const [isNewServiceItemModalOpen, setIsNewServiceItemModalOpen] = useState(false)
  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] = useState(false)
  const [stockAdjustItem, setStockAdjustItem] = useState<PmsServiceItem | null>(null)

  // Initial Fetch
  const loadPmsData = useCallback(async () => {
    if (!partnerId) return
    setIsLoading(true)
    try {
      const [rTypes, rList, resList, sItems, rep, itx] = await Promise.all([
        stayeaApi.getPmsRoomTypes(partnerId),
        stayeaApi.getPmsRooms(partnerId),
        stayeaApi.getPmsReservations(partnerId),
        stayeaApi.getPmsServiceItems(partnerId),
        stayeaApi.getPmsOperationalReports(partnerId),
        stayeaApi.getPmsInventoryTransactions(partnerId, undefined, 20),
      ])
      setRoomTypes(rTypes)
      setRooms(rList)
      setReservations(resList)
      setServiceItems(sItems)
      setReports(rep)
      setInventoryTransactions(itx)
    } catch (err: any) {
      toast.error(err.message || "Không thể tải dữ liệu PMS")
    } finally {
      setIsLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    loadPmsData()
  }, [loadPmsData])

  // Load Folio Details
  const handleOpenStayFolio = async (reservationId: string) => {
    setActiveReservationId(reservationId)
    setIsStayFolioModalOpen(true)
    setIsFolioLoading(true)
    try {
      const details = await stayeaApi.getPmsFolio(reservationId, partnerId)
      setActiveFolioDetails(details)
    } catch (err: any) {
      toast.error(err.message || "Không thể tải chi tiết hóa đơn lưu trú")
      setIsStayFolioModalOpen(false)
    } finally {
      setIsFolioLoading(false)
    }
  }

  // Refresh Single Folio
  const refreshActiveFolio = async () => {
    if (!activeReservationId) return
    try {
      const details = await stayeaApi.getPmsFolio(activeReservationId, partnerId)
      setActiveFolioDetails(details)
      loadPmsData()
    } catch {}
  }

  // Realtime zero-F5 sync for PMS Room Rack, Folio and Stock
  useStayeaRealtime(partnerId ? `partner:${partnerId}` : null, {
    "pms:room:updated": () => {
      loadPmsData()
    },
    "pms:reservation:created": (data) => {
      loadPmsData()
      toast.info(
        `🛎️ Đặt phòng mới: #${data?.reservationCode || ""}`,
        { description: `Khách: ${data?.guestName || "Khách"} • Phòng đã giữ chỗ` }
      )
    },
    "pms:reservation:updated": () => {
      loadPmsData()
      if (activeReservationId) {
        refreshActiveFolio()
      }
    },
    "pms:folio:updated": () => {
      loadPmsData()
      if (activeReservationId) {
        refreshActiveFolio()
      }
    },
    "pms:stock:updated": () => {
      loadPmsData()
    },
  })

  // Quick Action: Mark room as cleaned
  const handleMarkRoomClean = async (room: PmsRoom) => {
    try {
      await stayeaApi.updatePmsRoomStatus(
        room.id,
        {
          housekeepingStatus: "clean",
          status: "vacant_clean",
          note: "Đã dọn sạch buồng phòng bởi lễ tân/housekeeping",
        },
        partnerId
      )
      toast.success(`Phòng ${room.roomNumber} đã dọn sạch sẵn sàng đón khách!`)
      loadPmsData()
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật trạng thái phòng")
    }
  }

  // Quick Action: Direct check-in for reserved room
  const handleCheckInReserved = async (room: PmsRoom) => {
    const res = reservations.find(
      (r) => r.roomId === room.id && r.status === "confirmed"
    )
    if (!res) {
      toast.error("Không tìm thấy đặt phòng tương ứng")
      return
    }
    try {
      await stayeaApi.checkInPmsReservation(res.id, { roomId: room.id }, partnerId)
      toast.success(`Nhận phòng thành công cho khách ${res.guestName}!`)
      loadPmsData()
    } catch (err: any) {
      toast.error(err.message || "Nhận phòng thất bại")
    }
  }

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (floorFilter !== "all" && r.floor !== floorFilter) return false
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchNum = r.roomNumber.toLowerCase().includes(q)
        const matchType = (r.roomTypeName || "").toLowerCase().includes(q)
        return matchNum || matchType
      }
      return true
    })
  }, [rooms, floorFilter, statusFilter, searchQuery])

  // Unique floors
  const floors = useMemo(() => {
    const set = new Set(rooms.map((r) => r.floor).filter(Boolean))
    return Array.from(set).sort()
  }, [rooms])

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <BedDouble className="w-3.5 h-3.5" />
              <span>Hệ Thống Vận Hành Khách Sạn &amp; Homestay (PMS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{profile?.businessName || "Cơ Sở Đối Tác"}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold">
                {rooms.length} phòng
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Quản lý rack phòng trực quan, nhận/trả phòng nhanh tại quầy, bán minibar tự trừ kho và tất toán Folio an toàn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadPmsData}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Đồng bộ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewReservationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Đặt Phòng / Nhận Phòng Quầy</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        {reports && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-5 pt-5 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Tỷ Lệ Lấp Đầy</span>
              <span className="text-lg font-extrabold text-slate-800">
                {reports.roomsSummary.occupancyRate}%
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Đang Có Khách</span>
              <span className="text-lg font-extrabold text-rose-600">
                {reports.roomsSummary.occupiedRooms} / {reports.roomsSummary.totalRooms}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Trống Sạch Sẵn Sàng</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {reports.roomsSummary.vacantClean}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Phòng Cần Dọn</span>
              <span className="text-lg font-extrabold text-amber-600">
                {reports.roomsSummary.vacantDirty}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Đến / Đi Hôm Nay</span>
              <span className="text-lg font-extrabold text-sky-700">
                {reports.todayOperations.arrivalsToday} / {reports.todayOperations.departuresToday}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Doanh Thu Đã Thu</span>
              <span className="text-base font-extrabold text-emerald-700 truncate block">
                {Number(reports.financialSummary.totalCollected || 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Tabs Selector with Smooth Sliding Indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "rack" as const, label: "Sơ Đồ Phòng (Rack Grid)", icon: <DoorClosed className="w-3.5 h-3.5" /> },
            { id: "reservations" as const, label: `Danh Sách Đặt Phòng (${reservations.length})`, icon: <Calendar className="w-3.5 h-3.5" /> },
            {
              id: "inventory" as const,
              label: `Minibar & Kho Hàng (${serviceItems.length})`,
              icon: <Package className="w-3.5 h-3.5" />,
              hasAlert: Boolean(reports?.lowStockItems && reports.lowStockItems.length > 0),
            },
            { id: "reports" as const, label: "Báo Cáo Vận Hành", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: "setup" as const, label: "Cài Đặt Phòng & Hạng", icon: <Layers className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = currentSubTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentSubTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pmsSubTabPill"
                    className="absolute inset-0 rounded-xl bg-emerald-600 shadow-xs"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.hasAlert && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-Tabs Content Animated Container */}
      <PageTransition transitionKey={currentSubTab}>
        {/* ------------------------------------------------------------- */}
        {/* SUB-TAB 1: ROOM RACK (SƠ ĐỒ PHÒNG TRỰC QUAN)                   */}
        {/* ------------------------------------------------------------- */}
        {currentSubTab === "rack" && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2 font-medium">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lọc:</span>
              </div>

              {/* Floor Filter */}
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả tầng</option>
                {floors.map((f) => (
                  <option key={f} value={f}>
                    Tầng {f}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="vacant_clean">Trống sạch (Sẵn sàng)</option>
                <option value="vacant_dirty">Cần dọn (Chưa dọn)</option>
                <option value="occupied">Đang có khách</option>
                <option value="reserved">Đã đặt trước</option>
                <option value="maintenance">Đang bảo trì</option>
              </select>
            </div>

            {/* Room Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm số phòng hoặc loại phòng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-600 px-1">
            <span className="font-semibold text-slate-500">Chú thích màu:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs" />
              <span>Trống sạch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs" />
              <span>Cần dọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-2xs" />
              <span>Đang ở (Occupied)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-2xs" />
              <span>Đã đặt (Reserved)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400 shadow-2xs" />
              <span>Bảo trì</span>
            </div>
          </div>

          {/* Room Cards Grid */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-xs">
              <DoorOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                {rooms.length === 0
                  ? "Chưa có phòng nào được tạo trong cơ sở này."
                  : "Không tìm thấy phòng nào phù hợp với bộ lọc."}
              </p>
              {rooms.length === 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewRoomTypeModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Hạng Phòng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewRoomModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Phòng Mới</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {filteredRooms.map((room) => {
                // Find active in-house reservation if occupied
                const activeRes = reservations.find(
                  (r) => r.roomId === room.id && r.status === "checked_in"
                )
                const reservedRes = reservations.find(
                  (r) => r.roomId === room.id && r.status === "confirmed"
                )

                // Color configuration
                let cardBg = "bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md ring-1 ring-emerald-100/80"
                let statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200"
                let statusText = "Trống sạch"

                if (room.status === "vacant_dirty") {
                  cardBg = "bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:shadow-md ring-1 ring-amber-100/80"
                  statusBadge = "bg-amber-100/80 text-amber-900 border-amber-300"
                  statusText = "Cần dọn"
                } else if (room.status === "occupied") {
                  cardBg = "bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-md ring-1 ring-rose-100/80"
                  statusBadge = "bg-rose-100 text-rose-800 border-rose-300"
                  statusText = "Đang ở"
                } else if (room.status === "reserved") {
                  cardBg = "bg-blue-50/50 border-blue-200 hover:border-blue-400 hover:shadow-md ring-1 ring-blue-100/80"
                  statusBadge = "bg-blue-100 text-blue-800 border-blue-300"
                  statusText = "Đã đặt"
                } else if (room.status === "maintenance") {
                  cardBg = "bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs"
                  statusBadge = "bg-slate-200 text-slate-700 border-slate-300"
                  statusText = "Bảo trì"
                }

                return (
                  <div
                    key={room.id}
                    className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between shadow-xs ${cardBg}`}
                  >
                    <div>
                      {/* Room Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-slate-900 tracking-tight">
                              {room.roomNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-medium">
                              T{room.floor}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium line-clamp-1 mt-0.5">
                            {room.roomTypeName || "Hạng tiêu chuẩn"}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusBadge}`}
                        >
                          {statusText}
                        </span>
                      </div>

                      {/* Guest / Reservation Info */}
                      {room.status === "occupied" && activeRes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-white border border-rose-200 text-xs shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                            <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="truncate">{activeRes.guestName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                            <span>SĐT: {activeRes.guestPhone}</span>
                            <span>{activeRes.guestCount} khách</span>
                          </div>
                          <div className="text-[11px] text-rose-700 font-bold mt-1 flex justify-between">
                            <span>Dư nợ Folio:</span>
                            <span>{Number(activeRes.folioRemaining || 0).toLocaleString("vi-VN")} ₫</span>
                          </div>
                        </div>
                      )}

                      {room.status === "reserved" && reservedRes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-white border border-blue-200 text-xs shadow-2xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{reservedRes.guestName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Đến: {new Date(reservedRes.expectedCheckIn).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      )}

                      {room.status === "vacant_clean" && (
                        <div className="mt-3 p-2 text-xs text-emerald-800 font-medium">
                          <span>Giá cơ bản: {Number(room.basePrice || 0).toLocaleString("vi-VN")} ₫ / đêm</span>
                        </div>
                      )}

                      {room.status === "vacant_dirty" && (
                        <div className="mt-3 p-2 text-xs text-amber-800 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Buồng phòng cần dọn dẹp</span>
                        </div>
                      )}
                    </div>

                    {/* Room Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-1.5">
                      {room.status === "occupied" && activeRes && (
                        <button
                          type="button"
                          onClick={() => handleOpenStayFolio(activeRes.id)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Folio & Trả Phòng</span>
                        </button>
                      )}

                      {room.status === "vacant_dirty" && (
                        <button
                          type="button"
                          onClick={() => handleMarkRoomClean(room)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Báo Đã Dọn Sạch</span>
                        </button>
                      )}

                      {room.status === "reserved" && reservedRes && (
                        <button
                          type="button"
                          onClick={() => handleCheckInReserved(room)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Nhận Phòng Ngay</span>
                        </button>
                      )}

                      {room.status === "vacant_clean" && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewReservationModalOpen(true)
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Xếp Khách Mới</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: RESERVATIONS LIST                                  */}
      {/* ------------------------------------------------------------- */}
      {currentSubTab === "reservations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Nhật Ký Đặt Phòng & Lưu Trú</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsNewReservationModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo Lượt Đặt Phòng</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3">Mã & Kênh</th>
                  <th className="px-4 py-3">Phòng</th>
                  <th className="px-4 py-3">Khách Hàng</th>
                  <th className="px-4 py-3">Thời Gian Lưu Trú</th>
                  <th className="px-4 py-3">Giá & Tiền Cọc</th>
                  <th className="px-4 py-3">Trạng Thái</th>
                  <th className="px-4 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Chưa có lượt đặt phòng nào
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => {
                    let statusBadge = "bg-slate-100 text-slate-600 border border-slate-200"
                    let statusLabel: string = res.status
                    if (res.status === "confirmed") {
                      statusBadge = "bg-blue-50 text-blue-800 border border-blue-200 font-semibold"
                      statusLabel = "Đã xác nhận"
                    } else if (res.status === "checked_in") {
                      statusBadge = "bg-rose-50 text-rose-800 border border-rose-200 font-bold"
                      statusLabel = "Đang ở"
                    } else if (res.status === "checked_out") {
                      statusBadge = "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                      statusLabel = "Đã trả phòng"
                    } else if (res.status === "cancelled") {
                      statusBadge = "bg-slate-100 text-slate-500 border border-slate-200"
                      statusLabel = "Đã hủy"
                    }

                    return (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-slate-900 block">
                            {res.reservationCode}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {res.channel === "direct_walkin"
                              ? "Vãng lai tại quầy"
                              : res.channel === "stayea_marketplace"
                              ? "Đặt qua Stayea"
                              : res.channel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-extrabold text-emerald-800 text-sm block">
                            P.{res.roomNumber || "Chưa gán"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {res.roomTypeName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">
                            {res.guestName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {res.guestPhone} • {res.guestCount} khách
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <div className="font-medium text-slate-800">Vào: {new Date(res.expectedCheckIn).toLocaleString("vi-VN")}</div>
                          <div className="text-slate-500">
                            Ra: {new Date(res.expectedCheckOut).toLocaleString("vi-VN")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">
                            {Number(res.roomRate).toLocaleString("vi-VN")} ₫
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            Cọc: {Number(res.depositAmount || 0).toLocaleString("vi-VN")} ₫
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusBadge}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status === "confirmed" && (
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await stayeaApi.checkInPmsReservation(res.id, {}, partnerId)
                                    toast.success("Check-in thành công!")
                                    loadPmsData()
                                  } catch (e: any) {
                                    toast.error(e.message)
                                  }
                                }}
                                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-2xs"
                              >
                                Check-in
                              </button>
                            )}

                            {(res.status === "checked_in" || res.status === "checked_out") && (
                              <button
                                type="button"
                                onClick={() => handleOpenStayFolio(res.id)}
                                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 transition-colors"
                              >
                                <Receipt className="w-3 h-3 text-emerald-700" />
                                <span>Folio</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Inventory Transactions Log */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              Lịch Sử Xuất Nhập & Điều Chỉnh Kho Gần Nhất ({inventoryTransactions.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Thời Gian</th>
                    <th className="px-4 py-2.5">Mặt Hàng</th>
                    <th className="px-4 py-2.5">Nghiệp Vụ</th>
                    <th className="px-4 py-2.5">Số Lượng</th>
                    <th className="px-4 py-2.5">Tồn Sau</th>
                    <th className="px-4 py-2.5">Lý Do / Chứng Từ</th>
                    <th className="px-4 py-2.5">Người Thực Hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-400">
                        Chưa có lịch sử giao dịch kho
                      </td>
                    </tr>
                  ) : (
                    inventoryTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2.5 text-[11px] text-slate-500">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-900">
                          {tx.itemName || "Sản phẩm"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              tx.transactionType === "in"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : tx.transactionType === "out_sale"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {tx.transactionType === "in"
                              ? "Nhập kho"
                              : tx.transactionType === "out_sale"
                              ? "Bán minibar"
                              : "Điều chỉnh"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-900">
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono">
                          {tx.newStock}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {tx.reason}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-[11px]">
                          {tx.performedBy}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: MINIBAR & INVENTORY (KHO & BÁN HÀNG)                */}
      {/* ------------------------------------------------------------- */}
      {currentSubTab === "inventory" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <span>Danh Mục Sản Phẩm Minibar, Dịch Vụ & Tồn Kho</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khi lễ tân ghi nước uống hoặc đồ ăn vào phòng khách, tồn kho sẽ tự động khấu trừ theo thời gian thực.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStockAdjustItem(null)
                  setIsStockAdjustmentModalOpen(true)
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nhập / Điều Chỉnh Kho</span>
              </button>
              <button
                type="button"
                onClick={() => setIsNewServiceItemModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Mặt Hàng Mới</span>
              </button>
            </div>
          </div>

          {/* Low stock alerts if any */}
          {reports?.lowStockItems && reports.lowStockItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Cảnh báo tồn kho thấp: </span>
                Có {reports.lowStockItems.length} mặt hàng sắp hết hàng trong quầy minibar:{" "}
                {reports.lowStockItems.map((i) => `${i.name} (còn ${i.currentStock} ${i.unit})`).join(", ")}
              </div>
            </div>
          )}

          {/* Minibar Catalog Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3">Mã & Mặt Hàng</th>
                  <th className="px-4 py-3">Phân Loại</th>
                  <th className="px-4 py-3">Đơn Vị</th>
                  <th className="px-4 py-3">Giá Vốn</th>
                  <th className="px-4 py-3">Giá Bán</th>
                  <th className="px-4 py-3">Tồn Kho Hiện Tại</th>
                  <th className="px-4 py-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Chưa có mặt hàng dịch vụ/minibar nào. Hãy bấm &quot;Thêm Mặt Hàng Mới&quot; để thiết lập.
                    </td>
                  </tr>
                ) : (
                  serviceItems.map((item) => {
                    const isLow = item.trackInventory && item.currentStock <= item.minStockAlert
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">{item.code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200">
                            {item.category === "minibar_drink"
                              ? "Nước giải khát"
                              : item.category === "minibar_food"
                              ? "Đồ ăn nhẹ"
                              : item.category === "laundry"
                              ? "Giặt ủi"
                              : item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.unit}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {Number(item.costPrice || 0).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-800">
                          {Number(item.sellingPrice).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-3">
                          {item.trackInventory ? (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-xs border ${
                                isLow
                                  ? "bg-rose-50 text-rose-800 border-rose-300"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
                              }`}
                            >
                              {item.currentStock} {item.unit} {isLow && "(Sắp hết)"}
                            </span>
                          ) : (
                            <span className="text-slate-400">Không theo dõi tồn</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setStockAdjustItem(item)
                              setIsStockAdjustmentModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200 font-semibold transition-colors"
                          >
                            Nhập kho
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Inventory Transactions Log */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              Lịch Sử Xuất Nhập & Điều Chỉnh Kho Gần Nhất ({inventoryTransactions.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Thời Gian</th>
                    <th className="px-4 py-2.5">Mặt Hàng</th>
                    <th className="px-4 py-2.5">Nghiệp Vụ</th>
                    <th className="px-4 py-2.5">Số Lượng</th>
                    <th className="px-4 py-2.5">Tồn Sau</th>
                    <th className="px-4 py-2.5">Lý Do / Chứng Từ</th>
                    <th className="px-4 py-2.5">Người Thực Hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-400">
                        Chưa có lịch sử giao dịch kho
                      </td>
                    </tr>
                  ) : (
                    inventoryTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2.5 text-[11px] text-slate-500">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-900">
                          {tx.itemName || "Sản phẩm"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              tx.transactionType === "in"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : tx.transactionType === "out_sale"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {tx.transactionType === "in"
                              ? "Nhập kho"
                              : tx.transactionType === "out_sale"
                              ? "Bán minibar"
                              : "Điều chỉnh"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-900">
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono">
                          {tx.newStock}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {tx.reason}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-[11px]">
                          {tx.performedBy}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 4: OPERATIONAL REPORTS                                */}
      {/* ------------------------------------------------------------- */}
      {currentSubTab === "reports" && reports && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <span>Báo Cáo Hoạt Động & Tài Chính Cơ Sở Lưu Trú</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Cập nhật tức thời: {new Date().toLocaleTimeString("vi-VN")}
            </span>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block mb-1">
                Doanh Thu Tiền Phòng
              </span>
              <span className="text-2xl font-black text-slate-900">
                {Number(reports.financialSummary.totalRoomRevenue).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Tổng doanh số các lượt phòng đã ở và đặt
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block mb-1">
                Doanh Thu Dịch Vụ Minibar & Khác
              </span>
              <span className="text-2xl font-black text-emerald-800">
                {Number(reports.financialSummary.totalServiceRevenue).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Doanh thu nước ngọt, đồ ăn vặt, giặt ủi...
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block mb-1">
                Công Nợ Khách Chưa Thanh Toán
              </span>
              <span className="text-2xl font-black text-rose-700">
                {Number(reports.financialSummary.totalReceivables).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-500 mt-2">
                Số dư folio còn phải thu khi khách làm thủ tục checkout
              </p>
            </div>
          </div>

          {/* Room Rack Status Stats */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Cơ Cấu Tình Trạng Buồng Phòng
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block mb-0.5">Tổng số phòng</span>
                <span className="text-xl font-black text-slate-900">
                  {reports.roomsSummary.totalRooms}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-xs text-rose-800 font-medium block mb-0.5">Đang có khách ở</span>
                <span className="text-xl font-black text-rose-700">
                  {reports.roomsSummary.occupiedRooms}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-emerald-800 font-medium block mb-0.5">Trống sạch sẵn sàng</span>
                <span className="text-xl font-black text-emerald-800">
                  {reports.roomsSummary.vacantClean}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs text-amber-800 font-medium block mb-0.5">Cần dọn dẹp</span>
                <span className="text-xl font-black text-amber-800">
                  {reports.roomsSummary.vacantDirty}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-center">
                <span className="text-xs text-slate-600 font-medium block mb-0.5">Đang bảo trì</span>
                <span className="text-xl font-black text-slate-700">
                  {reports.roomsSummary.maintenance}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 5: SETUP ROOM TYPES & ROOMS                           */}
      {/* ------------------------------------------------------------- */}
      {currentSubTab === "setup" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Types Column */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-emerald-700" />
                <span>Hạng Phòng ({roomTypes.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsNewRoomTypeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
              >
                + Thêm Hạng Phòng
              </button>
            </div>

            <div className="space-y-2.5">
              {roomTypes.map((rt) => (
                <div
                  key={rt.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{rt.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      Mã: {rt.code} • Sức chứa: {rt.maxOccupancy} khách
                    </span>
                  </div>
                  <span className="font-black text-emerald-800 text-sm">
                    {Number(rt.basePrice).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Rooms Column */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DoorClosed className="w-4 h-4 text-emerald-700" />
                <span>Phòng Vật Lý ({rooms.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsNewRoomModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
              >
                + Thêm Phòng Vật Lý
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rooms.map((rm) => (
                <div
                  key={rm.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-base">
                      {rm.roomNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">T{rm.floor}</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-semibold truncate mt-1">
                    {rm.roomTypeName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </PageTransition>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: NEW RESERVATION / WALK-IN                            */}
      {/* ------------------------------------------------------------- */}
      {isNewReservationModalOpen && (
        <CreateReservationModal
          partnerId={partnerId || ""}
          roomTypes={roomTypes}
          rooms={rooms}
          onClose={() => setIsNewReservationModalOpen(false)}
          onSuccess={() => {
            setIsNewReservationModalOpen(false)
            loadPmsData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: STAY DETAILS & FOLIO MANAGER                         */}
      {/* ------------------------------------------------------------- */}
      {isStayFolioModalOpen && activeFolioDetails && (
        <StayFolioModal
          partnerId={partnerId || ""}
          details={activeFolioDetails}
          serviceItems={serviceItems}
          availableRooms={rooms.filter((r) => r.status === "vacant_clean")}
          onClose={() => {
            setIsStayFolioModalOpen(false)
            setActiveFolioDetails(null)
          }}
          onRefresh={refreshActiveFolio}
          isLoading={isFolioLoading}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: NEW ROOM TYPE MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {isNewRoomTypeModalOpen && (
        <CreateRoomTypeModal
          partnerId={partnerId || ""}
          onClose={() => setIsNewRoomTypeModalOpen(false)}
          onSuccess={() => {
            setIsNewRoomTypeModalOpen(false)
            loadPmsData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: NEW ROOM MODAL                                       */}
      {/* ------------------------------------------------------------- */}
      {isNewRoomModalOpen && (
        <CreateRoomModal
          partnerId={partnerId || ""}
          roomTypes={roomTypes}
          onClose={() => setIsNewRoomModalOpen(false)}
          onSuccess={() => {
            setIsNewRoomModalOpen(false)
            loadPmsData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: NEW MINIBAR ITEM MODAL                               */}
      {/* ------------------------------------------------------------- */}
      {isNewServiceItemModalOpen && (
        <CreateServiceItemModal
          partnerId={partnerId || ""}
          onClose={() => setIsNewServiceItemModalOpen(false)}
          onSuccess={() => {
            setIsNewServiceItemModalOpen(false)
            loadPmsData()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 6: STOCK ADJUSTMENT MODAL                               */}
      {/* ------------------------------------------------------------- */}
      {isStockAdjustmentModalOpen && (
        <StockAdjustmentModal
          partnerId={partnerId || ""}
          serviceItems={serviceItems}
          preselectedItem={stockAdjustItem}
          onClose={() => {
            setIsStockAdjustmentModalOpen(false)
            setStockAdjustItem(null)
          }}
          onSuccess={() => {
            setIsStockAdjustmentModalOpen(false)
            setStockAdjustItem(null)
            loadPmsData()
          }}
        />
      )}
    </div>
  )
}

// =====================================================================
// SUB-MODAL: TẠO ĐẶT PHÒNG / NHẬN PHÒNG QUẦY (WALK-IN)
// =====================================================================
function CreateReservationModal({
  partnerId,
  roomTypes,
  rooms,
  onClose,
  onSuccess,
}: {
  partnerId: string
  roomTypes: PmsRoomType[]
  rooms: PmsRoom[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id || "")
  const [roomId, setRoomId] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestIdNumber, setGuestIdNumber] = useState("")
  const [guestCount, setGuestCount] = useState(2)

  // Default dates: now to tomorrow 12:00
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const [checkInDate, setCheckInDate] = useState(now.toISOString().slice(0, 16))
  const [checkOutDate, setCheckOutDate] = useState(tomorrow.toISOString().slice(0, 16))

  const selectedType = roomTypes.find((t) => t.id === roomTypeId)
  const [roomRate, setRoomRate] = useState<number>(Number(selectedType?.basePrice || 800000))
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [depositMethod, setDepositMethod] = useState<"cash" | "bank_transfer" | "credit_card">("cash")
  const [isCheckInImmediately, setIsCheckInImmediately] = useState(true)
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter available rooms for selected room type
  const availableRooms = rooms.filter(
    (r) => r.roomTypeId === roomTypeId && r.status === "vacant_clean"
  )

  useEffect(() => {
    if (selectedType) {
      setRoomRate(Number(selectedType.basePrice || 0))
    }
  }, [selectedType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName || !guestPhone) {
      toast.error("Vui lòng nhập tên và số điện thoại khách hàng")
      return
    }
    if (isCheckInImmediately && !roomId) {
      toast.error("Vui lòng chọn phòng cụ thể để nhận phòng ngay")
      return
    }

    setIsSubmitting(true)
    try {
      await stayeaApi.createPmsReservation(
        {
          roomTypeId,
          roomId: roomId || undefined,
          channel: "direct_walkin",
          guestName,
          guestPhone,
          guestIdNumber: guestIdNumber || undefined,
          guestCount: Number(guestCount),
          expectedCheckIn: new Date(checkInDate).toISOString(),
          expectedCheckOut: new Date(checkOutDate).toISOString(),
          roomRate: Number(roomRate),
          depositAmount: Number(depositAmount),
          depositPaymentMethod: depositAmount > 0 ? depositMethod : undefined,
          isCheckInImmediately,
          specialRequests: specialRequests || undefined,
        },
        partnerId
      )
      toast.success(
        isCheckInImmediately
          ? `Nhận phòng thành công cho khách ${guestName}!`
          : `Tạo đặt phòng thành công!`
      )
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo lượt đặt phòng")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-800 no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-emerald-700" />
          <span>Đặt Phòng & Nhận Phòng Quầy (Walk-in)</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Room Type & Room Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Hạng Phòng <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => {
                  setRoomTypeId(e.target.value)
                  setRoomId("")
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({Number(t.basePrice).toLocaleString("vi-VN")} ₫)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Số Phòng Gán <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              >
                <option value="">-- Chọn phòng trống sạch --</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Phòng {r.roomNumber} (Tầng {r.floor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Họ và Tên Khách <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn Tuấn"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Số Điện Thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0912345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Số CCCD / Hộ Chiếu
              </label>
              <input
                type="text"
                placeholder="079090001234"
                value={guestIdNumber}
                onChange={(e) => setGuestIdNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Số Lượng Khách
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Thời Gian Đến (Check-in)
              </label>
              <input
                type="datetime-local"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Thời Gian Đi (Check-out)
              </label>
              <input
                type="datetime-local"
                required
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Rate & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Giá Phòng Mỗi Đêm (₫)
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={roomRate}
                onChange={(e) => setRoomRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tiền Đặt Cọc Trước (₫)
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {depositAmount > 0 && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Phương Thức Đặt Cọc
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDepositMethod("cash")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "cash"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Tiền mặt
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMethod("bank_transfer")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "bank_transfer"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Chuyển khoản QR
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMethod("credit_card")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "credit_card"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Thẻ POS
                </button>
              </div>
            </div>
          )}

          {/* Immediate Check-In Toggle */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-900 block">
                Nhận phòng ngay tại quầy
              </span>
              <span className="text-[11px] text-slate-600">
                Chuyển phòng sang trạng thái đang ở và tạo Folio hóa đơn tức thì.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isCheckInImmediately}
              onChange={(e) => setIsCheckInImmediately(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Ghi Chú & Yêu Cầu Đặc Biệt
            </label>
            <input
              type="text"
              placeholder="Yêu cầu tầng cao, thêm gối, xuất hóa đơn công ty..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận Đặt Phòng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// =====================================================================
// SUB-MODAL: CHI TIẾT LƯU TRÚ, HÓA ĐƠN FOLIO, MINIBAR & CHECK-OUT
// =====================================================================
function StayFolioModal({
  partnerId,
  details,
  serviceItems,
  availableRooms,
  onClose,
  onRefresh,
  isLoading,
}: {
  partnerId: string
  details: PmsFolioDetails
  serviceItems: PmsServiceItem[]
  availableRooms: PmsRoom[]
  onClose: () => void
  onRefresh: () => void
  isLoading?: boolean
}) {
  const { folio, items, payments, reservation } = details
  const [activeTab, setActiveTab] = useState<"folio" | "add_service" | "transfer" | "checkout">("folio")

  // Add Service Form
  const [selectedItemId, setSelectedItemId] = useState(serviceItems[0]?.id || "")
  const [serviceQuantity, setServiceQuantity] = useState(1)
  const [serviceNote, setServiceNote] = useState("")
  const [isSubmittingService, setIsSubmittingService] = useState(false)

  // Room Transfer Form
  const [targetRoomId, setTargetRoomId] = useState(availableRooms[0]?.id || "")
  const [transferReason, setTransferReason] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  // Checkout Form
  const [lateCheckoutFee, setLateCheckoutFee] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<"cash" | "bank_transfer" | "credit_card">("cash")
  const [checkoutNote, setCheckoutNote] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Add Payment Form
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [payAmount, setPayAmount] = useState<number>(Number(folio.remainingBalance))
  const [payMethod, setPayMethod] = useState<"cash" | "bank_transfer" | "credit_card">("cash")

  // Cancel item prompt
  const handleCancelItem = async (itemId: string) => {
    const reason = window.prompt("Nhập lý do hủy dòng phí (Audit Log):", "Nhập nhầm phòng")
    if (!reason || !reason.trim()) return
    try {
      await stayeaApi.cancelPmsFolioItem(itemId, reason.trim(), partnerId)
      toast.success("Đã hủy dòng phí và hoàn lại tồn kho!")
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || "Không thể hủy dòng phí")
    }
  }

  // Handle Post Minibar / Service
  const handlePostService = async (e: React.FormEvent) => {
    e.preventDefault()
    const item = serviceItems.find((i) => i.id === selectedItemId)
    if (!item) return
    setIsSubmittingService(true)
    try {
      await stayeaApi.postPmsFolioItem(
        reservation.id,
        {
          serviceItemId: item.id,
          description: `${serviceQuantity}x ${item.name}`,
          quantity: Number(serviceQuantity),
          unitPrice: Number(item.sellingPrice),
          itemType: "minibar",
          note: serviceNote || undefined,
        },
        partnerId
      )
      toast.success(`Đã thêm ${item.name} vào hóa đơn phòng ${reservation.roomNumber}!`)
      setServiceQuantity(1)
      setServiceNote("")
      setActiveTab("folio")
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || "Không thể ghi nhận dịch vụ")
    } finally {
      setIsSubmittingService(false)
    }
  }

  // Handle Room Transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRoomId || !transferReason.trim()) {
      toast.error("Vui lòng chọn phòng đích và nhập lý do chuyển phòng")
      return
    }
    setIsTransferring(true)
    try {
      await stayeaApi.transferPmsRoom(
        reservation.id,
        { targetRoomId, reason: transferReason.trim() },
        partnerId
      )
      toast.success("Chuyển phòng thành công! Phòng cũ đã chuyển sang trạng thái cần dọn.")
      onRefresh()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Chuyển phòng thất bại")
    } finally {
      setIsTransferring(false)
    }
  }

  // Handle Checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCheckingOut(true)
    try {
      const remainingToPay = Math.max(
        0,
        Number(folio.remainingBalance) + Number(lateCheckoutFee) - Number(discountAmount)
      )
      await stayeaApi.checkOutPmsReservation(
        reservation.id,
        {
          lateCheckoutFee: Number(lateCheckoutFee),
          discountAmount: Number(discountAmount),
          paymentMethod: checkoutPaymentMethod,
          paymentAmount: remainingToPay,
          note: checkoutNote || "Tất toán trả phòng tại quầy",
        },
        partnerId
      )
      toast.success(`Trả phòng P.${reservation.roomNumber} thành công! Phòng đã chuyển sang cần dọn.`)
      onRefresh()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Trả phòng thất bại")
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Handle Record Intermediate Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await stayeaApi.recordPmsFolioPayment(
        folio.id,
        {
          amount: Number(payAmount),
          paymentMethod: payMethod,
          note: "Thanh toán từng phần tại quầy",
        },
        partnerId
      )
      toast.success("Ghi nhận thanh toán thành công!")
      setIsAddingPayment(false)
      onRefresh()
    } catch (err: any) {
      toast.error(err.message || "Không thể ghi nhận thanh toán")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-2xl text-slate-800 no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">
                Phòng {reservation.roomNumber}
              </span>
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200">
                {reservation.status === "checked_in" ? "Đang lưu trú" : "Đã trả phòng"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Khách: <strong className="text-slate-900">{reservation.guestName}</strong> • SĐT:{" "}
              {reservation.guestPhone} • CCCD: {reservation.guestIdNumber || "N/A"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Số Hồ Sơ Folio:</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">
              #{folio.folioNumber}
            </span>
          </div>
        </div>

        {/* Sub-Tabs inside Modal */}
        <div className="flex flex-wrap gap-2 my-4 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("folio")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "folio"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Hóa Đơn Folio & Dịch Vụ
          </button>
          {reservation.status === "checked_in" && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("add_service")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === "add_service"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                + Thêm Minibar / Dịch Vụ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transfer")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === "transfer"
                    ? "bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Đổi Phòng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checkout")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === "checkout"
                    ? "bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs font-extrabold"
                    : "bg-slate-50 border border-slate-200 text-rose-700 hover:bg-rose-50"
                }`}
              >
                Trả Phòng & Tất Toán
              </button>
            </>
          )}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* TAB 1: FOLIO SUMMARY & ITEMS TABLE                          */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "folio" && (
          <div className="space-y-5">
            {/* Financial Summary Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Tiền Phòng</span>
                <span className="text-base font-extrabold text-slate-900">
                  {Number(folio.roomCharges).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-medium block mb-0.5">Minibar & Dịch Vụ</span>
                <span className="text-base font-extrabold text-emerald-800">
                  {Number(folio.serviceCharges).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[11px] text-blue-800 font-medium block mb-0.5">Đã Thanh Toán</span>
                <span className="text-base font-extrabold text-blue-800">
                  {Number(folio.paidAmount).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] text-rose-800 block font-bold mb-0.5">CÒN PHẢI THU</span>
                <span className="text-base font-black text-rose-700">
                  {Number(folio.remainingBalance).toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>

            {/* Folio Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Chi Tiết Các Dòng Phí Trong Folio ({items.length})
                </h4>
                {reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("add_service")}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    + Thêm Dịch Vụ Phát Sinh
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-3.5 py-2.5">Thời Gian</th>
                      <th className="px-3.5 py-2.5">Dịch Vụ / Mặt Hàng</th>
                      <th className="px-3.5 py-2.5">Số Lượng</th>
                      <th className="px-3.5 py-2.5">Đơn Giá</th>
                      <th className="px-3.5 py-2.5">Thành Tiền</th>
                      <th className="px-3.5 py-2.5">Người Ghi</th>
                      <th className="px-3.5 py-2.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-400">
                          Chưa có phát sinh chi phí nào
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr
                          key={it.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            it.isCancelled ? "opacity-50 line-through bg-rose-50/30" : ""
                          }`}
                        >
                          <td className="px-3.5 py-2.5 text-[11px] text-slate-500">
                            {new Date(it.recordedAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {it.description}
                            {it.isCancelled && (
                              <span className="block text-[10px] text-rose-600 no-underline font-semibold mt-0.5">
                                [ĐÃ HỦY: {it.cancellationReason}]
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5">{Number(it.quantity)}</td>
                          <td className="px-3.5 py-2.5 text-slate-600">
                            {Number(it.unitPrice).toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-emerald-800">
                            {Number(it.amount).toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-3.5 py-2.5 text-[11px] text-slate-500">
                            {it.recordedBy}
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            {!it.isCancelled && reservation.status === "checked_in" && (
                              <button
                                type="button"
                                onClick={() => handleCancelItem(it.id)}
                                className="px-2 py-0.5 rounded text-[11px] text-rose-600 hover:bg-rose-50 font-semibold"
                                title="Hủy dòng phí có lý do"
                              >
                                Hủy dòng
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Lịch Sử Các Khoản Đã Thu ({payments.length})
                </h4>
                {Number(folio.remainingBalance) > 0 && reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => setIsAddingPayment(true)}
                    className="text-xs text-blue-700 hover:text-blue-800 font-bold"
                  >
                    + Thu Thêm Tiền Mặt / QR
                  </button>
                )}
              </div>

              {isAddingPayment && (
                <form
                  onSubmit={handleRecordPayment}
                  className="p-3.5 mb-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-end gap-3"
                >
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Số tiền thu (₫)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Phương thức</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-900"
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="bank_transfer">Chuyển khoản QR</option>
                      <option value="credit_card">Thẻ POS</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-2xs"
                  >
                    Lưu Khoản Thu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingPayment(false)}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Hủy
                  </button>
                </form>
              )}

              <div className="space-y-1.5">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">
                        +{Number(p.amount).toLocaleString("vi-VN")} ₫
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {p.paymentMethod === "cash"
                          ? "Tiền mặt"
                          : p.paymentMethod === "bank_transfer"
                          ? "Chuyển khoản QR"
                          : "Thẻ"}
                        {p.isDeposit && " (Tiền đặt cọc)"} • Bởi {p.recordedBy}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(p.recordedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 2: ADD MINIBAR / SERVICE                                */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "add_service" && (
          <form onSubmit={handlePostService} className="space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-700" />
              <span>Ghi Nhận Đồ Uống Minibar / Dịch Vụ Cho Phòng {reservation.roomNumber}</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Chọn Mặt Hàng Dịch Vụ
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              >
                {serviceItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({Number(item.sellingPrice).toLocaleString("vi-VN")} ₫) -{" "}
                    {item.trackInventory ? `Tồn kho: ${item.currentStock} ${item.unit}` : "Không tính tồn"}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số Lượng</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={serviceQuantity}
                  onChange={(e) => setServiceQuantity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Khách lấy lúc 21h..."
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900">
              * Khi nhấn xác nhận, hệ thống sẽ tự động trừ số lượng mặt hàng trong kho cơ sở và cộng phí vào Folio phòng.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isSubmittingService}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all"
              >
                {isSubmittingService ? "Đang ghi..." : "Ghi Nhận & Khấu Trừ Kho"}
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 3: TRANSFER ROOM                                        */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "transfer" && (
          <form onSubmit={handleTransfer} className="space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
              <span>Chuyển Khách Sang Phòng Khác (Room Transfer)</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Chọn Phòng Mới (Chỉ hiển thị phòng trống sạch)
              </label>
              <select
                value={targetRoomId}
                onChange={(e) => setTargetRoomId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              >
                {availableRooms.length === 0 ? (
                  <option value="">Không có phòng trống sạch nào khác</option>
                ) : (
                  availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.roomNumber} - Tầng {r.floor} ({r.roomTypeName})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Lý Do Đổi Phòng (Bắt buộc lưu Audit Log)
              </label>
              <input
                type="text"
                required
                placeholder="Điều hòa hỏng, khách muốn đổi view, khách nâng hạng..."
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              * Phòng cũ ({reservation.roomNumber}) sẽ tự động chuyển sang trạng thái <strong>Cần dọn (Vacant Dirty)</strong> để bộ phận buồng phòng nắm được.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isTransferring || availableRooms.length === 0}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs transition-all"
              >
                {isTransferring ? "Đang chuyển..." : "Xác Nhận Đổi Phòng"}
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* TAB 4: CHECKOUT & SETTLEMENT                                */}
        {/* ----------------------------------------------------------- */}
        {activeTab === "checkout" && (
          <form onSubmit={handleCheckout} className="space-y-4 text-xs">
            <h4 className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Thủ Tục Trả Phòng & Tất Toán Folio (Check-out)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Phụ Thu Trả Phòng Muộn (Nếu có)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={lateCheckoutFee}
                  onChange={(e) => setLateCheckoutFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Giảm Trừ / Chiết Khấu (Nếu có)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Calculated Final Balance */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-rose-900 block font-bold">
                  SỐ TIỀN CẦN THU NỐT CỦA KHÁCH:
                </span>
                <span className="text-[11px] text-slate-500">
                  (Dư nợ hiện tại + Phụ thu - Giảm giá)
                </span>
              </div>
              <span className="text-2xl font-black text-rose-700">
                {Math.max(
                  0,
                  Number(folio.remainingBalance) + Number(lateCheckoutFee) - Number(discountAmount)
                ).toLocaleString("vi-VN")}{" "}
                ₫
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Phương Thức Thu Tiền Số Dư Cuối
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("cash")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    checkoutPaymentMethod === "cash"
                      ? "bg-rose-50 border-rose-300 text-rose-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Tiền mặt
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("bank_transfer")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    checkoutPaymentMethod === "bank_transfer"
                      ? "bg-rose-50 border-rose-300 text-rose-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Chuyển khoản QR
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("credit_card")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    checkoutPaymentMethod === "credit_card"
                      ? "bg-rose-50 border-rose-300 text-rose-800 shadow-2xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Thẻ POS
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ghi Chú Checkout</label>
              <input
                type="text"
                placeholder="Khách khen dịch vụ tốt, đã hoàn trả thẻ phòng..."
                value={checkoutNote}
                onChange={(e) => setCheckoutNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isCheckingOut}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs transition-all flex items-center gap-2"
              >
                {isCheckingOut ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Xác Nhận Thu Tiền & Trả Phòng</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// =====================================================================
// SUB-MODAL: TẠO HẠNG PHÒNG MỚI
// =====================================================================
function CreateRoomTypeModal({
  partnerId,
  onClose,
  onSuccess,
}: {
  partnerId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [basePrice, setBasePrice] = useState(800000)
  const [maxOccupancy, setMaxOccupancy] = useState(2)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await stayeaApi.createPmsRoomType(
        {
          name,
          code: code.toUpperCase(),
          basePrice: Number(basePrice),
          maxOccupancy: Number(maxOccupancy),
          description,
        },
        partnerId
      )
      toast.success("Tạo hạng phòng thành công!")
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Tạo hạng phòng thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800">
        <h3 className="text-base font-bold text-slate-900 mb-4">Tạo Hạng Phòng Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tên Hạng Phòng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Phòng Deluxe Ban Công"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mã Viết Tắt</label>
            <input
              type="text"
              required
              placeholder="DLX-BC"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Giá Cơ Bản (₫)</label>
              <input
                type="number"
                min={0}
                step={50000}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số Khách Tối Đa</label>
              <input
                type="number"
                min={1}
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mô Tả</label>
            <input
              type="text"
              placeholder="View đẹp, bồn tắm nằm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Hạng Phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// =====================================================================
// SUB-MODAL: TẠO PHÒNG VẬT LÝ MỚI
// =====================================================================
function CreateRoomModal({
  partnerId,
  roomTypes,
  onClose,
  onSuccess,
}: {
  partnerId: string
  roomTypes: PmsRoomType[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id || "")
  const [roomNumber, setRoomNumber] = useState("")
  const [floor, setFloor] = useState("1")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await stayeaApi.createPmsRoom(
        {
          roomTypeId,
          roomNumber,
          floor,
          status: "vacant_clean",
        },
        partnerId
      )
      toast.success(`Đã thêm phòng ${roomNumber}!`)
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Tạo phòng thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800">
        <h3 className="text-base font-bold text-slate-900 mb-4">Thêm Phòng Vật Lý Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Thuộc Hạng Phòng</label>
            <select
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            >
              {roomTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số Phòng</label>
              <input
                type="text"
                required
                placeholder="101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tầng</label>
              <input
                type="text"
                required
                placeholder="1"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// =====================================================================
// SUB-MODAL: TẠO MẶT HÀNG MINIBAR MỚI
// =====================================================================
function CreateServiceItemModal({
  partnerId,
  onClose,
  onSuccess,
}: {
  partnerId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [category, setCategory] = useState<"minibar_drink" | "minibar_food" | "laundry" | "fnb" | "spa">("minibar_drink")
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [unit, setUnit] = useState("chai")
  const [sellingPrice, setSellingPrice] = useState(25000)
  const [costPrice, setCostPrice] = useState(10000)
  const [trackInventory, setTrackInventory] = useState(true)
  const [currentStock, setCurrentStock] = useState(24)
  const [minStockAlert, setMinStockAlert] = useState(6)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await stayeaApi.createPmsServiceItem(
        {
          category,
          name,
          code: code.toUpperCase(),
          unit,
          sellingPrice: Number(sellingPrice),
          costPrice: Number(costPrice),
          trackInventory,
          currentStock: trackInventory ? Number(currentStock) : 0,
          minStockAlert: trackInventory ? Number(minStockAlert) : 0,
        },
        partnerId
      )
      toast.success("Thêm mặt hàng minibar thành công!")
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Thêm mặt hàng thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800">
        <h3 className="text-base font-bold text-slate-900 mb-4">Thêm Mặt Hàng Dịch Vụ / Minibar</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phân Loại</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            >
              <option value="minibar_drink">Đồ uống / Nước giải khát</option>
              <option value="minibar_food">Đồ ăn vặt / Mì ly</option>
              <option value="laundry">Giặt ủi</option>
              <option value="fnb">Ăn uống nhà hàng</option>
              <option value="spa">Spa / Trị liệu</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tên Mặt Hàng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nước ngọt Coca Cola 320ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã Viết Tắt</label>
              <input
                type="text"
                required
                placeholder="COCA-320"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Đơn Vị Tính</label>
              <input
                type="text"
                required
                placeholder="lon / chai / gói"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Giá Bán Cho Khách (₫)</label>
              <input
                type="number"
                min={0}
                step={5000}
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Giá Vốn Nhập (₫)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
            <span>Theo dõi số lượng tồn kho</span>
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(e) => setTrackInventory(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </div>
          {trackInventory && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tồn Kho Ban Đầu</label>
                <input
                  type="number"
                  min={0}
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Báo Động Hết (Ngưỡng)</label>
                <input
                  type="number"
                  min={0}
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Mặt Hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// =====================================================================
// SUB-MODAL: NHẬP KHO / ĐIỀU CHỈNH TỒN KHO
// =====================================================================
function StockAdjustmentModal({
  partnerId,
  serviceItems,
  preselectedItem,
  onClose,
  onSuccess,
}: {
  partnerId: string
  serviceItems: PmsServiceItem[]
  preselectedItem: PmsServiceItem | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [itemId, setItemId] = useState(preselectedItem?.id || serviceItems[0]?.id || "")
  const [transactionType, setTransactionType] = useState<"in" | "out_loss" | "adjustment">("in")
  const [quantity, setQuantity] = useState(24)
  const [reason, setReason] = useState("Nhập hàng từ nhà cung cấp")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedItem = serviceItems.find((i) => i.id === itemId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemId || quantity <= 0) {
      toast.error("Vui lòng chọn mặt hàng và nhập số lượng hợp lệ")
      return
    }
    setIsSubmitting(true)
    try {
      await stayeaApi.adjustPmsStock(
        {
          itemId,
          transactionType,
          quantity: Number(quantity),
          reason,
        },
        partnerId
      )
      toast.success("Cập nhật tồn kho thành công!")
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Cập nhật kho thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800">
        <h3 className="text-base font-bold text-slate-900 mb-4">Nhập Kho & Điều Chỉnh Tồn</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mặt Hàng</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            >
              {serviceItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} (Hiện có: {i.currentStock} {i.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Loại Nghiệp Vụ</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            >
              <option value="in">Nhập kho thêm (+)</option>
              <option value="out_loss">Xuất hao hụt / hỏng vỡ (-)</option>
              <option value="adjustment">Điều chỉnh kiểm kê thực tế</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Số Lượng ({selectedItem?.unit || "đơn vị"})
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-800 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Lý Do / Chứng Từ</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all"
            >
              {isSubmitting ? "Đang lưu..." : "Xác Nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
