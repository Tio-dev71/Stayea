import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/server-user"
import { AdminLoginPage } from "@/features/auth/components/admin-login-page"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function LoginPage() {
  const headersList = await headers()
  const host = (
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    ""
  ).toLowerCase()

  const isAdminDomain =
    host.startsWith("admin.") ||
    host.startsWith("hub.") ||
    host.startsWith("partner.")

  if (isAdminDomain) {
    const user = await getServerUser()
    if (user && (user.role === "ADMIN" || (user as any).role === "admin")) {
      redirect("/stayea/bookings")
    }
    return <AdminLoginPage />
  }

  return <StayeaLandingPage initialPage="login" />
}
