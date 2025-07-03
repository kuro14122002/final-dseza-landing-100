import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  FileTextIcon,
  Image,
  Plus,
  Eye,
  ThumbsUp,
  Download,
  Settings,
  BarChart3,
  Bell,
  Zap,
  Globe,
  Shield,
  Database
} from 'lucide-react';
import { getNewsStats } from '@/services/newsService';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

interface DashboardStats {
  totalNews: number;
  totalEvents: number;
  totalViewsThisMonth: number;
  activeUsersThisMonth: number;
  totalComments: number;
  totalDocuments: number;
  pendingApproval: number;
  systemHealth: number;
}

interface RecentActivity {
  id: number;
  type: 'news' | 'event' | 'comment' | 'document';
  title: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'published';
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
  badge?: string;
}

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const token = localStorage.getItem('adminUserToken');
    const user = localStorage.getItem('adminUser');
    
    // Only fetch data if user is authenticated
    if (token && user) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats from API
      const statsData = await getNewsStats();
      setStats(statsData);

      // Mock recent activity data - Enhanced workflow tracking
      const mockActivity: RecentActivity[] = [
        {
          id: 1,
          type: 'news',
          title: 'Khu Công nghệ cao Đà Nẵng ký kết hợp tác với Samsung',
          action: 'đã tạo bài viết',
          user: 'Nguyễn Văn A - Phóng viên',
          timestamp: '2024-01-15 10:30:00',
          status: 'pending'
        },
        {
          id: 2,
          type: 'news',
          title: 'Chính sách ưu đãi đầu tư mới năm 2024',
          action: 'đã duyệt bài viết',
          user: 'Trần Thị B - Biên tập viên',
          timestamp: '2024-01-15 10:15:00',
          status: 'approved'
        },
        {
          id: 3,
          type: 'event',
          title: 'Hội thảo đầu tư vào DSEZA',
          action: 'đã cập nhật sự kiện',
          user: 'Lê Văn C - Phóng viên',
          timestamp: '2024-01-15 09:45:00',
          status: 'published'
        },
        {
          id: 4,
          type: 'comment',
          title: 'Góp ý về thủ tục đầu tư',
          action: 'gửi góp ý mới',
          user: 'Doanh nghiệp ABC',
          timestamp: '2024-01-15 09:20:00',
          status: 'pending'
        },
        {
          id: 5,
          type: 'document',
          title: 'Quyết định số 01/2024/QĐ-DSEZA',
          action: 'đã xuất bản văn bản',
          user: 'Phạm Văn D - Admin',
          timestamp: '2024-01-15 08:45:00',
          status: 'published'
        },
        {
          id: 6,
          type: 'news',
          title: 'Thông báo về lịch làm việc Tết Nguyên đán',
          action: 'đã tạo bản nháp',
          user: 'Hoàng Thị E - Biên tập viên',
          timestamp: '2024-01-14 16:30:00',
          status: 'pending'
        }
      ];
      
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh dashboard data
  const refreshDashboard = React.useCallback(async () => {
    await fetchDashboardData();
    toast.success('Dữ liệu dashboard đã được cập nhật');
  }, []);

  // Quick actions configuration - Organized by workflow priority
  const quickActions: QuickAction[] = [
    {
      title: 'Tạo tin tức mới',
      description: 'Viết và xuất bản bài viết',
      href: '/admin/news/create',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Duyệt nội dung',
      description: 'Xem bài viết chờ duyệt',
      href: '/admin/news?status=pending',
      icon: CheckCircle,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      badge: stats?.pendingApproval ? `${stats.pendingApproval}` : undefined
    },
    {
      title: 'Quản lý chuyên mục',
      description: 'Phân loại và tổ chức nội dung',
      href: '/admin/categories',
      icon: FileText,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Lịch công tác & Sự kiện',
      description: 'Cập nhật lịch và sự kiện',
      href: '/admin/events',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Thư viện đa phương tiện',
      description: 'Quản lý hình ảnh và video',
      href: '/admin/media',
      icon: Image,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Hệ thống văn bản',
      description: 'Quản lý văn bản pháp lý',
      href: '/admin/documents',
      icon: FileTextIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Quản lý vai trò',
      description: 'Phân quyền và vai trò hệ thống',
      href: '/admin/roles',
      icon: Shield,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Hỏi đáp từ người dân',
      description: 'Trả lời câu hỏi công dân',
      href: '/admin/qa',
      icon: HelpCircle,
      color: 'bg-teal-500 hover:bg-teal-600',
      badge: 'Sắp có'
    }
  ];

  // Stats cards configuration - Enhanced according to design document
  const statsCards = [
    {
      title: 'Tổng số tin tức',
      value: stats?.totalNews || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'increase',
      description: 'Bài viết đã xuất bản',
      urgent: false
    },
    {
      title: 'Chờ duyệt',
      value: stats?.pendingApproval || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+3',
      changeType: 'increase',
      description: 'Nội dung cần xử lý',
      urgent: true
    },
    {
      title: 'Sự kiện & Lịch công tác',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'increase',
      description: 'Sự kiện trong tháng',
      urgent: false
    },
    {
      title: 'Lượt truy cập (7 ngày)',
      value: Math.floor((stats?.totalViewsThisMonth || 0) / 4),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'increase',
      description: 'Biểu đồ xu hướng tích cực',
      urgent: false
    },
    {
      title: 'Hỏi đáp mới',
      value: Math.floor((stats?.totalComments || 0) / 3),
      icon: HelpCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+7',
      changeType: 'increase',
      description: 'Câu hỏi chưa trả lời',
      urgent: false
    },
    {
      title: 'Văn bản pháp lý',
      value: stats?.totalDocuments || 0,
      icon: FileTextIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+3%',
      changeType: 'increase',
      description: 'Văn bản trong tháng',
      urgent: false
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'news': return FileText;
      case 'event': return Calendar;
      case 'comment': return MessageSquare;
      case 'document': return FileTextIcon;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'news': return 'text-blue-600';
      case 'event': return 'text-green-600';
      case 'comment': return 'text-purple-600';
      case 'document': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-700 border-yellow-600 bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-blue-700 border-blue-600 bg-blue-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case 'published':
        return (
          <Badge variant="outline" className="text-green-700 border-green-600 bg-green-50">
            <Eye className="h-3 w-3 mr-1" />
            Đã xuất bản
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const headerActions = (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-muted-foreground">
        Cập nhật lúc: {currentTime.toLocaleString('vi-VN')}
      </div>
      <Button 
        onClick={refreshDashboard}
        variant="outline"
        size="sm"
        disabled={isLoading}
      >
        <Activity className="h-4 w-4 mr-2" />
        Làm mới
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Bảng điều khiển"
      description="Tổng quan hoạt động Cổng thông tin DSEZA"
      actions={headerActions}
      isLoading={isLoading && !stats}
    >
      {/* Dashboard Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <LayoutDashboard className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Trung tâm chỉ huy vận hành Cổng thông tin
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Theo dõi số lượng bài viết chờ duyệt, câu hỏi góp ý mới, biểu đồ lượt truy cập 7 ngày 
              và các lối tắt đến chức năng thường sử dụng. Hỗ trợ quy trình duyệt xuất bản trực quan.
            </p>
          </div>
        </div>
      </div>

      {/* System Health Alert */}
      {stats && stats.systemHealth < 90 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Cảnh báo hiệu suất hệ thống
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Hệ thống đang hoạt động ở {stats.systemHealth}%. Vui lòng kiểm tra và tối ưu hóa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview - Enhanced with visual indicators */}
      <div className="admin-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className={cn(
              "admin-card hover:shadow-lg transition-all duration-200",
              card.urgent && "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.title}
                      </p>
                      {card.urgent && (
                        <Badge variant="outline" className="text-yellow-700 border-yellow-600">
                          Cần xử lý
                        </Badge>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatNumber(card.value)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {card.description}
                    </p>
                    <div className="flex items-center mt-3">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">
                        {card.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        so với tháng trước
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg ml-4",
                    card.bgColor,
                    theme === 'dark' && "bg-opacity-20"
                  )}>
                    <Icon className={cn("h-6 w-6", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Approval Alert */}
      {stats && stats.pendingApproval > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-orange-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-200">
                    Cần xử lý ngay
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300">
                    Có {stats.pendingApproval} nội dung đang chờ duyệt
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/admin/news?status=pending')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Xem ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traffic Chart - 7 days as per design document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Biểu đồ lượt truy cập (7 ngày qua)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple bar chart representation */}
            <div className="grid grid-cols-7 gap-2 h-32">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => {
                const height = Math.random() * 100 + 20; // Mock data
                const visitors = Math.floor(Math.random() * 500 + 100);
                return (
                  <div key={day} className="flex flex-col items-center">
                    <div className="flex-1 flex items-end w-full">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`${day}: ${visitors} lượt truy cập`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{day}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {visitors}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Tổng lượt truy cập tuần này: {formatNumber(Math.floor((stats?.totalViewsThisMonth || 0) / 4))}</span>
              <span className="text-green-600 font-medium">↗ +15% so với tuần trước</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Truy cập nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="admin-quick-actions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      onClick={() => navigate(action.href)}
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-gray-50 dark:hover:bg-gray-800 relative"
                      disabled={action.badge === 'Sắp có'}
                    >
                      <div className="flex items-center w-full">
                        <div className={cn(
                          "p-2 rounded-lg mr-3",
                          action.color,
                          action.badge === 'Sắp có' && "opacity-50"
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {action.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {action.description}
                          </div>
                        </div>
                        {action.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Status & System Health */}
        <div className="space-y-6">
          {/* Content Workflow Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Luồng công việc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm">Bản nháp</span>
                  </div>
                  <span className="text-sm font-medium">{Math.floor((stats?.pendingApproval || 0) * 0.6)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm">Chờ duyệt</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.pendingApproval || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">Đã duyệt</span>
                  </div>
                  <span className="text-sm font-medium">{Math.floor((stats?.totalNews || 0) * 0.2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Đã xuất bản</span>
                  </div>
                  <span className="text-sm font-medium">{stats?.totalNews || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Trạng thái hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Hiệu suất hệ thống</span>
                    <span className="text-sm text-gray-600">{stats?.systemHealth || 95}%</span>
                  </div>
                  <Progress value={stats?.systemHealth || 95} className="h-2" />
                </div>
                
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Cơ sở dữ liệu</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">API Service</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Bảo mật</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/activity')}
            >
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent className="admin-activity-section">
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                  onClick={() => {
                    // Navigate to appropriate page based on activity type
                    if (activity.type === 'news') {
                      navigate('/admin/news');
                    } else if (activity.type === 'event') {
                      navigate('/admin/events');
                    } else if (activity.type === 'document') {
                      navigate('/admin/documents');
                    } else if (activity.type === 'comment') {
                      navigate('/admin/comments');
                    }
                  }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200 group-hover:scale-110",
                    activity.type === 'news' && "bg-blue-100 dark:bg-blue-900",
                    activity.type === 'event' && "bg-green-100 dark:bg-green-900",
                    activity.type === 'comment' && "bg-purple-100 dark:bg-purple-900",
                    activity.type === 'document' && "bg-orange-100 dark:bg-orange-900"
                  )}>
                    <Icon className={cn("h-4 w-4", getActivityColor(activity.type))} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {activity.user} {activity.action}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {activity.title}
                    </p>
                    {/* Show workflow status for news items */}
                    {activity.type === 'news' && (
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">Quy trình:</span>
                        <div className="flex items-center space-x-1">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            activity.status === 'pending' ? "bg-yellow-500" : "bg-gray-300"
                          )}></div>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            activity.status === 'approved' || activity.status === 'published' ? "bg-blue-500" : "bg-gray-300"
                          )}></div>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            activity.status === 'published' ? "bg-green-500" : "bg-gray-300"
                          )}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default DashboardPage; 