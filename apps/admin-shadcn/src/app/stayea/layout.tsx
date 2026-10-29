import { getServerUser } from "@/lib/server-user"
import { redirect } from "next/navigation"

export const metadata = {
  title: "STAYEA Admin - Luxury Management Portal",
  description: "Bảng điều khiển quản trị hệ sinh thái du lịch & lưu trú STAYEA",
}

export default async function StayeaAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()
  if (!user || (user.role !== "ADMIN" && (user as any).role !== "admin")) {
    redirect("/login?redirectTo=/stayea/bookings")
  }

  return <>{children}</>
}

