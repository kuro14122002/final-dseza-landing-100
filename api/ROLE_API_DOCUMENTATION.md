# Role Management API Documentation

## Tổng quan

Module Role Management API cung cấp đầy đủ các chức năng CRUD để quản lý vai trò (roles) trong hệ thống DSEZA Portal. Module này cho phép quản trị viên tạo, xem, cập nhật và xóa các vai trò cùng với hệ thống quyền hạn chi tiết.

## Cấu trúc Files

```
api/
├── models/Role.php              # Model xử lý database operations
├── controllers/RoleController.php    # Controller xử lý HTTP requests  
├── roles_setup.sql              # SQL script tạo bảng và dữ liệu mặc định
└── database_setup_roles.php     # PHP script tự động setup
```

## Thiết lập Database

### Cách 1: Chạy SQL Script (Khuyến nghị)

1. Mở phpMyAdmin hoặc MySQL client
2. Chọn database `signup_form`
3. Chạy nội dung file `api/roles_setup.sql`

### Cách 2: Chạy PHP Script

```bash
php api/database_setup_roles.php
```

## API Endpoints

### Base URL
```
http://localhost/final-dseza-landing-85/api
```

### Authentication
Tất cả endpoints yêu cầu xác thực và quyền **admin**:
```
Authorization: Bearer <jwt-token>
```

---

## API Reference

### 1. Lấy danh sách tất cả vai trò

**GET** `/roles`

**Response:**
```json
{
    "status": "success",
    "message": "Roles retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "admin",
            "permissions": {
                "users": ["create", "read", "update", "delete"],
                "roles": ["create", "read", "update", "delete"],
                "news": ["create", "read", "update", "delete", "publish"]
            },
            "description": "Administrator with full system access",
            "is_active": 1,
            "created_at": "2024-01-01 10:00:00",
            "updated_at": "2024-01-01 10:00:00"
        }
    ]
}
```

### 2. Lấy thông tin vai trò theo ID

**GET** `/roles/{id}`

**Response:**
```json
{
    "status": "success", 
    "message": "Role retrieved successfully",
    "data": {
        "id": 1,
        "name": "admin",
        "permissions": {
            "users": ["create", "read", "update", "delete"]
        },
        "description": "Administrator with full system access",
        "is_active": 1,
        "created_at": "2024-01-01 10:00:00",
        "updated_at": "2024-01-01 10:00:00"
    }
}
```

### 3. Tạo vai trò mới

**POST** `/roles`

**Request Body:**
```json
{
    "name": "moderator",
    "description": "Content moderator",
    "permissions": {
        "news": ["read", "update"],
        "events": ["read", "update"]
    },
    "is_active": true
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Role created successfully", 
    "data": {
        "id": 3,
        "name": "moderator",
        "permissions": {
            "news": ["read", "update"],
            "events": ["read", "update"]
        },
        "description": "Content moderator",
        "is_active": 1,
        "created_at": "2024-01-01 10:30:00",
        "updated_at": "2024-01-01 10:30:00"
    }
}
```

### 4. Cập nhật vai trò

**PUT** `/roles/{id}`

**Request Body:**
```json
{
    "name": "senior_editor",
    "description": "Senior content editor with extended permissions",
    "permissions": {
        "news": ["create", "read", "update", "delete"],
        "events": ["create", "read", "update"],
        "categories": ["read"]
    }
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Role updated successfully",
    "data": {
        "id": 2,
        "name": "senior_editor", 
        "permissions": {
            "news": ["create", "read", "update", "delete"],
            "events": ["create", "read", "update"],
            "categories": ["read"]
        },
        "description": "Senior content editor with extended permissions",
        "is_active": 1,
        "created_at": "2024-01-01 10:00:00",
        "updated_at": "2024-01-01 10:45:00"
    }
}
```

### 5. Xóa vai trò

**DELETE** `/roles/{id}`

**Response:**
```json
{
    "status": "success",
    "message": "Role deleted successfully"
}
```

### 6. Thống kê vai trò

**GET** `/roles/stats`

**Response:**
```json
{
    "status": "success",
    "message": "Role statistics retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "admin",
            "user_count": 2
        },
        {
            "id": 2, 
            "name": "editor",
            "user_count": 5
        }
    ]
}
```

### 7. Bật/tắt trạng thái vai trò

