"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bold,
  BookOpen,
  Calendar,
  Eye,
  FileEdit,
  FolderUp,
  Image as ImageIcon,
  Info,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { RichTextPreview } from "./rich-text-preview"
import { stayeaApi } from "@/lib/stayea-api-service"
import type { PartnerProfileData } from "../types"

interface PartnerBlogItem {
  id: string
  title: string
  content: string
  slug: string
  status: "draft" | "published" | "archived"
  tags: string[]
  category: string
  author: string
  viewCount: number
  imageUrl?: string | null
  partnerId?: string | null
  createdAt: string
  publishedAt?: string | null
}

const PARTNER_BLOG_CATEGORIES = [
  { id: "cam-nang", label: "Cẩm nang du lịch Phú Quốc" },
  { id: "diem-den", label: "Địa điểm check-in gần cơ sở" },
  { id: "am-thuc", label: "Quán ngon & Món ăn đặc sản" },
  { id: "luu-tru", label: "Hướng dẫn nhận phòng & Tiện ích Homestay" },
  { id: "kinh-nghiem-xe", label: "Kinh nghiệm phượt & Giao nhận xe" },
  { id: "trai-nghiem", label: "Tour đảo & Lặn biển" },
]

const PARTNER_SAMPLE_TEMPLATES = [
  {
    title: "Hướng dẫn đường đi & Thủ tục nhận phòng thuận tiện nhất",
    category: "luu-tru",
    content: `### 🏡 Chào mừng quý khách đến với cơ sở của chúng tôi!
Để chuyến đi nghỉ dưỡng tại Phú Quốc của bạn thật trọn vẹn và thư thái, cơ sở xin gửi đến bạn một số hướng dẫn chi tiết:

### 📍 Chỉ dẫn đường đi & Phương tiện di chuyển:
- Từ Sân bay Phú Quốc: Bạn chỉ mất khoảng 15 phút đi taxi hoặc xe đưa đón.
- Định vị Google Maps chính xác: Tìm kiếm tên cơ sở để có lộ trình nhanh nhất.

### ⏰ Thời gian Check-in & Nhận phòng:
- **Giờ nhận phòng tiêu chuẩn**: 14:00 (Hỗ trợ nhận phòng sớm nếu phòng trống trước).
- **Giờ trả phòng**: 12:00 trưa hôm sau.
- **Dịch vụ hỗ trợ**: Giữ hành lý miễn phí nếu bạn đến sớm hoặc có chuyến bay muộn.

> 💡 **Mẹo nhỏ**: Cơ sở chuẩn bị sẵn nước suối mát, trà và bản đồ du lịch Phú Quốc tại sảnh đón tiếp!`,
  },
  {
    title: "Cung đường phượt xe máy ngắm hoàng hôn đẹp mê hồn ở Phú Quốc",
    category: "kinh-nghiem-xe",
    content: `### 🛵 Trải nghiệm vi vu gió biển trên cung đường ven biển
Thuê xe máy tự lái là cách tuyệt vời nhất để tự do khám phá mọi ngóc ngách của Đảo Ngọc.

### 🌅 Lộ trình ngắm hoàng hôn đỉnh nhất:
- **16:00**: Xuất phát từ trung tâm Dương Đông, đi dọc đường Trần Hưng Đạo về hướng Bãi Trường.
- **17:15**: Dừng chân tại các quán bar ven biển ngắm mặt trời đỏ rực từ từ lặn xuống mặt biển.
- **18:30**: Ghé Chợ đêm Dinh Cậu thưởng thức hải sản và kem cuộn Thái Lan.

> 💡 **Quy tắc an toàn**: Đội mũ bảo hiểm đúng quy chuẩn, kiểm tra phanh và xăng trước khi khởi hành. Đội xe chúng tôi hỗ trợ cứu hộ 24/7!`,
  },
]

function parseDriveUrl(input: string): { convertedUrl: string; isDrive: boolean } {
  if (!input) return { convertedUrl: "", isDrive: false }
  const trimmed = input.trim()
  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (fileIdMatch && fileIdMatch[1]) {
      return {
        convertedUrl: `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`,
        isDrive: true,
      }
    }
  }
  return { convertedUrl: trimmed, isDrive: false }
}

interface PartnerBlogsManagerProps {
  profile: PartnerProfileData
}

