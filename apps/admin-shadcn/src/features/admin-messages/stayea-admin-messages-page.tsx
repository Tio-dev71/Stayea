"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import type {
  ConversationItem,
  ConversationTabType,
  ChatMessage,
  CustomerNoteItem,
} from "./stayea-admin-messages-mock-data"
import {
  MOCK_CONVERSATIONS,
  MOCK_TRAN_MINH_ANH_CHAT,
  MOCK_CUSTOMER_NOTES,
  MOCK_BOOKING_HISTORY,
  MOCK_MESSAGE_QUICK_ACTIONS,
} from "./stayea-admin-messages-mock-data"
import { MessagesChatList } from "./components/messages-chat-list"
import { MessagesChatConversation } from "./components/messages-chat-conversation"
import { MessagesCustomerProfile } from "./components/messages-customer-profile"
import { ComposeMessageModal } from "./components/compose-message-modal"
import { AddNoteModal } from "./components/add-note-modal"

interface StayeaAdminMessagesPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
}

export function StayeaAdminMessagesPage({
  onNavigateLanding,
  onNavigateTab,
}: StayeaAdminMessagesPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<ConversationItem[]>([
    ...MOCK_CONVERSATIONS,
  ])
  const [activeConversationId, setActiveConversationId] = useState("conv-1")
  const [activeTab, setActiveTab] = useState<ConversationTabType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Chat messages state for active conversation
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({
    "conv-1": [...MOCK_TRAN_MINH_ANH_CHAT],
  })

  // Notes state
  const [notes, setNotes] = useState<CustomerNoteItem[]>([
    ...MOCK_CUSTOMER_NOTES,
  ])

  // Modals
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)

  // Current active conversation
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConversationId) ||
      conversations[0] || {
        id: "conv-1",
        type: "customer" as const,
        name: "Trần Minh Anh",
        avatar: "/about/team-1.jpg",
        lastMessage: "Xin chào, mình muốn hỏi tour 4 đảo...",
        lastTime: "10:24",
        phone: "+84 912 345 678",
        email: "minhanh.tran@gmail.com",
        location: "Hà Nội, Việt Nam",
        joinDate: "15/07/2024",
        roleBadge: "Khách hàng",
      }
    )
  }, [conversations, activeConversationId])

  // Filtered conversations list
  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.type !== activeTab) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(query)
        const matchMessage = item.lastMessage.toLowerCase().includes(query)
        const matchPhone = item.phone.toLowerCase().includes(query)
        if (!matchName && !matchMessage && !matchPhone) return false
      }

      return true
    })
  }, [conversations, activeTab, searchQuery])

  // Handlers
  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "Nguyễn Minh",
      senderAvatar: "/profile/profile-avatar.jpg",
      content: text,
      time: "Vừa xong",
      status: "sent",
    }

    setMessagesMap((prev) => ({
      ...prev,
      [activeConversation.id]: [
        ...(prev[activeConversation.id] || []),
        newMessage,
      ],
    }))

    // Update last message in conversation list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: text,
              lastTime: "Vừa xong",
              unreadCount: 0,
            }
          : c
      )
    )
  }

  const handleComposeNewMessage = (contactId: string, messageText: string) => {
    setActiveConversationId(contactId)
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "Nguyễn Minh",
      senderAvatar: "/profile/profile-avatar.jpg",
      content: messageText,
      time: "Vừa xong",
      status: "sent",
    }

    setMessagesMap((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }))

    toast.success("Đã gửi tin nhắn thành công!")
  }

  const handleAddNote = (noteContent: string) => {
    const newNote: CustomerNoteItem = {
      id: `note-${Date.now()}`,
      content: noteContent,
      author: "Nguyễn Minh",
      date: "Hôm nay",
    }
    setNotes((prev) => [newNote, ...prev])
    toast.success("Đã lưu ghi chú cho khách hàng!")
  }

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "create_booking":
        toast.info("Tạo đơn đặt chỗ", {
          description: `Đang khởi tạo đơn đặt chỗ cho ${activeConversation.name}...`,
        })
        break
      case "send_offer": {
        // Send a voucher/promotion card into current chat
        const promoMsg: ChatMessage = {
          id: `msg-promo-${Date.now()}`,
          senderId: "admin",
          senderName: "Nguyễn Minh",
          senderAvatar: "/profile/profile-avatar.jpg",
          content: `Dạ gửi anh ${activeConversation.name} mã ưu đãi đặc biệt giảm 15% (Mã: STAYEAPQ15) áp dụng cho tour và trải nghiệm tại Phú Quốc cuối tuần này ạ! 🎁`,
          time: "Vừa xong",
          status: "sent",
        }
        setMessagesMap((prev) => ({
          ...prev,
          [activeConversation.id]: [
            ...(prev[activeConversation.id] || []),
            promoMsg,
          ],
        }))
        toast.success("Đã gửi mã ưu đãi riêng vào đoạn chat!")
        break
      }
      case "send_email":
        toast.info("Soạn email", {
          description: `Mở trình gửi email đến ${activeConversation.email}...`,
        })
        break
      case "add_group":
        toast.info("Thêm vào nhóm", {
          description: `Đã phân loại ${activeConversation.name} vào nhóm "Khách VIP Tour Đảo".`,
        })
        break
      case "block_user":
        toast.error("Chặn người dùng", {
          description: `Đã tạm ngưng nhận tin nhắn từ ${activeConversation.name}.`,
        })
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Header */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm tour, trải nghiệm, địa điểm, đối tác..."
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(query) => {
          if (query.trim()) {
            setSearchQuery(query)
            toast.info(`Tìm kiếm: "${query}"`, {
              description: "Đang lọc danh sách tin nhắn...",
            })
          }
        }}
      />

      {/* 2. Main Body */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="tin-nhan"
            promoTitle="Phú Quốc"
            promoSubtitle="Trải nghiệm vạn điều thú vị"
            promoButtonText="Khám phá ngay"
            onSelectTab={(tabId) => {
              if (onNavigateTab) {
                onNavigateTab(tabId)
              }
            }}
            onExplorePhuQuoc={() => {
              window.location.hash = "phu-quoc"
              onNavigateLanding?.()
            }}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-7 py-5">
          <div className="max-w-[1600px] w-full mx-auto space-y-4">
            {/* Page Title & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  Tin nhắn
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Quản lý và phản hồi tin nhắn từ khách hàng, đối tác và chủ nhà trên Stayea.
                </p>
              </div>

              {/* Action Button: + Tin nhắn mới */}
              <button
                type="button"
                onClick={() => setIsComposeOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#007a48] hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
                <span>Tin nhắn mới</span>
              </button>
            </div>

            {/* 3-Column Inbox Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Column 1: Conversations List (3.2 cols on xl, 4 cols on lg) */}
              <div className="lg:col-span-4 xl:col-span-3">
                <MessagesChatList
                  conversations={filteredConversations}
                  activeConversationId={activeConversation.id}
                  onSelectConversation={(id) => {
                    setActiveConversationId(id)
                    // Mark as read
                    setConversations((prev) =>
                      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                    )
                  }}
                  activeTab={activeTab}
                  onSelectTab={setActiveTab}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onToggleFilter={() =>
                    toast.info("Lọc nâng cao", {
                      description: "Lọc theo trạng thái trực tuyến hoặc tin chưa đọc.",
                    })
                  }
                />
              </div>

              {/* Column 2: Active Conversation Thread (5.8 cols on xl, 5 cols on lg) */}
              <div className="lg:col-span-5 xl:col-span-6">
                <MessagesChatConversation
                  conversation={activeConversation}
                  messages={
                    messagesMap[activeConversation.id] || [
                      {
                        id: "initial-msg",
                        senderId: "customer",
                        senderName: activeConversation.name,
                        senderAvatar: activeConversation.avatar,
                        content: activeConversation.lastMessage,
                        time: activeConversation.lastTime,
                        status: "seen",
                      },
                    ]
                  }
                  onSendMessage={handleSendMessage}
                  onCallPhone={() =>
                    toast.info(`Đang kết nối cuộc gọi đến ${activeConversation.phone}...`)
                  }
                  onVideoCall={() =>
                    toast.info(`Đang khởi tạo cuộc gọi video với ${activeConversation.name}...`)
                  }
                  onMoreOptions={() =>
                    toast.info("Tùy chọn cuộc trò chuyện", {
                      description: "Ghim tin nhắn, tìm kiếm trong đoạn chat hoặc tắt thông báo.",
                    })
                  }
                  onViewProductDetails={(productId) =>
                    toast.info(`Xem chi tiết dịch vụ: ${productId}`, {
                      description: "Mở thông tin lịch trình và bảng giá trải nghiệm.",
                    })
                  }
                  onAttachFile={() =>
                    toast.info("Chọn tệp tài liệu để gửi đính kèm")
                  }
                  onAttachImage={() =>
                    toast.info("Chọn hình ảnh từ thiết bị để gửi")
                  }
                  onOpenEmoji={() =>
                    toast.info("Mở bảng biểu tượng cảm xúc")
                  }
                />
              </div>

              {/* Column 3: Customer Profile & Context (3 cols on xl, 3 cols on lg) */}
              <div className="lg:col-span-3 xl:col-span-3">
                <MessagesCustomerProfile
                  conversation={activeConversation}
                  bookingHistory={MOCK_BOOKING_HISTORY}
                  notes={notes}
                  quickActions={MOCK_MESSAGE_QUICK_ACTIONS}
                  onViewAllBookings={() => {
                    window.location.hash = "admin-bookings"
                    onNavigateTab?.("dat-phong")
                  }}
                  onAddNote={() => setIsAddNoteOpen(true)}
                  onQuickAction={handleQuickAction}
                  onMoreProfileOptions={() =>
                    toast.info("Tùy chọn hồ sơ", {
                      description: "Xem lịch sử hoạt động và chỉnh sửa thông tin liên hệ.",
                    })
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <StayeaAdminFooter />

      {/* Compose New Message Modal */}
      <ComposeMessageModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        contacts={conversations}
        onSendMessage={handleComposeNewMessage}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteOpen}
        customerName={activeConversation.name}
        onClose={() => setIsAddNoteOpen(false)}
        onSaveNote={handleAddNote}
      />
    </div>
  )
}
