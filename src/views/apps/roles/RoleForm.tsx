import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Shield, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Image, 
  Globe, 
  Database 
} from 'lucide-react';

import { Role, CreateRoleData, UpdateRoleData } from '@/services/roleService';
import roleService from '@/services/roleService';

// Form validation schema
const roleFormSchema = z.object({
  name: z.string()
    .min(3, 'Tên vai trò phải có ít nhất 3 ký tự')
    .max(50, 'Tên vai trò không được vượt quá 50 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Tên vai trò chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới'),
  description: z.string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(500, 'Mô tả không được vượt quá 500 ký tự'),
  permissions: z.record(z.array(z.string())).default({}),
  is_active: z.boolean().default(true),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  role?: Role | null;
  onSubmit: (data: CreateRoleData | UpdateRoleData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Permission categories with icons and labels
const PERMISSION_CATEGORIES = {
  users: {
    label: 'Quản lý Người dùng',
    icon: Users,
    description: 'Quyền quản lý người dùng trong hệ thống',
    permissions: {
      create: 'Tạo người dùng mới',
      read: 'Xem thông tin người dùng',
      update: 'Cập nhật thông tin người dùng',
      delete: 'Xóa người dùng'
    }
  },
  roles: {
    label: 'Quản lý Vai trò',
    icon: Shield,
    description: 'Quyền quản lý vai trò và phân quyền',
    permissions: {
      create: 'Tạo vai trò mới',
      read: 'Xem danh sách vai trò',
      update: 'Cập nhật vai trò',
      delete: 'Xóa vai trò'
    }
  },
  news: {
    label: 'Quản lý Tin tức',
    icon: FileText,
    description: 'Quyền quản lý nội dung tin tức',
    permissions: {
      create: 'Tạo bài viết mới',
      read: 'Xem danh sách bài viết',
      update: 'Chỉnh sửa bài viết',
      delete: 'Xóa bài viết',
      publish: 'Xuất bản/ẩn bài viết'
    }
  },
  events: {
    label: 'Quản lý Sự kiện',
    icon: Calendar,
    description: 'Quyền quản lý sự kiện và hoạt động',
    permissions: {
      create: 'Tạo sự kiện mới',
      read: 'Xem danh sách sự kiện',
      update: 'Chỉnh sửa sự kiện',
      delete: 'Xóa sự kiện',
      publish: 'Xuất bản/ẩn sự kiện'
    }
  },
  categories: {
    label: 'Quản lý Danh mục',
    icon: Settings,
    description: 'Quyền quản lý danh mục phân loại',
    permissions: {
      create: 'Tạo danh mục mới',
      read: 'Xem danh sách danh mục',
      update: 'Cập nhật danh mục',
      delete: 'Xóa danh mục'
    }
  },
  media: {
    label: 'Quản lý Media',
    icon: Image,
    description: 'Quyền quản lý tệp tin và hình ảnh',
    permissions: {
      upload: 'Tải lên tệp tin',
      read: 'Xem thư viện media',
      update: 'Chỉnh sửa thông tin media',
      delete: 'Xóa tệp tin'
    }
  },
  documents: {
    label: 'Quản lý Văn bản',
    icon: FileText,
    description: 'Quyền quản lý văn bản pháp lý',
    permissions: {
      create: 'Tạo văn bản mới',
      read: 'Xem danh sách văn bản',
      update: 'Cập nhật văn bản',
      delete: 'Xóa văn bản'
    }
  },
  translations: {
    label: 'Quản lý Bản dịch',
    icon: Globe,
    description: 'Quyền quản lý đa ngôn ngữ',
    permissions: {
      create: 'Tạo bản dịch mới',
      read: 'Xem danh sách bản dịch',
      update: 'Cập nhật bản dịch',
      delete: 'Xóa bản dịch'
    }
  },
  system: {
    label: 'Quản trị Hệ thống',
    icon: Database,
    description: 'Quyền quản trị hệ thống cấp cao',
    permissions: {
      read: 'Xem thông tin hệ thống',
      update: 'Cập nhật cấu hình',
      backup: 'Sao lưu dữ liệu',
      stats: 'Xem thống kê hệ thống'
    }
  }
};

const RoleForm: React.FC<RoleFormProps> = ({ 
  role, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: {},
      is_active: true,
    },
  });

  // Initialize form with role data when editing
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        is_active: role.is_active,
      });
      setSelectedPermissions(role.permissions);
    } else {
      form.reset({
        name: '',
        description: '',
        permissions: {},
        is_active: true,
      });
      setSelectedPermissions({});
    }
  }, [role, form]);

  const handlePermissionChange = (category: string, permission: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (!newPermissions[category]) {
        newPermissions[category] = [];
      }
      
      if (checked) {
        if (!newPermissions[category].includes(permission)) {
          newPermissions[category] = [...newPermissions[category], permission];
        }
      } else {
        newPermissions[category] = newPermissions[category].filter(p => p !== permission);
        if (newPermissions[category].length === 0) {
          delete newPermissions[category];
        }
      }
      
      form.setValue('permissions', newPermissions);
      return newPermissions;
    });
  };

  const handleCategoryToggle = (category: string, allPermissions: string[]) => {
    const currentPermissions = selectedPermissions[category] || [];
    const hasAll = allPermissions.every(p => currentPermissions.includes(p));
    
    setSelectedPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (hasAll) {
        // Remove all permissions for this category
        delete newPermissions[category];
      } else {
        // Add all permissions for this category
        newPermissions[category] = [...allPermissions];
      }
      
      form.setValue('permissions', newPermissions);
      return newPermissions;
    });
  };

  const onFormSubmit = (data: RoleFormData) => {
    onSubmit({
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      is_active: data.is_active,
    });
  };

  const isPermissionSelected = (category: string, permission: string) => {
    return selectedPermissions[category]?.includes(permission) || false;
  };

  const isCategoryFullySelected = (category: string, allPermissions: string[]) => {
    const currentPermissions = selectedPermissions[category] || [];
    return allPermissions.every(p => currentPermissions.includes(p));
  };

  const getCategorySelectedCount = (category: string) => {
    return selectedPermissions[category]?.length || 0;
  };

  const getTotalPermissionsCount = () => {
    return Object.values(selectedPermissions).reduce((total, perms) => total + perms.length, 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên vai trò *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ví dụ: moderator, content_manager..."
                      disabled={!!role && ['admin', 'editor'].includes(role.name)}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tên vai trò chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả chi tiết về vai trò và trách nhiệm..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                    <FormDescription>
                      Vai trò có được kích hoạt và sử dụng không
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Phân quyền</span>
              <Badge variant="outline">
                {getTotalPermissionsCount()} quyền đã chọn
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
                const allPermissions = Object.keys(category.permissions);
                const selectedCount = getCategorySelectedCount(categoryKey);
                const isFullySelected = isCategoryFullySelected(categoryKey, allPermissions);
                const IconComponent = category.icon;

                return (
                  <AccordionItem key={categoryKey} value={categoryKey}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium">{category.label}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={selectedCount > 0 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {selectedCount}/{allPermissions.length}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryToggle(categoryKey, allPermissions);
                            }}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            {isFullySelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                        {Object.entries(category.permissions).map(([permKey, permLabel]) => (
                          <div key={permKey} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${categoryKey}-${permKey}`}
                              checked={isPermissionSelected(categoryKey, permKey)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(categoryKey, permKey, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`${categoryKey}-${permKey}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permLabel}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : (role ? 'Cập nhật' : 'Tạo vai trò')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm; 