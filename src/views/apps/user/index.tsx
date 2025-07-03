import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Eye, FilePenLine, Trash2, ChevronUp, ChevronDown, Power, PowerOff, Bug } from 'lucide-react';

// Types
import { User, UserFilters, UserSortBy, SortDirection } from '@/types/users';

// Services
import userService from '@/services/userService';
import { authService } from '@/services/authService';

// Debug utilities
import { debugUserDeletion, canDeleteUser, refreshAuthIfNeeded } from '@/utils/debug-user-deletion';
import { testUserAPI } from '@/utils/api-test';

// Components
import AdminTableLayout from '@/components/admin/AdminTableLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Local Components
import AddUserDrawer from './AddUserDrawer';

// Data synchronization
import { useDataSync, QUERY_KEYS } from '@/hooks/useDataSync';

// Role service and utilities
import roleService from '@/services/roleService';
import { getRoleLabel, getRoleVariant, getRoleOptions } from '@/utils/roleUtils';

const UserManagementPage: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'created_at',
    sortDirection: 'DESC',
    page: 1,
    limit: 10,
  });
  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  
  // Data synchronization hook
  const { syncUserChanges, QUERY_KEYS: SYNC_QUERY_KEYS } = useDataSync();

  // Fetch available roles for filters
  const { data: availableRoles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
    select: (roles) => roles.filter(role => role.is_active),
  });



  // Query for users list
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: SYNC_QUERY_KEYS.users.list(filters),
    queryFn: () => userService.getUsers(filters),
    placeholderData: (previousData) => previousData,
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      // Verify auth before deletion
      const authValid = await refreshAuthIfNeeded();
      if (!authValid) {
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      
      return userService.deleteUser(userId);
    },
    onSuccess: () => {
      toast.success('Đã xóa người dùng thành công');
      // Sync all related data (users, role stats, etc.)
      syncUserChanges();
      setDeleteUserId(null);
    },
    onError: (error: any) => {
      console.error('Delete user error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Có lỗi xảy ra khi xóa người dùng';
      
      if (error.message.includes('Authentication required')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
      } else if (error.message.includes('Insufficient permissions')) {
        errorMessage = 'Bạn không có quyền xóa người dùng này';
      } else if (error.message.includes('Cannot delete super admin')) {
        errorMessage = 'Không thể xóa tài khoản super admin';
      } else if (error.message.includes('Only admin users can delete')) {
        errorMessage = 'Chỉ admin mới có quyền xóa người dùng khác';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setDeleteUserId(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: number) => userService.toggleUserStatus(userId),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái người dùng');
      // Sync all related data (users, role stats, etc.)
      syncUserChanges();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });

  // Computed values
  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  // Handlers
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters(prev => ({ ...prev, role: role as any, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as any, page: 1 }));
  };

  const handleSort = (field: UserSortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSelectUser = (userId: number, selected: boolean) => {
    setSelectedUsers(prev =>
      selected
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? users.map(user => user.id) : []);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    // Check permissions before showing delete dialog
    const { canDelete, reason } = canDeleteUser(user);
    
    if (!canDelete) {
      toast.error(reason || 'Không thể xóa người dùng này');
      return;
    }
    
    setDeleteUserId(user.id);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId);
    }
  };

  // Debug function for troubleshooting
  const handleDebugUserDeletion = () => {
    console.log('🔧 Starting debug session...');
    debugUserDeletion();
    testUserAPI();
  };

  const handleToggleStatus = (userId: number) => {
    toggleStatusMutation.mutate(userId);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditingUser(null);
  };

  const handleUserSubmit = () => {
    // Sync all related data when user is created/updated
    syncUserChanges();
    setIsDrawerOpen(false);
    setEditingUser(null);
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={getRoleVariant(role)}>
        {getRoleLabel(role)}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Hoạt động' : 'Tạm khóa'}
      </Badge>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Hiển thị {((currentPage - 1) * pagination.limit) + 1} đến {Math.min(currentPage * pagination.limit, pagination.total)} của {pagination.total} kết quả
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {(error as any)?.message || 'Không thể tải danh sách người dùng'}
          </p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý Thành viên</h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản người dùng hệ thống
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDebugUserDeletion}
            className="flex items-center gap-2"
          >
            <Bug className="h-4 w-4" />
            Debug
          </Button>
        </div>

        <AdminTableLayout
          searchValue={filters.search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Tìm kiếm theo tên, email..."
          filters={[
            {
              label: 'Vai trò',
              value: filters.role || 'all',
              onValueChange: handleRoleFilter,
              options: [
                { label: 'Tất cả', value: 'all' },
                ...getRoleOptions(availableRoles)
              ]
            },
            {
              label: 'Trạng thái',
              value: filters.status || 'all',
              onValueChange: handleStatusFilter,
              options: [
                { label: 'Tất cả', value: 'all' },
                { label: 'Hoạt động', value: 'active' },
                { label: 'Tạm khóa', value: 'inactive' },
              ]
            },
          ]}
          primaryAction={{
            label: 'Thêm thành viên',
            onClick: handleAddUser,
            icon: Plus,
          }}
          onRefresh={refetch}
          isLoading={isLoading}
          totalItems={pagination?.total}
          selectedItems={selectedUsers.length}
        >
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      ID
                      {filters.sortBy === 'id' && (
                        filters.sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-1">
                      Tên đăng nhập
                      {filters.sortBy === 'username' && (
                        filters.sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {filters.sortBy === 'email' && (
                        filters.sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-1">
                      Vai trò
                      {filters.sortBy === 'role' && (
                        filters.sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Ngày tạo
                      {filters.sortBy === 'created_at' && (
                        filters.sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.full_name || '-'}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.is_active)}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                              >
                                <FilePenLine className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Chỉnh sửa</TooltipContent>
                          </Tooltip>
                          
                          {/* Show toggle button based on permissions */}
                          {(authService.isAdmin() && user.username !== 'admin') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleStatus(user.id)}
                                  disabled={toggleStatusMutation.isPending}
                                >
                                  {user.is_active ? (
                                    <PowerOff className="h-4 w-4" />
                                  ) : (
                                    <Power className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {/* Show delete button based on permissions */}
                          {(authService.isAdmin() && user.username !== 'admin') && (
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Xóa</TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa người dùng "{user.username}"? 
                                    Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {renderPagination()}
        </AdminTableLayout>

        {/* Add/Edit User Drawer */}
        <AddUserDrawer
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          user={editingUser}
          onSubmit={handleUserSubmit}
        />
      </div>
    </TooltipProvider>
  );
};

export default UserManagementPage;
