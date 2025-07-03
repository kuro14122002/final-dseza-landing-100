// src/services/mediaService.ts
import axios from 'axios';
import { 
  MediaFile, 
  MediaFolder, 
  MediaFilesResponse, 
  MediaUploadResponse, 
  MediaFolderResponse,
  MediaFilters,
  MediaUploadProgress,
  SUPPORTED_VIDEO_TYPES,
  MAX_VIDEO_SIZE
} from '@/types/media';

// API Base URL
const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';

// CDN Configuration
const CDN_ENABLED = process.env.NODE_ENV === 'production';
const CDN_BASE_URL = 'https://cdn.dseza.gov.vn';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased timeout for video uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock delay for development
const MOCK_DELAY = 1000;

// Enhanced mock data with video support
const mockFolders: MediaFolder[] = [
  {
    id: 'folder-1',
    name: 'Tin tức',
    slug: 'tin-tuc',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@dseza.gov.vn',
    fileCount: 12
  },
  {
    id: 'folder-2', 
    name: 'Sự kiện',
    slug: 'su-kien',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@dseza.gov.vn',
    fileCount: 8
  },
  {
    id: 'folder-3',
    name: 'Video',
    slug: 'video',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@dseza.gov.vn',
    fileCount: 5
  }
];

const mockFiles: MediaFile[] = [
  {
    id: 'img-1',
    filename: 'dseza-building-001.jpg',
    originalName: 'Tòa nhà DSEZA.jpg',
    mimeType: 'image/jpeg',
    size: 2048576, // 2MB
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop',
    folder: 'folder-1',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'admin@dseza.gov.vn',
    alt: 'Tòa nhà DSEZA',
    caption: 'Tòa nhà chính của Ban Quản lý DSEZA',
    metadata: {
      width: 1920,
      height: 1080,
      format: 'JPEG'
    }
  },
  {
    id: 'vid-1',
    filename: 'dseza-intro-video.mp4',
    originalName: 'Video giới thiệu DSEZA.mp4',
    mimeType: 'video/mp4',
    size: 52428800, // 50MB
    url: 'https://sample-videos.com/zip/10/mp4/480/SampleVideo_720x480_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop',
    folder: 'folder-3',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'admin@dseza.gov.vn',
    alt: 'Video giới thiệu DSEZA',
    caption: 'Video giới thiệu về các hoạt động của DSEZA',
    metadata: {
      width: 1280,
      height: 720,
      format: 'MP4',
      duration: 120,
      hasAudio: true
    }
  }
];

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get optimal CDN URL for media files
 */
export const getCDNUrl = (originalUrl: string, transformations?: string): string => {
  if (!CDN_ENABLED || !originalUrl) return originalUrl;
  
  // If already a CDN URL, return as is
  if (originalUrl.includes(CDN_BASE_URL)) return originalUrl;
  
  // Convert local URL to CDN URL with optional transformations
  const filename = originalUrl.split('/').pop();
  let cdnUrl = `${CDN_BASE_URL}/${filename}`;
  
  if (transformations) {
    cdnUrl += `?${transformations}`;
  }
  
  return cdnUrl;
};

/**
 * Generate responsive image URLs for different screen sizes
 */
export const getResponsiveImageUrls = (baseUrl: string) => {
  return {
    small: getCDNUrl(baseUrl, 'w=300&h=200&fit=crop&quality=80'),
    medium: getCDNUrl(baseUrl, 'w=600&h=400&fit=crop&quality=85'),
    large: getCDNUrl(baseUrl, 'w=1200&h=800&fit=crop&quality=90'),
    original: getCDNUrl(baseUrl)
  };
};

/**
 * Generate WebP alternative URL
 */
export const getWebPUrl = (originalUrl: string): string => {
  if (!CDN_ENABLED) return originalUrl;
  return getCDNUrl(originalUrl, 'format=webp&quality=80');
};

// API Functions

/**
 * Fetch media files and folders with enhanced filtering
 */
