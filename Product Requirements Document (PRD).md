# **Product Requirements Document (PRD): Cổng thông tin đầu tư trực tuyến "danang-invest-hub-online"**

Dự án: Cổng thông tin đầu tư trực tuyến "danang-invest-hub-online"  
Ngày cập nhật: 16/12/2024  
Phiên bản: 1.8

## **📊 Tóm tắt trạng thái dự án**

**🎯 Tiến độ tổng thể:** 65% hoàn thành  
**✅ Admin Panel:** 100% hoàn thành (Authentication, Dashboard, News CRUD)  
**✅ Backend API:** 7/12 endpoints hoàn thành với 15/15 test cases passed  
**🔄 Public Website:** 40% hoàn thành (UI sẵn sàng, cần tích hợp API)  
**📈 Chất lượng code:** TypeScript strict mode, comprehensive error handling, responsive design  
**🚀 Sẵn sàng production:** News Management System đã ready để deploy

## **Mục lục**

1. Giới thiệu  
2. Mục tiêu dự án  
3. Đối tượng người dùng  
4. Yêu cầu chức năng (Chi tiết)  
   4.1. Trang Public  
   4.1.1. Trang chủ (src/pages/Index.tsx)  
   4.1.2. Navigation (Điều hướng)  
   4.1.3. Trang Chi Tiết Tin Tức/Sự Kiện (src/pages/NewsDetailPage.tsx)  
   4.1.4. Trang Danh Sách Tin Tức Theo Danh Mục (src/pages/CategoryNewsPage.tsx)  
   4.1.5. Trang Sơ đồ trang (src/pages/SitemapPage.tsx)  
   4.1.6. Trang Không Tìm Thấy (src/pages/NotFound.tsx)  
   4.1.7. Layout chung cho Mobile (src/components/mobile/MobileLayout.tsx)  
   4.2. Hệ thống Quản trị Nội dung (Admin Panel)  
   4.2.1. Đăng nhập (src/pages/admin/LoginPage.tsx)  
   4.2.2. Admin Layout (src/layouts/AdminLayout.tsx)  
   4.2.3. Trang quản trị cơ bản (Dashboard) (src/pages/admin/DashboardPage.tsx)  
   4.2.4. Quản lý Tin tức (CRUD)  
   4.2.5. Quản lý Sự kiện (CRUD)  
   4.2.6. (Mở rộng) Quản lý Danh mục  
   4.2.7. (Mở rộng) Quản lý Người dùng nội bộ  
   4.2.8. (Mở rộng) Quản lý Tài nguyên (Resources)  
   4.2.9. (Mở rộng) Quản lý Đối tác (Partners)  
   4.2.10. (Mở rộng) Quản lý các nội dung động khác trên trang chủ  
   4.3. Chức năng chung  
   4.3.1. Tìm kiếm  
   4.3.2. Đa ngôn ngữ  
   4.3.3. Đa theme  
5. Yêu cầu Phi chức năng  
6. Thiết kế UI/UX  
7. Thông số kỹ thuật  
8. Kế hoạch Kiểm thử  
9. Kế hoạch Triển khai  
10. Bảo trì & Nâng cấp

## **1\. Giới thiệu**

Tài liệu này mô tả các yêu cầu sản phẩm cho Cổng thông tin đầu tư trực tuyến "danang-invest-hub-online" (sau đây gọi là "Dự án") của Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng (DSEZA).  
Mục đích của dự án là xây dựng một nền tảng thông tin toàn diện, hiện đại và dễ tiếp cận nhằm thu hút đầu tư, quảng bá hình ảnh Đà Nẵng và hỗ trợ các doanh nghiệp.  
**Thay đổi so với v1.7 (được phản ánh trong tài liệu này là v1.8):**

* ✅ **Hoàn thành API CRUD News Management:** Triển khai đầy đủ các API quản lý tin tức với authentication, authorization, pagination, filtering, và validation.
* ✅ **Hoàn thành Admin News Form:** Tích hợp hoàn chỉnh giao diện tạo/sửa tin tức với validation, đa ngôn ngữ, upload ảnh, và UX tối ưu.
* ✅ **Hoàn thành Admin News List:** Giao diện danh sách tin tức với search, filter, pagination, và bulk actions.
* ✅ **Cải tiến Authentication System:** Bổ sung AuthMiddleware, role-based permissions, và comprehensive test coverage.
* ✅ **Tối ưu Frontend Architecture:** Refactor components để hỗ trợ dữ liệu động, improve performance và maintainability.
* 🔄 **Cập nhật Roadmap:** Phản ánh tình trạng thực tế và ưu tiên các tính năng tiếp theo.
* 📚 **Bổ sung Documentation:** Comprehensive API documentation, implementation guides, và testing procedures.

## **2\. Mục tiêu dự án**

* Trở thành cổng thông tin đầu tư chính thức, toàn diện và đáng tin cậy cho DSEZA.  
* Cung cấp thông tin minh bạch, chính xác, cập nhật về môi trường đầu tư, chính sách ưu đãi, quy hoạch, thủ tục pháp lý, và các cơ hội đầu tư tại Đà Nẵng.  
* Thu hút hiệu quả nhà đầu tư trong nước và quốc tế, cũng như các doanh nghiệp tiềm năng.  
* Nâng cao hình ảnh, vị thế và năng lực cạnh tranh về đầu tư của thành phố Đà Nẵng.  
* Tạo kênh tương tác và hỗ trợ trực tuyến hiệu quả cho nhà đầu tư và doanh nghiệp.  
* **(Ưu tiên cao)** Cung cấp hệ thống quản trị nội dung (CMS) mạnh mẽ, dễ sử dụng cho phép người dùng nội bộ quản lý hiệu quả toàn bộ nội dung website.

