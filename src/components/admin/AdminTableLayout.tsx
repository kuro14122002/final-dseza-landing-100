import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdminTableLayoutProps {
  // Search functionality
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filter functionality
  filters?: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: FilterOption[];
  }[];
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  };
  
  secondaryActions?: React.ReactNode;
  
  // Table content
  children: React.ReactNode;
  
  // Loading state
  isLoading?: boolean;
  
  // Summary info
  totalItems?: number;
  selectedItems?: number;
  
  // Refresh functionality
  onRefresh?: () => void;
  
  // Custom className
  className?: string;
}

const AdminTableLayout: React.FC<AdminTableLayoutProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  primaryAction,
  secondaryActions,
  children,
  isLoading = false,
  totalItems,
  selectedItems,
  onRefresh,
  className
}) => {

  const renderFiltersBar = () => {
    if (!onSearchChange && filters.length === 0 && !primaryAction && !secondaryActions && !onRefresh) {
      return null;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search and Filters */}
        <div className="flex items-center gap-2 flex-1">
          {onSearchChange && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10"
              />
            </div>
          )}
          
          {filters.map((filter, index) => (
            <div key={index} className="min-w-[120px]">
              <Select value={filter.value} onValueChange={filter.onValueChange}>
                <SelectTrigger>
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {secondaryActions}
          
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || 'default'}
              className="shrink-0"
            >
              {primaryAction.icon && <primaryAction.icon className="h-4 w-4 mr-2" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (totalItems === undefined && selectedItems === undefined) return null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          {totalItems !== undefined && (
            <span>Tổng: <span className="font-medium text-foreground">{totalItems}</span></span>
          )}
          {selectedItems !== undefined && selectedItems > 0 && (
            <span>Đã chọn: <span className="font-medium text-foreground">{selectedItems}</span></span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="space-y-4">
        {renderFiltersBar()}
        {renderSummary()}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTableLayout; 