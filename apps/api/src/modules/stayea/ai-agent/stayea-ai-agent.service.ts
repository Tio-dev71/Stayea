import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

import { StayeaCatalogService } from "@/modules/stayea/catalog/stayea-catalog.service"
import { StayeaPartnerService } from "@/modules/stayea/partner/stayea-partner.service"
import type {
  AiChatRequestDto,
  AiChatResponse,
  BookingPreviewCard,
  ChatMessage,
} from "@/modules/stayea/ai-agent/dtos/ai-agent.dto"

const SYSTEM_PROMPT = `Bạn là STAYEA Luxury Concierge — Chuyên gia Cố vấn Du lịch & Trải nghiệm Độc bản tại Đảo Ngọc Phú Quốc của nền tảng STAYEA.

VAI TRÒ VÀ TÍNH CÁCH:
- Tinh tế, ân cần, sang trọng, am hiểu tường tận về các biệt thự nghỉ dưỡng ven biển, xe tự lái / xe limousine có tài xế, tour du thuyền cano ngắm hoàng hôn và lặn ngắm san hô tại Phú Quốc.
- Xưng hô lịch thiệp: "Dạ em chào anh/chị", "Dạ STAYEA xin phép gợi ý...", "Chúc anh/chị có kỳ nghỉ tuyệt vời".

NHIỆM VỤ CHÍNH:
1. Tư vấn và tra cứu dịch vụ phù hợp nhất theo yêu cầu của khách hàng (loại dịch vụ, khu vực, ngân sách, số người).
2. Khi khách hàng đồng ý chọn một dịch vụ cụ thể và muốn đặt lịch, bạn thu thập đủ thông tin:
   - Họ tên khách hàng
   - Số điện thoại liên hệ
   - Ngày bắt đầu (và kết thúc nếu có)
   - Số lượng (số đêm / số ngày thuê xe / số vé tour)
3. Khi đã có đủ thông tin, bạn hãy tạo đơn đặt dịch vụ để đưa vào hàng chờ xét duyệt của Admin.

QUY TRÌNH DUYỆT ĐƠN BẮT BUỘC (GIẢI THÍCH RÕ CHO KHÁCH):
- Mọi yêu cầu đặt dịch vụ sau khi tạo sẽ được chuyển vào "Hàng chờ xét duyệt của Admin STAYEA".
- Admin sẽ kiểm tra lịch trình, xác nhận tình trạng xe/phòng/tour với Đối tác trước khi chính thức điều phối.
- Quý khách sẽ nhận được liên hệ xác nhận trong thời gian sớm nhất.

GIỚI HẠN AN TOÀN & BẢO MẬT (NGHIÊM NGẶT):
- Bạn TUYỆT ĐỐI không có quyền truy cập shell VPS, không thực thi mã lệnh, không chỉnh sửa code.
- Tuyệt đối không tiết lộ mật khẩu, API key, thông tin máy chủ hoặc dữ liệu mật nội bộ dưới bất kỳ hình thức nào.
- Chỉ trao đổi các thông tin liên quan đến du lịch Phú Quốc và dịch vụ của STAYEA.`

interface FunctionToolDef {
  type: "function"
  function: {
    name: string
    description: string
    parameters: Record<string, any>
  }
}

