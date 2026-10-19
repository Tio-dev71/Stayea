"use client"

import * as React from "react"
import {
  Bed,
  Trophy,
  Luggage,
  Car,
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronDown,
} from "lucide-react"

type TabType = "stay" | "experience" | "package" | "transport"

const DEFAULT_CHECK_IN = "Chọn ngày"
const DEFAULT_CHECK_OUT = "Chọn ngày"

function scrollToTarget(e: React.FormEvent, tab: TabType) {
  e.preventDefault()
  let targetId = "#accommodations"
  if (tab === "experience") targetId = "#experiences"
  if (tab === "transport") targetId = "#transportation"
  if (tab === "package") targetId = "#packages"
  const element = document.querySelector(targetId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

export function SearchWidget() {
  const widgetRef = React.useRef<HTMLDivElement>(null)

  // Default to "transport" tab active to match the provided design reference image
  const [activeTab, setActiveTab] = React.useState<TabType>("experience")
  const [pickupPoint, setPickupPoint] = React.useState("Chọn địa điểm")
  const [destination, setDestination] = React.useState("Phú Quốc, Việt Nam")
  const [experienceChoice, setExperienceChoice] = React.useState("Chọn trải nghiệm")
  const [serviceType, setServiceType] = React.useState("Đưa đón sân bay")
  const [guests, setGuests] = React.useState("2 khách")

  const [guestDropdownOpen, setGuestDropdownOpen] = React.useState(false)
  const [expDropdownOpen, setExpDropdownOpen] = React.useState(false)
  const [serviceDropdownOpen, setServiceDropdownOpen] = React.useState(false)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setGuestDropdownOpen(false)
        setExpDropdownOpen(false)
        setServiceDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={widgetRef}
      className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] p-2.5 sm:p-3"
    >
      {/* 4 Tabs above the inputs inside the white card */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-2.5 px-1 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("stay")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "stay"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Bed className={`w-3.5 h-3.5 ${activeTab === "stay" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Lưu trú</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "experience"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Trophy className={`w-3.5 h-3.5 ${activeTab === "experience" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Trải nghiệm</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("package")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "package"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Luggage className={`w-3.5 h-3.5 ${activeTab === "package" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Gói</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transport")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "transport"
              ? "bg-[#0c3b40] text-white shadow-sm"
              : "text-slate-700 hover:text-[#0c3b40] hover:bg-slate-50"
          }`}
        >
          <Car className={`w-3.5 h-3.5 ${activeTab === "transport" ? "text-amber-400" : "text-[#c29851]"}`} />
          <span>Di chuyển</span>
        </button>
      </div>

      {/* Inputs & search button row */}
      <form
        onSubmit={(e) => scrollToTarget(e, activeTab)}
        className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
      >
        {/* ========================================================= */}
        {/* CASE 1: TRANSPORT MODE (Active in reference image)         */}
        {/* ========================================================= */}
        {activeTab === "transport" ? (
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center border border-slate-200/90 rounded-xl divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            {/* Field 1: Điểm đón */}
            <div className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 rounded-l-xl transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Điểm đón
                </label>
                <input
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full bg-transparent text-[12px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none leading-tight"
                  placeholder="Chọn địa điểm"
                />
              </div>
            </div>

            {/* Field 2: Ngày đi */}
            <div className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày đi
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  Chọn ngày
                </span>
              </div>
            </div>

            {/* Field 3: Loại dịch vụ */}
            <div className="relative px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors">
              <Car className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Loại dịch vụ
                </span>
                <button
                  type="button"
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span className="truncate">{serviceType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {serviceDropdownOpen && (
                <div className="absolute top-full left-0 w-52 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {[
                    "Đưa đón sân bay",
                    "Thuê ô tô",
                    "Thuê xe máy",
                    "Tài xế riêng",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setServiceType(s);
                        setServiceDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 4: Số khách */}
            <div className="relative px-3.5 py-1.5 min-w-[130px] flex items-center gap-2.5 hover:bg-slate-50/60 rounded-r-xl transition-colors">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Số khách
                </span>
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span>{guests}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {guestDropdownOpen && (
                <div className="absolute top-full right-0 w-36 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {["1 khách", "2 khách", "3 - 5 khách", "6+ khách"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGuests(g);
                        setGuestDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "experience" ? (
          /* ========================================================= */
          /* CASE 2: EXPERIENCE MODE (Active in Khám phá design)        */
          /* ========================================================= */
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center border border-slate-200/90 rounded-xl divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
            {/* Field 1: Điểm đến */}
            <div className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 rounded-l-xl transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Điểm đến
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-[12px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none leading-tight"
                  placeholder="Phú Quốc, Việt Nam"
                />
              </div>
            </div>

            {/* Field 2: Trải nghiệm */}
            <div className="relative px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors">
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Trải nghiệm
                </span>
                <button
                  type="button"
                  onClick={() => setExpDropdownOpen(!expDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span className="truncate">{experienceChoice}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {expDropdownOpen && (
                <div className="absolute top-full left-0 w-60 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {[
                    "Tour 4 đảo cáp treo",
                    "Lặn biển ngắm san hô",
                    "Ngắm hoàng hôn Sunset Sanato",
                    "Trải nghiệm câu mực đêm",
                    "Khám phá Rạch Vẹm sao biển",
                  ].map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => {
                        setExperienceChoice(exp);
                        setExpDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 3: Ngày khởi hành */}
            <div className="px-3.5 py-1.5 flex-1 flex items-center gap-2.5 hover:bg-slate-50/60 transition-colors cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Ngày khởi hành
                </span>
                <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                  Chọn ngày
                </span>
              </div>
            </div>

            {/* Field 4: Số khách */}
            <div className="relative px-3.5 py-1.5 min-w-[130px] flex items-center gap-2.5 hover:bg-slate-50/60 rounded-r-xl transition-colors">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Số khách
                </span>
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="w-full flex items-center justify-between text-left text-[12px] font-semibold text-slate-800 leading-tight"
                >
                  <span>{guests}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
                </button>
              </div>

              {guestDropdownOpen && (
                <div className="absolute top-full right-0 w-36 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  {["1 khách", "2 khách", "3 - 5 khách", "6+ khách"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGuests(g);
                        setGuestDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* CASE 3: STAY / PACKAGE MODE                               */
          /* ========================================================= */
          <>
            <div className="border border-slate-200/90 rounded-xl px-3 py-1.5 flex-1 min-w-[190px] flex items-center gap-2.5 hover:border-slate-300 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                  Điểm đến
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-[12.5px] font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none leading-tight"
                  placeholder="Nhập địa điểm..."
                />
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-xl px-3 py-1.5 flex items-center gap-2 sm:gap-3 hover:border-slate-300 transition-colors shrink-0">
              {/* Nhận phòng */}
              <div className="flex items-center gap-2 cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Nhận phòng
                  </span>
                  <span className="text-[12px] font-semibold text-slate-700 leading-tight">
                    {DEFAULT_CHECK_IN}
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 shrink-0" />

              {/* Trả phòng */}
              <div className="flex items-center gap-2 cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                    Trả phòng
                  </span>
                  <span className="text-[12px] font-semibold text-slate-700 leading-tight">
                    {DEFAULT_CHECK_OUT}
                  </span>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 shrink-0" />

              {/* Khách with dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="flex items-center gap-1.5 text-left"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[9.5px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                      Khách
                    </span>
                    <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                      {guests}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                </button>

                {guestDropdownOpen && (
                  <div className="absolute top-full right-0 w-44 mt-2 p-1.5 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                    {["1 Khách", "2 Khách", "3-4 Khách", "Gia đình (>4 khách)"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGuests(g)
                          setGuestDropdownOpen(false)
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0c3b40] hover:bg-teal-50/50 rounded-lg"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Search CTA Button */}
        <div className="shrink-0">
          <button
            type="submit"
            className="w-full lg:w-auto px-6 py-2.5 min-h-[38px] flex items-center justify-center gap-2 rounded-xl bg-[#0c3b40] hover:bg-[#08292d] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </form>
    </div>
  )
}
