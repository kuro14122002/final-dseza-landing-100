# **Product Requirements Document (PRD): Trang thông tin điện tử Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng**

**Phiên bản: 2.0** **Ngày cập nhật:** 10/06/2025

## **1\. Giới thiệu**

### **1.1. Mục đích Tài liệu**

Tài liệu này (phiên bản 2.0) định nghĩa các yêu cầu sản phẩm cho dự án "Xây dựng trang thông tin điện tử Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng" (sau đây gọi là "Cổng thông tin").

Mục tiêu chính của phiên bản 2.0 là tạo ra một tài liệu yêu cầu **toàn diện, duy nhất**, phản ánh đầy đủ và chính xác toàn bộ phạm vi công việc đã được thống nhất trong **Biên bản thương thảo hợp đồng số 1312/2024/BQL KCNC-VNPT**. Tài liệu này sẽ là kim chỉ nam cho đội ngũ phát triển, thiết kế và kiểm thử trong suốt vòng đời dự án.

### **1.2. Những thay đổi chính so với phiên bản 1.8**

* **Đồng** bộ hóa với **Hợp đồng:** Bổ sung và chi tiết hóa **toàn bộ 24 nhóm chức năng** và các **"yêu cầu khác"** từ hợp đồng, loại bỏ các khoảng trống đã được xác định. Các mục "Mở rộng" trước đây đã được nâng cấp thành các yêu cầu cốt lõi.  
* **Tái cấu trúc Admin Panel:** Mục "Hệ thống Quản trị Nội dung" được thiết kế lại hoàn toàn theo một kiến trúc có cấu trúc, theo mô-đun, dễ quản lý và mở rộng.  
* **Tích hợp Yêu cầu Pháp lý:** Bổ sung các yêu cầu cụ thể về tuân thủ **Nghị định 42/2022/NĐ-CP** và **Thông tư 22/2023/TT-BTTTT**, bao gồm kết nối Hệ thống EMC và các yêu cầu an toàn thông tin.  
* **Bổ sung các hạng mục quan trọng:** Thêm các mục mới cho "Di chuyển Dữ liệu", "Tích hợp API Thống kê Doanh nghiệp", và "Đào tạo & Tài liệu".  
* **Cập nhật Lộ trình (Roadmap):** Xây dựng một lộ trình phát triển chi tiết và thực tế hơn, bao quát tất cả các hạng mục công việc mới.

## **2\. Mục tiêu dự án**

* Trở thành cổng thông tin điện tử chính thức, toàn diện, đáng tin cậy của Ban Quản lý.  
* Cung cấp thông tin minh bạch, chính xác, cập nhật về môi trường đầu tư, chính sách, quy hoạch và thủ tục pháp lý.  
* Thu hút hiệu quả nhà đầu tư trong và ngoài nước.  
* Nâng cao hình ảnh, vị thế và năng lực cạnh tranh của Khu công nghệ cao và các khu công nghiệp Đà Nẵng.  
* Tạo kênh tương tác và hỗ trợ trực tuyến hiệu quả cho nhà đầu tư và doanh nghiệp.  
* **(Ưu tiên cao)** Cung cấp Hệ thống Quản trị Nội dung (CMS) mạnh mẽ, trực quan, dễ sử dụng, đáp ứng đầy đủ nghiệp vụ của Ban biên tập.  
* **(Ưu tiên cao)** Đảm bảo tuân thủ đầy đủ các quy định của pháp luật Việt Nam về cổng thông tin điện tử của cơ quan nhà nước.

## **3\. Đối tượng người dùng**

* **Người dùng Công chúng:**  
  * **Nhà** đầu **tư (Trong nước & Quốc tế):** Tìm kiếm cơ hội, thông tin chính sách, pháp lý.  
  * **Doanh nghiệp (Đang hoạt động & Tiềm năng):** Tìm kiếm thông tin hỗ trợ, mặt bằng, đối tác.  
  * **Tổ** chức, **đối tác liên quan:** Cơ quan chính phủ, hiệp hội, đơn vị tư vấn.  
  * **Công chúng quan tâm:** Nhà nghiên cứu, sinh viên, báo chí.  
