// Mock data types and services for Stayea
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  getUser,
  setUser,
  clearAllAuth,
} from "@/lib/token"

/**
 * STAYEA API SERVICE
 * ------------------
 * Centralized API service connecting Frontend components with NestJS Backend.
 * Seamlessly calls /api/stayea endpoints (proxied to http://localhost:3000 in dev)
 * with graceful fallback to cached catalog data when backend is temporarily offline.
 */

export interface AccommodationItem {
  id: string
  title: string
  slug: string
  location: string
  category: "villa" | "resort" | "apartment" | "hotel" | "beachfront"
  pricePerNight: string | number
  originalPrice?: string | number
  rating: string | number
  reviewCount: number
  imageUrl: string
  gallery?: string[]
  badge?: string
  bedrooms?: number
  bathrooms?: number
  maxGuests?: number
  amenities?: { icon: string; label: string }[]
  isFeatured?: boolean
  hostName?: string
  description?: string
  cancellationPolicy?: string
}

export interface ExperienceItem {
  id: string
  title: string
  slug: string
  location: string
  category: "tour" | "island" | "snorkeling" | "diving" | "cruise" | "food" | "spa"
  duration: string
  rating: string | number
  reviewCount: number
  price: string | number
  originalPrice?: string | number
  imageUrl: string
  gallery?: string[]
  badge?: string
  departureSchedule?: string
  groupSize?: string
  highlights?: string[]
  included?: string[]
  isFeatured?: boolean
  description?: string
}

export interface PackageItem {
  id: string
  title: string
  slug: string
  destination: string
  duration: string
  rating: string | number
  reviewCount: number
  price: string | number
  originalPrice?: string | number
  imageUrl: string
  badge?: string
  audience: "couple" | "family" | "luxury" | "wellness" | "all"
  includedServices?: string[]
  isFeatured?: boolean
  description?: string
}

export interface CreateBookingPayload {
  bookingType: "stay" | "flight" | "experience" | "package" | "combo" | "transport"
  title: string
  destination: string
  startDate: string
  endDate: string
  guestCount?: number
  totalAmount: number
  voucherCode?: string
  paymentMethod?: string
  details?: {
    stayId?: string
    roomType?: string
    nightCount?: number
    flightId?: string
    flightNumber?: string
    seatClass?: string
    experienceId?: string
    packageId?: string
    contactInfo?: { fullName: string; email: string; phone: string; note?: string }
    metadata?: Record<string, unknown>
  }
}

export interface BookingResult {
  success: boolean
  id?: string
  bookingCode: string
  title: string
  status: string
  totalAmount: number
  isLiveDb?: boolean
  message?: string
}

export interface DestinationSuggestion {
  id: string
  name: string
  region: string
  description: string
  category: "center" | "beach" | "island" | "cultural" | "nature"
  accommodationsCount: number
  experiencesCount: number
}

