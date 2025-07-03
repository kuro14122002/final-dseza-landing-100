## **Phần III: Thiết kế Chi tiết \- Trang Quản trị (Admin Panel)**

Trang Quản trị (Admin Panel) là trung tâm chỉ huy, nơi Ban biên tập và các quản trị viên hệ thống thực hiện mọi tác vụ vận hành Cổng thông tin. Do đó, thiết kế của trang này phải ưu tiên sự hiệu quả, trực quan và khả năng kiểm soát toàn diện.

### **3.1 Cấu trúc và Bố cục Giao diện (UI/UX)**

Giao diện trang quản trị sẽ được thiết kế theo các nguyên tắc hiện đại, đảm bảo người dùng có thể thực hiện công việc một cách nhanh chóng và chính xác.

* **Bảng điều khiển chính (Dashboard):** Khi đăng nhập, người dùng sẽ thấy một màn hình tổng quan, cung cấp các thông tin quan trọng và cần hành động ngay lập tức, ví dụ:  
  * Số lượng bài viết đang chờ duyệt.  
  * Số lượng câu hỏi, góp ý, bình luận mới chưa được xử lý.  
  * Biểu đồ nhanh về lượt truy cập trong 7 ngày qua.  
  * Các lối tắt (shortcuts) đến các chức năng thường sử dụng.  
* **Thanh điều hướng bên (Sidebar Navigation):** Menu chính sẽ được đặt ở thanh bên trái, được phân cấp rõ ràng theo các nhóm chức năng lớn. Menu này có thể thu gọn để tăng không gian làm việc. Cấu trúc đề xuất:  
  * **Quản trị Nội dung:** Tin tức, Chuyên mục, Văn bản, Thư viện Ảnh, Thư viện Video, Lịch công tác, Liên kết Website.  
  * **Quản trị Tương tác:** Hỏi \- Đáp, Góp ý \- Bình luận, Thăm dò ý kiến.  
  * **Quản trị Giao diện:** Quản lý Menu, Quản lý Bố cục.  
  * **Quản trị Hệ thống:** Quản lý Thành viên, Quản lý Phân quyền, Quản lý Ngôn ngữ, Cấu hình chung.  
  * **Thống kê & Báo cáo:** Báo cáo tin bài, Báo cáo truy cập.  
* **Luồng công việc (Workflow) trực quan:** Các quy trình nghiệp vụ, đặc biệt là quy trình duyệt và xuất bản nội dung, sẽ được thể hiện rõ ràng. Ví dụ, một bài viết sẽ có các trạng thái như "Bản nháp", "Chờ duyệt", "Đã duyệt", "Đã xuất bản", được hiển thị bằng các nhãn màu sắc khác nhau để dễ nhận biết.

### **3.2 Phân rã Chi tiết các Module Chức năng**

Mỗi nhóm chức năng trong hợp đồng sẽ được hiện thực hóa thành một module cụ thể trong trang quản trị.  

#### **3.2.1 Module Quản trị Người dùng & Phân quyền (Mục 1, 2, 3, 6\)**

Đây là module nền tảng, đảm bảo an ninh và phân cấp trách nhiệm.

* **Quản lý Nhóm thành viên & Nhóm quyền:** Cho phép Super Admin tạo ra các nhóm người dùng (ví dụ: Ban Biên Tập, Phóng Viên, Cán bộ trả lời Hỏi-Đáp) và các nhóm quyền (ví dụ: Quyền Đăng bài, Quyền Duyệt bài, Quyền Quản lý Người dùng).  
* **Quản lý Thành viên:** Cung cấp giao diện để thêm mới, chỉnh sửa thông tin, khóa/mở khóa tài khoản thành viên. Mỗi thành viên sẽ được gán vào một hoặc nhiều nhóm. Có chức năng tìm kiếm và lọc thành viên theo tên, email, nhóm.  
* **Phân quyền chi tiết trên Chuyên mục:** Một tính năng quan trọng cho phép quản trị viên cấp cao gán quyền quản lý (đăng, sửa, xóa, duyệt bài) cho một tài khoản cụ thể trên một hoặc nhiều chuyên mục tin tức nhất định. Điều này giúp phân chia rõ ràng trách nhiệm biên tập cho từng mảng nội dung.