* **Người dùng Nội bộ (Ban Quản lý):**  
  * **Quản trị viên (Admin):** Quản lý toàn bộ hệ thống, người dùng, phân quyền, cấu hình và các nội dung quan trọng.  
  * **Biên** tập viên (Editor): Chịu trách nhiệm tạo, sửa, và quản lý các nội dung được phân công (ví dụ: tin tức, sự kiện, văn bản).

## **4\. Yêu cầu chức năng**

### **4.1. Trang Công chúng (Public Website)**

Giao diện người dùng cuối, hiển thị thông tin ra bên ngoài.

#### **4.1.1. Các Trang Chính**

* **Trang chủ:** Giao diện tổng quan, là điểm truy cập chính.  
* **Trang Giới thiệu:** Thông tin về Ban Quản lý.  
* **Trang Tin tức/Sự kiện:**  
  * Trang danh sách tin tức/sự kiện (theo chuyên mục).  
  * Trang chi tiết tin tức/sự kiện.  
* **Trang Hệ thống Văn bản:**  
  * Trang tìm kiếm, tra cứu văn bản.  
  * Trang chi tiết văn bản.  
* **Trang Thư viện (Ảnh/Video):** Trưng bày tài nguyên đa phương tiện.  
* **Trang Lịch công tác:** Hiển thị lịch làm việc của Ban Quản lý.  
* **Trang** Góp ý dự thảo văn **bản:** Cổng thông tin để công chúng đóng góp ý kiến.  
* **Trang Liên hệ:** Thông tin, bản đồ, và biểu mẫu liên hệ.  
* **Trang Hỏi đáp:** Giải đáp các câu hỏi thường gặp.  
* **Trang Bình chọn/Thăm dò ý kiến:** Thu thập ý kiến công chúng.  
* **Trang Sơ đồ trang:** Cấu trúc toàn bộ website.  
* **Trang Kết quả tìm kiếm.**  
* **Trang Lỗi 404\.**

#### **4.1.2. Các Chức năng & Thành phần Chung**

* **Header & Navigation:** Menu chính (đa cấp), logo, thanh tìm kiếm, chuyển đổi ngôn ngữ/giao diện.  
* **Footer:** Thông tin liên hệ, bản quyền, liên kết hữu ích, thống kê truy cập.  
* **Tìm kiếm:** Chức năng tìm kiếm toàn trang.  
* **Hỗ trợ người khuyết tật:** Các nút chức năng thay đổi độ tương phản, kích thước font chữ.  
* **Chia sẻ mạng xã hội:** Tích hợp nút chia sẻ (Facebook) trên các trang tin tức/bài viết.  
* **Gửi** bình **luận/phản hồi:** Người dùng có thể bình luận dưới các bài viết (có captcha và kiểm duyệt).  
* **Gửi câu hỏi:** Người dùng có thể đặt câu hỏi trong mục Hỏi-Đáp (có captcha).  
* **Tham gia bình chọn:** Người dùng có thể tham gia các cuộc bình chọn/thăm dò ý kiến.  
* **Phiên bản di động:** Giao diện đáp ứng (responsive) hoàn chỉnh cho các thiết bị di động.

### **4.2. Hệ thống Quản trị Nội dung (Admin Panel)**

Giao diện cho người dùng nội bộ quản lý toàn bộ Cổng thông tin. Kiến trúc được tổ chức theo các **Khu vực (Sections)** chức năng chính.

#### **Khu vực 1: Bảng điều khiển (Dashboard)**