export function PartnerBlogsManager({ profile }: PartnerBlogsManagerProps) {
  const [blogs, setBlogs] = useState<PartnerBlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<PartnerBlogItem | null>(null)

  // Form Fields
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("cam-nang")
  const [imageUrl, setImageUrl] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("PhuQuoc, CamNang")
  const [status, setStatus] = useState<"draft" | "published">("published")
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load partner blogs
  const fetchPartnerBlogs = async () => {
    setLoading(true)
    try {
      const data = await stayeaApi.getPartnerBlogArticles(profile.id)
      setBlogs(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Không thể nạp danh sách bài viết.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartnerBlogs()
  }, [profile.id])

  const handleOpenModal = (blog?: PartnerBlogItem) => {
    if (blog) {
      setEditingBlog(blog)
      setTitle(blog.title || "")
      setCategory(blog.category || "cam-nang")
      setImageUrl(blog.imageUrl || "")
      setContent(blog.content || "")
      setTagsInput(Array.isArray(blog.tags) ? blog.tags.join(", ") : "PhuQuoc")
      setStatus(blog.status === "published" ? "published" : "draft")
    } else {
      setEditingBlog(null)
      setTitle("")
      setCategory(
        profile.businessType === "transport"
          ? "kinh-nghiem-xe"
          : profile.businessType === "tour"
          ? "trai-nghiem"
          : "luu-tru"
      )
      setImageUrl(
        profile.businessType === "transport"
          ? "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
          : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
      )
      setContent("")
      setTagsInput("PhuQuoc, KinhNghiem, DuLich")
      setStatus("published")
    }
    setDescTab("edit")
    setIsModalOpen(true)
  }

  const handleImageUrlChange = (url: string) => {
    const { convertedUrl, isDrive } = parseDriveUrl(url)
    setImageUrl(convertedUrl)
    if (isDrive) {
      toast.success("Đã tối ưu hóa liên kết Google Drive!")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Tệp vượt quá 10MB.")
      return
    }

    setIsUploading(true)
    try {
      const uploaded = await stayeaApi.uploadImage(file)
      if (uploaded) {
        setImageUrl(uploaded)
        toast.success("Đã tải ảnh lên thành công!")
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImageUrl(reader.result)
            toast.success("Đã tải ảnh lên!")
          }
        }
        reader.readAsDataURL(file)
      }
    } catch {
      toast.error("Lỗi khi tải ảnh.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const replacement = `${prefix}${selected || "nội dung"}${suffix}`
    setContent(content.substring(0, start) + replacement + content.substring(end))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || "nội dung".length))
    }, 50)
  }

  const applyTemplate = (tpl: typeof PARTNER_SAMPLE_TEMPLATES[0]) => {
    setTitle(tpl.title)
    setCategory(tpl.category)
    setContent(tpl.content)
    toast.success("Đã chèn mẫu bài viết!")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết.")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      if (editingBlog) {
        const updated = await stayeaApi.updatePartnerBlogArticle(
          editingBlog.id,
          {
            title,
            content,
            category,
            imageUrl,
            tags,
            status,
            author: profile.businessName || profile.contactName,
          },
          profile.id
        )
        if (updated) {
          toast.success("Đã cập nhật bài viết blog!")
          setIsModalOpen(false)
          fetchPartnerBlogs()
        }
      } else {
        const created = await stayeaApi.createPartnerBlogArticle(
          {
            title,
            content,
            category,
            imageUrl,
            tags,
            status,
            author: profile.businessName || profile.contactName,
            partnerId: profile.id,
          },
          profile.id
        )
        if (created) {
          toast.success("Đã đăng bài viết blog thành công!")
          setIsModalOpen(false)
          fetchPartnerBlogs()
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi lưu bài viết blog.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, blogTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${blogTitle}"?`)) return
    try {
      const ok = await stayeaApi.deletePartnerBlogArticle(id, profile.id)
      if (ok) {
        toast.success("Đã xóa bài viết.")
        setBlogs((prev) => prev.filter((b) => b.id !== id))
      }
    } catch {
      toast.error("Không thể xóa bài viết.")
    }
  }

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const publishedCount = blogs.filter((b) => b.status === "published").length
  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Top Banner & Explanation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 border border-emerald-700/30 p-6 sm:p-7 shadow-md text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kênh Cẩm Nang & Chia Sẻ Du Lịch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Bài Viết & Cẩm Nang Của Cơ Sở
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Viết bài chia sẻ kinh nghiệm khám phá Phú Quốc, hướng dẫn nhận phòng hoặc mẹo du lịch giúp cơ sở{" "}
            <strong className="text-white font-semibold">{profile.businessName}</strong> tăng uy tín thương hiệu và được{" "}
            hệ thống STAYEA ưu tiên gợi ý tới du khách.
          </p>
        </div>

        {/* Decorative blur */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
            <span>Đã xuất bản: </span>
            <strong className="text-emerald-700 font-bold">{publishedCount} bài</strong>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
            <span>Lượt xem du khách: </span>
            <strong className="text-sky-700 font-bold">{totalViews} lượt</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách bài viết của bạn...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Cơ sở chưa có bài viết blog nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy viết một bài chia sẻ cẩm nang du lịch đầu tiên để thu hút du khách tìm đến {profile.businessName}!
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => {
            const isPub = blog.status === "published"
            const catObj = PARTNER_BLOG_CATEGORIES.find((c) => c.id === blog.category)

            return (
              <div
                key={blog.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        blog.imageUrl ||
                        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
                      }}
                    />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-emerald-300 border border-white/20 backdrop-blur-md">
                        {catObj?.label || blog.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md ${
                          isPub
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-slate-100 text-slate-600 border-slate-300"
                        }`}
                      >
                        {isPub ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {blog.content.replace(/[#*>`-]/g, "").slice(0, 110)}...
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(blog)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Chỉnh sửa bài viết"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL VIẾT / CHỈNH SỬA BLOG CHO ĐỐI TÁC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-900/60 rounded-2xl shadow-2xl p-5 sm:p-7 text-white my-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{editingBlog ? "Chỉnh Sửa Bài Viết Blog" : "Viết Bài Cẩm Nang / Blog Mới"}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bài viết xuất bản dưới danh nghĩa cơ sở: <strong className="text-emerald-300">{profile.businessName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Tiêu đề bài viết <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Top 5 Địa Điểm Chụp Ảnh Đẹp Nhất Quanh Homestay Chúng Tôi..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Chuyên mục bài viết
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {PARTNER_BLOG_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Trạng thái xuất bản
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="published">Xuất bản công khai ngay</option>
                    <option value="draft">Lưu bản nháp</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & Drive */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Ảnh bìa bài viết (Link Drive hoặc tệp từ máy)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Dán link ảnh hoặc link Google Drive..."
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <FolderUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tải ảnh từ máy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preview Image */}
                {imageUrl && (
                  <div className="relative mt-2 p-2 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center gap-3">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      <img
                        src={imageUrl}
                        alt="Xem trước ảnh bìa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs text-slate-300 truncate">
                      {imageUrl}
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="p-1 rounded text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Rich Text Editor with Markdown Toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Nội dung bài viết (In đậm, In nghiêng, Danh sách, Tiêu đề)
                  </label>

                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setDescTab("edit")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        descTab === "edit"
                          ? "bg-emerald-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileEdit className="w-3 h-3" />
                      <span>Soạn thảo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("preview")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        descTab === "preview"
                          ? "bg-emerald-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem trước Live Preview</span>
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                {descTab === "edit" && (
                  <div className="flex items-center gap-1.5 p-2 bg-slate-800/90 border border-slate-700 rounded-t-xl flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**")}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="In đậm (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("*", "*")}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="In nghiêng (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting("### ")}
                      className="px-2 py-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                      title="Tiêu đề H3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("- ")}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Gạch đầu dòng"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("1. ")}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Danh sách số"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("> 💡 **Lưu ý**: ")}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Hộp lưu ý nổi bật"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Mẫu:</span>
                      {PARTNER_SAMPLE_TEMPLATES.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] font-semibold cursor-pointer"
                        >
                          {idx === 0 ? "Hướng dẫn nhận phòng" : "Cung đường phượt"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Textarea vs Preview */}
                {descTab === "edit" ? (
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết cẩm nang hướng dẫn du khách tại đây..."
                    className="w-full px-3.5 py-2.5 rounded-b-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 min-h-[200px] max-h-[300px] overflow-y-auto">
                    <RichTextPreview content={content} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Thẻ từ khóa / Tags (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ví dụ: PhuQuoc, DuLich, Homestay, ThueXe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingBlog ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{editingBlog ? "Lưu Thay Đổi Bài Viết" : "Xuất Bản Bài Viết"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