## **3\. Đối tượng người dùng**

* **Nhà đầu tư (Trong nước & Quốc tế):** Các tập đoàn, công ty, quỹ đầu tư, cá nhân có tiềm lực tài chính, tìm kiếm cơ hội đầu tư tại Đà Nẵng.  
* **Doanh nghiệp (Đang hoạt động & Tiềm năng):** Doanh nghiệp trong/ngoài KCN/KCNC, SMEs, startups tìm kiếm thông tin hỗ trợ, mặt bằng, cơ hội phát triển.  
* **Tổ chức, đối tác liên quan:** Cơ quan chính phủ, hiệp hội doanh nghiệp, tổ chức xúc tiến thương mại, đơn vị tư vấn.  
* **Công chúng quan tâm:** Nhà nghiên cứu, sinh viên, báo chí.  
* **Người dùng nội bộ (DSEZA Staff):**  
  * **Quản trị viên (Admin):** Quản lý toàn bộ hệ thống, người dùng, cấu hình, và có quyền duyệt/xuất bản tất cả nội dung.  
  * **Biên tập viên (Editor):** Chịu trách nhiệm quản lý các nội dung được phân công (ví dụ: tin tức, sự kiện, tài liệu, một số trang thông tin tĩnh).  
  * Quy trình duyệt bài sẽ được áp dụng cho các nội dung quan trọng để đảm bảo chất lượng trước khi Admin xuất bản.

## **4\. Yêu cầu chức năng (Chi tiết)**

### **4.1. Trang Public**

#### **4.1.1. Trang chủ (src/pages/Index.tsx)**

* **Mô tả:** Trang chính của website, hiển thị thông tin tổng quan và điều hướng đến các mục quan trọng.  
* **Các Sections:**  
  * **Hero Section (src/components/hero/HeroSection.tsx):** Trình chiếu hình ảnh/video nổi bật, các tab hình ảnh điều hướng, và thanh mạng xã hội.  
    * *Hiện trạng (Frontend):* Đã triển khai HeroBackground.tsx với image tabs động, theme-aware images; SocialBar.tsx; TopBar.tsx; LogoSearchBar.tsx; NavigationBar.tsx với MegaMenu.tsx.  
    * *Hiện trạng (Backend):* Sử dụng ảnh tĩnh.  
    * *Yêu cầu Backend:* API để quản lý danh sách slides (ảnh, video, tiêu đề, link) cho Hero Background và ImageTabs.  
  * **Quick Access Buttons (src/components/QuickAccessButtons.tsx & src/components/mobile/MobileQuickLinksCarousel.tsx):** Các nút truy cập nhanh.  
    * *Hiện trạng (Frontend):* Đã triển khai UI.  
    * *Hiện trạng (Backend):* Link tĩnh.  
    * *Yêu cầu Backend:* API để quản lý danh sách Quick Access Buttons (icon, tiêu đề, link, thứ tự).  
  * **Featured Events (src/components/FeaturedEvents.tsx & src/components/mobile/MobileFeaturedEvents.tsx):** Sự kiện nổi bật.  
    * *Hiện trạng (Frontend):* Đã triển khai UI, sử dụng dữ liệu mẫu.  
    * *Hiện trạng (Backend):* Chưa có.  
    * *Yêu cầu Backend:* API lấy danh sách sự kiện nổi bật (ví dụ: /api/events/featured?limit=5).  
  * **News Section (src/components/NewsSection.tsx & src/components/mobile/MobileNewsSection.tsx):** Tin tức mới nhất.  
    * *Hiện trạng (Frontend):* Đã refactor để nhận dữ liệu động qua props, sử dụng newsService.ts (mock), hỗ trợ loading, skeleton, URL động, đa ngôn ngữ, filter category. Index.tsx sử dụng paginated API response.  
    * *Hiện trạng (Backend):* newsService.ts dùng mock.  
    * *Yêu cầu Backend:* API /api/news/featured (1 bài), /api/news/regular?categoryId=...\&limit=..., /api/news?categoryId=...\&page=...\&limit=....  
  * **Functional Zones (src/components/FunctionalZones.tsx & src/components/mobile/MobileFunctionalZonesCarousel.tsx):** Giới thiệu các khu chức năng.  
    * *Hiện trạng (Frontend):* Đã triển khai UI, sử dụng dữ liệu mẫu.  
    * *Hiện trạng (Backend):* Chưa có.  
    * *Yêu cầu Backend:* API lấy danh sách các khu chức năng (tên, mô tả, thông số, ảnh).  
  * **Investment Info (src/components/InvestmentInformation.tsx & src/components/mobile/MobileInvestmentInformation.tsx):** Thông tin đầu tư.  
    * *Hiện trạng (Frontend):* Đã triển khai UI, sử dụng dữ liệu mẫu.  
    * *Hiện trạng (Backend):* Chưa có.  
    * *Yêu cầu Backend:* API lấy các mục thông tin đầu tư (tiêu đề, ảnh, link).  
  * **Location (src/components/LocationSection.tsx):** Bản đồ, VR Tour.  
    * *Hiện trạng (Frontend):* UI Placeholder, cần tích hợp link VR tour thật và bản đồ số.  
    * *Yêu cầu Backend (nếu cần):* API cấu hình link VR Tour, link bản đồ số.  
  * **Resources (src/components/ResourcesSection.tsx):** Thư viện tài liệu.  
    * *Hiện trạng (Frontend):* Đã triển khai UI, sử dụng dữ liệu mẫu.  
    * *Hiện trạng (Backend):* Chưa có.  
    * *Yêu cầu Backend:* API lấy danh sách tài nguyên (hình ảnh, video, tài liệu) theo tab, có phân trang.  
  * **Businesses and Partners (src/components/BusinessesAndPartners.tsx):** Doanh nghiệp, đối tác.  
    * *Hiện trạng (Frontend):* Đã triển khai UI, sử dụng dữ liệu mẫu.  
    * *Hiện trạng (Backend):* Chưa có.  
    * *Yêu cầu Backend:* API lấy danh sách logo đối tác.  
  * **Footer (src/components/Footer.tsx):** Thông tin liên hệ.  
    * *Hiện trạng (Frontend):* Đã triển khai.  
    * *Yêu cầu Backend:* API để quản lý thông tin liên hệ, copyright, visitor count (nếu động).