* **Mô tả:** Màn hình tổng quan sau khi đăng nhập.  
* **Chức năng:**  
  * Hiển thị các số liệu thống kê nhanh: tổng số tin bài, văn bản, lượt truy cập, người dùng hoạt động.  
  * Hiển thị các hoạt động gần đây.  
  * Các lối tắt (Quick Actions) đến các chức năng thường dùng.  
  * **Tích hợp Thống kê Doanh nghiệp:** Hiển thị dữ liệu thống kê về doanh nghiệp, lĩnh vực sản xuất được lấy qua API từ Hệ thống CSDL chuyên ngành của Ban Quản lý.

#### **Khu vực 2: Quản lý Nội dung (Content Management)**

* **Mô tả:** Trung tâm quản lý tất cả các loại nội dung trên website.  
* **Các Mô-đun:**  
  * **Quản** lý Tin tức & **Bài viết:**  
    * Quản lý Chuyên mục (CRUD).  
    * Quản lý Tin tức/Bài viết (CRUD), bao gồm: tiêu đề (VI/EN), mô tả (VI/EN), nội dung (VI/EN), slug, ảnh đại diện, chuyên mục, tác giả, trạng thái (nháp, chờ duyệt, đã đăng), ngày đăng, SEO meta tags.  
    * Quản lý cấu hình các kiểu hiển thị tin tức.  
  * **Quản lý Hệ thống Văn bản:**  
    * Quản lý các danh mục: Lĩnh vực, Cơ quan ban hành, Cấp ban hành (CRUD).  
    * Quản lý Văn bản (CRUD): Tải lên file, nhập metadata (số hiệu, ngày ban hành, trích yếu...).  
  * **Quản lý Thư viện Đa phương tiện:**  
    * **Thư viện Hình ảnh:** Tạo/quản lý thư mục, tải lên hàng loạt, CRUD cho từng ảnh, quản lý metadata (alt text, caption), cấu hình trình chiếu (slider).  
    * **Thư viện Video:** Quản lý danh mục video, thêm/sửa/xóa video (hỗ trợ link YouTube/Vimeo hoặc tải lên trực tiếp), cấu hình hiển thị.  
  * **Quản lý Góp ý Dự thảo:**  
    * Đăng tải, quản lý các văn bản cần lấy ý kiến (CRUD).  
    * Xem, tìm kiếm, và quản lý các bình luận/góp ý của người dân.  
  * **Quản lý Hỏi \- Đáp:**  
    * Quản lý Lĩnh vực hỏi đáp (CRUD).  
    * Xem, trả lời, và đăng/xóa/sửa các câu hỏi và câu trả lời.  
  * **Quản lý Bình chọn:**  
    * Tạo và quản lý các cuộc bình chọn/thăm dò ý kiến (CRUD cho câu hỏi và các phương án trả lời).  
    * Xem kết quả bình chọn theo thời gian thực.  
  * **Quản lý Phản hồi Bài viết:**  
    * Xem, tìm kiếm, kiểm duyệt (hiển thị/ẩn), và xóa các bình luận của người dùng trên toàn trang.

#### **Khu vực 3: Quản lý Cấu trúc & Giao diện (Site & Appearance)**

* **Mô tả:** Quản lý các yếu tố liên quan đến cấu trúc và hiển thị của website.  
* **Các Mô-đun:**  
  * **Quản lý Trang & Menu:**  
    * Quản lý cấu trúc menu chính của website (kéo-thả để sắp xếp, thêm/sửa/xóa các mục menu).  
    * Cấu hình chức năng/nội dung hiển thị trên một trang/menu cụ thể.  
  * **Quản lý Liên kết Website:**  
    * Quản lý các chủ đề liên kết (ví dụ: Liên kết chính phủ, Liên kết địa phương).  
    * Thêm/sửa/xóa các liên kết trong từng chủ đề.  
  * **Quản lý Bố cục & Giao diện:**  
    * Xem danh sách các bố cục mẫu có sẵn.  
    * Lựa chọn và áp dụng một bố cục cho toàn trang.  
  * **Quản lý Ngôn ngữ:**  
    * Thêm/sửa/xóa ngôn ngữ.  
    * Cấu hình ngôn ngữ mặc định và các ngôn ngữ hiển thị.  
    * (Nâng cao) Giao diện quản lý các chuỗi dịch (translation keys) cho các thành phần tĩnh của UI.

