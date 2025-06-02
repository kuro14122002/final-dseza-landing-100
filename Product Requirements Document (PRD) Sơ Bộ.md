# **Product Requirements Document (PRD) Sơ Bộ: danang-invest-hub-online**

Dự án: Cổng thông tin đầu tư trực tuyến "danang-invest-hub-online"  
Ngày cập nhật: 02/06/2025  
Phiên bản: 1.1

## **1\. Thu thập Yêu cầu & Phân tích**

### **1.1. Mục tiêu chính**

* Trở thành cổng thông tin đầu tư chính thức và toàn diện cho Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng (DSEZA).  
* Cung cấp thông tin minh bạch, chính xác, và cập nhật về môi trường đầu tư, chính sách ưu đãi, quy hoạch, thủ tục pháp lý, và các cơ hội đầu tư tại Đà Nẵng.  
* Thu hút hiệu quả các nhà đầu tư trong nước và quốc tế, cũng như các doanh nghiệp tiềm năng.  
* Nâng cao hình ảnh, vị thế và năng lực cạnh tranh về đầu tư của thành phố Đà Nẵng trên trường quốc tế.  
* Tạo kênh tương tác, hỗ trợ trực tuyến cho nhà đầu tư và doanh nghiệp.

### **1.2. Đối tượng người dùng**

* **Nhà đầu tư:**  
  * Trong nước: Các tập đoàn, công ty, quỹ đầu tư, cá nhân có tiềm lực tài chính và quan tâm đến các dự án tại Đà Nẵng.  
  * Quốc tế: Các tập đoàn đa quốc gia, công ty nước ngoài, quỹ đầu tư mạo hiểm, nhà đầu tư thiên thần tìm kiếm cơ hội tại thị trường Việt Nam, đặc biệt là Đà Nẵng.  
* **Doanh nghiệp:**  
  * Đang hoạt động trong và ngoài các Khu công nghiệp (KCN), Khu công nghệ cao (KCNC) của Đà Nẵng.  
  * Các doanh nghiệp khởi nghiệp, doanh nghiệp vừa và nhỏ (SMEs) tìm kiếm thông tin hỗ trợ, mặt bằng, và cơ hội phát triển.  
* **Tổ** chức, đối tác **liên quan:**  
  * Các cơ quan chính phủ, sở ban ngành.  
  * Các hiệp hội doanh nghiệp, tổ chức xúc tiến thương mại và đầu tư.  
  * Các đơn vị tư vấn đầu tư, luật sư, kiểm toán.  
* **Công chúng quan tâm:**  
  * Các nhà nghiên cứu, sinh viên, báo chí và cộng đồng quan tâm đến tình hình kinh tế, đầu tư của Đà Nẵng.

### **1.3. Chức năng chính (Dựa trên cấu trúc hiện tại)**

* **Trang chủ (Homepage):**  
  * **Hero Section:** Trình chiếu hình ảnh/video nổi bật, thông điệp chính.  
  * **Quick Access Buttons:** Các nút truy cập nhanh đến các dịch vụ/thông tin quan trọng.  
  * **Featured Events:** Hiển thị các sự kiện đầu tư, hội thảo, diễn đàn nổi bật.  
  * **News Section:** Tin tức mới nhất về đầu tư, chính sách, hoạt động của DSEZA.  
  * **Functional Zones:** Giới thiệu các KCN, KCNC, Khu CNTT tập trung, Khu thương mại tự do.  
  * **Investment Info:** Thông tin tổng quan về môi trường đầu tư, ưu đãi, thủ tục.  
  * **Location:** Bản đồ vị trí, VR Tour (nếu có).  
  * **Resources:** Thư viện tài liệu, hình ảnh, video.  
  * **Businesses and Partners:** Giới thiệu các doanh nghiệp tiêu biểu, đối tác chiến lược.  
  * **Footer:** Thông tin liên hệ, bản quyền, liên kết hữu ích.  
* **Navigation (Điều hướng):**  
  * **Desktop Mega Menu:** Menu đa cấp, trực quan cho người dùng máy tính.  
  * **Mobile Menu:** Menu thân thiện, dễ sử dụng trên thiết bị di động.  
  * **Search Bar:** Chức năng tìm kiếm thông tin toàn trang.  
  * **Đa ngôn ngữ:** Hỗ trợ ít nhất Tiếng Việt và Tiếng Anh.  
  * **Đa theme:** Hỗ trợ giao diện Sáng (Light mode) và Tối (Dark mode).