#### **3.2.2 Module Quản trị Nội dung (Mục 5, 7, 8, 9, 10, 11\)**

Đây là nhóm module được sử dụng thường xuyên nhất bởi Ban biên tập.

* **Quản trị Tin tức, Bài viết:**  
  * Trình soạn thảo văn bản WYSIWYG (What You See Is What You Get) mạnh mẽ, hỗ trợ định dạng văn bản, chèn ảnh, video, bảng biểu.  
  * Quản lý Chuyên mục đa cấp (cha-con).  
  * Quản lý Thẻ (Tags) để nhóm các bài viết liên quan.  
  * Chức năng lên lịch xuất bản bài viết.  
  * Lưu trữ lịch sử các phiên bản của bài viết, cho phép xem lại và khôi phục các thay đổi.  
* **Quản lý Hệ thống Văn bản:**  
  * Quản lý các danh mục dùng chung: Lĩnh vực, Cơ quan ban hành, Cấp ban hành.  
  * Chức năng tải lên các tệp văn bản (PDF, DOC, DOCX, XLS...) và gắn siêu dữ liệu (metadata) như số hiệu, ngày ban hành, trích yếu.  
* **Quản lý Thư viện Đa phương tiện:**  
  * Giao diện quản lý tập trung cho hình ảnh và video.  
  * Cho phép tạo các album ảnh, tải lên hàng loạt.  
  * Chức năng chỉnh sửa thông tin cho ảnh (chú thích, văn bản thay thế \- alt text để tuân thủ WCAG).  
  * Tích hợp trình phát video tương thích với các định dạng phổ biến.  
* **Quản lý Liên kết Website và Lịch công tác:** Các giao diện đơn giản để thêm/sửa/xóa các liên kết và cập nhật lịch công tác hàng tuần. Tích hợp API để đồng bộ lịch công tác từ Hệ thống Quản lý văn bản điều hành.

#### **3.2.3 Module Quản trị Tương tác (Mục 15, 17, 19, 20\)**

* **Quản trị Góp ý & Bình luận:** Giao diện hiển thị danh sách các góp ý, bình luận mới. Quản trị viên có thể duyệt, ẩn, xóa hoặc trả lời trực tiếp. Tích hợp Google reCAPTCHA để chống spam.  
* **Quản trị Thăm dò ý kiến (Bình chọn):** Cho phép tạo câu hỏi và các phương án trả lời. Hệ thống sẽ tự động tổng hợp và hiển thị kết quả dưới dạng biểu đồ phần trăm.  
* **Quản trị Hỏi \- Đáp:** Giao diện quản lý câu hỏi được gửi từ người dân/doanh nghiệp, phân loại theo lĩnh vực. Cho phép chuyển câu hỏi đến cán bộ chuyên trách để trả lời. Quản trị viên có quyền quyết định công khai câu hỏi và câu trả lời hoặc chỉ gửi riêng cho người hỏi.

#### **3.2.4 Module Quản trị Hệ thống & Giao diện (Mục 4, 12, 13, 14, 16, 21, 22, 23, 24\)**

* **Quản lý Menu và Bố cục:** Cung cấp công cụ trực quan, có thể là kéo-thả (drag-and-drop), để quản trị viên có thể dễ dàng sắp xếp thứ tự các mục trong menu chính và cấu hình các khối chức năng (widgets/blocks) hiển thị trên trang chủ và các trang con.  
* **Quản lý Ngôn ngữ:** Cung cấp giao diện để quản lý các ngôn ngữ hiển thị trên website. Cho phép quản trị viên nhập bản dịch cho các chuỗi văn bản tĩnh (ví dụ: "Trang chủ", "Tìm kiếm", "Đọc thêm"...).  
* **Thống kê & Báo cáo:** Module này sẽ thống kê số lượng tin bài theo nhiều tiêu chí (chuyên mục, tác giả, khoảng thời gian) và cho phép xuất báo cáo ra file Excel. Quan trọng hơn, nó sẽ được tích hợp với Hệ thống EMC của Bộ TTTT để gửi dữ liệu giám sát theo quy định.    
* **Cấu hình chung:** Nơi quản trị viên có thể thay đổi các thông tin cơ bản của website như tên trang, logo, thông tin liên hệ ở chân trang, bật/tắt các tính năng như bình luận, chia sẻ mạng xã hội.

