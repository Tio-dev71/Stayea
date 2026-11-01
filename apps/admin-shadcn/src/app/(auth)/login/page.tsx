import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/server-user"
import { AdminLoginPage } from "@/features/auth/components/admin-login-page"
import { PartnerLoginPage } from "@/features/auth/components/partner-login-page"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function LoginPage() {
  const headersList = await headers()
  const host = (
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    ""
  ).toLowerCase()

  // 1. Partner Hub domain (hub.stayea.com / partner.stayea.com)
  const isPartnerDomain =
    host.startsWith("hub.") ||
    host.startsWith("partner.")

  if (isPartnerDomain) {
    const user = await getServerUser()
    if (user) {
      redirect("/hub")
    }
    return <PartnerLoginPage />
  }

  // 2. Admin Console domain (admin.stayea.com)
  const isAdminDomain = host.startsWith("admin.")

  if (isAdminDomain) {
    const user = await getServerUser()
    if (user && (user.role === "ADMIN" || (user as any).role === "admin")) {
      redirect("/stayea/bookings")
    }
    return <AdminLoginPage />
  }

  // 3. Customer portal (stayea.com / www.stayea.com / localhost)
  return <StayeaLandingPage initialPage="login" />
}