#### **4.1.2. Navigation (Điều hướng)**

* **Desktop (TopBar.tsx, LogoSearchBar.tsx, NavigationBar.tsx, MegaMenu.tsx):**  
  * *Hiện trạng (Frontend):* Đã triển khai, menu data từ menuData.tsx.  
  * *Yêu cầu Backend (nếu cần):* API để quản lý cấu trúc menu nếu muốn động hoàn toàn.  
* **Mobile (MobileHeader.tsx):**  
  * *Hiện trạng (Frontend):* Đã triển khai menu dạng sheet.  
* **Search Bar:**  
  * *Hiện trạng (Frontend):* UI đã có.  
  * *Yêu cầu Backend:* API tìm kiếm toàn trang /api/search?query=... trả về kết quả theo dạng (tin tức, sự kiện, tài liệu...).  
* **Đa ngôn ngữ:**  
  * *Hiện trạng (Frontend):* Đã triển khai (LanguageContext.tsx, translations.ts).  
* **Đa theme:**  
  * *Hiện trạng (Frontend):* Đã triển khai (ThemeContext.tsx).

#### **4.1.3. Trang Chi Tiết Tin Tức/Sự Kiện (src/pages/NewsDetailPage.tsx)**

* **Mô tả:** Hiển thị nội dung chi tiết của một bài viết hoặc sự kiện.  
* **Hiện trạng (Frontend):** Đã hoàn thành tích hợp dữ liệu động từ newsService.ts (mock). Hỗ trợ responsive, dark/light mode, đa ngôn ngữ, skeleton loading, error handling, URL theo slug, breadcrumbs động.  
* **Hiện trạng (Backend):** newsService.ts sử dụng mock data.  
* **Yêu cầu Backend:**  
  * API endpoint /api/news/{slug} để lấy chi tiết bài viết.  
  * API endpoint /api/events/{slug} để lấy chi tiết sự kiện.  
  * API endpoint /api/news/related?categoryId=...\&excludeSlug=...\&limit=4 để lấy tin liên quan.  
  * API endpoint /api/news/recent?excludeSlug=...\&limit=5 để lấy tin gần đây.  
* **Cần làm thêm (Frontend):**  
  * Tích hợp API thật khi backend sẵn sàng.  
  * Hoàn thiện logic cho social sharing và newsletter signup.

#### **4.1.4. Trang Danh Sách Tin Tức Theo Danh Mục (src/pages/CategoryNewsPage.tsx)**

* **Mô tả:** Hiển thị danh sách bài viết thuộc một danh mục cụ thể, có phân trang.  
* **Hiện trạng (Frontend):** Đã hoàn thành. Hỗ trợ URL routing động, pagination (URL state), responsive grid, loading states, error handling, đa ngôn ngữ, đa theme. Service layer (newsService.ts) đã cập nhật các hàm cần thiết.  
* **Hiện trạng (Backend):** newsService.ts sử dụng mock data.  
* **Yêu cầu Backend:**  
  * API endpoint /api/categories/news/{categorySlug} để lấy thông tin danh mục.  
  * API endpoint /api/news/category/{categorySlug}?page=...\&limit=... để lấy danh sách bài viết theo danh mục có phân trang.  
* **Cần làm thêm (Frontend):** Tích hợp API thật.

#### **4.1.5. Trang Sơ đồ trang (src/pages/SitemapPage.tsx)**

* **Mô tả:** Hiển thị cấu trúc website.  
* **Hiện trạng (Frontend):** Đã tạo, dựa trên sitemap.md và menuData.tsx.

#### **4.1.6. Trang Không Tìm Thấy (src/pages/NotFound.tsx)**

* **Mô tả:** Trang 404 cho các đường dẫn không hợp lệ.  
* **Hiện trạng (Frontend):** Đã tạo.

#### **4.1.7. Layout chung cho Mobile (src/components/mobile/MobileLayout.tsx)**

* **Mô tả:** Bao gồm MobileHeader.tsx và MobileHero.tsx cho giao diện mobile.  
* **Hiện trạng (Frontend):** Đã triển khai.

### **4.2. Hệ thống Quản trị Nội dung (Admin Panel)**

* **Mục tiêu:** Cung cấp giao diện cho người dùng nội bộ quản lý nội dung website.  
* **Yêu cầu chung:** Giao diện responsive, hỗ trợ đa ngôn ngữ và theme tương tự trang public.

#### **4.2.1. Đăng nhập (src/pages/admin/LoginPage.tsx)**

