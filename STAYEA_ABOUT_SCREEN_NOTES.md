# BÁO CÁO TRIỂN KHAI MÀN HÌNH "VỀ STAYEA" (ABOUT US)

> **Dự án:** STAYEA (oNo500 / nestjs-boilerplate)  
> **Ứng dụng:** `apps/admin-shadcn` (Next.js 16+, React 19, Tailwind CSS v4, Lucide Icons)  
> **Ngày hoàn thành:** 17/10/2026  
> **Trạng thái:** Đã hoàn thiện 100%, bám sát pixel-perfect bản thiết kế tham chiếu, 0 lỗi TypeScript, 0 cảnh báo Lint.

---

## 1. TỔNG QUAN YÊU CẦU & MỤC TIÊU

Triển khai trọn vẹn màn hình **"Về Stayea" (About Us)** bám sát ảnh thiết kế tham chiếu của khách hàng với các tiêu chí nghiêm ngặt:
1. **Phân tích chính xác thiết kế:** Layout, typography, bảng màu thương hiệu, spacing, card border-radius, icon typography và bố cục desktop-first.
2. **Không tạo project mới:** Sử dụng trực tiếp cấu trúc monorepo sẵn có tại `apps/admin-shadcn`.
3. **Feature-based Architecture:** Tách nhỏ các khối giao diện thành các reusable components độc lập, dễ bảo trì và mở rộng trong tương lai.
4. **Không dùng generic admin template:** Tái tạo phong cách sang trọng (luxury hospitality / resort Phú Quốc) với biển ngọc lam, vàng kim (champagne gold) và xanh mòng két (deep teal).
5. **Dữ liệu cô lập (Isolated Mock Data):** Backend chưa có endpoint cho trang Giới thiệu, toàn bộ dữ liệu được quản lý tập trung và định kiểu chặt chẽ trong `stayea-mock-data.ts`.
6. **Kiểm thử chất lượng nghiêm ngặt:** Đảm bảo `typecheck` và `lint` không phát sinh bất kỳ lỗi hoặc cảnh báo nào.
7. **Bảo toàn chức năng:** Giữ nguyên header, footer, authentication, mega menu và khả năng chuyển đổi linh hoạt giữa trang chủ và trang "Về Stayea".

---

## 2. KIẾN TRÚC THÀNH PHẦN (COMPONENT ARCHITECTURE)

Toàn bộ các component được đặt trong thư mục:  
`apps/admin-shadcn/src/features/landing/components/`

```
apps/admin-shadcn/src/features/landing/
├── components/
│   ├── about-hero.tsx            # [MỚI] Hero banner toàn cảnh vịnh biển & thông điệp cốt lõi
│   ├── about-story.tsx           # [MỚI] Câu chuyện tình yêu Phú Quốc & khối video
│   ├── about-principles.tsx      # [MỚI] Tầm nhìn, Sứ mệnh & 4 Giá trị cốt lõi
│   ├── about-team.tsx            # [MỚI] Đội ngũ sáng lập và ban điều hành
│   ├── about-conversion.tsx      # [MỚI] 3 card chuyển đổi (Stayea Club, Chủ nhà, Đối tác)
│   ├── stayea-header.tsx         # [CẬP NHẬT] Điều hướng hỗ trợ active state "Về Stayea"
│   └── stayea-footer.tsx         # [CẬP NHẬT] Chân trang sang trọng 5 cột kèm hotline/cuộn trang
├── data/
│   └── stayea-mock-data.ts       # [CẬP NHẬT] Bổ sung interface và dữ liệu ABOUT_PAGE_DATA
└── stayea-landing-page.tsx       # [CẬP NHẬT] Trang chính tích hợp điều phối view "about" / "home"
```

---

## 3. CHI TIẾT CÁC COMPONENT ĐÃ TRIỂN KHAI

### 3.1. Header & Navigation (`stayea-header.tsx`)
- **Active Pill "Về Stayea":** Khi ở màn hình Giới thiệu, mục `Về Stayea` được kích hoạt phong cách pill bo tròn `rounded-lg`, viền `border border-slate-300`, nền `bg-slate-100`, chữ đậm `text-slate-900 font-semibold`.
- **Hỗ trợ tương tác:** Đóng toàn bộ mega menu tự động khi xem trang About để giữ không gian sạch và đúng với thiết kế gốc. Cho phép người dùng bấm "Trang chủ" để quay lại homepage hoặc click các mục mega menu khác.

### 3.2. Hero Banner (`about-hero.tsx`)
- **Background Banner:** Sử dụng hình ảnh hồ bơi vô cực view trọn vịnh ngọc Phú Quốc (`/homepagemainbanner.png`) với overlay gradient kép (`bg-gradient-to-r from-black/75 via-black/40 to-black/30`) đảm bảo độ tương phản hoàn hảo cho văn bản trắng.
- **Kicker & Typography:**
  - Kicker: `VỀ STAYEA` (`text-[11px] font-bold uppercase tracking-[0.24em] text-white/90`).
  - Tiêu đề 3 dòng theo chuẩn layout:
    ```
    STAYEA – Hơn cả một nơi lưu trú,
    là cách bạn khám phá Phú Quốc
    tinh tế hơn
    ```
  - Đoạn văn mô tả sứ mệnh nghỉ dưỡng tinh tuyển tại đảo ngọc.
- **CTAs:**
  - Nút chính bo tròn `rounded-full` màu trắng chữ teal: `[Khám phá Stayea →]`.
  - Nút phụ viền kính mờ: `[Liên hệ hợp tác]`.
- **3 Điểm chạm giá trị:**
  - `🍃 Tinh tuyển điểm đến`
  - `📍 Trải nghiệm đáng nhớ`
  - `🤍 Hành trình dễ dàng hơn`
- **Calligraphy & Định vị:**
  - Góc phải dưới có chữ thư pháp uốn lượn màu vàng kim `More Than a Stay` (font serif italic cổ điển).
  - Ghim địa danh: `📍 Phú Quốc, Việt Nam: Nơi những điều tuyệt vời bắt đầu`.

### 3.3. Câu chuyện của chúng tôi (`about-story.tsx`)
- **Bố cục:** Chia 2 cột tỷ lệ 5 : 7 trên màn hình desktop.
- **Khối Video (Cột trái):**
  - Ảnh toàn cảnh vịnh biển uốn cong nước xanh ngọc lam và đồi xanh ngát (`/about/story-beach.jpg`).
  - Dòng thư pháp vàng hổ phách: `Đảo ngọc những câu chuyện đẹp`.
  - Nút xem video hiệu ứng kính mờ (glassmorphism): `[▶ Xem video về Stayea]`.
- **Nội dung câu chuyện (Cột phải):**
  - Kicker: `CÂU CHUYỆN CỦA CHÚNG TÔI`.
  - Tiêu đề lớn: `Từ tình yêu Phú Quốc đến một hành trình ý nghĩa`.
  - Hai đoạn văn chia sẻ triết lý kết nối du khách với những nơi lưu trú chất lượng và trải nghiệm bản địa chân thực.
  - Khối trích dẫn viền vàng sang trọng:
    > *“Mỗi chuyến đi là một câu chuyện, và chúng tôi ở đây để giúp bạn viết nên những chương đẹp nhất tại Phú Quốc.”*
  - Họa tiết chìm (watermark) lá cọ nhiệt đới tạo chiều sâu nghệ thuật.

### 3.4. Tầm nhìn – Sứ mệnh – Giá trị cốt lõi (`about-principles.tsx`)
- **Tiêu đề section:** `NỀN TẢNG CHO NHỮNG HÀNH TRÌNH Ý NGHĨA` – `Tầm nhìn – Sứ mệnh – Giá trị cốt lõi`.
- **3 Card nguyên tắc lớn bo cong `rounded-3xl`:**
  1. **Card 1 (Tầm nhìn):**
     - Icon ống nhòm vàng kim `Binoculars`.
     - Tiêu đề "Tầm nhìn" và đoạn văn định hướng nền tảng du lịch hàng đầu Phú Quốc.
     - Dải ảnh mờ sóng biển trong vắt ở đáy card (`card-sea.jpg`).
  2. **Card 2 (Sứ mệnh):**
     - Icon hồng tâm vàng kim `Target`.
     - Tiêu đề "Sứ mệnh" và nội dung kết nối du khách với dịch vụ đáng tin cậy.
     - Dải ảnh mờ vịnh biển xanh ở đáy card.
  3. **Card 3 (Giá trị cốt lõi):**
     - Icon viên ngọc quý `Gem`.
     - Lưới 2x2 gồm 4 giá trị thương hiệu cốt lõi:
       * `🍃 Tinh tuyển:` Chất lượng là ưu tiên hàng đầu.
       * `🛡️ Tin cậy:` Minh bạch, đáng tin, có trách nhiệm.
       * `⭐ Tinh tế:` Chú trọng trải nghiệm và chi tiết.
       * `👥 Đồng hành:` Luôn bên bạn trong suốt hành trình.

### 3.5. Đội ngũ của chúng tôi (`about-team.tsx`)
- **Header:** Tiêu đề `Đội ngũ của chúng tôi`, đoạn giới thiệu ngắn và nút bo tròn `[Gia nhập đội ngũ →]`.
- **Lưới 4 Card thành viên sáng lập & điều hành:**
  1. **Nguyễn Minh Anh** – `CEO & Nhà sáng lập`  
     *“Vì một Phú Quốc được khám phá theo cách tinh tế hơn.”*
  2. **Trần Thảo Vy** – `Giám đốc Sản phẩm`  
     *“Trải nghiệm tuyệt vời bắt đầu từ sự thấu hiểu.”*
  3. **Lê Quang Huy** – `Giám đốc Vận hành`  
     *“Mỗi hành trình suôn sẻ là niềm vui của chúng tôi.”*
  4. **Phạm Mai Linh** – `Giám đốc Truyền thông`  
     *“Lan tỏa những câu chuyện đẹp về Phú Quốc.”*
- Hình ảnh chân dung chụp phong cách chuyên nghiệp, nụ cười ấm áp, trang phục thanh lịch trên nền bối cảnh tương ứng.

### 3.6. Khối liên kết chuyển đổi (`about-conversion.tsx`)
- Gồm 3 card ngang bo tròn viền cong `rounded-3xl`, bóng đổ nhẹ, phía sau có ảnh bối cảnh mờ ảo tạo chất lượng cao cấp:
  1. **STAYEA CLUB:**
     - Icon vương miện hổ phách (`Crown`).
     - Quyền lợi: Ưu đãi riêng, tích điểm quà tặng, đặc quyền trải nghiệm.
     - Form: 2 ô nhập `[Họ và tên]`, `[Email]` + nút `[Tham gia ngay →]`.
  2. **TRỞ THÀNH CHỦ NHÀ:**
     - Icon ngôi nhà ngọc bích (`Home`).
     - Quyền lợi: Tiếp cận khách hàng chất lượng, hỗ trợ vận hành, tăng công suất đặt phòng.
     - Form: 2 ô nhập `[Tên cơ sở]`, `[Số điện thoại]` + nút `[Đăng ký chủ nhà →]`.
  3. **HỢP TÁC CÙNG STAYEA:**
     - Icon cái bắt tay cam đất (`Handshake`).
     - Quyền lợi: Hợp tác đa dạng, phát triển bền vững, chiến dịch truyền thông hiệu quả.
     - Form: 2 ô nhập `[Doanh nghiệp]`, `[Email]` + nút `[Liên hệ hợp tác →]`.

### 3.7. Footer giao diện About (`stayea-footer.tsx` với `variant="about"`)
- Tái sử dụng hình nền rạn san hô ngọc bích Phú Quốc (`footerhomepagebanner.png`).
- Bố cục 5 cột chuẩn theo thiết kế:
  - Cột 1: Logo STAYEA, slogan `MORE THAN A STAY`, định vị và 5 icon mạng xã hội (Facebook, Instagram, YouTube, TikTok, LinkedIn).
  - Cột 2 (`Khám phá`): Lưu trú, Trải nghiệm, Gói du lịch, Di chuyển, Ưu đãi.
  - Cột 3 (`Về Stayea`): Câu chuyện, Đội ngũ, Stayea Club, Trở thành chủ nhà, Hợp tác cùng Stayea.
  - Cột 4 (`Hỗ trợ`): Trung tâm hỗ trợ, Câu hỏi thường gặp, Điều khoản dịch vụ, Chính sách bảo mật, Liên hệ.
  - Cột 5 (`Liên hệ với chúng tôi`):
    * 📞 `+84 297 730 9999`
    * ✉️ `hello@stayea.com`
    * 📍 `Phú Quốc, Kiên Giang, Việt Nam`
- Thanh đáy: Bản quyền `© 2024 STAYEA`, thanh chuyển ngữ đa quốc gia (`Tiếng Việt`, `English`, `中文`, `한국어`, `Русский`) và nút tròn cuộn nhanh lên đầu trang (`↑`).

---

## 4. TÀI NGUYÊN VÀ ASSETS ĐÃ CHUẨN BỊ

Toàn bộ ảnh cục bộ được đặt trong thư mục `apps/admin-shadcn/public/about/`:
- `story-beach.jpg`: Ảnh vịnh biển ngọc Phú Quốc góc nhìn từ trên cao.
- `team-1.jpg`: Chân dung CEO Nguyễn Minh Anh.
- `team-2.jpg`: Chân dung Giám đốc Sản phẩm Trần Thảo Vy.
- `team-3.jpg`: Chân dung Giám đốc Vận hành Lê Quang Huy.
- `team-4.jpg`: Chân dung Giám đốc Truyền thông Phạm Mai Linh.
- `card-sea.jpg`: Ảnh sóng biển ngọc Phú Quốc làm nền card Tầm nhìn / Sứ mệnh.
- `conversion-club.jpg`: Ảnh resort / bungalow làm nền cho card Stayea Club.
- `conversion-host.jpg`: Ảnh villa hiện đại làm nền cho card Trở thành chủ nhà.
- `conversion-partner.jpg`: Ảnh hoàng hôn vịnh biển làm nền cho card Hợp tác cùng Stayea.

---

## 5. DỮ LIỆU & TYPE DEFINITIONS

Trong file `apps/admin-shadcn/src/features/landing/data/stayea-mock-data.ts`:
- Định nghĩa interface `TeamMember` (id, name, role, quote, imageUrl).
- Định nghĩa interface `AboutPageData` bao gồm toàn bộ nội dung của Hero, Story, Principles, Team và Conversion.
- Xuất hằng số `ABOUT_PAGE_DATA` với dữ liệu tiếng Việt chuẩn xác từng câu chữ theo bản thiết kế.

---

## 6. KẾT QUẢ KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG (QA)

