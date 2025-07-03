import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  FilePenLine, 
  Trash2,
  Settings,
  ChevronUp,
  ChevronDown,
  Hash,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AdminTableLayout from '@/components/admin/AdminTableLayout';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Custom hooks & utils
import { cn } from '@/lib/utils';

// Types
import { 
  Category, 
  CategoryFormData, 
  CategoryType, 
  CATEGORY_TYPES 
} from '@/types/categories';

// Services
import { 
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '@/services/categoryService';

// Components
import CategoryForm from '@/components/admin/CategoryForm';

// Category type labels
const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  document_field: 'Lĩnh vực văn bản',
  issuing_agency: 'Cơ quan ban hành',
  issuing_level: 'Cấp ban hành',
  news_category: 'Danh mục tin tức',
  slideshow_location: 'Vị trí slideshow'
};

const AdminCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get category type from URL params
  const categoryType = (searchParams.get('type') as CategoryType) || 'document_field';
  
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'order' | 'created_at'>('order');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load categories
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCategories({
        type: categoryType,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
        searchTerm: searchTerm || undefined,
        sortBy,
        sortDirection,
        limit: 50 // Load more items for category management
      });
      
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadCategories();
  }, [categoryType, statusFilter, sortBy, sortDirection]);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadCategories();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Event handlers
  const handleCategoryTypeChange = (newType: CategoryType) => {
    setSearchParams({ type: newType });
  };

  const handleSort = (field: 'name' | 'order' | 'created_at') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortDirection('ASC');
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    try {
      setIsFormLoading(true);
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await createCategory(data);
        toast.success('Tạo danh mục thành công');
      }
      
      setIsFormOpen(false);
      setEditingCategory(null);
      await loadCategories();
      
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      toast.success('Xóa danh mục thành công');
      await loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Không thể xóa danh mục');
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await toggleCategoryStatus(category.id);
      toast.success(`${category.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} danh mục thành công`);
      await loadCategories();
    } catch (error: any) {
      console.error('Error toggling category status:', error);
      toast.error(error.message || 'Không thể thay đổi trạng thái danh mục');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDirection === 'ASC' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Danh mục
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý các danh mục hệ thống: {CATEGORY_TYPE_LABELS[categoryType]}
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Type */}
            <div className="space-y-2">
              <Label htmlFor="category-type">Loại danh mục</Label>
              <Select
                value={categoryType}
                onValueChange={handleCategoryTypeChange}
              >
                <SelectTrigger id="category-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CATEGORY_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select
                value={statusFilter}
                onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Kích hoạt</SelectItem>
                  <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search-categories">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search-categories"
                  name="searchCategories"
                  placeholder="Tìm theo tên danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label htmlFor="sort-categories">Sắp xếp theo</Label>
              <Select
                value={`${sortBy}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-');
                  setSortBy(field as 'name' | 'order' | 'created_at');
                  setSortDirection(direction as 'ASC' | 'DESC');
                }}
              >
                <SelectTrigger id="sort-categories">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order-ASC">Thứ tự (Tăng dần)</SelectItem>
                  <SelectItem value="order-DESC">Thứ tự (Giảm dần)</SelectItem>
                  <SelectItem value="name-ASC">Tên (A-Z)</SelectItem>
                  <SelectItem value="name-DESC">Tên (Z-A)</SelectItem>
                  <SelectItem value="created_at-DESC">Mới nhất</SelectItem>
                  <SelectItem value="created_at-ASC">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách danh mục ({categories.length} mục)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('order')}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Thứ tự
                      {getSortIcon('order')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Tên danh mục
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày tạo
                      {getSortIcon('created_at')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-center">
                      {category.order}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{category.name}</div>
                        {category.nameEn && (
                          <div className="text-sm text-gray-500">{category.nameEn}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {category.description ? (
                        <div className="max-w-xs truncate" title={category.description}>
                          {category.description}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleStatus(category)}
                          size="sm"
                        />
                        <Badge variant={category.isActive ? 'default' : 'secondary'}>
                          {category.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(category.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <FilePenLine className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa danh mục "{category.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(category)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory || undefined}
            categoryType={categoryType}
            isLoading={isFormLoading}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoriesPage; 