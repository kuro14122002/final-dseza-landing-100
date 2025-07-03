import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Download,
} from 'lucide-react';

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
import { toast } from 'sonner';

// Custom hooks & utils
import { cn } from '@/lib/utils';

// Types
import { LegalDocument, DocumentFormData, DOCUMENT_TYPES } from '@/types/documents';

// Services
import { 
  fetchDocumentById,
  createDocument,
  updateDocument 
} from '@/services/documentsService';
import { getCategoriesByType } from '@/services/categoryService';

// Category types
import { Category } from '@/types/categories';

// Validation schema
const documentFormSchema = z.object({
  title: z.string()
    .min(1, { message: 'Tiêu đề là bắt buộc' })
    .max(500, { message: 'Tiêu đề không được quá 500 ký tự' }),
  description: z.string()
    .max(1000, { message: 'Mô tả không được quá 1000 ký tự' })
    .optional(),
  document_type: z.string()
    .min(1, { message: 'Loại văn bản là bắt buộc' }),
  document_field: z.string().optional(),
  issuing_agency: z.string().optional(),
  issuing_level: z.string().optional(),
  document_number: z.string().optional(),
  issued_date: z.string().optional(),
  effective_date: z.string().optional(),
  file: z.any().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

const AdminDocumentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [existingDocument, setExistingDocument] = useState<LegalDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFilePath, setExistingFilePath] = useState<string>('');
  
  // Categories state
  const [documentFields, setDocumentFields] = useState<Category[]>([]);
  const [issuingAgencies, setIssuingAgencies] = useState<Category[]>([]);
  const [issuingLevels, setIssuingLevels] = useState<Category[]>([]);

  const isEditMode = Boolean(documentId);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      document_type: '',
      document_field: '',
      issuing_agency: '',
      issuing_level: '',
      document_number: '',
      issued_date: '',
      effective_date: '',
    },
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [fields, agencies, levels] = await Promise.all([
          getCategoriesByType('document_field'),
          getCategoriesByType('issuing_agency'),
          getCategoriesByType('issuing_level'),
        ]);
        
        setDocumentFields(fields);
        setIssuingAgencies(agencies);
        setIssuingLevels(levels);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Load document data for edit mode
  useEffect(() => {
    const loadDocumentData = async () => {
      if (!isEditMode || !documentId) {
        setIsInitialLoading(false);
        return;
      }

      try {
        setIsInitialLoading(true);
        const response = await fetchDocumentById(parseInt(documentId));
        const document = response.data;
        
        setExistingDocument(document);
        setExistingFilePath(document.file_path);
        
        // Populate form
        form.reset({
          title: document.title,
          description: document.description || '',
          document_type: document.document_type,
          document_field: document.document_field || '',
          issuing_agency: document.issuing_agency || '',
          issuing_level: document.issuing_level || '',
          document_number: document.document_number || '',
          issued_date: document.issued_date || '',
          effective_date: document.effective_date || '',
        });
        
      } catch (error) {
        console.error('Error loading document:', error);
        toast.error('Không thể tải thông tin văn bản');
        navigate('/admin/documents');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadDocumentData();
  }, [isEditMode, documentId, form, navigate]);

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File không được quá 10MB');
        return;
      }
      
      // Check file type (only PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Chỉ cho phép file PDF, DOC, DOCX');
        return;
      }
      
      setSelectedFile(file);
      form.setValue('file', file);
    }
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: DocumentFormValues) => {
    try {
      setIsLoading(true);
      
      // Validate file for create mode
      if (!isEditMode && !selectedFile) {
        toast.error('Vui lòng chọn file văn bản');
        return;
      }

      const formData: DocumentFormData = {
        title: data.title,
        description: data.description,
        document_type: data.document_type,
        document_field: data.document_field === 'none' ? undefined : data.document_field,
        issuing_agency: data.issuing_agency === 'none' ? undefined : data.issuing_agency,
        issuing_level: data.issuing_level === 'none' ? undefined : data.issuing_level,
        document_number: data.document_number,
        issued_date: data.issued_date,
        effective_date: data.effective_date,
        file: selectedFile || undefined,
      };

      if (isEditMode && documentId) {
        await updateDocument(parseInt(documentId), formData);
        toast.success('Cập nhật văn bản thành công');
      } else {
        await createDocument(formData);
        toast.success('Tạo văn bản thành công');
      }
      
      navigate('/admin/documents');
      
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi lưu văn bản');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/documents');
  };

  const handleDownloadExisting = () => {
    if (existingFilePath) {
      const downloadUrl = `http://localhost/final-dseza-landing-85/api/${existingFilePath}`;
      window.open(downloadUrl, '_blank');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Chỉnh sửa văn bản' : 'Thêm văn bản mới'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isEditMode ? 'Cập nhật thông tin văn bản pháp lý' : 'Tạo mới văn bản pháp lý'}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin văn bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề văn bản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Nhập tiêu đề văn bản..."
                className={cn(
                  form.formState.errors.title && "border-red-500"
                )}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Nhập mô tả ngắn gọn về văn bản..."
                rows={3}
                className={cn(
                  form.formState.errors.description && "border-red-500"
                )}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label>
                Loại văn bản <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={form.watch('document_type')} 
                onValueChange={(value) => form.setValue('document_type', value)}
              >
                <SelectTrigger className={cn(
                  form.formState.errors.document_type && "border-red-500"
                )}>
                  <SelectValue placeholder="Chọn loại văn bản" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.document_type && (
                <p className="text-sm text-red-500">{form.formState.errors.document_type.message}</p>
              )}
            </div>

            {/* Additional Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Field */}
              <div className="space-y-2">
                <Label>Lĩnh vực</Label>
                <Select 
                  value={form.watch('document_field') || 'none'} 
                  onValueChange={(value) => form.setValue('document_field', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lĩnh vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {documentFields.map((field) => (
                      <SelectItem key={field.id} value={field.name}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Issuing Agency */}
              <div className="space-y-2">
                <Label>Cơ quan ban hành</Label>
                <Select 
                  value={form.watch('issuing_agency') || 'none'} 
                  onValueChange={(value) => form.setValue('issuing_agency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cơ quan ban hành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {issuingAgencies.map((agency) => (
                      <SelectItem key={agency.id} value={agency.name}>
                        {agency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Issuing Level */}
              <div className="space-y-2">
                <Label>Cấp ban hành</Label>
                <Select 
                  value={form.watch('issuing_level') || 'none'} 
                  onValueChange={(value) => form.setValue('issuing_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp ban hành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {issuingLevels.map((level) => (
                      <SelectItem key={level.id} value={level.name}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Number */}
              <div className="space-y-2">
                <Label htmlFor="document_number">Số văn bản</Label>
                <Input
                  id="document_number"
                  {...form.register('document_number')}
                  placeholder="Nhập số văn bản..."
                />
              </div>
            </div>

            {/* Issued Date */}
            <div className="space-y-2">
              <Label>Ngày ban hành</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('issued_date') && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {form.watch('issued_date') ? (
                      format(new Date(form.watch('issued_date')), 'dd/MM/yyyy')
                    ) : (
                      "Chọn ngày ban hành"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={form.watch('issued_date') ? new Date(form.watch('issued_date')) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue('issued_date', format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>
                File văn bản {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              
              {/* Show existing file for edit mode */}
              {isEditMode && existingFilePath && (
                <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">File hiện tại</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadExisting}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Tải xuống
                    </Button>
                  </div>
                </div>
              )}

              {/* File upload input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-center">
                    <Label htmlFor="file" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      {isEditMode ? 'Chọn file mới (nếu muốn thay đổi)' : 'Chọn file văn bản'}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        {selectedFile.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          form.setValue('file', undefined);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
          >
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
    </div>
  );
};

export default AdminDocumentFormPage; 