import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Shield, Save, Loader2, Eye, EyeOff } from 'lucide-react';

// Zod schema for password change validation
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu mới không được quá 50 ký tự'),
  confirmPassword: z
    .string()
    .min(1, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu phải giống nhau",
  path: ["confirmPassword"]
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
  isLoading?: boolean;
  resetTrigger?: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  isLoading = false,
  resetTrigger = false
}) => {
  const { theme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleFormSubmit = (data: ChangePasswordFormData) => {
    onSubmit(data);
  };

  // Reset form when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger) {
      reset();
    }
  }, [resetTrigger, reset]);

  return (
    <Card className={cn(
      "max-w-2xl mx-auto",
      theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Đổi mật khẩu
        </CardTitle>
        <p className={cn(
          "text-sm",
          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
        )}>
          Cập nhật mật khẩu để bảo mật tài khoản của bạn
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Current Password Field */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Mật khẩu hiện tại *
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                {...register('currentPassword')}
                placeholder="Nhập mật khẩu hiện tại"
                className={cn(
                  "pr-10",
                  errors.currentPassword && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              Mật khẩu mới *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register('newPassword')}
                placeholder="Nhập mật khẩu mới"
                className={cn(
                  "pr-10",
                  errors.newPassword && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}
            <p className={cn(
              "text-xs",
              theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
            )}>
              Mật khẩu phải có ít nhất 6 ký tự
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu mới *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu mới"
                className={cn(
                  "pr-10",
                  errors.confirmPassword && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
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
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm; 