export const fetchMediaFiles = async (filters: Partial<MediaFilters> = {}): Promise<MediaFilesResponse> => {
  try {
    const response = await api.get('/media', { params: filters });
    
    // Enhance response with CDN URLs
    const enhancedFiles = response.data.data.files.map((file: MediaFile) => ({
      ...file,
      url: getCDNUrl(file.url),
      thumbnailUrl: file.thumbnailUrl ? getCDNUrl(file.thumbnailUrl) : undefined,
      responsiveUrls: file.mimeType.startsWith('image/') ? getResponsiveImageUrls(file.url) : undefined,
      webpUrl: file.mimeType.startsWith('image/') ? getWebPUrl(file.url) : undefined
    }));
    
    return {
      ...response.data,
      data: {
        ...response.data.data,
        files: enhancedFiles
      }
    };
  } catch (error) {
    console.warn('API not available, using mock data for media files');
    
    await delay(MOCK_DELAY);
    
    let filteredFiles = [...mockFiles];
    let filteredFolders = [...mockFolders];
    
    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filteredFiles = filteredFiles.filter(file => {
        switch (filters.type) {
          case 'image':
            return file.mimeType.startsWith('image/');
          case 'video':
            return file.mimeType.startsWith('video/');
          case 'document':
            return file.mimeType.startsWith('application/');
          default:
            return true;
        }
      });
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFiles = filteredFiles.filter(file => 
        file.originalName.toLowerCase().includes(searchTerm) ||
        file.alt?.toLowerCase().includes(searchTerm) ||
        file.caption?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.folderId) {
      filteredFiles = filteredFiles.filter(file => file.folder === filters.folderId);
    }
    
    // Enhance with CDN URLs
    const enhancedFiles = filteredFiles.map(file => ({
      ...file,
      responsiveUrls: file.mimeType.startsWith('image/') ? getResponsiveImageUrls(file.url) : undefined,
      webpUrl: file.mimeType.startsWith('image/') ? getWebPUrl(file.url) : undefined
    }));
    
    return {
      status: 'success',
      data: {
        files: enhancedFiles,
        folders: filteredFolders,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: enhancedFiles.length,
          itemsPerPage: enhancedFiles.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    };
  }
};

/**
 * Upload single file with progress tracking and video support
 */
export const uploadFile = async (
  file: File, 
  folderId?: string,
  onProgress?: (progress: MediaUploadProgress) => void,
  metadata?: { altText?: string; caption?: string }
): Promise<MediaUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }
    if (metadata?.altText) {
      formData.append('altText', metadata.altText);
    }
    if (metadata?.caption) {
      formData.append('caption', metadata.caption);
    }
    
    const uploadId = `upload-${Date.now()}-${file.name}`;
    
    // Initial progress
    onProgress?.({
      id: uploadId,
      filename: file.name,
      progress: 0,
      status: 'uploading'
    });
    
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.({
            id: uploadId,
            filename: file.name,
            progress: percentCompleted,
            status: percentCompleted < 100 ? 'uploading' : 'processing'
          });
        }
      }
    });
    
    // Processing complete
    onProgress?.({
      id: uploadId,
      filename: file.name,
      progress: 100,
      status: 'completed'
    });
    
    // Enhance response with CDN URLs
    const enhancedFile = {
      ...response.data.data,
      url: getCDNUrl(response.data.data.url),
      thumbnailUrl: response.data.data.thumbnailUrl ? getCDNUrl(response.data.data.thumbnailUrl) : undefined,
      responsiveUrls: response.data.data.mimeType.startsWith('image/') ? 
        getResponsiveImageUrls(response.data.data.url) : undefined,
      webpUrl: response.data.data.mimeType.startsWith('image/') ? 
        getWebPUrl(response.data.data.url) : undefined
    };
    
    return {
      ...response.data,
      data: enhancedFile
    };
    
  } catch (error: any) {
    console.warn('API not available, using mock upload for:', file.name);
    
    const uploadId = `upload-${Date.now()}-${file.name}`;
    
    // Simulate upload progress
    const simulateProgress = async () => {
      for (let progress = 0; progress <= 100; progress += 10) {
        await delay(200);
        onProgress?.({
          id: uploadId,
          filename: file.name,
          progress,
          status: progress < 100 ? 'uploading' : 'processing'
        });
      }
    };
    
    await simulateProgress();
    
    // Simulate processing time for videos
    if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
      await delay(2000);
    }
    
    onProgress?.({
      id: uploadId,
      filename: file.name,
      progress: 100,
      status: 'completed'
    });
    
    const mockFile: MediaFile = {
      id: `file-${Date.now()}`,
      filename: file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-'),
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      thumbnailUrl: file.type.startsWith('image/') || file.type.startsWith('video/') ? 
        URL.createObjectURL(file) : undefined,
      folder: folderId || 'folder-1',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin@dseza.gov.vn',
      alt: metadata?.altText || '',
      caption: metadata?.caption || '',
      metadata: file.type.startsWith('video/') ? {
        format: file.type,
        hasAudio: true,
        duration: 0 // Would be determined by video processing
      } : undefined
    };
    
    // Add responsive URLs for images
    if (file.type.startsWith('image/')) {
      (mockFile as any).responsiveUrls = getResponsiveImageUrls(mockFile.url);
      (mockFile as any).webpUrl = getWebPUrl(mockFile.url);
    }
    
    return {
      status: 'success',
      data: mockFile
    };
  }
};

