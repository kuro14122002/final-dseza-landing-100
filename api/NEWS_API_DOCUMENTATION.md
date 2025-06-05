# 📰 News Management API Documentation

## Tổng quan

Bộ API CRUD hoàn chỉnh cho quản lý tin tức trong Admin Panel của dự án "danang-invest-hub-online". API này được bảo vệ bằng JWT token và hỗ trợ phân quyền theo vai trò (Admin/Editor).

## Xác thực

Tất cả các endpoint đều yêu cầu JWT token trong header:
```
Authorization: Bearer {your_jwt_token}
```

## Base URL
```
http://localhost/final-dseza-landing-85/api/v1/admin
```

---

## 📋 1. Lấy danh sách tin tức

**GET** `/news`

### Tham số Query (tùy chọn)

| Tham số | Loại | Mô tả | Mặc định |
|---------|------|-------|----------|
| `page` | integer | Số trang | 1 |
| `limit` | integer | Số lượng tin tức trên mỗi trang (tối đa 50) | 10 |
| `searchTerm` | string | Tìm kiếm trong tiêu đề, excerpt | "" |
| `categoryId` | integer | Lọc theo ID danh mục | null |
| `status` | string | Lọc theo trạng thái: draft, pending, published | "" |
| `authorId` | integer | Lọc theo ID tác giả | null |
| `sortBy` | string | Trường sắp xếp: id, title, status, publish_date, created_at, updated_at | publish_date |
| `sortDirection` | string | Hướng sắp xếp: ASC, DESC | DESC |

### Ví dụ Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news?page=1&limit=10&status=published&sortBy=publish_date&sortDirection=DESC"
```

### Response (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "slug": "bai-viet-dau-tu-moi",
      "title": "Bài viết đầu tư mới",
      "title_en": "New Investment Article",
      "excerpt": "Tóm tắt bài viết...",
      "category_name_vi": "Kinh tế",
      "category_name_en": "Economy",
      "author_name_full": "Admin User",
      "status": "published",
      "is_featured": 1,
      "publish_date": "2025-06-05 10:00:00",
      "created_at": "2025-06-05 09:00:00",
      "updated_at": "2025-06-05 10:00:00"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## ➕ 2. Tạo tin tức mới

**POST** `/news`

### Request Body
```json
{
  "title": "Tiêu đề bài viết",
  "title_en": "Article Title in English",
  "slug": "tieu-de-bai-viet", // Tùy chọn, tự động tạo nếu không có
  "excerpt": "Tóm tắt bài viết",
  "excerpt_en": "Article excerpt in English",
  "content": "Nội dung đầy đủ của bài viết",
  "content_en": "Full content in English",
  "category_id": 1,
  "status": "draft", // draft, pending, published
  "is_featured": 0, // 0 hoặc 1
  "image_url": "https://example.com/image.jpg",
  "reading_time": "5 phút",
  "reading_time_en": "5 minutes",
  "publish_date": "2025-06-05 10:00:00"
}
```

### Trường bắt buộc
- `title`
- `content`
- `category_id`

### Ví dụ Request
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Tin tức mới về đầu tư",
       "content": "Nội dung chi tiết về tin tức đầu tư...",
       "category_id": 1,
       "status": "draft"
     }' \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news"
```

### Response (201 Created)
```json
{
  "status": "success",
  "message": "News article created successfully.",
  "data": {
    "id": 15,
    "slug": "tin-tuc-moi-ve-dau-tu",
    "title": "Tin tức mới về đầu tư",
    "author_id": 1,
    "author_name": "Admin User",
    "created_at": "2025-06-05 14:30:00",
    // ... các trường khác
  }
}
```

---

## 📖 3. Lấy chi tiết tin tức

**GET** `/news/{id}`

### Ví dụ Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news/1"
```

### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "slug": "bai-viet-dau-tu",
    "title": "Bài viết đầu tư",
    "title_en": "Investment Article",
    "excerpt": "Tóm tắt...",
    "excerpt_en": "Excerpt...",
    "content": "Nội dung đầy đủ...",
    "content_en": "Full content...",
    "image_url": "https://example.com/image.jpg",
    "category_id": 1,
    "category_name_vi": "Kinh tế",
    "category_name_en": "Economy",
    "status": "published",
    "is_featured": 1,
    "reading_time": "5 phút",
    "reading_time_en": "5 minutes",
    "author_id": 1,
    "author_name": "Admin User",
    "author_name_full": "System Administrator",
    "author_email": "admin@dseza.gov.vn",
    "publish_date": "2025-06-05 10:00:00",
    "created_at": "2025-06-05 09:00:00",
    "updated_at": "2025-06-05 10:00:00"
  }
}
```

### Response (404 Not Found)
```json
{
  "status": "error",
  "message": "News article not found."
}
```

---

## ✏️ 4. Cập nhật tin tức

**PUT** `/news/{id}`

### Request Body
```json
{
  "title": "Tiêu đề đã cập nhật",
  "title_en": "Updated Title",
  "status": "published",
  "is_featured": 1,
  "excerpt": "Tóm tắt mới...",
  "content": "Nội dung đã cập nhật..."
}
```

### Ví dụ Request
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Tiêu đề đã cập nhật",
       "status": "published"
     }' \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news/1"
