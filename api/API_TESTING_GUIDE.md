# DSEZA API Testing Guide

Hướng dẫn test API đăng nhập và thống kê cho hệ thống DSEZA Investment Hub.

## 📋 Tổng Quan

Hệ thống có 2 API chính cần test:

1. **Login API** (`/api/v1/auth/login.php`) - Xác thực người dùng và tạo JWT token
2. **Stats API** (`/api/v1/stats/overview.php`) - Lấy dữ liệu thống kê (cần JWT token)

## 🛠️ Cách Test

### Phương Pháp 1: Web Browser (Dễ nhất)

```bash
# Chạy test qua trình duyệt
http://localhost/api/comprehensive_api_test.php
```

### Phương Pháp 2: Command Line

```bash
# Chạy test qua CLI
php api/cli_api_test.php
```

### Phương Pháp 3: cURL Commands

```bash
# Tạo cURL commands
php api/generate_curl_commands.php > curl_commands.txt

# Chạy từng command theo hướng dẫn trong file
```

### Phương Pháp 4: Test Scripts Riêng Lẻ

```bash
# Test Login API
php api/test_login_api.php

# Test Stats API  
php api/test_stats_api.php
```

## 📝 Test Cases Chi Tiết

### Login API Tests

| Test Case | Mô Tả | Expected Result |
|-----------|--------|----------------|
| Valid Admin Login | Đăng nhập admin@dseza.gov.vn với password đúng | HTTP 200, JWT token |
| Valid Editor Login | Đăng nhập editor@dseza.gov.vn với password đúng | HTTP 200, JWT token |
| Invalid Password | Password sai | HTTP 401, error message |
| Non-existent User | Email không tồn tại | HTTP 401, error message |
| Inactive User | Tài khoản bị vô hiệu hóa | HTTP 401, error message |
| Missing Email | Thiếu trường email | HTTP 400, error message |
| Missing Password | Thiếu trường password | HTTP 400, error message |
| Invalid JSON | JSON không hợp lệ | HTTP 400, error message |
| Wrong HTTP Method | Dùng GET thay vì POST | HTTP 405, error message |

### Stats API Tests

| Test Case | Mô Tả | Expected Result |
|-----------|--------|----------------|
| Valid Token | Truy cập với JWT token hợp lệ | HTTP 200, statistics data |
| No Token | Truy cập không có token | HTTP 401, error message |
| Invalid Token | Token không hợp lệ/malformed | HTTP 401, error message |
| Wrong HTTP Method | Dùng POST thay vì GET | HTTP 405, error message |
| Expired Token | Token hết hạn | HTTP 401, error message |

## 🔧 Manual Testing với External Tools

### Postman

1. **Tạo Collection mới**: "DSEZA API Tests"

2. **Request 1: Login**
   - Method: `POST`
   - URL: `http://localhost/api/v1/auth/login.php`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "admin@dseza.gov.vn",
       "password": "password123"
     }
     ```

3. **Request 2: Stats**
   - Method: `GET`
   - URL: `http://localhost/api/v1/stats/overview.php`
   - Headers: 
     - `Content-Type: application/json`
     - `Authorization: Bearer {{token}}`

4. **Thiết lập Environment Variable**:
   - Tạo environment "DSEZA Local"
   - Thêm variable `token` với giá trị từ login response

### Insomnia

Tương tự Postman, tạo workspace và requests như trên.

### cURL Examples

```bash
# 1. Login và lưu token
TOKEN=$(curl -s -X POST \
  'http://localhost/api/v1/auth/login.php' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@dseza.gov.vn",
    "password": "password123"
  }' | jq -r '.token')

# 2. Sử dụng token để truy cập stats
curl -X GET \
  'http://localhost/api/v1/stats/overview.php' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN"
```

## 🗃️ Database Verification

Để kiểm tra dữ liệu thống kê có khớp với database:

```sql
-- Kiểm tra số lượng tin tức
SELECT COUNT(*) FROM news_articles;

-- Kiểm tra số lượng sự kiện
SELECT COUNT(*) FROM event_articles;

-- So sánh với kết quả từ Stats API
```

## 📊 Expected Responses

### Successful Login Response
```json
{
  "status": "success",
  "message": "Login successful.",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@dseza.gov.vn",
    "role": "admin",
    "full_name": "Administrator"
  }
}
```

### Successful Stats Response
```json
{
  "status": "success",
  "data": {
    "totalNews": 10,
    "totalEvents": 5,
    "totalViewsThisMonth": 15200,
    "activeUsersThisMonth": 1200
  },
  "meta": {
    "generated_at": "2024-01-15T10:30:00+00:00",
    "generated_by": "admin@dseza.gov.vn",
    "user_role": "admin"
  }
}
```

### Error Response Examples
```json
{
  "status": "error",
  "message": "Invalid credentials."
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - ✅ Check if web server is running
   - ✅ Verify URL is correct
   - ✅ Check firewall settings

2. **500 Internal Server Error**
   - ✅ Check PHP error logs
   - ✅ Verify database connection
   - ✅ Check file permissions

3. **Database Connection Failed**
   - ✅ Verify MySQL is running
   - ✅ Check database credentials in config
   - ✅ Run database setup scripts

4. **JWT Token Issues**
   - ✅ Check JWT secret key configuration
   - ✅ Verify token format (Bearer prefix)
   - ✅ Check token expiration

### Setup Checklist

- [ ] Database server running
- [ ] Web server (Apache/Nginx) running  
- [ ] PHP cURL extension enabled
- [ ] Database tables created (`database_setup.sql`, `database_setup_extended.sql`)
- [ ] Proper file permissions set
- [ ] Configuration files properly set up

## 🔍 Debugging Tips

1. **Enable PHP Error Reporting**:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Check API Logs**:
   ```bash
   tail -f /var/log/apache2/error.log
   # or
   tail -f /var/log/nginx/error.log
   ```

3. **Verbose cURL Output**:
   ```bash
   curl -v -X POST ...
   ```

4. **Test Database Connection**:
   ```bash
   php api/test_database.php
   ```

## 📚 Files Overview

| File | Purpose |
|------|---------|
| `comprehensive_api_test.php` | Web-based comprehensive test suite |
| `cli_api_test.php` | Command-line test runner |
| `generate_curl_commands.php` | Generate cURL commands for manual testing |
| `test_login_api.php` | Focus on login API only |
| `test_stats_api.php` | Focus on stats API only |
| `API_TESTING_GUIDE.md` | This documentation |

## 🎯 Next Steps

After successful testing:

1. **Performance Testing**: Use tools like Apache Bench or wrk
2. **Security Testing**: Test for SQL injection, XSS vulnerabilities
3. **Load Testing**: Test with multiple concurrent users
4. **Integration Testing**: Test with frontend application
5. **Automated Testing**: Set up CI/CD pipeline with automated tests

## 📞 Support

Nếu có vấn đề trong quá trình test:

1. Kiểm tra setup checklist
2. Xem troubleshooting section
3. Check PHP và web server error logs
4. Verify database connection và data

---

**Happy Testing! 🚀** 