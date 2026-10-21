"use client"

import * as React from "react"
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowRight, Check } from "lucide-react"
import { stayeaApi } from "@/lib/stayea-api-service"

interface AuthCardProps {
  readonly initialMode?: "login" | "register"
  readonly onAuthSuccess?: (emailOrPhone: string) => void
  readonly onForgotPassword?: () => void
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.88 1.48-.61.71-1.14 1.86-1 2.98 1.08.08 2.23-.55 2.89-1.36z" />
    </svg>
  )
}

export function AuthCard({
  initialMode = "login",
  onAuthSuccess,
  onForgotPassword,
}: AuthCardProps) {
  const [mode, setMode] = React.useState<"login" | "register">(initialMode)
  const [authMethod, setAuthMethod] = React.useState<"email" | "phone">("email")

  // Form states
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [agreeTerms, setAgreeTerms] = React.useState(true)

  // Feedback states
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  // Social Auth Modal States
  const [socialModalProvider, setSocialModalProvider] = React.useState<string | null>(null)
  const [socialEmail, setSocialEmail] = React.useState("")
  const [socialName, setSocialName] = React.useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (authMethod === "email" && !email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email hợp lệ.")
      return
    }

    if (authMethod === "phone" && !phone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại của bạn.")
      return
    }

    if (!password.trim()) {
      setErrorMsg("Vui lòng nhập mật khẩu.")
      return
    }

    if (mode === "register") {
      if (!fullName.trim()) {
        setErrorMsg("Vui lòng nhập họ và tên.")
        return
      }
      if (password !== confirmPassword) {
        setErrorMsg("Mật khẩu xác nhận không khớp.")
        return
      }
      if (!agreeTerms) {
        setErrorMsg("Vui lòng đồng ý với Điều khoản dịch vụ của STAYEA.")
        return
      }
    }

    setLoading(true)
    const identifier = authMethod === "email" ? email : phone
    const normalizedEmail = authMethod === "email" ? email.trim() : `${phone.trim().replaceAll(/[^0-9]/g, '')}@phone.stayea.com`

    try {
      if (mode === "login") {
        const res = await stayeaApi.login(normalizedEmail, password)
        if (res.success) {
          setSuccessMsg(`Đăng nhập thành công! Chào mừng trở lại STAYEA.`)
          setTimeout(() => {
            onAuthSuccess?.(identifier)
          }, 600)
        } else {
          setErrorMsg(res.error || "Tài khoản hoặc mật khẩu không chính xác.")
        }
      } else {
        const res = await stayeaApi.register(normalizedEmail, password, fullName.trim() || identifier)
        if (res.success) {
          setSuccessMsg(`Đăng ký thành công! Chào mừng ${fullName || identifier} đến với STAYEA.`)
          setTimeout(() => {
            onAuthSuccess?.(identifier)
          }, 600)
        } else {
          setErrorMsg(res.error || "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.")
        }
      }
    } catch {
      setErrorMsg("Đã xảy ra lỗi khi kết nối. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  function handleSocialLogin(provider: string) {
    setErrorMsg(null)
    setSuccessMsg(null)
    setSocialEmail(email.trim())
    setSocialName(fullName.trim() || "")
    setSocialModalProvider(provider)
  }

  async function handleConfirmSocial(e: React.FormEvent) {
    e.preventDefault()
    if (!socialEmail.trim()) {
      setErrorMsg(`Vui lòng nhập email ${socialModalProvider} hợp lệ.`)
      return
    }
    setLoading(true)
    setErrorMsg(null)
    try {
      const p = socialModalProvider?.toLowerCase() === "github" ? "github" : "google"
      const displayName = socialName.trim() || socialEmail.split("@")[0] || "Thành viên STAYEA"
      const res = await stayeaApi.socialLogin(p, socialEmail.trim(), displayName)
      if (res.success) {
        setSuccessMsg(`Đăng nhập thành công với tài khoản ${socialModalProvider}! Chào mừng ${displayName}.`)
        setSocialModalProvider(null)
        setTimeout(() => {
          onAuthSuccess?.(socialEmail.trim())
        }, 500)
      } else {
        setErrorMsg(res.error || `Đăng nhập qua ${socialModalProvider} thất bại.`)
      }
    } catch {
      setErrorMsg(`Lỗi kết nối khi xác thực qua ${socialModalProvider}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[490px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/70 relative z-20">
      {/* 1. Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2239] tracking-tight">
          {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
        </h2>
        <div className="text-sm font-bold text-slate-800 mt-1.5">
          {mode === "login"
            ? "Chào mừng bạn trở lại STAYEA"
            : "Trở thành thành viên STAYEA"}
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          {mode === "login"
            ? "Tiếp tục khám phá những điểm đến tuyệt vời tại Phú Quốc và hơn thế nữa."
            : "Lên kế hoạch, nhận ưu đãi độc quyền và trải nghiệm kỳ nghỉ tuyệt mỹ."}
        </p>
      </div>

      {/* 2. Method Switcher Tabs (Email vs Phone) */}
      <div className="flex items-center border-b border-slate-200 mb-6 text-xs sm:text-sm font-medium">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("email")
            setErrorMsg(null)
          }}
          className={`flex-1 pb-3 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs sm:text-[13px] transition-colors relative ${
            authMethod === "email"
              ? "text-[#0A2239] font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span>
            {mode === "login" ? "Đăng nhập bằng email" : "Đăng ký bằng email"}
          </span>
          {authMethod === "email" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A2239] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMethod("phone")
            setErrorMsg(null)
          }}
          className={`flex-1 pb-3 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs sm:text-[13px] transition-colors relative ${
            authMethod === "phone"
              ? "text-[#0A2239] font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>
            {mode === "login"
              ? "Đăng nhập bằng số điện thoại"
              : "Đăng ký bằng số điện thoại"}
          </span>
          {authMethod === "phone" && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A2239] rounded-full" />
          )}
        </button>
      </div>

      {/* 3. Notification Messages */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 4. Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name field (Register only) */}
        {mode === "register" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all"
              />
            </div>
          </div>
        )}

        {/* Email or Phone Field */}
        {authMethod === "email" ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại của bạn (VD: 0912 345 678)"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Mật khẩu <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password (Register only) */}
        {mode === "register" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Xác nhận mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu của bạn"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239] transition-all"
              />
            </div>
          </div>
        )}

        {/* Remember me & Forgot Password */}
        {mode === "login" ? (
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-[#0A2239] accent-[#0A2239] focus:ring-[#0A2239]"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Quên mật khẩu?
            </button>
          </div>
        ) : (
          <div className="text-xs pt-0.5">
            <label className="flex items-start gap-2 cursor-pointer select-none text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-[#0A2239] accent-[#0A2239] focus:ring-[#0A2239] mt-0.5"
              />
              <span>
                Tôi đồng ý với{" "}
                <span className="font-semibold text-blue-600 underline">
                  Điều khoản dịch vụ
                </span>{" "}
                và{" "}
                <span className="font-semibold text-blue-600 underline">
                  Chính sách bảo mật
                </span>{" "}
                của STAYEA.
              </span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-75"
          >
            <span>
              {loading
                ? "Đang xử lý..."
                : mode === "login"
                  ? "Đăng nhập"
                  : "Đăng ký tài khoản"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* 5. Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {mode === "login" ? "Hoặc đăng nhập với" : "Hoặc đăng ký với"}
        </span>
      </div>

      {/* 6. Social Auth Buttons */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSocialLogin("Google")}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-[0.98]"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("Facebook")}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-[0.98]"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin("Apple")}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-[0.98]"
        >
          <AppleIcon />
          <span>Apple</span>
        </button>
      </div>

      {/* Real Social Authentication Modal */}
      {socialModalProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSocialModalProvider(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-2 border border-slate-100">
                {socialModalProvider === "Google" ? (
                  <GoogleIcon />
                ) : socialModalProvider === "Facebook" ? (
                  <FacebookIcon />
                ) : (
                  <AppleIcon />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Đăng nhập bằng {socialModalProvider}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kết nối tài khoản thật vào hệ thống STAYEA
              </p>
            </div>

            <form onSubmit={handleConfirmSocial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ Email {socialModalProvider} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  placeholder={`vidu@${socialModalProvider.toLowerCase()}.com`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên hiển thị (tùy chọn)
                </label>
                <input
                  type="text"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  placeholder="Tên của bạn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-75"
                >
                  <span>{loading ? "Đang xử lý..." : "Tiếp tục"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Bottom Switch Mode Link */}
      <div className="text-center text-xs text-slate-600">
        {mode === "login" ? (
          <>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Đăng ký ngay
            </button>
          </>
        ) : (
          <>
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setErrorMsg(null)
                setSuccessMsg(null)
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Đăng nhập ngay
            </button>
          </>
        )}
      </div>
    </div>
  )
}
