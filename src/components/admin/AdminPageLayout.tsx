import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Home } from 'lucide-react';
import DataSyncIndicator from './DataSyncIndicator';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  breadcrumbs = [],
  actions,
  children,
  isLoading = false,
  className,
  showBackButton = false,
  backUrl
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/dashboard')}
          className="h-auto p-0 text-muted-foreground hover:text-foreground"
        >
          <Home className="h-4 w-4" />
        </Button>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            {item.href ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.href!)}
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Button>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const renderHeader = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              {description && <Skeleton className="h-4 w-96" />}
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {renderBreadcrumbs()}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DataSyncIndicator variant="minimal" />
            {actions && actions}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex-1 space-y-6 p-6", className)}>
      {renderHeader()}
      <Separator />
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default AdminPageLayout; 