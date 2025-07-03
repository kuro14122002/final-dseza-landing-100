import { 
  User, 
  UserFilters, 
  UsersListResponse, 
  UserResponse, 
  CreateUserData, 
  UpdateUserData, 
  UserStatsResponse,
  ChangePasswordData 
} from '@/types/users';

const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';

export interface UpdateUserProfileData {
  fullName: string;
  avatar: string;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('adminUserToken');
    console.log('🔑 Token from localStorage:', token ? 'Token exists' : 'No token found');
    console.log('🔑 Token value:', token);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get all users with pagination and search
  async getUsers(params: UserFilters = {}): Promise<UsersListResponse['data']> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.role && params.role !== 'all') searchParams.append('role', params.role);
      if (params.status && params.status !== 'all') searchParams.append('status', params.status);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);

      const response = await fetch(`${API_BASE_URL}/users?${searchParams.toString()}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UsersListResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UserResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UserResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    try {
      console.log('🗑️ Attempting to delete user:', id);
      const headers = this.getAuthHeaders();
      console.log('🗑️ Request headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: headers
      });

      console.log('🗑️ Response status:', response.status);
      console.log('🗑️ Response statusText:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('🗑️ Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ User deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }

  // Toggle user status
  async toggleUserStatus(id: number): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/toggle`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UserResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UserResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStatsResponse['data']> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: UserStatsResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Change user password (admin function)
  async changeUserPassword(id: number, data: ChangePasswordData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error changing user password:', error);
      throw error;
    }
  }

  async updateUserProfile(data: UpdateUserProfileData): Promise<UserProfileResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<UserProfileResponse> {
    try {
      console.log('📡 Making request to:', `${API_BASE_URL}/auth/me`);
      const headers = this.getAuthHeaders();
      console.log('📡 Request headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: headers
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response statusText:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('📡 Error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 Success response data:', result);
      return result.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      console.log('📡 Making request to:', `${API_BASE_URL}/user/change-password`);
      const headers = this.getAuthHeaders();
      console.log('📡 Request headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
      });

      console.log('📡 Change password response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('📡 Change password error response data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 Change password success response data:', result);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService; 