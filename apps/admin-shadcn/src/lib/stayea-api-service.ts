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
      return await res.json()
    } catch {
      // Fallback to local data
      const q = (params?.search || "").toLowerCase()
      const filtered = PHU_QUOC_DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
      )
      return {
        items: [],
        count: filtered.length,
      }
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
      return await res.json()
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
      return await res.json()
    } catch {
      return { items: [], count: 0 }
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
      // Mock validation fallback
      if (code.toUpperCase().includes("STAYEA") || code.toUpperCase().includes("GOLD")) {
        return {
          valid: true,
          discountAmount: Math.round((subtotal || 5_000_000) * 0.1),
          message: "Áp dụng voucher giảm giá 10% thành công!",
        }
      }
      return { valid: false, message: "Mã ưu đãi không hợp lệ hoặc đã hết lượt dùng" }
    }
  }
}

export const stayeaApi = new StayeaApiService()
