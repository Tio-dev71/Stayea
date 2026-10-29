import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function Page() {
  const headersList = await headers()
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || ""
  const isAdminDomain = host.startsWith("admin.") || host.includes("admin.stayea")

  if (isAdminDomain) {
    redirect("/stayea/settings")
  }

  return <StayeaLandingPage initialPage="settings" />
}
