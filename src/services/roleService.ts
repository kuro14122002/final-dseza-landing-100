import { authService } from './authService';

const API_BASE_URL = window.location.origin.includes('8080') 
  ? 'http://localhost/final-dseza-landing-85/api'
  : 'http://localhost/final-dseza-landing-85/api';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  is_active?: boolean;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: Record<string, string[]>;
  is_active?: boolean;
}

export interface RoleStats {
  id: number;
  name: string;
  user_count: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  code?: number;
}

class RoleService {
  private api = authService.createAuthenticatedApi();

  // Get all roles
  async getRoles(): Promise<Role[]> {
    try {
      const response = await this.api.get<ApiResponse<Role[]>>('/roles');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch roles');
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch roles');
    }
  }

  // Get role by ID
  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await this.api.get<ApiResponse<Role>>(`/roles/${id}`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch role');
    } catch (error: any) {
      console.error('Error fetching role:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch role');
    }
  }

  // Create new role
  async createRole(data: CreateRoleData): Promise<Role> {
    try {
      const response = await this.api.post<ApiResponse<Role>>('/roles', data);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create role');
    } catch (error: any) {
      console.error('Error creating role:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create role');
    }
  }

  // Update role
  async updateRole(id: number, data: UpdateRoleData): Promise<Role> {
    try {
      const response = await this.api.put<ApiResponse<Role>>(`/roles/${id}`, data);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update role');
    } catch (error: any) {
      console.error('Error updating role:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update role');
    }
  }

  // Delete role
  async deleteRole(id: number): Promise<void> {
    try {
      const response = await this.api.delete<ApiResponse<null>>(`/roles/${id}`);
      
      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to delete role');
      }
    } catch (error: any) {
      console.error('Error deleting role:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete role');
    }
  }

  // Toggle role status
  async toggleRoleStatus(id: number): Promise<Role> {
    try {
      const response = await this.api.put<ApiResponse<Role>>(`/roles/${id}/toggle`);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to toggle role status');
    } catch (error: any) {
      console.error('Error toggling role status:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to toggle role status');
    }
  }

  // Get role statistics
  async getRoleStats(): Promise<RoleStats[]> {
    try {
      const response = await this.api.get<ApiResponse<RoleStats[]>>('/roles/stats');
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch role statistics');
    } catch (error: any) {
      console.error('Error fetching role stats:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch role statistics');
    }
  }

  // Helper method to validate role data
  validateRoleData(data: CreateRoleData | UpdateRoleData): string[] {
    const errors: string[] = [];

    if ('name' in data && data.name) {
      if (!/^[a-zA-Z0-9_-]+$/.test(data.name)) {
        errors.push('Role name can only contain letters, numbers, hyphens and underscores');
      }
    }

    if ('permissions' in data && data.permissions) {
      if (typeof data.permissions !== 'object' || Array.isArray(data.permissions)) {
        errors.push('Permissions must be an object');
      }
    }

    return errors;
  }

  // Available permissions for role creation
  getAvailablePermissions(): Record<string, string[]> {
    return {
      users: ['create', 'read', 'update', 'delete'],
      roles: ['create', 'read', 'update', 'delete'],
      news: ['create', 'read', 'update', 'delete', 'publish'],
      events: ['create', 'read', 'update', 'delete', 'publish'],
      categories: ['create', 'read', 'update', 'delete'],
      media: ['upload', 'read', 'update', 'delete'],
      documents: ['create', 'read', 'update', 'delete'],
      translations: ['create', 'read', 'update', 'delete'],
      system: ['read', 'update', 'backup', 'stats']
    };
  }
}

const roleService = new RoleService();
export default roleService; 