### **1.4. Yêu cầu Phi chức năng**

* **Tính đáp ứng (Responsive Design):** Giao diện tự động điều chỉnh phù hợp trên mọi kích thước màn hình (desktop, tablet, mobile).  
* **Hiệu suất cao (High Performance):** Tốc độ tải trang nhanh, tối ưu hóa tài nguyên để đảm bảo trải nghiệm người dùng mượt mà.  
* **Bảo mật (Security):** Đảm bảo an toàn thông tin, chống lại các tấn công phổ biến (XSS, CSRF, SQL Injection nếu có phần backend).  
* **Khả năng truy cập (Accessibility \- a11y):** Tuân thủ các tiêu chuẩn về khả năng truy cập web (WCAG) để người dùng khuyết tật có thể sử dụng.  
* **Dễ bảo trì (Maintainability):** Cấu trúc code rõ ràng, module hóa, dễ dàng cập nhật và mở rộng.  
* **Khả năng mở rộng (Scalability):** Hệ thống có khả năng đáp ứng lượng truy cập tăng cao và mở rộng chức năng trong tương lai.  
* **Tính tương thích (Compatibility):** Hoạt động tốt trên các trình duyệt web phổ biến (Chrome, Firefox, Safari, Edge).

## **2\. Lập Kế hoạch**

### **2.1. Sitemap**

* Dựa trên cấu trúc menu và các trang đã được định nghĩa trong file sitemap.md và src/components/hero/navigation/menuData.tsx.  
* Cần rà soát và cập nhật để đảm bảo tính logic và đầy đủ.

### **2.2. Wireframe/Mockup**

* **Hiện trạng:** Chưa có.  
* **Yêu cầu:** Cần phát triển wireframe chi tiết cho tất cả các trang và luồng người dùng chính. Sau đó, phát triển mockup UI dựa trên wireframe và style guide.  
  * Wireframe cho trang chủ (desktop & mobile).  
  * Wireframe cho các trang con chính (ví dụ: chi tiết tin tức, chi tiết khu công nghiệp, trang liên hệ).  
  * Wireframe cho các luồng tương tác (ví dụ: tìm kiếm, chuyển đổi ngôn ngữ/theme).

### **2.3. Công nghệ**

* **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons, Recharts (đã xác định và đang sử dụng).  
* **Backend:**  
  * **Hiện trạng:** Chưa rõ ràng, hiện tại chủ yếu là dữ liệu tĩnh.  
  * **Yêu cầu:** Cần xác định rõ nhu cầu backend cho các chức năng động:  
    * Quản lý nội dung (CMS) cho tin tức, sự kiện, tài liệu, thông tin các khu chức năng.  
    * Quản lý người dùng (nếu có chức năng đăng nhập/đăng ký).  
    * Xử lý form liên hệ, phản ánh kiến nghị.  
    * Cung cấp API cho frontend.  
  * **Đề xuất công nghệ (tùy chọn):** Node.js (Express.js/NestJS), Python (Django/Flask), hoặc các giải pháp Headless CMS (Strapi, Contentful).  
* **Database:**  
  * **Hiện trạng:** Dữ liệu tĩnh.  
  * **Yêu cầu:** Lựa chọn CSDL phù hợp với backend được chọn (ví dụ: PostgreSQL, MySQL, MongoDB).  
* **Hosting:**  
  * **Hiện trạng:** Chưa xác định.  
  * **Yêu cầu:** Lựa chọn nhà cung cấp dịch vụ hosting/cloud phù hợp với yêu cầu về hiệu suất, khả năng mở rộng và chi phí (ví dụ: Vercel, Netlify cho frontend; AWS, Google Cloud, Azure cho backend và database).

## **3\. Thiết kế UI/UX**

### **3.1. Đã có**

