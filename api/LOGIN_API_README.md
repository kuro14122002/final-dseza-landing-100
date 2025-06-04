# DSEZA Admin Login API Documentation

## Tổng quan

API đăng nhập cho hệ thống quản trị DSEZA Investment Hub. API này cho phép người dùng quản trị đăng nhập và nhận JWT token để xác thực các request khác.

## Endpoint

```
POST /api/v1/auth/login.php
```

## Cấu trúc thư mục

```
api/
├── v1/
│   └── auth/
│       └── login.php          # File API chính
├── core/
│   ├── Database.php           # Class xử lý kết nối database
│   ├── User.php              # Model User với các phương thức cần thiết
│   ├── AuthHelper.php        # Helper tạo và xác thực JWT
│   └── SimpleJWT.php         # Implementation JWT đơn giản
├── config/
│   ├── database.php          # Cấu hình database
│   └── jwt.php              # Cấu hình JWT
├── database_setup.sql        # Script tạo database và table
├── test_login_api.php       # Script test API
└── .htaccess               # Cấu hình URL rewriting và CORS
```

## Cài đặt và Thiết lập

### 1. Cấu hình Database

Chỉnh sửa file `api/config/database.php`:

```php
return [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'dseza_investment_hub',
    'username' => 'your_db_user',
    'password' => 'your_db_password',
    'charset' => 'utf8mb4',
    // ... other options
];
```

### 2. Tạo Database và Table

Chạy file `api/database_setup.sql` để tạo database và bảng `users_admin`:

```sql
-- Database sẽ tạo table users_admin với các field:
-- id, email, password_hash, role, full_name, is_active, created_at, updated_at
```

### 3. Cấu hình JWT

Chỉnh sửa file `api/config/jwt.php`:

```php
return [
    'secret_key' => 'YOUR_VERY_SECURE_SECRET_KEY_HERE',
    'issuer' => 'your-domain.com',
    'audience' => 'your-domain.com',
    'expiration_time' => 24 * 60 * 60, // 24 hours
    // ... other options
];
```

## Request Format

### Headers

```
Content-Type: application/json
```

### Body

```json
{
    "email": "admin@dseza.gov.vn",
    "password": "password123"
}
```

## Response Format

### Thành công (HTTP 200)

```json
{
    "status": "success",
    "message": "Login successful.",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "admin@dseza.gov.vn",
        "role": "Admin",
        "full_name": "System Administrator"
    }
}
```

### Lỗi Validation (HTTP 400)

```json
{
    "status": "error",
    "message": "Email and password are required."
}
```

```json
{
    "status": "error",
    "message": "Invalid email format."
}
```

### Lỗi Xác thực (HTTP 401)

```json
{
    "status": "error",
    "message": "Invalid credentials."
}
```

```json
{
    "status": "error",
    "message": "Account is inactive. Please contact administrator."
}
```

### Lỗi Server (HTTP 500)

```json
{
    "status": "error",
    "message": "An internal server error occurred. Please try again later."
}
```

## Tài khoản Test

File `database_setup.sql` tạo sẵn các tài khoản test:

| Email | Password | Role | Status |
|-------|----------|------|---------|
| admin@dseza.gov.vn | password123 | Admin | Active |
| editor@dseza.gov.vn | password123 | Editor | Active |
| manager@dseza.gov.vn | password123 | Admin | Active |
| test.editor@dseza.gov.vn | password123 | Editor | Active |
| inactive.user@dseza.gov.vn | password123 | Editor | Inactive |

## Sử dụng JWT Token

Token nhận được từ API login cần được gửi trong header `Authorization` của các request khác:

```
Authorization: Bearer your_jwt_token_here
```

### Payload của JWT Token

```json
{
    "iss": "danang-invest-hub.gov.vn",
    "aud": "danang-invest-hub.gov.vn",
    "iat": 1234567890,
    "exp": 1234654290,
    "user_id": 1,
    "email": "admin@dseza.gov.vn",
    "role": "Admin",
    "full_name": "System Administrator"
}
```

## Test API

### Sử dụng CURL

```bash
curl -X POST http://localhost/api/v1/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dseza.gov.vn","password":"password123"}'
```

### Sử dụng PHP Test Script

Chạy file `api/test_login_api.php` trong browser để test toàn bộ các case:

```
http://localhost/api/test_login_api.php
```

### Sử dụng JavaScript (Frontend)

```javascript
fetch('/api/v1/auth/login.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@dseza.gov.vn',
        password: 'password123'
    })
})
.then(response => response.json())
.then(data => {
    if (data.status === 'success') {
        // Lưu token để sử dụng cho các request khác
        localStorage.setItem('auth_token', data.token);
        console.log('Login successful:', data.user);
    } else {
        console.error('Login failed:', data.message);
    }
})
.catch(error => {
    console.error('Error:', error);
});
```

## Bảo mật

### Các biện pháp đã triển khai:

1. **Password Hashing**: Sử dụng `password_hash()` và `password_verify()` của PHP
2. **SQL Injection Prevention**: Sử dụng Prepared Statements
3. **JWT Signing**: Token được ký bằng secret key
4. **CORS Headers**: Cấu hình phù hợp cho cross-origin requests
5. **Input Validation**: Kiểm tra và validate tất cả input
6. **Error Handling**: Không tiết lộ thông tin nhạy cảm trong error messages
7. **Rate Limiting**: Cần thiết lập ở web server level

### Khuyến nghị thêm:

1. Sử dụng HTTPS trong production
2. Thiết lập rate limiting để chống brute force
3. Log các attempt đăng nhập thất bại
4. Thêm CAPTCHA sau một số lần thất bại
5. Sử dụng refresh token cho session dài hạn

## Troubleshooting

### Lỗi thường gặp:

1. **Connection failed**: Kiểm tra cấu hình database
2. **Invalid token**: Kiểm tra JWT secret key
3. **CORS errors**: Kiểm tra .htaccess và headers
4. **User not found**: Đảm bảo đã chạy database_setup.sql

### Debug:

Bật error reporting trong PHP:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

Kiểm tra log errors:
```php
error_log("Debug message");
```

## Phiên bản

- **v1.0**: Implementation cơ bản với JWT authentication
- **v1.1**: Thêm refresh token support
- **v1.2**: Cải thiện error handling và validation

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue hoặc liên hệ team phát triển. 