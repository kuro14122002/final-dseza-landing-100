# API Thống kê Admin Dashboard - Hướng dẫn Sử dụng

## Tổng quan

API endpoint `/api/v1/stats/overview` cung cấp dữ liệu thống kê tổng quan cho Admin Dashboard của hệ thống DSEZA Investment Hub.

## Thông tin Endpoint

- **URL**: `/api/v1/stats/overview`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Access Level**: Admin/Editor
- **Content-Type**: `application/json`

## Cấu hình và Cài đặt

### 1. Thiết lập Database

Trước khi sử dụng API, cần thực hiện các bước sau:

```bash
# 1. Chạy script setup cơ bản (tạo bảng users_admin)
mysql -u root -p dseza_investment_hub < api/database_setup.sql

# 2. Chạy script mở rộng (tạo bảng news_articles, event_articles, categories)
mysql -u root -p dseza_investment_hub < api/database_setup_extended.sql
```

### 2. Kiểm tra Cấu hình

Đảm bảo các file cấu hình đã được thiết lập:

- `api/config/database.php` - Cấu hình kết nối database
- `api/config/jwt.php` - Cấu hình JWT secret

### 3. Cấu trúc File

```
api/
├── v1/
│   └── stats/
│       └── overview.php          # API endpoint chính
├── core/
│   ├── Database.php              # Class quản lý database
│   └── AuthMiddleware.php        # Middleware xác thực
├── config/
│   ├── database.php              # Cấu hình database
│   └── jwt.php                   # Cấu hình JWT
├── database_setup.sql            # Script tạo bảng users_admin
├── database_setup_extended.sql   # Script tạo bảng news/events
└── STATS_API_GUIDE.md           # File hướng dẫn này
```

## Sử dụng API

### 1. Xác thực (Authentication)

Trước khi gọi API stats, cần lấy JWT token từ API đăng nhập:

```bash
# Đăng nhập để lấy token
curl -X POST http://your-domain/api/v1/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dseza.gov.vn",
    "password": "password123"
  }'
```

Response sẽ trả về JWT token:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "email": "admin@dseza.gov.vn",
      "role": "Admin",
      "full_name": "System Administrator"
    }
  }
}
```

### 2. Gọi API Stats

Sử dụng token để gọi API thống kê:

```bash
curl -X GET http://your-domain/api/v1/stats/overview.php \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Response Format

### Thành công (HTTP 200)

```json
{
  "status": "success",
  "data": {
    "totalNews": 5,
    "totalEvents": 3,
    "totalViewsThisMonth": 15200,
    "activeUsersThisMonth": 1200
  },
  "meta": {
    "generated_at": "2025-01-20T10:30:00+00:00",
    "generated_by": "admin@dseza.gov.vn",
    "user_role": "Admin"
  }
}
```

### Lỗi Xác thực (HTTP 401)

```json
{
  "status": "error",
  "message": "Access denied. Invalid or missing token.",
  "code": 401
}
```

### Lỗi Server (HTTP 500)

```json
{
  "status": "error",
  "message": "An internal server error occurred while fetching statistics.",
  "debug": {
    "timestamp": "2025-01-20T10:30:00+00:00",
    "error_message": "Database connection failed"
  }
}
```

## Kiểm thử với Postman

### 1. Thiết lập Collection

1. Tạo collection mới: "DSEZA Admin API"
2. Thiết lập Base URL: `http://your-domain/api`

### 2. Request 1: Login

- **Method**: POST
- **URL**: `{{base_url}}/v1/auth/login.php`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "admin@dseza.gov.vn",
    "password": "password123"
  }
  ```

### 3. Request 2: Get Stats

- **Method**: GET
- **URL**: `{{base_url}}/v1/stats/overview.php`
- **Headers**:
  ```
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```

### 4. Script lưu token tự động

Thêm vào **Tests** tab của request Login:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.status === 'success' && response.data.token) {
        pm.environment.set('token', response.data.token);
        console.log('Token saved:', response.data.token);
    }
}
```

## Troubleshooting

### 1. Lỗi "Table doesn't exist"

**Nguyên nhân**: Chưa chạy script tạo bảng

**Giải pháp**:
```bash
mysql -u root -p dseza_investment_hub < api/database_setup_extended.sql
```

### 2. Lỗi "Database connection failed"

**Nguyên nhân**: Cấu hình database không đúng

**Giải pháp**: Kiểm tra `api/config/database.php`

### 3. Lỗi "Invalid token"

**Nguyên nhân**: Token không hợp lệ hoặc đã hết hạn

**Giải pháp**: Đăng nhập lại để lấy token mới

### 4. Lỗi "Access denied"

**Nguyên nhân**: User không có quyền truy cập

**Giải pháp**: Đảm bảo user có role Admin hoặc Editor

## Mở rộng và Phát triển

### 1. Thêm Metric Mới

Để thêm metric mới vào API, chỉnh sửa file `api/v1/stats/overview.php`:

```php
// Thêm vào phần statistics array
$stats = [
    'totalNews' => 0,
    'totalEvents' => 0,
    'totalViewsThisMonth' => 15200,
    'activeUsersThisMonth' => 1200,
    'newMetric' => 0  // Thêm metric mới
];

// Thêm logic tính toán cho metric mới
try {
    $newMetricQuery = "SELECT COUNT(*) as total FROM your_table WHERE condition";
    $result = $database->fetchOne($newMetricQuery);
    $stats['newMetric'] = (int) $result['total'];
} catch (Exception $e) {
    error_log("Warning: Failed to calculate new metric: " . $e->getMessage());
    $stats['newMetric'] = 0;
}
```

### 2. Triển khai Page Views Tracking

Tạo bảng để track lượt xem:

```sql
CREATE TABLE page_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_type ENUM('news', 'event') NOT NULL,
    article_id INT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    view_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_article_type (article_type),
    INDEX idx_article_id (article_id),
    INDEX idx_view_timestamp (view_timestamp)
);
```

### 3. Triển khai User Activity Tracking

Tạo bảng để track hoạt động user:

```sql
CREATE TABLE user_login_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time)
);
```

## Bảo mật

1. **HTTPS**: Luôn sử dụng HTTPS trong production
2. **Rate Limiting**: Cân nhắc thêm rate limiting cho API
3. **Input Validation**: Đã được xử lý trong AuthMiddleware
4. **Error Logging**: Lỗi được log nhưng không expose details cho client
5. **SQL Injection**: Sử dụng Prepared Statements

## Performance

1. **Database Indexing**: Đã thêm indexes cho các truy vấn thường dùng
2. **Caching**: Cân nhắc thêm Redis/Memcached cho caching
3. **Query Optimization**: Sử dụng COUNT(*) thay vì SELECT *

## Monitoring

Theo dõi các metrics sau:

1. Response time của API
2. Tần suất lỗi 500
3. Số lượng request per minute
4. Database connection pool usage

---

**Lưu ý**: File này là phiên bản đầu tiên của API stats. Các tính năng như page views và user activity tracking sẽ được triển khai trong các phiên bản tiếp theo. 