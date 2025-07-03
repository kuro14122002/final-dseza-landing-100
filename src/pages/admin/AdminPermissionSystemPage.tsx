import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Shield,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Users,
  Key,
  Settings,
  Eye,
  FileText,
  Database,
  Upload,
  Download,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  description: string;
  category: 'content' | 'system' | 'user' | 'media' | 'report';
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'publish' | 'manage';
  created_at: string;
}

interface PermissionGroup {
  id: number;
  name: string;
  description: string;
  permissions: number[];
  users_count: number;
  created_at: string;
  is_system: boolean;
}

interface RoleAssignment {
  user_id: number;
  username: string;
  email: string;
  role: string;
  permissions: Permission[];
  groups: PermissionGroup[];
  last_updated: string;
}

const AdminPermissionSystemPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null);

  // Form states
  const [permissionForm, setPermissionForm] = useState({
    name: '',
    description: '',
    category: 'content' as 'content' | 'system' | 'user' | 'media' | 'report',
    resource: '',
    action: 'read' as 'create' | 'read' | 'update' | 'delete' | 'publish' | 'manage'
  });

  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    permissions: [] as number[]
  });

  useEffect(() => {
    fetchPermissions();
    fetchPermissionGroups();
    fetchRoleAssignments();
  }, []);

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      // Mock permissions data
      const mockPermissions: Permission[] = [
        {
          id: 1,
          name: 'Tạo tin tức',
          description: 'Quyền tạo bài viết tin tức mới',
          category: 'content',
          resource: 'news',
          action: 'create',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Chỉnh sửa tin tức',
          description: 'Quyền chỉnh sửa bài viết tin tức',
          category: 'content',
          resource: 'news',
          action: 'update',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Xóa tin tức',
          description: 'Quyền xóa bài viết tin tức',
          category: 'content',
          resource: 'news',
          action: 'delete',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Quản lý người dùng',
          description: 'Quyền quản lý tài khoản người dùng',
          category: 'user',
          resource: 'users',
          action: 'manage',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          name: 'Cấu hình hệ thống',
          description: 'Quyền thay đổi cấu hình hệ thống',
          category: 'system',
          resource: 'settings',
          action: 'manage',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          name: 'Upload media',
          description: 'Quyền tải lên tệp media',
          category: 'media',
          resource: 'media',
          action: 'create',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 7,
          name: 'Xem báo cáo',
          description: 'Quyền xem các báo cáo hệ thống',
          category: 'report',
          resource: 'reports',
          action: 'read',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];
      setPermissions(mockPermissions);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách quyền');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissionGroups = async () => {
    try {
      const mockGroups: PermissionGroup[] = [
        {
          id: 1,
          name: 'Toàn quyền',
          description: 'Nhóm quyền cao nhất - có mọi quyền hạn',
          permissions: [1, 2, 3, 4, 5, 6, 7],
          users_count: 2,
          created_at: '2024-01-01T00:00:00Z',
          is_system: true
        },
        {
          id: 2,
          name: 'Biên tập viên',
          description: 'Quyền quản lý nội dung và media',
          permissions: [1, 2, 6],
          users_count: 5,
          created_at: '2024-01-01T00:00:00Z',
          is_system: false
        },
        {
          id: 3,
          name: 'Người xem',
          description: 'Chỉ có quyền xem báo cáo',
          permissions: [7],
          users_count: 10,
          created_at: '2024-01-01T00:00:00Z',
          is_system: false
        }
      ];
      setPermissionGroups(mockGroups);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách nhóm quyền');
    }
  };

  const fetchRoleAssignments = async () => {
    try {
      const mockAssignments: RoleAssignment[] = [
        {
          user_id: 1,
          username: 'admin',
          email: 'admin@dseza.gov.vn',
          role: 'admin',
          permissions: permissions.filter(p => [1, 2, 3, 4, 5, 6, 7].includes(p.id)),
          groups: permissionGroups.filter(g => g.id === 1),
          last_updated: '2024-12-17T10:30:00Z'
        },
        {
          user_id: 2,
          username: 'editor1',
          email: 'editor@dseza.gov.vn',
          role: 'editor',
          permissions: permissions.filter(p => [1, 2, 6].includes(p.id)),
          groups: permissionGroups.filter(g => g.id === 2),
          last_updated: '2024-12-16T14:20:00Z'
        }
      ];
      setRoleAssignments(mockAssignments);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách phân quyền');
    }
  };

  const handleCreatePermission = async () => {
    try {
      if (!permissionForm.name || !permissionForm.description) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const newPermission: Permission = {
        id: permissions.length + 1,
        name: permissionForm.name,
        description: permissionForm.description,
        category: permissionForm.category,
        resource: permissionForm.resource,
        action: permissionForm.action,
        created_at: new Date().toISOString()
      };

      setPermissions([...permissions, newPermission]);
      toast.success('Tạo quyền mới thành công');
      setIsPermissionDialogOpen(false);
      setPermissionForm({ name: '', description: '', category: 'content', resource: '', action: 'read' });
    } catch (error) {
      toast.error('Lỗi khi tạo quyền');
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupForm.name || !groupForm.description) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const newGroup: PermissionGroup = {
        id: permissionGroups.length + 1,
        name: groupForm.name,
        description: groupForm.description,
        permissions: groupForm.permissions,
        users_count: 0,
        created_at: new Date().toISOString(),
        is_system: false
      };

      setPermissionGroups([...permissionGroups, newGroup]);
      toast.success('Tạo nhóm quyền thành công');
      setIsGroupDialogOpen(false);
      setGroupForm({ name: '', description: '', permissions: [] });
    } catch (error) {
      toast.error('Lỗi khi tạo nhóm quyền');
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    try {
      setPermissions(permissions.filter(p => p.id !== permissionId));
      toast.success('Xóa quyền thành công');
    } catch (error) {
      toast.error('Lỗi khi xóa quyền');
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const group = permissionGroups.find(g => g.id === groupId);
      if (group?.is_system) {
        toast.error('Không thể xóa nhóm quyền hệ thống');
        return;
      }
      setPermissionGroups(permissionGroups.filter(g => g.id !== groupId));
      toast.success('Xóa nhóm quyền thành công');
    } catch (error) {
      toast.error('Lỗi khi xóa nhóm quyền');
    }
  };

  const filteredPermissions = permissions.filter(permission => 
    selectedCategory === 'all' || permission.category === selectedCategory
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'content':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'system':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'media':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'report':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'update':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'publish':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'manage':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'media':
        return <Upload className="w-4 h-4" />;
      case 'report':
        return <Database className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const openPermissionDialog = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission);
      setPermissionForm({
        name: permission.name,
        description: permission.description,
        category: permission.category,
        resource: permission.resource,
        action: permission.action
      });
    } else {
      setSelectedPermission(null);
      setPermissionForm({ name: '', description: '', category: 'content', resource: '', action: 'read' });
    }
    setIsPermissionDialogOpen(true);
  };

  const openGroupDialog = (group?: PermissionGroup) => {
    if (group) {
      setSelectedGroup(group);
      setGroupForm({
        name: group.name,
        description: group.description,
        permissions: group.permissions
      });
    } else {
      setSelectedGroup(null);
      setGroupForm({ name: '', description: '', permissions: [] });
    }
    setIsGroupDialogOpen(true);
  };

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
              Phân quyền Hệ thống
            </h1>
            <p className={cn(
              "text-sm font-inter mt-2",
              theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
            )}>
              Quản lý quyền hạn và nhóm quyền của hệ thống
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => openGroupDialog()} variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Tạo nhóm quyền
            </Button>
            <Button onClick={() => openPermissionDialog()} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm quyền mới
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Quyền hạn
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Nhóm quyền
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Phân quyền
          </TabsTrigger>
        </TabsList>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="content">Nội dung</SelectItem>
                <SelectItem value="system">Hệ thống</SelectItem>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="report">Báo cáo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPermissions.map((permission) => (
              <Card key={permission.id} className={cn(
                "transition-all hover:shadow-md",
                theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(permission.category)}
                      <CardTitle className="text-lg font-montserrat">{permission.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => openPermissionDialog(permission)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePermission(permission.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{permission.description}</CardDescription>
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(permission.category)} variant="secondary">
                      {permission.category === 'content' ? 'Nội dung' :
                       permission.category === 'system' ? 'Hệ thống' :
                       permission.category === 'user' ? 'Người dùng' :
                       permission.category === 'media' ? 'Media' :
                       permission.category === 'report' ? 'Báo cáo' : permission.category}
                    </Badge>
                    <Badge className={getActionColor(permission.action)} variant="secondary">
                      {permission.action === 'create' ? 'Tạo' :
                       permission.action === 'read' ? 'Đọc' :
                       permission.action === 'update' ? 'Sửa' :
                       permission.action === 'delete' ? 'Xóa' :
                       permission.action === 'publish' ? 'Xuất bản' :
                       permission.action === 'manage' ? 'Quản lý' : permission.action}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Resource: {permission.resource}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permission Groups Tab */}
        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {permissionGroups.map((group) => (
              <Card key={group.id} className={cn(
                "transition-all hover:shadow-md",
                theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <CardTitle className="text-lg font-montserrat">{group.name}</CardTitle>
                      {group.is_system && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Lock className="w-3 h-3 mr-1" />
                          Hệ thống
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => openGroupDialog(group)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      {!group.is_system && (
                        <Button
                          onClick={() => handleDeleteGroup(group.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{group.description}</CardDescription>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Số người dùng:</span>
                    <Badge variant="secondary">{group.users_count}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Số quyền:</span>
                    <Badge variant="secondary">{group.permissions.length}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Tạo: {new Date(group.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Role Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid gap-4">
            {roleAssignments.map((assignment) => (
              <Card key={assignment.user_id} className={cn(
                "transition-all hover:shadow-md",
                theme === 'dark' ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' : 'bg-white border-dseza-light-border'
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        theme === 'dark' ? 'bg-dseza-dark-primary' : 'bg-dseza-light-primary'
                      )}>
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={cn(
                          "font-medium font-montserrat",
                          theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
                        )}>
                          {assignment.username}
                        </h3>
                        <p className="text-sm text-gray-500">{assignment.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{assignment.role}</Badge>
                          <span className="text-xs text-gray-500">
                            Cập nhật: {new Date(assignment.last_updated).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Nhóm quyền:</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.groups.map((group) => (
                          <Badge key={group.id} variant="outline">
                            <Shield className="w-3 h-3 mr-1" />
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Quyền trực tiếp:</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.permissions.slice(0, 5).map((permission) => (
                          <Badge key={permission.id} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ))}
                        {assignment.permissions.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{assignment.permissions.length - 5} quyền khác
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Permission Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedPermission ? 'Chỉnh sửa quyền' : 'Thêm quyền mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedPermission ? 'Cập nhật thông tin quyền' : 'Điền thông tin để tạo quyền mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="permissionName">Tên quyền</Label>
              <Input
                id="permissionName"
                value={permissionForm.name}
                onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                placeholder="Nhập tên quyền"
              />
            </div>
            <div>
              <Label htmlFor="permissionDescription">Mô tả</Label>
              <Input
                id="permissionDescription"
                value={permissionForm.description}
                onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                placeholder="Nhập mô tả quyền"
              />
            </div>
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select value={permissionForm.category} onValueChange={(value: any) => 
                setPermissionForm({ ...permissionForm, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Nội dung</SelectItem>
                  <SelectItem value="system">Hệ thống</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="report">Báo cáo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="resource">Resource</Label>
              <Input
                id="resource"
                value={permissionForm.resource}
                onChange={(e) => setPermissionForm({ ...permissionForm, resource: e.target.value })}
                placeholder="Nhập resource (vd: news, users)"
              />
            </div>
            <div>
              <Label htmlFor="action">Hành động</Label>
              <Select value={permissionForm.action} onValueChange={(value: any) => 
                setPermissionForm({ ...permissionForm, action: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Tạo</SelectItem>
                  <SelectItem value="read">Đọc</SelectItem>
                  <SelectItem value="update">Sửa</SelectItem>
                  <SelectItem value="delete">Xóa</SelectItem>
                  <SelectItem value="publish">Xuất bản</SelectItem>
                  <SelectItem value="manage">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreatePermission}>
              {selectedPermission ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup ? 'Cập nhật thông tin nhóm quyền' : 'Điền thông tin để tạo nhóm quyền mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Tên nhóm</Label>
              <Input
                id="groupName"
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                placeholder="Nhập tên nhóm quyền"
              />
            </div>
            <div>
              <Label htmlFor="groupDescription">Mô tả</Label>
              <Input
                id="groupDescription"
                value={groupForm.description}
                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                placeholder="Nhập mô tả nhóm quyền"
              />
            </div>
            <div>
              <Label>Quyền hạn</Label>
              <div className="max-h-40 overflow-y-auto space-y-2 mt-2 border rounded-md p-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      checked={groupForm.permissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGroupForm({
                            ...groupForm,
                            permissions: [...groupForm.permissions, permission.id]
                          });
                        } else {
                          setGroupForm({
                            ...groupForm,
                            permissions: groupForm.permissions.filter(p => p !== permission.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                      {permission.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateGroup}>
              {selectedGroup ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPermissionSystemPage; 