// Debug script để kiểm tra vấn đề xóa user
export const debugUserDeletion = () => {
  console.group('🔍 DEBUG: User Deletion Issue');
  
  // 1. Kiểm tra token trong localStorage
  const token = localStorage.getItem('adminUserToken');
  console.log('📝 Token exists:', !!token);
  console.log('📝 Token value:', token);
  
  // 2. Kiểm tra user info
  const userStr = localStorage.getItem('adminUser');
  const user = userStr ? JSON.parse(userStr) : null;
  console.log('👤 Current user:', user);
  
  if (user) {
    console.log('👤 Username:', user.username);
    console.log('👤 Role:', user.role);
    console.log('👤 Is Super Admin:', user.username === 'admin' && user.role === 'admin');
    console.log('👤 Is Admin:', user.role === 'admin');
  }
  
  // 3. Test API endpoint
  if (token) {
    testDeleteAPI(token);
  }
  
  console.groupEnd();
};

const testDeleteAPI = async (token: string) => {
  try {
    console.log('🌐 Testing API authentication...');
    
    // Test auth endpoint first
    const authResponse = await fetch('http://localhost/final-dseza-landing-85/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('🌐 Auth response status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth successful:', authData);
    } else {
      const errorData = await authResponse.json();
      console.log('❌ Auth failed:', errorData);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error);
  }
};

// Helper function để check quyền trước khi xóa
export const canDeleteUser = (targetUser: any): { canDelete: boolean; reason?: string } => {
  const currentUserStr = localStorage.getItem('adminUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  
  if (!currentUser) {
    return { canDelete: false, reason: 'Không tìm thấy thông tin user hiện tại' };
  }
  
  if (currentUser.role !== 'admin') {
    return { canDelete: false, reason: 'Chỉ admin mới có quyền xóa user' };
  }
  
  if (targetUser.username === 'admin') {
    return { canDelete: false, reason: 'Không thể xóa tài khoản super admin' };
  }
  
  return { canDelete: true };
};

// Function để làm mới token nếu cần
export const refreshAuthIfNeeded = async () => {
  try {
    const token = localStorage.getItem('adminUserToken');
    if (!token) {
      console.warn('⚠️ No token found, need to login again');
      return false;
    }
    
    // Verify token
    const verifyResponse = await fetch('http://localhost/final-dseza-landing-85/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    if (!verifyResponse.ok) {
      console.warn('⚠️ Token invalid, need to login again');
      localStorage.removeItem('adminUserToken');
      localStorage.removeItem('adminUser');
      return false;
    }
    
    console.log('✅ Token is valid');
    return true;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return false;
  }
}; 