#### **Khu vực 4: Quản lý Người dùng & Phân quyền (Users & Permissions)**

* **Mô tả:** Quản lý tài khoản và quyền hạn truy cập hệ thống quản trị.  
* **Các Mô-đun:**  
  * **Quản lý Thành viên (Admin Users):**  
    * Quản lý Nhóm thành viên (ví dụ: Admin, Editor) (CRUD).  
    * Quản lý tài khoản người dùng nội bộ (CRUD), gán người dùng vào nhóm.  
  * **Quản lý Phân quyền Hệ thống:**  
    * Quản lý Nhóm quyền.  
    * Quản lý và gán các quyền thao tác (ví dụ: tạo, sửa, xóa, duyệt) cho từng nhóm quyền trên từng mô-đun chức năng.  
  * **Quản lý Phân quyền Nội dung:**  
    * Phân quyền quản lý trên từng chuyên mục tin tức/bài viết cho từng tài khoản/nhóm tài khoản.

#### **Khu vực 5: Quản trị & Tiện ích (Administration & Utilities)**

* **Mô tả:** Các công cụ quản trị, thống kê và tiện ích khác.  
* **Các Mô-đun:**  
  * **Quản lý Lịch công tác:**  
    * Giao diện nhập liệu, quản lý lịch công tác theo tuần (CRUD).  
    * Tích hợp để đồng bộ lịch công tác từ "Hệ thống Quản lý văn bản điều hành" qua API.  
  * **Quản** lý Thông tin Liên **hệ:**  
    * Quản lý các nhóm liên hệ và các mục liên hệ chi tiết (CRUD).  
    * Cấu hình cách hiển thị thông tin liên hệ ra ngoài trang public.  
  * **Thống kê & Báo cáo:**  
    * **Thống kê Lượt truy cập:** Xem số liệu, cấu hình hiển thị/ẩn, khởi tạo lại bộ đếm.  
    * **Thống kê Tin bài:** Thống kê theo trang, thời gian, chuyên mục, loại tin. Hỗ trợ xuất báo cáo ra file Excel.

### **4.3. Yêu cầu Di chuyển Dữ liệu**

* **Mô tả:** Chuyển đổi toàn bộ dữ liệu từ Cổng thông tin cũ sang hệ thống mới.  
* **Nguồn:** https://dhpiza.danang.gov.vn/  
* **Phạm vi dữ liệu:**  
  * Toàn bộ tin bài, bài viết.  
  * Toàn bộ các file văn bản đã được đăng tải.  
  * Toàn bộ hình ảnh thuộc các bài viết và thư viện ảnh.  
* **Yêu cầu:**  
  * Xây dựng kịch bản (script) di chuyển tự động hoặc công cụ hỗ trợ.  
  * Đảm bảo ánh xạ (mapping) đúng cấu trúc dữ liệu từ cũ sang mới.  
  * Bảo toàn định dạng, hình ảnh trong bài viết và các tệp đính kèm.  
  * Có kế hoạch kiểm tra và xác thực dữ liệu sau khi di chuyển.

## **5\. Yêu cầu Phi chức năng**

* **Tính đáp ứng (Responsive Design):** Hoạt động mượt mà trên desktop, tablet, mobile.  
* **Hiệu suất cao (High Performance):** Tối ưu tốc độ tải trang (LCP \< 2.5s, FID \< 100ms, CLS \< 0.1), tối ưu hình ảnh, lazy loading, code splitting.  
* **Bảo mật (Security):**  
  * Tuân thủ các quy định của pháp luật về bảo đảm an toàn hệ thống thông tin theo cấp độ. Phải xác định và đáp ứng đúng "cấp độ an toàn thông tin" cho hệ thống.  
  * Áp dụng các biện pháp phòng chống các lỗ hổng theo danh sách OWASP Top 10\.  
  * Sử dụng HTTPS trên toàn trang.  
  * Xác thực bằng JWT cho các API quản trị, có cơ chế hết hạn và làm mới token.  
  * Mã hóa mật khẩu người dùng.  
