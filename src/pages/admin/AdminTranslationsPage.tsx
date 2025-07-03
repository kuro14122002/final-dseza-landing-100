import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/utils/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCcw,
  Filter,
  Globe,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { Translation, TranslationFormData } from '@/types/translations';
import { 
  getTranslations, 
  createTranslation, 
  updateTranslation, 
  deleteTranslation,
  exportTranslations,
  importTranslations,
  syncTranslations
} from '@/services/translationService';

const TRANSLATION_CATEGORIES = [
  { id: 'common', name: 'Common' },
  { id: 'navigation', name: 'Navigation' },
  { id: 'homepage', name: 'Homepage' },
  { id: 'news', name: 'News' },
  { id: 'admin', name: 'Admin' },
  { id: 'forms', name: 'Forms' },
  { id: 'errors', name: 'Errors' },
  { id: 'validation', name: 'Validation' },
  { id: 'other', name: 'Other' }
];

const AdminTranslationsPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  // State management
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Dialog states
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<TranslationFormData>({
    key: '',
    vietnamese: '',
    english: '',
    category: '',
    description: '',
    is_active: true
  });

  // Load translations
  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await getTranslations(currentPage, 20, selectedCategory, searchTerm);
      setTranslations(data.translations);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast.error('Không thể tải danh sách bản dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTranslations();
  }, [currentPage, selectedCategory, searchTerm]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedTranslation) {
        await updateTranslation(selectedTranslation.id, { ...formData, id: selectedTranslation.id });
        toast.success('Cập nhật bản dịch thành công');
      } else {
        await createTranslation(formData);
        toast.success('Tạo bản dịch thành công');
      }
      
      setEditDialog(false);
      resetForm();
      loadTranslations();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      key: '',
      vietnamese: '',
      english: '',
      category: '',
      description: '',
      is_active: true
    });
    setSelectedTranslation(null);
  };

  // Handle edit
  const handleEdit = (translation: Translation) => {
    setSelectedTranslation(translation);
    setFormData({
      key: translation.key,
      vietnamese: translation.vietnamese,
      english: translation.english,
      category: translation.category,
      description: translation.description || '',
      is_active: translation.is_active
    });
    setEditDialog(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedTranslation) return;
    
    try {
      await deleteTranslation(selectedTranslation.id);
      toast.success('Xóa bản dịch thành công');
      setDeleteDialog(false);
      setSelectedTranslation(null);
      loadTranslations();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await exportTranslations(selectedCategory);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${selectedCategory || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Xuất file thành công');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi xuất file');
    }
  };

  // Handle sync
  const handleSync = async () => {
    try {
      setLoading(true);
      const result = await syncTranslations();
      toast.success(`Đồng bộ thành công: ${result.updated} cập nhật, ${result.added} thêm mới`);
      loadTranslations();
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đồng bộ');
    }
  };

  return (
    <div className={cn(
      "p-6 space-y-6",
      theme === 'dark' ? 'bg-dseza-dark-main-bg' : 'bg-dseza-light-main-bg'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-2xl font-montserrat font-bold mb-2",
            theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
          )}>
            <Languages className="inline-block w-6 h-6 mr-2" />
            Quản lý Bản dịch
          </h1>
          <p className={cn(
            "font-inter",
            theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
          )}>
            Quản lý và chỉnh sửa các bản dịch đa ngôn ngữ cho website
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSync}
            variant="outline"
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Đồng bộ
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
          <Button
            onClick={() => setImportDialog(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nhập file
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm bản dịch
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn(
        "p-4 rounded-lg border space-y-4",
        theme === 'dark' 
          ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' 
          : 'bg-white border-dseza-light-border'
      )}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo key hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {TRANSLATION_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={cn(
            theme === 'dark' ? 'text-dseza-dark-secondary-text' : 'text-dseza-light-secondary-text'
          )}>
            Tổng cộng {totalCount} bản dịch
          </span>
        </div>
      </div>

      {/* Table */}
      <div className={cn(
        "rounded-lg border",
        theme === 'dark' 
          ? 'bg-dseza-dark-secondary-bg border-dseza-dark-border' 
          : 'bg-white border-dseza-light-border'
      )}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Tiếng Việt</TableHead>
              <TableHead>English</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : translations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Không tìm thấy bản dịch nào
                </TableCell>
              </TableRow>
            ) : (
              translations.map((translation) => (
                <TableRow key={translation.id}>
                  <TableCell className="font-mono text-xs">
                    {translation.key}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {translation.vietnamese}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {translation.english}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {TRANSLATION_CATEGORIES.find(c => c.id === translation.category)?.name || translation.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={translation.is_active ? "default" : "secondary"}>
                      {translation.is_active ? 'Hoạt động' : 'Vô hiệu'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(translation)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTranslation(translation);
                          setDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTranslation ? 'Chỉnh sửa bản dịch' : 'Thêm bản dịch mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedTranslation ? 'Cập nhật thông tin bản dịch' : 'Tạo bản dịch mới cho hệ thống'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Translation Key *</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="e.g., nav.home"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Select value={formData.category || undefined} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSLATION_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vietnamese">Tiếng Việt *</Label>
              <Textarea
                id="vietnamese"
                value={formData.vietnamese}
                onChange={(e) => setFormData(prev => ({ ...prev, vietnamese: e.target.value }))}
                placeholder="Nội dung tiếng Việt"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="english">English *</Label>
              <Textarea
                id="english"
                value={formData.english}
                onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
                placeholder="English content"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn gọn về bản dịch này"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
              />
              <Label htmlFor="is_active">Kích hoạt</Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {selectedTranslation ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bản dịch "{selectedTranslation?.key}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTranslationsPage; 