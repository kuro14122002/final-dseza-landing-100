import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, X } from 'lucide-react';

// Types
import { User, UserFormData, CreateUserData, UpdateUserData } from '@/types/users';

// Services
import userService from '@/services/userService';
import { authService } from '@/services/authService';

// Components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Data synchronization
import { useDataSync } from '@/hooks/useDataSync';

// Role service and utilities
import roleService from '@/services/roleService';
import { getRoleLabel } from '@/utils/roleUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface AddUserDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: () => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: string;
}

const AddUserDrawer: React.FC<AddUserDrawerProps> = ({
  open,
  onClose,
  user,
  onSubmit,
}) => {
  const isEditing = !!user;

  // Data synchronization hook
  const { syncUserChanges, optimisticUpdateUserRole } = useDataSync();

  // Fetch available roles
  const { data: availableRoles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
    select: (roles) => roles.filter(role => role.is_active), // Only active roles
  });

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'editor',
    full_name: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);



  // Reset form when user changes or drawer opens/closes
  useEffect(() => {
    if (open) {
      if (user) {
        // Editing existing user
        setFormData({
          username: user.username,
          email: user.email,
          password: '',
          role: user.role,
          full_name: user.full_name || '',
          is_active: user.is_active,
        });
      } else {
        // Adding new user
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'editor',
          full_name: '',
          is_active: true,
        });
      }
      setErrors({});
      setShowPassword(false);
    }
  }, [open, user]);

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      toast.success('Đã tạo người dùng thành công');
      // Sync all data after creating new user
      syncUserChanges();
      onSubmit();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo người dùng');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data, oldRole }: { id: number; data: UpdateUserData; oldRole?: string }) => {
      // Optimistic update if role is changing
      if (data.role && data.role !== oldRole) {
        optimisticUpdateUserRole(id, data.role);
      }
      return userService.updateUser(id, data);
    },
    onSuccess: () => {
      toast.success('Đã cập nhật người dùng thành công');
      // Sync all data after updating user
      syncUserChanges();
      onSubmit();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật người dùng');
      // If error occurred, sync to revert optimistic updates
      syncUserChanges();
    },
  });

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới và dấu gạch ngang';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    // Password validation (only for new users or when password is provided)
    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }

    // Full name validation (optional but if provided, should be reasonable length)
    if (formData.full_name && formData.full_name.length > 100) {
      newErrors.full_name = 'Họ tên không được vượt quá 100 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra và sửa các lỗi trong form');
      return;
    }

    if (isEditing && user) {
      // Update existing user
      const updateData: UpdateUserData = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name || undefined,
        is_active: formData.is_active,
      };

      // Only include role if allowed to change it
      if (!(user.role === 'admin' && (!authService.isSuperAdmin() || user.username === 'admin'))) {
        updateData.role = formData.role;
      }

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      updateUserMutation.mutate({ 
        id: user.id, 
        data: updateData, 
        oldRole: user.role 
      });
    } else {
      // Create new user
      const createData: CreateUserData = {
        username: formData.username,
        email: formData.email,
        password: formData.password!,
        role: formData.role,
        full_name: formData.full_name || undefined,
        is_active: formData.is_active,
      };

      createUserMutation.mutate(createData);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>
                  {isEditing ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                </SheetTitle>
                <SheetDescription>
                  {isEditing 
                    ? 'Cập nhật thông tin thành viên trong hệ thống'
                    : 'Tạo tài khoản mới cho thành viên'
                  }
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 py-6 space-y-6 overflow-y-auto">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Thông tin cơ bản
              </h3>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Tên đăng nhập <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleFieldChange('full_name', e.target.value)}
                  placeholder="Nhập họ và tên"
                  className={errors.full_name ? 'border-destructive' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Cài đặt tài khoản
              </h3>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? 'Mật khẩu mới (để trống nếu không thay đổi)' : 'Mật khẩu'} 
                  {!isEditing && <span className="text-destructive">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    placeholder={isEditing ? 'Để trống nếu không thay đổi' : 'Nhập mật khẩu'}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Role - Hide for admin users being edited, unless current user is super admin */}
              {!(isEditing && user?.role === 'admin' && (!authService.isSuperAdmin() || user?.username === 'admin')) && (
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Vai trò <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleFieldChange('role', value)}
                  >
                    <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {getRoleLabel(role.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>
              )}

              {/* Display current role for protected admin users being edited */}
              {isEditing && user?.role === 'admin' && (!authService.isSuperAdmin() || user?.username === 'admin') && (
                <div className="space-y-2">
                  <Label>Vai trò hiện tại</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm font-medium">Quản trị viên</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vai trò của tài khoản quản trị viên không thể thay đổi
                    </p>
                  </div>
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Trạng thái hoạt động</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người dùng đăng nhập vào hệ thống
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleFieldChange('is_active', checked)}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
                </>
              ) : (
                isEditing ? 'Cập nhật' : 'Tạo mới'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddUserDrawer;