* **Khả năng truy cập (Accessibility \- a11y):** Tuân thủ tiêu chuẩn WCAG 2.1 mức AA. Đặc biệt triển khai các chức năng hỗ trợ người khuyết tật đã nêu trong hợp đồng.  
* **SEO:** URL thân thiện, meta tags động, sitemap.xml, robots.txt, dữ liệu có cấu trúc (structured data).  
* **Tính tương thích (Compatibility):** Hoạt động tốt trên các phiên bản N-1 của các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge).  
* **Tuân thủ quy định:**  
  * Đáp ứng đầy đủ các yêu cầu chức năng tại **Điều 7, Điều 8, Điều 9 của Nghị định 42/2022/NĐ-CP**.  
  * Đáp ứng đầy đủ các yêu cầu về cấu trúc, bố cục, và kỹ thuật theo **Thông tư 22/2023/TT-BTTTT**.  
  * **Tích hợp Hệ thống EMC:** Hệ thống phải có khả năng kết nối với Hệ thống giám sát, đo lường mức độ cung cấp và sử dụng dịch vụ Chính phủ số (Hệ thống EMC) để gửi các thông tin, số liệu theo yêu cầu tại Phụ lục III của Thông tư 22\. Cần có chức năng ghi nhật ký (logging) cho việc kết nối này.

## **6\. Thiết kế UI/UX**

* **Giao diện Public:** Thiết kế 01 mẫu giao diện độc đáo, hiện đại, bắt mắt, thể hiện đặc trưng của đơn vị. Bố cục khoa học, hài hòa, dễ sử dụng.  
* **Giao** diện Admin **Panel:** Thiết kế nhất quán, sạch sẽ, trực quan, tập trung vào hiệu quả công việc cho Ban biên tập.  
* Cần xây dựng Wireframe và Mockup chi tiết cho tất cả các trang và mô-dun chức năng được mô tả ở Mục 4\.  
* Xây dựng Style Guide và Prototype tương tác cho các luồng người dùng chính.

## **7\. Thông số kỹ thuật**

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, TanStack Query, React Hook Form, Zod.  
* **Backend:** PHP (Kiến trúc OOP), MySQL.  
* **Xác thực:** JWT.  
* **Hosting:** Vercel (Frontend), Google Cloud (Backend, DB) hoặc hạ tầng tương đương.

## **8\. Kế hoạch Kiểm thử**

* **Phạm vi:** Kiểm thử chức năng, UI/UX, tương thích, hiệu năng, bảo mật, khả năng truy cập.  
* **Quy trình:** Lập test case chi tiết cho từng chức năng \-\> Unit Test \-\> Integration Test (Frontend-Backend) \-\> System Test \-\> UAT (với Ban Quản lý) \-\> Quản lý lỗi \-\> Kiểm thử hồi quy.

## **9\. Đào tạo & Tài liệu**

* **Biên soạn tài liệu:**  
  * Tài liệu hướng dẫn sử dụng cho Ban biên tập (Editor).  
  * Tài liệu quản trị hệ thống (Admin).  
* **Tổ chức đào tạo:**  
  * Thực hiện các buổi đào tạo, hướng dẫn sử dụng trực tiếp cho Ban biên tập và Quản trị viên của Ban Quản lý.

## **10\. Kế hoạch Triển khai & Bảo trì**

* **Triển khai:** Xây dựng kế hoạch triển khai chi tiết qua các môi trường (Dev \-\> Staging \-\> Production).  
* **Bảo trì:** Xây dựng kế hoạch sao lưu dữ liệu, theo dõi hiệu suất và lỗi, quy trình cập nhật và vá lỗi.

## **11\. Lộ trình Phát triển (Roadmap) v2.0**