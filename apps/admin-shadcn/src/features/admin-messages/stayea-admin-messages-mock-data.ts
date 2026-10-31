export type ConversationTabType = "all" | "customer" | "partner" | "host" | "system"

export interface ConversationItem {
  id: string
  type: ConversationTabType
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unreadCount?: number
  isOnline?: boolean
  phone: string
  email: string
  location: string
  joinDate: string
  roleBadge: string
}

export interface ChatMessage {
  id: string
  senderId: "customer" | "admin"
  senderName: string
  senderAvatar: string
  content?: string
  time: string
  status?: "sent" | "delivered" | "seen"
  productCard?: {
    id: string
    title: string
    category: string
    imageUrl: string
    highlights: string[]
    priceFormatted: string
    linkText: string
  }
}

export interface CustomerBookingHistoryItem {
  id: string
  tourTitle: string
  date: string
  imageUrl: string
  status: "pending_payment" | "completed" | "cancelled"
  statusLabel: string
}

export interface CustomerNoteItem {
  id: string
  content: string
  author: string
  date: string
}

export interface MessageQuickActionItem {
  id: string
  label: string
  icon: "create_booking" | "send_offer" | "send_email" | "add_group" | "block_user"
  isDestructive?: boolean
}

export const CONVERSATION_TABS: readonly { id: ConversationTabType; label: string; count: number }[] = [
  { id: "all", label: "Tất cả", count: 0 },
  { id: "customer", label: "Khách hàng", count: 0 },
  { id: "partner", label: "Đối tác", count: 0 },
  { id: "host", label: "Chủ nhà", count: 0 },
  { id: "system", label: "Tin hệ thống", count: 0 },
]

export const MOCK_CONVERSATIONS: readonly ConversationItem[] = []

export const MOCK_TRAN_MINH_ANH_CHAT: readonly ChatMessage[] = []

export const MOCK_BOOKING_HISTORY: readonly CustomerBookingHistoryItem[] = []

export const MOCK_CUSTOMER_NOTES: readonly CustomerNoteItem[] = []

export const MOCK_MESSAGE_QUICK_ACTIONS: readonly MessageQuickActionItem[] = [
  {
    id: "create_booking",
    label: "Tạo đơn đặt chỗ",
    icon: "create_booking",
  },
  {
    id: "send_offer",
    label: "Gửi ưu đãi riêng",
    icon: "send_offer",
  },
  {
    id: "send_email",
    label: "Gửi email",
    icon: "send_email",
  },
  {
    id: "add_group",
    label: "Thêm vào nhóm",
    icon: "add_group",
  },
  {
    id: "block_user",
    label: "Chặn người dùng",
    icon: "block_user",
    isDestructive: true,
  },
]