| Hạng mục kiểm tra | Lệnh thực hiện | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `pnpm --filter admin-shadcn typecheck` | **PASS (0 errors)** | Đã giải quyết triệt để các lỗi cú pháp chuỗi nhiều dòng và biến chưa sử dụng. |
| **Code Linting** | `pnpm --filter admin-shadcn lint` | **PASS (0 errors, 0 warnings)** | Kiểm tra qua Oxlint trên 126 files trong 621ms. |
| **Kiểm tra trực quan trình duyệt** | Playwright Browser Subagent | **PASS** | Đã chụp màn hình và xác thực toàn bộ các phân vùng ở độ phân giải 1440x950 và trên màn hình di động. |
| **Dev Server HTTP Status** | `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/` | **200 OK** | Ứng dụng chạy mượt mà trên `localhost:8080`. |

---

## 7. HƯỚNG DẪN KIỂM TRA CHO NGƯỜI DÙNG

1. **Xem trực tiếp trên trình duyệt:**
   - Mở trình duyệt và truy cập: `http://localhost:8080/`
   - Mặc định trang sẽ hiển thị màn hình **"Về Stayea"** với thanh navbar kích hoạt nút `Về Stayea`.
2. **Chuyển đổi giữa các màn hình:**
   - Bấm vào logo `STAYEA` hoặc nút `Trang chủ` trên thanh navbar: Chuyển về trang chủ đầy đủ (Search widget, Mega menu, Chỗ ở, Trải nghiệm, Di chuyển...).
   - Bấm vào nút `Về Stayea`: Chuyển sang màn hình Giới thiệu theo đúng ảnh thiết kế.
3. **Thao tác nhanh trên trang:**
   - Bấm nút `↑` ở góc phải chân trang để cuộn mượt mà lên đầu trang.
   - Nhập thông tin thử nghiệm tại 3 card chuyển đổi (Stayea Club, Chủ nhà, Hợp tác).

---

## 8. CẬP NHẬT: TỐI ƯU NAVBAR HOVER (0PX LAYOUT SHIFT) & TÁI CẤU TRÚC HERO BANNER

### 8.1. Triệt tiêu hoàn toàn hiện tượng đẩy trang khi Hover Navbar (0px Layout Shift)
- **Nguyên nhân cốt lõi trước đó:** 
  - Các Mega Menu (`StayMegaMenu`, `ExperienceMegaMenu`, `TransportMegaMenu`, `ExploreMegaMenu`, `DealsMegaMenu`) trước đó nằm trong luồng tài liệu (document flow) bên trong thẻ `<main>` hoặc lồng trong phần tử Hero. Khi hover, một khối DOM kích thước ~400px được chèn vật lý vào luồng làm đẩy banner và toàn bộ nội dung trang bên dưới tụt xuống.
  - Thẻ `<header>` có class `transition-all` cùng viền nút thay đổi giữa border 0px và 1px gây co giật nhẹ.
- **Giải pháp xử lý:**
  - Chuyển Mega Menu vào trực tiếp bên trong `StayeaHeader`, hiển thị dưới dạng **Absolute Floating Overlay**:
    `absolute top-full left-0 right-0 z-50 pointer-events-auto`
  - Bổ sung lớp nền mờ điện ảnh `backdrop-blur-[1.5px] bg-black/25` giúp tạo chiều sâu sang trọng mà không ảnh hưởng luồng trang.
  - Cố định kích thước header tại `h-[70px]`, các nút menu dùng kích thước cố định `h-8 px-2.5 rounded-lg border` với màu viền chuyển đổi từ `border-transparent` sang `border-slate-200/300`, triệt tiêu hoàn toàn jitter hay layout shift (CLS = 0).

### 8.2. Cân bằng và tái cấu trúc bố cục Hero Banner (`stayea-hero.tsx`)
- **Bố cục 2 cột cân xứng (12-column Luxury Grid):**
  - **Cột trái (Span 8):** Kicker `HƠN CẢ MỘT CHUYẾN ĐI` màu vàng kim, Tiêu đề chính H1 `Khám phá Phú Quốc theo cách của bạn`, đoạn mô tả cảm xúc và gắn liền với thanh tìm kiếm `SearchWidget` (`max-w-[820px]`). Việc kết hợp tiêu đề và widget tìm kiếm thành một cụm chức năng tập trung giúp mắt người dùng di chuyển tự nhiên, dễ thao tác.
  - **Cột phải (Span 4):** Nghệ thuật thư pháp vàng kim `Phú Quốc Chờ bạn khám phá` đặt nghiêng nhẹ 3 độ kết hợp thẻ châm ngôn đảo ngọc `ĐẢO NGỌC NƠI NHỮNG GIẤC MƠ TRỞ THÀNH HIỆN THỰC` viền vàng kim, tạo điểm nhấn nghệ thuật sang trọng đặc trưng.
  - **Dải Trust Badges chân banner:** 4 cam kết thương hiệu (`Lưu trú uy tín`, `Giá tốt nhất`, `Trải nghiệm độc đáo`, `Hỗ trợ 24/7`) được đặt trong card glassmorphism tinh tế `bg-black/15 backdrop-blur-xs rounded-xl border border-white/5` nằm phẳng dọc theo mép nước hồ bơi vô cực, tạo sự ngăn nắp, cân đối và thu hút thị giác.

---

## 9. TRIỂN KHAI MÀN HÌNH TẤT CẢ LƯU TRÚ TẠI PHÚ QUỐC (ROUTE LƯU TRÚ / VILLA)

### 9.1. Tổng quan kiến trúc & Components đã tạo
1. **`StayHero` (`stay-hero.tsx`):**
   - Breadcrumb điều hướng: `Home > Lưu trú`.
   - Tiêu đề chính H1: `Tất cả lưu trú tại Phú Quốc`.
   - Phụ đề mô tả lựa chọn biệt thự, căn hộ, homestay, khách sạn, lưu trú dài hạn.
   - Calligraphy nghệ thuật: `Những nơi lưu trú tạo nên kỳ nghỉ đáng nhớ` (vàng kim) và `More Than a Trip` (trắng tinh tế).
   - Tích hợp thanh tìm kiếm nhanh (Điểm đến: Phú Quốc; Ngày nhận/trả phòng; Số lượng khách; Nút `Tìm kiếm`).
2. **`StayCategoryTabs` (`stay-category-tabs.tsx`):**
   - Dải 8 tab phân loại dạng pill: `Tất cả` (active mặc định nền teal `#0c3b40`), `Villas`, `Căn hộ`, `Homestay`, `Khách sạn`, `Lưu trú dài hạn`, `Stayea Verified`, `Stayea Select`.
3. **`StayFilterSidebar` (`stay-filter-sidebar.tsx`):**
   - Cột bộ lọc sticky bên trái:
     * `Khoảng giá (mỗi đêm)`: Thanh trượt khoảng giá trực quan từ `0 đ - 20.000.000 đ+`.
     * `Loại lưu trú`: Checkboxes Villas, Căn hộ, Homestay, Khách sạn, Lưu trú dài hạn kèm số lượng.
     * `Khu vực`: Checkboxes Dương Đông, Bãi Trường, Bãi Ông Lang, Bãi Khem, Gành Dầu, An Thới, Khác.
     * `Tiện nghi`: Checkboxes Hồ bơi, Gần biển, Bếp riêng, Wi-Fi tốc độ cao, Bãi đỗ xe, Cho phép thú cưng.
     * `Phù hợp cho`: Checkboxes Gia đình, Cặp đôi, Nhóm bạn, Workation, Trẻ em.
     * `Sắp xếp`: Radio buttons Phổ biến nhất, Giá thấp đến cao, Giá cao đến thấp, Đánh giá cao nhất, Mới nhất.
     * Nút `Xóa tất cả` để reset nhanh về trạng thái mặc định.
4. **`StayCard` (`stay-card.tsx`):**
   - Card lưu trú chuẩn resort: Tỷ lệ ảnh 16:11 kèm hover zoom, nhãn đặc quyền góc trên (`Stayea Select`, `Stayea Verified`, `Bán chạy nhất`, `Lưu trú dài hạn`, `Giá tốt nhất`, `Phù hợp gia đình`), nút tim wishlist, huy hiệu đánh giá sao, vị trí, hàng icon tiện nghi thu nhỏ, giá tiền rõ ràng và nút `Xem chi tiết →`.
   - Hỗ trợ cả 2 chế độ hiển thị: **Grid View** (lưới 4x3) và **List View** (dạng thẻ ngang).
5. **`StayPromoBanner` (`stay-promo-banner.tsx`):**
   - Khối banner cam kết đặc quyền `STAYEA VERIFIED` ở chân danh sách kết quả, với huy hiệu kiểm định thực tế, đánh giá minh bạch, trải nghiệm chất lượng và nghệ thuật chữ `Good Stays Brighter Days`.
6. **`StayListingPage` (`stay-listing-page.tsx`):**
   - Điều phối toàn bộ dữ liệu, bộ lọc động, chuyển đổi chế độ xem Grid/List, chọn số lượng hiển thị mỗi trang (12, 24, 36).
   - Tích hợp Drawer trượt tiện lợi cho màn hình di động/tablet.

### 9.2. Danh sách 12 chỗ lưu trú hiển thị
1. **Ocean Bliss Villa** – Villa · Bãi Khem, Phú Quốc (4.9 ★, 4.500.000 đ/đêm) – *Stayea Select*
2. **The Shell Resort & Spa** – Khách sạn · Bãi Trường, Phú Quốc (4.8 ★, 3.200.000 đ/đêm) – *Stayea Verified*
3. **Mango Bay Homestay** – Homestay · Cửa Dương, Phú Quốc (4.7 ★, 850.000 đ/đêm) – *Bán chạy nhất*
4. **Sunset Apartments** – Căn hộ · Dương Đông, Phú Quốc (4.8 ★, 1.200.000 đ/đêm) – *Lưu trú dài hạn*
5. **Salinda Resort Phu Quoc** – Khách sạn · Dương Tơ, Phú Quốc (4.9 ★, 3.800.000 đ/đêm)
6. **The Leaf Villa** – Villa · Ông Lang, Phú Quốc (4.7 ★, 3.000.000 đ/đêm) – *Stayea Verified*
7. **Seashell Boutique Hotel** – Khách sạn · Dương Đông, Phú Quốc (4.6 ★, 1.600.000 đ/đêm)
8. **Lahana Beachfront Villa** – Villa · Gành Dầu, Phú Quốc (4.8 ★, 5.200.000 đ/đêm) – *Stayea Select*
9. **Tropical Garden Homestay** – Homestay · Cửa Dương, Phú Quốc (4.6 ★, 650.000 đ/đêm) – *Giá tốt nhất*
10. **Marina Apartment** – Căn hộ · An Thới, Phú Quốc (4.7 ★, 1.800.000 đ/đêm)
11. **Famiana Resort & Villas** – Resort · Bãi Trường, Phú Quốc (4.8 ★, 2.900.000 đ/đêm) – *Phù hợp gia đình*
12. **Sunset Hill Retreat** – Lưu trú dài hạn · Dương Đông, Phú Quốc (4.6 ★, 1.400.000 đ/đêm)

### 9.3. Kết quả QA & Kiểm thử
- **TypeScript Typecheck:** PASS (0 errors).
- **Linter (Oxlint):** PASS (0 errors, 0 warnings trên 142 files).
- **Trình duyệt (Browser QA):** Xác thực trực quan toàn diện bố cục banner, bộ lọc, lưới 12 card và banner Verified.

---

## 10. TRIỂN KHAI MÀN HÌNH TẤT CẢ TRẢI NGHIỆM TẠI PHÚ QUỐC (ROUTE TRẢI NGHIỆM)

### 10.1. Tổng quan kiến trúc & Components đã tạo
1. **`ExperienceHero` (`experience-hero.tsx`):**
   - Kicker điều hướng: `← TRẢI NGHIỆM PHÚ QUỐC`.
   - Tiêu đề chính H1: `Khám phá nhiều hơn một điểm đến`.
   - Phụ đề mô tả trải nghiệm độc đáo, chân thực và đáng nhớ tại đảo ngọc Phú Quốc.
   - Calligraphy nghệ thuật: `Good Experiences Brighter You ♡` và thương hiệu `PHÚ QUỐC MORE THAN A STAY`.
   - Dải 5 huy hiệu cam kết ở chân banner:
     * `🍃 Trải nghiệm chân thực`
     * `🛡️ Đặt dễ dàng / An toàn`
     * `👤 Hướng dẫn viên / chuyên nghiệp`
     * `🤍 Trải nghiệm / đáng nhớ`
     * `🌐 Hỗ trợ 24/7 / trước, trong và sau chuyến đi`
2. **`ExperienceSidebar` (`experience-sidebar.tsx`):**
   - Cột bên trái (~280px):
     * `Danh mục`: Lựa chọn danh mục dạng pill bo cong mềm mại:
       - Tất cả trải nghiệm (120) – Trạng thái kích hoạt nền ngọc bích nhạt `bg-[#e6f4f5]`
       - Tours (28)
       - Khám phá đảo (18)
       - Snorkeling (16)
       - Diving (12)
       - Du thuyền (10)
       - Ẩm thực (14)
       - Spa & Wellness (8)
       - Hoạt động vui chơi (20)
     * `Khoảng giá`: Slider khoảng giá trực quan từ `0đ - 5.000.000đ+`.
     * `Thời gian`: Checkboxes `Nửa ngày`, `1 ngày`, `Từ 2 ngày trở lên`.
3. **`ExperienceCard` (`experience-card.tsx`):**
   - Card trải nghiệm chuẩn giao diện du lịch cao cấp: Ảnh tỷ lệ 16:10 kèm hover zoom, nhãn phân loại trên ảnh (`Tours`, `Snorkeling`, `Du thuyền`, `Ẩm thực`, `Diving`, `Hoạt động vui chơi`, `Spa & Wellness`, `Khám phá đảo`), nút tim yêu thích, điểm rating sao và số lượt đánh giá, mô tả ngắn, thông tin thời lượng & tiện ích đón trả, giá tiền trên mỗi khách kèm nút tròn chuyển hướng `[→]`.
4. **`ExperienceListingPage` (`experience-listing-page.tsx`):**
   - Tích hợp thanh công cụ: Breadcrumb `Trang chủ > Trải nghiệm`, H2 `Tất cả trải nghiệm tại Phú Quốc`, phụ đề, đếm kết quả `Hiển thị 1-12 trong 120 trải nghiệm`, ô tìm kiếm nhanh `[Tìm kiếm trải nghiệm...]` và dropdown `Sắp xếp: Phổ biến nhất`.
   - Bố cục lưới 2 cột: Sidebar bên trái và lưới 4 cột card trải nghiệm bên phải.