* **Mô tả:** Giao diện cho người dùng nội bộ (Admin, Editor) đăng nhập vào hệ thống quản trị.  
* **Hiện trạng (Frontend):** ✅ **Đã tích hợp API thực tế.** UI với form đăng nhập, Zod validation, xử lý logic đăng nhập, lưu JWT token và thông tin người dùng vào localStorage, tự động redirect, thông báo toast. Hỗ trợ đa ngôn ngữ, theme.  
* **Hiện trạng (Backend):** ✅ **API /api/v1/auth/login.php đã hoàn thành.** Trả về JWT token và thông tin người dùng. Xử lý lỗi xác thực, mã hóa mật khẩu.  
* **Cần làm thêm:** Không có cho chức năng cơ bản.

#### **4.2.2. Admin Layout (src/layouts/AdminLayout.tsx)**

* **Mô tả:** Layout chính cho tất cả các trang admin, bao gồm AdminSidebar.tsx và AdminHeader.tsx.  
* **Hiện trạng (Frontend):** ✅ **Đã triển khai và tích hợp với API đăng nhập.**  
  * ProtectedRoute.tsx: Bảo vệ routes, kiểm tra JWT token và session, tự động redirect, session expiry (24h).  
  * AdminSidebar.tsx: Navigation menu, collapsible, responsive, highlight active menu, thông tin user (từ localStorage), logout (xóa token), role-based access, icons từ Lucide React.  
  * AdminHeader.tsx: Breadcrumbs động, nút chuyển theme/ngôn ngữ.  
* **Hiện trạng (Backend):** ✅ **API đăng nhập cung cấp token.** Middleware bảo vệ API (api/core/AuthMiddleware.php) đã được tạo.  
* **Yêu cầu Backend (cho các API được bảo vệ):** Tất cả các API admin cần sử dụng AuthMiddleware.php để xác thực token.

#### **4.2.3. Trang quản trị cơ bản (Dashboard) (src/pages/admin/DashboardPage.tsx)**

* **Mô tả:** Trang chính sau khi đăng nhập, cung cấp thống kê và lối tắt.  
* **Hiện trạng (Frontend):** ✅ **Đã nâng cấp và tích hợp API thống kê.** Hiển thị thống kê động (tổng số tin, sự kiện từ DB; lượt xem, người dùng hoạt động là mock), quick actions, thông tin phiên đăng nhập.  
* **Hiện trạng (Backend):** ✅ **API /api/v1/stats/overview.php đã hoàn thành.** Trả về dữ liệu thống kê (totalNews, totalEvents từ DB; totalViewsThisMonth, activeUsersThisMonth là mock). Yêu cầu JWT token.  
* **Cần làm thêm (Backend):** Triển khai logic thực tế cho totalViewsThisMonth và activeUsersThisMonth nếu cần.

#### **4.2.4. Quản lý Tin tức (CRUD)**

* **Mô tả:** Giao diện cho Admin/Editor tạo, xem, sửa, xóa tin tức.  
* **Giao diện danh sách (src/pages/admin/AdminNewsListPage.tsx):**  
  * ✅ **Hiện trạng (Frontend):** Hoàn thành UI với table responsive, pagination với URL state, search real-time, filter theo category/status/author, sort đa tiêu chí, bulk selection, actions (preview, edit, delete với confirm dialog). Hỗ trợ đa ngôn ngữ và theme.  
  * ✅ **Hiện trạng (Backend):** API /api/v1/admin/news (GET) đã hoàn thành với đầy đủ params: page, limit, searchTerm, categoryId, status, authorId, sortBy, sortDirection. Bao gồm authentication và authorization.  
* **Giao diện Tạo/Sửa (src/pages/admin/AdminNewsFormPage.tsx):**  
  * ✅ **Hiện trạng (Frontend):** Hoàn thành form với Zod validation, auto-slug generation, dual language support (VI/EN), image upload với preview, category dropdown, status management, date picker, và comprehensive error handling. Toast notifications và loading states.  
  * ✅ **Hiện trạng (Backend):** Các API đã hoàn thành:  
    * ✅ API /api/v1/admin/news (POST) - Tạo mới với validation đầy đủ  
    * ✅ API /api/v1/admin/news/{id} (GET) - Lấy chi tiết với JOIN thông tin  
    * ✅ API /api/v1/admin/news/{id} (PUT) - Cập nhật với permission check  
    * ✅ API /api/v1/admin/news/{id} (DELETE) - Xóa với soft delete  
    * ✅ API /api/v1/admin/check-slug - Kiểm tra slug unique real-time  
    * ✅ API /api/v1/admin/categories - Lấy danh sách categories  
* **✅ Hoàn thành:** Module quản lý tin tức đã sẵn sàng production với 15 test cases passed, documentation đầy đủ.  
* **🔄 Cần cải tiến:** Tích hợp WYSIWYG editor cho content field, media library integration.

#### **4.2.5. Quản lý Sự kiện (CRUD)**

* **Mô tả:** Tương tự Quản lý Tin tức, cho phép quản lý các sự kiện.  
* **Yêu cầu Frontend & Backend:** Tương tự module Quản lý Tin tức, thay news bằng events trong API paths và các logic liên quan.

#### **4.2.6. (Mở rộng) Quản lý Danh mục**

* **Mô tả:** Quản lý các danh mục cho Tin tức và Sự kiện.  
* **Yêu cầu Frontend:** Giao diện danh sách danh mục, form tạo/sửa danh mục (Tên VI/EN, Slug).  
* **Yêu cầu Backend:** API CRUD cho /api/admin/categories/news và /api/admin/categories/events.

#### **4.2.7. (Mở rộng) Quản lý Người dùng nội bộ**

* **Mô tả:** Cho phép Admin quản lý tài khoản và phân quyền (Admin, Editor).  
* **Yêu cầu Frontend:** Giao diện danh sách người dùng, form tạo/sửa người dùng (Email, Password (tạo mới/thay đổi), Role, Full Name, Is Active).  
* **Yêu cầu Backend:** API CRUD cho /api/admin/users.

