import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Upload,
  X,
  Play,
  Image as ImageIcon,
  File,
  Check,
  Grid,
  List,
  Search,
  Filter,
  Download,
  Trash2,
  Settings,
  Maximize,
  ExternalLink
} from 'lucide-react';

// Types & Services
import {
  MediaFile,
  MediaFolder,
  MediaLibraryProps,
  MediaUploadProgress,
  MediaFilters,
  ResponsiveImageUrls,
  ImageOptimizationOptions,
  formatFileSize,
  getFileTypeCategory,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  SUPPORTED_VIDEO_TYPES,
  ALL_SUPPORTED_TYPES
} from '@/types/media';
import {
  fetchMediaFiles,
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  createFolder,
  getCDNUrl,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getWebPUrl,
  validateFile,
  generateVideoThumbnail
} from '@/services/mediaService';

interface MediaPickerProps extends Omit<MediaLibraryProps, 'isOpen' | 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
  onInsert?: (files: MediaFile[]) => void;
  insertMode?: 'url' | 'html' | 'markdown';
  wysiwyg?: boolean;
  showInsertOptions?: boolean;
}

interface InsertOptions {
  alt: string;
  title: string;
  width?: number;
  height?: number;
  responsive: boolean;
  useWebP: boolean;
  linkToOriginal: boolean;
  autoplay?: boolean; // for videos
  controls?: boolean; // for videos
  muted?: boolean; // for videos
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  onInsert,
  multiple = false,
  allowedTypes = ALL_SUPPORTED_TYPES,
  maxFiles = 10,
  enableCDN = true,
  enableVideoUpload = true,
  enableImageOptimization = true,
  insertMode = 'html',
  wysiwyg = false,
  showInsertOptions = true
}) => {
  // State management
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');
  
  // Upload states
  const [uploadProgress, setUploadProgress] = useState<MediaUploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<MediaFilters>({
    folderId: '',
    type: 'all',
    search: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc'
  });
  
  // Insert options
  const [insertOptions, setInsertOptions] = useState<InsertOptions>({
    alt: '',
    title: '',
    responsive: true,
    useWebP: enableImageOptimization,
    linkToOriginal: false,
    controls: true,
    muted: false
  });

  // Load media files
  const loadMediaFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchMediaFiles(filters);
      setFiles(response.data.files);
      setFolders(response.data.folders);
    } catch (error) {
      console.error('Error loading media files:', error);
      toast.error('Không thể tải danh sách media');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles();
    }
  }, [isOpen, loadMediaFiles]);

  // Handle file upload
  const handleFileUpload = async (uploadFiles: File[]) => {
    const validFiles = uploadFiles.filter(file => {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Định dạng không được hỗ trợ`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const results = await uploadMultipleFiles(
        validFiles,
        currentFolder,
        (progress) => {
          setUploadProgress(prev => {
            const existing = prev.findIndex(p => p.id === progress.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = progress;
              return updated;
            }
            return [...prev, progress];
          });
        }
      );

      // Update files list
      const newFiles = results.map(result => result.data);
      setFiles(prev => [...prev, ...newFiles]);
      
      toast.success(`Đã tải lên ${results.length} file thành công`);
      setActiveTab('browse');
      
      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Có lỗi khi tải file lên');
    }
  };

  // Handle file selection
  const handleFileSelect = (file: MediaFile) => {
    setSelectedFiles(prev => {
      const isSelected = prev.some(f => f.id === file.id);
      if (isSelected) {
        return prev.filter(f => f.id !== file.id);
      } else {
        if (multiple) {
          return [...prev, file];
        } else {
          return [file];
        }
      }
    });
  };

  // Handle file deletion
  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${file.originalName}"?`)) {
      return;
    }

    try {
      await deleteFile(file.id);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
      toast.success('Đã xóa file thành công');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa file');
    }
  };

  // Generate insert code
  const generateInsertCode = (file: MediaFile, options: InsertOptions): string => {
    const url = options.useWebP && file.webpUrl ? file.webpUrl : 
                options.responsive && file.responsiveUrls ? file.responsiveUrls.medium : 
                file.url;
    
    if (insertMode === 'url') {
      return url;
    }
    
    if (insertMode === 'markdown') {
      if (isImageFile(file)) {
        return `![${options.alt || file.alt || file.originalName}](${url}${options.title ? ` "${options.title}"` : ''})`;
      } else if (isVideoFile(file)) {
        return `[${file.originalName}](${url})`;
      }
      return `[${file.originalName}](${url})`;
    }
    
    // HTML mode (default)
    if (isImageFile(file)) {
      let imgTag = `<img src="${url}"`;
      if (options.alt) imgTag += ` alt="${options.alt}"`;
      if (options.title) imgTag += ` title="${options.title}"`;
      if (options.width) imgTag += ` width="${options.width}"`;
      if (options.height) imgTag += ` height="${options.height}"`;
      if (options.responsive) imgTag += ` style="max-width: 100%; height: auto;"`;
      imgTag += ` />`;
      
      if (options.linkToOriginal) {
        return `<a href="${file.url}" target="_blank">${imgTag}</a>`;
      }
      return imgTag;
    } else if (isVideoFile(file)) {
      let videoTag = `<video`;
      if (options.width) videoTag += ` width="${options.width}"`;
      if (options.height) videoTag += ` height="${options.height}"`;
      if (options.controls) videoTag += ` controls`;
      if (options.autoplay) videoTag += ` autoplay`;
      if (options.muted) videoTag += ` muted`;
      if (options.responsive) videoTag += ` style="max-width: 100%; height: auto;"`;
      videoTag += `>\n  <source src="${url}" type="${file.mimeType}">\n  Trình duyệt của bạn không hỗ trợ video.\n</video>`;
      return videoTag;
    }
    
    return `<a href="${url}" target="_blank">${file.originalName}</a>`;
  };

  // Handle insert
  const handleInsert = () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn file để chèn');
      return;
    }

    if (onInsert) {
      // For WYSIWYG integration
      const codes = selectedFiles.map(file => generateInsertCode(file, insertOptions));
      onInsert(selectedFiles);
    } else if (onSelect) {
      // For regular selection
      onSelect(selectedFiles);
    }
    
    onClose();
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, [currentFolder]);

  // Filter files based on type
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      if (filters.type !== 'all') {
        const category = getFileTypeCategory(file.mimeType);
        if (category !== filters.type) return false;
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return file.originalName.toLowerCase().includes(searchTerm) ||
               file.alt?.toLowerCase().includes(searchTerm) ||
               file.caption?.toLowerCase().includes(searchTerm);
      }
      
      return true;
    });
  }, [files, filters]);

  // Render file card
  const renderFileCard = (file: MediaFile) => {
    const isSelected = selectedFiles.some(f => f.id === file.id);
    const fileCategory = getFileTypeCategory(file.mimeType);
    
    return (
      <Card 
        key={file.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleFileSelect(file)}
      >
        <CardContent className="p-3">
          <div className="aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden relative">
            {isImageFile(file) && (
              <img
                src={file.thumbnailUrl || file.url}
                alt={file.alt || file.originalName}
                className="w-full h-full object-cover"
              />
            )}
            {isVideoFile(file) && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.alt || file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            {isDocumentFile(file) && (
              <div className="w-full h-full flex items-center justify-center">
                <File className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
            
            <Badge 
              variant="secondary" 
              className="absolute bottom-2 left-2 text-xs"
            >
              {fileCategory}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium truncate" title={file.originalName}>
              {file.originalName}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
            {file.metadata?.width && file.metadata?.height && (
              <p className="text-xs text-gray-500">
                {file.metadata.width} × {file.metadata.height}
              </p>
            )}
            {file.duration && (
              <p className="text-xs text-gray-500">
                {Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(file.url, '_blank');
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thư viện Media</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Duyệt file</TabsTrigger>
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="flex-1 flex flex-col space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm file..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="max-w-sm"
                />
              </div>
              
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="image">Hình ảnh</SelectItem>
                  {enableVideoUpload && <SelectItem value="video">Video</SelectItem>}
                  <SelectItem value="document">Tài liệu</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* File grid */}
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Không có file nào
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filteredFiles.map(renderFileCard)}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1 space-y-4">
            {/* Upload area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                Kéo thả file vào đây hoặc
              </p>
              <Button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = allowedTypes.join(',');
                  input.onchange = (e) => {
                    const files = Array.from((e.target as HTMLInputElement).files || []);
                    handleFileUpload(files);
                  };
                  input.click();
                }}
              >
                Chọn file
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Hỗ trợ: Hình ảnh{enableVideoUpload ? ', Video' : ''}, Tài liệu (tối đa {maxFiles} file)
              </p>
            </div>
            
            {/* Upload progress */}
            {uploadProgress.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Đang tải lên</h3>
                {uploadProgress.map((progress) => (
                  <div key={progress.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate">{progress.filename}</span>
                      <span className="text-sm text-gray-500">{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Insert options */}
        {showInsertOptions && selectedFiles.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-medium">Tùy chọn chèn</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alt">Alt text</Label>
                <Input
                  id="alt"
                  value={insertOptions.alt}
                  onChange={(e) => setInsertOptions(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Mô tả hình ảnh..."
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={insertOptions.title}
                  onChange={(e) => setInsertOptions(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Tiêu đề..."
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="responsive"
                  checked={insertOptions.responsive}
                  onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, responsive: checked }))}
                />
                <Label htmlFor="responsive">Responsive</Label>
              </div>
              
              {enableImageOptimization && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="webp"
                    checked={insertOptions.useWebP}
                    onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, useWebP: checked }))}
                  />
                  <Label htmlFor="webp">Sử dụng WebP</Label>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="linkOriginal"
                  checked={insertOptions.linkToOriginal}
                  onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, linkToOriginal: checked }))}
                />
                <Label htmlFor="linkOriginal">Link to original</Label>
              </div>
            </div>
            
            {selectedFiles.some(f => isVideoFile(f)) && (
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="controls"
                    checked={insertOptions.controls}
                    onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, controls: checked }))}
                  />
                  <Label htmlFor="controls">Hiển thị controls</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoplay"
                    checked={insertOptions.autoplay}
                    onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, autoplay: checked }))}
                  />
                  <Label htmlFor="autoplay">Tự động phát</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="muted"
                    checked={insertOptions.muted}
                    onCheckedChange={(checked) => setInsertOptions(prev => ({ ...prev, muted: checked }))}
                  />
                  <Label htmlFor="muted">Tắt tiếng</Label>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedFiles.length > 0 && `Đã chọn ${selectedFiles.length} file`}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              onClick={handleInsert}
              disabled={selectedFiles.length === 0}
            >
              {wysiwyg ? 'Chèn' : 'Chọn'} ({selectedFiles.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};