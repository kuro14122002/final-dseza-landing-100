# User Management API Documentation

## Overview
API quản lý người dùng (User Management API) cung cấp các endpoint để thực hiện các thao tác CRUD với người dùng trong hệ thống DSEZA Portal. Tất cả các endpoint đều yêu cầu xác thực admin.

## Base URL
```
http://localhost/final-dseza-landing-85/api
```

## Authentication
Tất cả endpoints yêu cầu JWT token với role 'admin':
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. GET /users
Lấy danh sách người dùng với phân trang và tìm kiếm.

**Query Parameters:**
- `page` (integer, optional): Trang hiện tại (default: 1)
- `limit` (integer, optional): Số lượng records mỗi trang (default: 10, max: 100)
- `search` (string, optional): Tìm kiếm theo username, email, full_name
- `role` (string, optional): Lọc theo role ('admin', 'editor')
- `status` (string, optional): Lọc theo trạng thái ('active', 'inactive')
- `sortBy` (string, optional): Sắp xếp theo trường (default: 'created_at')
- `sortDirection` (string, optional): Hướng sắp xếp 'ASC' hoặc 'DESC' (default: 'DESC')

**Response:**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@dseza.com",
        "role": "admin",
        "is_active": true,
        "full_name": "System Administrator",
        "avatar": null,
        "created_at": "2025-06-28 10:13:47",
        "updated_at": "2025-06-28 10:13:47"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 2. GET /users/stats
Lấy thống kê người dùng.

**Response:**
```json
{
  "status": "success",
  "message": "User statistics retrieved successfully",
  "data": {
    "total_users": 3,
    "active_users": 3,
    "inactive_users": 0,
    "total_roles": 2
  }
}
```

### 3. GET /users/{id}
Lấy thông tin chi tiết một người dùng.

**Path Parameters:**
- `id` (integer): ID của người dùng

**Response:**
```json
{
  "status": "success",
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@dseza.com",
    "role": "admin",
    "is_active": true,
    "full_name": "System Administrator",
    "avatar": null,
    "created_at": "2025-06-28 10:13:47",
    "updated_at": "2025-06-28 10:13:47"
  }
}
```

### 4. POST /users
Tạo người dùng mới.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@dseza.com",
  "password": "password123",
  "role": "editor",
  "full_name": "New User",
  "is_active": true
}
```

**Required Fields:**
- `username`: Tên đăng nhập (3-50 ký tự, chỉ chứa a-z, A-Z, 0-9, _, -)
- `email`: Email hợp lệ
- `password`: Mật khẩu (tối thiểu 6 ký tự)

**Optional Fields:**
- `role`: 'admin' hoặc 'editor' (default: 'editor')
- `full_name`: Họ tên đầy đủ (tối đa 100 ký tự)
- `is_active`: true/false (default: true)

**Response:**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": 10,
    "username": "newuser",
    "email": "newuser@dseza.com",
    "role": "editor",
    "is_active": true,
    "full_name": "New User",
    "avatar": null,
    "created_at": "2025-06-28 15:30:00",
    "updated_at": "2025-06-28 15:30:00"
  }
}
```

### 5. PUT /users/{id}
Cập nhật thông tin người dùng.

**Path Parameters:**
- `id` (integer): ID của người dùng

**Request Body:**
```json
{
  "username": "updateduser",
  "email": "updated@dseza.com",
  "role": "editor",
  "full_name": "Updated User Name",
  "is_active": true
}
```

**Note:** 
- Không thể thay đổi role của admin user
- Không thể cập nhật mật khẩu qua endpoint này (sử dụng `/users/{id}/password`)

**Response:**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": 10,
    "username": "updateduser",
    "email": "updated@dseza.com",
    "role": "editor",
    "is_active": true,
    "full_name": "Updated User Name",
    "avatar": null,
    "created_at": "2025-06-28 15:30:00",
    "updated_at": "2025-06-28 15:35:00"
  }
}
```

### 6. PUT /users/{id}/toggle
Bật/tắt trạng thái người dùng.

**Path Parameters:**
- `id` (integer): ID của người dùng

**Note:** Không thể vô hiệu hóa admin user

**Response:**
```json
{
  "status": "success",
  "message": "User status updated successfully",
  "data": {
    "id": 10,
    "username": "testuser",
    "email": "test@dseza.com",
    "role": "editor",
    "is_active": false,
    "full_name": "Test User",
    "avatar": null,
    "created_at": "2025-06-28 15:30:00",
    "updated_at": "2025-06-28 15:40:00"
  }
}
```

### 7. PUT /users/{id}/password
Thay đổi mật khẩu người dùng.

**Path Parameters:**
- `id` (integer): ID của người dùng

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Validation:**
- Mật khẩu phải có ít nhất 6 ký tự

**Response:**
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

### 8. DELETE /users/{id}
Xóa người dùng.

**Path Parameters:**
- `id` (integer): ID của người dùng

**Note:** Không thể xóa admin user

**Response:**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "status": "error",
  "message": "Validation failed",
  "code": 400,
  "details": {
    "username": "Username must be between 3 and 50 characters",
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters long"
  }
}
```

### 400 Bad Request - Duplicate Data
```json
{
  "status": "error",
  "message": "Username already exists",
  "code": 400
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Authentication required",
  "code": 401
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Cannot delete admin users",
  "code": 400
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "User not found",
  "code": 404
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "code": 500
}
```

## cURL Examples

### Login để lấy JWT token
```bash
curl -X POST http://localhost/final-dseza-landing-85/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dseza.com",
    "password": "admin123"
  }'
```

### Lấy danh sách users
```bash
curl -X GET "http://localhost/final-dseza-landing-85/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tạo user mới
```bash
curl -X POST http://localhost/final-dseza-landing-85/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "newuser",
    "email": "newuser@dseza.com",
    "password": "password123",
    "role": "editor",
    "full_name": "New User"
  }'
```

### Cập nhật user
```bash
curl -X PUT http://localhost/final-dseza-landing-85/api/users/10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "full_name": "Updated Name",
    "role": "editor"
  }'
```

### Xóa user
```bash
curl -X DELETE http://localhost/final-dseza-landing-85/api/users/10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Validation Rules

### Username
- Bắt buộc khi tạo mới
- 3-50 ký tự
- Chỉ chứa: a-z, A-Z, 0-9, dấu gạch dưới (_), dấu gạch ngang (-)
- Phải duy nhất trong hệ thống

### Email
- Bắt buộc khi tạo mới
- Định dạng email hợp lệ
- Phải duy nhất trong hệ thống

### Password
- Bắt buộc khi tạo mới
- Tối thiểu 6 ký tự
- Sẽ được mã hóa bằng bcrypt

### Role
- Chỉ chấp nhận: 'admin', 'editor'
- Default: 'editor'
- Không thể thay đổi role của admin user

### Full Name
- Tùy chọn
- Tối đa 100 ký tự

## Security Features
- ✅ Tất cả endpoints yêu cầu JWT authentication với role 'admin'
- ✅ Password được hash bằng bcrypt
- ✅ Bảo vệ admin user khỏi việc xóa hoặc vô hiệu hóa
- ✅ Validation đầu vào toàn diện
- ✅ Kiểm tra tính duy nhất của username và email
- ✅ Error handling an toàn

## Performance Features
- ✅ Phân trang hiệu quả
- ✅ Tìm kiếm và lọc linh hoạt
- ✅ Sắp xếp theo nhiều trường
- ✅ Query optimization
- ✅ Giới hạn số lượng records mỗi request 