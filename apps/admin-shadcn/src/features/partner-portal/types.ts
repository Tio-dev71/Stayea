export type BusinessType = "homestay" | "transport" | "tour" | "combo" | "multi"

export interface PartnerProfileData {
  id: string
  userId: string
  businessName: string
  businessType: BusinessType
  contactName: string
  phone: string
  email: string
  address: string
  city: string
  bankName: string
  bankAccount: string
  bankAccountHolder: string
  status: "pending" | "approved" | "rejected" | "suspended"
  commissionRate: string
  rating: string
  totalOrders: number
}

export interface PartnerServiceData {
  id: string
  partnerId: string
  serviceType: "stay" | "transport" | "experience" | "package"
  title: string
  description?: string
  location: string
  price: string
  originalPrice?: string | null
  unit: string
  images: string[]
  attributes: {
    vehicleType?: string
    transmission?: string
    hasDriver?: boolean
    bedrooms?: number
    bathrooms?: number
    maxGuests?: number
    amenities?: string[]
    schedule?: string
    duration?: string
  }
  status: "active" | "inactive" | "pending_approval"
}

export interface PartnerOrderData {
  id: string
  orderCode: string
  partnerId: string
  serviceId: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  serviceTitle: string
  serviceType: string
  startDate: string
  endDate?: string | null
  quantity: number
  unitPrice: string
  totalAmount: string
  commissionAmount: string
  partnerPayoutAmount: string
  status:
    | "pending_admin"
    | "admin_approved"
    | "sent_to_partner"
    | "partner_accepted"
    | "partner_rejected"
    | "in_progress"
    | "completed"
    | "cancelled"
  source: "ai_agent" | "direct_customer" | "admin_manual"
  adminNotes?: string | null
  partnerNotes?: string | null
  rejectionReason?: string | null
  createdAt: string
}

export interface InventorySlotData {
  id: string
  partnerId: string
  serviceId: string
  date: string
  totalSlots: number
  bookedSlots: number
  isAvailable: boolean
  priceOverride?: string | null
  note?: string | null
}
