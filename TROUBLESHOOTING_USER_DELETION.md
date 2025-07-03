# Hướng dẫn khắc phục vấn đề không thể xóa User

## Vấn đề
Super admin không thể xóa bất kỳ tài khoản nào trong hệ thống.

## Các nguyên nhân có thể

### 1. **Vấn đề Authentication**
- JWT token đã hết hạn
- Token không được gửi đúng cách trong header
- Thông tin user trong localStorage không chính xác

### 2. **Vấn đề quyền hạn**
- User hiện tại không có role admin
- API backend không nhận diện được quyền admin
- Logic phân quyền có lỗi

### 3. **Vấn đề API**
- Backend API không hoạt động
- Database connection bị lỗi
- Logic xóa user có bug

## Cách kiểm tra và khắc phục

### Bước 1: Sử dụng Debug Tool
1. Vào trang **Quản lý Thành viên**
2. Click nút **Debug** ở góc phải trên
3. Mở **Developer Console** (F12) để xem kết quả debug

### Bước 2: Kiểm tra thông tin Authentication
```javascript
// Kiểm tra trong Console
localStorage.getItem('adminUserToken')  // Phải có token
localStorage.getItem('adminUser')       // Phải có thông tin user với role: 'admin'
```

### Bước 3: Kiểm tra phản hồi API
Trong console sẽ hiển thị:
- ✅ Auth successful: API hoạt động bình thường
- ❌ Auth failed: Cần đăng nhập lại
- ❌ API test error: Vấn đề kết nối backend

### Bước 4: Các cách khắc phục

#### 4.1. Nếu token hết hạn
```javascript
// Đăng xuất và đăng nhập lại
localStorage.removeItem('adminUserToken');
localStorage.removeItem('adminUser');
// Sau đó đăng nhập lại
```

#### 4.2. Nếu role không đúng
Kiểm tra user có role 'admin' và username có thể là 'admin' cho super admin:
```javascript
const user = JSON.parse(localStorage.getItem('adminUser'));
console.log('Role:', user.role);  // Phải là 'admin'
console.log('Username:', user.username);
```

#### 4.3. Nếu API không hoạt động
1. Kiểm tra XAMPP đã chạy Apache và MySQL
2. Kiểm tra file `.htaccess` trong thư mục `api/`
3. Kiểm tra URL API đúng: `http://localhost/final-dseza-landing-85/api`

## Logic phân quyền xóa User

### Frontend (React)
```typescript
// Chỉ hiển thị nút xóa nếu:
authService.isAdmin() && user.username !== 'admin'
```

### Backend (PHP)
```php
// Chỉ cho phép xóa nếu:
requireAuth('admin');  // User hiện tại là admin
$user['username'] !== 'admin';  // Không xóa super admin
$user['role'] === 'admin' => $currentUser['role'] === 'admin';  // Admin chỉ admin khác có thể xóa
```

## Các thông báo lỗi thường gặp

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| "Phiên đăng nhập đã hết hạn" | Token expired | Đăng nhập lại |
| "Bạn không có quyền xóa" | Không phải admin | Kiểm tra role user |
| "Không thể xóa tài khoản super admin" | Đang cố xóa admin | Đây là bảo vệ hệ thống |
| "Chỉ admin mới có quyền xóa" | Logic phân quyền | Kiểm tra role và token |

## Test thủ công

### Test 1: Kiểm tra API trực tiếp
```javascript
// Chạy trong Console
fetch('http://localhost/final-dseza-landing-85/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminUserToken')}`
  }
}).then(r => r.json()).then(console.log);
```

### Test 2: Test delete API
```javascript
// Import và chạy
import { testDeleteUser } from '@/utils/api-test';
testDeleteUser(USER_ID_TO_TEST);  // Thay USER_ID_TO_TEST bằng ID thực
```

## Liên hệ hỗ trợ
Nếu vẫn không giải quyết được, hãy:
1. Chụp màn hình console debug
2. Ghi lại thông báo lỗi cụ thể
3. Báo cáo vấn đề với đầy đủ thông tin trên 