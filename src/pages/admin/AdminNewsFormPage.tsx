import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Upload,
  Save,
  X,
  Loader2,
  FileText,
  Eye,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  ExternalLink,
  Paperclip,
  GripVertical,
  Eye as PreviewIcon
} from 'lucide-react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Custom hooks & utils
import { cn } from '@/lib/utils';

// Types
import { AdminNewsArticle, NewsCategory } from '@/types/news';
import { MediaFile, MediaUploadResponse } from '@/types/media';

// Services
import { 
  fetchAdminNewsArticleById,
  createAdminNewsArticle,
  updateAdminNewsArticle,
  fetchNewsCategories
} from '@/services/newsService';
import { uploadFile, uploadMultipleFiles, fetchMediaFiles } from '@/services/mediaService';

// Enhanced validation schema with file attachments
const newsFormSchema = z.object({
  title: z.string()
    .min(1, { message: 'Tiêu đề là bắt buộc' })
    .max(500, { message: 'Tiêu đề không được quá 500 ký tự' }),
  titleEn: z.string()
    .max(500, { message: 'Tiêu đề tiếng Anh không được quá 500 ký tự' })
    .optional(),
  excerpt: z.string()
    .min(1, { message: 'Tóm tắt là bắt buộc' })
    .max(1000, { message: 'Tóm tắt không được quá 1000 ký tự' }),
  excerptEn: z.string()
    .max(1000, { message: 'Tóm tắt tiếng Anh không được quá 1000 ký tự' })
    .optional(),
  content: z.string()
    .min(1, { message: 'Nội dung là bắt buộc' }),
  contentEn: z.string().optional(),
  categoryId: z.string()
    .min(1, { message: 'Danh mục là bắt buộc' }),
  imageUrl: z.string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'URL hình ảnh không hợp lệ'
    }),
  status: z.enum(['published', 'draft', 'pending']),
  isFeatured: z.boolean().optional(),
  publishDate: z.string().optional(),
  author: z.string()
    .min(1, { message: 'Tác giả là bắt buộc' }),
  tags: z.string().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number()
  })).optional()
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface UploadProgress {
  [key: string]: number;
}

interface AttachedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  preview?: string;
}

const AdminNewsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [existingArticle, setExistingArticle] = useState<AdminNewsArticle | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // File attachments states
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Media gallery states
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const isEditMode = Boolean(articleId);
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      categoryId: '',
      imageUrl: '',
      status: 'draft',
      isFeatured: false,
      publishDate: '',
      author: '',
      tags: '',
      attachments: []
    },
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchNewsCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Không thể tải danh sách danh mục');
      }
    };

    loadCategories();
  }, []);

  // Load article data for edit mode
  useEffect(() => {
    const loadArticleData = async () => {
      if (!isEditMode || !articleId) {
        setIsInitialLoading(false);
        return;
      }

      try {
        setIsInitialLoading(true);
        const article = await fetchAdminNewsArticleById(articleId);
        
        if (!article) {
          toast.error('Không tìm thấy bài viết');
          navigate('/admin/news');
          return;
        }
        
        setExistingArticle(article);
        setImagePreview(article.imageUrl);
        
        // Load existing attachments
        if (article.attachments) {
          setAttachedFiles(article.attachments);
        }
        
        // Populate form
        form.reset({
          title: article.title,
          titleEn: article.titleEn || '',
          excerpt: article.excerpt,
          excerptEn: article.excerptEn || '',
          content: article.content || '',
          contentEn: article.contentEn || '',
          categoryId: article.category.id,
          imageUrl: article.imageUrl,
          status: article.status,
          isFeatured: article.isFeatured || false,
          publishDate: article.publishDate,
          author: article.author,
          tags: article.tags || '',
          attachments: article.attachments || []
        });
        
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Không thể tải thông tin bài viết');
        navigate('/admin/news');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadArticleData();
  }, [isEditMode, articleId, form, navigate]);

  // Load media gallery
  const loadMediaGallery = useCallback(async () => {
    try {
      setLoadingMedia(true);
      const response = await fetchMediaFiles({ type: 'image', limit: 50 });
      setMediaFiles(response.data.files);
    } catch (error) {
      console.error('Error loading media gallery:', error);
      toast.error('Không thể tải thư viện media');
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  // Handle main image upload
  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Hình ảnh không được quá 10MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ cho phép file hình ảnh');
      return;
    }
    
    try {
      setIsUploading(true);
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const response = await uploadFile(file, 'news-images', (progress) => {
        setUploadProgress(prev => ({ ...prev, mainImage: progress.percentage }));
      });
      
      // Update form with uploaded URL
      form.setValue('imageUrl', response.url);
      toast.success('Tải lên hình ảnh thành công!');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
    } finally {
      setIsUploading(false);
      setUploadProgress(prev => ({ ...prev, mainImage: 0 }));
    }
  }, [form]);

  // Handle drag and drop for main image
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await handleImageUpload(imageFile);
    }
  }, [handleImageUpload]);

  // Handle file attachments
  const handleFileAttachment = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      
      const uploadPromises = files.map(async (file, index) => {
        const fileId = `file-${Date.now()}-${index}`;
        
        // Add to progress tracking
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        try {
          const response = await uploadFile(file, 'news-attachments', (progress) => {
            setUploadProgress(prev => ({ ...prev, [fileId]: progress.percentage }));
          });
          
          return {
            id: fileId,
            name: file.name,
            url: response.url,
            type: file.type,
            size: file.size,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
          };
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Không thể tải lên file ${file.name}`);
          return null;
        } finally {
          // Remove from progress tracking
          setUploadProgress(prev => {
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          });
        }
      });
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as AttachedFile[];
      
      if (successfulUploads.length > 0) {
        setAttachedFiles(prev => [...prev, ...successfulUploads]);
        toast.success(`Đã tải lên ${successfulUploads.length} file thành công!`);
      }
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Có lỗi xảy ra khi tải lên file');
    } finally {
      setIsUploading(false);
      // Clear input
      if (event.target) {
        event.target.value = '';
      }
    }
  }, []);

  // Remove attached file
  const removeAttachedFile = useCallback((fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('Đã xóa file đính kèm');
  }, []);

  // Remove main image
  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    form.setValue('imageUrl', '');
    toast.success('Đã xóa hình ảnh');
  }, [form]);

  // Insert image from gallery into content
  const insertImageToContent = useCallback((imageUrl: string, altText: string = '') => {
    if (editorRef.current) {
      const imageHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;" />`;
      editorRef.current.insertContent(imageHtml);
      setShowMediaGallery(false);
      toast.success('Đã chèn hình ảnh vào nội dung');
    }
  }, []);

  // Handle form submission
  const onSubmit = async (data: NewsFormValues) => {
    try {
      setIsLoading(true);
      
      // Validate attachments
      if (attachedFiles.length > 10) {
        toast.error('Chỉ được đính kèm tối đa 10 file');
        return;
      }

      const formData = {
        ...data,
        slug: data.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
        readingTime: calculateReadingTime(data.content),
        attachments: attachedFiles
      };

      let result: AdminNewsArticle;
      
      if (isEditMode && articleId) {
        result = await updateAdminNewsArticle(articleId, formData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        result = await createAdminNewsArticle(formData);
        toast.success('Tạo bài viết thành công!');
      }
      
      // Navigate to news list
      navigate('/admin/news');
      
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(isEditMode ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate reading time
  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút đọc`;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/news');
  };

  const breadcrumbs = [
    { label: 'Quản trị nội dung', href: '/admin/dashboard' },
    { label: 'Tin tức & Bài viết', href: '/admin/news' },
    { label: isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết' }
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
      >
        Hủy
      </Button>
      <Button
        type="submit"
        form="news-form"
        disabled={isLoading || isUploading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        {isEditMode ? 'Cập nhật' : 'Tạo mới'}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title={isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
      description={existingArticle ? `ID: ${existingArticle.id}` : 'Tạo bài viết tin tức mới'}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
      showBackButton={true}
      backUrl="/admin/news"
      isLoading={isInitialLoading}
      className="max-w-6xl"
    >
      {/* Upload Progress Alert */}
      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <Alert className="mb-6">
          <Upload className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Đang tải lên file...</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(Object.values(uploadProgress).reduce((a, b) => a + b, 0) / Object.keys(uploadProgress).length)}%
                </span>
              </div>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{fileId.includes('mainImage') ? 'Hình ảnh chính' : fileId}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form id="news-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* Title English */}
                <div className="space-y-2">
                  <Label htmlFor="titleEn">Tiêu đề tiếng Anh</Label>
                  <Input
                    id="titleEn"
                    {...form.register('titleEn')}
                    placeholder="Enter article title in English..."
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Tóm tắt *</Label>
                  <Textarea
                    id="excerpt"
                    {...form.register('excerpt')}
                    placeholder="Nhập tóm tắt bài viết..."
                    rows={3}
                  />
                  {form.formState.errors.excerpt && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.excerpt.message}
                    </p>
                  )}
                </div>

                {/* Excerpt English */}
                <div className="space-y-2">
                  <Label htmlFor="excerptEn">Tóm tắt tiếng Anh</Label>
                  <Textarea
                    id="excerptEn"
                    {...form.register('excerptEn')}
                    placeholder="Enter article excerpt in English..."
                    rows={3}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Thẻ tag</Label>
                  <Input
                    id="tags"
                    {...form.register('tags')}
                    placeholder="Nhập các thẻ tag, cách nhau bằng dấu phẩy..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Ví dụ: kinh tế, đầu tư, công nghệ
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nội dung bài viết</CardTitle>
                  <div className="flex items-center gap-2">
                    <Dialog open={showMediaGallery} onOpenChange={setShowMediaGallery}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadMediaGallery}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Thư viện ảnh
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Chọn hình ảnh từ thư viện</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                          {loadingMedia ? (
                            Array.from({ length: 8 }).map((_, i) => (
                              <Skeleton key={i} className="aspect-square" />
                            ))
                          ) : (
                            mediaFiles.map((file) => (
                              <div
                                key={file.id}
                                className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                onClick={() => insertImageToContent(file.url, file.alt)}
                              >
                                <img
                                  src={file.thumbnailUrl || file.url}
                                  alt={file.alt || file.originalName}
                                  className="w-full aspect-square object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Plus className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vi" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="vi" className="space-y-2">
                    <Label htmlFor="content">Nội dung *</Label>
                    <div className="border rounded-lg">
                      <Textarea
                        id="content"
                        {...form.register('content')}
                        placeholder="Nhập nội dung bài viết..."
                        rows={12}
                        className="border-0 resize-none"
                      />
                    </div>
                    {form.formState.errors.content && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="en" className="space-y-2">
                    <Label htmlFor="contentEn">Nội dung tiếng Anh</Label>
                    <div className="border rounded-lg">
                      <Textarea
                        id="contentEn"
                        {...form.register('contentEn')}
                        placeholder="Enter article content in English..."
                        rows={12}
                        className="border-0 resize-none"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* File Attachments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>File đính kèm</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Thêm file
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                />
                
                {/* File List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="h-6 w-6 text-blue-500" />
                          ) : file.type.startsWith('video/') ? (
                            <Video className="h-6 w-6 text-purple-500" />
                          ) : (
                            <FileIcon className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachedFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {attachedFiles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có file đính kèm</p>
                    <p className="text-sm">Nhấn "Thêm file" để đính kèm tài liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL hình ảnh</Label>
                  <Input
                    id="imageUrl"
                    {...form.register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => {
                      form.setValue('imageUrl', e.target.value);
                      setImagePreview(e.target.value);
                    }}
                  />
                </div>

                {/* Drag & Drop Upload */}
                <div className="space-y-2">
                  <Label>Hoặc tải lên hình ảnh</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                      isDragOver 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc nhấn để chọn hình ảnh
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tối đa 10MB, định dạng JPG, PNG, WebP
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Xem trước</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt xuất bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label>Trạng thái *</Label>
                  <Select
                    value={form.watch('status')}
                    onValueChange={(value: 'published' | 'draft' | 'pending') => 
                      form.setValue('status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          Bản nháp
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          Chờ duyệt
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          Đã xuất bản
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Danh mục *</Label>
                  <Select
                    value={form.watch('categoryId')}
                    onValueChange={(value) => form.setValue('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả *</Label>
                  <Input
                    id="author"
                    {...form.register('author')}
                    placeholder="Nhập tên tác giả..."
                  />
                  {form.formState.errors.author && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.author.message}
                    </p>
                  )}
                </div>

                {/* Publish Date */}
                <div className="space-y-2">
                  <Label>Ngày xuất bản</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !form.watch('publishDate') && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {form.watch('publishDate') ? (
                          format(new Date(form.watch('publishDate')), 'dd/MM/yyyy')
                        ) : (
                          'Chọn ngày xuất bản'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={form.watch('publishDate') ? new Date(form.watch('publishDate')) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            form.setValue('publishDate', date.toISOString());
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={form.watch('isFeatured')}
                    onCheckedChange={(checked) => 
                      form.setValue('isFeatured', checked as boolean)
                    }
                  />
                  <Label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Bài viết nổi bật
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thời gian đọc:</span>
                  <span>{calculateReadingTime(form.watch('content') || '')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số từ:</span>
                  <span>{form.watch('content')?.split(/\s+/).length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File đính kèm:</span>
                  <span>{attachedFiles.length}</span>
                </div>
                {existingArticle && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span>{format(new Date(existingArticle.createdAt), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cập nhật cuối:</span>
                      <span>{format(new Date(existingArticle.updatedAt), 'dd/MM/yyyy')}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminPageLayout>
  );
};

export default AdminNewsFormPage;
