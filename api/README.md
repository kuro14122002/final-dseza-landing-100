# DSEZA Admin Panel API - Hướng dẫn Cài đặt và Sử dụng

## Tổng quan
API đăng nhập cho Admin Panel của dự án DSEZA Investment Hub, được phát triển bằng PHP và MySQL với JWT authentication.

## Yêu cầu Hệ thống

### Phiên bản PHP
- PHP >= 7.4 (khuyên dùng PHP 8.0+)
- Extensions: PDO, PDO_MySQL, OpenSSL, JSON

### Cơ sở dữ liệu
- MySQL >= 5.7 hoặc MariaDB >= 10.2

### Web Server
- Apache (với mod_rewrite) hoặc Nginx

## Cài đặt

### 1. Clone hoặc Download API
```bash
# Nếu API nằm trong project chính
cd your-project-root/api
```

### 2. Cấu hình Cơ sở dữ liệu
```bash
# Tạo database và bảng users_admin
mysql -u root -p < database_setup.sql
```

### 3. Cấu hình JWT Secret
Chỉnh sửa file `config/jwt.php` và thay đổi `secret_key`:
```php
'secret_key' => 'your-super-secret-jwt-key-change-this-in-production-min-256-bits'
```

**Quan trọng**: Secret key phải có ít nhất 256 bits (32 characters) và được giữ bí mật.

### 4. Cấu hình Database Connection
Chỉnh sửa file `config/database.php` với thông tin kết nối database của bạn:
```php
return [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'dseza_investment_hub',
    'username' => 'your_db_user',
    'password' => 'your_db_password',
    // ...
];
```

### 5. Cấu hình Web Server

#### Apache
File `.htaccess` đã được tạo sẵn. Đảm bảo mod_rewrite được bật:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Nginx
Thêm vào cấu hình nginx:
```nginx
location /api/ {
    try_files $uri $uri/ /api/index.php?$query_string;
}

location ~ ^/api/admin/auth/login$ {
    try_files $uri /api/v1/auth/login.php;
}
```

### 6. Set Permissions
```bash
# Đảm bảo PHP có thể ghi log
chmod 755 api/
chmod 644 api/config/*.php
```

## Cấu trúc Thư mục

```
api/
├── v1/
│   └── auth/
│       └── login.php          # API endpoint chính
├── config/
│   ├── database.php           # Cấu hình database
│   ├── jwt.php               # Cấu hình JWT
│   └── config.example.php    # Template cấu hình
├── core/
│   ├── Database.php          # Class quản lý database
│   ├── User.php             # Model User
│   ├── AuthHelper.php       # Helper JWT
│   └── SimpleJWT.php        # JWT implementation
├── vendor/                   # Composer dependencies (optional)
├── composer.json            # Quản lý dependencies
├── database_setup.sql       # Script tạo database
├── .htaccess               # Cấu hình Apache
└── README.md              # Tài liệu này
```

## API Endpoints

### POST /api/admin/auth/login

#### Request
```bash
curl -X POST http://your-domain/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dseza.gov.vn",
    "password": "password123"
  }'
```

#### Success Response (200 OK)
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

#### Error Responses

**400 Bad Request** (Dữ liệu không hợp lệ):
```json
{
  "status": "error",
  "message": "Email and password are required."
}
```

**401 Unauthorized** (Sai thông tin đăng nhập):
```json
{
  "status": "error",
  "message": "Invalid credentials."
}
```

**500 Internal Server Error**:
```json
{
  "status": "error",
  "message": "An internal server error occurred. Please try again later."
}
```

## Tài khoản Test

Sau khi chạy `database_setup.sql`, các tài khoản test sau sẽ được tạo:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@dseza.gov.vn | password123 | Admin | Active |
| editor@dseza.gov.vn | password123 | Editor | Active |
| manager@dseza.gov.vn | password123 | Admin | Active |
| test.editor@dseza.gov.vn | password123 | Editor | Active |
| inactive.user@dseza.gov.vn | password123 | Editor | Inactive |

## Bảo mật

### JWT Token
- Token có thời hạn 24 giờ
- Được ký bằng HMAC-SHA256
- Chứa thông tin: user_id, email, role, full_name
- Sử dụng SimpleJWT implementation (có thể nâng cấp lên firebase/php-jwt cho production)

### Password Security
- Mật khẩu được hash bằng PHP `password_hash()` với thuật toán BCRYPT
- Không bao giờ trả về password hash trong response

### Input Validation
- Validate email format
- Check required fields
- Sanitize input data
- Prepared statements để tránh SQL injection

### CORS
- Configured trong `.htaccess`
- Cho phép requests từ frontend development servers

## Troubleshooting

### Lỗi Database Connection
```
Database connection failed
```
**Giải pháp**: Kiểm tra thông tin kết nối trong `config/database.php`

### Lỗi JWT
```
Token creation failed
```
**Giải pháp**: 
1. Kiểm tra SimpleJWT.php có tồn tại
2. Đảm bảo secret key đủ mạnh

### Lỗi 500 Internal Server Error
**Giải pháp**:
1. Kiểm tra PHP error logs
2. Đảm bảo tất cả file có permissions phù hợp
3. Kiểm tra PHP extensions được yêu cầu

### CORS Issues
Nếu frontend không thể gọi API:
1. Kiểm tra `.htaccess` hoặc cấu hình Nginx
2. Đảm bảo headers CORS được set đúng

## Testing API

### Bằng cURL
```bash
# Test successful login
curl -X POST http://localhost/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dseza.gov.vn","password":"password123"}'

# Test invalid credentials
curl -X POST http://localhost/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'
```

### Bằng Postman hoặc Insomnia
1. Tạo POST request đến endpoint
2. Set header `Content-Type: application/json`
3. Thêm body JSON với email và password
4. Gửi request và kiểm tra response

## Production Deployment

### Checklist Bảo mật
- [ ] Thay đổi JWT secret key
- [ ] Sử dụng HTTPS
- [ ] Cấu hình database user với quyền hạn tối thiểu
- [ ] Disable PHP error display
- [ ] Set up proper logging
- [ ] Update CORS allowed origins
- [ ] Regular security updates
- [ ] Consider upgrading to firebase/php-jwt for production

### Environment Variables
Khuyên dùng biến môi trường thay vì hardcode trong config files:
```php
// Trong config files
'secret_key' => $_ENV['JWT_SECRET'] ?? 'fallback-key'
```

### Nâng cấp JWT Library (Tùy chọn)
Để sử dụng firebase/php-jwt thay vì SimpleJWT:
```bash
composer require firebase/php-jwt
```
Sau đó cập nhật `AuthHelper.php` để sử dụng Firebase\JWT\JWT.

## Support và Liên hệ

Để báo cáo lỗi hoặc yêu cầu hỗ trợ, vui lòng liên hệ team phát triển DSEZA Investment Hub project. 