"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  RotateCcw,
  Save,
  Database,
  Sliders,
  MessageSquare,
  CheckCircle2,
  Plus,
  Trash2,
  Home,
  Car,
  Compass,
  Cpu,
  Check,
} from "lucide-react"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { stayeaApi } from "@/lib/stayea-api-service"

interface StayeaAdminAiAgentPageProps {
  onNavigateLanding?: () => void
  onNavigateTab?: (tabId: string) => void
  onLogout?: () => void
}

interface SandboxMessage {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
  meta?: {
    modelUsed?: string
    temperatureUsed?: number
    promptLength?: number
  }
}

const PRESET_QUICK_TESTS = [
  "Bên mình đang có những dịch vụ nào vậy em?",
  "Tôi muốn tìm villa gần biển Dương Đông cho 4 người.",
  "Bên em có xe 7 chỗ tự lái đưa đón sân bay Phú Quốc không?",
  "Tư vấn cho anh tour cano lặn ngắm san hô chiều nay.",
]

export function StayeaAdminAiAgentPage({
  onNavigateLanding,
  onNavigateTab,
  onLogout,
}: StayeaAdminAiAgentPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"prompt" | "catalog" | "parameters">("prompt")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Config States
  const [systemPrompt, setSystemPrompt] = useState("")
  const [greetingMessage, setGreetingMessage] = useState("")
  const [tone, setTone] = useState<"luxury" | "friendly" | "concise">("luxury")
  const [model, setModel] = useState("gemini-2.5-flash")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [autoInjectCatalog, setAutoInjectCatalog] = useState(true)
  const [customRules, setCustomRules] = useState<string[]>([])
  const [newRuleInput, setNewRuleInput] = useState("")

  // Catalog Info from Backend
  const [catalogStats, setCatalogStats] = useState({
    total: 0,
    stays: 0,
    transports: 0,
    experiences: 0,
  })
  const [catalogItems, setCatalogItems] = useState<any[]>([])

  // Sandbox State
  const [sandboxMessages, setSandboxMessages] = useState<SandboxMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Xin chào Quản trị viên! Đây là môi trường Sandbox mô phỏng trực tiếp STAYEA AI Concierge. Bạn có thể đặt câu hỏi bất kỳ để kiểm tra xem AI có nắm rõ các biệt thự, xe và tour trong hệ thống không.",
      timestamp: "Ngay bây giờ",
    },
  ])
  const [sandboxInput, setSandboxInput] = useState("")
  const [isTesting, setIsTesting] = useState(false)
  const sandboxBottomRef = useRef<HTMLDivElement>(null)

  // Load config on mount
  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const res = await stayeaApi.getAiConfig()
      if (res) {
        setSystemPrompt(res.systemPrompt || "")
        setGreetingMessage(res.greetingMessage || "")
        setTone(res.tone || "luxury")
        setModel(res.model || "gemini-2.5-flash")
        setTemperature(parseFloat(res.temperature) || 0.7)
        setMaxTokens(res.maxTokens || 2048)
        setAutoInjectCatalog(res.autoInjectCatalog ?? true)

        let rules: string[] = []
        if (Array.isArray(res.customRules)) {
          rules = res.customRules
        } else if (typeof res.customRules === "string") {
          try {
            rules = JSON.parse(res.customRules)
          } catch {
            rules = [res.customRules]
          }
        }
        setCustomRules(rules)

        if (res.catalogStats) {
          setCatalogStats(res.catalogStats)
        }
        if (Array.isArray(res.catalogItems)) {
          setCatalogItems(res.catalogItems)
        }
      }
    } catch {
      toast.error("Không thể tải cấu hình AI Prompt từ máy chủ.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  useEffect(() => {
    sandboxBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [sandboxMessages])

  // Save Config
  const handleSaveConfig = async () => {
    if (!systemPrompt.trim()) {
      toast.error("Vui lòng không để trống System Prompt chính.")
      return
    }

    setIsSaving(true)
    try {
      await stayeaApi.updateAiConfig({
        systemPrompt,
        greetingMessage,
        tone,
        model,
        temperature,
        maxTokens,
        autoInjectCatalog,
        customRules,
      })
      toast.success("Đã lưu cấu hình AI Prompt thành công!", {
        description: "Các cuộc trò chuyện mới của khách hàng trên STAYEA sẽ áp dụng chỉ dẫn này ngay lập tức.",
      })
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi lưu cấu hình AI Prompt.")
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to Default
  const handleResetConfig = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn khôi phục System Prompt về bản chuẩn mặc định của STAYEA Concierge không?"
      )
    ) {
      return
    }

    setIsResetting(true)
    try {
      const res = await stayeaApi.resetAiConfig()
      if (res) {
        setSystemPrompt(res.systemPrompt || "")
        setGreetingMessage(res.greetingMessage || "")
        setTone(res.tone || "luxury")
        setTemperature(parseFloat(res.temperature) || 0.7)
        setAutoInjectCatalog(res.autoInjectCatalog ?? true)
        toast.success("Đã khôi phục System Prompt mặc định thành công!")
      }
    } catch {
      toast.error("Không thể khôi phục prompt mặc định.")
    } finally {
      setIsResetting(false)
    }
  }

  // Add rule
  const handleAddRule = () => {
    const trimmed = newRuleInput.trim()
    if (!trimmed) return
    setCustomRules((prev) => [...prev, trimmed])
    setNewRuleInput("")
  }

  // Remove rule
  const handleRemoveRule = (index: number) => {
    setCustomRules((prev) => prev.filter((_, i) => i !== index))
  }

  // Sandbox Test
  const handleRunTest = async (testText?: string) => {
    const messageToSend = (testText || sandboxInput).trim()
    if (!messageToSend || isTesting) return

    const userMsgId = `u-${Date.now()}`
    const timeStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setSandboxMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: messageToSend,
        timestamp: timeStr,
      },
    ])

    if (!testText) {
      setSandboxInput("")
    }

    setIsTesting(true)
    try {
      const response = await stayeaApi.testAiPrompt({
        message: messageToSend,
        systemPrompt,
        model,
        temperature,
        autoInjectCatalog,
      })

      setSandboxMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: response.reply,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          meta: {
            modelUsed: response.modelUsed,
            temperatureUsed: response.temperatureUsed,
            promptLength: response.promptLength,
          },
        },
      ])
    } catch (err: any) {
      setSandboxMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: `[Lỗi Sandbox]: ${err?.message || "Không thể kết nối gateway AI."}`,
          timestamp: timeStr,
        },
      ])
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header */}
      <StayeaAdminHeader
        onNavigateLanding={onNavigateLanding}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onLogout={onLogout}
      />

      {/* 2. Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <StayeaAdminSidebar
            activeTab="ai-agent"
            onSelectTab={onNavigateTab}
          />
        </div>

        {/* Scrollable Content Container */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1700px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Bar / Heading */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Kiểm soát AI Concierge & Prompt</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Live AI Engine
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Tinh chỉnh prompt chỉ dẫn, phong cách trò chuyện và giám sát khả năng tra cứu danh mục dịch vụ thực tế của STAYEA AI Concierge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={fetchConfig}
                  disabled={isLoading}
                  title="Làm mới cấu hình"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
                  Làm mới
                </button>

                <button
                  type="button"
                  onClick={handleResetConfig}
                  disabled={isResetting || isLoading}
                  title="Khôi phục prompt mặc định"
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                  Khôi phục gốc
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSaving || isLoading}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Lưu cấu hình AI
                </button>
              </div>
            </div>

            {/* Quick Live Context Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Tổng dịch vụ thực
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {catalogStats.total} <span className="text-xs font-normal text-slate-500">mục kết nối</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Lưu trú & Villa
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {catalogStats.stays} <span className="text-xs font-normal text-slate-500">căn sẵn sàng</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Xe & Đưa đón
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {catalogStats.transports} <span className="text-xs font-normal text-slate-500">dòng xe</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Tour & Canô
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {catalogStats.experiences} <span className="text-xs font-normal text-slate-500">hành trình</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Screen: Config (Left) + Sandbox Playground (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Configuration Tabs */}
              <div className="xl:col-span-7 space-y-4">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveTab("prompt")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                      activeTab === "prompt"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chỉ dẫn & Persona (System Prompt)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("catalog")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                      activeTab === "catalog"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Ngữ cảnh Dịch vụ ({catalogStats.total})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("parameters")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                      activeTab === "parameters"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Tham số & Mô hình
                  </button>
                </div>

                {/* Tab 1: System Prompt Editor */}
                {activeTab === "prompt" && (
                  <div className="space-y-4">
                    {/* Prompt Box */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            System Prompt (Chỉ dẫn tư duy cốt lõi)
                            <span className="text-xs font-semibold text-rose-500">*</span>
                          </label>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Chỉ dẫn vai trò, thái độ, cách giới thiệu phòng/dịch vụ và quy trình chốt thông tin khách hàng.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {systemPrompt.length} ký tự
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          rows={14}
                          placeholder="Nhập System Prompt cho STAYEA AI Concierge..."
                          className="w-full text-xs font-mono p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-y selection:bg-emerald-500 selection:text-white"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hỗ trợ Function Calling: Tra cứu dịch vụ & Tạo đơn nháp tự động
                        </span>
                        <span>Ước tính: ~{Math.round(systemPrompt.length / 4)} tokens</span>
                      </div>
                    </div>

                    {/* Greeting Message & Tone Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-900">
                          Thông điệp chào mừng mặc định (Greeting)
                        </label>
                        <p className="text-xs text-slate-500 mt-0.5 mb-2">
                          Tin nhắn đầu tiên hiển thị khi khách mở khung chat AI Concierge trên web.
                        </p>
                        <input
                          type="text"
                          value={greetingMessage}
                          onChange={(e) => setGreetingMessage(e.target.value)}
                          placeholder="Ví dụ: Dạ em chào anh/chị! Em là STAYEA Concierge..."
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <label className="text-sm font-bold text-slate-900">
                          Phong cách & Văn phong (Tone of Voice)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2.5">
                          <button
                            type="button"
                            onClick={() => setTone("luxury")}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              tone === "luxury"
                                ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">💎 Luxury Concierge</span>
                              {tone === "luxury" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                              Lịch thiệp, xưng hô dạ/thưa, tinh tế, chuẩn phong cách nghỉ dưỡng 5 sao.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTone("friendly")}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              tone === "friendly"
                                ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">✨ Thân thiện & Năng động</span>
                              {tone === "friendly" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                              Gần gũi, nhiệt tình, tư vấn như người bạn bản địa Phú Quốc sành sỏi.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTone("concise")}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              tone === "concise"
                                ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">⚡ Ngắn gọn & Chuyên nghiệp</span>
                              {tone === "concise" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                              Vào thẳng trọng tâm, liệt kê giá và thông tin nhanh chóng, ít rào trước đón sau.
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Custom Rules */}
                      <div className="pt-3 border-t border-slate-100">
                        <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
                          <span>Quy tắc nghiệp vụ bổ sung (Rules checklist)</span>
                          <span className="text-xs font-normal text-slate-500">{customRules.length} quy tắc</span>
                        </label>
                        <p className="text-xs text-slate-500 mt-0.5 mb-2.5">
                          Các nguyên tắc bắt buộc AI phải tuân thủ trong mọi tình huống phản hồi.
                        </p>

                        <div className="space-y-2">
                          {customRules.map((rule, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span>{rule}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveRule(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={newRuleInput}
                              onChange={(e) => setNewRuleInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddRule()
                                }
                              }}
                              placeholder="Nhập quy tắc mới (ví dụ: Luôn xin SĐT Zalo để tư vấn sâu hơn)..."
                              className="flex-1 text-xs px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            />
                            <button
                              type="button"
                              onClick={handleAddRule}
                              className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Thêm quy tắc
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Catalog Context Preview */}
                {activeTab === "catalog" && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-600" />
                          Đồng bộ Danh mục Thực tế vào AI Context
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tự động nạp danh sách homestay, villa, xe và tour đang hoạt động trên hệ thống vào bộ nhớ của AI.
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoInjectCatalog}
                          onChange={(e) => setAutoInjectCatalog(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {/* Catalog Listing Items */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Danh sách dịch vụ thực tế trong Database ({catalogItems.length} mục):</span>
                        <span className="text-[11px] font-normal text-slate-500">Được truyền kèm function calling</span>
                      </div>

                      <div className="max-h-[480px] overflow-y-auto space-y-2 pr-1">
                        {catalogItems.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                            Chưa tìm thấy dịch vụ nào đang mở bán.
                          </div>
                        ) : (
                          catalogItems.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200/80 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                                    #{idx + 1}
                                  </span>
                                  <span className="font-bold text-slate-900">{item.title}</span>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                      item.serviceType === "stay"
                                        ? "bg-blue-100 text-blue-800"
                                        : item.serviceType === "transport"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {item.serviceType === "stay"
                                      ? "Lưu trú"
                                      : item.serviceType === "transport"
                                      ? "Xe di chuyển"
                                      : "Tour/Trải nghiệm"}
                                  </span>
                                </div>
                                <div className="text-slate-500 text-[11px]">
                                  📍 {item.location} • {item.description}
                                </div>
                              </div>

                              <div className="text-right sm:shrink-0">
                                <div className="font-bold text-emerald-700 text-sm">
                                  {item.price?.toLocaleString("vi-VN")} ₫
                                  <span className="text-[11px] font-normal text-slate-500">/{item.unit || "ngày"}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  ID: {item.id}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Model Parameters */}
                {activeTab === "parameters" && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-600" />
                        Cấu hình Tham số Kỹ thuật AI Gateway
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Thiết lập model LLM và các chỉ số suy luận để tối ưu hóa chi phí và tốc độ phản hồi.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Model Selector */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Model suy luận chính (Primary LLM Engine)
                        </label>
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                        >
                          <option value="gemini-2.5-flash">Gemini 2.5 Flash (Khuyên dùng — Phản hồi siêu tốc, phân tích danh mục chính xác)</option>
                          <option value="gemini-2.0-flash">Gemini 2.0 Flash (Ổn định, tối ưu chi phí)</option>
                          <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Phản hồi tự nhiên, chuẩn phong cách)</option>
                          <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Độ tinh tế cao nhất)</option>
                        </select>
                      </div>

                      {/* Temperature */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">
                            Temperature (Độ sáng tạo / Bám sát sự thật)
                          </label>
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {temperature.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="1.0"
                          step="0.05"
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>0.0 (Tuyệt đối bám sát danh mục)</span>
                          <span>0.7 (Cân bằng & Tự nhiên)</span>
                          <span>1.0 (Rất sáng tạo, linh hoạt)</span>
                        </div>
                      </div>

                      {/* Max Tokens */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Giới hạn độ dài phản hồi tối đa (Max Output Tokens)
                        </label>
                        <input
                          type="number"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                          min={512}
                          max={8192}
                          step={256}
                          className="w-full text-xs px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Mặc định: 2,048 tokens (tương đương khoảng 1,500 chữ tiếng Việt).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Live Sandbox Chat Simulator */}
              <div className="xl:col-span-5 flex flex-col h-[750px] bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                {/* Sandbox Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">
                      Sandbox Simulator (Thử nghiệm Prompt Trực tiếp)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSandboxMessages([
                        {
                          id: "welcome-reset",
                          sender: "ai",
                          text: "Đã làm mới phiên chat thử nghiệm! Mời bạn nhập câu hỏi để kiểm tra prompt vừa chỉnh sửa.",
                          timestamp: "Ngay bây giờ",
                        },
                      ])
                    }
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    Xóa đoạn chat
                  </button>
                </div>

                {/* Quick test prompt chips */}
                <div className="px-3 py-2 bg-slate-100/60 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
                  <span className="text-slate-400 text-[10px] font-semibold shrink-0 uppercase">Gợi ý test:</span>
                  {PRESET_QUICK_TESTS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRunTest(q)}
                      disabled={isTesting}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all shrink-0 shadow-2xs disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {sandboxMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-br-xs shadow-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/70"
                        }`}
                      >
                        {msg.text}
                      </div>

                      <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {msg.meta && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 rounded">
                              {msg.meta.modelUsed}
                            </span>
                            <span>•</span>
                            <span>{msg.meta.promptLength} ký tự ngữ cảnh</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTesting && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-slate-50 rounded-xl w-fit">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      STAYEA AI đang suy luận với cấu hình mới...
                    </div>
                  )}

                  <div ref={sandboxBottomRef} />
                </div>

                {/* Sandbox Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleRunTest()
                  }}
                  className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    disabled={isTesting}
                    placeholder="Nhập câu hỏi thử nghiệm cho AI Concierge..."
                    className="flex-1 text-xs px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!sandboxInput.trim() || isTesting}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 3. Footer */}
      <StayeaAdminFooter />
    </div>
  )
}

