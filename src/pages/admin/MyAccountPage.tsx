import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyAccountForm from '@/components/admin/MyAccountForm';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import userService, { type UpdateUserProfileData, type ChangePasswordData } from '@/services/userService';
import { authService } from '@/services/authService';
import { AlertCircle, CheckCircle2, RefreshCw, User, Shield } from 'lucide-react';

const MyAccountPage: React.FC = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [resetPasswordForm, setResetPasswordForm] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    
    if (!isAuth) {
      toast.error('Phiên đăng nhập đã hết hạn', {
        description: 'Vui lòng đăng nhập lại để tiếp tục.',
      });
      window.location.href = '/admin/login';
      return;
    }
  }, []);

  // Query to get current user data
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: authService.isAuthenticated(), // Only run if authenticated
  });

  // Mutation to update user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileData) => userService.updateUserProfile(data),
    onSuccess: (updatedUser) => {
      // Update the cache with new data
      queryClient.setQueryData(['currentUser'], updatedUser);
      
      // Show success message
      toast.success('Cập nhật thành công!', {
        description: 'Thông tin tài khoản của bạn đã được cập nhật.',
        duration: 4000,
      });
    },
    onError: (error: Error) => {
      toast.error('Cập nhật thất bại!', {
        description: error.message || 'Có lỗi xảy ra khi cập nhật thông tin.',
        duration: 5000,
      });
    }
  });

  // Mutation to change password
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
    onSuccess: () => {
      // Reset the form
      setResetPasswordForm(true);
      setTimeout(() => setResetPasswordForm(false), 100);
      
      // Show success message
      toast.success('Đổi mật khẩu thành công!', {
        description: 'Mật khẩu của bạn đã được cập nhật.',
        duration: 4000,
      });
    },
    onError: (error: Error) => {
      toast.error('Đổi mật khẩu thất bại!', {
        description: error.message || 'Có lỗi xảy ra khi đổi mật khẩu.',
        duration: 5000,
      });
    }
  });

  const handleUpdateProfile = (data: UpdateUserProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const handleChangePassword = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data);
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Card className={cn(
          "max-w-2xl mx-auto",
          theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
        )}>
          <CardHeader>
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-600 dark:text-red-400">
                              <div className="space-y-2">
                  <p className="font-medium">Không thể tải thông tin tài khoản</p>
                  <p className="text-sm">{error.message}</p>
                  <div className="flex gap-2">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Thử lại
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/login'}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Đăng nhập lại
                  </button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Success state
  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không tìm thấy thông tin người dùng.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className={cn(
        "rounded-lg p-6 border",
        theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
      )}>
        <h1 className={cn(
          "text-2xl font-montserrat font-bold",
          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
        )}>
          Tài khoản của tôi
        </h1>
        <p className={cn(
          "text-sm font-inter mt-2",
          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
        )}>
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      {/* Success notifications */}
      {updateProfileMutation.isSuccess && (
        <div className="max-w-4xl mx-auto">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              <p className="font-medium">Cập nhật thành công!</p>
              <p className="text-sm">Thông tin tài khoản của bạn đã được lưu.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {changePasswordMutation.isSuccess && (
        <div className="max-w-4xl mx-auto">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              <p className="font-medium">Đổi mật khẩu thành công!</p>
              <p className="text-sm">Mật khẩu của bạn đã được cập nhật.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content with Tabs */}
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={cn(
            "grid w-full grid-cols-2",
            theme === 'dark' ? 'bg-dseza-dark-secondary-bg' : 'bg-gray-100'
          )}>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bảo mật
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Account Form */}
            <MyAccountForm
              user={user}
              onSubmit={handleUpdateProfile}
              isLoading={updateProfileMutation.isPending}
            />

            {/* Additional Info */}
            <Card className={cn(
              theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
            )}>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className={cn(
                    "text-sm font-medium",
                    theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                  )}>
                    Tài khoản được tạo:
                  </span>
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                  )}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className={cn(
                    "text-sm font-medium",
                    theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                  )}>
                    Cập nhật lần cuối:
                  </span>
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                  )}>
                    {user.updated_at ? new Date(user.updated_at).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            {/* Change Password Form */}
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              isLoading={changePasswordMutation.isPending}
              resetTrigger={resetPasswordForm}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccountPage; 