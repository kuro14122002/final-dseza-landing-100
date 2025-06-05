# 🚀 DSEZA API Testing Guide

## Tổng quan
Hướng dẫn này sẽ giúp bạn test API của dự án DSEZA Investment Hub Admin Panel.

## 📋 Yêu cầu hệ thống
- ✅ XAMPP đã cài đặt và đang chạy
- ✅ Apache server đang chạy (port 80)
- ✅ MySQL server đang chạy (port 3306)
- ✅ PHP với các extension: PDO, PDO_MySQL, cURL

## 🛠️ Thiết lập ban đầu

### 1. Kiểm tra XAMPP
```bash
# Kiểm tra Apache đang chạy
netstat -an | findstr :80

# Kiểm tra MySQL đang chạy  
netstat -an | findstr :3306
```

### 2. Setup Database
Truy cập: `http://localhost/final-dseza-landing-85/api/setup_database.php`

Script này sẽ:
- Tạo database `dseza_investment_hub`
- Tạo bảng `users_admin`
- Thêm dữ liệu test users

### 3. Kiểm tra Database
Truy cập: `http://localhost/final-dseza-landing-85/api/test_database.php`

## 🔍 Các công cụ test có sẵn

### 1. Test API tổng quát
**URL:** `http://localhost/final-dseza-landing-85/api/test_api_simple.php`

**Chức năng:**
- Test tất cả endpoints
- Hiển thị response đẹp mắt
- Kiểm tra PHP configuration

### 2. Debug Login API
**URL:** `http://localhost/final-dseza-landing-85/api/debug_login.php`

**Chức năng:**
- Debug từng bước login process
- Kiểm tra database connection
- Test password verification
- Test JWT token creation

### 3. Test Database Connection
**URL:** `http://localhost/final-dseza-landing-85/api/test_database.php`

**Chức năng:**
- Kiểm tra kết nối database
- Liệt kê tables
- Hiển thị sample users

## 🎯 API Endpoints

### 1. API Information
```
GET /api/index.php
```
**Response:**
```json
{
    "name": "DSEZA Admin Panel API",
    "version": "1.0.0",
    "description": "API for DSEZA Investment Hub Admin Panel Authentication",
    "endpoints": {
        "POST /api/admin/auth/login": "Admin login endpoint"
    },
    "status": "active"
}
```

### 2. Login API
```
POST /api/v1/auth/login.php
Content-Type: application/json

{
    "email": "admin@dseza.gov.vn",
    "password": "password123"
}
```

**Success Response (200):**
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

**Error Response (401):**
```json
{
    "status": "error",
    "message": "Invalid credentials."
}
```

## 🔑 Test Credentials

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@dseza.gov.vn | password123 | Admin | Active |
| editor@dseza.gov.vn | password123 | Editor | Active |
| manager@dseza.gov.vn | password123 | Admin | Active |
| test.editor@dseza.gov.vn | password123 | Editor | Active |
| inactive.user@dseza.gov.vn | password123 | Editor | Inactive |

## 🧪 Test với PowerShell

### Test GET request
```powershell
Invoke-WebRequest -Uri "http://localhost/final-dseza-landing-85/api/index.php" -Method GET
```

### Test POST login
```powershell
$body = '{"email":"admin@dseza.gov.vn","password":"password123"}'
$response = Invoke-WebRequest -Uri "http://localhost/final-dseza-landing-85/api/v1/auth/login.php" -Method POST -Body $body -ContentType "application/json"
Write-Host "Status: $($response.StatusCode)"
Write-Host "Content: $($response.Content)"
```

## 🧪 Test với cURL (nếu có)

### Test GET request
```bash
curl -X GET "http://localhost/final-dseza-landing-85/api/index.php" -H "Content-Type: application/json"
```

### Test POST login
```bash
curl -X POST "http://localhost/final-dseza-landing-85/api/v1/auth/login.php" \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@dseza.gov.vn","password":"password123"}'
```

## 📊 Test Cases

### ✅ Valid Login Tests
1. **Admin login** - admin@dseza.gov.vn / password123
2. **Editor login** - editor@dseza.gov.vn / password123
3. **Manager login** - manager@dseza.gov.vn / password123

### ❌ Invalid Login Tests
1. **Wrong password** - admin@dseza.gov.vn / wrongpassword
2. **Non-existent user** - notexist@dseza.gov.vn / password123
3. **Inactive user** - inactive.user@dseza.gov.vn / password123
4. **Missing email** - {"password": "password123"}
5. **Missing password** - {"email": "admin@dseza.gov.vn"}
6. **Invalid JSON** - {invalid json}

## 🔧 Troubleshooting

### Database Connection Issues
1. Kiểm tra XAMPP MySQL đang chạy
2. Kiểm tra config trong `api/config/database.php`
3. Chạy `api/setup_database.php` để tạo database

### API Internal Server Error
1. Chạy `api/debug_login.php` để xem lỗi chi tiết
2. Kiểm tra PHP error logs
3. Đảm bảo tất cả files trong `api/core/` tồn tại

### Permission Issues
1. Đảm bảo thư mục có quyền read/write
2. Kiểm tra PHP có thể truy cập database

## 📁 Cấu trúc Files

```
api/
├── index.php                 # API info endpoint
├── setup_database.php        # Database setup script
├── test_database.php         # Database test script
├── test_api_simple.php       # API test suite
├── debug_login.php           # Login debug script
├── database_setup.sql        # SQL setup file
├── config/
│   └── database.php          # Database config
├── core/
│   ├── Database.php          # Database class
│   ├── User.php              # User model
│   ├── AuthHelper.php        # JWT helper
│   └── SimpleJWT.php         # JWT implementation
└── v1/
    └── auth/
        └── login.php         # Login endpoint
```

## 🎉 Kết luận

API đã được setup và test thành công! Bạn có thể:

1. ✅ Sử dụng các script test có sẵn
2. ✅ Test với PowerShell/cURL
3. ✅ Integrate với frontend application
4. ✅ Mở rộng thêm endpoints khác

**Happy Testing! 🚀** 