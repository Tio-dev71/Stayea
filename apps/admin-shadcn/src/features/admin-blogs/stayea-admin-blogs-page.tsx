"use client"

import { useState, useEffect, useRef } from "react"
import {
  Bold,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  FileText,
  FolderUp,
  Image as ImageIcon,
  Info,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { StayeaAdminHeader } from "@/features/admin-dashboard/components/stayea-admin-header"
import { StayeaAdminSidebar } from "@/features/admin-dashboard/components/stayea-admin-sidebar"
import { StayeaAdminFooter } from "@/features/admin-dashboard/components/stayea-admin-footer"
import { RichTextPreview } from "@/features/partner-portal/components/rich-text-preview"
import { stayeaApi } from "@/lib/stayea-api-service"

export interface BlogArticleItem {
  id: string
  title: string
  content: string
  slug: string
  status: "draft" | "published" | "archived"
  tags: string[]
  category: string
  author: string
  viewCount: number
  isPinned: boolean
  imageUrl?: string | null
  partnerId?: string | null
  createdAt: string
  publishedAt?: string | null
}

const BLOG_CATEGORIES: { id: string; label: string; badgeColor: string }[] = [
  { id: "all", label: "Tất cả chuyên mục", badgeColor: "bg-slate-100 text-slate-700" },
  { id: "cam-nang", label: "Cẩm nang du lịch", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { id: "diem-den", label: "Điểm đến & Check-in", badgeColor: "bg-sky-100 text-sky-800 border-sky-200" },
  { id: "am-thuc", label: "Ẩm thực & Món ngon", badgeColor: "bg-amber-100 text-amber-800 border-amber-200" },
  { id: "luu-tru", label: "Kinh nghiệm Homestay/Villa", badgeColor: "bg-teal-100 text-teal-800 border-teal-200" },
  { id: "trai-nghiem", label: "Tour & Lặn biển", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { id: "kinh-nghiem-xe", label: "Kinh nghiệm thuê xe & Phượt", badgeColor: "bg-rose-100 text-rose-800 border-rose-200" },
]

const SAMPLE_BLOG_TEMPLATES = [
  {
    title: "Cẩm nang 4 ngày 3 đêm tự túc tại Đảo Ngọc Phú Quốc",
    category: "cam-nang",
    content: `### 🏝️ Lời mở đầu: Vì sao nên chọn Phú Quốc mùa này?
Phú Quốc – hòn đảo ngọc phía Tây Nam Tổ quốc – sở hữu những bãi biển trong xanh như ngọc bích, cát trắng mịn màng và những rạn san hô tự nhiên đa dạng bậc nhất Việt Nam. Bài viết này STAYEA sẽ gửi đến bạn lịch trình trọn gói và chi tiết nhất!

### 📅 Lịch trình gợi ý 4N3Đ tinh gọn:
- **Ngày 1**: Hạ cánh Sân bay Phú Quốc, nhận xe tự lái giao tận nơi, check-in Villa/Homestay nghỉ dưỡng và ngắm hoàng hôn Bãi Trường.
- **Ngày 2**: Khám phá Nam đảo, lên Cano 4 đảo (Hòn Mây Rút, Gầm Ghì, Móng Tay), lặn ngắm san hô và chụp Flycam.
- **Ngày 3**: Chinh phục Bắc đảo, tham quan Rạch Vẹm ngắm sao biển, ghé Mũi Gành Dầu ngắm hải giới Campuchia.
- **Ngày 4**: Thưởng thức bún quậy Kiến Xây trứ danh, mua hải sản khô Chợ Đêm và bay về.

> 💡 **Mẹo nhỏ từ STAYEA**: Bạn nên đặt thuê xe máy hoặc ô tô tự lái trước ít nhất 2 ngày để đảm bảo có dòng xe đời mới tiết kiệm xăng nhất!`,
  },
  {
    title: "Top 7 món ngon Phú Quốc nhất định phải thử một lần trong đời",
    category: "am-thuc",
    content: `### 🍜 Hương vị ẩm thực biển đảo nức lòng du khách
Đến Phú Quốc mà chưa thưởng thức những món ăn đặc sản đậm đà hương biển cả thì chuyến đi chưa thể trọn vẹn.

### 🌟 Danh sách món ngon đừng bỏ lỡ:
1. **Bún quậy Phú Quốc**: Tự tay pha nước chấm theo khẩu vị riêng, sợi bún tươi làm tại chỗ kết hợp chả cá chả tôm ngọt lịm.
2. **Gỏi cá trích cuốn bánh tráng**: Cá tươi rói thái mỏng, trộn cùng dừa nạo, hành tây, ngò rí và chấm nước mắm nhĩ Phú Quốc.
3. **Nhum biển nướng mỡ hành**: Béo ngậy, ngọt thanh và ngập tràn dinh dưỡng.
4. **Còi biên mai nướng muối ớt**: Vị cay nồng hòa quyện độ dai ngọt giòn sần sật.

> 💡 **Gợi ý**: Các quán hải sản tươi sống khu vực Hàm Ninh và Chợ đêm Dương Đông luôn có nguồn hải sản cập bến trong ngày!`,
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

export function StayeaAdminBlogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [blogs, setBlogs] = useState<BlogArticleItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<BlogArticleItem | null>(null)

  // Form Fields
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("cam-nang")
  const [author, setAuthor] = useState("Ban Quản Trị STAYEA")
  const [imageUrl, setImageUrl] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("PhuQuoc, CamNang, DuLich")
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published")
  const [isPinned, setIsPinned] = useState(false)
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load blogs from API
  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const data = await stayeaApi.getAdminBlogArticles()
      setBlogs(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Không thể tải danh sách bài viết blog.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Open Create/Edit Modal
  const handleOpenModal = (article?: BlogArticleItem) => {
    if (article) {
      setEditingArticle(article)
      setTitle(article.title || "")
      setCategory(article.category || "cam-nang")
      setAuthor(article.author || "Ban Quản Trị STAYEA")
      setImageUrl(article.imageUrl || "")
      setContent(article.content || "")
      setTagsInput(Array.isArray(article.tags) ? article.tags.join(", ") : "PhuQuoc")
      setStatus(article.status || "published")
      setIsPinned(Boolean(article.isPinned))
    } else {
      setEditingArticle(null)
      setTitle("")
      setCategory("cam-nang")
      setAuthor("Ban Quản Trị STAYEA")
      setImageUrl("https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80")
      setContent("")
      setTagsInput("PhuQuoc, CamNang, DuLich")
      setStatus("published")
      setIsPinned(false)
    }
    setDescTab("edit")
    setIsModalOpen(true)
  }

  const handleImageUrlChange = (url: string) => {
    const { convertedUrl, isDrive } = parseDriveUrl(url)
    setImageUrl(convertedUrl)
    if (isDrive) {
      toast.success("Đã tối ưu hóa liên kết Google Drive sang ảnh hiển thị tốc độ cao!")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp vượt quá 10MB.")
      return
    }

    setIsUploading(true)
    try {
      const uploaded = await stayeaApi.uploadImage(file)
      if (uploaded) {
        setImageUrl(uploaded)
        toast.success("Tải ảnh bìa lên thành công!")
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImageUrl(reader.result)
            toast.success("Đã tải ảnh lên thành công!")
          }
        }
        reader.readAsDataURL(file)
      }
    } catch {
      toast.error("Không thể tải ảnh từ máy.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Markdown Toolbar Insertion
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

  const applyTemplate = (tpl: typeof SAMPLE_BLOG_TEMPLATES[0]) => {
    setTitle(tpl.title)
    setCategory(tpl.category)
    setContent(tpl.content)
    toast.success(`Đã áp dụng mẫu "${tpl.title}"`)
  }

  // Submit Blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Tiêu đề bài viết không được để trống.")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    setIsSubmitting(true)
    try {
      if (editingArticle) {
        const updated = await stayeaApi.updateAdminBlogArticle(editingArticle.id, {
          title,
          content,
          category,
          author,
          imageUrl,
          tags,
          status,
          isPinned,
        })
        if (updated) {
          toast.success("Cập nhật bài viết blog thành công!")
          setIsModalOpen(false)
          fetchBlogs()
        }
      } else {
        const created = await stayeaApi.createAdminBlogArticle({
          title,
          content,
          category,
          author,
          imageUrl,
          tags,
          status,
          isPinned,
        })
        if (created) {
          toast.success("Đã xuất bản bài viết blog mới!")
          setIsModalOpen(false)
          fetchBlogs()
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Lỗi khi lưu bài viết blog.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Blog
  const handleDelete = async (id: string, blogTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${blogTitle}"?`)) return
    try {
      const ok = await stayeaApi.deleteAdminBlogArticle(id)
      if (ok) {
        toast.success("Đã xóa bài viết.")
        setBlogs((prev) => prev.filter((b) => b.id !== id))
      }
    } catch {
      toast.error("Không thể xóa bài viết.")
    }
  }

  // Quick Toggle Status
  const handleToggleStatus = async (article: BlogArticleItem) => {
    const nextStatus = article.status === "published" ? "draft" : "published"
    try {
      await stayeaApi.updateAdminBlogArticle(article.id, { status: nextStatus })
      toast.success(nextStatus === "published" ? "Đã xuất bản bài viết!" : "Đã chuyển về bản nháp.")
      setBlogs((prev) =>
        prev.map((b) => (b.id === article.id ? { ...b, status: nextStatus } : b))
      )
    } catch {
      toast.error("Không thể cập nhật trạng thái bài viết.")
    }
  }

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== "all" && b.category !== selectedCategory) return false
    if (selectedStatus !== "all" && b.status !== selectedStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0)
  const publishedCount = blogs.filter((b) => b.status === "published").length
  const draftCount = blogs.filter((b) => b.status === "draft").length

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Header */}
      <StayeaAdminHeader
        searchPlaceholder="Tìm kiếm bài viết, cẩm nang, tác giả..."
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSearch={(q) => setSearchQuery(q)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Responsive Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <StayeaAdminSidebar activeTab="bai-viet-blogs" />
        </div>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Title & Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1.5 border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Quản Trị Nội Dung & Cẩm Nang Du Lịch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Quản Lý Bài Viết & Blogs STAYEA
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Xuất bản bài viết cẩm nang du lịch Phú Quốc, kinh nghiệm homestay, review ẩm thực và chia sẻ của đối tác
              </p>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2.5 rounded-xl bg-[#007a48] hover:bg-[#006038] text-white text-xs font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Viết Bài Blog Mới</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Tổng bài viết</div>
                <div className="text-xl font-extrabold text-slate-900">{blogs.length}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Đã xuất bản</div>
                <div className="text-xl font-extrabold text-emerald-700">{publishedCount}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Bản nháp</div>
                <div className="text-xl font-extrabold text-amber-700">{draftCount}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Lượt xem du khách</div>
                <div className="text-xl font-extrabold text-sky-700">{totalViews.toLocaleString("vi-VN")}</div>
              </div>
            </div>
          </div>

          {/* Category Tabs & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản (Live)</option>
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#007a48] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#007a48] mx-auto mb-2" />
              <p className="text-xs text-slate-500">Đang tải danh sách bài viết blog...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Chưa có bài viết blog nào</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bấm &quot;Viết Bài Blog Mới&quot; để tạo bài cẩm nang du lịch đầu tiên cho du khách Phú Quốc.
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 px-4 py-2 rounded-xl bg-[#007a48] hover:bg-[#006038] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Bài Viết Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlogs.map((blog) => {
                const catObj = BLOG_CATEGORIES.find((c) => c.id === blog.category)
                const isPub = blog.status === "published"

                return (
                  <div
                    key={blog.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image Header */}
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

                        {/* Category & Pin badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                              catObj?.badgeColor || "bg-white/90 text-slate-700"
                            }`}
                          >
                            {catObj?.label || blog.category}
                          </span>

                          <div className="flex items-center gap-1">
                            {blog.isPinned && (
                              <span className="p-1 rounded-full bg-amber-500 text-white shadow-xs" title="Ghim đầu trang">
                                <Pin className="w-3 h-3" />
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleStatus(blog)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md transition-colors cursor-pointer ${
                                isPub
                                  ? "bg-emerald-600 text-white border-emerald-500"
                                  : "bg-slate-800/80 text-white border-slate-700"
                              }`}
                            >
                              {isPub ? "Xuất bản" : "Bản nháp"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#007a48] transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {blog.content.replace(/[#*>`-]/g, "").slice(0, 120)}...
                        </p>

                        {/* Author & Meta */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                          <span className="font-medium text-slate-600 truncate max-w-[150px]">
                            {blog.author || "Ban Quản Trị STAYEA"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{blog.viewCount || 0}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenModal(blog)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
        </main>
      </div>

      {/* 4. Footer */}
      <StayeaAdminFooter />

      {/* CREATE / EDIT BLOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-900/60 rounded-2xl shadow-2xl p-5 sm:p-7 text-white my-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{editingArticle ? "Chỉnh Sửa Bài Viết Blog" : "Soạn Thảo Bài Viết Blog Mới"}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cung cấp cẩm nang và trải nghiệm cho hàng ngàn du khách trên STAYEA
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

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Tiêu đề bài viết Blog <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cẩm Nang Khám Phá Nam Đảo Phú Quốc Tự Túc 2026..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category & Author & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Chuyên mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cam-nang">Cẩm nang du lịch</option>
                    <option value="diem-den">Điểm đến & Check-in</option>
                    <option value="am-thuc">Ẩm thực & Món ngon</option>
                    <option value="luu-tru">Kinh nghiệm Homestay/Villa</option>
                    <option value="trai-nghiem">Tour & Lặn biển</option>
                    <option value="kinh-nghiem-xe">Kinh nghiệm thuê xe & Phượt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tác giả / Cơ sở
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
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
                    <option value="published">Xuất bản công khai (Live)</option>
                    <option value="draft">Lưu bản nháp (Draft)</option>
                    <option value="archived">Lưu trữ (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & Drive */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Ảnh bìa đại diện bài viết</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Hỗ trợ Link Drive & File máy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Dán link ảnh trực tiếp hoặc link Google Drive..."
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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

                {/* Preview cover */}
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
                    Nội dung bài viết (Hỗ trợ định dạng in đậm, in nghiêng, danh sách, hộp lưu ý)
                  </label>

                  {/* Edit vs Preview Toggle */}
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
                      <span className="text-[10px] text-slate-400">Mẫu gợi ý:</span>
                      {SAMPLE_BLOG_TEMPLATES.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] font-semibold cursor-pointer"
                        >
                          {idx === 0 ? "Lịch trình 4N3Đ" : "Top món ngon"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Textarea or Preview */}
                {descTab === "edit" ? (
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết nội dung bài blog cẩm nang tại đây..."
                    className="w-full px-3.5 py-2.5 rounded-b-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 min-h-[200px] max-h-[300px] overflow-y-auto">
                    <RichTextPreview content={content} />
                  </div>
                )}
              </div>

              {/* Tags & Pinned Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Thẻ từ khóa / Tags (cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Ví dụ: PhuQuoc, CamNang, AnChoi, Homestay"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="pinArticle"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="pinArticle" className="text-xs font-semibold text-slate-200 cursor-pointer">
                    Ghim bài lên đầu trang
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
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
                  ) : editingArticle ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{editingArticle ? "Lưu Thay Đổi Bài Viết" : "Xuất Bản Bài Viết"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
