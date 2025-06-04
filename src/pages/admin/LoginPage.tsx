import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, LogIn, Loader2, Sun, Moon, Globe } from 'lucide-react';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Custom hooks & utils
import { useTranslation } from '@/utils/translations';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

// Định nghĩa Zod Schema sử dụng t() cho messages
const getLoginSchema = (t: (key: string, params?: any) => string) => z.object({
  email: z.string()
    .min(1, { message: t('validation.email.required') })
    .email({ message: t('validation.email.invalid') }),
  password: z.string()
    .min(1, { message: t('validation.password.required') })
    .min(8, { message: t('validation.password.minLength', { count: 8 }) }),
});

type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = getLoginSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Hàm xử lý submit form với API đăng nhập thực tế
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // API URL - có thể thay đổi dựa trên môi trường deployment
      const API_LOGIN_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost/api'}/v1/auth/login.php`;

      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === 'success' && responseData.token && responseData.user) {
        // Lưu JWT token vào localStorage
        localStorage.setItem('adminUserToken', responseData.token);
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('adminUser', JSON.stringify({
          id: responseData.user.id,
          email: responseData.user.email,
          role: responseData.user.role,
          fullName: responseData.user.full_name,
          loginTime: new Date().toISOString() // Giữ loginTime cho ProtectedRoute
        }));
        
        toast.success(t('admin.login.loginSuccess'));
        navigate('/admin/dashboard');
      } else {
        // Hiển thị lỗi từ API hoặc lỗi chung
        toast.error(responseData.message || t('admin.login.authError'));
      }
    } catch (error) {
      console.error("Login API call error:", error);
      toast.error(t('admin.login.authError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý forgot password
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info(t('admin.login.forgotPasswordWIP'));
  };

  // Xác định logo phù hợp với theme
  const logoSrc = theme === 'dark' ? '/media/darklogo3.png' : '/media/lightlogo3.png';

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4 relative",
      "bg-gradient-to-br",
      theme === 'dark' 
        ? 'from-dseza-dark-main-bg via-dseza-dark-secondary to-dseza-dark-main-bg' 
        : 'from-dseza-light-main-bg via-dseza-light-secondary to-dseza-light-main-bg'
    )}>
      {/* Nút chuyển đổi theme và ngôn ngữ */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="sm"
          className={cn(
            "transition-all duration-200",
            theme === 'dark' 
              ? 'text-dseza-dark-main-text border-dseza-dark-border hover:bg-dseza-dark-hover hover:text-dseza-dark-primary' 
              : 'text-dseza-light-main-text border-dseza-light-border hover:bg-dseza-light-hover hover:text-dseza-light-primary'
          )}
        >
          <Globe className="w-4 h-4 mr-1" />
          {t('languageSwitcher.toggle')}
        </Button>
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className={cn(
            "transition-all duration-200",
            theme === 'dark' 
              ? 'text-dseza-dark-main-text border-dseza-dark-border hover:bg-dseza-dark-hover hover:text-dseza-dark-primary' 
              : 'text-dseza-light-main-text border-dseza-light-border hover:bg-dseza-light-hover hover:text-dseza-light-primary'
          )}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 mr-1" />
              {t('themeToggle.lightMode')}
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-1" />
              {t('themeToggle.darkMode')}
            </>
          )}
        </Button>
      </div>

      {/* Logo Section */}
      <div className="mb-8 animate-fade-in">
        <img 
          src={logoSrc} 
          alt={t('logoDSEZAAlt')}
          className="h-16 md:h-20 w-auto drop-shadow-lg transition-all duration-300" 
        />
      </div>

      {/* Login Card */}
      <Card className={cn(
        "w-full max-w-md shadow-2xl border-0 animate-fade-in backdrop-blur-sm",
        theme === 'dark' 
          ? 'bg-dseza-dark-secondary/95 border-dseza-dark-border' 
          : 'bg-dseza-light-main-bg/95 border-dseza-light-border'
      )}>
        <CardHeader className="space-y-1">
          <CardTitle className={cn(
            "text-2xl lg:text-3xl font-montserrat text-center flex items-center justify-center gap-2",
            theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
          )}>
            <LogIn className="w-6 h-6" />
            {t('admin.login.title')}
          </CardTitle>
          <CardDescription className={cn(
            "text-center pt-1",
            theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
          )}>
            {t('admin.login.description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className={cn(
                  "font-medium",
                  theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                )}
              >
                {t('admin.login.emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('admin.login.emailPlaceholder')}
                {...form.register('email')}
                className={cn(
                  "transition-all duration-200 focus:ring-2",
                  theme === 'dark' 
                    ? 'bg-dseza-dark-main-bg border-dseza-dark-border text-dseza-dark-main-text placeholder:text-dseza-dark-secondary-text focus:ring-dseza-dark-primary/50 focus:border-dseza-dark-primary' 
                    : 'bg-white border-dseza-light-border text-dseza-light-main-text placeholder:text-dseza-light-secondary-text focus:ring-dseza-light-primary/50 focus:border-dseza-light-primary'
                )}
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 dark:text-red-400 pt-1 animate-fade-in">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password" 
                  className={cn(
                    "font-medium",
                    theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                  )}
                >
                  {t('admin.login.passwordLabel')}
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={cn(
                    "text-sm hover:underline transition-colors duration-200",
                    theme === 'dark' 
                      ? 'text-dseza-dark-primary hover:text-dseza-dark-primary-hover' 
                      : 'text-dseza-light-primary hover:text-dseza-light-primary-hover'
                  )}
                >
                  {t('admin.login.forgotPasswordLink')}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register('password')}
                  className={cn(
                    "pr-10 transition-all duration-200 focus:ring-2",
                    theme === 'dark' 
                      ? 'bg-dseza-dark-main-bg border-dseza-dark-border text-dseza-dark-main-text placeholder:text-dseza-dark-secondary-text focus:ring-dseza-dark-primary/50 focus:border-dseza-dark-primary' 
                      : 'bg-white border-dseza-light-border text-dseza-light-main-text placeholder:text-dseza-light-secondary-text focus:ring-dseza-light-primary/50 focus:border-dseza-light-primary'
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute inset-y-0 right-0 flex items-center px-3 transition-colors duration-200",
                    theme === 'dark' 
                      ? 'text-dseza-dark-secondary-text hover:text-dseza-dark-main-text' 
                      : 'text-dseza-light-secondary-text hover:text-dseza-light-main-text'
                  )}
                  aria-label={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 dark:text-red-400 pt-1 animate-fade-in">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              className={cn(
                "w-full font-semibold py-3 text-base transition-all duration-200 transform hover:scale-105",
                theme === 'dark' 
                  ? 'bg-dseza-dark-primary text-dseza-dark-main-bg hover:bg-dseza-dark-primary-hover disabled:bg-dseza-dark-primary/50 shadow-lg hover:shadow-dseza-dark-primary/25' 
                  : 'bg-dseza-light-primary text-white hover:bg-dseza-light-primary-hover disabled:bg-dseza-light-primary/50 shadow-lg hover:shadow-dseza-light-primary/25'
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('admin.login.loggingInButton')}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> 
                  {t('admin.login.loginButton')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="text-center text-xs justify-center">
          <p className={cn(
            theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
          )}>
            {t('admin.login.footerNote')}
          </p>
        </CardFooter>
      </Card>

      {/* API Integration Info */}
      <div className={cn(
        "mt-8 text-center text-xs animate-fade-in p-4 rounded-lg backdrop-blur-sm",
        theme === 'dark' 
          ? 'text-dseza-dark-secondary-text bg-dseza-dark-secondary/30' 
          : 'text-dseza-light-secondary-text bg-dseza-light-secondary/30'
      )}>
        <p className="font-medium mb-1">API Integration Active</p>
        <p>Using real authentication via PHP backend</p>
        <p>Enter your admin credentials to login</p>
      </div>
    </div>
  );
};

export default LoginPage; 