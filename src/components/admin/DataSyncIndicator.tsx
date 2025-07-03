import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDataSync } from '@/hooks/useDataSync';
import { toast } from 'sonner';

interface DataSyncIndicatorProps {
  showStats?: boolean;
  variant?: 'minimal' | 'detailed';
  className?: string;
}

const DataSyncIndicator: React.FC<DataSyncIndicatorProps> = ({
  showStats = true,
  variant = 'minimal',
  className = '',
}) => {
  const queryClient = useQueryClient();
  const { forceRefreshAll, QUERY_KEYS } = useDataSync();

  // Check if there are any queries in cache
  const cachedQueries = queryClient.getQueryCache().getAll();
  const userQueries = cachedQueries.filter(query => 
    query.queryKey[0] === 'users' || 
    (Array.isArray(query.queryKey) && query.queryKey.includes('users'))
  );
  const roleQueries = cachedQueries.filter(query => 
    query.queryKey[0] === 'roles' || 
    (Array.isArray(query.queryKey) && query.queryKey.includes('roles'))
  );

  // Check if any queries are currently fetching
  const isUserDataFetching = userQueries.some(query => query.state.fetchStatus === 'fetching');
  const isRoleDataFetching = roleQueries.some(query => query.state.fetchStatus === 'fetching');
  const isAnyFetching = isUserDataFetching || isRoleDataFetching;

  // Check data freshness
  const now = Date.now();
  const STALE_TIME = 60000; // 1 minute
  const isUserDataStale = userQueries.some(query => 
    !query.state.dataUpdatedAt || (now - query.state.dataUpdatedAt) > STALE_TIME
  );
  const isRoleDataStale = roleQueries.some(query => 
    !query.state.dataUpdatedAt || (now - query.state.dataUpdatedAt) > STALE_TIME
  );

  const handleRefresh = async () => {
    try {
      await forceRefreshAll();
      toast.success('Đã làm mới tất cả dữ liệu');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi làm mới dữ liệu');
    }
  };

  const getSyncStatus = () => {
    if (isAnyFetching) {
      return { status: 'syncing', label: 'Đang đồng bộ...', color: 'bg-blue-500', icon: RefreshCw };
    }
    if (isUserDataStale || isRoleDataStale) {
      return { status: 'stale', label: 'Dữ liệu cần cập nhật', color: 'bg-yellow-500', icon: AlertCircle };
    }
    return { status: 'fresh', label: 'Dữ liệu mới nhất', color: 'bg-green-500', icon: CheckCircle };
  };

  const syncStatus = getSyncStatus();
  const StatusIcon = syncStatus.icon;

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <div className={`flex items-center gap-2 ${className}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${syncStatus.color} ${isAnyFetching ? 'animate-pulse' : ''}`} />
                <StatusIcon className={`w-3 h-3 text-muted-foreground ${isAnyFetching ? 'animate-spin' : ''}`} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{syncStatus.label}</p>
            </TooltipContent>
          </Tooltip>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnyFetching}
            className="h-7 px-2"
          >
            <RefreshCw className={`w-3 h-3 ${isAnyFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Trạng thái dữ liệu</span>
            </div>
            
            <Badge variant={syncStatus.status === 'fresh' ? 'default' : 'secondary'} className="flex items-center gap-1">
              <StatusIcon className={`w-3 h-3 ${isAnyFetching ? 'animate-spin' : ''}`} />
              {syncStatus.label}
            </Badge>
          </div>

          {showStats && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div>Người dùng: {userQueries.length} queries</div>
              <div>Vai trò: {roleQueries.length} queries</div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnyFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isAnyFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        {showStats && (variant === 'detailed') && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${isUserDataFetching ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="font-medium">Dữ liệu người dùng</span>
              </div>
              <div className="text-muted-foreground">
                {isUserDataStale ? 'Cần cập nhật' : 'Mới nhất'}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${isRoleDataFetching ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="font-medium">Dữ liệu vai trò</span>
              </div>
              <div className="text-muted-foreground">
                {isRoleDataStale ? 'Cần cập nhật' : 'Mới nhất'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataSyncIndicator; 