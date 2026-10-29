import { StayeaAdminSettingsPage } from "@/features/admin-settings"

export const metadata = {
  title: "Stayea Admin - Cài đặt hệ thống",
  description: "Cấu hình chính sách, cổng thanh toán, thông báo và bảo mật StayEA",
}

export default function StayeaAdminSettingsRoute() {
  return <StayeaAdminSettingsPage />
}