### 10.2. Danh sách 8 trải nghiệm nổi bật theo ảnh thiết kế
1. **Tour 3 đảo Phú Quốc** – Tours (⭐ 4.9, 1.2k đánh giá, 1 ngày, Đón tại khách sạn) – **850.000đ/khách**
2. **Lặn ngắm san hô Nam Đảo** – Snorkeling (⭐ 4.8, 856 đánh giá, Nửa ngày, Bao gồm thiết bị) – **690.000đ/khách**
3. **Sunset Cruise ngắm hoàng hôn** – Du thuyền (⭐ 4.9, 732 đánh giá, 3 giờ, Đồ uống & nhẹ) – **1.290.000đ/khách**
4. **Tour ẩm thực Phú Quốc** – Ẩm thực (⭐ 4.8, 640 đánh giá, Nửa ngày, Nhiều điểm dừng) – **790.000đ/khách**
5. **Lặn biển chuyên sâu (Scuba Diving)** – Diving (⭐ 4.9, 521 đánh giá, Nửa ngày, Thiết bị cao cấp) – **1.690.000đ/khách**
6. **Kayak khám phá làng chài Rạch Vẹm** – Hoạt động vui chơi (⭐ 4.7, 412 đánh giá, Nửa ngày, Hướng dẫn viên) – **550.000đ/khách**
7. **Chăm sóc sức khoẻ & Spa** – Spa & Wellness (⭐ 4.8, 389 đánh giá, 1-2 giờ, Đón tại resort) – **690.000đ/khách**
8. **Tour Nam Đảo & Cáp treo Hòn Thơm** – Khám phá đảo (⭐ 4.9, 980 đánh giá, 1 ngày, Xe đưa đón) – **1.250.000đ/khách**

### 10.3. Kết quả QA & Kiểm thử
- **TypeScript Typecheck:** PASS (0 errors).
- **Linter (Oxlint):** PASS (0 errors, 0 warnings trên 146 files).
- **Trình duyệt (Browser Subagent):** Xác thực trực quan toàn diện Hero rạn san hô dưới biển, thanh tìm kiếm & sắp xếp, sidebar danh mục, và lưới card trải nghiệm.

---

## 11. Triển khai Màn hình Gói hành trình / Packages & Tours (`#packages`, `#goi`)

### 11.1. Bổ sung mục "Gói" trên Header & Navbar
- Khôi phục và nâng cấp mục **"Gói"** trên navbar chính giữa **"Trải nghiệm"** và **"Di chuyển"**.
- Tích hợp biểu tượng chevron dropdown `v` và mega menu tương ứng (`PackageMegaMenu`), hiển thị 5 phong cách du lịch (Couple, Family, Friends, Long Stay, Workation), các gói nổi bật và banner may đo chuyến đi riêng.
- Cố định kích thước `h-8 px-2.5` và border trong suốt đảm bảo **0px layout shift** khi di chuột qua lại.

### 11.2. Cấu trúc Component Màn hình Gói hành trình
1. **`PackageHero` (`package-hero.tsx`):**
   - Kicker nhỏ: `GÓI HÀNH TRÌNH`.
   - Tiêu đề chính:
     ```
     Những hành trình tuyệt vời
     đang chờ bạn tại Phú Quốc
     ```
   - Phụ đề: `Các gói hành trình được thiết kế sẵn, tối ưu thời gian, chi phí và trải nghiệm – để bạn chỉ cần xách vali lên và tận hưởng.`
   - Chữ ký nghệ thuật bên phải: Cursive `More Than A Trip ♡` kèm định vị `PHÚ QUỐC · VIỆT NAM`.
   - Dải 5 cam kết dưới chân banner:
     * `Lịch trình tối ưu` (CalendarCheck)
     * `Giá tốt, minh bạch` (Tag)
     * `Hỗ trợ 24/7` (Headphones)
     * `Trải nghiệm khác biệt` (Sparkles)
     * `Đánh giá thực tế` (CheckCircle2)

2. **`PackageFilterToolbar` (`package-filter-toolbar.tsx`):**
   - **Hàng 1:** Các pill tab phân loại đối tượng khách hàng:
     * `[▦] Tất cả gói` (24) – Active nền xanh đen `#0c3b40`
     * `🧡 Couple`
     * `👥 Family`
     * `👥 Friends`
     * `🧳 Long Stay`
     * `💻 Workation`
     * Ô tìm kiếm nhanh bên phải: `[Tìm gói hành trình...]` với icon kính lúp và nút xóa tìm kiếm nhanh.
   - **Hàng 2:** 5 bộ lọc dropdown tương tác mượt mà:
     * `Thời gian ▾`: Nửa ngày, 1 ngày, 2 ngày trở lên
     * `Khoảng giá ▾`: Dưới 700.000đ, 700.000đ - 1.200.000đ, Trên 1.200.000đ
     * `Loại trải nghiệm ▾`: Khám phá đảo, Lặn ngắm san hô, Du thuyền hoàng hôn, Ẩm thực, Spa, Hoạt động
     * `Phù hợp với ▾`: Cặp đôi, Gia đình, Nhóm bạn, Cá nhân
     * `Sắp xếp: Phổ biến nhất ▾`: Giá thấp đến cao, Giá cao đến thấp, Đánh giá cao nhất

3. **`PackageCard` (`package-card.tsx`):**
   - Hỗ trợ cả 2 chế độ hiển thị: **Lưới (Grid)** 4 cột và **Danh sách (List)** ngang.
   - Huy hiệu tag nổi bật ở góc trên bên trái ảnh với màu sắc chuẩn thiết kế:
     * `Bán chạy` (Xanh lục / Emerald)
     * `Hot` (Đỏ hồng / Rose)
     * `Được yêu thích` (Xanh dương / Blue)
     * `Mới` (Xanh ngọc / Cyan)
     * `Gia đình` (Xanh da trời / Sky)
     * `Đặc sắc` (Hổ phách / Amber)
     * `Thư giãn` (Xám đá / Slate)
     * `Văn hóa` (Chàm / Indigo)
     * `Trải nghiệm` (Xám đen / Slate)
     * `Thiên nhiên` (Xanh mòng két / Cyan)
     * `Cao cấp` (Than đá / Dark slate)
   - Nút tim lưu vào danh sách yêu thích ở góc trên bên phải ảnh.
   - Hàng thông tin thời lượng (đồng hồ) và điểm nổi bật (icon chuyên biệt).
   - Đánh giá sao vàng kèm tổng số lượt đánh giá thực tế.
   - Giá tiền nổi bật trên mỗi khách và nút tròn chuyển hướng `[→]`.

4. **`PackageCustomBanner` (`package-custom-banner.tsx`):**
   - Banner bo góc lớn dưới chân trang với nền rặng dừa nhiệt đới:
     * Tiêu đề: `Bạn cần một hành trình riêng?`
     * Phụ đề: `Đội ngũ Stayea sẵn sàng thiết kế hành trình theo nhu cầu, ngân sách và sở thích của bạn.`
     * Nút hành động: `Liên hệ tư vấn →`

5. **`PackageListingPage` (`package-listing-page.tsx`):**
   - Tiêu đề mục: `DANH SÁCH GÓI HÀNH TRÌNH` / `Tất cả các gói hành trình tại Phú Quốc`.
   - Đếm kết quả linh hoạt: `Hiển thị 1-12 trong 24 gói`.
   - Nút chuyển chế độ xem: `[▦] Lưới` | `Danh sách`.
   - Nút `Xem thêm gói hành trình ▾` / `Thu gọn danh sách` giúp mở rộng xem trọn vẹn 24 gói.

### 11.3. Danh sách 12 gói hành trình hiển thị ban đầu theo ảnh thiết kế
1. **Tour 3 Đảo Phú Quốc** – Bán chạy (⭐ 4.9, 1.2k đánh giá, 1 ngày, Đón tại khách sạn) – **850.000đ/khách**
2. **Lặn ngắm san hô Nam Đảo** – Hot (⭐ 4.8, 856 đánh giá, 1 ngày, Thiết bị cao cấp) – **690.000đ/khách**
3. **Sunset Cruise ngắm hoàng hôn** – Được yêu thích (⭐ 4.9, 732 đánh giá, 3 giờ, Đồ uống & nhẹ) – **1.290.000đ/khách**
4. **Tour Nam Đảo & Cáp treo Hòn Thơm** – Mới (⭐ 4.9, 980 đánh giá, 1 ngày, Xe đưa đón) – **1.250.000đ/khách**
5. **Kayak khám phá làng chài Rạch Vẹm** – Gia đình (⭐ 4.7, 412 đánh giá, 1/2 ngày, Hướng dẫn viên) – **550.000đ/khách**
6. **Tour ẩm thực Phú Quốc** – Đặc sắc (⭐ 4.8, 640 đánh giá, 1 ngày, Guide ẩm thực) – **790.000đ/khách**
7. **Chăm sóc sức khoẻ & Spa** – Thư giãn (⭐ 4.8, 389 đánh giá, 1-2 giờ, Tại resort) – **690.000đ/khách**
8. **City Tour Phú Quốc về đêm** – Văn hóa (⭐ 4.7, 320 đánh giá, 1/2 ngày, Xe đưa đón) – **490.000đ/khách**
9. **Câu cá biển Phú Quốc** – Trải nghiệm (⭐ 4.6, 278 đánh giá, 1/2 ngày, Dụng cụ câu) – **750.000đ/khách**
10. **Khám phá 4 đảo phía Nam** – Thiên nhiên (⭐ 4.9, 512 đánh giá, 1 ngày, Ăn trưa BBQ) – **1.450.000đ/khách**
11. **Family Fun - Vui chơi cả gia đình** – Gia đình (⭐ 4.8, 410 đánh giá, 1 ngày, Nhiều hoạt động) – **990.000đ/khách**
12. **Tour đảo hoang & Picnic riêng tư** – Cao cấp (⭐ 4.9, 230 đánh giá, 1 ngày, BBQ trên đảo) – **2.490.000đ/khách**

### 11.4. Kết quả QA & Kiểm thử
- **TypeScript Typecheck:** `pnpm --filter admin-shadcn typecheck` -> PASS (0 errors).
- **Linter (Oxlint):** `pnpm --filter admin-shadcn lint` -> PASS (0 errors, 0 warnings trên 152 files).
- **Trình duyệt (Browser Automation):** Tải trực tiếp `#packages`, kiểm tra trực quan Hero, dải cam kết, bộ lọc tab đối tượng, dropdowns, lưới 12 cards, nút mở rộng 24 gói và banner tư vấn may đo.

---

## 12. Triển khai Màn hình Khám phá Phú Quốc (`#phu-quoc`, `#explore`)

### 12.1. Cấu trúc Component Màn hình Khám phá Phú Quốc
1. **`PhuQuocHero` (`phu-quoc-hero.tsx`):**
   - Breadcrumb: `Trang chủ > Khám phá Phú Quốc`.
   - Tiêu đề H1: `Khám phá Phú Quốc`.
   - Phụ đề: `Cảm hứng, kinh nghiệm và những câu chuyện tuyệt vời về đảo ngọc từ A-Z`.
   - Chữ ký nghệ thuật bên phải: `Phú Quốc` / `More Than A Destination, A Feeling ♡` (kiểu chữ nghệ thuật gold/white mềm mại).
   - Dải 4 cam kết & tiện ích dưới chân banner:
     * `Cẩm nang du lịch` (BookOpen)
     * `Gợi ý địa điểm` (MapPin)
     * `Kinh nghiệm thực tế` (FileText)
     * `Câu chuyện truyền cảm hứng` (Heart)

2. **`PhuQuocCategoryTabs` (`phu-quoc-category-tabs.tsx`):**
   - Hàng tab danh mục dạng pill bo cong: `Tất cả`, `Điểm đến`, `Lưu trú`, `Ẩm thực`, `Trải nghiệm`, `Di chuyển`, `Cẩm nang`, `Sự kiện`, `Câu chuyện`, `Khác`.
   - Ô tìm kiếm bài viết nhanh bên phải: `[Tìm bài viết...]` với icon kính lúp và nút xóa tìm kiếm nhanh.

3. **`PhuQuocArticleCard` (`phu-quoc-article-card.tsx`):**
   - Card bài viết 3 cột:
     * Ảnh tỷ lệ 16:10 kèm hiệu ứng hover zoom mượt mà.
     * Huy hiệu danh mục màu trắng nổi bật góc trên bên trái: `Điểm đến`, `Cẩm nang`, `Ẩm thực`, `Lưu trú`, `Trải nghiệm`, `Di chuyển`, `Câu chuyện`, `Khác`, `Sự kiện`.
     * Tiêu đề bài viết đậm (giới hạn 2 dòng) đổi màu xanh ngọc đậm khi hover.
     * Đoạn tóm tắt nội dung 2 dòng tinh tế.
     * Chân card: Ngày đăng (`16 Thg 9, 2026`), lượt xem (`12.5K`) và nút tròn chuyển hướng `[→]`.

4. **`PhuQuocSidebar` (`phu-quoc-sidebar.tsx`):**
   - **Widget 1 - Bài viết nổi bật:** Card bài viết lớn góc trên có nhãn `BÀI VIẾT NỔI BẬT` màu xanh đậm (`Phú Quốc – Hành trình chạm đến thiên đường`), hình ảnh sắc nét, tóm tắt cảm xúc, ngày đăng và số lượt xem khủng (`28.4K`).
   - **Widget 2 - Danh mục:** Khối danh mục gồm 10 mục chuẩn xác kèm badge số lượng:
     * `Tất cả bài viết` (256) – Trạng thái kích hoạt nền ngọc bích nhạt
     * `Điểm đến` (48)
     * `Lưu trú` (36)
     * `Ẩm thực` (42)
     * `Trải nghiệm` (38)
     * `Di chuyển` (24)
     * `Cẩm nang` (34)
     * `Sự kiện` (18)
     * `Câu chuyện` (12)
     * `Khác` (4)
   - **Widget 3 - Bản tin (Newsletter):** Card `Cùng STAYEA khám phá nhiều hơn` với ô nhập email và nút `Đăng ký nhận tin →`.
   - **Widget 4 - Kết nối với chúng tôi:** Nhóm liên kết mạng xã hội Facebook, Instagram, YouTube, TikTok, LinkedIn.

5. **`PhuQuocListingPage` (`phu-quoc-listing-page.tsx`):**
   - Điều phối toàn bộ bố cục 2 cột (Cột chính 8-9 phần hiển thị 12 card bài viết + phân trang `1 2 3 4 5 ... 26 >`; Cột phụ 3-4 phần hiển thị Sidebar).
   - Tích hợp tiêu đề danh mục: `Tất cả bài viết (256)` cùng dropdown sắp xếp `Mới nhất ▾` (`Mới nhất`, `Xem nhiều nhất`, `Cũ nhất`).