export const PHU_QUOC_DESTINATIONS: DestinationSuggestion[] = [
  {
    id: "duong-dong",
    name: "Dương Đông",
    region: "Trung tâm Phú Quốc",
    description: "Trung tâm sầm uất, Chợ đêm, Dinh Cậu & ẩm thực hải sản",
    category: "center",
    accommodationsCount: 128,
    experiencesCount: 45,
  },
  {
    id: "bai-truong",
    name: "Bãi Trường",
    region: "Dương Tơ, Phú Quốc",
    description: "Bãi biển dài 20km tuyệt đẹp, tổ hợp resort 5 sao & ngắm hoàng hôn",
    category: "beach",
    accommodationsCount: 94,
    experiencesCount: 28,
  },
  {
    id: "an-thoi",
    name: "An Thới & Hòn Thơm",
    region: "Nam đảo Phú Quốc",
    description: "Cảng du thuyền, cáp treo vượt biển 3 dây, lặn ngắm san hô",
    category: "island",
    accommodationsCount: 65,
    experiencesCount: 52,
  },
  {
    id: "bai-khem",
    name: "Bãi Khem & Mũi Ông Đội",
    region: "Nam đảo Phú Quốc",
    description: "Bãi cát trắng mịn như kem, resort siêu sang JW Marriott & Premier Village",
    category: "beach",
    accommodationsCount: 42,
    experiencesCount: 18,
  },
  {
    id: "ganh-dau",
    name: "Gành Dầu & Bãi Dài",
    region: "Bắc đảo Phú Quốc",
    description: "Quần thể giải trí VinWonders, Grand World - thành phố không ngủ, Safari",
    category: "nature",
    accommodationsCount: 58,
    experiencesCount: 36,
  },
  {
    id: "ong-lang",
    name: "Ông Lang & Cửa Cạn",
    region: "Tây Bắc đảo Phú Quốc",
    description: "Bờ biển thanh bình, chèo SUP trên sông & hoàng hôn biển vắng",
    category: "beach",
    accommodationsCount: 38,
    experiencesCount: 15,
  },
  {
    id: "ham-ninh",
    name: "Làng chài Hàm Ninh",
    region: "Đông đảo Phú Quốc",
    description: "Làng chài cổ xưa nhất đảo, đón bình minh & thưởng thức ghẹ Hàm Ninh",
    category: "cultural",
    accommodationsCount: 22,
    experiencesCount: 12,
  },
  {
    id: "rach-vem",
    name: "Rạch Vẹm",
    region: "Bắc đảo Phú Quốc",
    description: "Vương quốc sao biển tự nhiên, nhà bè hải sản trên làn nước trong vắt",
    category: "nature",
    accommodationsCount: 14,
    experiencesCount: 20,
  },
]

class StayeaApiService {
  private baseUrl = "/api/stayea"

