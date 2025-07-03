import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Settings, 
  Users, 
  Shield, 
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Services and types
import roleService, { Role, CreateRoleData, UpdateRoleData } from '@/services/roleService';

// Data synchronization
import { useDataSync } from '@/hooks/useDataSync';

// Role utilities
import { getRoleLabel, isSystemRole } from '@/utils/roleUtils';

// Components
import RoleForm from './RoleForm';

// Query keys
const ROLE_QUERIES = {
  all: ['roles'] as const,
  lists: () => [...ROLE_QUERIES.all, 'list'] as const,
  list: (filters: string) => [...ROLE_QUERIES.lists(), { filters }] as const,
  details: () => [...ROLE_QUERIES.all, 'detail'] as const,
  detail: (id: number) => [...ROLE_QUERIES.details(), id] as const,
  stats: () => [...ROLE_QUERIES.all, 'stats'] as const,
};

const RoleCards: React.FC = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Query client for invalidation
  const queryClient = useQueryClient();
  
  // Data synchronization hook
  const { syncRoleChanges, QUERY_KEYS: SYNC_QUERY_KEYS } = useDataSync();

  // Queries
  const {
    data: roles = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ROLE_QUERIES.list(searchTerm),
    queryFn: () => roleService.getRoles(),
    staleTime: 30000, // 30 seconds
  });

  const {
    data: roleStats = [],
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ROLE_QUERIES.stats(),
    queryFn: () => roleService.getRoleStats(),
    staleTime: 60000, // 1 minute
  });

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: (data: CreateRoleData) => roleService.createRole(data),
    onSuccess: () => {
      // Sync all related data when role is created
      syncRoleChanges();
      toast.success('Tạo vai trò thành công');
      setIsFormOpen(false);
      setEditingRole(null);
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo vai trò: ${error.message}`);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleData }) => 
      roleService.updateRole(id, data),
    onSuccess: () => {
      // Sync all related data when role is updated
      syncRoleChanges();
      toast.success('Cập nhật vai trò thành công');
      setIsFormOpen(false);
      setEditingRole(null);
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật vai trò: ${error.message}`);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => {
      // Sync all related data when role is deleted
      syncRoleChanges();
      toast.success('Xóa vai trò thành công');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa vai trò: ${error.message}`);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => roleService.toggleRoleStatus(id),
    onSuccess: () => {
      // Sync all related data when role status is toggled
      syncRoleChanges();
      toast.success('Cập nhật trạng thái vai trò thành công');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật trạng thái: ${error.message}`);
    },
  });

  // Event handlers
  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CreateRoleData | UpdateRoleData) => {
    if (editingRole) {
      updateRoleMutation.mutate({ 
        id: editingRole.id, 
        data: data as UpdateRoleData 
      });
    } else {
      createRoleMutation.mutate(data as CreateRoleData);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRole(null);
  };

  const handleDelete = (role: Role) => {
    deleteRoleMutation.mutate(role.id);
  };

  const handleToggleStatus = (role: Role) => {
    toggleStatusMutation.mutate(role.id);
  };

  // Filtered roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user count for a role
  const getUserCount = (roleName: string) => {
    const stat = roleStats.find(s => s.name === roleName);
    return stat ? stat.user_count : 0;
  };

  // Get permissions count
  const getPermissionsCount = (permissions: Record<string, string[]>) => {
    return Object.keys(permissions).length;
  };



  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600">Có lỗi xảy ra khi tải danh sách vai trò</p>
        <Button onClick={() => refetch()} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Vai trò
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các vai trò và quyền hạn trong hệ thống
          </p>
        </div>
        
        <Button 
          onClick={handleCreate}
          disabled={createRoleMutation.isPending}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm vai trò
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <Card className="p-4 min-w-[120px]">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-6 w-8 mx-auto" /> : filteredRoles.length}
              </div>
              <div className="text-sm text-gray-600">Vai trò</div>
            </div>
          </Card>
          
          <Card className="p-4 min-w-[120px]">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isStatsLoading ? (
                  <Skeleton className="h-6 w-8 mx-auto" />
                ) : (
                  roleStats.reduce((sum, stat) => sum + stat.user_count, 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Người dùng</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))
        ) : (
          filteredRoles.map((role) => (
            <Card key={role.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    {getRoleLabel(role.name)}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {isSystemRole(role.name) && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Bảo vệ
                      </Badge>
                    )}
                    <Badge 
                      variant={role.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {role.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {role.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{getUserCount(role.name)} người dùng</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Settings className="w-4 h-4" />
                    <span>{getPermissionsCount(role.permissions)} quyền</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  Tạo: {format(new Date(role.created_at), 'dd/MM/yyyy', { locale: vi })}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(role)}
                    disabled={toggleStatusMutation.isPending || (isSystemRole(role.name) && role.is_active)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {role.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(role)}
                      disabled={updateRoleMutation.isPending}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSystemRole(role.name) || deleteRoleMutation.isPending}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa vai trò "{getRoleLabel(role.name)}"? 
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(role)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'Không tìm thấy vai trò' : 'Chưa có vai trò nào'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm 
              ? 'Thử thay đổi từ khóa tìm kiếm'
              : 'Tạo vai trò đầu tiên để bắt đầu quản lý quyền hạn'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm vai trò đầu tiên
            </Button>
          )}
        </div>
      )}

      {/* Role Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
            </DialogTitle>
          </DialogHeader>
          <RoleForm
            role={editingRole}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleCards; 