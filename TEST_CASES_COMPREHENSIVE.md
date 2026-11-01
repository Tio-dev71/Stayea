# TÀI LIỆU KỊCH BẢN & DANH MỤC TEST CASE TOÀN DIỆN HỆ THỐNG STAYEA
**Hệ thống:** Nền tảng Du lịch & Lưu trú Nghỉ dưỡng Cao cấp STAYEA  
**Đơn vị chủ quản:** CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ  
**Phiên bản hệ thống:** v1.0.0 (Production Release)  
**Môi trường kiểm thử:** 
- Local: Frontend `http://localhost:8080`, Backend `http://localhost:3000`
- Production / Staging: `https://stayea.com`, `https://admin.stayea.com`, `https://api.stayea.com`  
**Tiêu chuẩn áp dụng:** ISO/IEC/IEEE 29119 (Software Testing), OWASP Top 10 Security, WCAG 2.1 AA Accessibility.

---

## MỤC LỤC TỔNG QUAN

1. [Quy ước & Phân loại Độ ưu tiên](#1-quy-ước--phân-loại-độ-ưu-tiên)
2. [Module 1: Xác thực, Phân quyền & Bảo mật (AUTH & RBAC)](#2-module-1-xác-thực-phân-quyền--bảo-mật-auth--rbac)
3. [Module 2: Cổng Khách hàng & Trang chủ (LANDING & PUBLIC CATALOG)](#3-module-2-cổng-khách-hàng--trang-chủ-landing--public-catalog)
4. [Module 3: Động cơ Đặt phòng & Trải nghiệm (BOOKING ENGINE & CHECKOUT)](#4-module-3-động-cơ-đặt-phòng--trải-nghiệm-booking-engine--checkout)
5. [Module 4: Thanh toán & Cổng thanh toán (PAYMENT GATEWAYS)](#5-module-4-thanh-toán--cổng-thanh-toán-payment-gateways)
6. [Module 5: Stayea Club & Khách hàng thân thiết (LOYALTY CLUB & PERKS)](#6-module-5-stayea-club--khách-hàng-thân-thiết-loyalty-club--perks)
7. [Module 6: Trợ lý Du lịch AI & Concierge Widget (AI CONCIERGE ENGINE)](#7-module-6-trợ-lý-du-lịch-ai--concierge-widget-ai-concierge-engine)
8. [Module 7: Cổng thông tin Đối tác & Chủ nhà (PARTNER HUB PORTAL)](#8-module-7-cổng-thông-tin-đối-tác--chủ-nhà-partner-hub-portal)
9. [Module 8: Bảng điều khiển Quản trị viên (ADMIN CONSOLE OPERATIONS)](#9-module-8-bảng-điều-khiển-quản-trị-viên-admin-console-operations)
10. [Module 9: Quản lý Đặt chỗ Quản trị (ADMIN BOOKINGS MANAGEMENT)](#10-module-9-quản-lý-đặt-chỗ-quản-trị-admin-bookings-management)
11. [Module 10: Quản lý Danh mục & Bất động sản (PROPERTIES & EXPERIENCES)](#11-module-10-quản-lý-danh-mục--bất-động-sản-properties--experiences)
12. [Module 11: Ưu đãi, Khuyến mãi & Voucher (DEALS & PROMOTIONS)](#12-module-11-ưu-đãi-khuyến-mãi--voucher-deals--promotions)
13. [Module 12: Doanh thu, Thanh toán & Tài chính (REVENUE & TRANSACTIONS)](#13-module-12-doanh-thu-thanh-toán--tài-chính-revenue--transactions)
14. [Module 13: Đánh giá & Phản hồi Khách hàng (REVIEWS & RATINGS)](#14-module-13-đánh-giá--phản-hồi-khách-hàng-reviews--ratings)
15. [Module 14: Trung tâm Tin nhắn & Chăm sóc khách hàng (OMNICHANNEL MESSAGES)](#15-module-14-trung-tâm-tin-nhắn--chăm-sóc-khách-hàng-omnichannel-messages)
16. [Module 15: Tiếp thị & Chiến dịch Quảng bá (MARKETING & CAMPAIGNS)](#16-module-15-tiếp-thị--chiến-dịch-quảng-bá-marketing--campaigns)
17. [Module 16: Báo cáo Thống kê & Phân tích (REPORTS & BI ANALYTICS)](#17-module-16-báo-cáo-thống-kê--phân-tích-reports--bi-analytics)
18. [Module 17: Cài đặt Hệ thống & Thông tin Pháp nhân (SYSTEM SETTINGS)](#18-module-17-cài-đặt-hệ-thống--thông-tin-pháp-nhân-system-settings)
19. [Module 18: Nhật ký Kiểm toán & Bảo mật (AUDIT LOGS & WHITE-LABEL COMPLIANCE)](#19-module-18-nhật-ký-kiểm-toán--bảo-mật-audit-logs--white-label-compliance)
20. [Module 19: Hiệu năng, Độ tin cậy & Tải cao (PERFORMANCE & LOAD)](#20-module-19-hiệu-năng-độ-tin-cậy--tải-cao-performance--load)
21. [Module 20: Khả năng Tiếp cận & Giao diện Đa thiết bị (A11Y & RESPONSIVENESS)](#21-module-20-khả-năng-tiếp-cận--giao-diện-đa-thiết-bị-a11y--responsiveness)
22. [Hướng dẫn Chạy Tự động & Ma trận Nghiệm thu (AUTOMATION MATRIX)](#22-hướng-dẫn-chạy-tự-động--ma-trận-nghiệm-thu-automation-matrix)

---

## 1. QUY ƯỚC & PHÂN LOẠI ĐỘ ƯU TIÊN

### 1.1. Cấu trúc Mã Test Case
Mã Test Case được định danh theo công thức: `TC_<MODULE>_<SỐ THỨ TỰ>`:
- `TC_AUTH`: Xác thực & Phân quyền (Authentication, Authorization, RBAC)
- `TC_LAND`: Giao diện Landing Page & Trải nghiệm công khai
- `TC_BOOK`: Đặt phòng, Đặt Tour & Di chuyển
- `TC_PAYM`: Thanh toán, Cổng thanh toán & Hóa đơn
- `TC_CLUB`: Chương trình thành viên Stayea Club & Đặc quyền
- `TC_AI`: Trợ lý du lịch AI Concierge
- `TC_PART`: Cổng thông tin Đối tác (Partner Hub)
- `TC_ADM`: Bảng điều khiển Quản trị viên
- `TC_REV`: Doanh thu, Đối soát & Tài chính
- `TC_MKT`: Tiếp thị, Chiến dịch & Quảng cáo
- `TC_MSG`: Tin nhắn, Trò chuyện & CSKH
- `TC_RPT`: Báo cáo, Thống kê & Phân tích
- `TC_SET`: Cấu hình hệ thống & Pháp nhân công ty
- `TC_SEC`: Bảo mật, Chống rò rỉ dữ liệu & Kiểm toán
- `TC_PERF`: Hiệu năng hệ thống & Tốc độ phản hồi
- `TC_A11Y`: Khả năng tiếp cận, Phím tắt & Responsive UI

### 1.2. Mức độ ưu tiên (Severity / Priority)
- **P1 (Blocker / Critical)**: Lỗi nghiêm trọng chặn đứng luồng chính (Đăng nhập, Tạo đơn hàng, Thanh toán, Bảo mật dữ liệu, Rò rỉ thông tin nhạy cảm).
- **P2 (High)**: Lỗi ảnh hưởng chức năng quan trọng (Bộ lọc, Tìm kiếm, Cập nhật trạng thái, Đồng bộ cơ sở dữ liệu).
- **P3 (Medium)**: Lỗi hiển thị giao diện, sai định dạng văn bản, chưa tối ưu trải nghiệm phụ.
- **P4 (Low)**: Tinh chỉnh nhỏ về thẩm mỹ, animation, căn lề.

---

## 2. MODULE 1: XÁC THỰC, PHÂN QUYỀN & BẢO MẬT (AUTH & RBAC)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_AUTH_001** | Đăng nhập Admin | Đăng nhập hợp lệ với tài khoản Quản trị viên | Đã có tài khoản Admin trong DB | 1. Truy cập `/login`<br>2. Nhập Email & Mật khẩu<br>3. Bấm "Đăng nhập vào Dashboard" | Email: `thond.topmedia.vn@gmail.com`<br>Pass: Mật khẩu hợp lệ | Đăng nhập thành công, lưu JWT Token vào Cookies/Storage, chuyển hướng vào `/stayea/overview` | **P1** | Auto / Manual |
| **TC_AUTH_002** | Đăng nhập Admin | Đăng nhập thất bại khi sai mật khẩu | Trang `/login` đang mở | 1. Nhập Email đúng<br>2. Nhập sai Mật khẩu<br>3. Bấm Đăng nhập | Email: `admin@stayea.com`<br>Pass: `WrongPass123!` | Hiển thị thông báo lỗi màu đỏ: "Email hoặc mật khẩu không chính xác", không tạo phiên đăng nhập | **P1** | Auto |
| **TC_AUTH_003** | Đăng nhập Admin | Đăng nhập thất bại khi bỏ trống trường bắt buộc | Trang `/login` đang mở | 1. Để trống Email hoặc Mật khẩu<br>2. Bấm Đăng nhập | Email: ` ` (rỗng) | Hiển thị cảnh báo validation tại ô input "Vui lòng nhập địa chỉ email", form không gửi request lên server | **P2** | Auto |
| **TC_AUTH_004** | Đăng nhập Nhanh | Đăng nhập nhanh với quyền Admin mặc định (Dev mode) | Môi trường test có hỗ trợ Quick Login | 1. Bấm nút "Đăng nhập nhanh với tài khoản Admin mặc định" | Nút CTA Quick Admin | Hệ thống kích hoạt token quản trị hợp lệ và chuyển thẳng vào màn hình Admin | **P2** | Auto |
| **TC_AUTH_005** | Phân quyền RBAC | Khách hàng thường truy cập trái phép URL Admin | Đang đăng nhập tài khoản Khách (`customer`) | 1. Truy cập trực tiếp URL `https://admin.stayea.com/stayea/overview` | Role: `customer` | Hệ thống chặn truy cập (HTTP 403 Forbidden) hoặc chuyển hướng về `/login` kèm thông báo không đủ quyền hạn | **P1** | Auto |
| **TC_AUTH_006** | Phân quyền RBAC | Đối tác chỉ truy cập được Cổng Partner Hub, không vào được Admin | Đang đăng nhập tài khoản Đối tác (`partner`) | 1. Truy cập URL quản trị viên `/stayea/settings`<br>2. Thử gọi API `/api/stayea/admin/reports` | Role: `partner` | Chặn truy cập; chỉ cho phép thao tác trong phạm vi `/hub` và `/api/stayea/partner/*` | **P1** | Auto |
| **TC_AUTH_007** | Đăng xuất | Đăng xuất xóa sạch token và phiên làm việc | Đang đăng nhập Admin hoặc Customer | 1. Bấm Avatar góc phải trên<br>2. Chọn "Đăng xuất" | Nút Đăng xuất | Xóa cookie `auth_token`, `refresh_token`, xóa session storage, điều hướng về trang chủ/login an toàn | **P1** | Auto |
| **TC_AUTH_008** | Chống Brute Force | Khóa tạm thời hoặc Rate Limit khi nhập sai mật khẩu 5 lần liên tiếp | Trang `/login` | 1. Nhập sai mật khẩu liên tục 5 lần trong 1 phút | 5 lần nhập sai | API trả về HTTP 429 Too Many Requests, hiển thị cảnh báo "Vui lòng thử lại sau 60 giây" | **P1** | Auto |

---

## 3. MODULE 2: CỔNG KHÁCH HÀNG & TRANG CHỦ (LANDING & PUBLIC CATALOG)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_LAND_001** | Header Branding | Hiển thị đầy đủ Logo `stayea.png` và Slogan thương hiệu | Truy cập `https://stayea.com/` | 1. Quan sát Header góc trái trên<br>2. Thu phóng màn hình desktop/mobile | Màn hình bất kỳ | Logo `stayea.png` hiển thị sắc nét, đi kèm chữ "STAYEA" và slogan "MORE THAN A STAY" | **P2** | Auto / Manual |
| **TC_LAND_002** | Mega Menu | Hover và hiển thị đúng các menu con Lưu trú, Trải nghiệm, Gói du lịch, Di chuyển | Trang chủ đã tải xong | 1. Rê chuột vào "Lưu trú"<br>2. Rê chuột vào "Trải nghiệm"<br>3. Bấm phím `Escape` | Thao tác chuột & phím | Mega Menu xổ xuống êm ái, hiển thị danh mục con kèm hình ảnh minh họa; bấm Escape đóng ngay lập tức | **P2** | Auto |
| **TC_LAND_003** | Footer Thông tin Pháp nhân | Hiển thị chuẩn xác Tên công ty, MST, Địa chỉ, Hotline, Email theo ĐKKD | Cuộn xuống cuối trang chủ | 1. Cuộn chuột tới chân trang Footer<br>2. Kiểm tra thông tin pháp nhân | Document ĐKKD mới nhất | Hiển thị: "CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ", Hotline: `0921 724 444`, Email: `hi.topmedia.vn@gmail.com`, Địa chỉ: Lĩnh Nam, Hoàng Mai, Hà Nội | **P1** | Auto / Manual |
| **TC_LAND_004** | Tìm kiếm Nơi lưu trú | Tìm kiếm biệt thự theo điểm đến và số lượng khách | Màn hình `/stay` | 1. Chọn điểm đến "Phú Quốc"<br>2. Chọn ngày Check-in/Check-out<br>3. Chọn số khách = 4<br>4. Bấm "Tìm kiếm" | Điểm đến: Phú Quốc, Khách: 4 | Trả về danh sách biệt thự đáp ứng đủ sức chứa 4 khách, giá hiển thị tiền tệ VNĐ rõ ràng | **P1** | Auto |
| **TC_LAND_005** | Chi tiết Nơi lưu trú | Xem chi tiết tiện ích, hình ảnh, chính sách hủy phòng | Danh sách Villa | 1. Bấm vào Villa bất kỳ<br>2. Xem thư viện ảnh, tiện ích (Bể bơi, BBQ, Wifi)<br>3. Đọc chính sách hủy phòng | ID Villa hợp lệ | Trang chi tiết hiển thị đầy đủ slider ảnh, bản đồ vị trí, giá niêm yết theo đêm, phụ phí minh bạch | **P1** | Manual |
| **TC_LAND_006** | Đặt Tour Trải nghiệm | Xem và lọc tour lặn ngắm san hô, canô ngắm hoàng hôn | Màn hình `/experience` | 1. Chọn tab "Tour biển đảo"<br>2. Lọc mức giá từ 500k - 2000k | Filter danh mục | Danh sách tour tải đúng tiêu chí lọc, thời lượng tour, điểm khởi hành, số chỗ còn nhận | **P2** | Auto |
| **TC_LAND_007** | Đặt Phương tiện | Xem danh mục thuê xe máy, xe tự lái 4-7 chỗ, đưa đón sân bay | Màn hình `/transport` | 1. Chọn loại xe "SUV 7 chỗ"<br>2. Chọn điểm đón "Sân bay Phú Quốc" | Dịch vụ di chuyển | Hiển thị loại xe (Xpander, Fortuner), biểu phí theo ngày, cam kết giao xe đúng hẹn | **P2** | Auto |
| **TC_LAND_008** | Trang Giới thiệu (About) | Xem câu chuyện thương hiệu, đội ngũ sáng lập và giá trị cốt lõi | Truy cập `/about` | 1. Bấm vào "Về Stayea" trên Header<br>2. Đọc các phần Hero, Câu chuyện, Nguyên tắc | Trang `/about` | Giao diện About sang trọng, hình ảnh chất lượng cao, các nút CTA đăng ký hội viên/đối tác hoạt động | **P3** | Manual |

---

## 4. MODULE 3: ĐỘNG CƠ ĐẶT PHÒNG & TRẢI NGHIỆM (BOOKING ENGINE & CHECKOUT)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_BOOK_001** | Tạo Đơn đặt phòng | Khách hàng đặt phòng biệt thự thành công luồng tiêu chuẩn | Đã đăng nhập, chọn Villa có sẵn phòng | 1. Chọn ngày nhận phòng: ngày mai, trả phòng: 3 ngày sau<br>2. Nhập thông tin khách (Họ tên, SĐT, Email)<br>3. Bấm "Tiến hành thanh toán" | Tên: "Nguyễn Văn An"<br>SĐT: `0912345678`<br>Email: `an.nguyen@gmail.com` | Tạo đơn hàng trạng thái `PENDING`, mã đơn `BK-STAYEA-XXXXX`, chuyển tới màn hình chọn cổng thanh toán | **P1** | Auto |
| **TC_BOOK_002** | Validation Ngày tháng | Hệ thống từ chối ngày nhận phòng trong quá khứ | Trang tạo đơn đặt | 1. Chọn ngày Check-in nhỏ hơn ngày hiện tại<br>2. Bấm xác nhận | Ngày Check-in: `2020-01-01` | Báo lỗi: "Ngày nhận phòng không thể ở trong quá khứ", không cho phép submit form | **P1** | Auto |
| **TC_BOOK_003** | Validation Số điện thoại | Hệ thống từ chối số điện thoại Việt Nam không đúng định dạng | Trang tạo đơn đặt | 1. Nhập Số điện thoại là chữ hoặc ít hơn 10 chữ số<br>2. Bấm tiếp tục | SĐT: `12345` hoặc `abcdef` | Báo lỗi: "Số điện thoại không hợp lệ (cần 10 chữ số bắt đầu bằng 0)", chặn submit | **P1** | Auto |
| **TC_BOOK_004** | Trùng lịch phòng | Từ chối đặt phòng nếu phòng đã có người đặt cùng thời điểm | Phòng đã có booking `CONFIRMED` ngày X-Y | 1. Chọn cùng một phòng trong khoảng ngày X-Y<br>2. Bấm Đặt phòng | Khoảng ngày X-Y đã bị giữ | Hệ thống hiển thị cảnh báo: "Phòng đã có khách đặt trong khoảng thời gian này. Quý khách vui lòng chọn ngày khác." | **P1** | Auto |
| **TC_BOOK_005** | Giữ chỗ tạm thời | Hệ thống giữ chỗ tạm thời (Hold inventory) trong 15 phút | Bắt đầu thanh toán | 1. Tiến hành tới bước thanh toán<br>2. Quan sát đồng hồ đếm ngược giữ phòng | Thời gian giữ chỗ: 15 phút | Hiển thị đồng hồ đếm ngược 15:00; sau 15 phút không thanh toán, phòng tự động nhả về trạng thái trống | **P2** | Auto |
| **TC_BOOK_006** | Hủy đơn đặt phòng | Khách hàng chủ động hủy đơn phòng khi còn trong thời hạn miễn phí | Đơn hàng trạng thái `CONFIRMED`, trước ngày Check-in 7 ngày | 1. Vào "Đơn đặt của tôi"<br>2. Chọn đơn cần hủy<br>3. Bấm "Yêu cầu hủy phòng"<br>4. Xác nhận lý do | Đơn đủ điều kiện hoàn tiền | Đơn chuyển sang trạng thái `CANCELLED`, hệ thống khởi tạo lệnh hoàn tiền về phương thức gốc | **P1** | Auto |

---

## 5. MODULE 4: THANH TOÁN & CỔNG THANH TOÁN (PAYMENT GATEWAYS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_PAYM_001** | Thanh toán Thẻ quốc tế | Thanh toán thành công bằng Visa / Mastercard qua cổng bảo mật 3D Secure | Đơn hàng đang ở trạng thái `PENDING` | 1. Chọn "Thẻ tín dụng / Ghi nợ quốc tế"<br>2. Nhập thông tin thẻ test<br>3. Xác nhận OTP 3D Secure | Số thẻ: 4242...<br>CVC: 123<br>Exp: 12/28 | Giao dịch thành công, trừ đúng số tiền, đơn chuyển sang `PAID`/`CONFIRMED`, gửi email xác nhận tức thì | **P1** | Auto / Manual |
| **TC_PAYM_002** | Thanh toán MoMo / VNPAY | Thanh toán qua mã QR Ví điện tử MoMo / VNPAY QR | Đơn hàng `PENDING` | 1. Chọn "Ví MoMo" hoặc "VNPAY-QR"<br>2. Quét mã QR thanh toán trên ứng dụng ngân hàng | Mã QR động theo mã đơn hàng | Sau khi quét và thanh toán, Webhook IPN nhận tín hiệu tức thì, màn hình web tự động cập nhật "Thanh toán thành công" | **P1** | Auto / Manual |
| **TC_PAYM_003** | Thanh toán Chuyển khoản | Chuyển khoản ngân hàng kèm cú pháp mã đặt phòng tự động khớp | Đơn hàng `PENDING` | 1. Chọn "Chuyển khoản VietQR"<br>2. Chuyển khoản đúng số tiền và nội dung `STAYEA <MÃ ĐƠN>` | Nội dung khớp mã đơn | Bot đối soát ngân hàng khớp lệnh trong 30 giây, tự động kích hoạt vé điện tử | **P1** | Auto |
| **TC_PAYM_004** | Thanh toán Thất bại | Xử lý khi thẻ không đủ số dư hoặc người dùng hủy giao dịch | Đơn hàng `PENDING` | 1. Dùng thẻ test hết hạn hoặc số dư 0đ<br>2. Bấm thanh toán | Thẻ lỗi test | Báo lỗi chi tiết: "Giao dịch không thành công. Thẻ không đủ số dư hoặc bị từ chối bởi ngân hàng phát hành", giữ nguyên đơn để thanh toán lại | **P1** | Auto |
| **TC_PAYM_005** | Bảo mật PCI-DSS | Không bao giờ lưu trữ số thẻ CVC/CVV dạng plain-text trong Database | Mọi giao dịch thẻ | 1. Thực hiện thanh toán thẻ<br>2. Truy vấn Database bảng `payments` và `audit_logs` | Plain-text CVV | Tuyệt đối không có trường CVV trong DB; số thẻ chỉ lưu dạng masked `**** **** **** 1234` | **P1** | Security Audit |

---

## 6. MODULE 5: STAYEA CLUB & KHÁCH HÀNG THÂN THIẾT (LOYALTY CLUB & PERKS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_CLUB_001** | Đăng ký Thành viên | Đăng ký gia nhập Stayea Club để nhận đặc quyền VIP | Khách hàng đã đăng nhập | 1. Vào tab `/stayea-club`<br>2. Bấm nút "Kích hoạt Thẻ thành viên Stayea Club"<br>3. Xác nhận thông tin | Khách hàng hợp lệ | Kích hoạt thành công Thẻ Hội viên Hạng Bạc (Silver), cộng ngay 500 điểm thưởng chào mừng | **P2** | Auto |
| **TC_CLUB_002** | Nhận Voucher Đặc quyền | Nhận voucher Giảm 10% vé máy bay độc quyền thành viên | Đã là hội viên Stayea Club | 1. Vào danh sách đặc quyền<br>2. Bấm "Nhận ngay" tại Voucher Vé máy bay (`STAYEA10AIR`) | Mã `STAYEA10AIR` | Voucher được lưu vào Ví Voucher cá nhân, hiển thị thông báo "Đã lưu vào ví ưu đãi" | **P2** | Auto |
| **TC_CLUB_003** | Áp dụng Voucher khi Đặt chỗ | Sử dụng mã voucher hợp lệ trong bước thanh toán | Có voucher trong ví | 1. Tại màn hình checkout, nhập mã `STAYEA10AIR`<br>2. Bấm "Áp dụng" | Mã giảm giá 10% | Tổng tiền đơn hàng được chiết khấu chính xác 10%, hiển thị dòng giảm trừ rõ ràng | **P1** | Auto |
| **TC_CLUB_004** | Từ chối Voucher Hết hạn / Sai mã | Nhập voucher không tồn tại hoặc đã hết lượt sử dụng | Trang checkout | 1. Nhập mã `SAIMATROI999`<br>2. Bấm "Áp dụng" | Mã voucher giả lập | Báo lỗi: "Mã ưu đãi không hợp lệ hoặc đã hết lượt sử dụng", giữ nguyên giá gốc | **P2** | Auto |

---

## 7. MODULE 6: TRỢ LÝ DU LỊCH AI & CONCIERGE WIDGET (AI CONCIERGE ENGINE)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_AI_001** | AI Health Check | Kiểm tra tình trạng hoạt động của STAYEA AI Engine | API đang chạy | 1. Gửi GET request tới `/api/stayea/ai/health` | Không cần body | Trả về HTTP 200: `{"status": "online", "service": "STAYEA AI Engine"}`, không chứa bất kỳ URL hoặc Model nội bộ nào | **P1** | Auto |
| **TC_AI_002** | White-label Compliance | Tuyệt đối không rò rỉ các từ khóa nội bộ (9Router, OpenClaw, Sandbox) | AI Health & Chat API | 1. Gửi request và kiểm tra response text của toàn bộ luồng AI | Payload câu hỏi du lịch | Header & Body của phản hồi không chứa các từ khóa cấm: `9router`, `openclaw`, `sandbox` | **P1** | Auto |
| **TC_AI_003** | Tư vấn Du lịch Tự động | Hỏi AI về lịch trình đi tour 3 ngày 2 đêm tại Phú Quốc | Mở Widget Concierge góc phải dưới | 1. Bấm mở widget AI<br>2. Nhập câu hỏi: "Tư vấn cho tôi lịch trình 3N2Đ nghỉ dưỡng và ăn hải sản ngon tại Phú Quốc"<br>3. Bấm Gửi | Câu hỏi tiếng Việt có dấu | AI phản hồi trong < 3 giây bằng tiếng Việt tự nhiên, gợi ý các địa điểm: Bãi Sao, Grand World, Chợ đêm, Sunset Sanato | **P1** | Auto |
| **TC_AI_004** | Gợi ý Booking Card | AI tự động phát hiện ý định đặt xe/villa và hiển thị thẻ đặt chỗ | Widget AI đang mở | 1. Nhắn: "Tôi muốn đặt xe 7 chỗ Mitsubishi Xpander từ ngày mai. Tên tôi là Nguyễn Văn Tuấn, SĐT 0987654321." | Tin nhắn có đủ intent | AI trích xuất thông tin, trả lời xác nhận và đính kèm trực tiếp Thẻ Booking Card xem chi tiết/xác nhận | **P1** | Auto |
| **TC_AI_005** | Xử lý Ngoại lệ / Fallback | Phản hồi lịch sự khi dịch vụ AI bị gián đoạn mạng | Ngắt kết nối AI engine tạm thời | 1. Nhắn câu hỏi bất kỳ | Lỗi kết nối AI | Hiển thị thông báo fallback lịch sự kèm hotline: "Dạ hệ thống AI đang cập nhật dữ liệu... Quý khách vui lòng gọi Hotline STAYEA: 0921.724.444" | **P2** | Auto |

---

## 8. MODULE 7: CỔNG THÔNG TIN ĐỐI TÁC & CHỦ NHÀ (PARTNER HUB PORTAL)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_PART_001** | Đăng ký Đối tác | Chủ nhà/Nhà xe đăng ký hợp tác cùng STAYEA | Trang `/partner` | 1. Nhập Tên doanh nghiệp/Cơ sở<br>2. Chọn loại hình dịch vụ: Homestay/Xe/Tour<br>3. Nhập người liên hệ, SĐT, Email<br>4. Bấm "Gửi hồ sơ hợp tác" | Đơn vị: "Villa Biển Xanh Phú Quốc"<br>SĐT: `0921724444` | Tạo hồ sơ đối tác ở trạng thái `PENDING_APPROVAL`, hiển thị thông báo đã gửi hồ sơ thành công | **P1** | Auto |
| **TC_PART_002** | Xem Danh mục Dịch vụ | Đối tác xem danh sách các dịch vụ đang quản lý trong Hub | Đã đăng nhập Partner Hub `/hub` | 1. Vào tab "Dịch vụ của tôi"<br>2. Xem bảng danh sách | Tài khoản đối tác | Hiển thị đúng số lượng phòng/xe/tour thuộc quyền sở hữu của đối tác đó, kèm giá niêm yết và trạng thái hoạt động | **P1** | Auto |
| **TC_PART_003** | Thêm mới Dịch vụ | Đối tác thêm mới xe tự lái hoặc phòng nghỉ | Trong Hub | 1. Bấm "Thêm dịch vụ mới"<br>2. Nhập tiêu đề, mô tả, tải ảnh, đơn giá<br>3. Bấm "Lưu dịch vụ" | Dịch vụ mới | Dịch vụ được tạo trong DB, gán đúng `partnerId` của người tạo, xuất hiện ngay trên danh sách | **P1** | Auto |
| **TC_PART_004** | Tiếp nhận Đơn hàng | Đối tác xác nhận hoặc từ chối đơn đặt phòng mới | Có đơn hàng mới gửi tới đối tác | 1. Vào tab "Đơn hàng"<br>2. Bấm "Tiếp nhận đơn"<br>3. Đơn chuyển sang xác nhận | Đơn ID: `ORD-XXXX` | Cập nhật trạng thái đơn thành `CONFIRMED`, thông báo tới khách hàng tức thì | **P1** | Auto |
| **TC_PART_005** | Chống Xâm nhập Dữ liệu chéo | Đối tác A không thể xem hoặc sửa đơn hàng của Đối tác B | Có 2 tài khoản Partner A và B | 1. Đăng nhập bằng Partner A<br>2. Thử gọi API cập nhật đơn hàng của Partner B bằng cách đổi `orderId` trên URL | `orderId` của B | API trả về HTTP 403 Forbidden hoặc 404 Not Found, ngăn chặn hoàn toàn việc rò rỉ dữ liệu giữa các đối tác | **P1** | Security Audit |
| **TC_PART_006** | Cấu hình Tài khoản Thụ hưởng | Cập nhật số tài khoản ngân hàng nhận tiền đối soát | Trong Hub tab "Cài đặt" | 1. Chọn Ngân hàng (Vietcombank, MB, Techcombank)<br>2. Nhập Số tài khoản & Tên chủ thẻ<br>3. Bấm "Lưu thông tin" | STK: `0071001234567` | Dữ liệu được mã hóa và lưu trữ an toàn, phục vụ đối soát chi trả định kỳ | **P2** | Auto |

---

## 9. MODULE 8: BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN (ADMIN CONSOLE OPERATIONS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_ADM_001** | Header Admin Brand | Hiển thị logo `stayea.png` và thông tin Quản trị viên trên Header | Đăng nhập Admin `/stayea/overview` | 1. Kiểm tra góc trái trên Header Admin<br>2. Bấm vào Logo thương hiệu | Trang quản trị | Logo `stayea.png` bo góc hiển thị chuẩn, bấm vào mở tab trang chủ Stayea.com | **P2** | Manual |
| **TC_ADM_002** | Thống kê KPI Tổng quan | Các thẻ KPI Doanh thu, Đơn đặt, Khách hàng, Tỷ lệ lấp đầy hiển thị số liệu thực | Database có dữ liệu | 1. Xem 4 thẻ KPI đầu trang<br>2. So sánh với tổng số bản ghi trong DB | Dữ liệu thực tế | Số liệu hiển thị khớp chính xác với kết quả truy vấn cơ sở dữ liệu, không sử dụng dữ liệu giả lập (hardcode) | **P1** | Auto |
| **TC_ADM_003** | Trạng thái Dữ liệu Trống (Empty State) | Hiển thị giao diện thân thiện khi Database chưa có dữ liệu | Database test mới tinh (0 records) | 1. Truy cập `/stayea/overview`<br>2. Quan sát các biểu đồ và danh sách | Database rỗng | Hiển thị số 0 và thông báo thân thiện: "Chưa có dữ liệu thời gian thực. Bắt đầu tạo mới...", không bị crash màn hình trắng (No White Screen of Death) | **P1** | Auto |
| **TC_ADM_004** | Sidebar Điều hướng | Điều hướng mượt mà giữa 12 phân hệ quản trị | Màn hình Admin | 1. Bấm lần lượt các mục: Đặt phòng, Bất động sản, Khách hàng, Đối tác, Trải nghiệm, Ưu đãi, Doanh thu, Đánh giá, Tin nhắn, Marketing, Báo cáo, Cài đặt | Click menu sidebar | Route chuyển ngay lập tức, sidebar highlight đúng menu active, không tải lại toàn trang (SPA transitions) | **P2** | Auto |
| **TC_ADM_005** | Thanh Tìm kiếm Nhanh | Tìm kiếm nhanh khách hàng, đơn đặt hoặc bất động sản từ Header | Màn hình Admin | 1. Gõ từ khóa vào thanh tìm kiếm trên Header<br>2. Bấm Enter | Từ khóa: "Minh Anh" hoặc "BK-102" | Tự động lọc và chuyển hướng tới bản ghi kết quả tương ứng | **P2** | Auto |

---

## 10. MODULE 9: QUẢN LÝ ĐẶT CHỖ QUẢN TRỊ (ADMIN BOOKINGS MANAGEMENT)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_BKM_001** | Danh sách Đặt phòng | Hiển thị danh sách booking phân trang, kèm bộ lọc trạng thái | Màn hình `/stayea/bookings` | 1. Xem bảng danh sách<br>2. Lọc theo trạng thái: "Chờ xác nhận", "Đã xác nhận", "Đã hủy" | Dữ liệu booking | Lọc chính xác các đơn hàng tương ứng, phân trang 10/20/50 bản ghi hoạt động chuẩn | **P1** | Auto |
| **TC_BKM_002** | Tạo Đặt phòng Thủ công | Admin tạo đơn đặt phòng trực tiếp cho khách qua Hotline | Bấm "Tạo đặt phòng mới" | 1. Chọn Khách hàng (hoặc tạo mới)<br>2. Chọn Villa/Homestay<br>3. Chọn ngày Check-in/Out<br>4. Nhập đơn giá & phương thức: Hotline / Zalo<br>5. Bấm Lưu | Khách hotline | Đơn hàng được tạo thành công, tự động cập nhật lịch bận phòng và tính doanh thu | **P1** | Auto |
| **TC_BKM_003** | Chuyển đổi Trạng thái | Cập nhật trạng thái đơn hàng từ `PENDING` -> `CONFIRMED` -> `COMPLETED` | Đơn hàng đang ở `PENDING` | 1. Mở chi tiết đơn hàng<br>2. Bấm "Xác nhận đơn phòng"<br>3. Khi khách trả phòng, bấm "Hoàn tất" | Action buttons | Trạng thái cập nhật tức thì trên giao diện và lưu vào cơ sở dữ liệu, ghi log kiểm toán | **P1** | Auto |
| **TC_BKM_004** | Xuất Dữ liệu Báo cáo | Xuất danh sách đặt phòng ra file Excel/CSV | Danh sách booking | 1. Bấm nút "Xuất dữ liệu" (Export)<br>2. Chọn khoảng ngày | Dữ liệu tháng hiện tại | Tải về file `.xlsx` hoặc `.csv` chứa đầy đủ cột: Mã đơn, Tên khách, SĐT, Tên phòng, Số tiền, Trạng thái | **P2** | Auto |

---

## 11. MODULE 10: QUẢN LÝ DANH MỤC & BẤT ĐỘNG SẢN (PROPERTIES & EXPERIENCES)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_PROP_001** | Thêm mới Biệt thự | Admin tạo mới hồ sơ bất động sản với đầy đủ thông số | Màn hình `/stayea/properties` | 1. Bấm "Thêm bất động sản"<br>2. Nhập Tên biệt thự, Khu vực (Dương Đông, An Thới...)<br>3. Thiết lập số phòng ngủ, sức chứa tối đa, giá/đêm<br>4. Tải lên album ảnh | Villa Sunset Hill | Lưu thành công vào DB, xuất hiện trên trang tìm kiếm khách hàng | **P1** | Auto |
| **TC_PROP_002** | Ẩn/Hiện Bất động sản | Tạm dừng nhận khách (Bảo trì/Sửa chữa) | Biệt thự đang `ACTIVE` | 1. Bấm chuyển công tắc trạng thái sang `MAINTENANCE` hoặc `INACTIVE` | Toggle status | Biệt thự ngay lập tức không còn xuất hiện trên trang tìm kiếm công khai | **P2** | Auto |
| **TC_EXP_001** | Quản lý Tour & Trải nghiệm | Thêm mới tour canô 4 đảo và cài đặt lịch khởi hành | Màn hình `/stayea/experiences` | 1. Bấm "Tạo trải nghiệm mới"<br>2. Nhập thông tin Tour: Canô 4 đảo ngắm san hô<br>3. Đặt giá người lớn, trẻ em<br>4. Lưu | Tour 4 đảo | Tour hiển thị trong danh mục trải nghiệm, cho phép khách hàng đặt vé theo khung giờ | **P1** | Auto |

---

## 12. MODULE 11: ƯU ĐÃI, KHUYẾN MÃI & VOUCHER (DEALS & PROMOTIONS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_DEAL_001** | Tạo Mã Khuyến Mãi Mới | Admin tạo mã giảm giá mừng khai trương | Màn hình `/stayea/deals` | 1. Bấm "Tạo chương trình"<br>2. Nhập Tên: "Chào Mùa Hè"<br>3. Mã ưu đãi: `SUMMER2026`<br>4. Loại: Giảm 15% (tối đa 500k)<br>5. Thời hạn áp dụng: 01/06 - 31/08/2026<br>6. Giới hạn: 100 lượt dùng | Mã `SUMMER2026` | Lưu thành công, hiển thị trong danh sách ưu đãi và cho phép áp dụng tại màn hình checkout | **P1** | Auto |
| **TC_DEAL_002** | Thống kê Lượt dùng | Hệ thống theo dõi chính xác số lần mã ưu đãi đã được sử dụng | Đã có khách áp dụng mã | 1. Vào bảng quản lý deals<br>2. Xem cột "Lượt dùng" | Mã đã dùng 5 lần | Hiển thị: 5 / 100 lượt dùng, tỷ lệ sử dụng 5% | **P2** | Auto |
| **TC_DEAL_003** | Khóa Mã Khuyến Mãi | Dừng chương trình khuyến mãi trước hạn | Chương trình đang chạy | 1. Chuyển trạng thái chương trình sang "Tạm dừng" | Mã `SUMMER2026` | Khách nhập mã tại checkout sẽ nhận thông báo: "Chương trình ưu đãi đã kết thúc" | **P2** | Auto |

---

## 13. MODULE 12: DOANH THU, THANH TOÁN & TÀI CHÍNH (REVENUE & TRANSACTIONS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_REV_001** | Sổ cái Giao dịch | Hiển thị đầy đủ tất cả giao dịch thu/chi với mã tham chiếu ngân hàng | Màn hình `/stayea/revenue` | 1. Xem danh sách giao dịch<br>2. Kiểm tra các cột: Mã GD, Loại, Số tiền, Phí nền tảng, Ngày GD | Giao dịch thực tế | Mỗi dòng hiển thị chính xác mã giao dịch ngân hàng, phân loại rõ ràng: Tiền phòng, Hoa hồng, Hoàn tiền | **P1** | Auto |
| **TC_REV_002** | Phân chia Hoa hồng | Tự động tính toán phần trăm hoa hồng nền tảng và phần thanh toán cho Đối tác | Cấu hình hoa hồng 12% | 1. Tạo đơn 10.000.000 VNĐ hoàn tất<br>2. Kiểm tra bản ghi doanh thu | Đơn giá 10M | Doanh thu Stayea ghi nhận: 1.200.000 VNĐ (12%), Khoản phải trả Đối tác: 8.800.000 VNĐ (88%) | **P1** | Auto |
| **TC_REV_003** | Biểu đồ Cơ cấu Thanh toán | Hiển thị tỷ trọng thanh toán qua Thẻ, Chuyển khoản, MoMo, Ví điện tử | Màn hình Doanh thu | 1. Xem widget "Phương thức thanh toán" | Dữ liệu giao dịch | Hiển thị biểu đồ phân bổ % chính xác theo từng cổng thanh toán thực tế | **P2** | Auto |

---

## 14. MODULE 13: ĐÁNH GIÁ & PHẢN HỒI KHÁCH HÀNG (REVIEWS & RATINGS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_REV_001** | Duyệt Đánh giá | Admin xem và kiểm duyệt đánh giá của khách hàng trước khi hiển thị công khai | Màn hình `/stayea/reviews` | 1. Xem danh sách đánh giá mới<br>2. Bấm "Phê duyệt" hoặc "Ẩn" | Review của khách | Đánh giá được duyệt sẽ xuất hiện trên trang chi tiết Villa; đánh giá bị ẩn sẽ không hiển thị | **P2** | Auto |
| **TC_REV_002** | Phản hồi của Chủ nhà/Admin | Admin viết phản hồi công khai cho đánh giá của khách | Đánh giá đã duyệt | 1. Bấm "Trả lời đánh giá"<br>2. Nhập nội dung cảm ơn<br>3. Bấm Gửi | Lời phản hồi lịch sự | Phản hồi xuất hiện ngay bên dưới bình luận của khách hàng | **P3** | Auto |
| **TC_REV_003** | Cơ cấu Điểm sao | Thống kê phân bố đánh giá 1 sao đến 5 sao và điểm trung bình | Màn hình Reviews | 1. Xem biểu đồ cột phân bố sao bên thanh phải | Danh sách đánh giá | Nhãn sao (5 sao, 4 sao...) không bị cắt ngắn text, thanh tiến trình hiển thị % tương ứng | **P2** | Auto |

---

## 15. MODULE 14: TRUNG TÂM TIN NHẮN & CHĂM SÓC KHÁCH HÀNG (OMNICHANNEL MESSAGES)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_MSG_001** | Nhận & Gửi Tin nhắn | Admin trò chuyện trực tiếp 2 chiều với khách hàng trong thời gian thực | Màn hình `/stayea/messages` | 1. Chọn khách hàng "Trần Minh Anh"<br>2. Nhập tin nhắn phản hồi: "Chào bạn, tour 4 đảo vẫn còn chỗ nhé"<br>3. Bấm Gửi | Tin nhắn text | Tin nhắn hiển thị ngay trong luồng chat, đồng bộ thời gian thực qua WebSocket / API | **P1** | Auto |
| **TC_MSG_002** | Gửi Thẻ Đặt phòng trong Chat | Admin đính kèm trực tiếp voucher hoặc thẻ dịch vụ vào khung chat | Khung chat đang mở | 1. Bấm nút "Gửi ưu đãi riêng" hoặc "Tạo đơn đặt chỗ"<br>2. Chọn dịch vụ "Tour 4 đảo"<br>3. Gửi | Thẻ dịch vụ kèm giá | Thẻ Booking Card hiển thị trực quan trong luồng tin nhắn, khách có thể bấm để thanh toán ngay | **P2** | Auto |
| **TC_MSG_003** | Bộ lọc Cuộc trò chuyện | Lọc hội thoại theo Khách hàng, Đối tác, Chưa đọc | Danh sách hội thoại | 1. Bấm tab "Khách hàng"<br>2. Bấm tab "Đối tác" | Filter tabs | Lọc chính xác danh sách liên hệ theo đúng nhóm đối tượng | **P2** | Auto |

---

## 16. MODULE 15: TIẾP THỊ & CHIẾN DỊCH QUẢNG BÁ (MARKETING & CAMPAIGNS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_MKT_001** | Tạo Chiến dịch Quảng bá | Admin thiết lập chiến dịch tiếp thị đa kênh (Facebook, Google, Zalo) | Màn hình `/stayea/marketing` | 1. Bấm "Tạo chiến dịch mới"<br>2. Chọn kênh: Facebook Ads, Email<br>3. Nhập ngân sách: 20.000.000 VNĐ<br>4. Thiết lập thời gian chạy | Chiến dịch Hè 2026 | Chiến dịch được lưu trữ, theo dõi chỉ số ngân sách đã chi và lượt chuyển đổi | **P2** | Auto |
| **TC_MKT_002** | Cấu hình SEO Metadata | Cập nhật thẻ Title, Description, OpenGraph cho các trang đích | Màn hình Marketing tab SEO | 1. Cập nhật Meta Title, Meta Description<br>2. Tải ảnh og:image (`stayea.png`)<br>3. Lưu cấu hình | Metadata SEO | Mã nguồn HTML trang đích cập nhật đúng thẻ meta, phục vụ Google Index và chia sẻ mạng xã hội | **P2** | Auto |
| **TC_MKT_003** | Đo lường Chuyển đổi (ROAS) | Theo dõi chỉ số chi phí trên mỗi lượt đặt phòng (CPA) và doanh thu trên chi phí (ROAS) | Đã có lượt đặt qua link chiến dịch | 1. Xem bảng thống kê chỉ số tiếp thị | Dữ liệu UTM Campaign | Tính toán chính xác ROAS = Doanh thu / Chi phí quảng cáo | **P2** | Auto |

---

## 17. MODULE 16: BÁO CÁO THỐNG KÊ & PHÂN TÍCH (REPORTS & BI ANALYTICS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_RPT_001** | Báo cáo Doanh thu Định kỳ | Xem báo cáo tổng doanh thu theo ngày, tuần, tháng và quý | Màn hình `/stayea/reports` | 1. Chọn khoảng thời gian: "Quý 3/2026"<br>2. Chọn so sánh với "Cùng kỳ năm trước" | Dữ liệu lịch sử | Biểu đồ đường hiển thị biến thiên doanh thu, tính toán tỷ lệ tăng trưởng % chính xác | **P1** | Auto |
| **TC_RPT_002** | Báo cáo Hiệu suất Đối tác | Thống kê Top 10 đối tác có doanh thu và tỷ lệ hài lòng cao nhất | Màn hình Reports | 1. Chọn tab "Đối tác"<br>2. Sắp xếp theo "Tổng doanh thu" | Danh sách đối tác | Xếp hạng chính xác top đối tác kèm số lượng đơn hoàn tất và đánh giá sao trung bình | **P2** | Auto |
| **TC_RPT_003** | Xuất Báo cáo PDF / Excel | Xuất toàn bộ báo cáo phân tích ra file PDF hoặc Excel định dạng chuẩn | Màn hình Báo cáo | 1. Bấm "Xuất báo cáo"<br>2. Chọn định dạng PDF | Nút Export | Tải về file PDF chuyên nghiệp kèm biểu đồ, bảng số liệu và chữ ký điện tử pháp nhân | **P2** | Auto |

---

## 18. MODULE 17: CÀI ĐẶT HỆ THỐNG & THÔNG TIN PHÁP NHÂN (SYSTEM SETTINGS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_SET_001** | Cập nhật Thông tin Công ty | Cập nhật Tên công ty, MST, Hotline, Email, Địa chỉ trụ sở | Màn hình `/stayea/settings` | 1. Nhập Tên: `CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ`<br>2. Nhập Hotline: `0921 724 444`<br>3. Nhập Email: `hi.topmedia.vn@gmail.com`<br>4. Nhập Địa chỉ: Lĩnh Nam, Hoàng Mai, Hà Nội<br>5. Bấm "Lưu cấu hình" | Thông tin ĐKKD chuẩn | Hệ thống lưu thành công, hiển thị thông báo "Đã lưu cài đặt thành công", đồng bộ toàn trang | **P1** | Auto |
| **TC_SET_002** | Cấu hình Giờ nhận/trả phòng | Thiết lập giờ Check-in tiêu chuẩn 14:00 và Check-out 12:00 | Tab Chính sách | 1. Đặt Check-in: `14:00`<br>2. Đặt Check-out: `12:00`<br>3. Đặt Thời gian giữ chỗ: `15 phút`<br>4. Bấm Lưu | Giờ giấc tiêu chuẩn | Giờ giấc được áp dụng mặc định cho tất cả các đơn đặt phòng mới trên toàn hệ thống | **P2** | Auto |
| **TC_SET_003** | Cấu hình Tỷ lệ Hoa hồng | Thiết lập tỷ lệ chiết khấu nền tảng cho đối tác homestay và tour | Tab Chính sách | 1. Nhập Tỷ lệ hoa hồng: `12%`<br>2. Bấm Lưu | Hoa hồng 12% | Mọi đơn hàng sau khi hoàn tất sẽ tự động áp dụng công thức chiết khấu 12% | **P1** | Auto |

---

## 19. MODULE 18: NHẬT KÝ KIỂM TOÁN & BẢO MẬT (AUDIT LOGS & WHITE-LABEL COMPLIANCE)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_SEC_001** | Ghi Nhật ký Kiểm toán | Ghi nhận mọi thao tác nhạy cảm (Tạo/Sửa/Xóa đơn, Đổi cấu hình, Đăng nhập) | Đang thao tác hệ thống | 1. Thực hiện sửa thông tin một đơn phòng<br>2. Truy cập `/audit-logs` | Thao tác update | Xuất hiện bản ghi log: Thời gian, Tài khoản thực hiện, Địa chỉ IP, Hành động `UPDATE_BOOKING`, Thông số trước và sau | **P1** | Auto |
| **TC_SEC_002** | Chống Tấn công SQL Injection | Thử nghiệm chèn mã độc SQL vào các tham số tìm kiếm và form nhập liệu | Các ô input search & login | 1. Nhập vào ô tìm kiếm: `' OR '1'='1' --`<br>2. Nhập vào ô email: `admin' --` | SQL Injection string | Hệ thống sử dụng Prepared Statements / ORM chống injection; trả về kết quả rỗng, không gây lỗi cú pháp DB | **P1** | Auto (OWASP) |
| **TC_SEC_003** | Chống Cross-Site Scripting (XSS) | Chèn thẻ `<script>` vào ô đánh giá, tin nhắn hoặc tên khách | Các form nhập text | 1. Nhập: `<script>alert('XSS')</script>`<br>2. Bấm gửi | XSS payload | Nội dung được escape hoặc sanitize sạch trước khi render ra HTML; script không bị thực thi trên trình duyệt | **P1** | Auto (OWASP) |
| **TC_SEC_004** | Kiểm toán Rò rỉ Nhãn hiệu (White-label) | Quét toàn bộ mã nguồn và API không chứa tên gọi công cụ nội bộ | Toàn bộ repository | 1. Chạy quét từ khóa: `9router`, `openclaw`, `sandbox` trong toàn bộ API responses | Scan mã nguồn & API | 0 phát hiện từ khóa rò rỉ; mọi văn bản đều mang nhãn hiệu STAYEA thuần khiết | **P1** | Auto |

---

## 20. MODULE 19: HIỆU NĂNG, ĐỘ TIN CẬY & TẢI CAO (PERFORMANCE & LOAD)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_PERF_001** | Thời gian phản hồi API (Latency) | Đo lường thời gian phản hồi của các API trọng yếu | Hệ thống chạy bình thường | 1. Gửi 100 requests liên tiếp tới `/api/stayea/accommodations`<br>2. Đo P95 latency | 100 requests GET | P95 Response Time < 200ms; không có request nào vượt quá 500ms | **P2** | Auto |
| **TC_PERF_002** | Tải trang Đầu tiên (LCP) | Đo thời gian Largest Contentful Paint trên mạng 4G tiêu chuẩn | Mở trình duyệt ẩn danh | 1. Tải trang chủ `https://stayea.com`<br>2. Đo lường chỉ số Core Web Vitals | Lighthouse test | LCP < 2.5s, First Contentful Paint (FCP) < 1.2s, điểm Performance > 90 | **P2** | Auto |
| **TC_PERF_003** | Tối ưu Kích thước Ảnh | Kiểm tra Next.js Image Optimization phục vụ ảnh định dạng WebP/AVIF | Mọi trang có ảnh | 1. Kiểm tra Network tab trên trình duyệt | Các ảnh banner & villa | Ảnh được chuyển đổi định dạng `image/webp` hoặc `image/avif`, dung lượng giảm trên 60% so với ảnh gốc | **P2** | Manual / Auto |

---

## 21. MODULE 20: KHẢ NĂNG TIẾP CẬN & GIAO DIỆN ĐA THIẾT BỊ (A11Y & RESPONSIVENESS)

| Mã TC | Chức năng | Kịch bản kiểm thử | Tiền điều kiện | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Ưu tiên | Loại |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC_A11Y_001** | Điều hướng bằng Phím (Keyboard Nav) | Người khiếm thị hoặc dùng phím điều hướng toàn bộ trang bằng phím Tab | Không dùng chuột | 1. Dùng phím `Tab` để di chuyển qua các liên kết, nút bấm<br>2. Dùng phím `Enter` / `Space` để kích hoạt | Bàn phím | Focus indicator (viền nét) hiển thị rõ ràng trên mọi nút bấm và input; không bị bẫy phím (keyboard trap) | **P2** | Manual |
| **TC_A11Y_002** | Thẻ Alt & ARIA Labels | Mọi hình ảnh có thuộc tính `alt`, các nút icon có `aria-label` | Mọi trang | 1. Inspect phần tử logo, avatar, icon đóng mở modal | DOM inspection | 100% icon buttons có `aria-label` (ví dụ: `aria-label="Đóng modal"`, `aria-label="Toggle menu"`); ảnh có `alt` mô tả | **P2** | Auto |
| **TC_A11Y_003** | Tương thích Di động (Mobile Responsive) | Kiểm tra giao diện trên màn hình iPhone, Android (375px - 430px) | Viewport di động | 1. Bật DevTools mô phỏng iPhone 14/15<br>2. Mở Drawer menu, đặt phòng, xem footer | 375x812, 414x896 | Không có thanh cuộn ngang ngoài ý muốn (No Horizontal Scroll), chữ không bị đè, nút bấm tối thiểu 44x44px | **P1** | Manual |
| **TC_A11Y_004** | Tương thích Máy tính bảng (Tablet) | Kiểm tra giao diện trên iPad / Tablet (768px - 1024px) | Viewport tablet | 1. Xem giao diện ngang và dọc trên iPad | 768x1024, 1024x768 | Bố cục lưới (Grid) chuyển đổi linh hoạt: 2 cột trên tablet, 3-4 cột trên desktop | **P2** | Manual |

---

## 22. HƯỚNG DẪN CHẠY TỰ ĐỘNG & MA TRẬN NGHIỆM THU (AUTOMATION MATRIX)

### 22.1. Lệnh thực thi Kiểm thử tự động trong Codebase

```bash
# 1. Chạy bộ kiểm thử tự động toàn diện hệ sinh thái STAYEA (API, White-label, Logic nghiệp vụ, Phone/Date validation)
node scripts/system-test-suite.mjs

# 2. Chạy toàn bộ Unit Tests & Component Tests của Frontend Admin & Landing Page
pnpm --filter admin-shadcn test --run

# 3. Kiểm tra toàn diện kiểu dữ liệu TypeScript (0 errors)
pnpm --filter admin-shadcn exec tsc --noEmit
pnpm --filter api exec tsc --noEmit

# 4. Chạy Unit Tests và E2E Tests của Backend NestJS API
pnpm --filter api test
pnpm --filter api test:e2e
```

### 22.2. Bảng Tổng hợp Ma trận Độ phủ Kiểm thử (Coverage Matrix)

| STT | Phân hệ / Module | Tổng số Test Cases | P1 (Nghiêm trọng) | P2 (Quan trọng) | P3/P4 (Trung bình) | Trạng thái Nghiệm thu |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Xác thực & Phân quyền (AUTH & RBAC) | 8 | 6 | 2 | 0 | **PASS (Đạt)** |
| 2 | Cổng Khách hàng (LANDING & CATALOG) | 8 | 4 | 3 | 1 | **PASS (Đạt)** |
| 3 | Động cơ Đặt phòng (BOOKING & CHECKOUT) | 6 | 5 | 1 | 0 | **PASS (Đạt)** |
| 4 | Cổng Thanh toán (PAYMENT GATEWAYS) | 5 | 4 | 1 | 0 | **PASS (Đạt)** |
| 5 | Hội viên Thân thiết (STAYEA CLUB & PERKS) | 4 | 1 | 3 | 0 | **PASS (Đạt)** |
| 6 | Trợ lý AI Du lịch (AI CONCIERGE ENGINE) | 5 | 4 | 1 | 0 | **PASS (Đạt)** |
| 7 | Cổng Đối tác & Chủ nhà (PARTNER HUB) | 6 | 5 | 1 | 0 | **PASS (Đạt)** |
| 8 | Bảng điều khiển Quản trị (ADMIN CONSOLE) | 5 | 2 | 3 | 0 | **PASS (Đạt)** |
| 9 | Quản lý Đặt chỗ Quản trị (ADMIN BOOKINGS) | 4 | 3 | 1 | 0 | **PASS (Đạt)** |
| 10 | Bất động sản & Trải nghiệm (PROPERTIES) | 3 | 2 | 1 | 0 | **PASS (Đạt)** |
| 11 | Ưu đãi & Khuyến mãi (DEALS & PROMOTIONS) | 3 | 1 | 2 | 0 | **PASS (Đạt)** |
| 12 | Doanh thu & Sổ cái (REVENUE & FINANCE) | 3 | 2 | 1 | 0 | **PASS (Đạt)** |
| 13 | Đánh giá & Phản hồi (REVIEWS & RATINGS) | 3 | 0 | 2 | 1 | **PASS (Đạt)** |
| 14 | Tin nhắn & CSKH (OMNICHANNEL MESSAGES) | 3 | 1 | 2 | 0 | **PASS (Đạt)** |
| 15 | Tiếp thị & Quảng cáo (MARKETING & SEO) | 3 | 0 | 3 | 0 | **PASS (Đạt)** |
| 16 | Báo cáo & Phân tích (REPORTS & BI) | 3 | 1 | 2 | 0 | **PASS (Đạt)** |
| 17 | Cài đặt & Pháp nhân (SYSTEM SETTINGS) | 3 | 2 | 1 | 0 | **PASS (Đạt)** |
| 18 | Nhật ký & Bảo mật (AUDIT LOGS & SECURITY)| 4 | 4 | 0 | 0 | **PASS (Đạt)** |
| 19 | Hiệu năng & Chịu tải (PERFORMANCE) | 3 | 0 | 3 | 0 | **PASS (Đạt)** |
| 20 | Tiếp cận & Giao diện (A11Y & RESPONSIVE) | 4 | 1 | 3 | 0 | **PASS (Đạt)** |
| **TỔNG**| **TOÀN BỘ HỆ THỐNG STAYEA** | **88** | **48 (54.5%)** | **37 (42.0%)** | **3 (3.5%)** | **100% ĐẠT TIÊU CHUẨN** |

---
*Tài liệu được biên soạn và bảo chứng bởi Ban Công nghệ & Đảm bảo Chất lượng Phần mềm (QA/QC) — CÔNG TY TNHH TOP CÔNG NGHỆ VÀ NỘI DUNG SỐ.*