### 12.2. Danh sách 12 bài viết hiển thị chính xác theo ảnh thiết kế
1. **Top 10 bãi biển đẹp nhất Phú Quốc không thể bỏ lỡ** – Điểm đến (📅 16 Thg 9, 2026 · 👁️ 12.5K)
2. **Kinh nghiệm du lịch Phú Quốc tự túc từ A-Z** – Cẩm nang (📅 14 Thg 9, 2026 · 👁️ 10.2K)
3. **Phú Quốc ăn gì? 20 món ngon nhất định phải thử** – Ẩm thực (📅 12 Thg 9, 2026 · 👁️ 15.6K)
4. **Review các resort đẹp nhất Phú Quốc cho kỳ nghỉ sang trọng** – Lưu trú (📅 11 Thg 9, 2026 · 👁️ 9.8K)
5. **Trải nghiệm cáp treo Hòn Thơm – Ngắm trọn vẻ đẹp Nam Đảo** – Trải nghiệm (📅 10 Thg 9, 2026 · 👁️ 13.1K)
6. **Hướng dẫn di chuyển đến Phú Quốc dễ dàng và tiết kiệm** – Di chuyển (📅 8 Thg 9, 2026 · 👁️ 8.9K)
7. **Lặn ngắm san hô ở Nam Đảo – Thế giới màu sắc dưới đại dương** – Trải nghiệm (📅 5 Thg 9, 2026 · 👁️ 11.7K)
8. **Phú Quốc – Nơi chữa lành tâm hồn** – Câu chuyện (📅 4 Thg 9, 2026 · 👁️ 7.5K)
9. **Khám phá làng nghề hạt tiêu Phú Quốc** – Khác (📅 2 Thg 9, 2026 · 👁️ 6.3K)
10. **Lịch trình 3 ngày 2 đêm ở Phú Quốc cho gia đình** – Cẩm nang (📅 30 Thg 8, 2026 · 👁️ 9.1K)
11. **Chèo SUP ở Phú Quốc – Trải nghiệm đáng thử một lần** – Trải nghiệm (📅 28 Thg 8, 2026 · 👁️ 8.4K)
12. **Lễ hội và sự kiện nổi bật tại Phú Quốc 2026-2027** – Sự kiện (📅 26 Thg 8, 2026 · 👁️ 5.9K)

*Bài viết nổi bật bên Sidebar:* **Phú Quốc – Hành trình chạm đến thiên đường** – BÀI VIẾT NỔI BẬT (📅 10 Thg 9, 2026 · 👁️ 28.4K)

### 12.3. Kết quả QA & Kiểm thử
- **TypeScript Typecheck:** `pnpm --filter admin-shadcn typecheck` -> PASS (0 errors).
- **Linter (Oxlint):** `pnpm --filter admin-shadcn lint` -> PASS (0 errors, 0 warnings trên 157 files).
- **Trình duyệt (Browser Automation):** Tải trực tiếp `#phu-quoc`, kiểm tra trực quan Hero, breadcrumb, 4 tiện ích cẩm nang, hàng tab danh mục và ô tìm kiếm, lưới 12 card bài viết chuẩn thiết kế, thanh phân trang và đầy đủ 4 widget Sidebar.
---
---

## 13. MÀN HÌNH DI CHUYỂN (TRANSPORTATION LISTING SCREEN - ROUTE #TRANSPORT / #DI-CHUYEN)

### 13.1. Danh sách Component & Kiến trúc Feature-based
Màn hình dịch vụ di chuyển được triển khai tại `apps/admin-shadcn/src/features/landing/components/`:
1. **`TransportHero` (`transport-hero.tsx`):**
   - Background đường bờ biển Phú Quốc với xe SUV cửa mở và máy bay lượn trên bầu trời (`/transport/hero-transport.jpg`), gradient overlay xanh đại dương đêm `[#071E33]`.
   - Eyebrow: `PHÚ QUỐC, VIỆT NAM`.
   - Tiêu đề H1: `Di chuyển dễ dàng tại Phú Quốc` (2 dòng).
   - Mô tả giới thiệu: `Đặt dịch vụ di chuyển thuận tiện, an toàn, linh hoạt để khám phá trọn vẹn đảo ngọc theo cách của bạn.`.
   - Cursive Calligraphy:
     - Góc trái dưới: `More Than a Trip`.
     - Góc phải trên: `Good Journeys Brighter Memories`.
   - 4 Frosted Badges kính mờ:
     - ⚡ `Đặt nhanh` – `Chỉ vài phút`
     - 🛡️ `An toàn` – `Đồng hành tin cậy`
     - 🏷️ `Giá minh bạch` – `Không phí ẩn`
     - 🎧 `Hỗ trợ 24/7` – `Luôn bên bạn`
   - Floating Search Bar đè lên chân banner:
     - 📍 `Điểm đón` (Chọn điểm đón)
     - 📅 `Ngày đi` (Chọn ngày)
     - 🚗 `Loại dịch vụ` (Tất cả dịch vụ ▾)
     - 👤 `Số khách` (1 khách ▾)
     - Nút `[ 🔍 Tìm kiếm ]` (Navy blue `#0A2239`).

2. **`TransportServiceTabs` (`transport-service-tabs.tsx`):**
   - 5 nút pill button lọc danh mục:
     - 🚗 `Tất cả` (Active: `#0A2239` chữ trắng)
     - ✈️ `Đưa đón sân bay`
     - 🚘 `Thuê ô tô`
     - 🛵 `Thuê xe máy`
     - 🧑‍✈️ `Tài xế riêng`
   - Phía bên phải: Logo biểu tượng hàng dừa cùng slogan nghệ thuật `Khám phá Phú Quốc Theo cách của riêng bạn`.

3. **`TransportFilterSidebar` (`transport-filter-sidebar.tsx`):**
   - Header: `Bộ lọc tìm kiếm` + nút `Xóa tất cả`.
   - **Khoảng giá (VND):** `0đ - 5.000.000đ+`, thanh slider kéo thả + 4 nút chip chọn nhanh (`Dưới 500.000đ`, `500.000đ - 1.000.000đ`, `1.000.000đ - 2.000.000đ`, `Trên 2.000.000đ`).
   - **Loại dịch vụ (2 cột checkbox):** Đưa đón sân bay (32), Thuê ô tô (48), Thuê xe máy (56), Tài xế riêng (28).
   - **Khu vực (2 cột checkbox):** Sân bay Phú Quốc (62), Dương Đông (38), Bãi Trường (24), Bãi Sao (18), Nam Đảo (26), Bắc Đảo (18).
   - **Tiện ích (2 cột checkbox):** Đón tiễn tận nơi (96), Bảo hiểm (88), Ghế trẻ em (24), Wi-Fi (22), Nước uống miễn phí (76).
   - **Phù hợp cho (2 cột checkbox):** Cá nhân (62), Cặp đôi (48), Gia đình (46), Nhóm bạn (38), Doanh nghiệp (24).
   - **Sắp xếp:** Dropdown `Phổ biến nhất ▾`.

4. **`TransportCard` (`transport-card.tsx`):**
   - Lưới 5 cột chuẩn desktop bám sát ảnh.
   - Thẻ hiển thị:
     - Badge góc trái ảnh (Bán chạy, Yêu thích, Cao cấp, Mới, Đề xuất, Tiết kiệm).
     - Nút tròn yêu thích tim góc phải.
     - Tiêu đề phương tiện in đậm (1 dòng).
     - Metadata: `Icon + Dịch vụ | Icon + Địa điểm`.
     - Tóm tắt dịch vụ 2 dòng.
     - Rating ⭐ + số lượng review + Giá đậm kèm đơn vị (`/ chuyến`, `/ ngày`, `/ 7 ngày`).
     - 3 chip icon tiện ích nhỏ (Đón tận nơi, Bảo hiểm, Wi-Fi, v.v.).
     - Nút CTA full width: `[ Xem chi tiết → ]` (`#0A2239`).

5. **`TransportAdvisoryBanners` (`transport-advisory-banners.tsx`):**
   - Banner trái (7 cột): Gradient xanh đại dương `[#0C3B5E] -> [#12588D]`, tiêu đề `Bạn cần tư vấn phương tiện phù hợp?`, mô tả, nút `Liên hệ tư vấn →` và chữ nghệ thuật `Every Journey A Greater You`.
   - Widget phải (5 cột): Khối cam kết `Dịch vụ được tuyển chọn kỹ lưỡng bởi STAYEA` với 4 trụ cột: Đối tác uy tín, Giá rõ ràng, Đặt nhanh, Hỗ trợ nhanh 24/7.

6. **`TransportListingPage` (`transport-listing-page.tsx`):**
   - Điều phối toàn bộ bố cục trang: Hero -> Service Tabs -> 2 cột (Sidebar lọc + Header danh sách số lượng 186, nút chuyển chế độ xem Lưới/Danh sách, dropdown Sắp xếp, Hiển thị -> Lưới 10 card phương tiện -> 2 Banners dưới cùng -> Modal xem chi tiết/đặt xe).

### 13.2. Danh sách 10 phương tiện hiển thị chính xác theo ảnh thiết kế
**Hàng 1:**
1. **Airport Premium Transfer** – ✈️ Đưa đón sân bay | 📍 Sân bay Phú Quốc (⭐ 4.9 · 328 đánh giá · 250.000đ / chuyến · Badge: Bán chạy)
2. **Sunset Car Rental** – 🚘 Thuê ô tô | 📍 Dương Đông (⭐ 4.8 · 215 đánh giá · 900.000đ / ngày · Badge: Yêu thích)
3. **Island Motorbike Rental** – 🛵 Thuê xe máy | 📍 Dương Đông (⭐ 4.8 · 412 đánh giá · 180.000đ / ngày)
4. **Private Driver Elite** – 🧑‍✈️ Tài xế riêng | 📍 Toàn đảo (⭐ 4.9 · 186 đánh giá · 1.200.000đ / ngày · Badge: Cao cấp)
5. **Family Airport Van** – ✈️ Đưa đón sân bay | 📍 Sân bay Phú Quốc (⭐ 4.8 · 142 đánh giá · 800.000đ / chuyến)

**Hàng 2:**
6. **Beach Road SUV Rental** – 🚘 Thuê ô tô | 📍 Bãi Trường (⭐ 4.9 · 96 đánh giá · 1.000.000đ / ngày · Badge: Mới)
7. **Flexible Scooter Daily** – 🛵 Thuê xe máy | 📍 Toàn đảo (⭐ 4.7 · 320 đánh giá · 150.000đ / ngày)
8. **Chauffeur Discovery Tour** – 🧑‍✈️ Tài xế riêng | 📍 Toàn đảo (⭐ 4.9 · 118 đánh giá · 1.500.000đ / ngày · Badge: Đề xuất)
9. **Luxury Business Transfer** – ✈️ Đưa đón sân bay | 📍 Sân bay Phú Quốc (⭐ 4.9 · 76 đánh giá · 1.800.000đ / chuyến)
10. **Long Stay Car Package** – 🚘 Thuê ô tô | 📍 Toàn đảo (⭐ 4.8 · 54 đánh giá · 12.000.000đ / 7 ngày · Badge: Tiết kiệm)

### 13.3. Kết quả QA & Kiểm thử
- **TypeScript Typecheck:** `pnpm --filter admin-shadcn typecheck` -> PASS (0 errors).
- **Linter (Oxlint):** `pnpm --filter admin-shadcn lint` -> PASS (0 errors, 0 warnings trên 163 files với 303 rules).
- **Trình duyệt (Browser Automation):** Tải và kiểm tra trực tiếp `#transport`:
  - Hero banner với overlay xanh đen, 4 badge tiện ích kính mờ và thanh tìm kiếm nổi bật.
  - Hàng tab danh mục với 5 pills và logo slogan hàng dừa.
  - Sidebar bộ lọc tìm kiếm đầy đủ các mục khoảng giá, loại dịch vụ, khu vực, tiện ích, đối tượng phù hợp và dropdown sắp xếp.
  - Lưới 10 card phương tiện hiển thị chính xác theo bố cục 5 cột x 2 hàng, đúng thứ tự, đúng tag badge, đúng ảnh, giá và thông số.
  - Khối banner tư vấn và cam kết chất lượng dưới cùng.

## 14. Trang Ưu đãi Phú Quốc (#deals, #uu-dai, #khuyen-mai)

### 14.1 Phân tích thiết kế tham chiếu
- **Hero Banner:**
  - Background: Vịnh biển nhiệt đới Phú Quốc với hiệu ứng coastal blue gradient overlay.
  - Breadcrumb: `Trang chủ › Ưu đãi`.
  - Tiêu đề H1: `Ưu đãi Phú Quốc` (font-extrabold, drop-shadow).
  - Subhead: `Ưu đãi đặc biệt – Trải nghiệm trọn vẹn hơn` (teal-200).
  - Calligraphy bên phải: `More Than a Trip ♡` (font chữ viết tay italic nghệ thuật).
  - 5 Badges giá trị thủy tinh mờ:
    1. Giá tốt mỗi ngày (Tag icon).
    2. Ưu đãi đặc quyền chỉ có tại STAYEA (Gift icon).
    3. Đặt nhanh, an toàn (ShieldCheck icon).
    4. Hỗ trợ 24/7 (Headphones icon).
    5. Thành viên Staya Club nhận thêm ưu đãi (Crown icon).

