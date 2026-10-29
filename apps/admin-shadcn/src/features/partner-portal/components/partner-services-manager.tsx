"use client"

import { useState } from "react"
import {
  Building2,
  Calendar,
  MapPin,
  Plus,
  Power,
  Search,
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
}

export function PartnerServicesManager({
  profile,
  services,
  onAddService,
  onToggleStatus,
  onDeleteService,
  onGoToInventory,
}: PartnerServicesManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getServiceBadge = (type: string) => {
    switch (type) {
      case "stay":
        return { label: "Homestay / Villa", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" }
      case "transport":
        return { label: "Xe Vận Chuyển", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" }
      case "experience":
        return { label: "Tour Trải Nghiệm", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
      default:
        return { label: "Dịch vụ", color: "bg-teal-500/20 text-teal-300 border-teal-500/30" }
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
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 flex items-center gap-1.5 transition-all shrink-0"
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
            Bấm &quot;Thêm Dịch Vụ Mới&quot; để bắt đầu niêm yết homestay, xe tự lái hoặc tour của bạn lên STAYEA.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
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
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border backdrop-blur-md ${badge.color}`}
                    >
                      {badge.label}
                    </span>

                    {/* Status Toggle Switch */}
                    <button
                      onClick={() => onToggleStatus(service.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md border transition-colors ${
                        isActive
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                          : "bg-slate-900/80 text-slate-400 border-slate-700"
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isActive ? "Đang mở bán" : "Đã tạm dừng"}</span>
                    </button>
                  </div>

                  {/* Price Tag in Bottom Right */}
                  <div className="absolute bottom-2.5 right-3 text-right">
                    <div className="text-lg font-extrabold text-emerald-400 tracking-tight">
                      {Number.parseInt(service.price).toLocaleString("vi-VN")} ₫
                      <span className="text-xs font-normal text-slate-300">
                        /{service.unit || "đêm"}
                      </span>
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

                    {/* Attribute tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {service.attributes.bedrooms && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                          {service.attributes.bedrooms} Phòng ngủ
                        </span>
                      )}
                      {service.attributes.vehicleType && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-900/50 text-[11px] text-blue-300">
                          {service.attributes.vehicleType}
                        </span>
                      )}
                      {service.attributes.transmission && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                          {service.attributes.transmission}
                        </span>
                      )}
                      {service.attributes.duration && (
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
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Xem Lịch Khả Dụng</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
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

      {/* Create Service Modal */}
      <PartnerCreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        businessType={profile.businessType}
        onSaveService={onAddService}
      />
    </div>
  )
}
