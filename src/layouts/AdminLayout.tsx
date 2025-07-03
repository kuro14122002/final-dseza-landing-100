import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  FileText,
  FileTextIcon,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Languages,
  Users,
  Shield,
  MessageSquare,
  HelpCircle,
  Vote,
  Palette,
  Layout,
  BarChart3,
  Database,
  Globe,
  Image,
  Link as LinkIcon,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  Bell,
  Home,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import authService from '@/services/authService';

const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['content']);

  // Simple auth check
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Enhanced Navigation items organized by sections as per design document
  const navigationSections = [
    {
      title: 'Quản trị Nội dung',
      key: 'content',
      icon: FileText,
      description: 'Quản lý tin tức, văn bản và nội dung website',
      items: [
        {
          title: 'Tin tức & Bài viết',
          href: '/admin/news',
          icon: FileText,
          description: 'Tạo, chỉnh sửa và quản lý tin tức',
          badge: null
        },
        {
          title: 'Chuyên mục',
          href: '/admin/categories',
          icon: FolderOpen,
          description: 'Phân loại và tổ chức nội dung',
          badge: null
        },
        {
          title: 'Văn bản pháp lý',
          href: '/admin/documents',
          icon: FileTextIcon,
          description: 'Quản lý văn bản, quyết định, thông tư',
          badge: null
        },
        {
          title: 'Thư viện Đa phương tiện',
          href: '/admin/media',
          icon: Image,
          description: 'Hình ảnh, video và tài liệu',
          badge: null
        },
        {
          title: 'Sự kiện & Lịch công tác',
          href: '/admin/events',
          icon: Calendar,
          description: 'Quản lý sự kiện và lịch trình',
          badge: null
        },
        {
          title: 'Liên kết Website',
          href: '/admin/links',
          icon: LinkIcon,
          description: 'Quản lý liên kết ngoài',
          badge: 'Sắp có'
        },
      ]
    },
    {
      title: 'Quản trị Tương tác',
      key: 'interaction',
      icon: MessageSquare,
      description: 'Tương tác với người dân và doanh nghiệp',
      items: [
        {
          title: 'Hỏi - Đáp',
          href: '/admin/qa',
          icon: HelpCircle,
          description: 'Tiếp nhận và trả lời câu hỏi',
          badge: 'Sắp có'
        },
        {
          title: 'Góp ý & Bình luận',
          href: '/admin/comments',
          icon: MessageSquare,
          description: 'Kiểm duyệt bình luận và góp ý',
          badge: 'Sắp có'
        },
        {
          title: 'Thăm dô ý kiến',
          href: '/admin/polls',
          icon: Vote,
          description: 'Tạo và quản lý bình chọn',
          badge: 'Sắp có'
        },
      ]
    },
    {
      title: 'Quản trị Giao diện',
      key: 'interface',
      icon: Palette,
      description: 'Tùy chỉnh giao diện và bố cục website',
      items: [
        {
          title: 'Quản lý Menu',
          href: '/admin/menus',
          icon: Layout,
          description: 'Cấu hình menu điều hướng',
          badge: 'Sắp có'
        },
        {
          title: 'Quản lý Bố cục',
          href: '/admin/layouts',
          icon: Layout,
          description: 'Tùy chỉnh layout trang',
          badge: 'Sắp có'
        },
      ]
    },
    {
      title: 'Quản trị Hệ thống',
      key: 'system',
      icon: Settings,
      description: 'Quản lý người dùng và cấu hình hệ thống',
      items: [
        {
          title: 'Quản lý Vai trò',
          href: '/admin/roles',
          icon: Shield,
          description: 'Phân quyền và vai trò hệ thống',
          badge: null
        },
        {
          title: 'Quản lý Người dùng',
          href: '/admin/user',
          icon: Users,
          description: 'Quản lý người dùng hệ thống',
          badge: null
        },
        {
          title: 'Đa ngôn ngữ',
          href: '/admin/translations',
          icon: Languages,
          description: 'Quản lý ngôn ngữ hiển thị',
          badge: null
        },
        {
          title: 'Quản lý Website',
          href: '/admin/website-manager',
          icon: Globe,
          description: 'Cấu hình chung website',
          badge: null
        },
        {
          title: 'Cấu hình chung',
          href: '/admin/settings',
          icon: Settings,
          description: 'Thiết lập hệ thống',
          badge: 'Sắp có'
        },
      ]
    },
    {
      title: 'Thống kê & Báo cáo',
      key: 'analytics',
      icon: BarChart3,
      description: 'Phân tích dữ liệu và tạo báo cáo',
      items: [
        {
          title: 'Báo cáo Nội dung',
          href: '/admin/reports/news',
          icon: FileText,
          description: 'Thống kê tin bài và nội dung',
          badge: 'Sắp có'
        },
        {
          title: 'Báo cáo Truy cập',
          href: '/admin/reports/traffic',
          icon: BarChart3,
          description: 'Phân tích lưu lượng truy cập',
          badge: 'Sắp có'
        },
        {
          title: 'Đồng bộ EMC',
          href: '/admin/reports/emc',
          icon: Database,
          description: 'Kết nối với hệ thống EMC',
          badge: 'Sắp có'
        },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Đăng xuất thành công');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      authService.removeToken();
      toast.success('Đăng xuất thành công');
      navigate('/admin/login');
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const isActiveSection = (section: any) => {
    return section.items.some((item: any) => isActiveRoute(item.href));
  };

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Trang Chủ Quản Trị';
    if (path.startsWith('/admin/news')) return 'Quản lý Tin tức';
    if (path.startsWith('/admin/categories')) return 'Quản lý Chuyên mục';
    if (path.startsWith('/admin/documents')) return 'Quản lý Văn bản';
    if (path.startsWith('/admin/media')) return 'Thư viện Đa phương tiện';
    if (path.startsWith('/admin/events')) return 'Quản lý Sự kiện';
    if (path.startsWith('/admin/user')) return 'Quản lý Người dùng';
    if (path.startsWith('/admin/permissions')) return 'Phân quyền Hệ thống';
    if (path.startsWith('/admin/translations')) return 'Quản lý Ngôn ngữ';
    if (path.startsWith('/admin/website-manager')) return 'Quản lý Website';
    if (path.startsWith('/admin/reports')) return 'Thống kê & Báo cáo';
    if (path.startsWith('/admin/my-account')) return 'Tài khoản của tôi';
    return 'Quản trị DSEZA';
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'dark' ? 'bg-dseza-dark-main-bg' : 'bg-dseza-light-main-bg'
    )}>
      <div className="flex">
        {/* Enhanced Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
        )}>
          <div className="flex h-full flex-col">
            {/* Enhanced Sidebar Header */}
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              theme === 'dark' ? 'border-dseza-dark-border' : 'border-dseza-light-border'
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
                )}>
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className={cn(
                    "text-lg font-montserrat font-bold",
                    theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                  )}>
                    DSEZA Admin
                  </h2>
                  <p className={cn(
                    "text-xs font-inter",
                    theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                  )}>
                    Hệ thống quản trị
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Enhanced Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Dashboard - Always visible */}
              <Link
                to="/admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-inter font-medium transition-all duration-200 group",
                  isActiveRoute('/admin/dashboard')
                    ? theme === 'dark'
                      ? 'bg-dseza-dark-primary text-white shadow-lg ring-1 ring-dseza-dark-primary/20'
                      : 'bg-dseza-light-primary text-white shadow-lg ring-1 ring-dseza-light-primary/20'
                    : theme === 'dark'
                      ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-main-text'
                      : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-main-text'
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Trang Chủ</span>
                {isActiveRoute('/admin/dashboard') && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-60" />
                )}
              </Link>

              <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

              {/* Navigation Sections */}
              {navigationSections.map((section) => {
                const isExpanded = expandedSections.includes(section.key);
                const hasActiveChild = isActiveSection(section);
                const SectionIcon = section.icon;
                
                return (
                  <div key={section.key} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.key)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg font-inter font-medium transition-all duration-200 group",
                        hasActiveChild
                          ? theme === 'dark'
                            ? 'bg-dseza-dark-primary/20 text-dseza-dark-primary ring-1 ring-dseza-dark-primary/20'
                            : 'bg-dseza-light-primary/20 text-dseza-light-primary ring-1 ring-dseza-light-primary/20'
                          : theme === 'dark'
                            ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-main-text'
                            : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-main-text'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <SectionIcon className="h-5 w-5" />
                        <div className="text-left">
                          <div className="text-sm font-medium">{section.title}</div>
                          <div className={cn(
                            "text-xs opacity-70",
                            hasActiveChild ? 'opacity-80' : 'opacity-60'
                          )}>
                            {section.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasActiveChild && (
                          <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 opacity-60" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-60" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-4 space-y-1">
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isActive = isActiveRoute(item.href);
                          
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-inter text-sm transition-all duration-200 group",
                                isActive
                                  ? theme === 'dark'
                                    ? 'bg-dseza-dark-primary text-white shadow-md ring-1 ring-dseza-dark-primary/20'
                                    : 'bg-dseza-light-primary text-white shadow-md ring-1 ring-dseza-light-primary/20'
                                  : theme === 'dark'
                                    ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-main-text'
                                    : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-main-text'
                              )}
                            >
                              <ItemIcon className="h-4 w-4" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{item.title}</div>
                                <div className={cn(
                                  "text-xs opacity-70 truncate",
                                  isActive ? 'opacity-80' : 'opacity-60'
                                )}>
                                  {item.description}
                                </div>
                              </div>
                              {item.badge && (
                                <Badge 
                                  variant={isActive ? "secondary" : "outline"} 
                                  className="text-xs scale-75"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {isActive && (
                                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            
            {/* Enhanced User Info & Actions */}
            <div className={cn(
              "p-4 border-t",
              theme === 'dark' ? 'border-dseza-dark-border' : 'border-dseza-light-border'
            )}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
                  )}>
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium font-inter truncate",
                      theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                    )}>
                      {user?.name || user?.email || 'Administrator'}
                    </p>
                    <p className={cn(
                      "text-xs font-inter flex items-center gap-1",
                      theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                    )}>
                      <Activity className="h-3 w-3" />
                      Đang hoạt động
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {/* Account Settings Link */}
                  <Link to="/admin/my-account">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-2",
                        isActiveRoute('/admin/my-account')
                          ? theme === 'dark'
                            ? 'bg-dseza-dark-primary text-white'
                            : 'bg-dseza-light-primary text-white'
                          : theme === 'dark' 
                            ? 'hover:bg-dseza-dark-hover text-dseza-dark-secondary-text' 
                            : 'hover:bg-dseza-light-hover text-dseza-light-secondary-text'
                      )}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Tài khoản của tôi</span>
                    </Button>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className={cn(
                        "flex-1",
                        theme === 'dark' 
                          ? 'hover:bg-dseza-dark-hover text-dseza-dark-secondary-text' 
                          : 'hover:bg-dseza-light-hover text-dseza-light-secondary-text'
                      )}
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                    <Link to="/" target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex items-center gap-2",
                          theme === 'dark' 
                            ? 'hover:bg-dseza-dark-hover text-dseza-dark-secondary-text' 
                            : 'hover:bg-dseza-light-hover text-dseza-light-secondary-text'
                        )}
                      >
                        <Home className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className={cn(
                        "flex items-center gap-2",
                        theme === 'dark' 
                          ? 'hover:bg-red-900/50 text-red-400 hover:text-red-300' 
                          : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          {/* Enhanced Top Header */}
          <header className={cn(
            "sticky top-0 z-40 border-b backdrop-blur-sm",
            theme === 'dark' 
              ? 'bg-dseza-dark-secondary-bg/95 border-dseza-dark-border' 
              : 'bg-white/95 border-dseza-light-border'
          )}>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className={cn(
                    "text-2xl font-montserrat font-semibold",
                    theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                  )}>
                    {getCurrentPageTitle()}
                  </h1>
                  <p className={cn(
                    "text-sm font-inter mt-1 opacity-70",
                    theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
                  )}>
                    {location.pathname === '/admin/dashboard' && 'Tổng quan và thống kê hệ thống'}
                    {location.pathname.startsWith('/admin/news') && 'Tạo, chỉnh sửa và quản lý tin tức'}
                    {location.pathname.startsWith('/admin/categories') && 'Phân loại và tổ chức nội dung'}
                    {location.pathname.startsWith('/admin/documents') && 'Quản lý văn bản pháp lý'}
                    {location.pathname.startsWith('/admin/media') && 'Thư viện hình ảnh và video'}
                    {location.pathname.startsWith('/admin/events') && 'Sự kiện và lịch công tác'}
                    {location.pathname.startsWith('/admin/users') && 'Quản lý tài khoản người dùng'}
                    {location.pathname.startsWith('/admin/permissions') && 'Phân quyền và bảo mật'}
                    {location.pathname.startsWith('/admin/translations') && 'Đa ngôn ngữ'}
                    {location.pathname.startsWith('/admin/website-manager') && 'Cấu hình chung website'}
                    {location.pathname.startsWith('/admin/reports') && 'Phân tích và báo cáo dữ liệu'}
                    {location.pathname.startsWith('/admin/my-account') && 'Quản lý thông tin cá nhân và cài đặt tài khoản'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Quick notification */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Current time */}
                <div className={cn(
                  "text-sm font-inter px-3 py-1 rounded-lg",
                  theme === 'dark' ? 'bg-dseza-dark-hover text-dseza-dark-secondary-text' : 'bg-dseza-light-hover text-dseza-light-secondary-text'
                )}>
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={cn(
                    "hidden sm:flex",
                    theme === 'dark' 
                      ? 'hover:bg-dseza-dark-hover text-dseza-dark-secondary-text' 
                      : 'hover:bg-dseza-light-hover text-dseza-light-secondary-text'
                  )}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 