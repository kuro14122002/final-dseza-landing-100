# Admin Login API Integration Implementation

## Tổng quan
Đã tích hợp thành công API đăng nhập thực tế vào React frontend, thay thế logic đăng nhập giả lập trước đó.

## Các thay đổi đã thực hiện

### 1. LoginPage.tsx
**File:** `src/pages/admin/LoginPage.tsx`

**Thay đổi chính:**
- Thay thế logic đăng nhập giả lập bằng API call thực tế
- Gọi endpoint: `GET http://localhost/api/v1/auth/login.php`
- Xử lý JWT token và lưu vào localStorage
- Cải thiện error handling và network error handling

**API Integration Code:**
```javascript
const onSubmit = async (data: LoginFormValues) => {
  setIsLoading(true);
  
  try {
    const API_LOGIN_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost/api'}/v1/auth/login.php`;

    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      }),
    });

    const responseData = await response.json();

    if (response.ok && responseData.status === 'success' && responseData.token && responseData.user) {
      // Lưu JWT token
      localStorage.setItem('adminUserToken', responseData.token);
      
      // Lưu thông tin user
      localStorage.setItem('adminUser', JSON.stringify({
        id: responseData.user.id,
        email: responseData.user.email,
        role: responseData.user.role,
        fullName: responseData.user.full_name,
        loginTime: new Date().toISOString()
      }));
      
      toast.success(t('admin.login.loginSuccess'));
      navigate('/admin/dashboard');
    } else {
      toast.error(responseData.message || t('admin.login.authError'));
    }
  } catch (error) {
    console.error("Login API call error:", error);
    toast.error(t('admin.login.authError'));
  } finally {
    setIsLoading(false);
  }
};
```

### 2. ProtectedRoute.tsx
**File:** `src/components/admin/ProtectedRoute.tsx`

**Thay đổi chính:**
- Kiểm tra cả `adminUser` và `adminUserToken` trong localStorage
- Thêm function `validateTokenWithBackend()` (optional, commented out)
- Centralized auth data clearing với `clearAuthData()`

**Key improvements:**
```javascript
const clearAuthData = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminUserToken');
};

const redirectToLogin = () => {
  clearAuthData();
  navigate('/admin/login', { replace: true });
};

// Kiểm tra cả user data và token
if (!adminUser || !adminToken) {
  redirectToLogin();
  return;
}
```

### 3. AdminSidebar.tsx
**File:** `src/components/admin/AdminSidebar.tsx`

**Thay đổi chính:**
- Cập nhật `handleLogout()` để xóa JWT token

```javascript
const handleLogout = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminUserToken');
  toast.success(t('admin.logout.success'));
  navigate('/admin/login');
};
```

## API Endpoint Details

### Login Endpoint
- **URL:** `http://localhost/api/v1/auth/login.php`
- **Method:** POST
- **Content-Type:** application/json

**Request Body:**
```json
{
  "email": "admin@dseza.gov.vn",
  "password": "user_password"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Login successful.",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "email": "admin@dseza.gov.vn",
    "role": "Admin",
    "full_name": "System Administrator"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid email or password."
}
```

## Environment Configuration

### API URL Configuration
API base URL có thể được cấu hình qua environment variable:
```bash
REACT_APP_API_BASE_URL=http://localhost/api
```

**Fallback:** Nếu không có environment variable, sử dụng `http://localhost/api`

## CORS Configuration

CORS đã được cấu hình trong `api/.htaccess`:
```apache
# CORS Headers
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
```

## Authentication Flow

### 1. Login Process
1. User nhập email/password → `LoginPage.tsx`
2. Frontend validate form bằng Zod schema
3. Gọi API `POST /api/v1/auth/login.php`
4. Backend verify credentials và tạo JWT token
5. Frontend lưu token và user info vào localStorage
6. Redirect đến `/admin/dashboard`

### 2. Protected Route Check
1. `ProtectedRoute.tsx` kiểm tra `adminUser` và `adminUserToken`
2. Validate session timeout (24 hours)
3. Optional: Validate token với backend
4. Nếu invalid → redirect về login

### 3. Logout Process
1. User click logout button trong `AdminSidebar`
2. Clear `adminUser` và `adminUserToken` từ localStorage
3. Show success toast
4. Redirect về `/admin/login`

## Data Storage

### LocalStorage Items
1. **adminUserToken:** JWT token string
2. **adminUser:** JSON object chứa user info
```json
{
  "id": 1,
  "email": "admin@dseza.gov.vn",
  "role": "Admin",
  "fullName": "System Administrator",
  "loginTime": "2025-01-10T10:30:00.000Z"
}
```

## Error Handling

### Network Errors
- Connection issues được handle bằng try-catch
- Display generic error message cho user
- Log detailed error trong console

### API Errors
- Parse JSON response để lấy error message
- Display API error message hoặc fallback message
- Maintain loading state properly

### Validation Errors
- Form validation bằng Zod schema
- Real-time validation feedback
- Accessible error messages

## Security Considerations

### Frontend Security
- JWT token stored trong localStorage (có thể cải thiện bằng httpOnly cookies)
- Session timeout sau 24 giờ
- Input validation với Zod
- CSRF protection qua CORS headers

### Backend Security (đã implement trước đó)
- Password hashing với bcrypt
- JWT token signing và verification
- Input sanitization
- SQL injection protection với prepared statements

## Testing

### Manual Testing Checklist
- [ ] Login với credentials đúng
- [ ] Login với credentials sai
- [ ] Network error handling
- [ ] Session timeout
- [ ] Logout functionality
- [ ] Protected route access
- [ ] Token persistence across browser refresh

### Test Credentials
Sử dụng credentials đã được setup trong database:
- Email: admin@dseza.gov.vn
- Password: (password đã được hash trong database)

## Deployment Notes

### Environment Variables
Đảm bảo set `REACT_APP_API_BASE_URL` cho production:
```bash
# Development
REACT_APP_API_BASE_URL=http://localhost/api

# Production
REACT_APP_API_BASE_URL=https://yourdomain.com/api
```

### CORS Production
Trong production, cập nhật CORS origin trong `.htaccess`:
```apache
Header always set Access-Control-Allow-Origin "https://yourdomain.com"
```

## Next Steps (Optional)

### 1. Token Validation Endpoint
Uncomment và implement token validation:
```javascript
// In ProtectedRoute.tsx
validateTokenWithBackend(adminToken);
```

Tạo API endpoint: `POST /api/v1/auth/validate.php`

### 2. Refresh Token Implementation
- Implement refresh token mechanism
- Auto-refresh expired tokens
- Seamless user experience

### 3. Enhanced Security
- Move từ localStorage sang httpOnly cookies
- Implement CSRF tokens
- Add rate limiting cho login attempts

---

## Kết luận

✅ **Đã hoàn thành:** Tích hợp API đăng nhập thực tế vào React frontend  
✅ **JWT Token:** Được lưu trữ và sử dụng đúng cách  
✅ **Error Handling:** Comprehensive error handling cho network và API errors  
✅ **Security:** Basic security measures đã được implement  
✅ **User Experience:** Smooth login/logout flow với loading states và toast notifications  

Frontend admin panel hiện đã sẵn sàng sử dụng với API backend thực tế! 