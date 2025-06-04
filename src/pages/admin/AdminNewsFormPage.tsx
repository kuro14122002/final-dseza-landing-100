import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Eye,
  Save,
  X,
  Upload,
  Trash2,
  Loader2,
} from 'lucide-react';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Custom hooks & utils
import { useTranslation } from '@/utils/translations';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

// Types
import { AdminNewsArticle, NewsCategory } from '@/types/news';

// Services - will be created/extended
import { 
  fetchNewsCategories, 
  fetchAdminNewsArticleById,
  createAdminNewsArticle,
  updateAdminNewsArticle 
} from '@/services/newsService';

// Validation schema
const getNewsFormSchema = (t: (key: string, params?: any) => string) => z.object({
  title: z.string()
    .min(1, { message: t('admin.newsForm.validation.title.required') })
    .max(200, { message: t('admin.newsForm.validation.title.maxLength', { count: 200 }) }),
  titleEn: z.string()
    .max(200, { message: t('admin.newsForm.validation.titleEn.maxLength', { count: 200 }) })
    .optional(),
  slug: z.string()
    .min(1, { message: t('admin.newsForm.validation.slug.required') })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: t('admin.newsForm.validation.slug.format') }),
  excerpt: z.string()
    .max(500, { message: t('admin.newsForm.validation.excerpt.maxLength', { count: 500 }) })
    .optional(),
  excerptEn: z.string()
    .max(500, { message: t('admin.newsForm.validation.excerptEn.maxLength', { count: 500 }) })
    .optional(),
  content: z.string()
    .min(1, { message: t('admin.newsForm.validation.content.required') }),
  contentEn: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string()
    .min(1, { message: t('admin.newsForm.validation.category.required') }),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'published'], {
    required_error: t('admin.newsForm.validation.status.required'),
  }),
  publishDate: z.date({
    required_error: t('admin.newsForm.validation.publishDate.required'),
  }),
  author: z.string()
    .min(1, { message: t('admin.newsForm.validation.author.required') }),
  readingTime: z.string().optional(),
  readingTimeEn: z.string().optional(),
});

type NewsFormValues = z.infer<ReturnType<typeof getNewsFormSchema>>;

const AdminNewsFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { articleId } = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const isEditMode = Boolean(articleId);
  
  // Memoize the schema to prevent re-creation on every render
  const newsFormSchema = useMemo(() => getNewsFormSchema(t), [t]);
  
  // Memoize the resolver as well
  const formResolver = useMemo(() => zodResolver(newsFormSchema), [newsFormSchema]);

  const form = useForm<NewsFormValues>({
    resolver: formResolver,
    defaultValues: {
      title: '',
      titleEn: '',
      slug: '',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      imageUrl: '',
      category: '',
      isFeatured: false,
      status: 'draft',
      publishDate: new Date(),
      author: '',
      readingTime: '',
      readingTimeEn: '',
    },
  });

  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[đ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }, []);

  // Combine all watched values into a single useWatch to reduce re-renders
  const watchedValues = useWatch({
    control: form.control,
    name: ['title', 'category', 'status', 'publishDate', 'isFeatured']
  });

  const [watchedTitle, watchedCategory, watchedStatus, watchedPublishDate, watchedIsFeatured] = watchedValues;

  // Debounced slug generation effect - only run when title changes and not in edit mode
  useEffect(() => {
    if (watchedTitle && !isEditMode && dataLoaded) {
      const generatedSlug = generateSlug(watchedTitle);
      form.setValue('slug', generatedSlug, { 
        shouldValidate: false, 
        shouldDirty: false,
        shouldTouch: false 
      });
    }
  }, [watchedTitle, generateSlug, isEditMode, dataLoaded, form]);

  // Memoize form functions to prevent recreation on every render
  const formReset = useCallback((data: NewsFormValues) => {
    form.reset(data);
  }, [form]);

  const formSetValue = useCallback((field: keyof NewsFormValues, value: any) => {
    form.setValue(field, value);
  }, [form]);

  // Load initial data - Fixed dependency array
  useEffect(() => {
    let isMounted = true; // Cleanup flag to prevent state updates after unmount
    
    const loadInitialData = async () => {
      if (!isMounted) return;
      
      setIsInitialLoading(true);
      setDataLoaded(false);
      
      try {
        // Load categories first
        const categoryData = await fetchNewsCategories();
        if (!isMounted) return;
        setCategories(categoryData);

        // Load article data for edit mode
        if (isEditMode && articleId) {
          const articleData = await fetchAdminNewsArticleById(articleId);
          if (!isMounted) return;
          
          if (articleData) {
            // Populate form with existing data
            const formData: NewsFormValues = {
              title: articleData.title,
              titleEn: articleData.titleEn || '',
              slug: articleData.slug,
              excerpt: articleData.excerpt,
              excerptEn: articleData.excerptEn || '',
              content: articleData.content || '',
              contentEn: articleData.contentEn || '',
              imageUrl: articleData.imageUrl,
              category: articleData.category.id,
              isFeatured: articleData.isFeatured || false,
              status: articleData.status,
              publishDate: new Date(articleData.publishDate),
              author: articleData.author,
              readingTime: articleData.readingTime || '',
              readingTimeEn: articleData.readingTimeEn || '',
            };
            
            formReset(formData);
            
            if (articleData.imageUrl) {
              setImagePreview(articleData.imageUrl);
            }
          } else {
            toast.error(t('admin.newsForm.messages.articleNotFound'));
            navigate('/admin/news');
            return;
          }
        } else if (!isEditMode) {
          // Set default author for create mode
          const adminUser = localStorage.getItem('adminUser');
          if (adminUser && isMounted) {
            const user = JSON.parse(adminUser);
            formSetValue('author', user.email);
          }
        }
        
        if (isMounted) {
          setDataLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading initial data:', error);
          toast.error(t('admin.newsForm.messages.loadError'));
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    loadInitialData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [articleId, isEditMode, navigate, t, formReset, formSetValue]);

  // Handle image selection
  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        formSetValue('imageUrl', result); // For now, use base64 - TODO: Upload to server
      };
      reader.readAsDataURL(file);
    }
  }, [formSetValue]);

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    formSetValue('imageUrl', '');
  }, [formSetValue]);

  // Memoized form setValue callbacks - consolidated into single functions
  const handleSelectChange = useCallback((field: keyof NewsFormValues) => {
    return (value: string | boolean) => {
      formSetValue(field, value);
    };
  }, [formSetValue]);

  const handleDateChange = useCallback((date: Date | undefined) => {
    if (date) formSetValue('publishDate', date);
  }, [formSetValue]);

  // Handle form submission
  const onSubmit = useCallback(async (data: NewsFormValues) => {
    setIsLoading(true);
    try {
      console.log('Form submitted with data:', data);
      
      // TODO: Replace with actual API calls
      if (isEditMode && articleId) {
        await updateAdminNewsArticle(articleId, data);
        toast.success(t('admin.newsForm.messages.updateSuccess'));
      } else {
        await createAdminNewsArticle(data);
        toast.success(t('admin.newsForm.messages.createSuccess'));
      }
      
      navigate('/admin/news');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        isEditMode 
          ? t('admin.newsForm.messages.updateError')
          : t('admin.newsForm.messages.createError')
      );
    } finally {
      setIsLoading(false);
    }
  }, [isEditMode, articleId, navigate, t]);

  // Handle cancel/back navigation
  const handleCancel = useCallback(() => {
    navigate('/admin/news');
  }, [navigate]);

  // Improved loading state - only show skeleton when actually loading
  if (isInitialLoading || !dataLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information Section Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-40" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              
              {/* Content Section Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-32" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                ))}
              </div>
              
              {/* Settings Section Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-28" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex items-center justify-between pt-6">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('admin.newsForm.buttons.back')}</span>
            </Button>
            <h1 className={cn(
              "text-2xl font-bold",
              theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
            )}>
              {isEditMode 
                ? t('admin.newsForm.title.edit')
                : t('admin.newsForm.title.create')
              }
            </h1>
          </div>
        </div>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>
                {isEditMode 
                  ? t('admin.newsForm.cardTitle.edit') 
                  : t('admin.newsForm.cardTitle.create')
                }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h2 className={cn(
                  "text-lg font-semibold border-b pb-2",
                  theme === 'dark' 
                    ? 'text-dseza-dark-main-text border-dseza-dark-border' 
                    : 'text-dseza-light-main-text border-dseza-light-border'
                )}>
                  {t('admin.newsForm.sections.basicInfo')}
                </h2>

                {/* Title (Vietnamese) */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="required">
                    {t('admin.newsForm.fields.title.label')}
                  </Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder={t('admin.newsForm.fields.title.placeholder')}
                    disabled={isLoading}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* Title (English) */}
                <div className="space-y-2">
                  <Label htmlFor="titleEn">
                    {t('admin.newsForm.fields.titleEn.label')}
                  </Label>
                  <Input
                    id="titleEn"
                    {...form.register('titleEn')}
                    placeholder={t('admin.newsForm.fields.titleEn.placeholder')}
                    disabled={isLoading}
                  />
                  {form.formState.errors.titleEn && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.titleEn.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug" className="required">
                    {t('admin.newsForm.fields.slug.label')}
                  </Label>
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    placeholder={t('admin.newsForm.fields.slug.placeholder')}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.newsForm.fields.slug.description')}
                  </p>
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                {/* Excerpt (Vietnamese) */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">
                    {t('admin.newsForm.fields.excerpt.label')}
                  </Label>
                  <Textarea
                    id="excerpt"
                    {...form.register('excerpt')}
                    placeholder={t('admin.newsForm.fields.excerpt.placeholder')}
                    rows={3}
                    disabled={isLoading}
                  />
                  {form.formState.errors.excerpt && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.excerpt.message}
                    </p>
                  )}
                </div>

                {/* Excerpt (English) */}
                <div className="space-y-2">
                  <Label htmlFor="excerptEn">
                    {t('admin.newsForm.fields.excerptEn.label')}
                  </Label>
                  <Textarea
                    id="excerptEn"
                    {...form.register('excerptEn')}
                    placeholder={t('admin.newsForm.fields.excerptEn.placeholder')}
                    rows={3}
                    disabled={isLoading}
                  />
                  {form.formState.errors.excerptEn && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.excerptEn.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                <h2 className={cn(
                  "text-lg font-semibold border-b pb-2",
                  theme === 'dark' 
                    ? 'text-dseza-dark-main-text border-dseza-dark-border' 
                    : 'text-dseza-light-main-text border-dseza-light-border'
                )}>
                  {t('admin.newsForm.sections.content')}
                </h2>

                {/* Content (Vietnamese) */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="required">
                    {t('admin.newsForm.fields.content.label')}
                  </Label>
                  {/* TODO: Replace with WYSIWYG Editor */}
                  <Textarea
                    id="content"
                    {...form.register('content')}
                    placeholder={t('admin.newsForm.fields.content.placeholder')}
                    rows={10}
                    disabled={isLoading}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.newsForm.fields.content.description')}
                  </p>
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>

                {/* Content (English) */}
                <div className="space-y-2">
                  <Label htmlFor="contentEn">
                    {t('admin.newsForm.fields.contentEn.label')}
                  </Label>
                  {/* TODO: Replace with WYSIWYG Editor */}
                  <Textarea
                    id="contentEn"
                    {...form.register('contentEn')}
                    placeholder={t('admin.newsForm.fields.contentEn.placeholder')}
                    rows={10}
                    disabled={isLoading}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.newsForm.fields.contentEn.description')}
                  </p>
                  {form.formState.errors.contentEn && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.contentEn.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-6">
                <h2 className={cn(
                  "text-lg font-semibold border-b pb-2",
                  theme === 'dark' 
                    ? 'text-dseza-dark-main-text border-dseza-dark-border' 
                    : 'text-dseza-light-main-text border-dseza-light-border'
                )}>
                  {t('admin.newsForm.sections.media')}
                </h2>

                {/* Featured Image */}
                <div className="space-y-4">
                  <Label>{t('admin.newsForm.fields.image.label')}</Label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleImageRemove}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Image Upload */}
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor="image-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center space-x-2"
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4" />
                          <span>
                            {imagePreview 
                              ? t('admin.newsForm.fields.image.change') 
                              : t('admin.newsForm.fields.image.select')
                            }
                          </span>
                        </span>
                      </Button>
                    </Label>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleImageRemove}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t('admin.newsForm.fields.image.remove')}</span>
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {t('admin.newsForm.fields.image.description')}
                  </p>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <h2 className={cn(
                  "text-lg font-semibold border-b pb-2",
                  theme === 'dark' 
                    ? 'text-dseza-dark-main-text border-dseza-dark-border' 
                    : 'text-dseza-light-main-text border-dseza-light-border'
                )}>
                  {t('admin.newsForm.sections.settings')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="required">
                      {t('admin.newsForm.fields.category.label')}
                    </Label>
                    <Select
                      value={watchedCategory}
                      onValueChange={handleSelectChange('category')}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.newsForm.fields.category.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="required">
                      {t('admin.newsForm.fields.status.label')}
                    </Label>
                    <Select
                      value={watchedStatus}
                      onValueChange={handleSelectChange('status')}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.newsForm.fields.status.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          {t('admin.newsList.status.draft')}
                        </SelectItem>
                        <SelectItem value="pending">
                          {t('admin.newsList.status.pending')}
                        </SelectItem>
                        <SelectItem value="published">
                          {t('admin.newsList.status.published')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.status.message}
                      </p>
                    )}
                  </div>

                  {/* Publish Date */}
                  <div className="space-y-2">
                    <Label className="required">
                      {t('admin.newsForm.fields.publishDate.label')}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watchedPublishDate && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {watchedPublishDate ? (
                            format(watchedPublishDate, 'dd/MM/yyyy')
                          ) : (
                            <span>{t('admin.newsForm.fields.publishDate.placeholder')}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={watchedPublishDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.publishDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.publishDate.message}
                      </p>
                    )}
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="required">
                      {t('admin.newsForm.fields.author.label')}
                    </Label>
                    <Input
                      id="author"
                      {...form.register('author')}
                      placeholder={t('admin.newsForm.fields.author.placeholder')}
                      disabled={isLoading}
                    />
                    {form.formState.errors.author && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.author.message}
                      </p>
                    )}
                  </div>

                  {/* Reading Time (Vietnamese) */}
                  <div className="space-y-2">
                    <Label htmlFor="readingTime">
                      {t('admin.newsForm.fields.readingTime.label')}
                    </Label>
                    <Input
                      id="readingTime"
                      {...form.register('readingTime')}
                      placeholder={t('admin.newsForm.fields.readingTime.placeholder')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Reading Time (English) */}
                  <div className="space-y-2">
                    <Label htmlFor="readingTimeEn">
                      {t('admin.newsForm.fields.readingTimeEn.label')}
                    </Label>
                    <Input
                      id="readingTimeEn"
                      {...form.register('readingTimeEn')}
                      placeholder={t('admin.newsForm.fields.readingTimeEn.placeholder')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={watchedIsFeatured}
                    onCheckedChange={handleSelectChange('isFeatured')}
                    disabled={isLoading}
                  />
                  <Label htmlFor="isFeatured">
                    {t('admin.newsForm.fields.isFeatured.label')}
                  </Label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {t('admin.newsForm.buttons.cancel')}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {isLoading 
                        ? t('admin.newsForm.buttons.saving')
                        : isEditMode 
                          ? t('admin.newsForm.buttons.save')
                          : t('admin.newsForm.buttons.create')
                      }
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNewsFormPage; 