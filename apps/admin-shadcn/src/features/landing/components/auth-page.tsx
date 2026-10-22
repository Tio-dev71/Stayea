"use client"

import * as React from "react"
import { X, Check, Mail, ArrowRight } from "lucide-react"
import { AuthHeroSection } from "./auth-hero-section"
import { AuthStayaClubBanner } from "./auth-staya-club-banner"
import { AuthOnboardingSteps } from "./auth-onboarding-steps"

interface AuthPageProps {
  readonly initialMode?: "login" | "register"
  readonly onNavigate?: (target: string) => void
}

export function AuthPage({
  initialMode = "login",
  onNavigate,
}: AuthPageProps) {
  const [showForgotModal, setShowForgotModal] = React.useState(false)
  const [showClubModal, setShowClubModal] = React.useState(false)
  const [forgotEmail, setForgotEmail] = React.useState("")
  const [forgotSent, setForgotSent] = React.useState(false)

  function handleSendForgot(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotSent(true)
    setTimeout(() => {
      setShowForgotModal(false)
      setForgotSent(false)
      setForgotEmail("")
    }, 2500)
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Hero Section with Background, Calligraphy, Auth Card and Side Badges */}
      <AuthHeroSection
        initialMode={initialMode}
        onAuthSuccess={(_user) => {
          // Redirect or notify
          setTimeout(() => {
            if (typeof window !== "undefined") {
              const params = new URLSearchParams(window.location.search)
              const redirectTo = params.get("redirectTo")
              if (redirectTo) {
                window.location.href = redirectTo
                return
              }
            }
            if (onNavigate) {
              onNavigate("profile")
            } else {
              window.location.hash = "home"
            }
          }, 1200)
        }}
        onForgotPassword={() => setShowForgotModal(true)}
      />

      {/* 2. Staya Club Callout Banner */}
      <AuthStayaClubBanner onLearnMore={() => setShowClubModal(true)} />

      {/* 3. "Bạn mới đến với STAYEA?" Onboarding Steps */}
      <AuthOnboardingSteps />

      {/* Modal: Quên mật khẩu (Forgot Password) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false)
                setForgotSent(false)
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Khôi phục mật khẩu</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nhập email hoặc số điện thoại đã đăng ký để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center flex flex-col items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>
                  Đã gửi hướng dẫn khôi phục mật khẩu tới{" "}
                  <strong className="underline">{forgotEmail}</strong>. Vui lòng kiểm tra hộp thư!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSendForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email hoặc số điện thoại
                  </label>
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="example@gmail.com hoặc 09..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0A2239] focus:ring-1 focus:ring-[#0A2239]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#0A2239] hover:bg-[#071626] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Gửi yêu cầu khôi phục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tham gia Staya Club */}
      {showClubModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#FDE6C8] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-center">
            <button
              type="button"
              onClick={() => setShowClubModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Đặc quyền hội viên Staya Club
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Tài khoản hội viên nhận ngay voucher giảm 10% cho kỳ nghỉ đầu tiên, tích luỹ điểm đổi đêm nghỉ miễn phí và hỗ trợ chuyên biệt 24/7.
            </p>

            <button
              type="button"
              onClick={() => setShowClubModal(false)}
              className="w-full h-11 rounded-xl bg-[#0A2239] text-white text-xs sm:text-sm font-semibold hover:bg-[#071626] transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
