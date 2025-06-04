import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Sun, Moon, Languages } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Admin (only if we're not already at dashboard)
    if (location.pathname !== '/admin/dashboard') {
      breadcrumbs.push({
        label: 'Admin',
        href: '/admin/dashboard',
        isLast: false
      });
    }

    // Map path segments to breadcrumb labels
    const pathLabels: Record<string, string> = {
      dashboard: t('admin.sidebar.dashboard'),
      news: t('admin.sidebar.newsManagement'),
      events: t('admin.sidebar.eventManagement'),
      categories: t('admin.sidebar.categoryManagement'),
      resources: t('admin.sidebar.resourceManagement'),
      users: t('admin.sidebar.userManagement'),
      create: t('admin.common.create'),
      edit: t('admin.common.edit')
    };

    // Build breadcrumbs from path segments
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isLast = i === pathSegments.length - 1;
      
      // Skip 'admin' segment as it's handled above
      if (segment === 'admin') continue;

      const href = '/' + pathSegments.slice(0, i + 1).join('/');
      breadcrumbs.push({
        label: pathLabels[segment] || segment,
        href,
        isLast
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className={cn(
      "border-b px-6 py-4 flex items-center justify-between shadow-sm",
      theme === 'dark' 
        ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' 
        : 'bg-white border-dseza-light-border'
    )}>
      {/* Breadcrumbs */}
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const items = [];
              
              items.push(
                <BreadcrumbItem key={`item-${index}`}>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage className={cn(
                      "font-medium font-montserrat",
                      theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                    )}>
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href={breadcrumb.href}
                      className={cn(
                        "transition-colors font-inter",
                        theme === 'dark' 
                          ? 'text-dseza-dark-secondary-text hover:text-dseza-dark-primary' 
                          : 'text-dseza-light-secondary-text hover:text-dseza-light-primary'
                      )}
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
              
              if (!breadcrumb.isLast) {
                items.push(
                  <BreadcrumbSeparator 
                    key={`separator-${index}`}
                    className={cn(
                      theme === 'dark' ? 'text-dseza-dark-border' : 'text-dseza-light-border'
                    )} 
                  />
                );
              }
              
              return items;
            }).flat()}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <Button
          onClick={toggleLanguage}
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 transition-all duration-200 font-inter shadow-sm",
            theme === 'dark' 
              ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-primary border border-transparent hover:border-dseza-dark-primary/30' 
              : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-primary border border-transparent hover:border-dseza-light-primary/30'
          )}
        >
          <Languages className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === 'vi' ? 'VI' : 'EN'}
          </span>
        </Button>

        {/* Theme Toggle */}
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className={cn(
            "transition-all duration-200 shadow-sm",
            theme === 'dark' 
              ? 'text-dseza-dark-secondary-text hover:bg-dseza-dark-hover hover:text-dseza-dark-primary border border-transparent hover:border-dseza-dark-primary/30' 
              : 'text-dseza-light-secondary-text hover:bg-dseza-light-hover hover:text-dseza-light-primary border border-transparent hover:border-dseza-light-primary/30'
          )}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader; 