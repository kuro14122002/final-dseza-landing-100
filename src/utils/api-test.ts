// Script test API endpoints
export const testUserAPI = async () => {
  const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';
  const token = localStorage.getItem('adminUserToken');
  
  if (!token) {
    console.error('❌ No token found! Please login first.');
    return;
  }
  
  console.group('🧪 Testing User API Endpoints');
  
  try {
    // 1. Test auth verification
    console.log('1️⃣ Testing authentication...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth successful:', authData);
    } else {
      const authError = await authResponse.json();
      console.log('❌ Auth failed:', authError);
      return;
    }
    
    // 2. Test getting users list
    console.log('2️⃣ Testing get users...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Get users successful:', usersData);
      
      // Find a test user to delete (not admin)
      const testUsers = usersData.data?.data?.filter((u: any) => u.username !== 'admin') || [];
      
      if (testUsers.length > 0) {
        const testUser = testUsers[0];
        console.log('3️⃣ Testing delete user (dry run):', testUser);
        
        // Just test the request without actually deleting
        console.log('📝 Would send DELETE to:', `${API_BASE_URL}/users/${testUser.id}`);
        console.log('📝 With headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
      }
    } else {
      const usersError = await usersResponse.json();
      console.log('❌ Get users failed:', usersError);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error);
  }
  
  console.groupEnd();
};

// Test specific delete operation
export const testDeleteUser = async (userId: number) => {
  const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';
  const token = localStorage.getItem('adminUserToken');
  
  if (!token) {
    console.error('❌ No token found! Please login first.');
    return;
  }
  
  if (!userId) {
    console.error('❌ No user ID provided');
    return;
  }
  
  console.group(`🗑️ Testing Delete User ${userId}`);
  
  try {
    console.log('📤 Sending DELETE request...');
    console.log('URL:', `${API_BASE_URL}/users/${userId}`);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Delete successful:', data);
      } catch {
        console.log('✅ Delete successful (no JSON response)');
      }
    } else {
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Delete failed:', errorData);
      } catch {
        console.log('❌ Delete failed (no JSON error):', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Delete test error:', error);
  }
  
  console.groupEnd();
}; 