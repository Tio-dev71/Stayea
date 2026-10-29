"use client"

import * as React from "react"
import {
  Plus,
  CheckCircle2,
  X,
  CreditCard,
  Landmark,
  Wallet,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import { stayeaApi } from "@/lib/stayea-api-service"
import { ProfileSidebar } from "./profile-sidebar"
import { PaymentMethodsHeroBanner } from "./payment-methods-hero-banner"
import { PaymentMetricsBar } from "./payment-metrics-bar"
import { SavedCardsSection } from "./saved-cards-section"
import { BankAccountsSection } from "./bank-accounts-section"
import { EWalletsSection } from "./e-wallets-section"
import { BillingAddressCard } from "./billing-address-card"
import { RecentTransactionsCard } from "./recent-transactions-card"
import { PaymentSecurityCard } from "./payment-security-card"
import type {
  SavedCreditCard,
  LinkedBankAccount,
  LinkedEWallet,
  BillingInvoiceAddress,
  RecentPaymentTransaction,
} from "@/features/landing/data/stayea-mock-data"
import {
  LINKED_E_WALLETS,
} from "@/features/landing/data/stayea-mock-data"

interface PaymentMethodsPageProps {
  readonly onNavigate?: (route: string) => void
}

export function PaymentMethodsPage({ onNavigate }: PaymentMethodsPageProps) {
  const [accountHolderName, setAccountHolderName] = React.useState<string>("Khách hàng STAYEA")
  const [cards, setCards] = React.useState<readonly SavedCreditCard[]>([])
  const [bankAccounts, setBankAccounts] = React.useState<readonly LinkedBankAccount[]>([])
  const [recentTransactions, setRecentTransactions] = React.useState<readonly RecentPaymentTransaction[]>([])
  const [wallets, setWallets] = React.useState<readonly LinkedEWallet[]>(LINKED_E_WALLETS)
  const [billingAddress, setBillingAddress] = React.useState<BillingInvoiceAddress>({
    type: "Cá nhân",
    fullName: "Khách hàng STAYEA",
    taxId: "",
    email: "",
    phone: "",
    address: "Phú Quốc, Kiên Giang, Việt Nam",
  })

  React.useEffect(() => {
    stayeaApi.getProfile().then((u) => {
      if (u) {
        const name = u.displayName || u.name || "Khách hàng STAYEA"
        setAccountHolderName(name)
        setNewCardHolder(name)
        setBillingAddress((prev) => ({
          ...prev,
          fullName: name,
          email: u.email || "",
          phone: u.phone || "",
        }))
      }
    }).catch(() => {})

    stayeaApi.getPaymentMethods().then((res) => {
      if (Array.isArray(res)) {
        const loadedCards: SavedCreditCard[] = res
          .filter((item: any) => item.type === "credit_card" || item.type === "card")
          .map((item: any) => ({
            id: item.id,
            cardType: item.brand?.toLowerCase() === "mastercard" ? "mastercard" : "visa",
            cardNumberMasked: item.details?.maskedCard || item.details?.cardNumber || "•••• •••• •••• 8899",
            cardHolder: item.details?.cardHolder || accountHolderName,
            expiryDate: item.details?.expiry || "12/28",
            isDefault: Boolean(item.isDefault),
            backgroundGradient:
              item.brand?.toLowerCase() === "mastercard"
                ? "from-[#2A2B30] via-[#1C1D21] to-[#0D0E11]"
                : "from-[#194FA8] via-[#1E5CCB] to-[#0A88DE]",
          }))
        setCards(loadedCards)

        const loadedBanks: LinkedBankAccount[] = res
          .filter((item: any) => item.type === "bank_account" || item.type === "bank")
          .map((item: any) => ({
            id: item.id,
            bankName: item.title || "Ngân hàng",
            bankCode: (item.brand || "vcb").toLowerCase(),
            accountHolder: item.details?.accountHolder || accountHolderName,
            accountNumberMasked: item.details?.maskedAccount || item.details?.accountNumber || "**** 8899",
            logoColor: "#0066B3",
          }))
        setBankAccounts(loadedBanks)
      }
    }).catch(() => {})

    stayeaApi.getUserBookings().then((raw) => {
      if (Array.isArray(raw) && raw.length > 0) {
        const mapped: RecentPaymentTransaction[] = raw.map((b: any) => ({
          id: b.id,
          bookingCode: b.bookingCode || b.id,
          serviceTitle: b.title || "Dịch vụ tuyển chọn STAYEA",
          amountFormatted: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(b.finalAmount || b.totalAmount || 0)),
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString("vi-VN") : "Hôm nay",
          status: b.paymentStatus === "paid" ? "Đã thanh toán" : "Đang xử lý",
          imageUrl: b.details?.imageUrl || "/bookings/premier-residences.jpg",
        }))
        setRecentTransactions(mapped)
      }
    }).catch(() => {})
  }, [accountHolderName])

  // 2. Modals States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false)
  const [addMethodType, setAddMethodType] = React.useState<"card" | "bank" | "wallet">("card")

  const [editingCard, setEditingCard] = React.useState<SavedCreditCard | null>(null)
  const [editCardHolder, setEditCardHolder] = React.useState<string>("")
  const [editCardExpiry, setEditCardExpiry] = React.useState<string>("")

  const [editingBank, setEditingBank] = React.useState<LinkedBankAccount | null>(null)
  const [editBankHolder, setEditBankHolder] = React.useState<string>("")
  const [editBankAcc, setEditBankAcc] = React.useState<string>("")
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState<boolean>(false)
  const [walletToLink, setWalletToLink] = React.useState<LinkedEWallet | null>(null)

  // Add Card Form State
  const [newCardNumber, setNewCardNumber] = React.useState<string>("")
  const [newCardHolder, setNewCardHolder] = React.useState<string>("Khách hàng STAYEA")
  const [newCardExpiry, setNewCardExpiry] = React.useState<string>("")
  const [newCardCvv, setNewCardCvv] = React.useState<string>("")
  const [newCardIsDefault, setNewCardIsDefault] = React.useState<boolean>(false)

  // Add Bank Form State
  const [newBankName, setNewBankName] = React.useState<string>("Vietcombank")
  const [newBankAccNumber, setNewBankAccNumber] = React.useState<string>("")

  // Billing Address Edit Temp State
  const [tempBilling, setTempBilling] = React.useState<BillingInvoiceAddress>({
    type: "Cá nhân",
    fullName: "Khách hàng STAYEA",
    taxId: "",
    email: "",
    phone: "",
    address: "Phú Quốc, Kiên Giang, Việt Nam",
  })

  // Dynamic computed metrics for payment bar
  const computedMetrics = React.useMemo(() => {
    const defaultCard = cards.find((c) => c.isDefault) || cards[0]
    return {
      savedMethodsCount: cards.length + bankAccounts.length,
      defaultCardTitle: defaultCard
        ? `${defaultCard.cardType.toUpperCase()} ${defaultCard.cardNumberMasked.slice(-4)}`
        : "Chưa thiết lập",
      recentTxCount: recentTransactions.length,
      securityStatus: "Mã hóa 256-bit",
    }
  }, [cards, bankAccounts, recentTransactions])

  // Toast Notification
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 4000)
  }

  // 1. Set Card Default
  function handleSetDefaultCard(cardId: string) {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    )
    stayeaApi.setDefaultPaymentMethod(cardId).catch(() => {})
    const target = cards.find((c) => c.id === cardId)
    showToast(
      `Đã đặt thẻ ${target?.cardType.toUpperCase()} (${target?.cardNumberMasked}) làm mặc định!`
    )
  }

  // 2. Delete Card
  function handleDeleteCard(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId))
    stayeaApi.deletePaymentMethod(cardId).catch(() => {})
    showToast("Đã xóa thẻ thanh toán thành công.")
  }

  // 3. Delete Bank Account
  function handleDeleteBank(accountId: string) {
    setBankAccounts((prev) => prev.filter((a) => a.id !== accountId))
    stayeaApi.deletePaymentMethod(accountId).catch(() => {})
    showToast("Đã hủy liên kết tài khoản ngân hàng thành công.")
  }

  // 4. Toggle Wallet Link
  function handleLinkWalletConfirm() {
    if (!walletToLink) return
    const targetId = walletToLink.id
    setWallets((prev) =>
      prev.map((w) =>
        w.id === targetId ? { ...w, isLinked: !w.isLinked } : w
      )
    )
    showToast(`Đã liên kết ví điện tử ${walletToLink.name} thành công!`)
    setWalletToLink(null)
  }

  // 5. Submit Add Method
  function handleAddMethodSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (addMethodType === "card") {
      if (!newCardNumber || !newCardExpiry) {
        showToast("Vui lòng điền đầy đủ thông tin thẻ.")
        return
      }
      const last4 = newCardNumber.replaceAll(/\s/g, "").slice(-4) || "9999"
      const newCard: SavedCreditCard = {
        id: `card-${Date.now()}`,
        cardType: newCardNumber.startsWith("4") ? "visa" : "mastercard",
        cardNumberMasked: `•••• •••• •••• ${last4}`,
        cardHolder: newCardHolder.toUpperCase(),
        expiryDate: newCardExpiry,
        isDefault: newCardIsDefault,
        backgroundGradient: "from-[#0F172A] via-[#1E293B] to-[#334155]",
      }

      setCards((prev) => {
        if (newCardIsDefault) {
          return [newCard, ...prev.map((c) => ({ ...c, isDefault: false }))]
        }
        return [...prev, newCard]
      })

      stayeaApi.addPaymentMethod({
        type: "credit_card",
        brand: newCardNumber.startsWith("4") ? "visa" : "mastercard",
        title: `${newCardNumber.startsWith("4") ? "Visa" : "Mastercard"} kết thúc ${last4}`,
        isDefault: newCardIsDefault,
        details: {
          cardNumber: newCardNumber,
          maskedCard: `•••• •••• •••• ${last4}`,
          cardHolder: newCardHolder.toUpperCase(),
          expiry: newCardExpiry,
        },
      }).catch(() => {})

      showToast("Đã thêm thẻ thanh toán mới thành công!")
    } else {
      if (!newBankAccNumber) {
        showToast("Vui lòng nhập số tài khoản ngân hàng.")
        return
      }
      const last4 = newBankAccNumber.slice(-4)
      const newBank: LinkedBankAccount = {
        id: `bank-${Date.now()}`,
        bankName: newBankName,
        bankCode: newBankName.toLowerCase().includes("vcb") ? "vcb" : "tcb",
        accountHolder: accountHolderName,
        accountNumberMasked: `**** ${last4}`,
        logoColor: "#0066B3",
      }
      setBankAccounts((prev) => [...prev, newBank])

      stayeaApi.addPaymentMethod({
        type: "bank_account",
        brand: newBankName.toLowerCase().includes("vcb") ? "vcb" : "techcombank",
        title: newBankName,
        isDefault: false,
        details: {
          accountNumber: newBankAccNumber,
          maskedAccount: `**** ${last4}`,
          accountHolder: accountHolderName,
        },
      }).catch(() => {})

      showToast(`Đã liên kết tài khoản ${newBankName} thành công!`)
    }

    setIsAddModalOpen(false)
    setNewCardNumber("")
    setNewCardExpiry("")
    setNewCardCvv("")
    setNewBankAccNumber("")
  }

  // 6. Save Billing Address
  function handleSaveBilling(e: React.FormEvent) {
    e.preventDefault()
    setBillingAddress(tempBilling)
    setIsBillingModalOpen(false)
    showToast("Đã cập nhật thông tin xuất hóa đơn thành công!")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0A2239] text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Hero Panorama Banner */}
      <PaymentMethodsHeroBanner />

      {/* 2. Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar
            activeTab="payment"
            hideBadges
            onSelectTab={(tabId) => onNavigate?.(tabId)}
            onLogout={() => onNavigate?.("home")}
          />

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0 space-y-6">
            {/* Page Header + Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Phương thức thanh toán
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                  Quản lý các thẻ thanh toán, tài khoản ngân hàng và thông tin xuất hóa đơn của bạn một cách an toàn và bảo mật.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate ? onNavigate("add-payment") : setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm phương thức thanh toán</span>
              </button>
            </div>

            {/* 2-Column Content Grid: Left Main Stack (Col 8) + Right Stack (Col 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Stack (Col Span 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Metrics Status Cards */}
                <PaymentMetricsBar metrics={computedMetrics} />

                {/* 2. Thẻ đã lưu */}
                <SavedCardsSection
                  cards={cards}
                  onSetDefault={handleSetDefaultCard}
                  onEditCard={(c) => {
                    setEditingCard(c)
                    setEditCardHolder(c.cardHolder)
                    setEditCardExpiry(c.expiryDate)
                  }}
                  onDeleteCard={handleDeleteCard}
                />

                {/* 3. Tài khoản ngân hàng */}
                <BankAccountsSection
                  accounts={bankAccounts}
                  onEditAccount={(b) => {
                    setEditingBank(b)
                    setEditBankHolder(b.accountHolder)
                    setEditBankAcc(b.accountNumberMasked)
                  }}
                  onDeleteAccount={handleDeleteBank}
                />

                {/* 4. Ví & thanh toán khác */}
                <EWalletsSection
                  wallets={wallets}
                  onLinkWallet={(w) => {
                    setWalletToLink(w)
                  }}
                />
              </div>

              {/* Right Stack (Col Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Địa chỉ xuất hóa đơn */}
                <BillingAddressCard
                  address={billingAddress}
                  onEdit={() => {
                    setTempBilling(billingAddress)
                    setIsBillingModalOpen(true)
                  }}
                />

                {/* 2. Lịch sử thanh toán gần đây */}
                <RecentTransactionsCard
                  transactions={recentTransactions}
                  onViewAll={() => onNavigate?.("bookings")}
                />

                {/* 3. Thanh toán an toàn */}
                <PaymentSecurityCard />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: THÊM PHƯƠNG THỨC THANH TOÁN
      ========================================================================= */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Thêm phương thức thanh toán
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chọn loại phương thức và nhập thông tin để liên kết vào tài khoản STAYEA.
            </DialogDescription>
          </DialogHeader>

          {/* Method Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl my-2">
            <button
              type="button"
              onClick={() => setAddMethodType("card")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                addMethodType === "card"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Thẻ quốc tế</span>
            </button>
            <button
              type="button"
              onClick={() => setAddMethodType("bank")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                addMethodType === "bank"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Ngân hàng</span>
            </button>
          </div>

          <form onSubmit={handleAddMethodSubmit} className="space-y-3.5 pt-1">
            {addMethodType === "card" ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Số thẻ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4123 4567 8901 2345"
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Tên in trên thẻ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NGUYEN MINH"
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Hạn dùng (MM/YY) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12/28"
                      value={newCardExpiry}
                      onChange={(e) => setNewCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      CVV / CVC <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCardIsDefault}
                    onChange={(e) => setNewCardIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Đặt làm phương thức thanh toán mặc định</span>
                </label>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Ngân hàng liên kết <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 bg-white"
                  >
                    <option value="BIDV">BIDV - Ngân hàng Đầu tư và Phát triển</option>
                    <option value="MBBank">MBBank - Ngân hàng Quân Đội</option>
                    <option value="ACB">ACB - Ngân hàng Á Châu</option>
                    <option value="VPBank">VPBank - Ngân hàng Việt Nam Thịnh Vượng</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Số tài khoản ngân hàng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập số tài khoản"
                    value={newBankAccNumber}
                    onChange={(e) => setNewBankAccNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="NGUYỄN MINH"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                Lưu phương thức
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 2: CẬP NHẬT ĐỊA CHỈ XUẤT HÓA ĐƠN
      ========================================================================= */}
      <Dialog open={isBillingModalOpen} onOpenChange={setIsBillingModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Cập nhật thông tin xuất hóa đơn
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Thông tin này sẽ được in trên hóa đơn điện tử cho các đơn dịch vụ STAYEA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBilling} className="space-y-3.5 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Loại hóa đơn
              </label>
              <select
                value={tempBilling.type}
                onChange={(e) =>
                  setTempBilling((prev) => ({
                    ...prev,
                    type: e.target.value as "Cá nhân" | "Doanh nghiệp",
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 bg-white"
              >
                <option value="Cá nhân">Cá nhân</option>
                <option value="Doanh nghiệp">Doanh nghiệp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Họ và tên / Tên công ty <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tempBilling.fullName}
                onChange={(e) =>
                  setTempBilling((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Email nhận hóa đơn <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={tempBilling.email}
                onChange={(e) =>
                  setTempBilling((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Số điện thoại liên hệ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={tempBilling.phone}
                onChange={(e) =>
                  setTempBilling((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Địa chỉ xuất hóa đơn <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={tempBilling.address}
                onChange={(e) =>
                  setTempBilling((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBillingModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                Cập nhật thông tin
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 3: LIÊN KẾT VÍ ĐIỆN TỬ
      ========================================================================= */}
      <Dialog
        open={Boolean(walletToLink)}
        onOpenChange={(open) => {
          if (!open) setWalletToLink(null)
        }}
      >
        <DialogContent className="sm:max-w-sm rounded-2xl p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 text-center">
              Liên kết ví {walletToLink?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 text-center">
              Quét mã QR hoặc xác nhận liên kết tài khoản ví {walletToLink?.name} với số điện thoại +84 90 123 4567.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              {walletToLink?.name}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setWalletToLink(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleLinkWalletConfirm}
              className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              Xác nhận liên kết
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 4: CHỈNH SỬA THẺ THANH TOÁN
      ========================================================================= */}
      <Dialog
        open={Boolean(editingCard)}
        onOpenChange={(open) => {
          if (!open) setEditingCard(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Chỉnh sửa thông tin thẻ
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cập nhật tên in trên thẻ hoặc ngày hết hạn của thẻ {editingCard?.cardNumberMasked}.
            </DialogDescription>
          </DialogHeader>

          {editingCard && (
            <div className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Số thẻ
                </label>
                <input
                  type="text"
                  readOnly
                  value={editingCard.cardNumberMasked}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono bg-slate-50 text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tên in trên thẻ
                </label>
                <input
                  type="text"
                  value={editCardHolder}
                  onChange={(e) => setEditCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Ngày hết hạn (MM/YY)
                </label>
                <input
                  type="text"
                  value={editCardExpiry}
                  onChange={(e) => setEditCardExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCards((prev) =>
                      prev.map((c) =>
                        c.id === editingCard.id
                          ? { ...c, cardHolder: editCardHolder || c.cardHolder, expiryDate: editCardExpiry || c.expiryDate }
                          : c
                      )
                    )
                    setEditingCard(null)
                    showToast("Đã cập nhật thông tin thẻ thành công!")
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 5: CHỈNH SỬA TÀI KHOẢN NGÂN HÀNG
      ========================================================================= */}
      <Dialog
        open={Boolean(editingBank)}
        onOpenChange={(open) => {
          if (!open) setEditingBank(null)
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Chỉnh sửa tài khoản ngân hàng
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cập nhật thông tin tài khoản liên kết {editingBank?.bankName}.
            </DialogDescription>
          </DialogHeader>

          {editingBank && (
            <div className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Ngân hàng
                </label>
                <input
                  type="text"
                  readOnly
                  value={editingBank.bankName}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  value={editBankHolder}
                  onChange={(e) => setEditBankHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={editBankAcc}
                  onChange={(e) => setEditBankAcc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBank(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBankAccounts((prev) =>
                      prev.map((b) =>
                        b.id === editingBank.id
                          ? { ...b, accountHolder: editBankHolder || b.accountHolder, accountNumberMasked: editBankAcc || b.accountNumberMasked }
                          : b
                      )
                    )
                    setEditingBank(null)
                    showToast("Đã cập nhật thông tin tài khoản ngân hàng thành công!")
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0A2239] hover:bg-[#071726] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