**PUT** `/roles/{id}/toggle`

**Response:**
```json
{
    "status": "success",
    "message": "Role status updated successfully",
    "data": {
        "id": 2,
        "name": "editor",
        "is_active": 0,
        "updated_at": "2024-01-01 11:00:00"
    }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "status": "error",
    "message": "Role name is required",
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
    "message": "Insufficient permissions", 
    "code": 403
}
```

### 404 Not Found
```json
{
    "status": "error",
    "message": "Role not found",
    "code": 404
}
```

### 409 Conflict
```json
{
    "status": "error",
    "message": "Role name already exists",
    "code": 409
}
```

---

## Validation Rules

### Role Name
- **Required**: Có
- **Type**: String
- **Pattern**: Chỉ chấp nhận chữ cái, số, dấu gạch ngang và gạch dưới
- **Unique**: Tên vai trò phải duy nhất

### Permissions
- **Type**: Object/Array
- **Structure**: Key-value pairs với resource và actions
- **Example**: 
  ```json
  {
      "news": ["create", "read", "update", "delete"],
      "users": ["read", "update"]
  }
  ```

### Description
- **Type**: String
- **Required**: Không bắt buộc
- **Max Length**: 1000 characters

### Is Active
- **Type**: Boolean
- **Default**: true

---

## Security Features

### 1. Admin Only Access
Tất cả endpoints yêu cầu quyền admin.

### 2. Protected System Roles
Các vai trò hệ thống (`admin`, `editor`) được bảo vệ:
- Không thể xóa
- Không thể vô hiệu hóa (đối với admin)

### 3. Usage Check
Không thể xóa vai trò đang được sử dụng bởi users.

### 4. Input Validation
- Validate tên vai trò theo pattern
- Validate cấu trúc permissions
- Sanitize tất cả input data

---

## Testing Examples

### Sử dụng cURL

#### 1. Lấy danh sách vai trò:
```bash
curl -X GET http://localhost/final-dseza-landing-85/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### 2. Tạo vai trò mới:
```bash
curl -X POST http://localhost/final-dseza-landing-85/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_reviewer",
    "description": "Reviews and approves content",
    "permissions": {
      "news": ["read", "update"],
      "events": ["read"]
    }
  }'
```

#### 3. Cập nhật vai trò:
```bash
curl -X PUT http://localhost/final-dseza-landing-85/api/roles/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated content reviewer role",
    "permissions": {
      "news": ["read", "update", "publish"],
      "events": ["read", "update"]
    }
  }'
```

#### 4. Xóa vai trò:
```bash
curl -X DELETE http://localhost/final-dseza-landing-85/api/roles/3 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Troubleshooting

### 1. Database Connection Issues
- Kiểm tra cấu hình trong `api/config/database.php`
- Đảm bảo MySQL server đang chạy
- Kiểm tra credentials và database name

### 2. Permission Denied
- Đảm bảo user có role `admin`
- Kiểm tra JWT token còn hạn
- Verify Authorization header format

### 3. Role Creation Fails
- Kiểm tra tên vai trò không trùng lặp
- Validate định dạng permissions object
- Đảm bảo database table `roles` tồn tại

### 4. Cannot Delete Role
- Kiểm tra vai trò có đang được sử dụng không
- Không thể xóa system roles (`admin`, `editor`)

---

## Best Practices

### 1. Permissions Design
```json
{
    "resource_name": ["action1", "action2"],
    "news": ["create", "read", "update", "delete", "publish"],
    "users": ["read", "update"]
}
```

### 2. Role Naming Convention
- Sử dụng lowercase với underscore: `content_editor`
- Tên mô tả rõ ràng: `news_moderator` thay vì `mod1`
- Tránh ký tự đặc biệt

### 3. Error Handling
- Luôn kiểm tra response status
- Handle các HTTP status codes phù hợp
- Log errors để debugging

---

## Integration Notes

### Frontend Integration
```javascript
// Example API call
const createRole = async (roleData) => {
    try {
        const response = await fetch('/api/roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(roleData)
        });
        
        const result = await response.json();
        if (result.status === 'success') {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};
```

### Permission Checking
Có thể mở rộng auth system để check permissions chi tiết:
```php
// In future updates
$auth->hasPermission('news', 'create');
$auth->hasPermission('users', 'delete');
``` 