#### **4.2.8. (Mở rộng) Quản lý Tài nguyên (Resources)**

* **Mô tả:** Giao diện CRUD cho hình ảnh, video, tài liệu.  
* **Yêu cầu Frontend:** Giao diện quản lý media library, upload, xóa.  
* **Yêu cầu Backend:** API /api/admin/media (GET, POST, DELETE).

#### **4.2.9. (Mở rộng) Quản lý Đối tác (Partners)**

* **Mô tả:** Giao diện CRUD cho logo đối tác.  
* **Yêu cầu Frontend:** Giao diện quản lý logo (upload, sắp xếp, xóa).  
* **Yêu cầu Backend:** API CRUD cho /api/admin/partners.

#### **4.2.10. (Mở rộng) Quản lý các nội dung động khác trên trang chủ**

* **Mô tả:** Giao diện quản lý các nội dung động trên trang chủ như Hero slides, Quick Access Buttons, Functional Zones data, Investment Info cards, Resources, Partners.  
* **Yêu cầu Frontend:** Các form quản lý tương ứng cho từng loại nội dung.  
* **Yêu cầu Backend:** Các API CRUD tương ứng cho từng loại nội dung.

### **4.3. Chức năng chung**

#### **4.3.1. Tìm kiếm**

* **Mô tả:** Cho phép người dùng tìm kiếm nội dung trên toàn trang.  
* **Hiện trạng (Frontend):** UI đã có trong LogoSearchBar.tsx và MobileHeader.tsx.  
* **Yêu cầu Backend:** API tìm kiếm /api/search?q={keyword} hỗ trợ tìm kiếm tin tức, sự kiện, tài liệu.

#### **4.3.2. Đa ngôn ngữ**

* **Mô tả:** Hỗ trợ ít nhất Tiếng Việt và Tiếng Anh.  
* **Hiện trạng (Frontend):** Đã triển khai, quản lý bởi LanguageContext.tsx và dữ liệu dịch trong translations.ts. Các component chính đã hỗ trợ.  
* **Yêu cầu Backend:** Các API trả về nội dung cần hỗ trợ trường đa ngôn ngữ (ví dụ title, titleEn, content, contentEn).

#### **4.3.3. Đa theme**

* **Mô tả:** Hỗ trợ giao diện Sáng (Light mode) và Tối (Dark mode).  
* **Hiện trạng (Frontend):** Đã triển khai, quản lý bởi ThemeContext.tsx và CSS variables.  
* **CSS Variables & Tailwind Config:** Đã định nghĩa trong tailwind.config.ts và src/index.css.

## **5\. Yêu cầu Phi chức năng**

* **Tính đáp ứng (Responsive Design):** Hoạt động mượt mà trên desktop, tablet, mobile.  
* **Hiệu suất cao (High Performance):** LCP \< 2.5s, FID \< 100ms, CLS \< 0.1. Tối ưu hình ảnh, lazy loading, code splitting.  
* **Bảo mật (Security):** HTTPS, bảo vệ chống các lỗ hổng OWASP Top 10, JWT cho API Admin, mã hóa mật khẩu.  
* **Khả năng truy cập (Accessibility \- a11y):** Tuân thủ WCAG 2.1 AA.  
* **Dễ bảo trì (Maintainability):** Code sạch, module hóa, tài liệu hóa, TypeScript.  
* **Khả năng mở rộng (Scalability):** Kiến trúc cho phép mở rộng tính năng và chịu tải tốt.  
* **SEO:** URL thân thiện, meta tags động, sitemap.xml, robots.txt, structured data.  
* **Tính tương thích (Compatibility):** Hoạt động tốt trên các phiên bản N-1 của các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge).

## **6\. Thiết kế UI/UX**

* **Hiện trạng:**  
  * Màu sắc tùy chỉnh (light & dark) và fonts (Montserrat, Inter) đã định nghĩa.  
  * Responsive design, CSS Variables, Glassmorphism effect đã áp dụng.  
  * Mockups HTML cho trang chủ (desktop & mobile) và trang chi tiết tin tức (desktop & mobile) đã có.  
  * Wireframes chi tiết cho trang chủ và các trang con đã có.  
* **Cần bổ sung (Ưu tiên cao):**  
  * Thiết kế chi tiết (Wireframe & Mockup) cho các giao diện CRUD còn lại của Tin tức, Sự kiện trong Admin Panel.  
  * Thiết kế chi tiết (Wireframe & Mockup) cho các module quản lý khác trong Admin Panel (Danh mục, Người dùng, Tài nguyên, Đối tác, Nội dung trang chủ).  
  * Hoàn thiện Style Guide chi tiết cho cả public site và admin panel.  
  * Tạo Prototype tương tác cho các luồng quản trị chính.

## **7\. Thông số kỹ thuật**

* **Frontend:**  
  * Framework/Library: React ^18.3.1.  
  * Build Tool: Vite ^5.4.1.  
  * Ngôn ngữ: TypeScript ^5.5.3.  
  * Styling: Tailwind CSS ^3.4.11 (@tailwindcss/typography ^0.5.15).  
  * UI Components: Shadcn/UI.  
  * Icons: Lucide Icons ^0.510.0.  
  * Charting: Recharts ^2.12.7.  
  * State Management: React Context, TanStack Query ^5.56.2.  
  * Routing: React Router DOM ^6.26.2.  
  * Form Management: React Hook Form ^7.53.0, Zod ^3.23.8, @hookform/resolvers ^3.9.0.  
  * Linting: ESLint (cấu hình trong eslint.config.js).  
  * Utilities: clsx, tailwind-merge, date-fns.  