* **Custom Colors:** Bảng màu tùy chỉnh cho DSEZA (light & dark mode) đã được định nghĩa trong tailwind.config.ts.  
* **Fonts:** Sử dụng Montserrat cho tiêu đề và Inter cho nội dung chính.  
* **Responsive Design:** Đang được triển khai với Tailwind CSS, có các component riêng cho mobile.  
* **CSS Variables:** Sử dụng CSS variables cho dark/light mode, giúp việc chuyển đổi theme dễ dàng.  
* **Glassmorphism Effect:** Áp dụng cho các thanh điều hướng (TopBar, NavigationBar).

### **3.2. Cần bổ sung**

* **Prototype tương tác:** Tạo prototype có thể click được dựa trên mockup để kiểm tra luồng người dùng và trải nghiệm.  
* **Style Guide hoàn chỉnh:**  
  * Chi tiết hóa việc sử dụng màu sắc, typography, spacing, iconography.  
  * Định nghĩa các trạng thái của component (hover, focus, active, disabled).  
  * Nguyên tắc thiết kế cho hình ảnh, video và các yếu tố đa phương tiện khác.  
  * Hướng dẫn về giọng văn và phong cách nội dung (tone of voice).  
* **Thiết kế chi tiết cho các component còn thiếu hoặc cần dữ liệu thật:** Ví dụ: Giao diện hiển thị chi tiết tài liệu, video; trang kết quả tìm kiếm.  
* **Thiết kế cho các chức năng động:** Form đăng nhập/đăng ký, trang quản trị nội dung (nếu có).

## **4\. Phát triển**

### **4.1. Frontend**

* **Hiện trạng:** Đang phát triển mạnh mẽ với các component React và dữ liệu tĩnh/placeholder.  
* **Công việc tiếp theo:**  
  * Hoàn thiện các component hiện có, đảm bảo tính tái sử dụng và tuân thủ style guide.  
  * Kết nối với API backend khi backend sẵn sàng để hiển thị dữ liệu động.  
  * Phát triển các chức năng tương tác người dùng (tìm kiếm, form).  
  * Tối ưu hóa hiệu suất (lazy loading, code splitting, memoization).  
  * Cải thiện khả năng truy cập (Accessibility \- a11y).

### **4.2. Backend**

* **Hiện trạng:** Chưa rõ ràng, cần định nghĩa chi tiết.  
* **Công việc tiếp theo:**  
  * **Xác** định rõ yêu **cầu:** Dựa trên các chức năng cần dữ liệu động (CMS, tìm kiếm, người dùng).  
  * **Lựa chọn công nghệ:** Quyết định stack công nghệ cho backend.  
  * **Thiết kế API:** Định nghĩa các endpoint API cho frontend sử dụng.  
  * **Phát triển API:** Xây dựng các API theo thiết kế.  
  * **Tích hợp CSDL:** Kết nối và tương tác với CSDL đã chọn.  
  * **Xây dựng hệ thống quản trị nội dung (CMS):** Nếu không sử dụng Headless CMS.

### **4.3. Database**

* **Hiện trạng:** Dữ liệu tĩnh trong code.  
* **Công việc tiếp theo:**  
  * **Thiết kế schema CSDL:** Dựa trên yêu cầu dữ liệu của các chức năng.  
  * **Triển khai CSDL:** Cài đặt và cấu hình CSDL trên môi trường phát triển/production.  
  * **Migrate dữ liệu:** Chuyển đổi dữ liệu tĩnh hiện tại (nếu cần) sang CSDL.

## **5\. Kiểm thử**

### **5.1. Kế hoạch kiểm thử**

* **Mục tiêu:** Đảm bảo chất lượng sản phẩm trước khi triển khai.  
* **Phạm vi:**  
  * **Kiểm** thử chức **năng (Functional Testing):** Tất cả các chức năng chính và phụ.  
  * **Kiểm thử UI/UX (UI/UX Testing):** Giao diện, trải nghiệm người dùng, tính nhất quán.  
  * **Kiểm thử tương thích (Compatibility Testing):** Trên các trình duyệt và thiết bị khác nhau (desktop, mobile, tablet).  
  * **Kiểm thử hiệu năng (Performance Testing):** Tốc độ tải trang, thời gian phản hồi.  
  * **Kiểm thử bảo mật (Security Testing):** Các lỗ hổng bảo mật cơ bản (nếu có backend).  
  * **Kiểm thử khả năng truy cập (Accessibility Testing):** Theo tiêu chuẩn WCAG.  
