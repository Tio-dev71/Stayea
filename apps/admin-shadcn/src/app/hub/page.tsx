"use client"

import { PartnerPortalPage } from "@/features/partner-portal"
import { stayeaApi } from "@/lib/stayea-api-service"
import { clearAllAuth } from "@/lib/token"

export default function HubPage() {
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

  const handleNavigateAdmin = () => {
    window.open("https://admin.stayea.com/stayea", "_blank")
  }

  return (
    <PartnerPortalPage
      onLogout={handleLogout}
      onNavigateHome={handleNavigateHome}
      onNavigateAdmin={handleNavigateAdmin}
    />
  )
}


