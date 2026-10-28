import { headers } from "next/headers"
import { StayeaLandingPage } from "@/features/landing/stayea-landing-page"

export default async function Home() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const isAdminDomain = host.startsWith("admin.") || host.startsWith("hub.") || host.startsWith("partner.")

  return <StayeaLandingPage isAdminPortal={isAdminDomain} />
}