* **Quy trình:**  
  * Lập test case chi tiết.  
  * Thực hiện kiểm thử theo từng giai đoạn phát triển (unit test, integration test, system test, UAT).  
  * Ghi nhận, theo dõi và sửa lỗi.  
  * Kiểm thử hồi quy sau mỗi lần sửa lỗi hoặc cập nhật.

## **6\. Triển khai**

### **6.1. Kế hoạch triển khai**

* **Chuẩn bị:**  
  * Hoàn thiện tài liệu hướng dẫn sử dụng (cho người dùng cuối và quản trị viên).  
  * Cấu hình môi trường Production (server, database, domain).  
* **Quy trình:**  
  * Build phiên bản Production của ứng dụng.  
  * Triển khai lên môi trường Staging để kiểm thử cuối cùng (nếu có).  
  * Triển khai lên môi trường Production.  
  * Kiểm tra kỹ lưỡng sau triển khai.  
  * Thiết lập công cụ theo dõi hiệu suất và lỗi (ví dụ: Google Analytics, Sentry).  
  * Tạo và υποβάλ (submit) sitemap.xml cho các công cụ tìm kiếm.

## **7\. Bảo trì & Nâng cấp**

### **7.1. Kế hoạch bảo trì**

* **Sao lưu dữ liệu:** Thiết lập lịch sao lưu tự động và định kỳ cho CSDL và mã nguồn.  
* **Theo dõi hiệu suất và lỗi:** Giám sát liên tục hệ thống để phát hiện và khắc phục sự cố kịp thời.  
* **Cập nhật nội dung:** Quy trình cập nhật nội dung thường xuyên (tin tức, sự kiện, tài liệu) bởi Content Team.  
* **Cập nhật phần mềm:** Lên kế hoạch cập nhật các thư viện, framework, và hệ điều hành khi có phiên bản mới hoặc bản vá bảo mật.  
* **Hỗ trợ kỹ thuật:** Kênh tiếp nhận và xử lý các vấn đề kỹ thuật từ người dùng hoặc quản trị viên.

## **8\. Bảng Công Việc Triển Khai Tiếp Theo**

| STT | Giai đoạn | Công việc cụ thể | Ưu tiên | Người thực hiện | Ghi chú |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | Phát triển | **Hoàn thiện dữ liệu động cho các sections** | Cao | Frontend/Backend Dev | Xác định nguồn dữ liệu, API cho từng section |
| 2 | Phát triển | Tích hợp API (sau khi Backend hoàn thiện) | Cao | Frontend Dev | Kết nối frontend với các API đã có |
| 3 | Phát triển | Hoàn thiện Components (UI & Logic) | Cao | Frontend Dev | Resources, Businesses & Partners cần dữ liệu thật |
| 4 | Phát triển | Chức năng Tìm kiếm toàn trang | Trung bình | Frontend/Backend Dev | Bao gồm cả backend logic nếu cần |
| 5 | Phát triển | Chức năng Đăng nhập/Đăng ký (nếu có) | Trung bình | Frontend/Backend Dev | Xác định rõ phạm vi và yêu cầu |
| 6 | Phát triển | Tối ưu hiệu suất (Performance Optimization) | Trung bình | Frontend Dev | Tải trang, lazy loading, bundle size |
| 7 | Phát triển | Cải thiện Accessibility (a11y) | Trung bình | Frontend Dev | Tuân thủ WCAG |
| 8 | Thiết kế UI/UX | **Phát triển Wireframe & Mockup chi tiết** | Cao | UI/UX Designer | Cho các trang còn thiếu và luồng người dùng |
| 9 | Thiết kế UI/UX | **Hoàn thiện Style Guide** | Cao | UI/UX Designer | Chi tiết hóa các yếu tố thiết kế |
| 10 | Backend | **Xác định rõ yêu cầu & Chọn công nghệ Backend** | Cao | Tech Lead, Backend Dev | Quyết định stack, CMS, database |
| 11 | Backend | Thiết kế & Phát triển API | Cao | Backend Dev | Dựa trên yêu |

