import Link from "next/link"
import { ShieldCheck, Handshake, FileCheck, ArrowLeft, AlertCircle, Building2, CreditCard, Landmark } from "lucide-react"

export const metadata = {
  title: "Hợp Đồng Đối Tác & Quy Chế Quyết Toán - STAYEA",
  description: "Hợp đồng nguyên tắc hợp tác cung cấp dịch vụ và quy chế quyết toán hoa hồng trên nền tảng STAYEA Partner Hub.",
}

export default function PartnerAgreementPage() {
  return (
    <div className="min-h-screen bg-[#071317] text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#091b21]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/hub"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Cổng Đối Tác (Partner Hub)</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">Hợp Đồng Điện Tử Hiệu Lực</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Header */}
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold">
            <Handshake className="w-3.5 h-3.5" /> HỢP ĐỒNG NGUYÊN TẮC HỢP TÁC KINH DOANH ĐIỆN TỬ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hợp Đồng Hợp Tác & Quy Chế Quyết Toán Dịch Vụ STAYEA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Mã hợp đồng: STA-PARTNER-AGREEMENT-2026 • Áp dụng cho toàn bộ Đối tác Lưu trú, Thuê xe & Trải nghiệm
          </p>
        </div>

        {/* Contract Parties Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" /> BÊN A: ĐƠN VỊ VẬN HÀNH SÀN (STAYEA)
            </div>
            <ul className="space-y-1 text-slate-300">
              <li><strong>Doanh nghiệp:</strong> CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ</li>
              <li><strong>Mã số thuế:</strong> 0109887766</li>
              <li><strong>Đại diện:</strong> Ban Giám Đốc Nền tảng STAYEA</li>
              <li><strong>Địa chỉ:</strong> Hoàng Mai, Hà Nội & Dương Đông, Phú Quốc</li>
              <li><strong>Vai trò:</strong> Nền tảng công nghệ, phân phối tiếp thị, điều phối đơn hàng và bảo đảm thanh toán.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> BÊN B: ĐỐI TÁC CUNG ỨNG DỊCH VỤ (PARTNER)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Các tổ chức, hộ kinh doanh hoặc cá nhân đăng ký tài khoản và cơ sở dịch vụ trên STAYEA Partner Hub (bao gồm dịch vụ homestay/villa, cho thuê phương tiện tự lái, đưa đón sân bay hoặc tour trải nghiệm).
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              * Bằng việc tích chọn đồng ý trên hệ thống Partner Hub, Bên B xác nhận chấp thuận toàn văn hợp đồng này.
            </p>
          </div>
        </div>

        {/* Section 1: Chiết khấu */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
            Mức Chiết Khấu Hoa Hồng Sàn & Cam Kết Minh Bạch
          </h2>
          <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-900/50 space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-white text-sm">
                Mức Chiết Khấu Chuẩn: 10.00% trên Giá Trị Đơn Hàng Thành Công
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 font-semibold border border-emerald-700">
                Không phí thường niên
              </span>
            </div>
            <p>
              1. <strong>Công thức tính tiền thực nhận:</strong> Khi một đơn hàng hoàn thành (Khách trả phòng / trả xe / hoàn tất tour), số tiền thực nhận của Bên B được tính tự động như sau:
            </p>
            <div className="p-3 bg-black/50 rounded-xl font-mono text-emerald-400 text-xs border border-slate-800">
              Tiền Thực Nhận (Payout) = Tổng Tiền Khách Thanh Toán - (Tổng Tiền × 10.00%)
            </div>
            <p>
              2. <strong>Cam kết không phí ẩn:</strong> STAYEA cam kết không thu bất kỳ khoản phí đăng ký, phí duy trì tài khoản tháng hay phí niêm yết danh mục nào khác ngoài 10% hoa hồng trên đơn thực tế phục vụ thành công.
            </p>
          </div>
        </section>

        {/* Section 2: Tiếp nhận và xử lý đơn */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
            Quy Trình Tiếp Nhận, Xác Nhận Đơn & Thời Gian Phản Hồi (SLA)
          </h2>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-5">
            <li><strong>Điều phối đơn hàng:</strong> Khi khách hàng đặt chỗ hoặc yêu cầu dịch vụ qua AI Concierge / Nhân viên tư vấn, đơn hàng sẽ lập tức hiển thị tại mục <em>"Tiếp nhận Đơn hàng"</em> trên Partner Hub của Bên B.</li>
            <li><strong>Thời gian phản hồi cam kết (SLA):</strong> Bên B có trách nhiệm kiểm tra lịch trống và bấm nút <em>"Tiếp nhận đơn"</em> hoặc <em>"Từ chối (kèm lý do)"</em> trong vòng tối đa <strong>60 phút</strong> kể từ khi phát sinh thông báo.</li>
            <li><strong>Giữ dịch vụ:</strong> Sau khi bấm nhận đơn, Bên B cam kết giữ đúng loại phòng / đúng loại xe / đúng lịch trình tour cho khách hàng STAYEA theo mức giá đã niêm yết.</li>
          </ul>
        </section>

        {/* Section 3: Chu kỳ quyết toán */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
            Quy Chế Quyết Toán & Rút Tiền Thu Nhập (Payout Policy)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Thời Điểm Quyết Toán
              </div>
              <p className="text-slate-300 leading-relaxed">
                Doanh thu đơn hàng sẽ chuyển sang trạng thái <em>"Số dư khả dụng"</em> ngay sau khi khách hoàn tất dịch vụ (sau giờ trả phòng/trả xe).
              </p>
            </div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" /> Phương Thức Chuyển Khoản
              </div>
              <p className="text-slate-300 leading-relaxed">
                Bên B bấm <em>"Yêu cầu rút tiền"</em> trên Partner Hub. STAYEA thực hiện chuyển khoản vào số tài khoản ngân hàng chính chủ của Bên B trong vòng 24 giờ làm việc.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Trách nhiệm và xử lý vi phạm */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
            Trách Nhiệm Chất Lượng & Xử Lý Vi Phạm (Overbooking / No-Show)
          </h2>
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 space-y-2 leading-relaxed">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> CHẾ TÀI XỬ LÝ VI PHẠM ĐỂ BẢO VỆ UY TÍN DỊCH VỤ:
            </div>
            <p>
              1. <strong>Cấm hủy đơn đơn phương phút chót:</strong> Bên B tuyệt đối không được tự ý hủy đơn hoặc từ chối phục vụ khách sau khi đã bấm chấp nhận đơn, trừ trường hợp thiên tai bất khả kháng.
            </p>
            <p>
              2. <strong>Bồi thường trường hợp Overbooking:</strong> Nếu Bên B để xảy ra tình trạng trùng phòng/hết xe khiến khách không có nơi ở/phương tiện, Bên B có nghĩa vụ phối hợp với STAYEA bố trí cơ sở tương đương hoặc cao cấp hơn cho khách, đồng thời chịu toàn bộ chi phí chênh lệch phát sinh.
            </p>
            <p>
              3. <strong>An toàn & Giấy phép:</strong> Đối với đơn vị xe tự lái và cano, Bên B cam kết phương tiện đầy đủ đăng kiểm, bảo hiểm trách nhiệm dân sự hành khách và người điều khiển phương tiện có bằng cấp hợp lệ.
            </p>
          </div>
        </section>

        {/* Section 5: Nghĩa vụ thuế */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center font-bold">5</span>
            Phân Định Nghĩa Vụ Thuế & Hóa Đơn Giá Trị Gia Tăng
          </h2>
          <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc pl-5">
            <li><strong>Bên A (STAYEA):</strong> Có nghĩa vụ xuất hóa đơn GTGT điện tử cho Bên B đối với khoản phí dịch vụ sàn (10% hoa hồng) theo quy định của pháp luật thuế Việt Nam.</li>
            <li><strong>Bên B (Đối tác):</strong> Có trách nhiệm tự kê khai và nộp các loại thuế phát sinh từ hoạt động kinh doanh lưu trú, vận tải của mình (thuế GTGT, thuế TNCN theo hình thức hộ kinh doanh hoặc doanh nghiệp) trên 90% doanh thu thực nhận.</li>
          </ul>
        </section>

        {/* Section 6: Hiệu lực */}
        <section className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-800 space-y-3 text-xs text-emerald-100">
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> HIỆU LỰC HỢP ĐỒNG & CHỮ KÝ ĐIỆN TỬ
          </div>
          <p className="leading-relaxed">
            Hợp đồng này được lập dưới dạng dữ liệu điện tử theo quy định của <strong>Luật Giao dịch điện tử năm 2023</strong> và có giá trị pháp lý tương đương văn bản giấy.
          </p>
          <p className="leading-relaxed">
            Hợp đồng chính thức phát sinh hiệu lực kể từ thời điểm Bên B hoàn tất đăng ký tài khoản và tích chọn đồng ý trên hệ thống STAYEA Partner Hub.
          </p>
        </section>
      </main>
    </div>
  )
}

