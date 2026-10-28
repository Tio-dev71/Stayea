"use client"

import * as React from "react"
import Image from "next/image"
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"
import { setToken, setUser } from "@/lib/token"

interface AdminLoginPageProps {
  readonly onLoginSuccess?: (user: any) => void
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = React.useState("admin@example.com")
  const [password, setPassword] = React.useState("12345678")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email.")
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
        setErrorMessage(res.error || "Email hoặc mật khẩu không chính xác.")
        setIsLoading(false)
        return
      }

      // Check user role - must be ADMIN
      const user = res.user
      const role = (user?.role || "").toUpperCase()
      if (role !== "ADMIN") {
        setErrorMessage("Truy cập bị từ chối: Tài khoản này không có quyền Quản trị viên (ADMIN).")
        // Clear stored cookies
        stayeaApi.logout()
        setIsLoading(false)
        return
      }

      // Sync tokens in token.ts as well
      if (res.token) {
        setToken(res.token)
      }
      if (user) {
        setUser({ id: user.id, email: user.email, role: "ADMIN" })
      }

      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng vào bảng điều khiển...")

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user)
        } else {
          window.location.href = "/stayea/bookings"
        }
      }, 600)
    } catch (err: any) {
      setErrorMessage(err?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
      setIsLoading(false)
    }
  }

  const handleQuickAdminLogin = () => {
    setEmail("admin@example.com")
    setPassword("12345678")
    // Trigger submit after state update
    setTimeout(() => {
      handleLogin()
    }, 50)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#071d20]">
      {/* 1. Background Image with luxury dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth/auth-villa-bg.jpg"
          alt="STAYEA Luxury Resort"
          fill
          unoptimized
          priority
          className="object-cover object-center scale-105 filter blur-[2px]"
        />
        {/* Deep luxury teal vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071d20]/90 via-[#0c3b40]/85 to-[#051417]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Glow Accent */}
        <div className="mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-xs opacity-75 mb-3" />

        <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 shadow-2xl rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Subtle Corner Decoration */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* Emblem */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b7a4e] to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 mb-3 border border-emerald-300/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>

            {/* Logo Typography */}
            <span
              className="text-2xl font-bold tracking-[0.25em] text-white"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              STAYEA
            </span>
            <span className="text-[10px] tracking-[0.2em] text-emerald-300/90 font-medium uppercase mt-0.5">
              More Than A Stay
            </span>

            {/* Admin Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ADMIN CONSOLE • QUẢN TRỊ VIÊN</span>
            </div>

            <h1 className="text-xl font-bold text-white mt-4 tracking-tight">
              Đăng nhập hệ thống quản trị
            </h1>
            <p className="text-xs text-slate-300/80 mt-1 max-w-xs">
              Quản lý đặt phòng, trải nghiệm, bất động sản và mạng lưới đối tác STAYEA.
            </p>
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

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-slate-200 mb-1.5">
                Email Quản trị viên
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800/90 text-sm text-white placeholder:text-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="text-xs font-medium text-slate-200">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => alert("Vui lòng liên hệ quản trị viên cấp cao CTO để cấp lại mật khẩu.")}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="admin-password"
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
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember-admin"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember-admin" className="text-xs text-slate-300 cursor-pointer select-none">
                Ghi nhớ phiên đăng nhập (7 ngày)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1b7a4e] to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập vào Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đăng nhập nhanh với tài khoản Admin mặc định</span>
            </button>
          </div>

          {/* Footer Back Link */}
          <div className="mt-5 text-center">
            <a
              href="https://stayea.com"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <span>← Quay về trang chủ Stayea.com (Khách hàng)</span>
            </a>
          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400/80">
            © 2026 STAYEA. Hệ thống bảo mật 256-bit SSL. Chỉ dành riêng cho nhân sự quản trị.
          </p>
        </div>
      </div>
    </div>
  )
}