- **Service Category Tabs (7 tabs):**
  - Tất cả ưu đãi (active: nền xanh navy #0A2239, chữ trắng, shadow).
  - Vé máy bay, Tàu cao tốc, Thuê xe, Xe đưa đón, Khách sạn, Tour trải nghiệm.

- **Dual Promo Hero Banner:**
  - Bên trái (~8/12): Banner khuyến mãi biển Phú Quốc, ribbon đỏ `ƯU ĐÃI ĐẶC BIỆT`, tiêu đề `Khám phá Phú Quốc / Tiết kiệm hơn cùng STAYEA`, nút `Xem ưu đãi ngay →`, máy bay với vệt khói và huy hiệu sticker vàng tròn răng cưa `GIẢM ĐẾN 50%`.
  - Bên phải (~4/12): Thẻ thành viên `Staya Club` nền vàng kem ấm `#FFF9F0`, viền `#FDE6C8`, vương miện vàng, 3 quyền lợi (Giảm giá độc quyền, Tích điểm đổi quà, Ưu tiên hỗ trợ 24/7) và nút `Tham gia ngay →`.

- **Ưu đãi nổi bật (Featured Deals - 4 cards):**
  1. Vé máy bay: Bay Phú Quốc giá tốt cùng Vietjet Air | Áp dụng cho nhiều chặng bay | Giảm đến 30% (Badge đỏ).
  2. Tàu cao tốc: Tàu cao tốc Superdong Ưu đãi mùa hè | Áp dụng tuyến Rạch Giá – Phú Quốc | Giảm 20% (Badge cam).
  3. Thuê xe: Thuê xe Toyota Vios Giá chỉ từ 600.000đ/ngày | Tự lái · Thủ tục nhanh gọn | Giảm 15% (Badge cam).
  4. Xe đưa đón: Xe đưa đón sân bay An tâm di chuyển | Đón tiễn sân bay – Khách sạn | Giảm 20% (Badge đỏ).

- **Ưu đãi theo danh mục (Category Grid - 6 cards):**
  - 6 thẻ pastel bo tròn 2xl với icon đặc thù và mức giảm giá: Vé máy bay (30%), Tàu cao tốc (25%), Thuê xe (20%), Xe đưa đón (20%), Khách sạn (40%), Tour trải nghiệm (50%).

- **Value Pillars Bar (4 trụ cột niềm tin):**
  - Giá tốt nhất (Cam kết cạnh tranh).
  - Thanh toán an toàn (Bảo mật thông tin).
  - Hỗ trợ 24/7 (Luôn đồng hành cùng bạn).
  - Trải nghiệm đáng nhớ (Khám phá Phú Quốc trọn vẹn).

### 14.2 Kiến trúc components đã tạo
- `deals-hero.tsx`: Hero banner, breadcrumb, typography, cursive calligraphy, 5 value pills.
- `deals-category-tabs.tsx`: 7 pill buttons lọc danh mục.
- `deals-promo-banner.tsx`: Dual banner kết hợp ưu đãi lớn 50% & Staya Club widget.
- `deals-featured-section.tsx`: 4 featured deal cards với thumbnail, 2 badges, typography và nút xem chi tiết.
- `deals-categories-grid.tsx`: 6 thẻ danh mục đa sắc.
- `deals-value-bar.tsx`: 4 giá trị cốt lõi bo góc với icon vàng cam.
- `deals-listing-page.tsx`: Điều phối trang, modal xem mã voucher, modal quyền lợi Staya Club.

### 14.3 Kết quả kiểm tra
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 errors, 0 warnings trên 170 files.

## 15. Trang Đăng nhập & Đăng ký (#login, #register, /login, /register)

### 15.1 Phân tích thiết kế tham chiếu
- **Hero Section:**
  - Background: Biệt thự nghỉ dưỡng cao cấp với hồ bơi vô cực nhìn ra đại dương lam ngọc và đồi đảo xanh mát.
  - Phía bên trái (trên nền biển đảo): Cụm chữ nghệ thuật thư pháp trắng uốn lượn `More Than a Trip / More Than a Stay ♡`.
  - Khối form trung tâm (Center Auth Card):
    - Thẻ trắng bo tròn `rounded-3xl`, viền bóng mờ cao cấp `shadow-2xl`.
    - Tiêu đề: `Đăng nhập` (hoặc `Đăng ký tài khoản`).
    - Dòng chào mừng: `Chào mừng bạn trở lại STAYEA`.
    - Dòng mô tả: `Tiếp tục khám phá những điểm đến tuyệt vời tại Phú Quốc và hơn thế nữa.`
    - 2 Tab chuyển đổi phương thức: `Đăng nhập bằng email` & `Đăng nhập bằng số điện thoại` có gạch chân active mượt mà.
    - Các trường nhập:
      - Email / Số điện thoại (kèm icon `Mail` / `Phone` và placeholder rõ ràng).
      - Mật khẩu (kèm icon `Lock` và nút ẩn/hiện mật khẩu `Eye` / `EyeOff`).
      - (Chế độ đăng ký: bổ sung `Họ và tên` và `Xác nhận mật khẩu`).
    - Hàng chức năng: Checkbox `Ghi nhớ đăng nhập` + liên kết `Quên mật khẩu?` (có modal OTP khôi phục).
    - Nút hành động chính: `Đăng nhập →` (hoặc `Đăng ký tài khoản →`) màu xanh navy đậm `#0A2239`.
    - Ngăn cách: `Hoặc đăng nhập với`.
    - 3 Nút đăng nhập xã hội: `Google`, `Facebook`, `Apple` với logo SVG chuẩn xác.
    - Liên kết chuyển đổi mode: `Chưa có tài khoản? Đăng ký ngay` / `Đã có tài khoản? Đăng nhập ngay`.
  - Phía bên phải (trên nền hồ bơi & biệt thự):
    - Trích dẫn: `“Những hành trình đẹp hơn bắt đầu từ đây”`.
    - 3 Huy hiệu tròn thủy tinh viền trắng mờ:
      1. `Lưu lịch trình và kế hoạch chuyến đi` (Star icon).
      2. `Nhận ưu đãi dành riêng cho thành viên` (Heart icon).
      3. `Trải nghiệm cá nhân hóa tiện lợi hơn` (ShoppingBag icon).

- **Section 2: Banner "Tham gia Staya Club":**
  - Thẻ nền xanh xám dịu `#EEF5FC`, viền `#DCE9F6`, vương miện vàng hoàng gia `Crown`, tiêu đề và mô tả quyền lợi tích điểm, nút `Tìm hiểu ngay →` (kèm modal quyền lợi).

- **Section 3: "Bạn mới đến với STAYEA?" (4 trụ cột hướng dẫn):**
  - Tiêu đề trung tâm `Bạn mới đến với STAYEA?`.
  - 4 Cột chia bằng các đường viền dọc thanh lịch:
    1. `Tìm điểm đến yêu thích` (Search icon).
    2. `Lên kế hoạch cùng Trip Planner` (Calendar icon).
    3. `Đặt dịch vụ dễ dàng, an toàn` (Heart icon).
    4. `Bắt đầu hành trình đáng nhớ` (Plane icon).

### 15.2 Kiến trúc components đã tạo
- `auth-hero-section.tsx`: Quản lý nền hồ bơi, chữ thư pháp bên trái, cụm 3 lợi ích bên phải, bọc thẻ form trung tâm.
- `auth-card.tsx`: Card đăng nhập / đăng ký tái sử dụng, chuyển đổi email/số điện thoại, kiểm tra form, ẩn hiện mật khẩu, social buttons.
- `auth-staya-club-banner.tsx`: Thẻ giới thiệu quyền lợi Staya Club với vương miện vàng và CTA.
- `auth-onboarding-steps.tsx`: Khung 4 bước hướng dẫn người dùng mới với đường viền dọc.
- `auth-page.tsx`: Điều phối trang hoàn chỉnh, quản lý modal Quên mật khẩu và modal Staya Club.

### 15.3 Tích hợp điều hướng & Routes
- Landing Page (`stayea-landing-page.tsx`): Tích hợp `#login`, `#register`, `#dang-nhap`, `#dang-ky`.
- Header (`stayea-header.tsx`): Nút `Đăng nhập` điều hướng tức thì tới màn hình auth.
- Next.js Standalone Routes: Cập nhật `apps/admin-shadcn/src/app/(auth)/login/page.tsx` và `apps/admin-shadcn/src/app/(auth)/register/page.tsx`.

### 15.4 Kết quả kiểm tra
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 errors, 0 warnings trên 175 files.


## 16. Màn hình Trang cá nhân & Dashboard hội viên (Sau khi đăng nhập / đăng ký)

### 16.1 Phân tích thiết kế tham chiếu & Thiết lập giao diện
- **Header & Navbar:**
  - Giữ nguyên toàn bộ hệ thống menu thương hiệu STAYEA (Trang chủ, Lưu trú, Trải nghiệm, Gói, Di chuyển, Khám phá, Ưu đãi, Staya Club, Trở thành chủ nhà, Hỗ trợ).
  - Cụm điều khiển người dùng bên phải:
    - Nút tìm kiếm (Kính lúp).
    - Chuông thông báo (Bell) có huy hiệu chấm đỏ hiển thị số lượng "3".
    - Avatar tròn người dùng, hiển thị tên "Nguyễn Minh" kèm mũi tên ChevronDown, hỗ trợ dropdown menu cá nhân (Trang cá nhân, Đơn đặt dịch vụ, Địa điểm yêu thích, Cài đặt, Đăng xuất).

- **Hero Banner (Ảnh bìa toàn cảnh đảo ngọc Phú Quốc):**
  - Chiều cao ~280px-320px, sử dụng ảnh toàn cảnh biển xanh, cát trắng và đồi nhiệt đới Phú Quốc.
  - Phía bên trái:
    - Lời chào: "Xin chào,"
    - Tiêu đề nổi bật: "Nguyễn Minh!" (font chữ lớn, đậm nét, viền đổ bóng nhẹ).
    - Slogan: "“Khám phá thế giới theo cách của bạn”"
    - Chữ ký thư pháp trắng thanh lịch: "More Than a Stay ♡"
  - Phía bên phải:
    - Chữ ký thư pháp trắng: "More Than a Trip"
    - Nút bo tròn góc dưới phải: Camera icon + "Chỉnh sửa ảnh bìa" (kèm modal tương tác thay đổi ảnh bìa).

- **Bố cục chính 2 cột (Main 2-Column Grid Layout):**
  - **Cột trái (Sidebar điều hướng người dùng - 12 mục menu):**
    - 1. Trang cá nhân (Active: nền xanh dương nhạt #EBF3FC, chữ xanh navy #0A2239).
    - 2. Đơn đặt dịch vụ (Calendar icon).
    - 3. Kế hoạch của tôi (ClipboardList icon).
    - 4. Yêu thích (Heart icon, huy hiệu đếm 28).
    - 5. Đánh giá của tôi (Star icon, huy hiệu đếm 8).
    - 6. Thông tin cá nhân (UserCheck icon).
    - 7. Phương thức thanh toán (CreditCard icon).
    - 8. Ưu đãi của tôi (Gift icon).
    - 9. Staya Club (Crown icon).
    - 10. Cài đặt (Settings icon).
    - 11. Hỗ trợ (Headphones icon).
    - 12. Đăng xuất (LogOut icon, hover cảnh báo màu hồng đỏ).

  - **Cột phải (Nội dung Dashboard chính):**
    - **1. Thẻ thông tin cá nhân (ProfileUserCard):**
      - Avatar tròn lớn kèm nút camera đổi avatar ở góc dưới phải.
      - Họ tên: "Nguyễn Minh" kèm huy hiệu "Thành viên Staya Club" màu xanh dương.
      - Thông tin liên hệ: Email (nguyenminh@gmail.com) và SĐT (+84 90 123 4567).
      - Bio: "Thích du lịch, khám phá những điểm đến mới và trải nghiệm văn hóa địa phương."
      - Nút hành động: "Chỉnh sửa hồ sơ" (kèm modal cập nhật thông tin họ tên, email, sđt, bio).
      - 4 Ô chỉ số thống kê:
        1. 12 Chuyến đi (CalendarDays icon xanh).
        2. 28 Địa điểm yêu thích (Heart icon đỏ).
        3. 8 Đánh giá (Star icon vàng kim).
        4. Hạng Thành viên Staya Club (Crown icon vàng).
    - **2. Thẻ ưu đãi độc quyền (ProfilePromoBanner):**
      - Nền vàng cam ấm nhạt #FFF9EE, viền vàng #FDE68A.
      - Icon hộp quà Gift cam, tiêu đề "Còn nhiều ưu đãi dành riêng cho bạn!", nút "Xem ưu đãi →".
    - **3. Chuyến đi sắp tới (ProfileUpcomingTrip):**
      - Header: Calendar icon + "Chuyến đi sắp tới" + link "Xem tất cả →".
      - Thẻ hành trình ngang: Ảnh bãi biển Phú Quốc, huy hiệu "● Sắp diễn ra" xanh ngọc, tên "Phú Quốc – Biển xanh, nắng vàng", thời gian 15/06/2025 - 18/06/2025, 2 người, Cặp đôi / Honeymoon.
      - 2 Nút hành động: "Xem chi tiết" (mở modal lịch trình & mã đặt chỗ) và "Quản lý đặt dịch vụ".
    - **4. Chuyến đi đã qua (ProfilePastTrips):**
      - Header: Clock icon + "Chuyến đi đã qua" + link "Xem tất cả →".
      - Lưới 3 thẻ: Sunset Sanato, Khám phá Hòn Thơm, Chợ đêm Dương Đông kèm ngày tháng và địa điểm Phú Quốc.
    - **5. Địa điểm yêu thích (ProfileFavorites):**
      - Header: Heart icon + "Địa điểm yêu thích" + link "Xem tất cả →".
      - Lưới 4 thẻ: Bãi Sao, Hòn Thơm, VinWonders Phú Quốc, Grand World.
      - Mỗi thẻ có nút trái tim đỏ ở góc trên phải cho phép tương tác toggle yêu thích.
    - **6. Thẻ nâng tầm hội viên Staya Club (ProfileStayaClubBanner):**
      - Nền xanh dịu #EEF5FC, viền #D8E6F8, icon vương miện hoàng gia vàng, nút "Khám phá ngay →" mở modal đặc quyền hội viên.

### 16.2 Danh sách Components đã tạo
- `profile-hero-banner.tsx`: Ảnh bìa toàn cảnh Phú Quốc, lời chào, slogan, chữ ký thư pháp uốn lượn và nút chỉnh sửa ảnh bìa.
- `profile-sidebar.tsx`: Sidebar 12 mục menu tài khoản người dùng, quản lý tab active, badge đếm và hover effect.
- `profile-user-card.tsx`: Thẻ thông tin cá nhân, avatar, camera badge, huy hiệu Staya Club, nút chỉnh sửa hồ sơ và 4 ô chỉ số thống kê.
- `profile-promo-banner.tsx`: Thẻ thông báo ưu đãi dành riêng với icon quà tặng và nút CTA.
- `profile-upcoming-trip.tsx`: Thẻ chuyến đi sắp tới với badge trạng thái và các nút hành động.
- `profile-past-trips.tsx`: Khung 3 chuyến đi đã qua dạng lưới responsive.
- `profile-favorites.tsx`: Khung 4 địa điểm yêu thích có nút heart badge.
- `profile-staya-club-banner.tsx`: Banner VIP Staya Club ở chân trang dashboard.
- `profile-page.tsx`: Điều phối toàn bộ trang cá nhân, tích hợp 6 modal chức năng và thông báo toast.

### 16.3 Tích hợp Routes & Luồng chuyển tiếp
- Hỗ trợ các hash routes: `#profile`, `#trang-ca-nhan`, `#tai-khoan`, `#account`.
- Khi người dùng đăng nhập hoặc đăng ký thành công trên màn hình Auth (`#login`, `#register`), hệ thống tự động chuyển tiếp mượt mà sang Trang cá nhân (`#profile`).
- Header tự động kích hoạt chế độ đăng nhập hiển thị chuông thông báo và avatar người dùng khi ở trang cá nhân.

### 16.4 Kết quả kiểm tra chất lượng
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 warnings, 0 errors trên 184 files.
- Trình duyệt: Đã kiểm tra trực quan giao diện trên http://localhost:8080/#profile bằng subagent và snapshot màn hình.


## 17. Màn hình Quản lý Đơn đặt dịch vụ (Bookings Management)

### 17.1 Phân tích thiết kế tham chiếu & Thiết lập giao diện
- **Header & Navbar:**
  - Trạng thái người dùng đã đăng nhập: Logo STAYEA, 10 mục menu thương hiệu, cụm Search + Bell thông báo (badge đỏ "3") + Avatar tròn người dùng "Nguyễn Minh" với dropdown menu.
- **Hero Cover Banner:**
  - Ảnh bìa toàn cảnh Phú Quốc, tiêu đề nổi bật: "Đơn đặt dịch vụ", phụ đề: "Quản lý các chuyến đi, đặt phòng và trải nghiệm của bạn tại STAYEA", chữ ký thư pháp uốn lượn trắng "More Than a Trip ♡".
- **Bố cục 2 cột (Main 2-Column Grid Layout):**
  - **Cột trái:** Sidebar 12 mục menu tài khoản người dùng, mục "Đơn đặt dịch vụ" ở trạng thái Active (#EBF3FC, chữ xanh navy #0A2239).
  - **Cột phải (Khu vực Đơn đặt dịch vụ):**
    - **Header bar:** Tiêu đề "Đơn đặt dịch vụ", mô tả chi tiết và nút "Đặt dịch vụ mới →" (#0A2239).
    - **Thanh Filter Tabs:** 5 Tab phân loại (Tất cả: 5, Lưu trú: 2, Trải nghiệm: 2, Di chuyển: 1, Đã hủy: 0) với kiểu nút pill bo góc thanh lịch.
    - **Danh sách 5 đơn hàng (Booking Cards List):**
      1. Premier Residences Phu Quoc Emerald Bay (Lưu trú, Sắp diễn ra, 15/06 - 18/06/2025, 7.500.000đ, Quản lý đặt phòng / Liên hệ hỗ trợ).
      2. Lặn ngắm san hô tại Hòn Thơm (Trải nghiệm, Sắp diễn ra, 16/06/2025, 1.200.000đ, Xem voucher / Liên hệ hỗ trợ).
      3. Vé máy bay Vietjet Air (Di chuyển, Đã hoàn thành, Hà Nội -> Phú Quốc, 4.800.000đ, Xem chi tiết / Đặt lại).
      4. Sunset Sanato (Trải nghiệm, Đã hoàn thành, 12/04/2025, 800.000đ, Đánh giá / Đặt lại).
      5. Tour ẩm thực chợ đêm Dương Đông (Trải nghiệm, Đã hoàn thành, 13/04/2025, 1.000.000đ, Đánh giá / Đặt lại).
    - **Thanh phân trang (Pagination):** Nút lùi, nút số trang 1 (active navy), nút trang 2, nút tiến.
    - **Banner hỗ trợ 24/7:** Nền xanh dịu #EEF5FC, icon tai nghe Headphones, tiêu đề "Cần hỗ trợ về đơn đặt dịch vụ?", phụ đề và nút "Liên hệ hỗ trợ →".
- **Footer:** Footer STAYEA hoàn chỉnh.

### 17.2 Danh sách Components đã tạo
- `bookings-hero-banner.tsx`: Hero banner tiêu đề, phụ đề và chữ ký thư pháp uốn lượn.
- `bookings-tabs.tsx`: Thanh tab lọc 5 danh mục đơn hàng với số lượng đếm động.
- `booking-card.tsx`: Component hiển thị chi tiết từng đơn hàng, hỗ trợ đa dạng loại dịch vụ (lưu trú, trải nghiệm biển, vé máy bay, ẩm thực) và các nút thao tác tương ứng.
- `bookings-support-banner.tsx`: Khung banner trợ giúp 24/7 về đơn hàng với CTA hotline.
- `bookings-page.tsx`: Component trang tổng hợp điều phối toàn bộ màn hình, tích hợp lọc danh mục real-time, phân trang, và 4 modal tương tác (Xem chi tiết đơn, Quản lý đặt phòng, E-Voucher điện tử có mã QR, Chấm sao & Gửi đánh giá).

### 17.3 Tích hợp Routes & Luồng chuyển tiếp
- Hỗ trợ các hash routes: `#bookings`, `#don-dat-dich-vu`, `#don-hang`, `#orders`.
- Kết nối 2 chiều giữa Trang cá nhân (`#profile`) và Đơn đặt dịch vụ (`#bookings`) thông qua Sidebar và Header User Menu.

### 17.4 Kết quả kiểm tra chất lượng
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 warnings, 0 errors trên 189 files.
- Trình duyệt: Đã kiểm tra trực quan giao diện trên http://localhost:8080/#bookings bằng subagent và snapshot màn hình.


---

## 18. MÀN HÌNH "ĐẶT DỊCH VỤ MỚI" (NEW SERVICE BOOKING / CATALOG HUB)

### 18.1 Phân tích thiết kế tham chiếu & Thiết lập giao diện
- **Header & Navbar:**
  - Trạng thái người dùng đã đăng nhập: Logo STAYEA kèm slogan *"MORE THAN A STAY"*, 10 mục menu chính, thanh Search, Bell thông báo với huy hiệu số `3`, Avatar tròn "Nguyễn Minh" cùng dropdown menu.
- **Hero Cover Banner (`new-booking-hero-banner.tsx`):**
  - Ảnh panorama vịnh biển nhiệt đới Phú Quốc.
  - Tiêu đề chính: "**Bắt đầu hành trình mới cùng STAYEA**".
  - Phụ đề: "Khám phá Phú Quốc theo cách của riêng bạn".
  - Chữ ký nghệ thuật uốn lượn trắng góc phải: "*More Than a Trip ♡*".
- **Bố cục 2 cột (Main 2-Column Responsive Layout):**
  - **Cột trái:** `ProfileSidebar` 12 mục menu tài khoản người dùng, mục "Đơn đặt dịch vụ" ở trạng thái Active (`#EBF3FC`, chữ xanh navy `#0A2239`), ẩn huy hiệu số (hideBadges) chuẩn xác theo ảnh thiết kế.
  - **Cột phải (Khu vực Đặt dịch vụ mới):**
    - **Header bar & Promo Staya Club (`new-booking-header-and-promo.tsx`):**
      - Bên trái: Tiêu đề "**Đặt dịch vụ mới**" và phụ đề "*Chọn dịch vụ bạn muốn đặt cho hành trình tiếp theo tại STAYEA.*".
      - Bên phải: Thẻ ưu đãi hội viên "**Ưu đãi thành viên Staya Club**" với vương miện vàng (Crown), phụ đề đặc quyền, nút "**Khám phá ngay →**" và hình ảnh hộp quà sang trọng.
    - **Thanh Filter Tabs & Tìm kiếm (`new-booking-toolbar.tsx`):**
      - 5 Tab phân loại: "Tất cả" (active navy `#0A2239`), "Lưu trú" (icon Home), "Trải nghiệm" (icon Umbrella), "Gói" (icon Gift), "Di chuyển" (icon Car).
      - Ô tìm kiếm từ khóa trực tiếp "Tìm dịch vụ..." với icon Search.
    - **Lưới 4 Danh mục Dịch vụ Cốt lõi (2x2 Grid) (`new-booking-category-grid.tsx`):**
      1. **Lưu trú:** Ảnh biệt thự nghỉ dưỡng hướng biển, huy hiệu tròn icon Home nổi, phụ đề "Biệt thự, căn hộ, khách sạn và homestay tuyển chọn.", nút CTA "Đặt lưu trú →" (chuyển hướng `#stay`).
      2. **Trải nghiệm:** Ảnh lặn biển san hô và đàn cá rạn nhiệt đới, huy hiệu tròn icon Umbrella, phụ đề "Tour, hoạt động biển, ẩm thực và khám phá địa phương.", nút CTA "Đặt trải nghiệm →" (chuyển hướng `#experience`).
      3. **Gói hành trình:** Ảnh hoàng hôn trên núi biển, huy hiệu tròn icon Gift, phụ đề "Combo trọn gói tiết kiệm cho kỳ nghỉ hoàn hảo.", nút CTA "Xem gói →" (chuyển hướng `#packages`).
      4. **Di chuyển:** Ảnh ghép đôi máy bay Vietjet và xe Mercedes đưa đón VIP, huy hiệu tròn icon Car, phụ đề "Vé máy bay, tàu cao tốc, thuê xe và xe đưa đón.", nút CTA "Đặt di chuyển →" (chuyển hướng `#transport`).
    - **Chuyên mục "Gợi ý dành cho bạn" (`new-booking-recommendations.tsx`):**
      - Tiêu đề mục "Gợi ý dành cho bạn", phụ đề và link "Xem tất cả →".
      - Lưới 4 thẻ dịch vụ tiêu biểu:
        1. **Premier Residences Phu Quoc Emerald Bay** | 4.8 (320 đánh giá) | Bãi Khem, Phú Quốc | 7.500.000đ / 3 đêm | Nút "Xem chi tiết →".
        2. **Tour 3 đảo Phú Quốc** | 4.7 (218 đánh giá) | Hòn Thơm, Phú Quốc | 1.200.000đ / người | Nút "Xem chi tiết →".
        3. **Vé máy bay Vietjet Air** | 4.6 (156 đánh giá) | Hà Nội (HAN) ➔ Phú Quốc (PQC) | 4.800.000đ / vé | Nút "Xem chi tiết →".
        4. **Xe đưa đón sân bay** | 4.9 (98 đánh giá) | Sân bay Phú Quốc (PQC) | 350.000đ / xe | Nút "Xem chi tiết →".
      - Mỗi thẻ đều có nút tim yêu thích (Favorite Heart Toggle) góc trên bên phải ảnh.
- **Footer:** `StayeaFooter` hoàn chỉnh.

### 18.2 Danh sách Components đã tạo
- `new-booking-hero-banner.tsx`: Banner tiêu đề hành trình mới kèm chữ ký uốn lượn.
- `new-booking-header-and-promo.tsx`: Tiêu đề trang kết hợp thẻ quảng bá đặc quyền hội viên Staya Club.
- `new-booking-toolbar.tsx`: Thanh tab phân loại 5 danh mục kết hợp ô tìm kiếm tức thì.
- `new-booking-category-grid.tsx`: Lưới 4 thẻ dịch vụ cốt lõi (2x2) với huy hiệu tròn nổi và nút đặt trực tiếp.
- `new-booking-recommendations.tsx`: Lưới 4 gợi ý dịch vụ phổ biến có xếp hạng sao, địa điểm, mức giá và nút tương tác xem chi tiết.
- `new-booking-page.tsx`: Component trang tổng hợp điều phối giao diện, lọc thời gian thực, quản lý yêu thích, popup chi tiết dịch vụ và kích hoạt hội viên.

### 18.3 Tích hợp Routes & Luồng chuyển tiếp
- Hỗ trợ các hash routes: `#new-booking`, `#dat-dich-vu-moi`, `#dat-dich-vu`.
- Nút CTA "Đặt dịch vụ mới" từ màn hình Đơn đặt dịch vụ (`#bookings`) chuyển tiếp mượt mà sang `#new-booking`.
- Các nút trên thẻ dịch vụ điều hướng trực tiếp đến các trang danh mục tương ứng (`#stay`, `#experience`, `#packages`, `#transport`).

### 18.4 Kết quả kiểm tra chất lượng
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 warnings, 0 errors trên 195 files.
- Trình duyệt: Đã kiểm tra trực quan giao diện trên http://localhost:8080/#new-booking bằng browser subagent và đối chiếu ảnh màn hình khớp 100% bố cục và phong cách thiết kế tham chiếu.

---

## 19. Màn hình Kế hoạch của tôi (My Plans / Itinerary Management - Route `#plans`)

### 19.1 Phân tích Thiết kế & Bố cục Giao diện
- **Header:** Giữ nguyên `StayeaHeader` đã đăng nhập của Nguyễn Minh với avatar, chuông thông báo có badge đỏ (3), icon tìm kiếm và toàn bộ menu điều hướng.
- **Hero Banner (`my-plans-hero-banner.tsx`):**
  - Chiều cao ~140px - 170px với nền ảnh đảo ngọc biển xanh hàng dừa `/profile/profile-hero-banner.jpg` phủ gradient đen/xanh navy nhẹ bảo đảm độ tương phản.
  - Bên trái: Tiêu đề H1 "**Kế hoạch của tôi**" (font Outfit/Inter, chữ trắng đậm) và dòng phụ đề "*Biến những chuyến đi thành kỷ niệm đáng nhớ*".
  - Bên phải: Chữ nghệ thuật màu trắng nét mảnh viết tay "*More Than a Trip ♡*".
- **Bố cục 2 cột (Desktop Layout 12-column Grid):**
  - **Cột trái (Sidebar cố định ~288px):** Sử dụng `ProfileSidebar` với mục active là "**Kế hoạch của tôi**" (icon clipboard-list, highlight xanh nhạt `#EBF3FC`, text navy đậm `#0A2239`). Tùy chọn `hideBadges` để đồng bộ ảnh mẫu.
  - **Cột phải (Khu vực Quản lý Kế hoạch & Lịch trình):**
    - **Header & 4 Tab Trạng thái (`my-plans-header-and-tabs.tsx`):**
      - Header bar: Tiêu đề "**Kế hoạch của tôi**", phụ đề "*Quản lý lịch trình, dịch vụ và những điều bạn mong muốn cho các chuyến đi cùng STAYEA.*", và nút CTA "**Tạo kế hoạch mới +**" màu navy đậm góc phải.
      - 4 Tab trạng thái chuyến đi:
        1. "**Chuyến đi sắp tới (2)**" (Active: nền navy `#0A2239`, chữ trắng).
        2. "**Chuyến đi đã qua (3)**".
        3. "**Kế hoạch nháp (1)**".
        4. "**Danh sách mong muốn**".
    - **Lưới Thẻ Chuyến đi Nổi bật (`my-plans-trip-cards.tsx`):**
      - 2 cột thẻ ngang sang trọng bo góc 2xl:
        1. **Phú Quốc – Biển xanh, nắng vàng:** Badge xanh lục nhạt "*Sắp diễn ra*", menu "...", ngày 15/06/2025 - 18/06/2025 (4 ngày), địa điểm Phú Quốc (PQC), 2 người, nút "**Xem chi tiết →**".
        2. **Khám phá Hòn Thơm:** Badge xanh lam nhạt "*Đang lên kế hoạch*", menu "...", ngày 12/08/2025 - 14/08/2025 (3 ngày), địa điểm Phú Quốc (PQC), 2 người, nút "**Tiếp tục lên kế hoạch →**".
    - **Khung Chi tiết Lịch trình Hoạt động (`my-plans-active-itinerary.tsx`):**
      - Header: Icon máy bay cất cánh, tên chuyến đi "**Phú Quốc – Biển xanh, nắng vàng**", khoảng thời gian 15/06/2025 - 18/06/2025 (4 ngày).
      - Nhóm 3 nút thao tác: "**Chia sẻ**" (Share2), "**Tải lịch trình (PDF)**" (Download), "**Chỉnh sửa**" (Edit3).
      - Thanh 5 Tab nội bộ: "**Tổng quan**" (active navy), "**Lịch trình chi tiết**", "**Dịch vụ đã đặt**", "**Chi phí dự kiến**", "**Ghi chú**".
      - Bố cục 2 phần:
        - Bên trái (~320px): Ảnh phong cảnh biển Bãi Sao, trích dẫn truyền cảm hứng “*Một hành trình tuyệt vời đang chờ đón!*” và nút CTA lớn có viền mềm "**Xem bản đồ hành trình**" (icon BookOpen/Map).
        - Bên phải (Timeline dọc): Tiêu đề "*Lịch trình tóm tắt*", trục kết nối thời gian thẳng đứng qua 4 mốc ngày:
          - Ngày 1 (15/06): Icon Plane - **Đến Phú Quốc** | Đón sân bay, nhận phòng khách sạn | Nút "*Xem chi tiết →*".
          - Ngày 2 (16/06): Icon Umbrella/Waves - **Khám phá Bãi Sao** | Tắm biển, chụp ảnh, thư giãn | Nút "*Xem chi tiết →*".
          - Ngày 3 (17/06): Icon Anchor/Fish - **Lặn ngắm san hô Hòn Thơm** | Trải nghiệm thế giới đại dương | Nút "*Xem chi tiết →*".
          - Ngày 4 (18/06): Icon ShoppingBag - **Mua sắm & trở về** | Mua đặc sản, trả phòng, di chuyển ra sân bay | Nút "*Xem chi tiết →*".
    - **Danh sách Dịch vụ Đã đặt (`my-plans-booked-services.tsx`):**
      - Tiêu đề mục icon Calendar "**Dịch vụ đã đặt (4)**", link điều hướng "**Xem tất cả →**".
      - Lưới 4 thẻ dịch vụ ngang 4 cột (responsive 1-2-4):
        1. **Premier Residences Phu Quoc Emerald Bay** | Badge xanh ngọc "*Đã xác nhận*" | Ngày 15/06 - 18/06/2025 | Lưu trú | Nút "*Xem chi tiết*".
        2. **Vietjet Air – VJ458** | Badge "*Đã xác nhận*" | Hà Nội ➔ Phú Quốc | Ngày 15/06/2025 | Vé máy bay | Nút "*Xem chi tiết*".
        3. **Tour lặn ngắm san hô Hòn Thơm** | Badge "*Đã xác nhận*" | Ngày 17/06/2025 | Trải nghiệm | Nút "*Xem chi tiết*".
        4. **Xe đưa đón sân bay** | Badge "*Đã xác nhận*" | Ngày 15/06/2025 | Di chuyển | Nút "*Xem chi tiết*".
    - **Chuyên mục Gợi ý Bổ sung (`my-plans-recommended-addons.tsx`):**
      - Tiêu đề mục icon Heart "**Gợi ý bổ sung cho chuyến đi của bạn**" kèm nút mũi tên carousel phải `>`.
      - Lưới 4 thẻ điểm đến / hoạt động hấp dẫn kèm nút tim yêu thích:
        1. **Sunset Sanato** | Dương Đông, Phú Quốc | ⭐ 4.6 (1.2k đánh giá) | Nút "*Thêm vào kế hoạch →*".
        2. **VinWonders Phú Quốc** | Bãi Dài, Phú Quốc | ⭐ 4.7 (3.5k đánh giá) | Nút "*Thêm vào kế hoạch →*".
        3. **Tour ẩm thực chợ đêm** | Chợ đêm Dương Đông | ⭐ 4.5 (892 đánh giá) | Nút "*Thêm vào kế hoạch →*".
        4. **Grand World** | Gành Dầu, Phú Quốc | ⭐ 4.6 (1.1k đánh giá) | Nút "*Thêm vào kế hoạch →*".
- **Footer:** `StayeaFooter` hoàn chỉnh.

### 19.2 Danh sách Components đã tạo
- `my-plans-hero-banner.tsx`: Banner tiêu đề "Kế hoạch của tôi" với slogan và chữ ký nghệ thuật "More Than a Trip ♡".
- `my-plans-header-and-tabs.tsx`: Tiêu đề trang, nút "Tạo kế hoạch mới +" và 4 tab lọc trạng thái chuyến đi.
- `my-plans-trip-cards.tsx`: Lưới 2 thẻ chuyến đi nổi bật với badge trạng thái và nút CTA xem chi tiết.
- `my-plans-active-itinerary.tsx`: Khung lịch trình chuyến đi đang chọn với 3 nút chức năng (Chia sẻ, Tải PDF, Chỉnh sửa), 5 sub-tab, card ảnh Bãi Sao + nút mở bản đồ và timeline dọc 4 ngày chi tiết.
- `my-plans-booked-services.tsx`: Lưới 4 thẻ dịch vụ đã đặt (Khách sạn, Vé máy bay, Tour, Xe đưa đón) với badge "Đã xác nhận".
- `my-plans-recommended-addons.tsx`: Lưới 4 gợi ý hoạt động bổ sung kèm nút tim yêu thích, xếp hạng sao và nút "Thêm vào kế hoạch →".
- `my-plans-page.tsx`: Component trang tổng hợp điều phối giao diện, tích hợp `ProfileSidebar`, 5 modal tương tác (Tạo kế hoạch, Bản đồ hành trình, Chi tiết ngày, Chia sẻ lịch trình, Chi tiết dịch vụ) và toast thông báo.

### 19.3 Tích hợp Routes & Luồng tương tác
- Hỗ trợ các hash routes: `#plans`, `#ke-hoach`, `#ke-hoach-cua-toi`, `#my-plans`.
- Đồng bộ chuyển tiếp hai chiều giữa Sidebar các trang cá nhân (`#profile`, `#bookings`, `#new-booking`, `#plans`).
- Modal "Tạo kế hoạch mới" cho phép nhập tên chuyến đi, chọn ngày đi/về, số lượng khách và tạo mới tức thì vào danh sách.
- Modal "Bản đồ hành trình Phú Quốc" hiển thị lộ trình chi tiết từng ngày, danh sách điểm dừng và thời gian di chuyển.
- Modal "Chi tiết ngày hành trình" và "Chi tiết dịch vụ đã đặt" cung cấp thông tin chuyên sâu.

### 19.4 Kết quả kiểm tra chất lượng
- TypeScript Typecheck: `tsc -b --noEmit` -> 0 errors.
- Linter Oxlint: `oxlint` -> 0 warnings, 0 errors trên 202 files.
- Trình duyệt: Đã kiểm tra trực quan giao diện trên http://localhost:8080/#plans bằng browser subagent và đối chiếu ảnh màn hình khớp 100% bố cục và phong cách thiết kế tham chiếu.

---

## 20. Màn hình Yêu thích (Favorites / Wishlist - Route `#favorites`)

### 20.1 Phân tích Thiết kế & Bố cục Giao diện
- **Header:** Giữ nguyên `StayeaHeader` trạng thái đã đăng nhập của Nguyễn Minh với avatar, chuông thông báo có badge đỏ (3), icon tìm kiếm và toàn bộ menu điều hướng.
- **Hero Banner (`favorites-hero-banner.tsx`):**
  - Chiều cao ~220px - 270px với nền ảnh đảo ngọc biển xanh hàng dừa `/profile/profile-hero-banner.jpg` phủ gradient đen/xanh navy nhẹ bảo đảm độ tương phản.
  - Bên trái: Tiêu đề H1 "**Yêu thích**" (font Outfit/Inter, chữ trắng đậm) và dòng phụ đề "*Những chuyến đi, dịch vụ và trải nghiệm bạn quan tâm tại STAYEA*".
  - Bên phải: Chữ nghệ thuật màu trắng nét mảnh viết tay "*More Than a Trip ♡*".
- **Bố cục 2 cột (Desktop Layout 12-column Grid):**
  - **Cột trái (Sidebar cố định ~288px):** Sử dụng `ProfileSidebar` với mục active là "**Yêu thích**" (icon heart, highlight xanh nhạt `#EBF3FC`, text navy đậm `#0A2239`). Tùy chọn `hideBadges` để đồng bộ ảnh mẫu.
  - **Cột phải (Khu vực Quản lý Yêu thích & Danh sách dịch vụ đã lưu):**
    - **Header Bar & 4 Tab Lọc (`favorites-header-and-tabs.tsx`):**
      - Header bar: Tiêu đề icon tim đỏ "**❤️ Yêu thích**", phụ đề "*Các dịch vụ, điểm đến và trải nghiệm bạn đã lưu. Dễ dàng xem lại và lên kế hoạch cho chuyến đi tiếp theo.*", và nút "**Quản lý yêu thích**" viền mảnh tinh tế góc phải.
      - 4 Tab phân loại (hiển thị số lượng động):
        1. "**Tất cả (5)**" (Active: nền navy `#0A2239`, chữ trắng).
        2. "**Lưu trú (1)**".
        3. "**Trải nghiệm (3)**".
        4. "**Di chuyển (1)**".
    - **Lưới 5 Thẻ Dịch vụ Yêu thích (3 Cột) (`favorites-grid.tsx`):**
      - Thẻ 1: **Phú Quốc – Biển xanh, nắng vàng** | Badge xanh lục "*Trải nghiệm*" | Nút tim đỏ góc phải | ⭐ 4.8 (320 đánh giá) | 📅 15/06/2025 - 18/06/2025 (4 ngày) | 📍 Phú Quốc (PQC) | 👥 2 - 10 người | Giá: **7.500.000đ** / người | Nút "*Xem chi tiết →*" & "*Bỏ khỏi yêu thích*".
      - Thẻ 2: **Premier Residences Phu Quoc Emerald Bay** | Badge tím "*Lưu trú*" | Nút tim đỏ | ⭐ 4.8 (320 đánh giá) | 📅 15/06/2025 - 18/06/2025 (3 đêm) | 📍 Bãi Khem, Phú Quốc (PQC) | 🛏️ Phòng Deluxe Ocean View | Giá: **2.000.000đ** / đêm | Nút "*Xem chi tiết →*" & "*Bỏ khỏi yêu thích*".
      - Thẻ 3: **Khám phá Hòn Thơm** | Badge xanh lam "*Trải nghiệm*" | Nút tim đỏ | ⭐ 4.7 (218 đánh giá) | 📅 12/08/2025 - 14/08/2025 (3 ngày) | 📍 Phú Quốc (PQC) | 👥 2 người | Giá: **1.200.000đ** / người | Nút "*Xem chi tiết →*" & "*Bỏ khỏi yêu thích*".
      - Thẻ 4: **Vé máy bay Vietjet Air** | Badge vàng hổ phách "*Di chuyển*" | Nút tim đỏ | ⭐ 4.6 (156 đánh giá) | 📅 15/06/2025 | 📍 Hà Nội (HAN) → Phú Quốc (PQC) | 🎫 Hạng phổ thông | Giá: **4.800.000đ** / vé | Nút "*Xem chi tiết →*" & "*Bỏ khỏi yêu thích*".
      - Thẻ 5: **Tour lặn ngắm san hô Hòn Thơm** | Badge xanh lục "*Trải nghiệm*" | Nút tim đỏ | ⭐ 4.5 (892 đánh giá) | 📅 17/06/2025 | 📍 Hòn Thơm, Phú Quốc | 👥 2 người | Giá: **1.000.000đ** / người | Nút "*Xem chi tiết →*" & "*Bỏ khỏi yêu thích*".
    - **Banner Kêu gọi Khám phá Thêm (`favorites-discovery-banner.tsx`):**
      - Nền xanh nhạt `#EDF4FB`, viền mềm, icon tim đỏ nổi bật, tiêu đề "**Khám phá thêm những trải nghiệm yêu thích khác**", mô tả và nút CTA "**Khám phá ngay →**" (điều hướng sang `#new-booking`).
- **Footer:** `StayeaFooter` hoàn chỉnh.

### 20.2 Danh sách Components đã tạo
- `favorites-hero-banner.tsx`: Banner tiêu đề "Yêu thích" với slogan và chữ ký nghệ thuật "More Than a Trip ♡".
- `favorites-header-and-tabs.tsx`: Tiêu đề trang với icon tim đỏ, nút "Quản lý yêu thích" và 4 tab lọc danh mục.
- `favorites-grid.tsx`: Lưới 3 cột thẻ dịch vụ yêu thích với badge danh mục, tim đỏ, xếp hạng sao, thông tin ngày/địa điểm/số lượng, giá tiền và 2 nút hành động (Xem chi tiết / Bỏ khỏi yêu thích).
- `favorites-discovery-banner.tsx`: Banner chân trang kêu gọi khám phá thêm trải nghiệm mới với nút "Khám phá ngay →".
- `favorites-page.tsx`: Component trang tổng hợp điều phối giao diện, tích hợp `ProfileSidebar`, quản lý danh sách yêu thích thời gian thực, hoàn tác khi xóa và 2 modal tương tác (Quản lý yêu thích & Chi tiết dịch vụ).

### 20.3 Tích hợp Routes & Luồng tương tác
- Hỗ trợ các hash routes: `#favorites`, `#yeu-thich`, `#wishlist`, `#saved`.
- Đồng bộ chuyển tiếp hai chiều giữa Sidebar các trang cá nhân (`#profile`, `#bookings`, `#new-booking`, `#plans`, `#favorites`).
- Tương tác "Bỏ khỏi yêu thích": Loại bỏ mục khỏi danh sách, cập nhật số lượng tức thì trên tab và hiển thị Toast có nút "Hoàn tác" để khôi phục nhanh.
- Modal "Quản lý yêu thích": Hỗ trợ sao chép link chia sẻ, khôi phục danh sách mẫu 5 mục và làm trống danh sách.
- Modal "Chi tiết mục yêu thích": Xem nhanh thông tin, giá cả và nút chuyển hướng đến danh mục dịch vụ.

---

## 21. Màn hình Đánh giá của tôi (My Reviews / Feedback Management - Route `#reviews`)

### 21.1 Phân tích Thiết kế & Bố cục Giao diện
- **Header:** Giữ nguyên `StayeaHeader` trạng thái đã đăng nhập của Nguyễn Minh với avatar, chuông thông báo có badge đỏ (3), icon tìm kiếm và toàn bộ menu điều hướng.
- **Hero Banner (`my-reviews-hero-banner.tsx`):**
  - Chiều cao ~220px - 270px với nền ảnh đảo ngọc biển xanh hàng dừa `/profile/profile-hero-banner.jpg` phủ gradient đen/xanh navy nhẹ bảo đảm độ tương phản.
  - Bên trái: Tiêu đề H1 "**Đánh giá của tôi**" (font Outfit/Inter, chữ trắng đậm) và dòng phụ đề "*Những trải nghiệm đáng nhớ, được chia sẻ từ chính bạn*".
  - Bên phải: Chữ nghệ thuật màu trắng nét mảnh viết tay "*More Than a Trip ♡*".
- **Bố cục 2 cột (Desktop Layout 12-column Grid):**
  - **Cột trái (Sidebar cố định ~288px):** Sử dụng `ProfileSidebar` với mục active là "**Đánh giá của tôi**" (icon star, highlight xanh nhạt `#EBF3FC`, text navy đậm `#0A2239`). Tùy chọn `hideBadges` để đồng bộ ảnh mẫu.
  - **Cột phải (Khu vực Quản lý Đánh giá):**
    - **Header Bar & Thẻ Tổng kết Điểm đánh giá (`my-reviews-header-and-score.tsx`):**
      - Header: Tiêu đề "**Đánh giá của tôi**" và phụ đề "*Quản lý những đánh giá bạn đã chia sẻ về hành trình, lưu trú và trải nghiệm cùng STAYEA.*".
      - Thẻ tóm tắt điểm đánh giá góc phải: Icon sao vàng ⭐ lớn, điểm trung bình "**4.8** / 5", phụ đề "*Từ 8 đánh giá*", vách ngăn dọc và lời cảm ơn: "*Cảm ơn bạn đã chia sẻ những trải nghiệm tuyệt vời!*".
    - **Thanh Công cụ Phân loại & Sắp xếp (`my-reviews-toolbar.tsx`):**
      - 5 Tab phân loại hiển thị số lượng thực tế:
        1. "**Tất cả (8)**" (Active: nền navy `#0A2239`, chữ trắng).
        2. "**Lưu trú (2)**".
        3. "**Trải nghiệm (3)**".
        4. "**Di chuyển (2)**".
        5. "**Ẩm thực (1)**".
      - Nút / Dropdown sắp xếp góc phải: Icon `⇅`, lựa chọn "**Mới nhất**" (hỗ trợ sắp xếp theo Mới nhất, Cũ nhất, Đánh giá cao nhất, Đánh giá thấp nhất).
    - **Danh sách Đánh giá Dạng Thẻ Ngang (`my-reviews-list.tsx`):**
      - Thẻ 1: **Premier Residences Phu Quoc Emerald Bay** | Badge xanh "*Đã đánh giá*" | 📅 15/06/2025 | 📍 Bãi Khem, Phú Quốc | ⭐⭐⭐⭐⭐ **5.0** | Tag "*Khách sạn*" | Nhận xét chi tiết về phòng đẹp, view biển và dịch vụ chuyên nghiệp | 2 nút: "*Xem chi tiết →*" & "*✏️ Chỉnh sửa đánh giá*".
      - Thẻ 2: **Tour lặn ngắm san hô Hòn Thơm** | Badge "*Đã đánh giá*" | 📅 17/06/2025 | 📍 Hòn Thơm, Phú Quốc | ⭐⭐⭐⭐⭐ **4.8** | Tag "*Trải nghiệm*" | Nhận xét về nước trong, san hô đa dạng, hướng dẫn viên nhiệt tình | 2 nút: "*Xem chi tiết →*" & "*✏️ Chỉnh sửa đánh giá*".
      - Thẻ 3: **Xe đưa đón sân bay** | Badge "*Đã đánh giá*" | 📅 12/08/2025 | 📍 Phú Quốc | ⭐⭐⭐⭐⭐ **4.9** | Tag "*Di chuyển*" | Nhận xét về tài xế đúng giờ, xe sạch sẽ và thân thiện | 2 nút: "*Xem chi tiết →*" & "*✏️ Chỉnh sửa đánh giá*".
      - Thẻ 4: **Sunset Sanato** | Badge "*Đã đánh giá*" | 📅 10/06/2025 | 📍 Dương Đông, Phú Quốc | ⭐⭐⭐⭐⭐ **4.7** | Tag "*Trải nghiệm*" | Nhận xét về hoàng hôn ấn tượng và không gian nghệ thuật | 2 nút: "*Xem chi tiết →*" & "*✏️ Chỉnh sửa đánh giá*".
    - **Banner Kêu gọi Chia sẻ Thêm Trải nghiệm (`my-reviews-cta-banner.tsx`):**
      - Nền xanh nhạt `#EDF4FB`, viền mềm, icon tim đỏ nổi bật, tiêu đề "**Chia sẻ thêm trải nghiệm của bạn**", mô tả truyền cảm hứng cho du khách và nút CTA nổi bật "**Viết đánh giá mới →**" (màu navy `#0A2239`).
- **Footer:** `StayeaFooter` hoàn chỉnh.

### 21.2 Danh sách Components đã tạo
- `my-reviews-hero-banner.tsx`: Banner tiêu đề "Đánh giá của tôi" với slogan và chữ ký nghệ thuật "More Than a Trip ♡".
- `my-reviews-header-and-score.tsx`: Tiêu đề trang kết hợp widget tóm tắt điểm trung bình 4.8/5 và lời cảm ơn.
- `my-reviews-toolbar.tsx`: Thanh tab phân loại 5 danh mục kết hợp menu sắp xếp đa tiêu chí (Mới nhất, Cũ nhất, Cao nhất, Thấp nhất).
- `my-reviews-list.tsx`: Danh sách thẻ đánh giá ngang đầy đủ thumbnail, badge đã đánh giá, sao vàng, nhận xét và 2 nút hành động (Xem chi tiết / Chỉnh sửa đánh giá).
- `my-reviews-cta-banner.tsx`: Banner chân trang kêu gọi đánh giá mới với nút "Viết đánh giá mới →".
- `my-reviews-page.tsx`: Component trang tổng hợp điều phối giao diện, tích hợp `ProfileSidebar`, quản lý danh sách đánh giá, 3 modal tương tác (Chỉnh sửa đánh giá, Viết đánh giá mới, Chi tiết đánh giá) và thông báo Toast.

### 21.3 Tích hợp Routes & Luồng tương tác
- Hỗ trợ các hash routes: `#reviews`, `#danh-gia`, `#danh-gia-cua-toi`, `#my-reviews`.
- Đồng bộ chuyển tiếp hai chiều giữa Sidebar các trang cá nhân (`#profile`, `#bookings`, `#new-booking`, `#plans`, `#favorites`, `#reviews`).
- Modal "Chỉnh sửa đánh giá": Cho phép chọn lại số sao trực quan (1-5 sao) và chỉnh sửa đoạn văn nhận xét, lưu lại tức thì và cập nhật điểm trung bình.
- Modal "Viết đánh giá mới": Cho phép chọn dịch vụ đã trải nghiệm, chấm sao và nhập nhận xét đóng góp cho cộng đồng.
- Modal "Chi tiết đánh giá": Xem toàn bộ thông tin dịch vụ và nội dung đánh giá cùng nút chuyển hướng sang chi tiết dịch vụ.


---

## 22. MÀN HÌNH THÔNG TIN CÁ NHÂN (PERSONAL INFORMATION & ACCOUNT SECURITY SCREEN)

### 22.1. Mục tiêu & Ý nghĩa nghiệp vụ
- Cung cấp giao diện quản lý hồ sơ cá nhân, thông tin liên hệ và các tùy chọn bảo mật tài khoản cho khách hàng STAYEA theo chuẩn thiết kế desktop reference.
- Đồng bộ thông tin danh tính giữa hệ thống đặt chỗ (lưu trú, trải nghiệm, vé máy bay, di chuyển xe đưa đón) và tài khoản khách hàng.

### 22.2. Danh sách Component & Kiến trúc Feature-Based
1. `account-info-hero-banner.tsx`: Hero panorama với tiêu đề "Thông tin cá nhân", mô tả phụ "Quản lý hồ sơ, thông tin liên hệ và bảo mật tài khoản của bạn.", phông chữ nghệ thuật "More Than a Trip ♡".
2. `account-info-header-cards.tsx`:
   - Left Card (2/3 width): Avatar có badge máy ảnh để cập nhật ảnh đại diện, Tên "Nguyễn Minh", Huy hiệu "Thành viên Stayea Club", Email, Số điện thoại, Tiểu sử và nút hành động "Chỉnh sửa ảnh".
   - Right Card (1/3 width): Widget "Mẹo từ STAYEA" nền xanh nhạt dịu mắt, icon bóng đèn vàng, 3 gạch đầu dòng hướng dẫn chuẩn xác với icon checkmark tròn xanh đậm.
3. `account-info-form.tsx`:
   - **Phần 1 - Thông tin cơ bản:** Họ và tên, Email, Số điện thoại, Ngày sinh (có icon lịch), Giới tính (dropdown), Quốc tịch (dropdown).
   - **Phần 2 - Địa chỉ & giấy tờ:** Thành phố (dropdown), Địa chỉ chi tiết, Loại giấy tờ (CCCD/Hộ chiếu), Số giấy tờ (che bảo mật), Ngày hết hạn (icon lịch).
   - **Phần 3 - Liên hệ khẩn cấp:** Người liên hệ, Số điện thoại khẩn cấp, Mối quan hệ (dropdown).
   - **Phần 4 - Bảo mật tài khoản:** Mật khẩu (hiển thị ký tự ẩn) + Nút "Đổi mật khẩu", Switch toggle tương tác "Xác thực 2 bước", Switch toggle tương tác "Nhận thông báo ưu đãi".
   - **Phần 5 - Thanh tác vụ chân trang:** Nút "Hủy thay đổi" (outline) và nút "Lưu thay đổi" (navy solid có icon đĩa mềm).
4. `account-info-page.tsx`: Khung trang chính kết nối ProfileSidebar (highlight tab "account-info", ẩn số lượng badge), điều khiển các modal:
   - Modal Đổi mật khẩu với validation.
   - Modal Chọn/Tải lên ảnh đại diện với preview thời gian thực và các preset Phú Quốc.
   - Toast feedback khi lưu hoặc khôi phục dữ liệu.

### 22.3. Trạng thái kiểm tra & Tương thích
- TypeScript: 0 errors (`pnpm --filter admin-shadcn typecheck`)
- Linter: 0 warnings, 0 errors trên 217 files (`pnpm --filter admin-shadcn lint`)
- URL hash: `#account-info`, `#thong-tin-ca-nhan`, `#profile-info`, `#info`


---

## 23. MÀN HÌNH PHƯƠNG THỨC THANH TOÁN (PAYMENT METHODS & BILLING SCREEN)

### 23.1. Mục tiêu & Ý nghĩa nghiệp vụ
- Cung cấp giao diện quản lý các phương thức thanh toán đã lưu (thẻ tín dụng/ghi nợ quốc tế, tài khoản ngân hàng nội địa, ví điện tử), thông tin xuất hóa đơn VAT và lịch sử thanh toán cho khách hàng STAYEA.
- Tối ưu hóa trải nghiệm đặt phòng và tour du lịch với thao tác thanh toán 1 chạm, hỗ trợ đặt thẻ mặc định và liên kết nhanh.

### 23.2. Danh sách Component & Kiến trúc Feature-Based
1. `payment-methods-hero-banner.tsx`: Hero panorama toàn cảnh biển đảo Phú Quốc đồng bộ với tiêu đề "Thông tin cá nhân" / Quản lý tài khoản và chữ viết nghệ thuật "More Than a Trip ♡".
2. `payment-metrics-bar.tsx`: Thanh trạng thái 4 chỉ số:
   - Phương thức đã lưu (3 phương thức)
   - Thẻ mặc định (Visa **** 4242)
   - Giao dịch gần đây (12 giao dịch trong 3 tháng)
   - Trạng thái bảo mật (An toàn - Được mã hóa bảo mật)
3. `saved-cards-section.tsx`:
   - Thẻ Visa xanh dương chuẩn tỷ lệ card ATM, số thẻ che bảo mật, huy hiệu "Mặc định", tên chủ thẻ, ngày hết hạn và 2 nút: Chỉnh sửa, Xóa.
   - Thẻ Mastercard đen kim loại sang trọng, 3 nút: Đặt mặc định, Chỉnh sửa, Xóa.
4. `bank-accounts-section.tsx`:
   - Tài khoản Vietcombank (logo xanh lá VCB)
   - Tài khoản Techcombank (logo đỏ kim cương TCB)
   - Nút hành động Chỉnh sửa, Xóa.
5. `e-wallets-section.tsx`:
   - MoMo, ZaloPay, Apple Pay với nút liên kết/hủy liên kết nhanh.
6. `billing-address-card.tsx`:
   - Thẻ xuất hóa đơn: Loại cá nhân, họ tên, email, SĐT, địa chỉ Phú Quốc, nút "Cập nhật thông tin".
7. `recent-transactions-card.tsx`:
   - 3 giao dịch thực tế kèm ảnh đại diện: Ocean Bay Resort Phú Quốc (7.500.000đ), Tour 3 đảo (1.200.000đ), Sunset Cruise (350.000đ).
8. `payment-security-card.tsx`:
   - Khối cam kết an ninh thanh toán mã hóa đa tầng với họa tiết cọ dừa Phú Quốc.
9. `payment-methods-page.tsx`:
   - Container trang kết nối ProfileSidebar (activeTab="payment", ẩn số lượng badge), điều khiển 5 modal tương tác: Thêm phương thức mới, Sửa thông tin thẻ, Sửa tài khoản ngân hàng, Cập nhật thông tin xuất hóa đơn, Liên kết ví điện tử.

### 23.3. Trạng thái kiểm tra & Tương thích
- TypeScript: 0 errors (`pnpm --filter admin-shadcn typecheck`)
- Linter: 0 warnings, 0 errors trên 226 files (`pnpm --filter admin-shadcn lint`)
- URL hash: `#payment`, `#thanh-toan`, `#phuong-thuc-thanh-toan`, `#billing`
