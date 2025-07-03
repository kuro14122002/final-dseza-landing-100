import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Loader2, Hash, Globe, FileText, Eye, EyeOff } from 'lucide-react';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Custom hooks & utils
import { cn } from '@/lib/utils';

// Types
import { Category, CategoryFormData, CategoryType, CATEGORY_TYPES } from '@/types/categories';
import { generateSlug } from '@/services/categoryService';

// Category type labels for Vietnamese
const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  document_field: 'Lĩnh vực văn bản',
  issuing_agency: 'Cơ quan ban hành',
  issuing_level: 'Cấp ban hành',
  news_category: 'Danh mục tin tức',
  slideshow_location: 'Vị trí slideshow'
};

// Validation schema
const categoryFormSchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên danh mục là bắt buộc' })
    .max(100, { message: 'Tên danh mục không được quá 100 ký tự' }),
  nameEn: z.string()
    .max(100, { message: 'Tên tiếng Anh không được quá 100 ký tự' })
    .optional(),
  slug: z.string()
    .min(1, { message: 'Slug là bắt buộc' })
    .max(100, { message: 'Slug không được quá 100 ký tự' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang' }),
  description: z.string()
    .max(500, { message: 'Mô tả không được quá 500 ký tự' })
    .optional(),
  type: z.enum(CATEGORY_TYPES as [CategoryType, ...CategoryType[]], {
    required_error: 'Loại danh mục là bắt buộc',
  }),
  order: z.number()
    .min(1, { message: 'Thứ tự phải lớn hơn 0' })
    .max(9999, { message: 'Thứ tự không được quá 9999' }),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  categoryType?: CategoryType;
  isLoading: boolean;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  categoryType,
  isLoading,
  onSubmit,
  onCancel
}) => {
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [slugPreview, setSlugPreview] = useState('');

  const isEditMode = Boolean(category);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      nameEn: category?.nameEn || '',
      slug: category?.slug || '',
      description: category?.description || '',
      type: category?.type || categoryType || 'document_field',
      order: category?.order || 1,
      isActive: category?.isActive ?? true,
    },
  });

  // Watch name changes to auto-generate slug
  const watchedName = form.watch('name');
  const watchedSlug = form.watch('slug');

  useEffect(() => {
    if (autoGenerateSlug && watchedName && !isEditMode) {
      const generatedSlug = generateSlug(watchedName);
      form.setValue('slug', generatedSlug);
      setSlugPreview(generatedSlug);
    }
  }, [watchedName, autoGenerateSlug, form, isEditMode]);

  useEffect(() => {
    setSlugPreview(watchedSlug);
  }, [watchedSlug]);

  // Handle form submission
  const handleSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
  };

  // Handle slug input focus (disable auto-generation)
  const handleSlugInputFocus = () => {
    setAutoGenerateSlug(false);
  };

  // Reset auto-generation when slug is empty
  const handleSlugInputChange = (value: string) => {
    form.setValue('slug', value);
    if (!value.trim()) {
      setAutoGenerateSlug(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
            
            {/* Category Type */}
            <div className="space-y-2">
              <Label>
                Loại danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value: CategoryType) => form.setValue('type', value)}
                disabled={isEditMode || Boolean(categoryType) || isLoading}
              >
                <SelectTrigger className={cn(
                  form.formState.errors.type && "border-red-500"
                )}>
                  <SelectValue placeholder="Chọn loại danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CATEGORY_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Nhập tên danh mục..."
                disabled={isLoading}
                className={cn(
                  form.formState.errors.name && "border-red-500"
                )}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Name English */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">
                Tên tiếng Anh
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="nameEn"
                  {...form.register('nameEn')}
                  placeholder="Nhập tên tiếng Anh..."
                  disabled={isLoading}
                  className={cn(
                    "pl-10",
                    form.formState.errors.nameEn && "border-red-500"
                  )}
                />
              </div>
              {form.formState.errors.nameEn && (
                <p className="text-sm text-red-500">{form.formState.errors.nameEn.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="slug"
                  value={form.watch('slug')}
                  onChange={(e) => handleSlugInputChange(e.target.value)}
                  onFocus={handleSlugInputFocus}
                  placeholder="slug-tu-dong-sinh"
                  disabled={isLoading}
                  className={cn(
                    "pl-10",
                    form.formState.errors.slug && "border-red-500"
                  )}
                />
              </div>
              {slugPreview && (
                <div className="text-xs text-gray-500">
                  Preview: <code className="bg-gray-100 px-1 rounded">{slugPreview}</code>
                </div>
              )}
              {autoGenerateSlug && (
                <p className="text-xs text-blue-600">
                  Slug sẽ được tự động tạo từ tên danh mục
                </p>
              )}
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông tin bổ sung</h3>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Nhập mô tả cho danh mục..."
                rows={3}
                disabled={isLoading}
                className={cn(
                  form.formState.errors.description && "border-red-500"
                )}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Order and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Thứ tự hiển thị</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  max="9999"
                  {...form.register('order', { valueAsNumber: true })}
                  placeholder="1"
                  disabled={isLoading}
                  className={cn(
                    form.formState.errors.order && "border-red-500"
                  )}
                />
                {form.formState.errors.order && (
                  <p className="text-sm text-red-500">{form.formState.errors.order.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-2">
                    {form.watch('isActive') ? (
                      <>
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Kích hoạt</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Vô hiệu hóa</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm; 