# DSEZA Portal REST API

Hệ thống REST API cho Cổng thông tin DSEZA được xây dựng bằng PHP, hỗ trợ quản lý tin tức và danh mục với xác thực JWT.

## 🚀 Tính năng chính

- **Xác thực JWT**: Bảo mật với JSON Web Tokens
- **CRUD tin tức**: Tạo, đọc, cập nhật, xóa bài viết
- **Quản lý danh mục**: Phân loại tin tức theo chủ đề
- **Phân quyền**: Admin và Editor roles
- **CORS**: Hỗ trợ cross-origin requests
- **Multilingual**: Hỗ trợ tiếng Việt và tiếng Anh
- **Clean URLs**: SEO-friendly URLs với .htaccess

## 📋 Yêu cầu hệ thống

- PHP 8.0 trở lên
- MySQL/MariaDB 5.7 trở lên
- Apache/Nginx với mod_rewrite
- PDO extension
- JSON extension

## 🛠️ Cài đặt

### 1. Chuẩn bị cơ sở dữ liệu

```bash
# Truy cập vào thư mục API
cd api

# Chạy script thiết lập database
php database_setup.php
```

Hoặc truy cập: `http://localhost/final-dseza-landing-85/api/database_setup.php`

### 2. Cấu hình API

```bash
# Sao chép file cấu hình mẫu
cp config.example.php config.php

# Chỉnh sửa thông tin kết nối database
nano config.php
```

### 3. Cấu hình Apache

Đảm bảo mod_rewrite được bật:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 4. Phân quyền thư mục

```bash
# Cấp quyền ghi cho thư mục uploads (nếu có)
chmod 755 uploads/
```

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Thông tin user hiện tại | ✅ |
| POST | `/api/auth/verify` | Xác thực token | ❌ |
| POST | `/api/auth/refresh` | Làm mới token | ✅ |
| POST | `/api/auth/logout` | Đăng xuất | ❌ |

### News Articles

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/news` | Danh sách tin tức | ❌ |
| GET | `/api/news/{id}` | Chi tiết bài viết | ❌ |
| GET | `/api/news/featured` | Tin nổi bật | ❌ |
| GET | `/api/news/category/{slug}` | Tin theo danh mục | ❌ |
| GET | `/api/news/{id}/related` | Tin liên quan | ❌ |
| POST | `/api/news` | Tạo bài viết mới | ✅ Editor |
| PUT | `/api/news/{id}` | Cập nhật bài viết | ✅ Editor |
| DELETE | `/api/news/{id}` | Xóa bài viết | ✅ Admin |

### Categories

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/categories` | Danh sách danh mục | ❌ |
| GET | `/api/categories/{id}` | Chi tiết danh mục | ❌ |
| GET | `/api/categories/type/{type}` | Danh mục theo loại | ❌ |
| POST | `/api/categories` | Tạo danh mục mới | ✅ Admin |
| PUT | `/api/categories/{id}` | Cập nhật danh mục | ✅ Admin |
| DELETE | `/api/categories/{id}` | Xóa danh mục | ✅ Admin |
| PUT | `/api/categories/{id}/toggle` | Bật/tắt danh mục | ✅ Admin |

## 📝 Sử dụng API

### 1. Đăng nhập

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const data = await response.json();
const token = data.data.token;
```

### 2. Lấy danh sách tin tức

```javascript
const response = await fetch('/api/news?page=1&limit=10&categoryId=1');
const data = await response.json();
```

### 3. Tạo bài viết mới

```javascript
const response = await fetch('/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Tiêu đề bài viết',
    excerpt: 'Tóm tắt bài viết',
    content: 'Nội dung chi tiết...',
    category_id: 1,
    status: 'published',
    is_featured: false
  })
});
```

## 🔒 Xác thực và Phân quyền

API sử dụng JWT (JSON Web Tokens) để xác thực. Token có hiệu lực 24 giờ.

### Headers yêu cầu:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Roles:
- **Admin**: Toàn quyền (CRUD tất cả)
- **Editor**: Tạo/sửa bài viết, xem danh mục

## 📊 Response Format

### Success Response:
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response:
```json
{
  "status": "error",
  "message": "Error description",
  "code": 400,
  "details": "Additional error details"
}
```

## 🔧 Query Parameters

### News Endpoints:
- `page`: Số trang (mặc định: 1)
- `limit`: Số items per page (mặc định: 9, tối đa: 100)
- `categoryId`: ID danh mục
- `featured`: Lọc tin nổi bật (true/false)
- `status`: Trạng thái (published/draft/pending)

### Categories Endpoints:
- `type`: Loại danh mục
- `active`: Trạng thái active (true/false)
- `page`: Số trang
- `limit`: Số items per page

## 🛡️ Bảo mật

- Mật khẩu được hash bằng bcrypt
- JWT tokens với expiration time
- SQL injection protection với PDO prepared statements
- XSS protection với proper escaping
- CORS configuration
- Rate limiting (optional)

## 🚨 Lỗi thường gặp

### 1. Database Connection Failed
```
Lỗi: Database connection failed
Giải pháp: Kiểm tra thông tin database trong config.php
```

### 2. Invalid Token
```
Lỗi: Invalid or expired token
Giải pháp: Đăng nhập lại để lấy token mới
```

### 3. 404 Not Found
```
Lỗi: Endpoint not found
Giải pháp: Kiểm tra mod_rewrite và .htaccess
```

## 📈 Hiệu năng

- Database indexing cho các trường thường query
- Gzip compression
- Proper caching headers
- Optimized SQL queries với JOINs

## 🔄 Migration và Backup

### Backup Database:
```bash
mysqldump -u root -p dseza_portal > backup.sql
```

### Restore Database:
```bash
mysql -u root -p dseza_portal < backup.sql
```

## 👥 Tài khoản mặc định

Sau khi chạy `database_setup.php`:

- **Username**: admin
- **Password**: admin123
- **Email**: admin@dseza.gov.vn
- **Role**: admin

⚠️ **Quan trọng**: Thay đổi mật khẩu mặc định ngay sau lần đăng nhập đầu tiên!

## 🐛 Debug và Logging

Trong môi trường development, errors sẽ được hiển thị. Trong production:

```php
// Tắt hiển thị errors
error_reporting(0);
ini_set('display_errors', 0);

// Logs được ghi vào error_log
error_log("Error message here");
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra log errors
2. Xem documentation này
3. Kiểm tra database và network connectivity
4. Liên hệ team development

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Maintainer**: DSEZA Development Team 