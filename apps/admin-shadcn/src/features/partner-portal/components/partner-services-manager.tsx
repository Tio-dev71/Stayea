"use client"

import { useState } from "react"
import {
  Building2,
  Calendar,
  Car,
  Compass,
  Edit3,
  Image as ImageIcon,
  MapPin,
  Plus,
  Power,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react"
import { PartnerCreateServiceModal } from "./partner-create-service-modal"
import type { PartnerProfileData, PartnerServiceData } from "../types"

interface PartnerServicesManagerProps {
  profile: PartnerProfileData
  services: PartnerServiceData[]
  onAddService: (newService: Omit<PartnerServiceData, "id" | "partnerId">) => void
  onToggleStatus: (serviceId: string) => void
  onDeleteService: (serviceId: string) => void
  onGoToInventory?: (serviceId: string) => void
  onUpdateService?: (serviceId: string, updatedData: Partial<PartnerServiceData>) => Promise<boolean> | void
}

export function PartnerServicesManager({
  profile,
  services,
  onAddService,
  onToggleStatus,
  onDeleteService,
  onGoToInventory,
  onUpdateService,
}: PartnerServicesManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<PartnerServiceData | null>(null)

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getServiceBadge = (type: string) => {
    switch (type) {
      case "stay":
        return { label: "Homestay / Villa", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Building2 }
      case "transport":
        return { label: "Xe Vận Chuyển", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: Car }
      case "experience":
        return { label: "Tour Trải Nghiệm", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Compass }
      default:
        return { label: "Dịch vụ", color: "bg-teal-500/20 text-teal-300 border-teal-500/30", icon: Sparkles }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Danh Sách Dịch Vụ Của Bạn</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {services.length} mục
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý homestay, đội xe hoặc tour trải nghiệm đang mở bán trên nền tảng STAYEA
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Add Service Button */}
          <button
            onClick={() => {
              setEditingService(null)
              setIsCreateModalOpen(true)
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Chưa có dịch vụ nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Bấm &quot;Thêm Dịch Vụ Mới&quot; để bắt đầu niêm yết homestay, đội xe hoặc tour của bạn lên STAYEA.
          </p>
          <button
            onClick={() => {
              setEditingService(null)
              setIsCreateModalOpen(true)
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const badge = getServiceBadge(service.serviceType)
            const isActive = service.status === "active"
            const totalUnits = Number(service.attributes?.totalUnits) || Number(service.attributes?.capacity) || 1
            const imageCount = Array.isArray(service.images) ? service.images.length : 1

            return (
              <div
                key={service.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 border transition-all ${
                  isActive
                    ? "border-slate-800 hover:border-emerald-700/60 shadow-lg"
                    : "border-slate-800/60 opacity-60 bg-slate-950"
                }`}
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={
                      service.images?.[0] ||
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                    }
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border backdrop-blur-md flex items-center gap-1 ${badge.color}`}
                    >
                      <badge.icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    {/* Status Toggle Switch */}
                    <button
                      onClick={() => onToggleStatus(service.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md border transition-colors cursor-pointer ${
                        isActive
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                          : "bg-slate-900/80 text-slate-400 border-slate-700"
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isActive ? "Đang mở bán" : "Đã tạm dừng"}</span>
                    </button>
                  </div>

                  {/* Image Count Badge & Price Tag */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    {/* Image count badge */}
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 border border-white/10">
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>{imageCount} ảnh</span>
                    </span>

                    {/* Price Tag */}
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-400 tracking-tight">
                        {Number.parseInt(service.price).toLocaleString("vi-VN")} ₫
                        <span className="text-xs font-normal text-slate-300">
                          /{service.unit || "đêm"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>

                    {/* Capacity & Attributes Badges (Crucial for Quantity Management) */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {/* Sức chứa / Đội xe */}
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>
                          {service.serviceType === "transport"
                            ? `Đội xe: ${totalUnits} xe sẵn có`
                            : service.serviceType === "experience"
                            ? `Sức chứa: ${totalUnits} khách/ngày`
                            : `Quy mô: ${totalUnits} phòng/căn`}
                        </span>
                      </span>

                      {service.attributes?.vehicleType && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-900/50 text-[11px] text-blue-300">
                          {service.attributes.vehicleType}
                        </span>
                      )}
                      {service.attributes?.transmission && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                          {service.attributes.transmission}
                        </span>
                      )}
                      {service.attributes?.bedrooms && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                          {service.attributes.bedrooms} Phòng ngủ
                        </span>
                      )}
                      {service.attributes?.duration && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-900/50 text-[11px] text-amber-300">
                          {service.attributes.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {onGoToInventory && (
                      <button
                        onClick={() => onGoToInventory(service.id)}
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Lịch & Tồn kho</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingService(service)
                          setIsCreateModalOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa dịch vụ, sức chứa & ảnh"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Service Modal */}
      <PartnerCreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingService(null)
        }}
        businessType={editingService?.serviceType === "transport" ? "transport" : editingService?.serviceType === "experience" ? "tour" : profile.businessType}
        onSaveService={onAddService}
        serviceToEdit={editingService}
        onUpdateService={onUpdateService}
      />
    </div>
  )
}
