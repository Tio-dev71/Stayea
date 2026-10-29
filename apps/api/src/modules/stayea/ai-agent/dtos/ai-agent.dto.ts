export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool"
  content: string
  name?: string
  tool_call_id?: string
}

export interface CustomerContext {
  name?: string
  phone?: string
  email?: string
}

export class AiChatRequestDto {
  messages!: ChatMessage[]
  customerContext?: CustomerContext
  stream?: boolean
}

export interface BookingPreviewCard {
  orderCode: string
  serviceTitle: string
  serviceType: string
  customerName: string
  customerPhone: string
  startDate: string
  endDate?: string | null
  quantity: number
  totalAmount: number
  status: "pending_admin"
  note?: string
}

export interface AiChatResponse {
  reply: string
  bookingCreated?: BookingPreviewCard | null
  suggestedActions?: string[]
}