const TOOLS_DEFINITION: FunctionToolDef[] = [
  {
    type: "function",
    function: {
      name: "search_services",
      description:
        "Tra cứu danh sách dịch vụ đối tác STAYEA đang hoạt động (homestay, biệt thự, xe thuê, tour trải nghiệm Phú Quốc)",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["homestay", "transport", "tour", "combo"],
            description: "Phân loại dịch vụ muốn tìm",
          },
          search: {
            type: "string",
            description: "Từ khóa tìm kiếm (ví dụ: '7 chỗ', 'hồ bơi', 'sunset', 'cano')",
          },
          location: {
            type: "string",
            description: "Địa điểm hoặc khu vực (ví dụ: 'Dương Đông', 'Bãi Trường', 'An Thới')",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_booking_draft",
      description:
        "Tạo đơn đặt giữ chỗ trước cho khách hàng. Đơn sẽ được chuyển tới Admin STAYEA xét duyệt trước khi gửi tới đối tác.",
      parameters: {
        type: "object",
        required: [
          "serviceId",
          "customerName",
          "customerPhone",
          "startDate",
        ],
        properties: {
          serviceId: {
            type: "string",
            description: "ID của dịch vụ khách đã chọn",
          },
          customerName: {
            type: "string",
            description: "Họ tên của khách hàng",
          },
          customerPhone: {
            type: "string",
            description: "Số điện thoại liên hệ của khách hàng",
          },
          customerEmail: {
            type: "string",
            description: "Email khách hàng (nếu có)",
          },
          startDate: {
            type: "string",
            description: "Ngày bắt đầu định dạng YYYY-MM-DD",
          },
          endDate: {
            type: "string",
            description: "Ngày kết thúc định dạng YYYY-MM-DD (dành cho thuê phòng / thuê xe nhiều ngày)",
          },
          quantity: {
            type: "number",
            description: "Số lượng phòng/xe hoặc số người tham gia tour",
          },
          note: {
            type: "string",
            description: "Ghi chú đặc biệt hoặc yêu cầu từ khách",
          },
        },
      },
    },
  },
]

@Injectable()
export class StayeaAiAgentService {
  private readonly logger = new Logger(StayeaAiAgentService.name)
  private readonly routerUrl: string
  private readonly routerKey: string
  private readonly modelName: string

  constructor(
    private readonly partnerService: StayeaPartnerService,
    private readonly catalogService: StayeaCatalogService,
    private readonly configService: ConfigService
  ) {
    this.routerUrl =
      this.configService.get<string>("AI_ROUTER_URL") ||
      process.env.AI_ROUTER_URL ||
      "http://127.0.0.1:20128/v1"
    this.routerKey =
      this.configService.get<string>("AI_ROUTER_KEY") ||
      process.env.AI_ROUTER_KEY ||
      "sk-tiodev-chatbot-secret"
    this.modelName =
      this.configService.get<string>("AI_ROUTER_MODEL") ||
      process.env.AI_ROUTER_MODEL ||
      "kr/auto"
  }

