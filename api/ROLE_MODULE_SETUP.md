# Role Module Setup - Quick Guide

## Files Created

✅ **api/models/Role.php** - Model với đầy đủ CRUD operations
✅ **api/controllers/RoleController.php** - Controller với authentication và validation
✅ **api/roles_setup.sql** - SQL script tạo bảng và dữ liệu mặc định
✅ **api/database_setup_roles.php** - PHP script tự động setup
✅ **Routes added to api/index.php** - API endpoints đã được thêm

## Quick Setup Steps

### 1. Database Setup
Chạy SQL script trong phpMyAdmin:
```sql
-- Paste content from api/roles_setup.sql
```

### 2. Test API Endpoints
Tất cả endpoints yêu cầu admin token:

```
GET    /api/roles              # Lấy danh sách roles
GET    /api/roles/{id}         # Lấy role theo ID  
POST   /api/roles              # Tạo role mới
PUT    /api/roles/{id}         # Cập nhật role
DELETE /api/roles/{id}         # Xóa role
GET    /api/roles/stats        # Thống kê roles
PUT    /api/roles/{id}/toggle  # Bật/tắt role
```

### 3. Default Roles Created
- **admin**: Full permissions
- **editor**: Limited content permissions

## Authentication
All endpoints require:
```
Authorization: Bearer <admin-jwt-token>
```

## Documentation
See `api/ROLE_API_DOCUMENTATION.md` for complete API reference.

---

**Status: ✅ COMPLETED**
Module Role Management API đã được tạo hoàn chỉnh và sẵn sàng sử dụng! 