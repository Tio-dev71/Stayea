import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getServerUser } from "@/lib/server-user"
import { PartnerLoginPage } from "@/features/auth/components/partner-login-page"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function RegisterPage() {
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
    if (user && user.role !== "ADMIN" && (user as any).role !== "admin") {
      redirect("/hub")
    }
    return <PartnerLoginPage initialMode="register" />
  }

  // 2. Customer portal (stayea.com / www.stayea.com / localhost)
  return <StayeaLandingPage initialPage="register" />
}