  /**
   * Search accommodations with query parameters
   */
  async getAccommodations(params?: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    limit?: number
    offset?: number
  }): Promise<{ items: AccommodationItem[]; count: number }> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.category) searchParams.set("category", params.category)
      if (params?.search) searchParams.set("search", params.search)
      if (params?.minPrice) searchParams.set("minPrice", String(params.minPrice))
      if (params?.maxPrice) searchParams.set("maxPrice", String(params.maxPrice))
      if (params?.limit) searchParams.set("limit", String(params.limit))
      if (params?.offset) searchParams.set("offset", String(params.offset))

      const url = `${this.baseUrl}/accommodations${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data = json.data || json
      if (Array.isArray(data)) {
        return { items: data, count: data.length }
      }
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        count: data?.count || (Array.isArray(data?.items) ? data.items.length : 0),
      }
    } catch {
      return { items: [], count: 0 }
    }
  }

  /**
   * Search experiences with query parameters
   */
  async getExperiences(params?: {
    category?: string
    search?: string
    duration?: string
    limit?: number
    offset?: number
  }): Promise<{ items: ExperienceItem[]; count: number }> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.category) searchParams.set("category", params.category)
      if (params?.search) searchParams.set("search", params.search)
      if (params?.duration) searchParams.set("duration", params.duration)
      if (params?.limit) searchParams.set("limit", String(params.limit))

      const url = `${this.baseUrl}/experiences${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data = json.data || json
      if (Array.isArray(data)) {
        return { items: data, count: data.length }
      }
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        count: data?.count || (Array.isArray(data?.items) ? data.items.length : 0),
      }
    } catch {
      return { items: [], count: 0 }
    }
  }

  /**
   * Search packages with query parameters
   */
  async getPackages(params?: {
    audience?: string
    search?: string
    duration?: string
    limit?: number
  }): Promise<{ items: PackageItem[]; count: number }> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.audience) searchParams.set("audience", params.audience)
      if (params?.search) searchParams.set("search", params.search)
      if (params?.duration) searchParams.set("duration", params.duration)
      if (params?.limit) searchParams.set("limit", String(params.limit))

      const url = `${this.baseUrl}/packages${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data = json.data || json
      if (Array.isArray(data)) {
        return { items: data, count: data.length }
      }
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        count: data?.count || (Array.isArray(data?.items) ? data.items.length : 0),
      }
    } catch {
      return { items: [], count: 0 }
    }
  }

  async getCatalogItem(type: "stay" | "experience" | "package" | "transport", id: string): Promise<any | null> {
    try {
      if (type === "transport") {
        const services = await this.getCatalogServices({ type: "transport" })
        const service = services.find((entry: any) => entry.id === id)
        if (!service) return null
        const images = Array.isArray(service.images) ? service.images : []
        return { ...service, price: Number(service.price || 0), imageUrl: images[0] || "", gallery: images, rating: Number(service.rating || 0), reviewsCount: Number(service.reviewCount || 0) }
      }
      const collection = type === "stay" ? "accommodations" : type === "experience" ? "experiences" : "packages"
      const res = await fetch(`${this.baseUrl}/${collection}/${encodeURIComponent(id)}`)
      if (!res.ok) return null
      const json = await res.json()
      const item = json.data || json
      return { ...item, price: Number(item.price ?? item.pricePerNight ?? 0), rating: Number(item.rating || 0), reviewsCount: Number(item.reviewCount || 0) }
    } catch {
      return null
    }
  }

  /**
   * Search & autocomplete destination in Phu Quoc
   */
  searchDestinations(query: string): DestinationSuggestion[] {
    if (!query || !query.trim()) {
      return PHU_QUOC_DESTINATIONS
    }
    const q = query.toLowerCase().trim()
    return PHU_QUOC_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    )
  }

  private refreshPromise: Promise<boolean> | null = null

  async refreshAuthToken(): Promise<boolean> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false

    try {
      const res = await fetch(`/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) return false

      const data = (await res.json()) as { accessToken?: string; refreshToken?: string; data?: { accessToken?: string; refreshToken?: string } }
      const accessToken = data.accessToken || data.data?.accessToken
      const newRefreshToken = data.refreshToken || data.data?.refreshToken

      if (accessToken) setToken(accessToken)
      if (newRefreshToken) setRefreshToken(newRefreshToken)
      return true
    } catch {
      return false
    }
  }

  async fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const token = getToken()
    const headers = new Headers(init?.headers || {})
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    let res = await fetch(input, { ...init, headers })

    if (res.status === 401) {
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshAuthToken().finally(() => {
          this.refreshPromise = null
        })
      }
      const refreshed = await this.refreshPromise
      if (refreshed) {
        const newToken = getToken()
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`)
        }
        res = await fetch(input, { ...init, headers })
      }
    }

    return res
  }

  /**
   * Helper to get Authorization headers from token
   */
  getAuthHeader(): Record<string, string> {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Create a booking through live NestJS API with database persistence and resilient fallback
   */
  async createBooking(payload: CreateBookingPayload): Promise<BookingResult> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      }
      const res = await fetch(`${this.baseUrl}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const data = await res.json()
        const booking = data.data || data
        return {
          success: true,
          id: booking.id,
          bookingCode: booking.bookingCode,
          title: booking.title || payload.title,
          status: booking.status || "confirmed",
          totalAmount: Number(booking.finalAmount || payload.totalAmount),
          isLiveDb: true,
          message: "Đơn đặt dịch vụ đã được ghi nhận trực tiếp vào hệ thống!",
        }
      }

      const errJson = await res.json().catch(() => ({}))
      const errMsg = errJson?.message || errJson?.detail || `Đặt dịch vụ không thành công (HTTP ${res.status})`
      return {
        success: false,
        bookingCode: "",
        title: payload.title,
        status: "failed",
        totalAmount: payload.totalAmount,
        isLiveDb: false,
        message: Array.isArray(errMsg) ? errMsg.join(", ") : String(errMsg),
      }
    } catch (err: any) {
      return {
        success: false,
        bookingCode: "",
        title: payload.title,
        status: "failed",
        totalAmount: payload.totalAmount,
        isLiveDb: false,
        message: err?.message || "Không thể kết nối đến máy chủ đặt chỗ",
      }
    }
  }

  /**
   * Real Authentication: Login with email & password via NestJS Auth
   */
  async login(email: string, pass: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      clearAllAuth()
      const cleanEmail = email.trim().toLowerCase()
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      })
      if (res.ok) {
        const data = await res.json()
        const token = data.accessToken || data.token
        const refreshToken = data.refreshToken
        const user = data.user
        if (token) {
          setToken(token)
          if (refreshToken) setRefreshToken(refreshToken)
          if (user) {
            setUser({
              id: user.id,
              email: user.email,
              name: user.name || user.displayName || user.email?.split("@")[0] || "Thành viên",
              displayName: user.displayName || null,
              role: user.role || "USER",
            })
          }
        }
        return { success: true, user: data.user, token }
      }
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message || err.detail || "Tài khoản hoặc mật khẩu không chính xác" }
    } catch {
      return { success: false, error: "Không thể kết nối đến máy chủ xác thực" }
    }
  }

  /**
   * Real Authentication: Social Login (Google, GitHub, Facebook)
   */
  async socialLogin(
    provider: "google" | "github",
    email: string,
    name?: string,
    avatarUrl?: string
  ): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      clearAllAuth()
      const res = await fetch("/api/auth/oauth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, email, name, avatarUrl }),
      })
      if (res.ok) {
        const data = await res.json()
        const token = data.accessToken || data.token
        const refreshToken = data.refreshToken
        const user = data.user
        if (token) {
          setToken(token)
          if (refreshToken) setRefreshToken(refreshToken)
          if (user) {
            setUser({
              id: user.id,
              email: user.email,
              name: user.name || user.displayName || name || "Thành viên",
              displayName: user.displayName || null,
              role: user.role || "USER",
            })
          }
        }
        return { success: true, user: data.user, token }
      }
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message || err.detail || "Đăng nhập mạng xã hội không thành công" }
    } catch {
      return { success: false, error: "Không thể kết nối đến máy chủ xác thực" }
    }
  }

  /**
   * Update current user profile in backend database
   */
  async updateProfile(dto: { displayName?: string; bio?: string; avatarUrl?: string }): Promise<any | null> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      }
      if (!headers.Authorization) return null
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers,
        body: JSON.stringify(dto),
      })
      if (res.ok) {
        const data = await res.json()
        const updated = data.data || data
        if (updated) {
          const current = getUser()
          if (current) {
            setUser({
              ...current,
              displayName: updated.displayName || current.displayName,
              name: updated.displayName || updated.name || current.name,
              avatarUrl: updated.avatarUrl || current.avatarUrl,
            })
          }
        }
        return updated
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Real Authentication: Register a new customer
   */
  async register(email: string, pass: string, name: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      clearAllAuth()
      const cleanEmail = email.trim().toLowerCase()
      const cleanName = name.trim() || cleanEmail.split("@")[0]
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass, name: cleanName }),
      })
      if (res.ok) {
        const data = await res.json()
        const token = data.accessToken || data.token
        const refreshToken = data.refreshToken
        const user = data.user || {
          id: data.id || data.userId,
          email: cleanEmail,
          name: cleanName,
          role: "USER",
        }
        if (token) {
          setToken(token)
          if (refreshToken) setRefreshToken(refreshToken)
          if (user) {
            setUser({
              id: user.id,
              email: user.email,
              name: user.name || user.displayName || cleanName,
              displayName: user.displayName || null,
              role: user.role || "USER",
            })
          }
        }
        return { success: true, user, token }
      }
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message || err.detail || "Đăng ký không thành công" }
    } catch {
      return { success: false, error: "Không thể kết nối đến máy chủ" }
    }
  }

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<any | null> {
    try {
      const token = getToken()
      if (!token) return null
      const res = await this.fetchWithAuth("/api/profile")
      if (res.ok) {
        const data = await res.json()
        const profile = data.data || data
        if (profile && profile.id) {
          const current = getUser()
          setUser({
            id: profile.id,
            email: profile.email || current?.email || "",
            name: profile.displayName || profile.name || current?.name || "Thành viên",
            displayName: profile.displayName || null,
            avatarUrl: profile.avatarUrl || null,
            role: profile.role || current?.role || "USER",
          })
        }
        return profile
      }
      // Fallback to /api/auth/session
      const sessionRes = await this.fetchWithAuth("/api/auth/session")
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json()
        const u = sessionData.user || {}
        return {
          id: u.id,
          name: u.name || u.displayName || u.email?.split("@")[0] || "Quý khách",
          displayName: u.displayName || u.name || null,
          email: u.email,
          role: u.role || "USER",
        }
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Get current user session info
   */
  async getSession(): Promise<any | null> {
    try {
      const headers = this.getAuthHeader()
      if (!headers.Authorization) return null
      const res = await fetch("/api/auth/session", { headers })
      if (res.ok) {
        return await res.json()
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Get user bookings from live NestJS API
   */
  async getUserBookings(category?: string): Promise<any[]> {
    try {
      const headers = this.getAuthHeader()
      const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : ""
      const res = await fetch(`${this.baseUrl}/bookings${query}`, { headers })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // safe fallback
    }
    return []
  }

  /**
   * Get user favorites / wishlist from live NestJS API
   */
  async getUserFavorites(itemType?: string): Promise<any[]> {
    try {
      const headers = this.getAuthHeader()
      const query = itemType ? `?itemType=${encodeURIComponent(itemType)}` : ""
      const res = await fetch(`${this.baseUrl}/user/favorites${query}`, { headers })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : []
      }
    } catch {
      // fallback
    }
    return []
  }

  /**
   * Add or toggle favorite
   */
  async addFavorite(item: {
    itemId: string
    itemType: string
    title: string
    imageUrl?: string
    price?: number
    location?: string
    rating?: number
  }): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/user/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(item),
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }
    return null
  }

  /**
   * Remove favorite
   */
  async removeFavorite(idOrItemId: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/user/favorites/${encodeURIComponent(idOrItemId)}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Get user trip plans
   */
  async getUserPlans(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/user/plans`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : []
      }
    } catch {
      // fallback
    }
    return []
  }

  /**
   * Create customized trip plan
   */
  async createPlan(plan: {
    title: string
    destination: string
    startDate: string
    endDate: string
    days?: any[]
    budget?: number
    companions?: string
    note?: string
  }): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/user/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(plan),
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }
    return null
  }

  /**
   * Delete trip plan
   */
  async deletePlan(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/user/plans/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Get user reviews
   */
  async getUserReviews(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/user/reviews`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : []
      }
    } catch {
      // fallback
    }
    return []
  }

  /**
   * Submit new review
   */
  async createReview(review: {
    itemId: string
    itemType: string
    bookingId?: string
    serviceName: string
    rating: number
    title?: string
    content: string
    images?: string[]
  }): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/user/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(review),
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }
    return null
  }

  /**
   * Get user personal vouchers
   */
  async getUserVouchers(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/user/vouchers`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : []
      }
    } catch {
      // fallback
    }
    return []
  }

  /**
   * Claim voucher
   */
  async claimVoucher(code: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/user/vouchers/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ code }),
      })
      if (res.ok) return await res.json()
    } catch {
      // fallback
    }
    return null
  }

  /**
   * Logout customer & revoke credentials completely
   */
  async logout(): Promise<void> {
    const refreshToken = getRefreshToken()
    const headers = this.getAuthHeader()
    clearAllAuth()
    try {
      if (refreshToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch {
      // ignore
    }
  }

  /**
   * Upload file to /api/upload/file
   */
  async uploadFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        return { success: true, url: data.url || data.path }
      }
      return { success: false, error: "Tải file thất bại" }
    } catch {
      return { success: false, error: "Không thể kết nối đến máy chủ tải file" }
    }
  }

  /**
   * Admin: Get all platform bookings
   */
  async getAllBookingsForAdmin(params?: { search?: string; status?: string }): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.set("search", params.search)
      if (params?.status) searchParams.set("status", params.status)
      searchParams.set("_t", Date.now().toString())
      const res = await fetch(`/api/stayea/bookings/admin/all?${searchParams.toString()}`, {
        headers: this.getAuthHeader(),
        cache: "no-store",
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Admin: Update booking status
   */
  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ status }),
        cache: "no-store",
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Admin: Create Accommodation Listing
   */
  async createAccommodation(dto: any): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/accommodations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(dto),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Admin: Delete Accommodation
   */
  async deleteAccommodation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/accommodations/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Admin: Get users list
   */
  async getUsers(params?: { search?: string; page?: number; pageSize?: number }): Promise<{ items: any[]; total: number }> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.set("search", params.search)
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize || 20))
      const res = await fetch(`/api/users?${searchParams.toString()}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return {
          items: Array.isArray(data) ? data : data.data || [],
          total: data.total || (Array.isArray(data) ? data.length : 0),
        }
      }
    } catch {
      // ignore
    }
    return { items: [], total: 0 }
  }

  /**
   * Admin: Create new customer/user
   */
  async createUser(dto: { name: string; email: string; password?: string; role?: string }): Promise<any> {
    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({
          name: dto.name,
          email: dto.email,
          password: dto.password,
          role: dto.role || "USER",
        }),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Admin: Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Admin: Get partner orders approval queue
   */
  async getAdminOrdersQueue(params?: { status?: string; search?: string }): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.search) searchParams.set("search", params.search)
      const res = await fetch(`/api/stayea/admin/partners/orders/queue?${searchParams.toString()}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Admin: Approve order and dispatch to partner
   */
  async adminApproveOrder(orderId: string, adminNotes?: string, reassignPartnerId?: string): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/admin/partners/orders/${orderId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ adminNotes, reassignPartnerId }),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Admin: Reject or cancel an order
   */
  async adminRejectOrder(orderId: string, reason?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/admin/partners/orders/${orderId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ reason }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Admin: Complete an order
   */
  async adminCompleteOrder(orderId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/admin/partners/orders/${orderId}/complete`, {
        method: "PATCH",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Admin / Partner: Get all partners
   */
  async getAdminPartners(params?: { search?: string; status?: string; type?: string }): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.set("search", params.search)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.type) searchParams.set("type", params.type)
      const res = await fetch(`/api/stayea/admin/partners?${searchParams.toString()}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }

    // Fallback to public directory for partner hub
    try {
      const res = await fetch(`/api/stayea/partner/directory`)
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }

    return []
  }

  /**
   * Upload image file to server (/api/upload/file)
   */
  async uploadImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const headers = this.getAuthHeader()
      // Note: do not set Content-Type header with FormData, browser sets boundary automatically
      const res = await fetch(`/api/upload/file`, {
        method: "POST",
        headers,
        body: formData,
      })
      if (!res.ok) return null
      const json = await res.json()
      const data = json.data || json
      return data.fileUrl || data.url || null
    } catch {
      return null
    }
  }

  /**
   * Register as partner / create partner profile
   */
  async registerPartner(dto: any): Promise<any> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }

    return this.adminCreatePartner(dto)
  }

  /**
   * Admin: Create a new partner profile
   */
  async adminCreatePartner(dto: any): Promise<any> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/admin/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Admin: Update partner status or commission
   */
  async adminUpdatePartnerStatus(id: string, status: string, commissionRate?: number): Promise<boolean> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/admin/partners/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, commissionRate }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Partner Hub: Get orders
   */
  async getPartnerOrders(params?: { partnerId?: string; status?: string }): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      const res = await this.fetchWithAuth(`/api/stayea/partner/orders?${searchParams.toString()}`)
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Partner Hub: Respond to order
   */
  async partnerRespondOrder(orderId: string, action: "accept" | "reject", reason?: string): Promise<boolean> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/orders/${orderId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: reason }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  async createPartnerService(payload: Record<string, unknown>): Promise<any | null> {
    try {
      const cleanPayload: Record<string, unknown> = {
        serviceType: payload.serviceType,
        title: payload.title,
        location: payload.location,
        price: Number(payload.price),
      }
      if (payload.partnerId) cleanPayload.partnerId = payload.partnerId
      if (payload.description) cleanPayload.description = String(payload.description)
      if (payload.originalPrice !== undefined && payload.originalPrice !== null && !isNaN(Number(payload.originalPrice))) {
        cleanPayload.originalPrice = Number(payload.originalPrice)
      }
      if (payload.unit) cleanPayload.unit = String(payload.unit)
      if (Array.isArray(payload.images)) cleanPayload.images = payload.images
      if (payload.status) cleanPayload.status = String(payload.status)
      if (payload.attributes && typeof payload.attributes === "object") {
        cleanPayload.attributes = payload.attributes
      }

      const res = await this.fetchWithAuth(`/api/stayea/partner/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        console.error("createPartnerService failed:", res.status, errJson)
        return null
      }
      const json = await res.json()
      return json.data || json
    } catch (err) {
      console.error("createPartnerService error:", err)
      return null
    }
  }

  async updatePartnerProfile(payload: Record<string, unknown>): Promise<any | null> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return null
      const json = await res.json()
      return json.data || json
    } catch {
      return null
    }
  }

  async updatePartnerService(id: string, payload: Record<string, unknown>): Promise<boolean> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      return res.ok
    } catch {
      return false
    }
  }

  async deletePartnerService(id: string): Promise<boolean> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/services/${id}`, {
        method: "DELETE",
      })
      return res.ok
    } catch {
      return false
    }
  }

  async getPartnerInventory(serviceId: string, startDate?: string, endDate?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({ serviceId })
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      const res = await this.fetchWithAuth(`/api/stayea/partner/catalog/inventory?${params.toString()}`)
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json || []
    } catch {
      return []
    }
  }

  async bulkUpdatePartnerInventory(payload: {
    serviceId: string
    dates: { date: string; isAvailable?: boolean; priceOverride?: number; totalSlots?: number; note?: string }[]
  }): Promise<boolean> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/inventory/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Partner Hub: Get partner profile for currently logged-in user
   */
  async getPartnerProfile(): Promise<any | null> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/profile`)
      if (res.ok) {
        const json = await res.json()
        const data = json.data !== undefined ? json.data : json
        return data && typeof data === "object" && data.id ? data : null
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Partner Hub: Get all partner facilities/branches for currently logged-in user
   */
  async getMyPartnerProfiles(): Promise<any[]> {
    try {
      const res = await this.fetchWithAuth(`/api/stayea/partner/my-profiles`)
      if (res.ok) {
        const json = await res.json()
        const data = json.data !== undefined ? json.data : json
        if (Array.isArray(data)) {
          return data.filter((p) => p && p.id)
        }
        if (data && typeof data === "object" && data.id) {
          return [data]
        }
        return []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Catalog: Get services across partners
   */
  async getCatalogServices(params?: { type?: string; search?: string; location?: string }): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.type) searchParams.set("type", params.type)
      if (params?.search) searchParams.set("search", params.search)
      if (params?.location) searchParams.set("location", params.location)
      const res = await fetch(`/api/stayea/partner/catalog/services?${searchParams.toString()}`)
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Validate a promotional coupon code
   */
  async validatePromo(code: string, subtotal?: number, category?: string) {
    try {
      const res = await fetch(`${this.baseUrl}/deals/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal, category }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch {
      return { isValid: false, message: "Không thể kiểm tra mã ưu đãi lúc này." }
    }
  }

  async getAdminPromotions(): Promise<any[]> {
    try {
      const res = await fetch(`${this.baseUrl}/deals/admin`, { headers: this.getAuthHeader() })
      if (!res.ok) return []
      const json = await res.json()
      const data = json.data || json
      return Array.isArray(data) ? data : data.items || []
    } catch {
      return []
    }
  }

  async createAdminPromotion(payload: Record<string, unknown>): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/deals/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return null
      const json = await res.json()
      return json.data || json
    } catch {
      return null
    }
  }

  async updateAdminPromotion(id: string, payload: Record<string, unknown>): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/deals/admin/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(payload),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Get active promotional deals & vouchers from backend
   */
  async getPromotions(category?: string): Promise<any[]> {
    try {
      const q = category ? `?category=${encodeURIComponent(category)}` : ""
      const res = await fetch(`${this.baseUrl}/deals${q}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Club Loyalty: Get current user loyalty profile
   */
  async getClubProfile(): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/club/profile`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Club Loyalty: Get perks
   */
  async getClubPerks(): Promise<any[]> {
    try {
      const res = await fetch(`/api/stayea/club/perks`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Club Loyalty: Claim perk
   */
  async claimClubPerk(perkId: string): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/club/claim-perk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ perkId }),
      })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Club Loyalty: Points history
   */
  async getClubHistory(): Promise<any[]> {
    try {
      const res = await fetch(`/api/stayea/club/history`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Payments: Get saved payment methods
   */
  async getPaymentMethods(): Promise<any[]> {
    try {
      const res = await fetch(`/api/stayea/payments/methods`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Payments: Add payment method
   */
  async addPaymentMethod(payload: any): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/payments/methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Payments: Delete payment method
   */
  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/payments/methods/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Payments: Set default payment method
   */
  async setDefaultPaymentMethod(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stayea/payments/methods/${id}/default`, {
        method: "PATCH",
        headers: this.getAuthHeader(),
      })
      return res.ok
    } catch {
      return false
    }
  }

  /**
   * Payouts: Partner requests payout withdrawal
   */
  async requestPartnerPayout(payload: {
    amount: number
    bankName?: string
    bankAccount?: string
    bankAccountHolder?: string
  }): Promise<{ success: boolean; message: string; payoutRequest?: any; availableBalance?: number }> {
    const res = await fetch(`/api/stayea/payments/payouts/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || "Không thể gửi yêu cầu quyết toán")
    }
    return json.data || json
  }

  /**
   * Payouts: Get partner settlement overview
   */
  async getPartnerPayoutOverview(): Promise<{
    partner: any
    availableBalance: number
    totalEarned: number
    totalWithdrawn: number
    payoutRequests: any[]
  }> {
    try {
      const res = await fetch(`/api/stayea/payments/payouts/overview`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return {
      partner: null,
      availableBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      payoutRequests: [],
    }
  }

  /**
   * Payouts: Admin lists all partner payout requests
   */
  async getAdminPayouts(status?: string): Promise<any[]> {
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : ""
      const res = await fetch(`/api/stayea/payments/admin/payouts${query}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Payouts: Admin updates payout status
   */
  async updateAdminPayoutStatus(
    id: string,
    payload: { status: string; adminNotes?: string; transactionRef?: string }
  ): Promise<any> {
    const res = await fetch(`/api/stayea/payments/admin/payouts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || "Không thể cập nhật trạng thái quyết toán")
    }
    return json.data || json
  }

  /**
   * Analytics: Real-time revenue aggregation & trends
   */
  async getAdminRevenueAnalytics(days: number = 7): Promise<any> {
    try {
      const res = await fetch(`/api/stayea/bookings/admin/analytics/revenue?days=${days}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data || json
      }
    } catch {
      // ignore
    }
    return null
  }

  /**
   * Catalog Moderation: Admin list all partner services
   */
  async getAdminServices(params?: {
    status?: string
    partnerId?: string
    type?: string
    search?: string
  }): Promise<any[]> {
    try {
      const sp = new URLSearchParams()
      if (params?.status) sp.set("status", params.status)
      if (params?.partnerId) sp.set("partnerId", params.partnerId)
      if (params?.type) sp.set("type", params.type)
      if (params?.search) sp.set("search", params.search)
      const qs = sp.toString() ? `?${sp.toString()}` : ""

      const res = await fetch(`/api/stayea/admin/partners/catalog/services${qs}`, {
        headers: this.getAuthHeader(),
      })
      if (res.ok) {
        const json = await res.json()
        const data = json.data || json
        return Array.isArray(data) ? data : data.items || []
      }
    } catch {
      // ignore
    }
    return []
  }

  /**
   * Catalog Moderation: Admin approve / suspend service listing
   */
  async updateAdminServiceStatus(
    id: string,
    status: "active" | "inactive" | "pending_approval",
    reason?: string
  ): Promise<any> {
    const res = await fetch(`/api/stayea/admin/partners/catalog/services/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify({ status, reason }),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || "Không thể cập nhật trạng thái dịch vụ")
    }
    return json.data || json
  }

  /**
   * Partner Governance: Admin approve / reject / suspend partner profile
   */
  async updateAdminPartnerStatus(
    id: string,
    payload: { status: string; commissionRate?: number; adminNotes?: string }
  ): Promise<any> {
    const res = await fetch(`/api/stayea/admin/partners/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || "Không thể cập nhật trạng thái đối tác")
    }
    return json.data || json
  }
}

export const stayeaApi = new StayeaApiService()
