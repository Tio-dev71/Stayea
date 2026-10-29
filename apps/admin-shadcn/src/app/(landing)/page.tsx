import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/server-user"
import { AdminLoginPage } from "@/features/auth/components/admin-login-page"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function Home() {
  const headersList = await headers()
  const host = (
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    ""
  ).toLowerCase()

  // 1. Partner / Hub portal domain (partner.stayea.com / hub.stayea.com)
  if (host.startsWith("partner.") || host.startsWith("hub.")) {
    redirect("/hub")
  }

  // 2. Dedicated Admin domain (admin.stayea.com)
  // When accessing admin domain root, NEVER show public landing page.
  // If authenticated as ADMIN -> direct to dashboard bookings.
  // Otherwise -> render AdminLoginPage directly.
  if (host.startsWith("admin.")) {
    const user = await getServerUser()
    if (user && (user.role === "ADMIN" || (user as any).role === "admin")) {
      redirect("/stayea/bookings")
    }
    return <AdminLoginPage />
  }

  // 3. Customer portal (stayea.com / localhost)
  return <StayeaLandingPage />
}

