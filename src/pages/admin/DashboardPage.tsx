import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  FileText, 
  Calendar, 
  Eye, 
  Plus, 
  Settings,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  PlusCircle
} from 'lucide-react';

interface StatsData {
  totalNews: number | string;
  totalEvents: number | string;
  totalViewsThisMonth: number | string;
  activeUsersThisMonth: number | string;
}

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State for API data
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Lấy thông tin admin từ localStorage
  const adminUser = localStorage.getItem('adminUser');
  const user = adminUser ? JSON.parse(adminUser) : null;

  // Fetch statistics data from API
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      const token = localStorage.getItem('adminUserToken');

      if (!token) {
        toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        setIsLoadingStats(false);
        return;
      }

      try {
        // API endpoint - adjust this URL to match your backend
        const API_STATS_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost'}/api/v1/stats/overview.php`;
        
        const response = await fetch(API_STATS_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401 || response.status === 403) {
          toast.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
          localStorage.removeItem('adminUserToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
          return;
        }

        const responseData = await response.json();

        if (response.ok && responseData.status === 'success') {
          setStatsData(responseData.data);
        } else {
          console.error('API Error:', responseData);
          toast.error(responseData.message || "Không thể tải dữ liệu thống kê.");
          // Set default values if API fails
          setStatsData({ 
            totalNews: 'N/A', 
            totalEvents: 'N/A', 
            totalViewsThisMonth: 'N/A', 
            activeUsersThisMonth: 'N/A' 
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        toast.error("Lỗi kết nối đến máy chủ thống kê.");
        setStatsData({ 
          totalNews: 'N/A', 
          totalEvents: 'N/A', 
          totalViewsThisMonth: 'N/A', 
          activeUsersThisMonth: 'N/A' 
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [navigate, t]);

  // Updated stats array with dynamic data
  const stats = [
    {
      title: t('admin.dashboard.totalNews', 'Tổng số Tin tức'),
      value: isLoadingStats ? '...' : (statsData?.totalNews ?? '0'),
      icon: FileText,
      trend: '+12%',
      trendUp: true,
      color: theme === 'dark' ? 'text-dseza-dark-primary' : 'text-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.totalEvents', 'Tổng số Sự kiện'),
      value: isLoadingStats ? '...' : (statsData?.totalEvents ?? '0'),
      icon: Calendar,
      trend: '+8%',
      trendUp: true,
      color: theme === 'dark' ? 'text-dseza-dark-primary' : 'text-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.totalViews', 'Lượt xem (Tháng này)'),
      value: isLoadingStats ? '...' : (statsData?.totalViewsThisMonth ?? '0'),
      icon: Eye,
      trend: '+24%',
      trendUp: true,
      color: theme === 'dark' ? 'text-dseza-dark-primary' : 'text-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.activeUsersThisMonth', 'Người dùng hoạt động'),
      value: isLoadingStats ? '...' : (statsData?.activeUsersThisMonth ?? '0'),
      icon: Users,
      trend: '+5%',
      trendUp: true,
      color: theme === 'dark' ? 'text-dseza-dark-primary' : 'text-dseza-light-primary'
    }
  ];

  const quickActions = [
    {
      title: t('admin.dashboard.createNewNews', 'Tạo Tin tức mới'),
      description: 'Thêm bài viết tin tức mới',
      href: '/admin/news/create',
      icon: PlusCircle,
      color: theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.manageAllNews', 'Quản lý Tất cả Tin tức'),
      description: 'Xem và chỉnh sửa tin tức',
      href: '/admin/news',
      icon: FileText,
      color: theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.createNewEvent', 'Tạo Sự kiện mới'),
      description: 'Thêm sự kiện mới',
      href: '/admin/events/create',
      icon: Calendar,
      color: theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
    },
    {
      title: t('admin.dashboard.manageAllEvents', 'Quản lý Tất cả Sự kiện'),
      description: 'Xem và chỉnh sửa sự kiện',
      href: '/admin/events',
      icon: BarChart3,
      color: theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className={cn(
          "text-3xl font-montserrat font-bold tracking-tight",
          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
        )}>
          {t('admin.dashboard.greeting', 'Chào buổi sáng')}
        </h1>
        <p className={cn(
          "text-lg font-inter",
          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
        )}>
          {t('admin.dashboard.welcomeMessage', 'Chào mừng trở lại, {email}!', { email: user?.email || 'Admin' })}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={cn(
              "transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 shadow-md",
              theme === 'dark' 
                ? 'bg-dseza-dark-secondary-bg hover:bg-dseza-dark-hover' 
                : 'bg-white hover:bg-gray-50'
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium font-inter",
                  theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                )}>
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold font-montserrat mb-1",
                  theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                )}>
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 text-xs font-inter">
                  <TrendingUp className={cn(
                    "h-3 w-3",
                    stat.trendUp ? "text-green-500" : "text-red-500"
                  )} />
                  <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>
                    {stat.trend}
                  </span>
                  <span className={cn(
                    theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                  )}>
                    từ tháng trước
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className={cn(
          "text-xl font-montserrat font-semibold tracking-tight",
          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
        )}>
          Lối tắt nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.href}>
                <Card className={cn(
                  "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 shadow-md overflow-hidden",
                  theme === 'dark' 
                    ? 'bg-dseza-dark-secondary-bg hover:bg-dseza-dark-hover' 
                    : 'bg-white hover:bg-gray-50'
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                        action.color
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className={cn(
                          "font-medium font-montserrat group-hover:text-opacity-80 transition-colors",
                          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                        )}>
                          {action.title}
                        </h3>
                        <p className={cn(
                          "text-sm font-inter",
                          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                        )}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Session Information */}
      <Card className={cn(
        "border-0 shadow-md",
        theme === 'dark' 
          ? 'bg-dseza-dark-secondary-bg' 
          : 'bg-white'
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn(
            "font-montserrat font-semibold tracking-tight",
            theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
          )}>
            {t('admin.dashboard.sessionInfo', 'Thông tin Phiên đăng nhập')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className={cn(
                "text-sm font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                {t('admin.dashboard.userEmail', 'Email')}
              </p>
              <p className={cn(
                "font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                {user?.email}
              </p>
            </div>
            <div className="space-y-2">
              <p className={cn(
                "text-sm font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                {t('admin.dashboard.userRole', 'Vai trò')}
              </p>
              <p className={cn(
                "font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
            <div className="space-y-2">
              <p className={cn(
                "text-sm font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                {t('admin.dashboard.loginTime', 'Thời gian đăng nhập')}
              </p>
              <p className={cn(
                "font-medium font-inter",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                {user?.loginTime ? new Date(user.loginTime).toLocaleString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage; 