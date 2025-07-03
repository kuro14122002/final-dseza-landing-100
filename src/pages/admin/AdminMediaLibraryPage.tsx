import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FolderPlus,
  Search,
  Grid,
  List,
  Filter,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  Folder,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  Settings
} from 'lucide-react';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Custom hooks & utils
import { useTranslation } from '@/utils/translations';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

// Types & Services
import { 
  MediaFile, 
  MediaFolder, 
  MediaFilters, 
  MediaUploadProgress,
  formatFileSize,
  getFileTypeCategory,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  SUPPORTED_IMAGE_TYPES,
  MAX_FILE_SIZE
} from '@/types/media';
import { 
  fetchMediaFiles, 
  uploadFile, 
  deleteFile, 
  createFolder 
} from '@/services/mediaService';

const AdminMediaLibraryPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // State management
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dialogs
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Upload
  const [uploadProgress, setUploadProgress] = useState<MediaUploadProgress[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Filters
  const [filters, setFilters] = useState<MediaFilters>({
    folderId: '',
    type: 'all',
    search: '',
    sortBy: 'uploadedAt',
    sortOrder: 'desc'
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
      toast.error('Không thể tải danh sách file');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadMediaFiles();
  }, [loadMediaFiles]);

  // Handle file upload
  const handleFileUpload = async (uploadFiles: File[]) => {
    const validFiles = uploadFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} quá lớn (tối đa ${formatFileSize(MAX_FILE_SIZE)})`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      for (const file of validFiles) {
        const progressId = `upload-${Date.now()}-${file.name}`;
        
        setUploadProgress(prev => [...prev, {
          id: progressId,
          filename: file.name,
          progress: 0,
          status: 'uploading'
        }]);

        const response = await uploadFile(
          file, 
          currentFolder,
          (progress) => {
            setUploadProgress(prev => 
              prev.map(p => p.id === progressId ? progress : p)
            );
          }
        );

        setFiles(prev => [...prev, response.data]);
        
        // Remove progress after completion
        setTimeout(() => {
          setUploadProgress(prev => prev.filter(p => p.id !== progressId));
        }, 2000);
      }

      toast.success(`Đã tải lên ${validFiles.length} file thành công`);
      setShowUploadDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Có lỗi khi tải file lên');
    }
  };

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await createFolder(newFolderName, currentFolder);
      setFolders(prev => [...prev, response.data]);
      setNewFolderName('');
      setShowCreateFolderDialog(false);
      toast.success('Tạo thư mục thành công');
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Không thể tạo thư mục');
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa file "${file.originalName}"?`)) {
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

  // Handle file selection
  const handleFileSelect = (file: MediaFile) => {
    setSelectedFiles(prev => {
      const isSelected = prev.some(f => f.id === file.id);
      if (isSelected) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [currentFolder]);

  // Get file type icon
  const getFileIcon = (file: MediaFile) => {
    if (isImageFile(file)) {
      return <ImageIcon className="w-5 h-5" />;
    } else if (isVideoFile(file)) {
      return <Video className="w-5 h-5" />;
    } else if (isDocumentFile(file)) {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  // Render file card for grid view
  const renderFileCard = (file: MediaFile) => {
    const isSelected = selectedFiles.some(f => f.id === file.id);
    
    return (
      <Card 
        key={file.id}
        className={cn(
          "cursor-pointer transition-all hover:shadow-md relative group",
          isSelected && "ring-2 ring-blue-500",
          theme === 'dark' ? 'bg-dseza-dark-card border-dseza-dark-border' : 'bg-dseza-light-card'
        )}
        onClick={() => handleFileSelect(file)}
      >
        <CardContent className="p-4">
          {/* File preview */}
          <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {isImageFile(file) ? (
              <img 
                src={file.thumbnailUrl || file.url} 
                alt={file.alt || file.originalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-4xl">
                {getFileIcon(file)}
              </div>
            )}
          </div>
          
          {/* File info */}
          <div className="space-y-1">
            <p className="text-sm font-medium truncate" title={file.originalName}>
              {file.originalName}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <Badge variant="secondary" className="text-xs">
                {getFileTypeCategory(file.mimeType)}
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  window.open(file.url, '_blank');
                }}>
                  <Eye className="w-4 h-4 mr-2" />
                  Xem
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  window.open(file.url, '_blank');
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render folder card
  const renderFolderCard = (folder: MediaFolder) => {
    return (
      <Card 
        key={folder.id}
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          theme === 'dark' ? 'bg-dseza-dark-card border-dseza-dark-border' : 'bg-dseza-light-card'
        )}
        onClick={() => setCurrentFolder(folder.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-blue-500">
              <Folder className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{folder.name}</p>
              <p className="text-sm text-muted-foreground">
                {folder.fileCount} files
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "min-h-screen p-6 space-y-6",
        theme === 'dark' ? 'bg-dseza-dark-bg' : 'bg-dseza-light-bg'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Dashboard</span>
          </Button>
          <h1 className={cn(
            "text-2xl font-bold",
            theme === 'dark' ? 'text-dseza-dark-main-text' : 'text-dseza-light-main-text'
          )}>
            Thư viện Media
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Create folder */}
          <Dialog open={showCreateFolderDialog} onOpenChange={setShowCreateFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <FolderPlus className="w-4 h-4" />
                <span>Tạo thư mục</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo thư mục mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Tên thư mục</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nhập tên thư mục..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateFolderDialog(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateFolder}>
                    Tạo thư mục
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Upload button */}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Tải lên</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tải file lên</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  )}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Kéo thả file vào đây
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    hoặc
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        handleFileUpload(files);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button asChild>
                      <span>Chọn file</span>
                    </Button>
                  </Label>
                </div>

                {/* Upload progress */}
                {uploadProgress.length > 0 && (
                  <div className="space-y-2">
                    {uploadProgress.map((progress) => (
                      <div key={progress.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{progress.filename}</span>
                          <span>{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
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
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Tài liệu</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploadedAt">Ngày tải lên</SelectItem>
                <SelectItem value="name">Tên file</SelectItem>
                <SelectItem value="size">Kích thước</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Selected files info */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Đã chọn {selectedFiles.length} file
              </span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedFiles([])}
                >
                  Bỏ chọn
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedFiles.length} file đã chọn?`)) {
                      selectedFiles.forEach(handleDeleteFile);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa đã chọn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <div className="space-y-6">
        {/* Folders */}
        {folders.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thư mục</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map(renderFolderCard)}
            </div>
          </div>
        )}

        {/* Files */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            File ({files.length})
          </h3>
          {files.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Chưa có file nào</p>
                <p className="text-muted-foreground mb-4">
                  Hãy tải lên file đầu tiên của bạn
                </p>
                <Button onClick={() => setShowUploadDialog(true)}>
                  Tải file lên
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                : "space-y-2"
            )}>
              {files.map(renderFileCard)}
            </div>
          )}
        </div>
      </div>

      {/* Drag overlay */}
      {dragOver && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <p className="text-xl font-semibold">Thả file vào đây để tải lên</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaLibraryPage; 