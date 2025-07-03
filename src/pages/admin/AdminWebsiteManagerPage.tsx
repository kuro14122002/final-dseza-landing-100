import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Globe,
  Users,
  Shield,
  Menu,
  FileText,
  Lock,
  FolderOpen,
  Image,
  Video,
  Link,
  Calendar,
  Eye,
  Settings,
  Languages,
  MessageSquare,
  Phone,
  Vote,
  HelpCircle,
  BarChart3,
  Share2,
  Smartphone,
  Activity,
  Layout,
  UserCheck,
  BookOpen,
  Palette,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Database
} from 'lucide-react';

interface SystemModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'inactive' | 'maintenance';
  features: string[];
  category: 'system' | 'content' | 'security' | 'analytics' | 'integration';
  progress: number;
  lastSync?: string;
}

const AdminWebsiteManagerPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  // Định nghĩa các module hệ thống dựa trên yêu cầu
  const systemModules: SystemModule[] = [
    {
      id: 'system-functions',
      title: 'Chức năng hệ thống',
      description: 'Quản lý đăng nhập, thông tin cá nhân, bảo mật',
      icon: Settings,
      status: 'active',
      category: 'system',
      progress: 100,
      features: ['Đăng nhập', 'Thay đổi thông tin cá nhân', 'Thay đổi mật khẩu', 'Đăng xuất']
    },
    {
      id: 'user-management',
      title: 'Quản lý thành viên',
      description: 'Quản lý người dùng và nhóm thành viên',
      icon: Users,
      status: 'active',
      category: 'system',
      progress: 85,
      features: ['Quản lý nhóm thành viên', 'Quản lý thành viên']
    },
    {
      id: 'permission-system',
      title: 'Phân quyền hệ thống',
      description: 'Quản lý quyền truy cập và thao tác',
      icon: Shield,
      status: 'active',
      category: 'security',
      progress: 90,
      features: ['Quản lý nhóm quyền', 'Quản lý quyền thao tác']
    },
    {
      id: 'page-menu-management',
      title: 'Quản trị trang/menu',
      description: 'Quản lý cấu trúc trang web và menu',
      icon: Menu,
      status: 'active',
      category: 'content',
      progress: 95,
      features: ['Quản lý danh sách trang/menu', 'Cấu hình chức năng trên trang/menu']
    },
    {
      id: 'news-management',
      title: 'Quản trị tin tức, bài viết',
      description: 'Hệ thống quản lý nội dung tin tức',
      icon: FileText,
      status: 'active',
      category: 'content',
      progress: 100,
      features: ['Quản trị chuyên mục', 'Quản trị tin tức, bài viết', 'Cấu hình kiểu hiển thị']
    },
    {
      id: 'news-permissions',
      title: 'Phân quyền tin tức',
      description: 'Quản lý quyền truy cập nội dung',
      icon: Lock,
      status: 'active',
      category: 'security',
      progress: 80,
      features: ['Phân quyền chuyên mục', 'Cấu hình quyền tài khoản', 'Cập nhật/xóa quyền']
    },
    {
      id: 'document-system',
      title: 'Hệ thống văn bản',
      description: 'Quản lý văn bản và tài liệu',
      icon: FolderOpen,
      status: 'active',
      category: 'content',
      progress: 95,
      features: ['Quản lý lĩnh vực', 'Quản lý cơ quan ban hành', 'Quản lý cấp ban hành', 'Quản lý văn bản']
    },
    {
      id: 'media-library',
      title: 'Thư viện hình ảnh',
      description: 'Quản lý tài nguyên đa phương tiện',
      icon: Image,
      status: 'active',
      category: 'content',
      progress: 100,
      features: ['Quản lý thư mục hình ảnh', 'Quản lý thư viện', 'Cấu hình trình chiếu']
    },
    {
      id: 'video-management',
      title: 'Quản lý video',
      description: 'Hệ thống quản lý video',
      icon: Video,
      status: 'active',
      category: 'content',
      progress: 75,
      features: ['Thêm/sửa/xóa video', 'Hiển thị theo chủ đề', 'Cấu hình kiểu hiển thị']
    },
    {
      id: 'link-management',
      title: 'Quản lý liên kết',
      description: 'Quản lý liên kết website',
      icon: Link,
      status: 'inactive',
      category: 'content',
      progress: 60,
      features: ['Quản lý chủ đề liên kết', 'Quản lý liên kết']
    },
    {
      id: 'schedule-management',
      title: 'Quản lý lịch công tác',
      description: 'Đồng bộ và hiển thị lịch công tác',
      icon: Calendar,
      status: 'active',
      category: 'integration',
      progress: 85,
      lastSync: '2024-12-17 10:30:00',
      features: ['Hiển thị lịch theo tuần', 'Đồng bộ từ hệ thống văn bản điều hành']
    },
    {
      id: 'accessibility',
      title: 'Hỗ trợ người khuyết tật',
      description: 'Tính năng trợ năng website',
      icon: Eye,
      status: 'active',
      category: 'system',
      progress: 70,
      features: ['Thay đổi độ tương phản', 'Thay đổi kích thước font chữ']
    },
    {
      id: 'layout-management',
      title: 'Quản trị bố cục giao diện',
      description: 'Quản lý template và theme',
      icon: Layout,
      status: 'active',
      category: 'content',
      progress: 90,
      features: ['Danh sách bố cục mẫu', 'Lựa chọn và áp dụng bố cục', 'Thay đổi bố cục']
    },
    {
      id: 'visitor-counter',
      title: 'Quản lý lượt truy cập',
      description: 'Thống kê và quản lý visitor',
      icon: Activity,
      status: 'active',
      category: 'analytics',
      progress: 95,
      features: ['Khởi tạo lại bộ đếm', 'Cấu hình hiển thị/ẩn số lượt truy cập']
    },
    {
      id: 'draft-management',
      title: 'Góp ý dự thảo văn bản',
      description: 'Quản lý dự thảo và góp ý',
      icon: BookOpen,
      status: 'inactive',
      category: 'content',
      progress: 40,
      features: ['Xem danh sách dự thảo', 'Thêm/sửa/xóa dự thảo']
    },
    {
      id: 'language-management',
      title: 'Quản trị ngôn ngữ',
      description: 'Hệ thống đa ngôn ngữ',
      icon: Languages,
      status: 'active',
      category: 'system',
      progress: 100,
      features: ['Thêm mới ngôn ngữ', 'Cấu hình hiển thị theo ngôn ngữ']
    },
    {
      id: 'comment-management',
      title: 'Quản trị bình luận',
      description: 'Hệ thống bình luận bài viết',
      icon: MessageSquare,
      status: 'inactive',
      category: 'content',
      progress: 55,
      features: ['Xem danh sách bình luận', 'Cấu hình hiển thị/xóa', 'Xác thực captcha']
    },
    {
      id: 'contact-management',
      title: 'Quản trị thông tin liên hệ',
      description: 'Quản lý form liên hệ và thông tin',
      icon: Phone,
      status: 'active',
      category: 'content',
      progress: 80,
      features: ['Quản lý nhóm liên hệ', 'Quản lý liên hệ', 'Cấu hình giao diện hiển thị']
    },
    {
      id: 'poll-management',
      title: 'Quản trị bình chọn',
      description: 'Hệ thống khảo sát và bình chọn',
      icon: Vote,
      status: 'inactive',
      category: 'content',
      progress: 30,
      features: ['Quản lý câu hỏi', 'Quản lý phương án trả lời', 'Xem kết quả bình chọn']
    },
    {
      id: 'qa-management',
      title: 'Quản trị hỏi đáp',
      description: 'Hệ thống Q&A công khai',
      icon: HelpCircle,
      status: 'active',
      category: 'content',
      progress: 100,
      features: ['Quản lý lĩnh vực hỏi đáp', 'Xem danh sách câu hỏi', 'Trả lời câu hỏi', 'Xác thực captcha']
    },
    {
      id: 'statistics',
      title: 'Thống kê tin bài',
      description: 'Báo cáo và phân tích nội dung',
      icon: BarChart3,
      status: 'active',
      category: 'analytics',
      progress: 100,
      features: ['Thống kê theo trang/thời gian', 'Thống kê theo chuyên mục', 'Xuất báo cáo Excel']
    },
    {
      id: 'social-sharing',
      title: 'Chia sẻ Facebook',
      description: 'Tích hợp chia sẻ mạng xã hội',
      icon: Share2,
      status: 'active',
      category: 'integration',
      progress: 90,
      features: ['Chia sẻ tin bài qua Facebook']
    },
    {
      id: 'security',
      title: 'An ninh mạng',
      description: 'Bảo đảm an toàn thông tin',
      icon: Shield,
      status: 'active',
      category: 'security',
      progress: 95,
      features: ['Bảo mật thông tin', 'Giám sát truy cập']
    },
    {
      id: 'mobile-version',
      title: 'Website di động',
      description: 'Phiên bản tối ưu mobile',
      icon: Smartphone,
      status: 'active',
      category: 'system',
      progress: 100,
      features: ['Responsive design', 'Mobile optimization']
    }
  ];

  // Hàm đồng bộ lịch công tác
  const handleSyncSchedule = async () => {
    setIsLoading(true);
    setSyncProgress(0);
    
    try {
      // Mô phỏng quá trình đồng bộ
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      toast.success('Đồng bộ lịch công tác thành công!');
      setSystemStatus('healthy');
    } catch (error) {
      toast.error('Lỗi đồng bộ lịch công tác');
      setSystemStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đồng bộ thống kê doanh nghiệp
  const handleSyncBusinessStats = async () => {
    setIsLoading(true);
    
    try {
      // API call to sync business statistics
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost/final-dseza-landing-85';
      const response = await fetch(`${API_BASE}/api/stats/sync-business`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminUserToken')}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast.success('Đồng bộ thống kê doanh nghiệp thành công!');
      } else {
        toast.warning('Đồng bộ hoàn tất với một số cảnh báo');
      }
    } catch (error) {
      toast.error('Lỗi đồng bộ thống kê doanh nghiệp');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system':
        return 'border-blue-200 dark:border-blue-800';
      case 'content':
        return 'border-green-200 dark:border-green-800';
      case 'security':
        return 'border-red-200 dark:border-red-800';
      case 'analytics':
        return 'border-purple-200 dark:border-purple-800';
      case 'integration':
        return 'border-orange-200 dark:border-orange-800';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const filteredModules = (category: string) => 
    systemModules.filter(module => module.category === category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={cn(
        "rounded-lg p-6 border",
        theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              "text-2xl font-montserrat font-bold",
              theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
            )}>
              Quản lý Website - DSEZA Portal
            </h1>
            <p className={cn(
              "text-sm font-inter mt-2",
              theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
            )}>
              Hệ thống quản trị tích hợp dựa trên kiến trúc Umbraco CMS
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={systemStatus === 'healthy' ? 'bg-green-100 text-green-800' : 
                           systemStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800'}>
              {systemStatus === 'healthy' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Hoạt động bình thường
                </>
              ) : systemStatus === 'warning' ? (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Cảnh báo
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Có lỗi
                </>
              )}
            </Badge>
            <Button
              onClick={handleSyncSchedule}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Đồng bộ hệ thống
            </Button>
          </div>
        </div>

        {/* Progress bar cho đồng bộ */}
        {syncProgress > 0 && syncProgress < 100 && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Đang đồng bộ: {syncProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Module Management Tabs */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Nội dung
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Thống kê
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Tích hợp
          </TabsTrigger>
        </TabsList>

        {/* System Modules */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules('system').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    getCategoryColor(module.category),
                    selectedModule === module.id && "ring-2 ring-blue-500"
                  )}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{module.title}</CardTitle>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.status === 'active' ? 'Hoạt động' : 
                             module.status === 'inactive' ? 'Tạm dừng' : 'Bảo trì'}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {module.progress}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {module.description}
                    </CardDescription>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {module.features.length > 3 && (
                        <div className="text-xs text-gray-500 mt-2">
                          +{module.features.length - 3} tính năng khác
                        </div>
                      )}
                    </div>

                    {/* Last sync time for relevant modules */}
                    {module.lastSync && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Đồng bộ lần cuối: {module.lastSync}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Content Modules */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules('content').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    getCategoryColor(module.category)
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          theme === 'dark' ? 'bg-green-600' : 'bg-green-600'
                        )}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{module.title}</CardTitle>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.status === 'active' ? 'Hoạt động' : 
                             module.status === 'inactive' ? 'Tạm dừng' : 'Bảo trì'}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {module.progress}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {module.description}
                    </CardDescription>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {module.features.length > 3 && (
                        <div className="text-xs text-gray-500 mt-2">
                          +{module.features.length - 3} tính năng khác
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Security Modules */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules('security').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    getCategoryColor(module.category)
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-600">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{module.title}</CardTitle>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.status === 'active' ? 'Hoạt động' : 
                             module.status === 'inactive' ? 'Tạm dừng' : 'Bảo trì'}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {module.progress}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {module.description}
                    </CardDescription>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Modules */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules('analytics').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    getCategoryColor(module.category)
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-600">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{module.title}</CardTitle>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.status === 'active' ? 'Hoạt động' : 
                             module.status === 'inactive' ? 'Tạm dừng' : 'Bảo trì'}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {module.progress}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {module.description}
                    </CardDescription>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick action button for business stats sync */}
                    {module.id === 'statistics' && (
                      <Button 
                        onClick={handleSyncBusinessStats}
                        disabled={isLoading}
                        className="w-full mt-3"
                        variant="outline"
                        size="sm"
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Đồng bộ thống kê doanh nghiệp
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Integration Modules */}
        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules('integration').map((module) => {
              const Icon = module.icon;
              return (
                <Card 
                  key={module.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    getCategoryColor(module.category)
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-600">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-montserrat">{module.title}</CardTitle>
                          <Badge className={getStatusColor(module.status)} variant="secondary">
                            {module.status === 'active' ? 'Hoạt động' : 
                             module.status === 'inactive' ? 'Tạm dừng' : 'Bảo trì'}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {module.progress}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {module.description}
                    </CardDescription>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>

                    <div className="space-y-1">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {module.lastSync && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Đồng bộ lần cuối: {module.lastSync}
                      </div>
                    )}

                    {/* Quick sync button for schedule management */}
                    {module.id === 'schedule-management' && (
                      <Button 
                        onClick={handleSyncSchedule}
                        disabled={isLoading}
                        className="w-full mt-3"
                        variant="outline"
                        size="sm"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Đồng bộ lịch công tác
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWebsiteManagerPage; 