// src/types/users.ts

// Basic user interface
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  full_name?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
}

// User roles enum
export type UserRole = 'admin' | 'editor';

// User status enum
export type UserStatus = 'active' | 'inactive';

// User form data interface
export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  full_name?: string;
  is_active?: boolean;
}

// User creation data (password required)
export interface CreateUserData extends UserFormData {
  password: string;
}

// User update data (password and role optional)
export interface UpdateUserData extends Omit<UserFormData, 'password' | 'role'> {
  password?: string;
  role?: UserRole;
}

// User filters interface
export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  sortBy?: UserSortBy;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

// User sorting options
export type UserSortBy = 'id' | 'username' | 'email' | 'role' | 'full_name' | 'is_active' | 'created_at' | 'updated_at';
export type SortDirection = 'ASC' | 'DESC';

// User API response interface
export interface UserResponse {
  status: 'success' | 'error';
  message: string;
  data: User;
}

// Users list API response interface
export interface UsersListResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    data: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// User statistics interface
export interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_roles: number;
}

// User statistics response
export interface UserStatsResponse {
  status: 'success' | 'error';
  message: string;
  data: UserStatistics;
}

// Change password data
export interface ChangePasswordData {
  password: string;
}

// Bulk operations interface
export interface UserBulkOperation {
  operation: 'activate' | 'deactivate' | 'delete' | 'changeRole';
  userIds: number[];
  data?: {
    role?: UserRole;
    [key: string]: any;
  };
}

// User table props
export interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: number[];
  onSelectUser: (userId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  sortBy: UserSortBy;
  sortDirection: SortDirection;
  onSort: (field: UserSortBy) => void;
}

// User drawer props
export interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
}

// User form props  
export interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
} 