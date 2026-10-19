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
  { id: "all", label: "Tất cả", count: 24 },
  { id: "customer", label: "Khách hàng", count: 18 },
  { id: "partner", label: "Đối tác", count: 4 },
  { id: "host", label: "Chủ nhà", count: 2 },
  { id: "system", label: "Tin hệ thống", count: 0 },
]

export const MOCK_CONVERSATIONS: readonly ConversationItem[] = [
  {
    id: "conv-1",
    type: "customer",
    name: "Trần Minh Anh",
    avatar: "/about/team-1.jpg",
    lastMessage: "Xin chào, mình muốn hỏi tour 4 đảo...",
    lastTime: "10:24",
    unreadCount: 2,
    isOnline: true,
    phone: "+84 912 345 678",
    email: "minhanh.tran@gmail.com",
    location: "Hà Nội, Việt Nam",
    joinDate: "15/07/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-2",
    type: "customer",
    name: "Nguyễn Thu Hà",
    avatar: "/about/team-2.jpg",
    lastMessage: "Cảm ơn bạn, thông tin rất hữu ích!",
    lastTime: "09:15",
    unreadCount: 1,
    isOnline: false,
    phone: "+84 988 123 456",
    email: "thuha.nguyen@gmail.com",
    location: "TP. Hồ Chí Minh",
    joinDate: "20/06/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-3",
    type: "customer",
    name: "Lê Văn Bình",
    avatar: "/about/team-3.jpg",
    lastMessage: "Tour còn chỗ vào cuối tuần không ạ?",
    lastTime: "Hôm qua",
    isOnline: false,
    phone: "+84 903 456 789",
    email: "binh.le@gmail.com",
    location: "Đà Nẵng",
    joinDate: "05/05/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-4",
    type: "customer",
    name: "Phạm Thị Mai",
    avatar: "/about/team-4.jpg",
    lastMessage: "Mình đã thanh toán rồi ạ.",
    lastTime: "12/08",
    isOnline: true,
    phone: "+84 918 789 012",
    email: "mai.pham@gmail.com",
    location: "Hải Phòng",
    joinDate: "10/04/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-5",
    type: "customer",
    name: "Hoàng Quốc Duy",
    avatar: "/profile/profile-avatar.jpg",
    lastMessage: "Có thể hỗ trợ đổi lịch được không?",
    lastTime: "11/08",
    isOnline: false,
    phone: "+84 977 234 567",
    email: "duy.hoang@gmail.com",
    location: "Cần Thơ",
    joinDate: "18/03/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-6",
    type: "customer",
    name: "Đặng Thảo Vy",
    avatar: "/about/team-2.jpg",
    lastMessage: "Cảm ơn Stayea, chuyến đi rất tuyệt!",
    lastTime: "10/08",
    isOnline: false,
    phone: "+84 934 567 890",
    email: "thaovy.dang@gmail.com",
    location: "Nha Trang",
    joinDate: "02/02/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-7",
    type: "partner",
    name: "Nguyễn Quang Huy",
    avatar: "/about/team-1.jpg",
    lastMessage: "Cho mình xin thêm hình ảnh thực tế.",
    lastTime: "09/08",
    isOnline: false,
    phone: "+84 905 678 123",
    email: "huy.nguyen@dulichphuquoc.vn",
    location: "Phú Quốc",
    joinDate: "12/01/2024",
    roleBadge: "Đối tác",
  },
  {
    id: "conv-8",
    type: "customer",
    name: "Trịnh Thu Trang",
    avatar: "/about/team-3.jpg",
    lastMessage: "Chương trình khuyến mãi còn không?",
    lastTime: "08/08",
    isOnline: true,
    phone: "+84 912 890 234",
    email: "trang.trinh@gmail.com",
    location: "Hà Nội",
    joinDate: "08/08/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-9",
    type: "customer",
    name: "Phạm Gia Hân",
    avatar: "/about/team-4.jpg",
    lastMessage: "Tư vấn giúp mình tour Phú Quốc 3N2Đ.",
    lastTime: "07/08",
    isOnline: false,
    phone: "+84 945 123 789",
    email: "giahan.pham@gmail.com",
    location: "Vũng Tàu",
    joinDate: "25/07/2024",
    roleBadge: "Khách hàng",
  },
  {
    id: "conv-10",
    type: "host",
    name: "Vũ Hoàng Nam",
    avatar: "/profile/profile-avatar.jpg",
    lastMessage: "Mình có thể xuất hóa đơn VAT không?",
    lastTime: "06/08",
    isOnline: false,
    phone: "+84 989 345 678",
    email: "nam.vu@resortphuquoc.com",
    location: "Phú Quốc",
    joinDate: "15/12/2023",
    roleBadge: "Chủ nhà",
  },
]