```

### Response (200 OK)
```json
{
  "status": "success",
  "message": "News article updated successfully.",
  "data": {
    "id": 1,
    "title": "Tiêu đề đã cập nhật",
    "status": "published",
    "updated_at": "2025-06-05 15:00:00",
    // ... các trường khác
  }
}
```

---

## 🗑️ 5. Xóa tin tức

**DELETE** `/news/{id}`

### Ví dụ Request
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news/1"
```

### Response (200 OK)
```json
{
  "status": "success",
  "message": "News article deleted successfully."
}
```

**Lưu ý:** Đây là soft delete - bài viết sẽ được đánh dấu status = 'deleted' thay vì xóa hoàn toàn.

---

## 🔍 6. Kiểm tra slug duy nhất

**GET** `/check-slug`

### Tham số Query

| Tham số | Loại | Mô tả | Bắt buộc |
|---------|------|-------|----------|
| `slug` | string | Slug cần kiểm tra | Có |
| `excludeId` | integer | ID bài viết loại trừ (khi chỉnh sửa) | Không |

### Ví dụ Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/check-slug?slug=tin-tuc-moi&excludeId=5"
```

### Response (200 OK)
```json
{
  "status": "success",
  "is_unique": true,
  "slug": "tin-tuc-moi",
  "message": "Slug is available."
}
```

hoặc

```json
{
  "status": "success",
  "is_unique": false,
  "slug": "tin-tuc-dau-tu",
  "message": "Slug is already taken."
}
```

---

## 🏷️ 7. Lấy danh sách danh mục

**GET** `/categories`

### Ví dụ Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/categories"
```

### Response (200 OK)
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name_vi": "Kinh tế",
      "name_en": "Economy",
      "slug": "kinh-te"
    },
    {
      "id": 2,
      "name_vi": "Đầu tư",
      "name_en": "Investment",
      "slug": "dau-tu"
    }
  ]
}
```

---

## 🔒 Phân quyền

### Admin
- Có thể thực hiện tất cả các thao tác CRUD
- Có thể xem và chỉnh sửa bài viết của tất cả tác giả
- Có thể thay đổi status thành "published"
- Có thể xóa bất kỳ bài viết nào

### Editor
- Có thể tạo bài viết mới (status mặc định: "pending")
- Chỉ có thể xem và chỉnh sửa bài viết của chính mình
- Không thể thay đổi status thành "published" trực tiếp
- Chỉ có thể xóa bài viết của chính mình

---

## ⚠️ Xử lý lỗi

### Mã lỗi HTTP

| Mã | Mô tả | Ví dụ |
|----|-------|-------|
| 400 | Bad Request | Thiếu trường bắt buộc, dữ liệu không hợp lệ |
| 401 | Unauthorized | Token không hợp lệ hoặc hết hạn |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy bài viết |
| 405 | Method Not Allowed | Phương thức HTTP không được hỗ trợ |
| 500 | Internal Server Error | Lỗi server |

### Định dạng response lỗi
```json
{
  "status": "error",
  "message": "Mô tả lỗi chi tiết"
}
```

---

## 🧪 Testing

### Chạy test tự động
```bash
# Truy cập trong browser
http://localhost/final-dseza-landing-85/api/test_news_api.php
```

### Test thủ công với cURL

1. **Đăng nhập để lấy token:**
```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@dseza.gov.vn", "password": "password123"}' \
     "http://localhost/final-dseza-landing-85/api/v1/auth/login.php"
```

2. **Lấy danh sách tin tức:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news"
```

3. **Tạo tin tức mới:**
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Article", "content": "Test content", "category_id": 1}' \
     "http://localhost/final-dseza-landing-85/api/v1/admin/news"
```

---

## 📋 Danh sách Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/news` | Lấy danh sách tin tức |
| POST | `/admin/news` | Tạo tin tức mới |
| GET | `/admin/news/{id}` | Lấy chi tiết tin tức |
| PUT | `/admin/news/{id}` | Cập nhật tin tức |
| DELETE | `/admin/news/{id}` | Xóa tin tức |
| GET | `/admin/check-slug` | Kiểm tra slug duy nhất |
| GET | `/admin/categories` | Lấy danh sách danh mục |

---

## 💡 Lưu ý quan trọng

1. **Slug tự động:** Nếu không cung cấp slug, hệ thống sẽ tự động tạo từ title (loại bỏ dấu tiếng Việt)
2. **Unique slug:** Hệ thống đảm bảo slug luôn duy nhất bằng cách thêm số vào cuối nếu cần
3. **Soft delete:** Xóa bài viết chỉ thay đổi status thành 'deleted', không xóa vĩnh viễn
4. **Validation:** Tất cả input đều được validate kỹ lưỡng
5. **Rate limiting:** Giới hạn tối đa 50 items per page
6. **Security:** Sử dụng prepared statements để tránh SQL injection

---

## 🔧 Cài đặt và Cấu hình

### Yêu cầu hệ thống
- PHP 7.4+
- MySQL 5.7+ hoặc 8.0+
- Extension: PDO, JSON, cURL

### Database Schema
Bảng `news_articles` đã có sẵn với đầy đủ các trường cần thiết.

### Thông tin đăng nhập test
- **Admin:** admin@dseza.gov.vn / password123
- **Editor:** editor@dseza.gov.vn / password123 