import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  FolderTree, 
  Database, 
  Users, 
  LogOut, 
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const AdminSidebar: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get user info
  const adminUser = localStorage.getItem('adminUser');
  const user = adminUser ? JSON.parse(adminUser) : null;
  const userEmail = user?.email || 'admin@dseza.vn';
  const userInitials = userEmail.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminUserToken');
    toast.success(t('admin.logout.success', 'Đăng xuất thành công!'));
    navigate('/admin/login');
  };

  const menuItems = [
    {
      label: t('admin.sidebar.dashboard', 'Dashboard'),
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/admin/dashboard'
    },
    {
      label: t('admin.sidebar.newsManagement', 'Quản lý Tin tức'),
      href: '/admin/news',
      icon: FileText,
      active: location.pathname.startsWith('/admin/news')
    },
    {
      label: t('admin.sidebar.eventManagement', 'Quản lý Sự kiện'),
      href: '/admin/events',
      icon: Calendar,
      active: location.pathname.startsWith('/admin/events')
    },
    {
      label: t('admin.sidebar.categoryManagement', 'Quản lý Danh mục'),
      href: '/admin/categories',
      icon: FolderTree,
      active: location.pathname.startsWith('/admin/categories'),
      placeholder: true
    },
    {
      label: t('admin.sidebar.resourceManagement', 'Quản lý Tài nguyên'),
      href: '/admin/resources',
      icon: Database,
      active: location.pathname.startsWith('/admin/resources'),
      placeholder: true
    },
    {
      label: t('admin.sidebar.userManagement', 'Quản lý Người dùng'),
      href: '/admin/users',
      icon: Users,
      active: location.pathname.startsWith('/admin/users'),
      placeholder: true,
      adminOnly: true
    }
  ];

  const SidebarContent = () => (
    <div className={cn(
      "h-full flex flex-col",
      theme === 'dark' ? 'bg-dseza-dark-secondary-bg' : 'bg-slate-100'
    )}>
      {/* Logo Section */}
      <div className={cn(
        "p-4 border-b border-opacity-20",
        theme === 'dark' ? 'border-dseza-dark-border' : 'border-dseza-light-border'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            theme === 'dark' ? 'bg-gradient-to-br from-dseza-dark-primary to-dseza-dark-accent' : 'bg-gradient-to-br from-dseza-light-primary to-dseza-light-accent'
          )}>
            <span className="text-white font-montserrat font-bold text-sm">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className={cn(
                "font-montserrat font-bold text-lg",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                DSEZA
              </h1>
              <p className={cn(
                "text-xs font-inter",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          // Skip admin-only items if user is not admin
          if (item.adminOnly && user?.role !== 'admin') {
            return null;
          }

          const Icon = item.icon;
          const isActive = item.active;

          return (
            <div key={item.href}>
              {item.placeholder ? (
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-not-allowed opacity-60 font-inter",
                  theme === 'dark' 
                    ? 'text-dseza-dark-secondary-text' 
                    : 'text-dseza-light-secondary-text'
                )}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-inter",
                    isActive
                      ? theme === 'dark'
                        ? 'bg-dseza-dark-primary text-dseza-dark-main-bg shadow-lg'
                        : 'bg-dseza-light-primary text-white shadow-lg'
                      : theme === 'dark'
                      ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-primary'
                      : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-primary'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <Separator className={cn(
        "opacity-30",
        theme === 'dark' ? 'bg-dseza-dark-border' : 'bg-dseza-light-border'
      )} />

      {/* User Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarFallback className={cn(
              "text-white text-sm font-montserrat font-bold",
              theme === 'dark' 
                ? 'bg-gradient-to-br from-dseza-dark-primary to-dseza-dark-accent' 
                : 'bg-gradient-to-br from-dseza-light-primary to-dseza-light-accent'
            )}>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate font-inter",
                theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
              )}>
                {userEmail}
              </p>
              <p className={cn(
                "text-xs font-inter",
                theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
              )}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className={cn(
            "w-full justify-start gap-2 font-inter transition-all duration-200",
            theme === 'dark' 
              ? 'border-dseza-dark-border text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-primary hover:border-dseza-dark-primary' 
              : 'border-dseza-light-border text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-primary hover:border-dseza-light-primary'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && t('admin.sidebar.logout', 'Đăng xuất')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col transition-all duration-300 border-r shadow-md relative",
        isCollapsed ? 'w-20' : 'w-64',
        theme === 'dark' ? 'border-dseza-dark-border' : 'border-dseza-light-border'
      )}>
        {/* Collapse Button */}
        <div className="absolute top-4 -right-3 z-10">
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="sm"
            variant="outline"
            className={cn(
              "w-6 h-6 p-0 rounded-full shadow-md transition-all duration-200",
              theme === 'dark' 
                ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border hover:bg-dseza-dark-hover' 
                : 'bg-white border-dseza-light-border hover:bg-dseza-light-hover'
            )}
          >
            <ChevronLeft className={cn(
              "w-4 h-4 transition-transform",
              isCollapsed && 'rotate-180',
              theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
            )} />
          </Button>
        </div>

        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsMobileOpen(true)}
        variant="outline"
        size="sm"
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 w-10 h-10 p-0 shadow-lg",
          theme === 'dark' 
            ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border text-dseza-dark-main-text hover:bg-dseza-dark-hover' 
            : 'bg-white border-dseza-light-border text-dseza-light-main-text hover:bg-dseza-light-hover'
        )}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMobileOpen(false)} 
          />
          
          {/* Sidebar */}
          <div className={cn(
            "relative w-64 h-full shadow-xl animate-slide-in-right",
            theme === 'dark' ? 'bg-dseza-dark-secondary-bg' : 'bg-slate-100'
          )}>
            {/* Close Button */}
            <Button
              onClick={() => setIsMobileOpen(false)}
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-4 right-4 w-8 h-8 p-0",
                theme === 'dark' 
                  ? 'text-dseza-dark-main-text hover:bg-dseza-dark-hover' 
                  : 'text-dseza-light-main-text hover:bg-dseza-light-hover'
              )}
            >
              <X className="w-4 h-4" />
            </Button>

            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar; 