import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import type { UpdateUserProfileData, UserProfileResponse } from '@/services/userService';

// Zod schema for form validation
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Tên hiển thị là bắt buộc')
    .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự')
    .max(100, 'Tên hiển thị không được quá 100 ký tự'),
  avatar: z
    .string()
    .url('URL ảnh đại diện không hợp lệ')
    .optional()
    .or(z.literal(''))
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface MyAccountFormProps {
  user: UserProfileResponse;
  onSubmit: (data: UpdateUserProfileData) => void;
  isLoading?: boolean;
}

const MyAccountForm: React.FC<MyAccountFormProps> = ({
  user,
  onSubmit,
  isLoading = false
}) => {
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.full_name || user.username || '',
      avatar: user.avatar || ''
    }
  });

  const avatarUrl = watch('avatar');

  const handleFormSubmit = (data: ProfileFormData) => {
    onSubmit({
      fullName: data.fullName,
      avatar: data.avatar || ''
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn(
      "max-w-2xl mx-auto",
      theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Thông tin Tài khoản
        </CardTitle>
        <p className={cn(
          "text-sm",
          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
        )}>
          Cập nhật thông tin cá nhân của bạn
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt="Avatar" />
              <AvatarFallback className={cn(
                "text-lg",
                theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
              )}>
                {getUserInitials(user.full_name || user.username || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className={cn(
                "text-lg font-semibold",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                {user.username}
              </h3>
              <p className={cn(
                "text-sm",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                {user.email}
              </p>
              <p className={cn(
                "text-sm font-medium mt-1",
                theme === 'dark' ? 'text-dseza-dark-primary' : 'text-dseza-light-primary'
              )}>
                {user.role === 'admin' ? 'Quản trị viên' : 
                 user.role === 'editor' ? 'Biên tập viên' : 'Phóng viên'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Tên hiển thị *
              </Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Nhập tên hiển thị của bạn"
                className={cn(
                  errors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Avatar URL Field */}
            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                URL Ảnh đại diện
              </Label>
              <Input
                id="avatar"
                {...register('avatar')}
                placeholder="https://example.com/avatar.jpg"
                className={cn(
                  errors.avatar && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.avatar && (
                <p className="text-sm text-red-500">{errors.avatar.message}</p>
              )}
              <p className={cn(
                "text-xs",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                Để trống nếu muốn sử dụng ảnh mặc định
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={!isDirty || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MyAccountForm; 