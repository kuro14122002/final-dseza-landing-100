import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Crown,
  Key,
  Settings,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  groups: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

interface UserGroup {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  members: number;
  color: string;
  createdAt: string;
}

const AdminUserManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState<User[]>([]);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    role: 'editor',
    groups: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'suspended',
    permissions: [] as string[]
  });

  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    color: '#3B82F6'
  });

  // Mock data
  useEffect(() => {
    fetchUsers();
    fetchUserGroups();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'admin@dseza.da-nang.gov.vn',
          name: 'Super Admin',
          role: 'admin',
          groups: ['Super Admin'],
          status: 'active',
          lastLogin: '2024-01-15 10:30:00',
          createdAt: '2024-01-01 09:00:00',
          permissions: ['all']
        },
        {
          id: 2,
          email: 'editor@dseza.da-nang.gov.vn',
          name: 'Biên tập viên',
          role: 'editor',
          groups: ['Ban Biên Tập'],
          status: 'active',
          lastLogin: '2024-01-15 14:20:00',
          createdAt: '2024-01-05 10:00:00',
          permissions: ['news.create', 'news.edit', 'news.delete']
        },
        {
          id: 3,
          email: 'reporter@dseza.da-nang.gov.vn',
          name: 'Phóng viên',
          role: 'reporter',
          groups: ['Phóng viên'],
          status: 'active',
          lastLogin: '2024-01-14 16:45:00',
          createdAt: '2024-01-10 11:30:00',
          permissions: ['news.create', 'news.edit']
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const mockGroups: UserGroup[] = [
        {
          id: 1,
          name: 'Super Admin',
          description: 'Quản trị viên cấp cao có toàn quyền hệ thống',
          permissions: ['all'],
          members: 1,
          color: '#DC2626',
          createdAt: '2024-01-01 09:00:00'
        },
        {
          id: 2,
          name: 'Ban Biên Tập',
          description: 'Nhóm biên tập viên quản lý nội dung',
          permissions: ['news.manage', 'events.manage', 'documents.manage'],
          members: 5,
          color: '#2563EB',
          createdAt: '2024-01-01 09:00:00'
        },
        {
          id: 3,
          name: 'Phóng viên',
          description: 'Nhóm phóng viên tạo và chỉnh sửa nội dung',
          permissions: ['news.create', 'news.edit'],
          members: 12,
          color: '#059669',
          createdAt: '2024-01-01 09:00:00'
        }
      ];
      
      setUserGroups(mockGroups);
    } catch (error) {
      toast.error('Không thể tải danh sách nhóm người dùng');
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserForm({
      email: '',
      name: '',
      role: 'editor',
      groups: [],
      status: 'active',
      permissions: []
    });
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      email: user.email,
      name: user.name,
      role: user.role,
      groups: user.groups,
      status: user.status,
      permissions: user.permissions
    });
    setIsUserDialogOpen(true);
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setGroupForm({
      name: '',
      description: '',
      permissions: [],
      color: '#3B82F6'
    });
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setGroupForm({
      name: group.name,
      description: group.description,
      permissions: group.permissions,
      color: group.color
    });
    setIsGroupDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedUser) {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...userForm }
            : user
        ));
        toast.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now(),
          ...userForm,
          lastLogin: undefined,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('Tạo người dùng thành công');
      }
      
      setIsUserDialogOpen(false);
    } catch (error) {
      toast.error('Không thể lưu người dùng');
    }
  };

  const handleSaveGroup = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedGroup) {
        // Update existing group
        setUserGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, ...groupForm }
            : group
        ));
        toast.success('Cập nhật nhóm thành công');
      } else {
        // Create new group
        const newGroup: UserGroup = {
          id: Date.now(),
          ...groupForm,
          members: 0,
          createdAt: new Date().toISOString()
        };
        setUserGroups(prev => [...prev, newGroup]);
        toast.success('Tạo nhóm thành công');
      }
      
      setIsGroupDialogOpen(false);
    } catch (error) {
      toast.error('Không thể lưu nhóm');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Xóa người dùng thành công');
    } catch (error) {
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleToggleUserStatus = async (userId: number, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'reporter':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className={cn(
        "rounded-lg p-6 border",
        theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
      )}>
        <h1 className={cn(
          "text-2xl font-montserrat font-bold",
          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
        )}>
          Quản lý Người dùng & Nhóm
        </h1>
        <p className={cn(
          "text-sm font-inter mt-2",
          theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
        )}>
          Quản lý tài khoản người dùng và phân nhóm quyền hạn
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Quản lý Thành viên</TabsTrigger>
          <TabsTrigger value="groups">Quản lý Nhóm</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Users Management */}
      <Card className={cn(
        theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
      )}>
        <CardHeader>
              <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
                  Danh sách Thành viên
                </CardTitle>
                <Button onClick={handleCreateUser}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Thành viên
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reporter">Reporter</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thành viên</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Nhóm</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Đăng nhập cuối</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Đang tải...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Không tìm thấy thành viên nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                              {user.role === 'editor' && <Edit2 className="w-3 h-3 mr-1" />}
                              {user.role === 'reporter' && <Users className="w-3 h-3 mr-1" />}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.groups.map((group) => (
                                <Badge key={group} variant="secondary" className="text-xs">
                                  {group}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === 'active' && <UserCheck className="w-3 h-3 mr-1" />}
                              {user.status === 'inactive' && <UserX className="w-3 h-3 mr-1" />}
                              {user.status === 'suspended' && <Lock className="w-3 h-3 mr-1" />}
                              {user.status === 'active' ? 'Hoạt động' : 
                               user.status === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? (
                              <div className="text-sm">
                                <div>{new Date(user.lastLogin).toLocaleDateString('vi-VN')}</div>
                                <div className="text-gray-500">{new Date(user.lastLogin).toLocaleTimeString('vi-VN')}</div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Chưa đăng nhập</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleUserStatus(
                                  user.id, 
                                  user.status === 'active' ? 'suspended' : 'active'
                                )}
                              >
                                {user.status === 'active' ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Xóa thành viên</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn xóa thành viên "{user.name}"? Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                      Xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          {/* Groups Management */}
          <Card className={cn(
            theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Nhóm Người dùng
          </CardTitle>
                <Button onClick={handleCreateGroup}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Nhóm
                </Button>
              </div>
        </CardHeader>
        <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userGroups.map((group) => (
                  <Card key={group.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: group.color + '20' }}
                          >
                            <Shield className="w-5 h-5" style={{ color: group.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.members} thành viên</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {group.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Quyền hạn:</div>
                        <div className="flex flex-wrap gap-1">
                          {group.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {group.permissions.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{group.permissions.length - 3} khác
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Chỉnh sửa Thành viên' : 'Thêm Thành viên Mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Cập nhật thông tin thành viên' : 'Tạo tài khoản thành viên mới'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên đầy đủ</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reporter">Reporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={userForm.status} onValueChange={(value: any) => setUserForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveUser}>
              {selectedUser ? 'Cập nhật' : 'Tạo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Chỉnh sửa Nhóm' : 'Tạo Nhóm Mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup ? 'Cập nhật thông tin nhóm' : 'Tạo nhóm người dùng mới'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Tên nhóm</Label>
              <Input
                id="groupName"
                value={groupForm.name}
                onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tên nhóm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Mô tả</Label>
              <Input
                id="groupDescription"
                value={groupForm.description}
                onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả nhóm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupColor">Màu sắc</Label>
              <Input
                id="groupColor"
                type="color"
                value={groupForm.color}
                onChange={(e) => setGroupForm(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveGroup}>
              {selectedGroup ? 'Cập nhật' : 'Tạo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagementPage; 