// Role utility functions for consistent role handling across the app

export interface RoleInfo {
  name: string;
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  description?: string;
}

// Centralized role configuration
export const ROLE_CONFIG: Record<string, RoleInfo> = {
  admin: {
    name: 'admin',
    label: 'Quản trị viên',
    variant: 'destructive',
    description: 'Quản trị viên có toàn quyền hệ thống'
  },
  editor: {
    name: 'editor',
    label: 'Biên tập viên',
    variant: 'secondary',
    description: 'Biên tập viên quản lý nội dung'
  },
  moderator: {
    name: 'moderator',
    label: 'Kiểm duyệt viên',
    variant: 'outline',
    description: 'Kiểm duyệt và quản lý nội dung'
  },
  reporter: {
    name: 'reporter',
    label: 'Phóng viên',
    variant: 'default',
    description: 'Phóng viên tạo và chỉnh sửa bài viết'
  },
  viewer: {
    name: 'viewer',
    label: 'Người xem',
    variant: 'outline',
    description: 'Chỉ có quyền xem nội dung'
  }
};

/**
 * Get display label for a role
 * @param roleName - The role name (e.g., 'admin', 'editor')
 * @returns Display label (e.g., 'Quản trị viên', 'Biên tập viên')
 */
export const getRoleLabel = (roleName: string): string => {
  return ROLE_CONFIG[roleName]?.label || roleName;
};

/**
 * Get badge variant for a role
 * @param roleName - The role name
 * @returns Badge variant for styling
 */
export const getRoleVariant = (roleName: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  return ROLE_CONFIG[roleName]?.variant || 'secondary';
};

/**
 * Get role description
 * @param roleName - The role name
 * @returns Role description
 */
export const getRoleDescription = (roleName: string): string => {
  return ROLE_CONFIG[roleName]?.description || '';
};

/**
 * Check if a role is a system role (protected from deletion)
 * @param roleName - The role name
 * @returns true if role is protected
 */
export const isSystemRole = (roleName: string): boolean => {
  return ['admin', 'editor'].includes(roleName);
};

/**
 * Get all available role options for dropdowns
 * @param roles - Array of role objects from API
 * @returns Array of {label, value} options
 */
export const getRoleOptions = (roles: Array<{name: string, is_active: boolean}>) => {
  return roles
    .filter(role => role.is_active)
    .map(role => ({
      label: getRoleLabel(role.name),
      value: role.name
    }));
}; 