import { useState, useEffect } from "react"
import { CalendarDays, MapPin, ChevronDown, X } from "lucide-react"

export interface NewDayData {
  dayNumber: number
  title: string
  destination: string
  description: string
}

interface AddDayModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDay: (data: NewDayData) => void
  defaultDayNumber?: number
  existingDaysCount?: number
}

export function AddDayModal({
  isOpen,
  onClose,
  onAddDay,
  defaultDayNumber,
  existingDaysCount = 3,
}: AddDayModalProps) {
  const nextNum = defaultDayNumber ?? existingDaysCount + 1
  const [dayNumber, setDayNumber] = useState<number>(nextNum)
  const [title, setTitle] = useState("")
  const [destination, setDestination] = useState("")
  const [description, setDescription] = useState("")

  // Update dayNumber when modal opens or existing count changes
  useEffect(() => {
    if (isOpen) {
      setDayNumber(defaultDayNumber ?? existingDaysCount + 1)
      setTitle("")
      setDestination("")
      setDescription("")
    }
  }, [isOpen, defaultDayNumber, existingDaysCount])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      return
    }

    onAddDay({
      dayNumber,
      title: title.trim(),
      destination: destination.trim(),
      description: description.trim(),
    })
    onClose()
  }

  const maxSelectable = Math.max(10, existingDaysCount + 3)
  const dayOptions = Array.from({ length: maxSelectable }, (_, i) => i + 1)

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center lg:justify-end lg:pr-10 bg-slate-900/15 backdrop-blur-[0.5px] rounded-3xl p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-[390px] rounded-2xl bg-white p-5 shadow-2xl border border-slate-200/90 text-left transition-all animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-day-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1b7a4e] flex items-center justify-center text-white shadow-xs shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h3
              id="add-day-dialog-title"
              className="text-sm font-bold text-slate-900 tracking-tight"
            >
              Thêm ngày
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng hộp thoại"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3.5">
          {/* Số thứ tự ngày */}
          <div>
            <label
              htmlFor="day-number-select"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Số thứ tự ngày <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                id="day-number-select"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full appearance-none px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer pr-10"
              >
                {dayOptions.map((num) => (
                  <option key={num} value={num}>
                    Ngày {num} ➔
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tiêu đề ngày */}
          <div>
            <label
              htmlFor="day-title-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Tiêu đề ngày <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="day-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề ngày (ví dụ: Khám phá Đông đảo)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Địa điểm chính (tùy chọn) */}
          <div>
            <label
              htmlFor="day-destination-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Địa điểm chính (tùy chọn)
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 pointer-events-none shrink-0" />
              <input
                id="day-destination-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Nhập địa điểm chính trong ngày"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Mô tả ngắn (tùy chọn) */}
          <div>
            <label
              htmlFor="day-description-input"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Mô tả ngắn (tùy chọn)
            </label>
            <textarea
              id="day-description-input"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setDescription(e.target.value)
                }
              }}
              placeholder="Viết mô tả ngắn về ngày này (tối đa 200 ký tự)"
              maxLength={200}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none h-20"
            />
            <div className="text-right text-[11px] text-slate-400 font-medium mt-1">
              {description.length}/200
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1b7a4e] hover:bg-emerald-700 text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
            >
              Thêm ngày
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