/**
 * Upload multiple files with batch processing
 */
export const uploadMultipleFiles = async (
  files: File[],
  folderId?: string,
  onProgress?: (progress: MediaUploadProgress) => void,
  metadata?: { [filename: string]: { altText?: string; caption?: string } }
): Promise<MediaUploadResponse[]> => {
  const results: MediaUploadResponse[] = [];
  
  for (const file of files) {
    try {
      const fileMetadata = metadata?.[file.name];
      const result = await uploadFile(file, folderId, onProgress, fileMetadata);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      // Continue with other files
    }
  }
  
  return results;
};

/**
 * Delete file with cleanup
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await api.delete(`/media/${fileId}`);
  } catch (error) {
    console.warn('API not available, simulating delete');
    await delay(500);
  }
};

/**
 * Create folder
 */
export const createFolder = async (name: string, parentId?: string): Promise<MediaFolderResponse> => {
  try {
    const response = await api.post('/media/folders', { name, parentId });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock folder creation');
    await delay(500);
    
    const newFolder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      parentId,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@dseza.gov.vn',
      fileCount: 0
    };
    
    return {
      status: 'success',
      data: newFolder
    };
  }
};

/**
 * Get optimized image URL for different use cases
 */
export const getOptimizedImageUrl = (
  originalUrl: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
    fit?: 'crop' | 'cover' | 'contain';
  } = {}
): string => {
  if (!CDN_ENABLED) return originalUrl;
  
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);
  if (options.fit) params.append('fit', options.fit);
  
  return getCDNUrl(originalUrl, params.toString());
};

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size based on type
  if (file.type.startsWith('video/')) {
    if (file.size > MAX_VIDEO_SIZE) {
      return { 
        valid: false, 
        error: `Video quá lớn. Kích thước tối đa: ${Math.round(MAX_VIDEO_SIZE / (1024 * 1024))}MB` 
      };
    }
    
    if (!SUPPORTED_VIDEO_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Định dạng video không được hỗ trợ. Chỉ hỗ trợ: MP4, WebM, QuickTime' 
      };
    }
  }
  
  return { valid: true };
};

/**
 * Generate video thumbnail (client-side preview)
 */
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      video.currentTime = 1; // Capture frame at 1 second
    });
    
    video.addEventListener('seeked', () => {
      context.drawImage(video, 0, 0);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });
    
    video.src = URL.createObjectURL(file);
  });
}; 