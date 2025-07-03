export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  url: string;
  thumbnailUrl?: string;
  folder: string;
  uploadedAt: string; // ISO 8601 string
  uploadedBy: string;
  alt?: string;
  caption?: string;
  metadata?: MediaMetadata;
  
  // CDN and optimization features
  cdnUrl?: string;
  responsiveUrls?: ResponsiveImageUrls;
  webpUrl?: string;
  isOptimized?: boolean;
  
  // Video-specific properties
  duration?: number; // for videos in seconds
  hasAudio?: boolean; // for videos
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number; // for videos in seconds
  format?: string;
  colorSpace?: string;
  hasAudio?: boolean; // for videos
}

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: string;
  createdBy: string;
  fileCount: number;
  subfolders?: MediaFolder[];
}

export interface MediaUploadProgress {
  id: string;
  filename: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface MediaLibraryConfig {
  allowedTypes: string[]; // ['image/jpeg', 'image/png', 'video/mp4', etc.]
  maxFileSize: number; // in bytes
  maxFiles: number;
  enableThumbnails: boolean;
  thumbnailSizes: ThumbnailSize[];
  enableVideoProcessing: boolean;
}

export interface ThumbnailSize {
  name: string;
  width: number;
  height: number;
  crop: boolean;
}

// CDN and responsive image types
export interface ResponsiveImageUrls {
  small: string;   // 300x200
  medium: string;  // 600x400  
  large: string;   // 1200x800
  original: string;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'crop' | 'cover' | 'contain';
}

export interface CDNConfig {
  enabled: boolean;
  baseUrl: string;
  transformations: {
    enableWebP: boolean;
    enableResponsive: boolean;
    defaultQuality: number;
  };
}

// API Response interfaces
export interface MediaFilesResponse {
  status: string;
  data: {
    files: MediaFile[];
    folders: MediaFolder[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface MediaUploadResponse {
  status: string;
  data: MediaFile;
  message?: string;
}

export interface MediaFolderResponse {
  status: string;
  data: MediaFolder;
  message?: string;
}

// Component Props interfaces
export interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (files: MediaFile[]) => void;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFiles?: number;
  enableCDN?: boolean;
  enableVideoUpload?: boolean;
  enableImageOptimization?: boolean;
}

export interface MediaGridProps {
  files: MediaFile[];
  folders: MediaFolder[];
  selectedFiles: MediaFile[];
  onFileSelect: (file: MediaFile) => void;
  onFolderOpen: (folder: MediaFolder) => void;
  onFileDelete: (file: MediaFile) => void;
  viewMode: 'grid' | 'list';
  loading?: boolean;
}

export interface MediaUploadAreaProps {
  onFilesSelect: (files: File[]) => void;
  allowedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
}

export interface MediaFileCardProps {
  file: MediaFile;
  isSelected: boolean;
  onSelect: (file: MediaFile) => void;
  onDelete?: (file: MediaFile) => void;
  viewMode: 'grid' | 'list';
}

export interface MediaFolderCardProps {
  folder: MediaFolder;
  onOpen: (folder: MediaFolder) => void;
  onDelete?: (folder: MediaFolder) => void;
}

// Filter and Sort options
export type MediaSortBy = 'name' | 'size' | 'uploadedAt' | 'type';
export type MediaSortOrder = 'asc' | 'desc';

export interface MediaFilters {
  folderId?: string;
  type?: 'image' | 'video' | 'document' | 'all';
  search?: string;
  sortBy: MediaSortBy;
  sortOrder: MediaSortOrder;
  dateFrom?: string;
  dateTo?: string;
}

// Constants
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
  ...SUPPORTED_DOCUMENT_TYPES
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB

// Utility functions
export const getFileTypeCategory = (mimeType: string): 'image' | 'video' | 'document' | 'other' => {
  if (SUPPORTED_IMAGE_TYPES.includes(mimeType)) return 'image';
  if (SUPPORTED_VIDEO_TYPES.includes(mimeType)) return 'video';
  if (SUPPORTED_DOCUMENT_TYPES.includes(mimeType)) return 'document';
  return 'other';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (file: MediaFile): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.mimeType);
};

export const isVideoFile = (file: MediaFile): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.mimeType);
};

export const isDocumentFile = (file: MediaFile): boolean => {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.mimeType);
}; 