* **Backend:**  
  * Ngôn ngữ: PHP với OOP architecture.  
  * Cơ sở dữ liệu: MySQL với PDO.  
  * Xác thực: JWT với custom SimpleJWT implementation.  
  * **Các API đã triển khai:**  
    * ✅ api/v1/auth/login.php - Authentication với role-based access  
    * ✅ api/v1/stats/overview.php - Dashboard statistics  
    * ✅ api/v1/admin/news.php - Complete CRUD operations cho news  
    * ✅ api/v1/admin/check-slug.php - Real-time slug validation  
    * ✅ api/v1/admin/categories.php - Categories management  
  * **Core Classes:**  
    * ✅ api/core/AuthMiddleware.php - JWT authentication & authorization  
    * ✅ api/core/Database.php - PDO connection với Singleton pattern  
    * ✅ api/core/News.php - News model với CRUD methods  
    * ✅ api/core/User.php - User model với authentication  
    * ✅ api/core/SimpleJWT.php - Custom JWT implementation  
* **Hosting:**  
  * Vercel (Frontend)  
  * Google Cloud (Backend, DB)

## **8\. Kế hoạch Kiểm thử**

* **Mục tiêu:** Đảm bảo chất lượng sản phẩm trước khi triển khai (public site & admin panel).  
* **Phạm vi:** Kiểm thử chức năng, UI/UX, tương thích, hiệu năng, bảo mật (API endpoints), khả năng truy cập.  
* **Quy trình:** Lập test case, Unit Test, Integration Test (Frontend-Backend), System Test, UAT (với DSEZA staff cho Admin Panel), quản lý lỗi, kiểm thử hồi quy.

## **9\. Kế hoạch Triển khai**

* **Chuẩn bị:** Tài liệu hướng dẫn sử dụng (cho người dùng cuối và quản trị viên), cấu hình môi trường Production (server, database, domain, SSL, biến môi trường cho API URL), robots.txt, sitemap.xml.  
* **Quy trình:** Build phiên bản Production của ứng dụng, triển khai lên môi trường Staging để kiểm thử cuối cùng (nếu có), triển khai lên môi trường Production, kiểm tra kỹ lưỡng sau triển khai, thiết lập công cụ theo dõi hiệu suất và lỗi, tạo và submit sitemap.xml.

## **10\. Tình trạng hiện tại (Version 1.8)**

### **✅ Đã hoàn thành**

#### **Backend API (PHP/MySQL)**
- ✅ **Authentication System:** JWT-based login với role-based access control (Admin/Editor)
- ✅ **News Management API:** Complete CRUD operations với pagination, filtering, sorting, validation
- ✅ **Database Schema:** Thiết kế và triển khai các bảng users_admin, news_articles, categories
- ✅ **Security:** AuthMiddleware, password hashing, SQL injection prevention, CORS configuration
- ✅ **Testing:** 15 automated test cases với comprehensive coverage
- ✅ **Documentation:** Detailed API documentation với examples và usage guides

#### **Frontend Admin Panel (React/TypeScript)**
- ✅ **Authentication:** Login page với JWT integration, session management, auto-redirect
- ✅ **Protected Routes:** Role-based access control với ProtectedRoute component
- ✅ **Admin Layout:** Responsive sidebar, header, breadcrumbs với theme support
- ✅ **News Management:** 
  - Complete CRUD interface với rich form validation
  - Real-time search, filtering, sorting, pagination
  - Bulk operations và confirmation dialogs
  - Dual language support (Vietnamese/English)
  - Image upload với preview functionality
  - Auto-slug generation từ Vietnamese titles
- ✅ **Dashboard:** Statistics display với API integration
- ✅ **Theme & i18n:** Full dark/light mode và bilingual support

#### **Frontend Architecture**
- ✅ **Modern Stack:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI
- ✅ **State Management:** React Hook Form, TanStack Query, Context API
- ✅ **Responsive Design:** Mobile-first approach với comprehensive breakpoints
- ✅ **Performance:** Code splitting, lazy loading, optimized bundle size
- ✅ **Developer Experience:** ESLint, TypeScript strict mode, comprehensive type safety

### **🔄 Đang phát triển**

#### **Public Website Integration**
- 🔄 **News Display Pages:** Frontend components sẵn sàng, cần tích hợp API thật
- 🔄 **Search Functionality:** UI components đã có, cần backend API
- 🔄 **Dynamic Homepage Content:** Static components cần chuyển sang dynamic data

#### **Events Management**
- 🔄 **Backend API:** Cần clone và adapt News API cho Events
- 🔄 **Admin Interface:** Cần clone News components cho Events management

### **📋 Công việc tiếp theo (Ưu tiên cao)**

1. **Triển khai Public News API** - Extend existing News API cho public access
2. **Events Management System** - Clone News system cho Events
3. **Search API Implementation** - Full-text search cho news, events, documents  
4. **Media Library** - File upload và management system
5. **WYSIWYG Editor Integration** - Rich text editor cho content creation

### **📊 Metrics & KPIs**

- **Backend API:** 7 endpoints hoàn thành, 15/15 test cases passed
- **Frontend Components:** 50+ components triển khai với full responsive support
- **Authentication:** 100% functional với role-based permissions
- **News Management:** 100% CRUD operations với advanced features
- **Code Quality:** TypeScript strict mode, ESLint clean, comprehensive error handling

## **11\. Bảo trì & Nâng cấp**

