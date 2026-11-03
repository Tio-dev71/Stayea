import Link from "next/link"
import { ShieldCheck, Scale, ArrowLeft, CheckCircle2, AlertTriangle, Phone, Mail, MapPin } from "lucide-react"

export const metadata = {
  title: "Điều Khoản Dịch Vụ & Quy Chế Sàn - STAYEA",
  description: "Quy chế hoạt động, điều khoản dịch vụ và chính sách hủy bồi hoàn trên nền tảng du lịch STAYEA.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Trang chủ STAYEA</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-900 tracking-wide">Văn bản Pháp lý Hiệu lực</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Header */}
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" /> Quy Chế Hoạt Động & Điều Khoản Sử Dụng Sàn TMĐT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Điều Khoản Dịch Vụ & Quy Chế Sàn Thương Mại Điện Tử STAYEA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cập nhật lần cuối: Tháng 11/2026 • Ban hành bởi: Ban Quản trị Nền tảng Du lịch STAYEA
          </p>
        </div>

        {/* Legal Entity Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-600">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> ĐƠN VỊ SỞ HỮU & QUẢN LÝ VẬN HÀNH NỀN TẢNG
          </div>
          <p className="leading-relaxed">
            Nền tảng thương mại điện tử du lịch <strong>STAYEA (stayea.com)</strong> được sở hữu và vận hành bởi:
          </p>
          <ul className="space-y-1 pl-4 list-disc text-slate-700">
            <li><strong>Tên pháp nhân:</strong> CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ</li>
            <li><strong>Mã số doanh nghiệp:</strong> 0109887766 do Sở KH&ĐT Thành phố Hà Nội cấp.</li>
            <li><strong>Địa chỉ trụ sở:</strong> Số 8/24, Ngách 47, Ngõ 255, Đường Lĩnh Nam, Phường Vĩnh Hưng, Quận Hoàng Mai, Hà Nội.</li>
            <li><strong>Chi nhánh điều phối Phú Quốc:</strong> Dương Đông, Thành phố Phú Quốc, Tỉnh Kiên Giang.</li>
            <li><strong>Hotline hỗ trợ 24/7:</strong> 0921 724 444 • <strong>Email:</strong> hi.topmedia.vn@gmail.com</li>
          </ul>
        </div>

        {/* Section 1: Phạm vi */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
            Phạm Vi Điều Chỉnh & Vai Trò Của STAYEA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            STAYEA là nền tảng công nghệ trung gian kết nối các dịch vụ du lịch (Sàn giao dịch thương mại điện tử chuyên biệt) tại Đảo Ngọc Phú Quốc và các điểm đến du lịch khác tại Việt Nam. STAYEA cung cấp giải pháp tra cứu, tư vấn thông minh (AI Concierge) và điều phối đặt chỗ giữa:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">Khách Hàng (Người sử dụng dịch vụ):</div>
              <p className="text-slate-600">Cá nhân, gia đình hoặc tổ chức có nhu cầu tìm kiếm, đặt chỗ lưu trú (homestay, villa), thuê phương tiện (xe tự lái, đưa đón sân bay) hoặc tour du lịch trải nghiệm.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="font-bold text-slate-900 mb-1">Đối Tác Cung Ứng (Chủ cơ sở):</div>
              <p className="text-slate-600">Các chủ biệt thự, homestay, đơn vị cho thuê xe, nhà xe limousine hoặc nhà tổ chức tour cano lặn biển độc lập đã được STAYEA thẩm định hồ sơ hợp tác.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Trách nhiệm AI Concierge */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
            Quy Định Về Trợ Lý AI Concierge & Miễn Trừ Trách Nhiệm Sơ Bộ
          </h2>
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> ĐIỀU KHOẢN QUAN TRỌNG VỀ TƯ VẤN TỰ ĐỘNG CỦA AI:
            </div>
            <p>
              1. <strong>Tính chất tham khảo:</strong> Mọi thông tin tư vấn, gợi ý hành trình và mức giá ước tính do Trợ lý ảo STAYEA AI Concierge cung cấp dựa trên dữ liệu niêm yết của hệ thống tại thời điểm tra cứu và mang tính chất định hướng hỗ trợ khách hàng.
            </p>
            <p>
              2. <strong>Bản chất của Đơn đặt giữ chỗ (Booking Draft):</strong> Khi Quý khách đồng ý với Trợ lý AI và để lại thông tin đặt chỗ, đơn hàng được sinh ra là <em>"Phiếu Đăng Ký Yêu Cầu Giữ Chỗ Sơ Bộ"</em> và <strong>KHÔNG CẤU THÀNH HỢP ĐỒNG CÓ TÍNH CHẤT RÀNG BUỘC PHÁP LÝ NGAY LẬP TỨC</strong>.
            </p>
            <p>
              3. <strong>Xác nhận chính thức:</strong> Đơn hàng chỉ chính thức có hiệu lực ràng buộc sau khi Điều phối viên Quản trị STAYEA thẩm định lịch trống với Đối tác cung cấp dịch vụ, thông báo bằng điện thoại/Zalo/SMS và khách hàng hoàn tất đặt cọc/thanh toán theo quy định.
            </p>
          </div>
        </section>

        {/* Section 3: Quy trình đặt phòng & thanh toán */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
            Quy Trình Đặt Dịch Vụ, Đặt Cọc & Thanh Toán
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc pl-5">
            <li><strong>Bước 1:</strong> Khách hàng lựa chọn dịch vụ trên website hoặc qua hỗ trợ từ AI Concierge / Chuyên viên tư vấn.</li>
            <li><strong>Bước 2:</strong> Khách hàng cung cấp thông tin liên hệ chính xác (Họ tên, SĐT, ngày sử dụng dịch vụ, số lượng người).</li>
            <li><strong>Bước 3:</strong> Ban Quản trị STAYEA liên hệ Đối tác trong vòng 15-30 phút để kiểm tra và khóa lịch giữ chỗ.</li>
            <li><strong>Bước 4:</strong> Khách hàng thanh toán đặt cọc (thông thường từ 30% đến 50% tổng giá trị dịch vụ, hoặc 100% đối với dịp Lễ/Tết) qua cổng thanh toán trực tuyến (VNPay, VietQR, Chuyển khoản ngân hàng doanh nghiệp) theo hướng dẫn từ STAYEA.</li>
            <li><strong>Bước 5:</strong> STAYEA gửi Phiếu Xác Nhận Dịch Vụ (Booking Voucher) có mã đơn hàng định danh đến điện thoại/email của khách hàng.</li>
          </ul>
        </section>

        {/* Section 4: Chính sách Hủy & Hoàn tiền */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
            Chính Sách Hủy Dịch Vụ & Hoàn Trả Tiền Cọc (Cancellation Policy)
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>Trừ trường hợp các cơ sở có chính sách riêng được hiển thị cụ thể trên phiếu đặt, quy chế hoàn hủy tiêu chuẩn trên sàn STAYEA áp dụng như sau:</p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Thời điểm khách thông báo hủy</th>
                    <th className="p-3">Mức hoàn trả</th>
                    <th className="p-3">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">Trước 07 ngày so với giờ check-in / nhận xe</td>
                    <td className="p-3 text-emerald-700 font-bold">Hoàn 100% tiền cọc</td>
                    <td className="p-3 text-slate-500">Khách chỉ chịu phí xử lý giao dịch ngân hàng (nếu có, tối đa 20.000đ).</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">Từ 03 đến 07 ngày trước giờ nhận dịch vụ</td>
                    <td className="p-3 text-amber-700 font-bold">Hoàn 50% tiền cọc</td>
                    <td className="p-3 text-slate-500">50% còn lại hỗ trợ chi phí chuẩn bị phòng/xe của Đối tác.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">Dưới 48 giờ hoặc Vắng mặt (No-show)</td>
                    <td className="p-3 text-rose-700 font-bold">Không hoàn trả tiền cọc</td>
                    <td className="p-3 text-slate-500">Tiền cọc được quyết toán cho Đối tác để bù đắp thiệt hại giữ chỗ.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-emerald-50/40">
                    <td className="p-3 font-semibold text-slate-900">Sự kiện Bất khả kháng (Thiên tai / Cấm biển Phú Quốc)</td>
                    <td className="p-3 text-emerald-700 font-bold">Hoàn 100% hoặc dời lịch miễn phí</td>
                    <td className="p-3 text-slate-500">Áp dụng khi có công văn cấm tàu/cano của Cảng vụ Phú Quốc hoặc bão lũ.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: Bảo vệ dữ liệu cá nhân Nghị định 13 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">5</span>
            Bảo Vệ Dữ Liệu Cá Nhân (Tuân Thủ Nghị Định 13/2023/NĐ-CP)
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              1. <strong>Mục đích thu thập:</strong> STAYEA chỉ thu thập thông tin cơ bản (Họ tên, Số điện thoại, Email, Số khách) nhằm mục đích xử lý đơn giữ chỗ, thông báo trạng thái đơn hàng và gửi thông tin xác nhận cho khách hàng.
            </p>
            <p>
              2. <strong>Chia sẻ thông tin có kiểm soát:</strong> Bằng việc cung cấp thông tin trong quá trình đặt dịch vụ hoặc chat với AI Concierge, Quý khách đồng ý để STAYEA chia sẻ các thông tin liên hệ cần thiết cho đúng Đối tác cung ứng dịch vụ được Quý khách lựa chọn (chủ villa, tài xế lái xe, điều hành tour cano) để phục vụ công tác đón tiếp.
            </p>
            <p>
              3. <strong>Cam kết bảo mật:</strong> STAYEA tuyệt đối không buôn bán, trao đổi hoặc cung cấp dữ liệu cá nhân của Quý khách cho bất kỳ bên thứ ba nào khác ngoài mục đích thực hiện chuyến đi.
            </p>
          </div>
        </section>

        {/* Section 6: Giải quyết tranh chấp */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">6</span>
            Cơ Chế Giải Quyết Khiếu Nại & Luật Áp Dụng
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mọi tranh chấp phát sinh giữa Khách hàng và Đối tác trước hết được giải quyết trên tinh thần thương lượng và hòa giải thông qua sự điều phối của STAYEA. Trong trường hợp không đạt được thỏa thuận, vụ việc sẽ được đưa ra giải quyết tại Tòa án nhân dân có thẩm quyền tại Việt Nam theo quy định của Pháp luật Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam.
          </p>
        </section>

        {/* Footer Contact Card */}
        <div className="p-6 rounded-2xl bg-emerald-900 text-white space-y-4">
          <div className="font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>BAN QUẢN TRỊ NỀN TẢNG DU LỊCH STAYEA</span>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Nếu Quý khách hoặc Quý đối tác có bất kỳ thắc mắc nào liên quan đến Quy chế sàn và Điều khoản sử dụng, xin vui lòng liên hệ ngay với chúng tôi:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hotline: 0921 724 444</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>hi.topmedia.vn@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dương Đông, Phú Quốc</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

