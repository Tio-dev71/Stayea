"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  ArrowDownToLine,
  Building,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  History,
  RefreshCw,
  Save,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { PartnerOrderData, PartnerProfileData } from "../types"

interface PartnerPayoutSettingsProps {
  profile: PartnerProfileData
  orders?: PartnerOrderData[]
  onUpdateProfile: (updated: Partial<PartnerProfileData>) => Promise<boolean>
}

export function PartnerPayoutSettings({
  profile,
  orders = [],
  onUpdateProfile,
}: PartnerPayoutSettingsProps) {
  const [businessName, setBusinessName] = useState(profile.businessName)
  const [contactName, setContactName] = useState(profile.contactName)
  const [phone, setPhone] = useState(profile.phone)
  const [email, setEmail] = useState(profile.email)
  const [address, setAddress] = useState(profile.address)
  const [bankName, setBankName] = useState(profile.bankName)
  const [bankAccount, setBankAccount] = useState(profile.bankAccount)
  const [bankAccountHolder, setBankAccountHolder] = useState(profile.bankAccountHolder)

  const [savedSuccess, setSavedSuccess] = useState(false)

  // Settlement & Payout Engine State
  const [overview, setOverview] = useState<{
    availableBalance: number
    totalEarned: number
    totalWithdrawn: number
    payoutRequests: any[]
  }>({
    availableBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    payoutRequests: [],
  })
  const [loadingOverview, setLoadingOverview] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [submittingPayout, setSubmittingPayout] = useState(false)

  const fetchOverview = async () => {
    try {
      setLoadingOverview(true)
      const data = await stayeaApi.getPartnerPayoutOverview(profile.id)
      setOverview(data)
    } catch {
      // ignore
    } finally {
      setLoadingOverview(false)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [profile.id])

  // Compute live revenue fallback from completed orders
  const completedOrdersEarned = (orders || [])
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number.parseFloat(o.partnerPayoutAmount || "0"), 0)

  const activeTotalEarned = overview.totalEarned > 0 ? overview.totalEarned : completedOrdersEarned
  const activeAvailableBalance = overview.availableBalance > 0
    ? overview.availableBalance
    : Math.max(0, activeTotalEarned - overview.totalWithdrawn)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const saved = await onUpdateProfile({
      businessName,
      contactName,
      phone,
      email,
      address,
      bankName,
      bankAccount,
      bankAccountHolder,
    })
    if (!saved) return
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseInt(withdrawAmount.replace(/[^0-9]/g, ""), 10)
    if (!amountNum || isNaN(amountNum) || amountNum < 100_000) {
      toast.error("Số tiền rút tối thiểu là 100,000 ₫")
      return
    }
    if (amountNum > activeAvailableBalance) {
      toast.error(`Số dư khả dụng hiện tại (${activeAvailableBalance.toLocaleString("vi-VN")} ₫) không đủ để rút`)
      return
    }
    if (!bankName || !bankAccount || !bankAccountHolder) {
      toast.error("Vui lòng lưu thông tin tài khoản ngân hàng trước khi yêu cầu rút tiền")
      return
    }

    setSubmittingPayout(true)
    try {
      const res = await stayeaApi.requestPartnerPayout({
        amount: amountNum,
        bankName,
        bankAccount,
        bankAccountHolder,
      }, profile.id)
      toast.success(res.message || "Đã gửi yêu cầu quyết toán thành công!")
      setIsModalOpen(false)
      setWithdrawAmount("")
      await fetchOverview()
    } catch (err: any) {
      toast.error(err.message || "Không thể gửi yêu cầu quyết toán")
    } finally {
      setSubmittingPayout(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Chờ xét duyệt
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Check className="w-3 h-3" /> Đã phê duyệt
          </span>
        )
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" /> Đang chuyển khoản
          </span>
        )
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Check className="w-3 h-3" /> Đã quyết toán
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Từ chối
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span>Tài Khoản Quyết Toán & Thông Tin Doanh Nghiệp</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          STAYEA quyết toán doanh thu đơn hàng cho đối tác linh hoạt theo yêu cầu hoặc định kỳ qua tài khoản ngân hàng.
        </p>
      </div>

      {/* Settlement Balance & Withdrawal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Available Balance */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-850 to-emerald-900 border border-emerald-700/30 p-5 shadow-sm text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Số Dư Khả Dụng
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-bold backdrop-blur-md">
                Sẵn sàng rút
              </span>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {loadingOverview && activeAvailableBalance === 0 ? "..." : `${activeAvailableBalance.toLocaleString("vi-VN")} ₫`}
            </div>
            <p className="text-[11px] text-emerald-100/80 mt-1">
              Doanh thu từ các đơn hàng đã phục vụ thành công
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={activeAvailableBalance < 100_000}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 disabled:bg-white/20 disabled:text-white/60 text-emerald-950 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Yêu Cầu Rút Tiền</span>
            </button>
          </div>
        </div>

        {/* Card 2: Total Earned */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" /> Tổng Thu Nhập Tích Lũy
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTotalEarned.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Thực nhận sau khi trừ chiết khấu {profile.commissionRate}%
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Chiết khấu nền tảng:</span>
            <span className="text-emerald-700 font-bold">{profile.commissionRate}%</span>
          </div>
        </div>

        {/* Card 3: Total Withdrawn */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
              <History className="w-4 h-4 text-purple-600" /> Đã Quyết Toán / Chờ Xử Lý
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {overview.totalWithdrawn.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {overview.payoutRequests.length} lệnh rút tiền qua hệ thống
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Lệnh gần nhất:</span>
            <span className="text-slate-800 font-semibold">
              {overview.payoutRequests[0]
                ? new Date(overview.payoutRequests[0].createdAt).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </span>
          </div>
        </div>
      </div>

      {/* Payout History Section */}
      {overview.payoutRequests.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              <span>Lịch Sử Yêu Cầu Quyết Toán</span>
            </h3>
            <span className="text-xs text-slate-500">
              {overview.payoutRequests.length} yêu cầu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2.5 px-3">Mã Lệnh</th>
                  <th className="py-2.5 px-3">Thời Gian</th>
                  <th className="py-2.5 px-3">Số Tiền</th>
                  <th className="py-2.5 px-3">Tài Khoản Nhận</th>
                  <th className="py-2.5 px-3">Trạng Thái</th>
                  <th className="py-2.5 px-3">Ghi Chú Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {overview.payoutRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">
                      {req.payoutCode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(req.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">
                      {Number.parseInt(req.amount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900">{req.bankName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{req.bankAccount}</div>
                    </td>
                    <td className="py-2.5 px-3">{getStatusBadge(req.status)}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {req.transactionRef && (
                        <div className="font-mono text-blue-600 font-semibold">Mã GD: {req.transactionRef}</div>
                      )}
                      <div>{req.adminNotes || "—"}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Form: Bank & Profile Settings */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Bank Payout Information */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tài Khoản Ngân Hàng Nhận Tiền Quyết Toán</h3>
              <p className="text-[11px] text-slate-500">
                Tiền phòng, xe và tour được chuyển khoản trực tiếp vào tài khoản ngân hàng dưới đây
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Ngân hàng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: Vietcombank / MB Bank / Techcombank"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Tài Khoản (STK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="VD: 0071001234567"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chủ Tài Khoản (In hoa không dấu) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN PHAT"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Partner Profile & Business Information */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Thông Tin Cơ Sở Kinh Doanh / Đơn Vị</h3>
              <p className="text-[11px] text-slate-500">
                Thông tin xuất hiện trên hóa đơn và đối soát hệ thống
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Cơ Sở / Hộ Kinh Doanh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người Đại Diện Phụ Trách <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hotline Tiếp Nhận Khách (Zalo/SĐT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Nhận Thông Báo Đơn
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa Chỉ Hoạt Động (Phú Quốc)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Commission & Terms */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-center justify-between text-xs text-slate-700 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <div className="font-bold text-slate-900">
                Hợp Đồng Đối Tác STAYEA: {profile.commissionRate}% Chiết Khấu
              </div>
              <div className="text-[11px] text-slate-500">
                STAYEA cam kết không phát sinh bất kỳ khoản phí ẩn nào khác.{" "}
                <a
                  href="/partner-agreement"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-800 ml-1 font-semibold"
                >
                  Xem điều khoản hợp đồng & quy chế quyết toán ➔
                </a>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            Hợp đồng hiệu lực
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 flex items-center gap-1.5 animate-fade-in font-bold">
              <Check className="w-4 h-4" /> Đã cập nhật thông tin thành công!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thông Tin Cài Đặt</span>
          </button>
        </div>
      </form>

      {/* Modal: Request Payout Withdrawal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ArrowDownToLine className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Yêu Cầu Rút Tiền Quyết Toán</h3>
                  <p className="text-[11px] text-slate-500">
                    Chuyển về tài khoản ngân hàng của đối tác
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Số dư khả dụng:</span>
                  <span className="font-bold text-emerald-700">
                    {overview.availableBalance.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tài khoản nhận:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {bankAccount} ({bankName})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Chủ tài khoản:</span>
                  <span className="font-mono uppercase font-medium text-slate-900">{bankAccountHolder}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Số tiền muốn rút (₫) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={withdrawAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "")
                    if (!val) {
                      setWithdrawAmount("")
                    } else {
                      setWithdrawAmount(Number.parseInt(val, 10).toLocaleString("vi-VN"))
                    }
                  }}
                  placeholder="VD: 2.000.000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 font-bold shadow-xs"
                />
                <div className="flex items-center gap-2 mt-2">
                  {[1_000_000, 2_000_000, 5_000_000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt.toLocaleString("vi-VN"))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 border border-slate-200 cursor-pointer"
                    >
                      {amt / 1_000_000}M ₫
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setWithdrawAmount(overview.availableBalance.toLocaleString("vi-VN"))
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[11px] text-emerald-800 border border-emerald-200 font-semibold cursor-pointer"
                  >
                    Tối đa
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingPayout ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Xác Nhận Rút Tiền</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