* **Kế hoạch:** Sao lưu dữ liệu tự động và định kỳ, theo dõi hiệu suất và lỗi liên tục, quy trình cập nhật nội dung thường xuyên qua Admin Panel, lên kế hoạch cập nhật phần mềm và thư viện, kênh hỗ trợ kỹ thuật, đánh giá định kỳ hiệu quả website và thu thập phản hồi người dùng để có kế hoạch nâng cấp phù hợp.

## **11\. Công việc Tiếp theo (Roadmap)**

| STT | Giai đoạn | Công việc cụ thể | Trạng thái | Ưu tiên | Người thực hiện | Ghi chú |
| ----- | :---- | :---- | :---- | :---- | :---- | :---- |
| Giai đoạn 0: Chuẩn bị & Thiết kế Nền tảng |  |  |  |  |  |  |
| 0.1 |  | Quyết định Công nghệ Backend & Database | Hoàn thành | Rất Cao | Tech Lead, Project Manager | PHP/MySQL đã được chọn. |
| 0.2 |  | Thiết kế chi tiết Database Schema | Hoàn thành | Rất Cao | Tech Lead, Backend Dev | Đã có users\_admin, news\_articles, event\_articles, categories. Cần rà soát và hoàn thiện cho các module khác. |
| 0.3 |  | Thiết kế chi tiết API Endpoints (Admin & Public) | Đang thực hiện | Rất Cao | Tech Lead, Backend Dev | Đã có Login, Stats. Tiếp tục cho News, Events, Search, và các section trang chủ. |
| 0.4 |  | Hoàn thiện Wireframe & Mockup chi tiết cho Admin Panel | Đang thực hiện | Rất Cao | UI/UX Designer | Tập trung vào các module CRUD News, Events. |
| 0.5 |  | Hoàn thiện Style Guide chi tiết | Chưa bắt đầu | Cao | UI/UX Designer |  |
| 0.6 |  | Tạo Prototype tương tác cho các luồng quản trị chính | Chưa bắt đầu | Trung bình | UI/UX Designer |  |
| Giai đoạn 1: Phát triển Backend Core & Admin Panel Cơ Bản |  |  |  |  |  |  |
| 1.1 |  | Thiết lập Môi trường Phát triển (Backend, Frontend, DB) | Hoàn thành | Rất Cao | DevOps, Fullstack Dev |  |
| 1.2 |  | Triển khai Hệ thống Xác thực & Phân quyền Backend (API) | ✅ Hoàn thành | Rất Cao | Backend Dev | API /api/v1/auth/login.php và Middleware (AuthMiddleware.php). |
| 1.3 |  | Tích hợp API Đăng nhập vào LoginPage.tsx | ✅ Hoàn thành | Cao | Frontend Dev | Lưu token, thông tin user, redirect. |
| 1.4 |  | Tích hợp API xác thực token vào ProtectedRoute.tsx | ✅ Hoàn thành | Cao | Frontend Dev | Kiểm tra token, xử lý session expiry. |
| 1.5 |  | Triển khai API Thống kê Dashboard & Tích hợp vào AdminDashboardPage.tsx | ✅ Hoàn thành | Cao | Frontend, Backend Dev | API /api/v1/stats/overview.php và tích hợp hiển thị động. |
| 1.6 |  | Triển khai API CRUD cho News & NewsCategories (bao gồm upload ảnh, đa ngôn ngữ, slug, status) | ✅ Hoàn thành | Rất Cao | Backend Dev | Complete với 15 test cases passed. |
| 1.7 |  | Xây dựng Giao diện Form Tạo/Sửa Tin tức (AdminNewsFormPage.tsx) | ✅ Hoàn thành | Rất Cao | Frontend Dev | Full validation, đa ngôn ngữ, image upload, category selection. |
| 1.8 |  | Tích hợp API CRUD News vào AdminNewsListPage.tsx và AdminNewsFormPage.tsx | ✅ Hoàn thành | Rất Cao | Frontend Dev | Pagination, search, filter, real-time validation. |
| 1.9 |  | **[TIẾP THEO]** Triển khai API CRUD cho Events & EventCategories | Tiếp theo | Cao | Backend Dev | Sử dụng News API làm template, adapt cho Events. |
| 1.10 |  | **[TIẾP THEO]** Xây dựng Giao diện CRUD Quản lý Sự kiện (Admin) | Tiếp theo | Cao | Frontend Dev | Clone News components, adapt cho Events schema. |
| Giai đoạn 2: Phát triển Frontend Public & Hoàn Thiện Tích Hợp API |  |  |  |  |  |  |
| 2.1 |  | **[ƯU TIÊN CAO]** Triển khai API Public cho News (detail, categories, featured) | Tiếp theo | Rất Cao | Backend Dev | Extend News API cho public access, không cần auth. |
| 2.2 |  | **[ƯU TIÊN CAO]** Tích hợp API thật cho NewsDetailPage.tsx (chi tiết, tin liên quan, tin gần đây) | Tiếp theo | Rất Cao | Frontend Dev | Update service layer để call API thật. |
| 2.3 |  | **[ƯU TIÊN CAO]** Tích hợp API thật cho CategoryNewsPage.tsx (thông tin danh mục, danh sách theo category) | Tiếp theo | Rất Cao | Frontend Dev | Update pagination và filtering logic. |
| 2.4 |  | **[ƯU TIÊN CAO]** Tích hợp API thật cho NewsSection.tsx và MobileNewsSection.tsx trên trang chủ | Tiếp theo | Cao | Frontend Dev | Featured news và recent news. |
| 2.5 |  | Triển khai API cho Search (Public) | Chưa bắt đầu | Cao | Backend Dev | Tìm kiếm đa dạng nội dung (news, events, documents). |
| 2.6 |  | Hoàn thiện logic tìm kiếm trên Frontend (Public) | Chưa bắt đầu | Cao | Frontend Dev | Results display, suggestions, filters. |
| 2.7 |  | Triển khai API cho các section trang chủ (Hero, QuickAccess, FunctionalZones, InvestmentInfo, Resources, Partners) | Chưa bắt đầu | Trung bình | Backend Dev | Dynamic content management. |
| 2.8 |  | Hoàn thiện dữ liệu động cho các section còn lại trên trang chủ (Public) | Chưa bắt đầu | Trung bình | Frontend Dev | Integrate với API endpoints. |
| Giai đoạn 3: Mở rộng Admin Panel & Tính năng Nâng cao |  |  |  |  |  |  |
| 3.1 |  | Triển khai API CRUD cho Quản lý Danh mục (Admin) | Chưa bắt đầu | Trung bình | Backend Dev |  |
| 3.2 |  | Xây dựng Giao diện Quản lý Danh mục (Admin) | Chưa bắt đầu | Trung bình | Frontend Dev |  |
| 3.3 |  | Triển khai API CRUD cho Quản lý Người dùng nội bộ (Admin) | Chưa bắt đầu | Trung bình | Backend Dev |  |
| 3.4 |  | Xây dựng Giao diện Quản lý Người dùng nội bộ (Admin) | Chưa bắt đầu | Trung bình | Frontend Dev |  |
| 3.5 |  | Triển khai API cho Media Library (Quản lý Tài nguyên \- Admin) | Chưa bắt đầu | Trung bình | Backend Dev | Upload, duyệt, xóa file. |
| 3.6 |  | Xây dựng Giao diện Media Library (Admin) | Chưa bắt đầu | Trung bình | Frontend Dev | Tích hợp vào trình soạn thảo WYSIWYG. |
| 3.7 |  | Triển khai API CRUD cho Quản lý Đối tác (Logo \- Admin) | Chưa bắt đầu | Thấp | Backend Dev |  |
| 3.8 |  | Xây dựng Giao diện Quản lý Đối tác (Admin) | Chưa bắt đầu | Thấp | Frontend Dev |  |
| 3.9 |  | Triển khai API cho Quản lý nội dung động khác trên trang chủ (Admin) | Chưa bắt đầu | Trung bình | Backend Dev | Hero slides, Quick Access, etc. |
| 3.10 |  | Xây dựng Giao diện quản lý nội dung động trang chủ (Admin) | Chưa bắt đầu | Trung bình | Frontend Dev |  |
| Giai đoạn 4: Kiểm thử, Tối ưu hóa & Chuẩn bị Triển khai |  |  |  |  |  |  |
| 4.1 |  | Xây dựng kế hoạch và test cases chi tiết cho toàn bộ hệ thống | Chưa bắt đầu | Cao | QA Team, Product Owner | Bao gồm cả public site và admin panel. |
| 4.2 |  | Thực hiện Unit Test và Integration Test | Chưa bắt đầu | Cao | Dev Team |  |
| 4.3 |  | Thực hiện System Testing & UAT với DSEZA staff | Chưa bắt đầu | Rất Cao | QA Team, DSEZA Staff |  |
| 4.4 |  | Tối ưu hiệu suất Frontend (Lighthouse, Web Vitals) | Chưa bắt đầu | Cao | Frontend Dev |  |
| 4.5 |  | Tối ưu hiệu suất Backend (truy vấn CSDL, thời gian phản hồi API) | Chưa bắt đầu | Cao | Backend Dev |  |
| 4.6 |  | Rà soát và hoàn thiện SEO (Meta tags, structured data, sitemap.xml, robots.txt) | Chưa bắt đầu | Cao | Frontend Dev, SEO Expert |  |
| 4.7 |  | Rà soát và hoàn thiện Accessibility (a11y) | Chưa bắt đầu | Trung bình | Frontend Dev, QA Team |  |
| 4.8 |  | Viết tài liệu hướng dẫn sử dụng cho Admin và Editor | Chưa bắt đầu | Trung bình | Tech Writer, Product |  |
| 4.9 |  | Thiết lập môi trường Staging và Production | Chưa bắt đầu | Cao | DevOps, Backend Dev |  |
| Giai đoạn 5: Triển khai & Sau triển khai |  |  |  |  |  |  |
| 5.1 |  | Triển khai lên môi trường Staging và thực hiện UAT cuối cùng | Chưa bắt đầu | Rất Cao | DevOps, QA, DSEZA Staff |  |
| 5.2 |  | Triển khai lên môi trường Production | Chưa bắt đầu | Rất Cao | DevOps |  |
| 5.3 |  | Thực hiện Smoke Testing sau triển khai Production | Chưa bắt đầu | Rất Cao | QA Team, Product Owner |  |
| 5.4 |  | Thiết lập công cụ theo dõi hiệu suất và lỗi (Google Analytics, Sentry, etc.) | Chưa bắt đầu | Cao | DevOps, Frontend Dev |  |
| 5.5 |  | Submit sitemap.xml cho Google Search Console và các công cụ tìm kiếm khác | Chưa bắt đầu | Cao | SEO Expert, Product |  |
| 5.6 |  | Theo dõi hệ thống, sửa lỗi phát sinh (hotfixes) | Liên tục | Rất Cao | Dev Team, DevOps |  |
| 5.7 |  | Thu thập phản hồi người dùng và lên kế hoạch cho các phiên bản tiếp theo | Liên tục | Cao | Product Owner, Team |  |