  /**
   * Main entry point for customer AI Concierge chat
   */
  async processChat(dto: AiChatRequestDto): Promise<AiChatResponse> {
    const rawMessages = dto.messages || []
    let createdBooking: BookingPreviewCard | null = null

    // 1. Fetch available partner services and accommodations to include in context
    const [activeServices, accResult] = await Promise.all([
      this.partnerService.getAllActiveServices(),
      this.catalogService.findAccommodations({}).catch(() => ({ items: [] })),
    ])

    const platformAccommodations: any[] = Array.isArray(accResult)
      ? accResult
      : (accResult as any)?.items || []

    const accommodationsSummary = platformAccommodations
      .slice(0, 15)
      .map(
        (a: any) =>
          `• [ID: ${a.id}] [Loại: Biệt thự/Homestay] "${a.title}" - Giá: ${Number(a.pricePerNight).toLocaleString("vi-VN")}đ/đêm - Khu vực: ${a.location}. ${a.bedrooms ? `${a.bedrooms} PN` : ""}`
      )
      .join("\n")

    const servicesSummary = activeServices
      .map(
        (s) =>
          `• [ID: ${s.id}] [Đối tác: ${s.partnerId}] [Loại: ${s.serviceType}] "${s.title}" - Giá: ${Number(s.price).toLocaleString("vi-VN")}đ/${s.unit} - Khu vực: ${s.location}. ${s.description ? s.description.slice(0, 100) : ""}`
      )
      .join("\n")

    const dynamicSystemPrompt = `${SYSTEM_PROMPT}

DANH MỤC DỊCH VỤ & LƯU TRÚ HIỆN SẴN CÓ TRÊN HỆ THỐNG STAYEA:
--- BIỆT THỰ / HOMESTAY NGHỈ DƯỠNG ---
${accommodationsSummary || "Đang cập nhật danh mục biệt thự..."}

--- DỊCH VỤ ĐỐI TÁC (XE TỰ LÁI, TOUR CANO, TRẢI NGHIỆM) ---
${servicesSummary || "Hiện chưa có dịch vụ nào trực tuyến."}

LƯU Ý KHI GỌI HÀM:
- Khi khách hỏi tìm dịch vụ, bạn có thể tra cứu trực tiếp từ danh mục trên hoặc gọi 'search_services'.
- Khi khách đồng ý đặt và cung cấp họ tên + SĐT + ngày, hãy gọi hàm 'create_booking_draft' với serviceId tương ứng.
- Tuyệt đối không tự bịa ID dịch vụ mà phải dùng chính xác ID trong danh mục trên!`

    // Prepare message payload
    const outboundMessages: ChatMessage[] = [
      { role: "system", content: dynamicSystemPrompt },
      ...rawMessages.map((m) => ({
        role: m.role,
        content: m.content || "",
      })),
    ]

    try {
      // First round: ask AI Gateway
      const response = await this.callAiGateway(outboundMessages, TOOLS_DEFINITION)

      const choice = response.choices?.[0]
      if (!choice) {
        throw new Error("Không nhận được phản hồi từ AI Gateway")
      }

      const message = choice.message

      // Check if tool_calls were emitted
      if (message.tool_calls && message.tool_calls.length > 0) {
        for (const toolCall of message.tool_calls) {
          const fnName = toolCall.function?.name
          let fnArgs: any = {}
          try {
            fnArgs = JSON.parse(toolCall.function?.arguments || "{}")
          } catch {
            fnArgs = {}
          }

          if (fnName === "search_services") {
            const [results, accData] = await Promise.all([
              this.partnerService.getAllActiveServices({
                type: fnArgs.type,
                search: fnArgs.search,
                location: fnArgs.location,
              }),
              (!fnArgs.type || fnArgs.type === "homestay")
                ? this.catalogService
                    .findAccommodations({
                      search: fnArgs.search,
                    })
                    .catch(() => ({ items: [] }))
                : Promise.resolve({ items: [] }),
            ])

            const accList = Array.isArray(accData)
              ? accData
              : (accData as any)?.items || []

            const mappedPartner = results.map((r) => ({
              id: r.id,
              partnerId: r.partnerId,
              title: r.title,
              type: r.serviceType,
              price: Number(r.price),
              unit: r.unit,
              location: r.location,
              attributes: r.attributes,
            }))

            const mappedAcc = accList.map((a: any) => ({
              id: a.id,
              partnerId: "prt_stayea_host",
              title: a.title,
              type: "homestay",
              price: Number(a.pricePerNight),
              unit: "đêm",
              location: a.location,
              attributes: { bedrooms: a.bedrooms, bathrooms: a.bathrooms },
            }))

            const toolOutput = JSON.stringify([...mappedAcc, ...mappedPartner])

            outboundMessages.push({
              role: "assistant",
              content: message.content || "",
            })
            outboundMessages.push({
              role: "tool",
              content: toolOutput,
              tool_call_id: toolCall.id,
              name: fnName,
            })
          } else if (fnName === "create_booking_draft") {
            const matchedService = activeServices.find((s) => s.id === fnArgs.serviceId)
            const matchedAcc = !matchedService
              ? (platformAccommodations as any[]).find((a) => a.id === fnArgs.serviceId)
              : null

            const unitPrice = matchedService
              ? Number(matchedService.price)
              : matchedAcc
              ? Number(matchedAcc.pricePerNight)
              : 1000000
            const qty = fnArgs.quantity || 1
            const totalAmount = unitPrice * qty
            const serviceTitle =
              matchedService?.title ||
              matchedAcc?.title ||
              fnArgs.serviceTitle ||
              "Dịch vụ STAYEA"
            const serviceType =
              matchedService?.serviceType || (matchedAcc ? "homestay" : "homestay")
            const partnerId =
              matchedService?.partnerId ||
              (matchedAcc ? "prt_stayea_host" : fnArgs.partnerId || "prt_demo")

            const order = await this.partnerService.createDraftOrder({
              partnerId,
              serviceId: fnArgs.serviceId,
              customerName: fnArgs.customerName,
              customerPhone: fnArgs.customerPhone,
              customerEmail: fnArgs.customerEmail,
              serviceTitle,
              serviceType: serviceType as any,
              startDate: fnArgs.startDate,
              endDate: fnArgs.endDate,
              quantity: qty,
              unitPrice,
              totalAmount,
              source: "ai_agent",
              adminNotes: `Đơn được tạo tự động bởi AI Concierge. Ghi chú khách: ${fnArgs.note || "Không có"}`,
            })

            if (order) {
              createdBooking = {
                orderCode: order.orderCode,
                serviceTitle: order.serviceTitle,
                serviceType: order.serviceType,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                startDate: order.startDate,
                endDate: order.endDate,
                quantity: order.quantity || 1,
                totalAmount: Number(order.totalAmount),
                status: "pending_admin",
                note: fnArgs.note,
              }
            }

            const toolOutput = JSON.stringify({
              success: true,
              orderCode: order?.orderCode || "STY-ORD-PENDING",
              status: "pending_admin",
              message:
                "Đơn đặt dịch vụ đã được tạo thành công và chuyển vào Hàng chờ xét duyệt của Admin STAYEA.",
            })

            outboundMessages.push({
              role: "assistant",
              content: message.content || "",
            })
            outboundMessages.push({
              role: "tool",
              content: toolOutput,
              tool_call_id: toolCall.id,
              name: fnName,
            })
          }
        }

        // Second turn to summarize tool execution to customer
        const secondResponse = await this.callAiGateway(outboundMessages)
        const finalReply =
          secondResponse.choices?.[0]?.message?.content ||
          "Dạ em đã ghi nhận thông tin đặt dịch vụ của anh/chị và gửi tới Admin STAYEA để duyệt điều phối đối tác ạ!"

        return {
          reply: finalReply,
          bookingCreated: createdBooking,
          suggestedActions: [
            "Kiểm tra tình trạng đơn",
            "Xem thêm dịch vụ xe di chuyển",
            "Tư vấn tour lặn san hô",
          ],
        }
      }

      // Check if model returned JSON in text format
      const rawContent = message.content || ""
      const actionMatch = rawContent.match(/\{[\s\S]*"action"[\s\S]*\}/)
      if (actionMatch) {
        try {
          const parsed = JSON.parse(actionMatch[0])
          if (parsed.action === "create_booking_draft" && parsed.params) {
            const p = parsed.params
            const matchedService = activeServices.find((s) => s.id === p.serviceId)
            const unitPrice = matchedService ? Number(matchedService.price) : 1000000
            const qty = p.quantity || 1
            const totalAmount = unitPrice * qty

            const order = await this.partnerService.createDraftOrder({
              partnerId: matchedService?.partnerId || p.partnerId || "prt_demo",
              serviceId: p.serviceId,
              customerName: p.customerName,
              customerPhone: p.customerPhone,
              customerEmail: p.customerEmail,
              serviceTitle: matchedService?.title || p.serviceTitle || "Dịch vụ STAYEA",
              serviceType: (matchedService?.serviceType as any) || "homestay",
              startDate: p.startDate,
              endDate: p.endDate,
              quantity: qty,
              unitPrice,
              totalAmount,
              source: "ai_agent",
              adminNotes: `Tạo từ AI text-parser. Ghi chú: ${p.note || ""}`,
            })

            if (order) {
              createdBooking = {
                orderCode: order.orderCode,
                serviceTitle: order.serviceTitle,
                serviceType: order.serviceType,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                startDate: order.startDate,
                endDate: order.endDate,
                quantity: order.quantity || 1,
                totalAmount: Number(order.totalAmount),
                status: "pending_admin",
              }
            }
          }
        } catch {
          // Ignore parse errors
        }
      }

      return {
        reply: rawContent || "Dạ STAYEA Concierge có thể hỗ trợ gì cho kỳ nghỉ của anh/chị hôm nay?",
        bookingCreated: createdBooking,
        suggestedActions: [
          "Tìm biệt thự có hồ bơi",
          "Thuê xe tự lái 7 chỗ",
          "Tour cano 4 đảo ngắm hoàng hôn",
        ],
      }
    } catch (error: any) {
      this.logger.error(`AI Gateway error: ${error?.message || error}`, error?.stack)

      // Fallback: Smart local rule responder
      return this.generateSmartFallback(rawMessages, activeServices)
    }
  }

