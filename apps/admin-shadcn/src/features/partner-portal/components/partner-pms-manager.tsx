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
  Sparkles,
  User,
  UserCheck,
  X,
} from "lucide-react"
import { toast } from "sonner"
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

  // Seed Demo PMS Data if property is brand new
  const handleSeedDemoData = async () => {
    if (!partnerId) return
    setIsLoading(true)
    try {
      // 1. Create Room Types
      const rt1 = await stayeaApi.createPmsRoomType(
        {
          name: "Phòng Standard Giường Đôi",
          code: "STD-DBL",
          basePrice: 650000,
          hourlyPrice: 120000,
          maxOccupancy: 2,
          maxAdults: 2,
          maxChildren: 1,
          amenities: ["Wifi", "Điều hòa", "Bình nóng lạnh", "Tủ lạnh"],
          description: "Phòng tiêu chuẩn ấm cúng",
        },
        partnerId
      )

      const rt2 = await stayeaApi.createPmsRoomType(
        {
          name: "Phòng Deluxe Hướng Biển",
          code: "DLX-SEA",
          basePrice: 1200000,
          hourlyPrice: 180000,
          maxOccupancy: 3,
          maxAdults: 2,
          maxChildren: 1,
          amenities: ["Ban công view biển", "Bồn tắm nằm", "Smart TV 55 inch", "Minibar cao cấp"],
          description: "Phòng cao cấp ngắm hoàng hôn",
        },
        partnerId
      )

      // 2. Create Rooms
      await Promise.all([
        stayeaApi.createPmsRoom({ roomTypeId: rt1.id, roomNumber: "101", floor: "1", status: "vacant_clean" }, partnerId),
        stayeaApi.createPmsRoom({ roomTypeId: rt1.id, roomNumber: "102", floor: "1", status: "vacant_dirty" }, partnerId),
        stayeaApi.createPmsRoom({ roomTypeId: rt1.id, roomNumber: "103", floor: "1", status: "vacant_clean" }, partnerId),
        stayeaApi.createPmsRoom({ roomTypeId: rt2.id, roomNumber: "201", floor: "2", status: "vacant_clean" }, partnerId),
        stayeaApi.createPmsRoom({ roomTypeId: rt2.id, roomNumber: "202", floor: "2", status: "vacant_clean" }, partnerId),
        stayeaApi.createPmsRoom({ roomTypeId: rt2.id, roomNumber: "203", floor: "2", status: "vacant_clean" }, partnerId),
      ])

      // 3. Create Minibar Items
      await Promise.all([
        stayeaApi.createPmsServiceItem({ category: "minibar_drink", name: "Nước suối Lavie 500ml", code: "LAV-500", unit: "chai", sellingPrice: 20000, costPrice: 6000, trackInventory: true, currentStock: 48, minStockAlert: 12 }, partnerId),
        stayeaApi.createPmsServiceItem({ category: "minibar_drink", name: "Bia Heineken Sleek 330ml", code: "HEI-330", unit: "lon", sellingPrice: 35000, costPrice: 16000, trackInventory: true, currentStock: 24, minStockAlert: 6 }, partnerId),
        stayeaApi.createPmsServiceItem({ category: "minibar_food", name: "Mì ly Omachi Bò Hầm", code: "OMA-CUP", unit: "ly", sellingPrice: 25000, costPrice: 11000, trackInventory: true, currentStock: 20, minStockAlert: 5 }, partnerId),
        stayeaApi.createPmsServiceItem({ category: "laundry", name: "Giặt sấy quần áo thường", code: "SRV-LAUNDRY", unit: "kg", sellingPrice: 40000, costPrice: 10000, trackInventory: false }, partnerId),
      ])

      // 4. Create one initial active stay in 201
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const res = await stayeaApi.createPmsReservation(
        {
          roomTypeId: rt2.id,
          roomId: (await stayeaApi.getPmsRooms(partnerId)).find((r) => r.roomNumber === "201")?.id,
          channel: "direct_walkin",
          guestName: "Trần Anh Tuấn",
          guestPhone: "0912345678",
          guestIdNumber: "079090001234",
          expectedCheckIn: now.toISOString(),
          expectedCheckOut: tomorrow.toISOString(),
          roomRate: 1200000,
          depositAmount: 500000,
          depositPaymentMethod: "bank_transfer",
          isCheckInImmediately: true,
          specialRequests: "Khách cần hóa đơn VAT",
        },
        partnerId
      )

      // Post 2 waters to room
      const allItems = await stayeaApi.getPmsServiceItems(partnerId)
      const water = allItems.find((i) => i.code === "LAV-500")
      if (water) {
        await stayeaApi.postPmsFolioItem(
          res.id,
          {
            serviceItemId: water.id,
            description: "2x Nước suối Lavie 500ml",
            quantity: 2,
            unitPrice: 20000,
            itemType: "minibar",
            note: "Khách lấy uống tối qua",
          },
          partnerId
        )
      }

      toast.success("Khởi tạo dữ liệu khách sạn mẫu hoàn tất! Bạn có thể thao tác ngay.")
      loadPmsData()
    } catch (err: any) {
      toast.error(err.message || "Khởi tạo dữ liệu mẫu thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-[#041c19] to-slate-900 border border-emerald-800/50 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <BedDouble className="w-3.5 h-3.5" />
              <span>Hệ Thống Vận Hành Khách Sạn & Homestay (PMS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{profile?.businessName || "Cơ Sở Đối Tác"}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-400 font-mono">
                {rooms.length} phòng
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Quản lý rack phòng trực quan, nhận/trả phòng nhanh tại quầy, bán minibar tự trừ kho và tất toán Folio an toàn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadPmsData}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Đồng bộ</span>
            </button>

            {rooms.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDemoData}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Nạp Dữ Liệu Mẫu PMS</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsNewReservationModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Đặt Phòng / Nhận Phòng Quầy</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Ribbon */}
        {reports && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-5 pt-5 border-t border-emerald-800/30">
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Tỷ Lệ Lấp Đầy</span>
              <span className="text-lg font-extrabold text-emerald-400">
                {reports.roomsSummary.occupancyRate}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Đang Có Khách</span>
              <span className="text-lg font-extrabold text-rose-400">
                {reports.roomsSummary.occupiedRooms} / {reports.roomsSummary.totalRooms}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Trống Sạch Sẵn Sàng</span>
              <span className="text-lg font-extrabold text-emerald-300">
                {reports.roomsSummary.vacantClean}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Phòng Cần Dọn</span>
              <span className="text-lg font-extrabold text-amber-400">
                {reports.roomsSummary.vacantDirty}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Đến / Đi Hôm Nay</span>
              <span className="text-lg font-extrabold text-blue-300">
                {reports.todayOperations.arrivalsToday} / {reports.todayOperations.departuresToday}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
              <span className="text-[11px] text-slate-400 block font-medium">Doanh Thu Đã Thu</span>
              <span className="text-base font-extrabold text-emerald-400 truncate block">
                {Number(reports.financialSummary.totalCollected || 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setCurrentSubTab("rack")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentSubTab === "rack"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <DoorClosed className="w-3.5 h-3.5" />
            <span>Sơ Đồ Phòng (Rack Grid)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSubTab("reservations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentSubTab === "reservations"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Danh Sách Đặt Phòng ({reservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSubTab("inventory")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentSubTab === "inventory"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Minibar & Kho Hàng ({serviceItems.length})</span>
            {reports?.lowStockItems && reports.lowStockItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentSubTab("reports")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentSubTab === "reports"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Báo Cáo Vận Hành</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSubTab("setup")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentSubTab === "setup"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "bg-slate-900/70 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cài Đặt Phòng & Hạng</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: ROOM RACK (SƠ ĐỒ PHÒNG TRỰC QUAN)                   */}
      {/* ------------------------------------------------------------- */}
      {currentSubTab === "rack" && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#041210] border border-emerald-900/40 p-3 rounded-xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lọc:</span>
              </div>

              {/* Floor Filter */}
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
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
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
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
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm số phòng hoặc loại phòng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 px-1">
            <span className="font-semibold text-slate-400">Chú thích màu:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Trống sạch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500" />
              <span>Cần dọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>Đang ở (Occupied)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span>Đã đặt (Reserved)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-600" />
              <span>Bảo trì</span>
            </div>
          </div>

          {/* Room Cards Grid */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-16 bg-[#041210] border border-emerald-900/30 rounded-2xl">
              <DoorOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">
                {rooms.length === 0
                  ? "Chưa có phòng nào được tạo trong cơ sở này."
                  : "Không tìm thấy phòng nào phù hợp với bộ lọc."}
              </p>
              {rooms.length === 0 && (
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSeedDemoData}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    Nạp Dữ Liệu Khách Sạn Mẫu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewRoomModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                  >
                    Tạo Phòng Mới Thủ Công
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
                let cardBg = "bg-emerald-950/20 border-emerald-600/40 hover:border-emerald-500"
                let statusBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                let statusText = "Trống sạch"

                if (room.status === "vacant_dirty") {
                  cardBg = "bg-amber-950/20 border-amber-600/40 hover:border-amber-500"
                  statusBadge = "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  statusText = "Cần dọn"
                } else if (room.status === "occupied") {
                  cardBg = "bg-rose-950/25 border-rose-600/50 hover:border-rose-400"
                  statusBadge = "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  statusText = "Đang ở"
                } else if (room.status === "reserved") {
                  cardBg = "bg-blue-950/25 border-blue-600/40 hover:border-blue-400"
                  statusBadge = "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  statusText = "Đã đặt"
                } else if (room.status === "maintenance") {
                  cardBg = "bg-slate-900 border-slate-700 hover:border-slate-600"
                  statusBadge = "bg-slate-700 text-slate-300 border-slate-600"
                  statusText = "Bảo trì"
                }

                return (
                  <div
                    key={room.id}
                    className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between shadow-lg ${cardBg}`}
                  >
                    <div>
                      {/* Room Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-white tracking-tight">
                              {room.roomNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              T{room.floor}
                            </span>
                          </div>
                          <span className="text-xs text-slate-300 font-medium line-clamp-1">
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
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-rose-900/30 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-100 truncate">
                            <User className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{activeRes.guestName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                            <span>SĐT: {activeRes.guestPhone}</span>
                            <span>{activeRes.guestCount} khách</span>
                          </div>
                          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex justify-between">
                            <span>Dư nợ Folio:</span>
                            <span>{Number(activeRes.folioRemaining || 0).toLocaleString("vi-VN")} ₫</span>
                          </div>
                        </div>
                      )}

                      {room.status === "reserved" && reservedRes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-blue-900/30 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-100 truncate">
                            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{reservedRes.guestName}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Đến: {new Date(reservedRes.expectedCheckIn).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      )}

                      {room.status === "vacant_clean" && (
                        <div className="mt-3 p-2 text-xs text-emerald-400/80">
                          <span>Giá cơ bản: {Number(room.basePrice || 0).toLocaleString("vi-VN")} ₫ / đêm</span>
                        </div>
                      )}

                      {room.status === "vacant_dirty" && (
                        <div className="mt-3 p-2 text-xs text-amber-400/90 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Buồng phòng cần dọn dẹp</span>
                        </div>
                      )}
                    </div>

                    {/* Room Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5">
                      {room.status === "occupied" && activeRes && (
                        <button
                          type="button"
                          onClick={() => handleOpenStayFolio(activeRes.id)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Folio & Trả Phòng</span>
                        </button>
                      )}

                      {room.status === "vacant_dirty" && (
                        <button
                          type="button"
                          onClick={() => handleMarkRoomClean(room)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Báo Đã Dọn Sạch</span>
                        </button>
                      )}

                      {room.status === "reserved" && reservedRes && (
                        <button
                          type="button"
                          onClick={() => handleCheckInReserved(room)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
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
                          className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Nhật Ký Đặt Phòng & Lưu Trú</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsNewReservationModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo Lượt Đặt Phòng</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-emerald-900/40 bg-[#041210]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#031d18] text-slate-300 uppercase text-[10px] tracking-wider border-b border-emerald-900/40">
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
              <tbody className="divide-y divide-emerald-950/60">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      Chưa có lượt đặt phòng nào
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => {
                    let statusBadge = "bg-slate-800 text-slate-300"
                    let statusLabel: string = res.status
                    if (res.status === "confirmed") {
                      statusBadge = "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      statusLabel = "Đã xác nhận"
                    } else if (res.status === "checked_in") {
                      statusBadge = "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold"
                      statusLabel = "Đang ở"
                    } else if (res.status === "checked_out") {
                      statusBadge = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      statusLabel = "Đã trả phòng"
                    } else if (res.status === "cancelled") {
                      statusBadge = "bg-rose-950 text-rose-400"
                      statusLabel = "Đã hủy"
                    }

                    return (
                      <tr key={res.id} className="hover:bg-emerald-950/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-white block">
                            {res.reservationCode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {res.channel === "direct_walkin"
                              ? "Vãng lai tại quầy"
                              : res.channel === "stayea_marketplace"
                              ? "Đặt qua Stayea"
                              : res.channel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-extrabold text-emerald-400 text-sm block">
                            P.{res.roomNumber || "Chưa gán"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {res.roomTypeName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white block">
                            {res.guestName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {res.guestPhone} • {res.guestCount} khách
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <div>Vào: {new Date(res.expectedCheckIn).toLocaleString("vi-VN")}</div>
                          <div className="text-slate-400">
                            Ra: {new Date(res.expectedCheckOut).toLocaleString("vi-VN")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-100 block">
                            {Number(res.roomRate).toLocaleString("vi-VN")} ₫
                          </span>
                          <span className="text-[10px] text-emerald-400">
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
                                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px]"
                              >
                                Check-in
                              </button>
                            )}

                            {(res.status === "checked_in" || res.status === "checked_out") && (
                              <button
                                type="button"
                                onClick={() => handleOpenStayFolio(res.id)}
                                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 flex items-center gap-1"
                              >
                                <Receipt className="w-3 h-3 text-emerald-400" />
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
          <div className="space-y-3 pt-4 border-t border-emerald-900/40">
            <h4 className="text-sm font-bold text-slate-200">
              Lịch Sử Xuất Nhập & Điều Chỉnh Kho Gần Nhất ({inventoryTransactions.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-emerald-900/40 bg-[#041210]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#031d18] text-slate-400 uppercase text-[10px] tracking-wider border-b border-emerald-900/40">
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
                <tbody className="divide-y divide-emerald-950/60">
                  {inventoryTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-500">
                        Chưa có lịch sử giao dịch kho
                      </td>
                    </tr>
                  ) : (
                    inventoryTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-emerald-950/30">
                        <td className="px-4 py-2.5 text-[11px] text-slate-400">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-white">
                          {tx.itemName || "Sản phẩm"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.transactionType === "in"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : tx.transactionType === "out_sale"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {tx.transactionType === "in"
                              ? "Nhập kho"
                              : tx.transactionType === "out_sale"
                              ? "Bán minibar"
                              : "Điều chỉnh"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold">
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-slate-300 font-mono">
                          {tx.newStock}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400">
                          {tx.reason}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 text-[11px]">
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
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Danh Mục Sản Phẩm Minibar, Dịch Vụ & Tồn Kho</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
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
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nhập / Điều Chỉnh Kho</span>
              </button>
              <button
                type="button"
                onClick={() => setIsNewServiceItemModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Mặt Hàng Mới</span>
              </button>
            </div>
          </div>

          {/* Low stock alerts if any */}
          {reports?.lowStockItems && reports.lowStockItems.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Cảnh báo tồn kho thấp: </span>
                Có {reports.lowStockItems.length} mặt hàng sắp hết hàng trong quầy minibar:{" "}
                {reports.lowStockItems.map((i) => `${i.name} (còn ${i.currentStock} ${i.unit})`).join(", ")}
              </div>
            </div>
          )}

          {/* Minibar Catalog Table */}
          <div className="overflow-x-auto rounded-2xl border border-emerald-900/40 bg-[#041210]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#031d18] text-slate-300 uppercase text-[10px] tracking-wider border-b border-emerald-900/40">
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
              <tbody className="divide-y divide-emerald-950/60">
                {serviceItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      Chưa có mặt hàng dịch vụ/minibar nào. Hãy bấm &quot;Thêm Mặt Hàng Mới&quot; để thiết lập.
                    </td>
                  </tr>
                ) : (
                  serviceItems.map((item) => {
                    const isLow = item.trackInventory && item.currentStock <= item.minStockAlert
                    return (
                      <tr key={item.id} className="hover:bg-emerald-950/30 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white block">{item.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{item.code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-emerald-300">
                            {item.category === "minibar_drink"
                              ? "Nước giải khát"
                              : item.category === "minibar_food"
                              ? "Đồ ăn nhẹ"
                              : item.category === "laundry"
                              ? "Giặt ủi"
                              : item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{item.unit}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {Number(item.costPrice || 0).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-3 font-semibold text-emerald-300">
                          {Number(item.sellingPrice).toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-4 py-3">
                          {item.trackInventory ? (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                                isLow
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {item.currentStock} {item.unit} {isLow && "(Sắp hết)"}
                            </span>
                          ) : (
                            <span className="text-slate-500">Không theo dõi tồn</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setStockAdjustItem(item)
                              setIsStockAdjustmentModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 font-medium"
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
          <div className="space-y-3 pt-4 border-t border-emerald-900/40">
            <h4 className="text-sm font-bold text-slate-200">
              Lịch Sử Xuất Nhập & Điều Chỉnh Kho Gần Nhất ({inventoryTransactions.length})
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-emerald-900/40 bg-[#041210]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#031d18] text-slate-400 uppercase text-[10px] tracking-wider border-b border-emerald-900/40">
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
                <tbody className="divide-y divide-emerald-950/60">
                  {inventoryTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-500">
                        Chưa có lịch sử giao dịch kho
                      </td>
                    </tr>
                  ) : (
                    inventoryTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-emerald-950/30">
                        <td className="px-4 py-2.5 text-[11px] text-slate-400">
                          {new Date(tx.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-white">
                          {tx.itemName || "Sản phẩm"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.transactionType === "in"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : tx.transactionType === "out_sale"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {tx.transactionType === "in"
                              ? "Nhập kho"
                              : tx.transactionType === "out_sale"
                              ? "Bán minibar"
                              : "Điều chỉnh"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold">
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-slate-300 font-mono">
                          {tx.newStock}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400">
                          {tx.reason}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 text-[11px]">
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
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Báo Cáo Hoạt Động & Tài Chính Cơ Sở Lưu Trú</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Cập nhật tức thời: {new Date().toLocaleTimeString("vi-VN")}
            </span>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40">
              <span className="text-xs text-slate-400 font-medium block mb-1">
                Doanh Thu Tiền Phòng
              </span>
              <span className="text-2xl font-black text-white">
                {Number(reports.financialSummary.totalRoomRevenue).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-400 mt-2">
                Tổng doanh số các lượt phòng đã ở và đặt
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40">
              <span className="text-xs text-slate-400 font-medium block mb-1">
                Doanh Thu Dịch Vụ Minibar & Khác
              </span>
              <span className="text-2xl font-black text-emerald-400">
                {Number(reports.financialSummary.totalServiceRevenue).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-400 mt-2">
                Doanh thu nước ngọt, đồ ăn vặt, giặt ủi...
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40">
              <span className="text-xs text-slate-400 font-medium block mb-1">
                Công Nợ Khách Chưa Thanh Toán
              </span>
              <span className="text-2xl font-black text-rose-400">
                {Number(reports.financialSummary.totalReceivables).toLocaleString("vi-VN")} ₫
              </span>
              <p className="text-[11px] text-slate-400 mt-2">
                Số dư folio còn phải thu khi khách làm thủ tục checkout
              </p>
            </div>
          </div>

          {/* Room Rack Status Stats */}
          <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40 space-y-4">
            <h4 className="text-sm font-bold text-slate-200">
              Cơ Cấu Tình Trạng Buồng Phòng
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Tổng số phòng</span>
                <span className="text-xl font-bold text-white">
                  {reports.roomsSummary.totalRooms}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-center">
                <span className="text-xs text-rose-300 block">Đang có khách ở</span>
                <span className="text-xl font-bold text-rose-400">
                  {reports.roomsSummary.occupiedRooms}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center">
                <span className="text-xs text-emerald-300 block">Trống sạch sẵn sàng</span>
                <span className="text-xl font-bold text-emerald-400">
                  {reports.roomsSummary.vacantClean}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-center">
                <span className="text-xs text-amber-300 block">Cần dọn dẹp</span>
                <span className="text-xl font-bold text-amber-400">
                  {reports.roomsSummary.vacantDirty}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                <span className="text-xs text-slate-400 block">Đang bảo trì</span>
                <span className="text-xl font-bold text-slate-300">
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
          <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-emerald-400" />
                <span>Hạng Phòng ({roomTypes.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsNewRoomTypeModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                + Thêm Hạng Phòng
              </button>
            </div>

            <div className="space-y-2.5">
              {roomTypes.map((rt) => (
                <div
                  key={rt.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-white block">{rt.name}</span>
                    <span className="text-slate-400 text-[11px]">
                      Mã: {rt.code} • Sức chứa: {rt.maxOccupancy} khách
                    </span>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">
                    {Number(rt.basePrice).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Rooms Column */}
          <div className="p-5 rounded-2xl bg-[#041210] border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <DoorClosed className="w-4 h-4 text-emerald-400" />
                <span>Phòng Vật Lý ({rooms.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsNewRoomModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                + Thêm Phòng Vật Lý
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rooms.map((rm) => (
                <div
                  key={rm.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-base">
                      {rm.roomNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">T{rm.floor}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 truncate mt-1">
                    {rm.roomTypeName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#031513] border border-emerald-800/60 p-6 sm:p-8 shadow-2xl text-slate-100 no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <span>Đặt Phòng & Nhận Phòng Quầy (Walk-in)</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Room Type & Room Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Hạng Phòng <span className="text-rose-400">*</span>
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => {
                  setRoomTypeId(e.target.value)
                  setRoomId("")
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({Number(t.basePrice).toLocaleString("vi-VN")} ₫)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Số Phòng Gán <span className="text-rose-400">*</span>
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
              <label className="font-semibold text-slate-300 block mb-1">
                Họ và Tên Khách <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn Tuấn"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Số Điện Thoại <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0912345678"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Số CCCD / Hộ Chiếu
              </label>
              <input
                type="text"
                placeholder="079090001234"
                value={guestIdNumber}
                onChange={(e) => setGuestIdNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Số Lượng Khách
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Thời Gian Đến (Check-in)
              </label>
              <input
                type="datetime-local"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Thời Gian Đi (Check-out)
              </label>
              <input
                type="datetime-local"
                required
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Rate & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Giá Phòng Mỗi Đêm (₫)
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={roomRate}
                onChange={(e) => setRoomRate(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Tiền Đặt Cọc Trước (₫)
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {depositAmount > 0 && (
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Phương Thức Đặt Cọc
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDepositMethod("cash")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "cash"
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Tiền mặt
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMethod("bank_transfer")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "bank_transfer"
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Chuyển khoản QR
                </button>
                <button
                  type="button"
                  onClick={() => setDepositMethod("credit_card")}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    depositMethod === "credit_card"
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Thẻ POS
                </button>
              </div>
            </div>
          )}

          {/* Immediate Check-In Toggle */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-300 block">
                Nhận phòng ngay tại quầy
              </span>
              <span className="text-[11px] text-slate-400">
                Chuyển phòng sang trạng thái đang ở và tạo Folio hóa đơn tức thì.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isCheckInImmediately}
              onChange={(e) => setIsCheckInImmediately(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              Ghi Chú & Yêu Cầu Đặc Biệt
            </label>
            <input
              type="text"
              placeholder="Yêu cầu tầng cao, thêm gối, xuất hóa đơn công ty..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#031513] border border-emerald-800/60 p-5 sm:p-7 shadow-2xl text-slate-100 no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-900/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">
                Phòng {reservation.roomNumber}
              </span>
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                {reservation.status === "checked_in" ? "Đang lưu trú" : "Đã trả phòng"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Khách: <strong className="text-white">{reservation.guestName}</strong> • SĐT:{" "}
              {reservation.guestPhone} • CCCD: {reservation.guestIdNumber || "N/A"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Số Hồ Sơ Folio:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              #{folio.folioNumber}
            </span>
          </div>
        </div>

        {/* Sub-Tabs inside Modal */}
        <div className="flex space-x-2 my-4 border-b border-emerald-900/40 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("folio")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === "folio"
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 text-slate-300 hover:text-white"
            }`}
          >
            Hóa Đơn Folio & Dịch Vụ
          </button>
          {reservation.status === "checked_in" && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("add_service")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === "add_service"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:text-white"
                }`}
              >
                + Thêm Minibar / Dịch Vụ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transfer")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === "transfer"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:text-white"
                }`}
              >
                Đổi Phòng
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checkout")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === "checkout"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-950 text-rose-300 hover:bg-rose-900"
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
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Tiền Phòng</span>
                <span className="text-base font-bold text-white">
                  {Number(folio.roomCharges).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Minibar & Dịch Vụ</span>
                <span className="text-base font-bold text-emerald-400">
                  {Number(folio.serviceCharges).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Đã Thanh Toán</span>
                <span className="text-base font-bold text-blue-400">
                  {Number(folio.paidAmount).toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40">
                <span className="text-[11px] text-rose-300 block font-semibold">CÒN PHẢI THU</span>
                <span className="text-base font-extrabold text-rose-400">
                  {Number(folio.remainingBalance).toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>

            {/* Folio Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Chi Tiết Các Dòng Phí Trong Folio ({items.length})
                </h4>
                {reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("add_service")}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    + Thêm Dịch Vụ Phát Sinh
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
                  <tbody className="divide-y divide-slate-800/50">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-500">
                          Chưa có phát sinh chi phí nào
                        </td>
                      </tr>
                    ) : (
                      items.map((it) => (
                        <tr
                          key={it.id}
                          className={`hover:bg-slate-900/50 ${
                            it.isCancelled ? "opacity-50 line-through bg-rose-950/10" : ""
                          }`}
                        >
                          <td className="px-3.5 py-2.5 text-[11px] text-slate-400">
                            {new Date(it.recordedAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </td>
                          <td className="px-3.5 py-2.5 font-medium text-white">
                            {it.description}
                            {it.isCancelled && (
                              <span className="block text-[10px] text-rose-400 no-underline font-semibold mt-0.5">
                                [ĐÃ HỦY: {it.cancellationReason}]
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5">{Number(it.quantity)}</td>
                          <td className="px-3.5 py-2.5">
                            {Number(it.unitPrice).toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-emerald-400">
                            {Number(it.amount).toLocaleString("vi-VN")} ₫
                          </td>
                          <td className="px-3.5 py-2.5 text-[11px] text-slate-400">
                            {it.recordedBy}
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            {!it.isCancelled && reservation.status === "checked_in" && (
                              <button
                                type="button"
                                onClick={() => handleCancelItem(it.id)}
                                className="px-2 py-0.5 rounded text-[11px] text-rose-400 hover:bg-rose-950/60 font-medium"
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
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Lịch Sử Các Khoản Đã Thu ({payments.length})
                </h4>
                {Number(folio.remainingBalance) > 0 && reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => setIsAddingPayment(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    + Thu Thêm Tiền Mặt / QR
                  </button>
                )}
              </div>

              {isAddingPayment && (
                <form
                  onSubmit={handleRecordPayment}
                  className="p-3 mb-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-wrap items-end gap-3"
                >
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Số tiền thu (₫)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Phương thức</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="bank_transfer">Chuyển khoản QR</option>
                      <option value="credit_card">Thẻ POS</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Lưu Khoản Thu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingPayment(false)}
                    className="px-2 py-1 text-slate-400 hover:text-white"
                  >
                    Hủy
                  </button>
                </form>
              )}

              <div className="space-y-1.5">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        +{Number(p.amount).toLocaleString("vi-VN")} ₫
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.paymentMethod === "cash"
                          ? "Tiền mặt"
                          : p.paymentMethod === "bank_transfer"
                          ? "Chuyển khoản QR"
                          : "Thẻ"}
                        {p.isDeposit && " (Tiền đặt cọc)"} • Bởi {p.recordedBy}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
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
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Ghi Nhận Đồ Uống Minibar / Dịch Vụ Cho Phòng {reservation.roomNumber}</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Chọn Mặt Hàng Dịch Vụ
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
                <label className="font-semibold text-slate-300 block mb-1">Số Lượng</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={serviceQuantity}
                  onChange={(e) => setServiceQuantity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Khách lấy lúc 21h..."
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
              * Khi nhấn xác nhận, hệ thống sẽ tự động trừ số lượng mặt hàng trong kho cơ sở và cộng phí vào Folio phòng.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isSubmittingService}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              <span>Chuyển Khách Sang Phòng Khác (Room Transfer)</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Chọn Phòng Mới (Chỉ hiển thị phòng trống sạch)
              </label>
              <select
                value={targetRoomId}
                onChange={(e) => setTargetRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
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
              <label className="font-semibold text-slate-300 block mb-1">
                Lý Do Đổi Phòng (Bắt buộc lưu Audit Log)
              </label>
              <input
                type="text"
                required
                placeholder="Điều hòa hỏng, khách muốn đổi view, khách nâng hạng..."
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200">
              * Phòng cũ ({reservation.roomNumber}) sẽ tự động chuyển sang trạng thái <strong>Cần dọn (Vacant Dirty)</strong> để bộ phận buồng phòng nắm được.
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isTransferring || availableRooms.length === 0}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
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
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Thủ Tục Trả Phòng & Tất Toán Folio (Check-out)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Phụ Thu Trả Phòng Muộn (Nếu có)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={lateCheckoutFee}
                  onChange={(e) => setLateCheckoutFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Giảm Trừ / Chiết Khấu (Nếu có)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Calculated Final Balance */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex justify-between items-center">
              <div>
                <span className="text-xs text-rose-200 block font-bold">
                  SỐ TIỀN CẦN THU NỐT CỦA KHÁCH:
                </span>
                <span className="text-[11px] text-slate-400">
                  (Dư nợ hiện tại + Phụ thu - Giảm giá)
                </span>
              </div>
              <span className="text-2xl font-black text-rose-400">
                {Math.max(
                  0,
                  Number(folio.remainingBalance) + Number(lateCheckoutFee) - Number(discountAmount)
                ).toLocaleString("vi-VN")}{" "}
                ₫
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Phương Thức Thu Tiền Số Dư Cuối
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("cash")}
                  className={`py-2 rounded-xl text-center font-bold border ${
                    checkoutPaymentMethod === "cash"
                      ? "bg-rose-600/30 border-rose-500 text-rose-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Tiền mặt
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("bank_transfer")}
                  className={`py-2 rounded-xl text-center font-bold border ${
                    checkoutPaymentMethod === "bank_transfer"
                      ? "bg-rose-600/30 border-rose-500 text-rose-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Chuyển khoản QR
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod("credit_card")}
                  className={`py-2 rounded-xl text-center font-bold border ${
                    checkoutPaymentMethod === "credit_card"
                      ? "bg-rose-600/30 border-rose-500 text-rose-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  Thẻ POS
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Ghi Chú Checkout</label>
              <input
                type="text"
                placeholder="Khách khen dịch vụ tốt, đã hoàn trả thẻ phòng..."
                value={checkoutNote}
                onChange={(e) => setCheckoutNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("folio")}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                disabled={isCheckingOut}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-950 transition-all flex items-center gap-2"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-[#031513] border border-emerald-800/60 p-6 shadow-2xl text-slate-100">
        <h3 className="text-base font-bold text-white mb-4">Tạo Hạng Phòng Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Tên Hạng Phòng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Phòng Deluxe Ban Công"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Mã Viết Tắt</label>
            <input
              type="text"
              required
              placeholder="DLX-BC"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white uppercase font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">Giá Cơ Bản (₫)</label>
              <input
                type="number"
                min={0}
                step={50000}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Số Khách Tối Đa</label>
              <input
                type="number"
                min={1}
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Mô Tả</label>
            <input
              type="text"
              placeholder="View đẹp, bồn tắm nằm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-[#031513] border border-emerald-800/60 p-6 shadow-2xl text-slate-100">
        <h3 className="text-base font-bold text-white mb-4">Thêm Phòng Vật Lý Mới</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Thuộc Hạng Phòng</label>
            <select
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
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
              <label className="font-semibold block mb-1">Số Phòng</label>
              <input
                type="text"
                required
                placeholder="101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Tầng</label>
              <input
                type="text"
                required
                placeholder="1"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-[#031513] border border-emerald-800/60 p-6 shadow-2xl text-slate-100">
        <h3 className="text-base font-bold text-white mb-4">Thêm Mặt Hàng Dịch Vụ / Minibar</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Phân Loại</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="minibar_drink">Đồ uống / Nước giải khát</option>
              <option value="minibar_food">Đồ ăn vặt / Mì ly</option>
              <option value="laundry">Giặt ủi</option>
              <option value="fnb">Ăn uống nhà hàng</option>
              <option value="spa">Spa / Trị liệu</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Tên Mặt Hàng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nước ngọt Coca Cola 320ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">Mã Viết Tắt</label>
              <input
                type="text"
                required
                placeholder="COCA-320"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Đơn Vị Tính</label>
              <input
                type="text"
                required
                placeholder="lon / chai / gói"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">Giá Bán Cho Khách (₫)</label>
              <input
                type="number"
                min={0}
                step={5000}
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Giá Vốn Nhập (₫)</label>
              <input
                type="number"
                min={0}
                step={1000}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900">
            <span>Theo dõi số lượng tồn kho</span>
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(e) => setTrackInventory(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
          </div>
          {trackInventory && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Tồn Kho Ban Đầu</label>
                <input
                  type="number"
                  min={0}
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Báo Động Hết (Ngưỡng)</label>
                <input
                  type="number"
                  min={0}
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-[#031513] border border-emerald-800/60 p-6 shadow-2xl text-slate-100">
        <h3 className="text-base font-bold text-white mb-4">Nhập Kho & Điều Chỉnh Tồn</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Mặt Hàng</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              {serviceItems.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} (Hiện có: {i.currentStock} {i.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Loại Nghiệp Vụ</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="in">Nhập kho thêm (+)</option>
              <option value="out_loss">Xuất hao hụt / hỏng vỡ (-)</option>
              <option value="adjustment">Điều chỉnh kiểm kê thực tế</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Số Lượng ({selectedItem?.unit || "đơn vị"})
            </label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-bold"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Lý Do / Chứng Từ</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              {isSubmitting ? "Đang lưu..." : "Xác Nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
