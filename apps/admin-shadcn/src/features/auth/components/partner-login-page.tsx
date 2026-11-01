"use client"

import * as React from "react"
import Image from "next/image"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Building,
  Phone,
  User,
  Layers,
} from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import { setToken, setUser } from "@/lib/token"

interface PartnerLoginPageProps {
  readonly initialMode?: "login" | "register"
  readonly onLoginSuccess?: (user: any) => void
}

export function PartnerLoginPage({
  initialMode = "login",
  onLoginSuccess,
}: PartnerLoginPageProps) {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode)

  // Login form state
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)

  // Register form state
  const [fullName, setFullName] = React.useState("")
  const [businessName, setBusinessName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [businessType, setBusinessType] = React.useState("homestay")

  // Status state
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  // Handle Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email đối tác.")
      return
    }
    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu.")
      return
    }

    setIsLoading(true)

    try {
      const res = await stayeaApi.login(email.trim(), password)

      if (!res.success) {
        setErrorMessage(res.error || "Email hoặc mật khẩu đối tác không chính xác.")
        setIsLoading(false)
        return
      }

      const user = res.user

      // STRICT ROLE GUARD: Quản trị viên (ADMIN) không được phép dùng Cổng Đối tác
      if (user?.role === "ADMIN" || (user as any)?.role === "admin") {
        await stayeaApi.logout().catch(() => {})
        setErrorMessage(
          "Tài khoản Quản trị viên (ADMIN) không được phép đăng nhập Cổng Đối tác. Vui lòng truy cập Cổng Quản trị tại https://admin.stayea.com."
        )
        setIsLoading(false)
        return
      }

      // Store tokens
      if (res.token) {
        setToken(res.token)
      }
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          name: user.name || user.displayName || user.email.split("@")[0],
          displayName: user.displayName || user.name,
          role: user.role || "PARTNER",
        })
      }

      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng vào Partner Hub...")

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user)
        } else {
          window.location.href = "/hub"
        }
      }, 600)
    } catch (err: any) {
      setErrorMessage(err?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
      setIsLoading(false)
    }
  }

  // Handle Register
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!fullName.trim()) {
      setErrorMessage("Vui lòng nhập họ tên người đại diện.")
      return
    }
    if (!businessName.trim()) {
      setErrorMessage("Vui lòng nhập tên cơ sở đối tác / homestay / tour.")
      return
    }
    if (!phone.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại liên hệ.")
      return
    }
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email.")
      return
    }
    if (!password || password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }

    setIsLoading(true)

    try {
      const regRes = await stayeaApi.register(email.trim(), password, fullName.trim())

      if (!regRes.success) {
        setErrorMessage(regRes.error || "Không thể tạo tài khoản đối tác. Vui lòng thử lại.")
        setIsLoading(false)
        return
      }

      // Automatically register / update partner facility
      try {
        await stayeaApi.registerPartner({
          businessName: businessName.trim(),
          businessType,
          contactName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: "Phú Quốc",
        })
      } catch {
        // Ignored, partner can update profile inside hub
      }

      setSuccessMessage("Đăng ký thành công! Đang chuyển hướng vào Cổng Đối tác STAYEA...")

      setTimeout(() => {
        window.location.href = "/hub"
      }, 800)
    } catch (err: any) {
      setErrorMessage(err?.message || "Lỗi đăng ký tài khoản. Vui lòng thử lại sau.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#061816]">
      {/* 1. Background Image with deep luxury emerald overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth/auth-villa-bg.jpg"
          alt="STAYEA Partner Resort"
          fill
          unoptimized
          priority
          className="object-cover object-center scale-105 filter blur-[2px]"
        />
        {/* Deep luxury emerald vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061816]/95 via-[#082824]/90 to-[#040e0d]/98" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Login / Register Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Glow Accent */}
        <div className="mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-xs opacity-75 mb-3" />

        <div className="bg-slate-900/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Subtle Corner Decoration */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* Emblem */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-emerald-950/60 mb-3 border border-emerald-400/40 group-hover:scale-105 transition-transform">
              <Image
                src="/stayea.png"
                alt="STAYEA Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Logo Typography */}
            <span
              className="text-2xl font-bold tracking-[0.25em] text-white"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              STAYEA
            </span>
            <span className="text-[10px] tracking-[0.2em] text-emerald-300 font-medium uppercase mt-0.5">
              More Than A Stay
            </span>

            {/* Partner Hub Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PARTNER HUB • CỔNG ĐỐI TÁC & CHỦ NHÀ</span>
            </div>

            <h1 className="text-xl font-bold text-white mt-4 tracking-tight">
              {mode === "login"
                ? "Đăng nhập Cổng Đối tác STAYEA"
                : "Đăng ký Hợp tác Đối tác STAYEA"}
            </h1>
            <p className="text-xs text-slate-300/80 mt-1 max-w-xs">
              {mode === "login"
                ? "Dành cho Chủ nhà, Homestay, Villa, Đơn vị Tour & Phương tiện tại Phú Quốc."
                : "Tham gia mạng lưới đối tác du lịch số hàng đầu Phú Quốc cùng STAYEA."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/60 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === "login"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === "register"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đăng ký đối tác mới
            </button>
          </div>

          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="partner-email"
                  className="block text-xs font-medium text-slate-200 mb-1.5"
                >
                  Email Đối tác / Chủ cơ sở
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="partner-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doitac@stayea.com hoặc email của bạn"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="partner-password"
                    className="text-xs font-medium text-slate-200"
                  >
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Quý đối tác vui lòng liên hệ bộ phận hỗ trợ STAYEA qua Hotline 0921 724 444 hoặc email hi.topmedia.vn@gmail.com để được cấp lại mật khẩu."
                      )
                    }
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="partner-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember-partner"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="remember-partner"
                  className="text-xs text-slate-300 cursor-pointer select-none"
                >
                  Ghi nhớ phiên đăng nhập (7 ngày)
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập vào Partner Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs font-medium text-slate-200 mb-1"
                >
                  Họ tên chủ cơ sở / Người đại diện *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-bizname"
                  className="block text-xs font-medium text-slate-200 mb-1"
                >
                  Tên cơ sở kinh doanh / Homestay / Tour *
                </label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-bizname"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Sunset Villa Phú Quốc"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs font-medium text-slate-200 mb-1"
                  >
                    Số điện thoại *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      required
                      disabled={isLoading}
                      className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-9 pr-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-biztype"
                    className="block text-xs font-medium text-slate-200 mb-1"
                  >
                    Loại hình đối tác
                  </label>
                  <div className="relative flex items-center">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <select
                      id="reg-biztype"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="homestay">Homestay & Villa</option>
                      <option value="transport">Đội Xe & Di chuyển</option>
                      <option value="tour">Tour Trải Nghiệm</option>
                      <option value="other">Dịch vụ khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-medium text-slate-200 mb-1"
                >
                  Email đăng nhập *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@cuaban.com"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-medium text-slate-200 mb-1"
                >
                  Mật khẩu bảo mật (tối thiểu 6 ký tự) *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-10 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang khởi tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký & Bắt đầu kinh doanh</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Cross-portal Navigation Links */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col items-center gap-2 text-center">
            <a
              href="https://stayea.com"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 transition-colors"
            >
              <span>← Quay về trang chủ Stayea.com (Khách hàng)</span>
            </a>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400/80">
            © 2026 STAYEA Partner Network. Hotline Hợp Tác: 0921 724 444
          </p>
        </div>
      </div>
    </div>
  )
}