  /**
   * Calls AI Gateway on VPS port 20128
   */
  private async callAiGateway(
    messages: ChatMessage[],
    tools?: FunctionToolDef[]
  ): Promise<any> {
    const payload: any = {
      model: this.modelName,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.name ? { name: m.name } : {}),
        ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
      })),
      temperature: 0.7,
      max_tokens: 1500,
      stream: false,
    }

    if (tools && tools.length > 0) {
      payload.tools = tools
      payload.tool_choice = "auto"
    }

    const res = await fetch(`${this.routerUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.routerKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`AI Gateway error HTTP ${res.status}: ${errText.slice(0, 200)}`)
    }

    return res.json()
  }

  /**
   * Resilient fallback if AI Gateway experiences temporary outage
   */
  private generateSmartFallback(
    messages: ChatMessage[],
    services: any[]
  ): AiChatResponse {
    const lastUserMsg =
      messages
        .filter((m) => m.role === "user")
        .slice(-1)[0]
        ?.content?.toLowerCase() || ""

    if (
      lastUserMsg.includes("xe") ||
      lastUserMsg.includes("ô tô") ||
      lastUserMsg.includes("7 chỗ") ||
      lastUserMsg.includes("tự lái")
    ) {
      const cars = services.filter((s) => s.serviceType === "transport")
      const listStr = cars
        .map(
          (c) =>
            `• **${c.title}**: ${Number(c.price).toLocaleString("vi-VN")}đ/${c.unit} (${c.location})`
        )
        .join("\n")

      return {
        reply: `Dạ STAYEA xin gợi ý đội xe đối tác chất lượng cao tại Phú Quốc:\n\n${listStr || "• Xe 7 chỗ Mitsubishi Xpander đời mới: 900.000đ/ngày\n• Xe Ford Everest 7 chỗ cao cấp: 1.200.000đ/ngày"}\n\nAnh/chị vui lòng cho em biết **Họ tên**, **Số điện thoại** và **ngày nhận xe** để em tạo phiếu giữ xe chuyển Admin duyệt ngay ạ!`,
        suggestedActions: ["Thuê xe 7 chỗ ngày mai", "Thuê xe có tài xế riêng"],
      }
    }

    if (
      lastUserMsg.includes("villa") ||
      lastUserMsg.includes("phòng") ||
      lastUserMsg.includes("homestay") ||
      lastUserMsg.includes("ở")
    ) {
      const stays = services.filter((s) => s.serviceType === "homestay")
      const listStr = stays
        .map(
          (c) =>
            `• **${c.title}**: ${Number(c.price).toLocaleString("vi-VN")}đ/${c.unit} (${c.location})`
        )
        .join("\n")

      return {
        reply: `Dạ STAYEA hiện có các biệt thự & homestay tuyệt đẹp ven biển Phú Quốc:\n\n${listStr || "• Sunshine Ocean Villa (3 PN, hồ bơi vô cực): 3.500.000đ/đêm"}\n\nAnh/chị dự định đi vào ngày nào và có bao nhiêu thành viên để em giữ chỗ gửi Admin duyệt ạ?`,
        suggestedActions: ["Xem biệt thự 3 phòng ngủ", "Biệt thự view biển"],
      }
    }

    return {
      reply: `Dạ em chào anh/chị! Em là STAYEA Concierge. Em có thể hỗ trợ anh/chị:\n1. 🏡 Tìm & đặt homestay, villa nghỉ dưỡng cao cấp.\n2. 🚗 Thuê xe tự lái hoặc có tài xế đón tiễn sân bay.\n3. 🚤 Tour cano 4 đảo, lặn ngắm san hô độc bản.\n\nAnh/chị chỉ cần để lại nhu cầu cùng SĐT, em sẽ lên đơn chuyển Admin STAYEA duyệt và điều phối đối tác phục vụ ngay ạ!`,
      suggestedActions: [
        "Tìm biệt thự sát biển",
        "Thuê xe 7 chỗ tự lái",
        "Tour cano 4 đảo",
      ],
    }
  }

  /**
   * Health status of AI Engine (White-labeled)
   */
  async checkHealth() {
    try {
      const res = await fetch(`${this.routerUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.routerKey}`,
        },
      })
      const isOnline = res.ok
      return {
        status: isOnline ? "online" : "degraded",
        service: "STAYEA AI Engine",
        available: isOnline,
        timestamp: new Date().toISOString(),
      }
    } catch {
      return {
        status: "offline",
        service: "STAYEA AI Engine",
        available: false,
        timestamp: new Date().toISOString(),
      }
    }
  }
}
