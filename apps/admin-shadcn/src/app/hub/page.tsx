"use client"

import { useEffect, useState } from "react"
import { PartnerPortalPage } from "@/features/partner-portal"
import { stayeaApi } from "@/lib/stayea-api-service"
import { clearAllAuth, getUser } from "@/lib/token"
import { toast } from "sonner"

export default function HubPage() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u || !u.email) {
      window.location.href = "/login"
      return
    }

    // Role Guard: Tài khoản Quản trị viên (ADMIN) không được phép dùng Cổng Đối tác
    if (u.role === "ADMIN" || (u as any).role === "admin") {
      clearAllAuth()
      toast.error(
        "Tài khoản Quản trị viên (ADMIN) không dùng cho Cổng Đối tác. Vui lòng truy cập Cổng Quản trị tại https://admin.stayea.com."
      )
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
      return
    }

    setIsAuth(true)
    setCheckingAuth(false)
  }, [])

  const handleLogout = async () => {
    try {
      await stayeaApi.logout()
    } catch {}
    clearAllAuth()
    window.location.href = "/login"
  }

  const handleNavigateHome = () => {
    window.open("https://stayea.com", "_blank")
  }

  if (checkingAuth || !isAuth) {
    return (
      <div className="min-h-screen bg-[#070e0d] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Đang kiểm tra quyền truy cập Partner Hub...</p>
        </div>
      </div>
    )
  }

  return (
    <PartnerPortalPage
      onLogout={handleLogout}
      onNavigateHome={handleNavigateHome}
    />
  )
}
