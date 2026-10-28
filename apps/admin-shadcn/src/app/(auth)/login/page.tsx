import { headers } from "next/headers"
import { AdminLoginPage } from "@/features/auth/components/admin-login-page"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function LoginPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const isAdminDomain = host.startsWith("admin.") || host.startsWith("hub.") || host.startsWith("partner.")

  if (isAdminDomain) {
    return <AdminLoginPage />
  }

  return <StayeaLandingPage initialPage="login" />
}
