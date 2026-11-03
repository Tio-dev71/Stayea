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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Tài Khoản Quyết Toán & Thông Tin Doanh Nghiệp</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          STAYEA quyết toán doanh thu đơn hàng cho đối tác linh hoạt theo yêu cầu hoặc định kỳ qua tài khoản ngân hàng.
        </p>
      </div>

      {/* Settlement Balance & Withdrawal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Available Balance */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Số Dư Khả Dụng
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300">
                Sẵn sàng rút
              </span>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {loadingOverview && activeAvailableBalance === 0 ? "..." : `${activeAvailableBalance.toLocaleString("vi-VN")} ₫`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Doanh thu từ các đơn hàng đã phục vụ thành công
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/40">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={activeAvailableBalance < 100_000}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Yêu Cầu Rút Tiền</span>
            </button>
          </div>
        </div>

        {/* Card 2: Total Earned */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
              <DollarSign className="w-4 h-4 text-blue-400" /> Tổng Thu Nhập Tích Lũy
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {activeTotalEarned.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Thực nhận sau khi trừ chiết khấu {profile.commissionRate}%
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Chiết khấu nền tảng:</span>
            <span className="text-emerald-400 font-bold">{profile.commissionRate}%</span>
          </div>
        </div>

        {/* Card 3: Total Withdrawn */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2">
              <History className="w-4 h-4 text-purple-400" /> Đã Quyết Toán / Chờ Xử Lý
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {overview.totalWithdrawn.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {overview.payoutRequests.length} lệnh rút tiền qua hệ thống
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Lệnh gần nhất:</span>
            <span className="text-white font-medium">
              {overview.payoutRequests[0]
                ? new Date(overview.payoutRequests[0].createdAt).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </span>
          </div>
        </div>
      </div>

      {/* Payout History Section */}
      {overview.payoutRequests.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Lịch Sử Yêu Cầu Quyết Toán</span>
            </h3>
            <span className="text-xs text-slate-400">
              {overview.payoutRequests.length} yêu cầu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400">
                  <th className="py-2.5 px-3">Mã Lệnh</th>
                  <th className="py-2.5 px-3">Thời Gian</th>
                  <th className="py-2.5 px-3">Số Tiền</th>
                  <th className="py-2.5 px-3">Tài Khoản Nhận</th>
                  <th className="py-2.5 px-3">Trạng Thái</th>
                  <th className="py-2.5 px-3">Ghi Chú Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {overview.payoutRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-white">
                      {req.payoutCode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(req.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">
                      {Number.parseInt(req.amount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{req.bankName}</div>
                      <div className="font-mono text-slate-400 text-[11px]">{req.bankAccount}</div>
                    </td>
                    <td className="py-2.5 px-3">{getStatusBadge(req.status)}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {req.transactionRef && (
                        <div className="font-mono text-blue-400">Mã GD: {req.transactionRef}</div>
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
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-900/50 p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tài Khoản Ngân Hàng Nhận Tiền Quyết Toán</h3>
              <p className="text-[11px] text-slate-400">
                Tiền phòng, xe và tour được chuyển khoản trực tiếp vào tài khoản ngân hàng dưới đây
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tên Ngân hàng <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="VD: Vietcombank / MB Bank / Techcombank"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Số Tài Khoản (STK) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="VD: 0071001234567"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Chủ Tài Khoản (In hoa không dấu) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN VAN PHAT"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Partner Profile & Business Information */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Thông Tin Cơ Sở Kinh Doanh / Đơn Vị</h3>
              <p className="text-[11px] text-slate-400">
                Thông tin xuất hiện trên hóa đơn và đối soát hệ thống
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tên Cơ Sở / Hộ Kinh Doanh <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Người Đại Diện Phụ Trách <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hotline Tiếp Nhận Khách (Zalo/SĐT) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Nhận Thông Báo Đơn
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Địa Chỉ Hoạt Động (Phú Quốc)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Commission & Terms */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">
                Hợp Đồng Đối Tác STAYEA: {profile.commissionRate}% Chiết Khấu
              </div>
              <div className="text-[11px] text-slate-400">
                STAYEA cam kết không phát sinh bất kỳ khoản phí ẩn nào khác.
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-medium">
            Hợp đồng hiệu lực
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in font-medium">
              <Check className="w-4 h-4" /> Đã cập nhật thông tin thành công!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thông Tin Cài Đặt</span>
          </button>
        </div>
      </form>

      {/* Modal: Request Payout Withdrawal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ArrowDownToLine className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Yêu Cầu Rút Tiền Quyết Toán</h3>
                  <p className="text-[11px] text-slate-400">
                    Chuyển về tài khoản ngân hàng của đối tác
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Số dư khả dụng:</span>
                  <span className="font-bold text-emerald-400">
                    {overview.availableBalance.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tài khoản nhận:</span>
                  <span className="font-mono text-white">
                    {bankAccount} ({bankName})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Chủ tài khoản:</span>
                  <span className="font-mono uppercase text-white">{bankAccountHolder}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Số tiền muốn rút (₫) <span className="text-rose-400">*</span>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
                <div className="flex items-center gap-2 mt-2">
                  {[1_000_000, 2_000_000, 5_000_000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt.toLocaleString("vi-VN"))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                    >
                      {amt / 1_000_000}M ₫
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setWithdrawAmount(overview.availableBalance.toLocaleString("vi-VN"))
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-[11px] text-emerald-400 border border-emerald-800 font-medium"
                  >
                    Tối đa
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-emerald-950 flex items-center gap-1.5"
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