export const MOCK_TRAN_MINH_ANH_CHAT: readonly ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "customer",
    senderName: "Trần Minh Anh",
    senderAvatar: "/about/team-1.jpg",
    content: "Xin chào, mình muốn hỏi tour 4 đảo Phú Quốc vào cuối tuần này còn chỗ không ạ?",
    time: "10:20",
    status: "seen",
  },
  {
    id: "msg-2",
    senderId: "admin",
    senderName: "Nguyễn Minh",
    senderAvatar: "/profile/profile-avatar.jpg",
    content: `Xin chào anh Minh Anh! 👋
Tour 4 đảo Phú Quốc vào cuối tuần này vẫn còn chỗ ạ.
Anh dự định đi ngày nào và có bao nhiêu người để em tư vấn chi tiết chương trình và giá tốt nhất cho mình ạ?`,
    time: "10:22",
    status: "seen",
  },
  {
    id: "msg-3",
    senderId: "customer",
    senderName: "Trần Minh Anh",
    senderAvatar: "/about/team-1.jpg",
    content: `Mình đi ngày 24/08, 2 người lớn.
Bạn gửi giúp mình lịch trình và giá nhé!`,
    time: "10:24",
    status: "seen",
  },
  {
    id: "msg-4",
    senderId: "admin",
    senderName: "Nguyễn Minh",
    senderAvatar: "/profile/profile-avatar.jpg",
    time: "10:25",
    status: "seen",
    productCard: {
      id: "tour-4-dao-pq",
      title: "Tour 4 đảo Phú Quốc",
      category: "Tour biển đảo",
      imageUrl: "/experience/cano-4-islands.jpg",
      highlights: [
        "Tham quan 4 hòn đảo nổi tiếng",
        "Ăn trưa hải sản trên đảo",
        "Lặn ngắm san hô, chụp ảnh check-in",
      ],
      priceFormatted: "Giá từ 450.000 đ/người",
      linkText: "Xem chi tiết →",
    },
  },
]

export const MOCK_BOOKING_HISTORY: readonly CustomerBookingHistoryItem[] = [
  {
    id: "book-1",
    tourTitle: "Tour 4 đảo Phú Quốc",
    date: "24/08/2024",
    imageUrl: "/experience/cano-4-islands.jpg",
    status: "pending_payment",
    statusLabel: "Chờ thanh toán",
  },
  {
    id: "book-2",
    tourTitle: "Lặn ngắm san hô",
    date: "15/06/2024",
    imageUrl: "/experience/scuba-diving.jpg",
    status: "completed",
    statusLabel: "Hoàn thành",
  },
  {
    id: "book-3",
    tourTitle: "Sunset Sailing",
    date: "10/03/2024",
    imageUrl: "/experience/kayak-rach-vem.jpg",
    status: "completed",
    statusLabel: "Hoàn thành",
  },
]

export const MOCK_CUSTOMER_NOTES: readonly CustomerNoteItem[] = [
  {
    id: "note-1",
    content: "Khách quan tâm tour biển đảo, thường đi cuối tuần.",
    author: "Nguyễn Minh",
    date: "10/08/2024",
  },
]

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
