// src/services/newsService.ts
import axios from 'axios';
import { NewsArticle, NewsCategory, AdminNewsArticle } from '@/types/news';
import authService from './authService';

// API Base URL - Đảm bảo khớp với port của frontend
const API_BASE_URL = window.location.origin.includes('8080') 
  ? 'http://localhost/final-dseza-landing-85/api'
  : 'http://localhost/final-dseza-landing-85/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create authenticated API instance for admin endpoints
const adminApi = authService.createAuthenticatedApi();

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminUserToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interface for paginated results
export interface PaginatedNewsResponse {
  articles: NewsArticle[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
}

// API Response interface
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: number;
  details?: any;
}

// Helper function to handle API responses
const handleApiResponse = <T>(response: any): T => {
  // Handle different response formats
  if (response.status === 'error' || response.success === false) {
    throw new Error(response.message || 'API Error');
  }
  
  // Check for data in different formats
  let data = response.data || response;
  
  // Special handling for null/undefined data
  if (data === null || data === undefined) {
    // For some endpoints, null data is valid (e.g., no featured article)
    return data;
  }
  
  return data;
};

// Add request/response interceptors for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

// ========== PUBLIC API FUNCTIONS ==========

/**
 * Fetch all news categories
 */
export const fetchNewsCategories = async (): Promise<NewsCategory[]> => {
  try {
    // Fetch categories with type filter for news categories
    const response = await api.get<ApiResponse<any>>('/categories?type=news_category&active=true');
    const data = handleApiResponse(response.data);
    
    // Handle different response structures
    if (data && typeof data === 'object') {
      // If response has categories property (paginated response)
      if ('categories' in data && Array.isArray(data.categories)) {
        return data.categories;
      }
      // If response is already an array
      if (Array.isArray(data)) {
        return data;
      }
    }
    
    // Return empty array if no valid categories found
    return [];
  } catch (error) {
    console.error('Error fetching news categories:', error);
    // Return empty array instead of throwing to prevent component crashes
    return [];
  }
};

/**
 * Fetch news articles with pagination and filtering
 */
export const fetchNewsArticles = async (
  categoryId?: string, 
  page: number = 1,
  limit: number = 9, 
  featured?: boolean
): Promise<PaginatedNewsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    
    if (featured !== undefined) {
      params.append('featured', featured.toString());
    }
    
    const response = await api.get<ApiResponse<PaginatedNewsResponse>>(`/news?${params.toString()}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw new Error('Failed to load news articles. Please try again later.');
  }
};

/**
 * Fetch featured article
 */
export const fetchFeaturedArticle = async (): Promise<NewsArticle | null> => {
  try {
    const response = await api.get<ApiResponse<NewsArticle | null>>('/news/featured');
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching featured article:', error);
    // Return null instead of throwing error for featured article
    return null;
  }
};

/**
 * Fetch regular news articles (non-featured)
 */
export const fetchRegularNews = async (
  categoryId?: string, 
  limit: number = 3
): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('featured', 'false');
    
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    
    const response = await api.get<ApiResponse<PaginatedNewsResponse>>(`/news?${params.toString()}`);
    const data = handleApiResponse(response.data) as PaginatedNewsResponse;
    return data.articles;
  } catch (error) {
    console.error('Error fetching regular news:', error);
    throw new Error('Failed to load news articles. Please try again later.');
  }
};

/**
 * Fetch category information by slug
 */
export const fetchCategoryInfoBySlug = async (categorySlug: string): Promise<NewsCategory | null> => {
  try {
    const response = await api.get<ApiResponse<NewsCategory>>(`/categories/${categorySlug}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching category info:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Failed to load category information. Please try again later.');
  }
};

/**
 * Fetch news articles by category slug with pagination
 */
export const fetchArticlesByCategorySlug = async (
  categorySlug: string,
  page: number = 1,
  limit: number = 9
): Promise<PaginatedNewsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get<ApiResponse<PaginatedNewsResponse>>(`/news/category/${categorySlug}?${params.toString()}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    throw new Error('Failed to load articles for this category. Please try again later.');
  }
};

/**
 * Fetch single news article by slug
 */
export const fetchNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  try {
    const response = await api.get<ApiResponse<NewsArticle>>(`/news/${slug}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching news article:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Failed to load article. Please try again later.');
  }
};

/**
 * Fetch related news articles
 */
export const fetchRelatedNews = async (
  currentArticleSlug: string, 
  categoryId: string, 
  limit: number = 4
): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('excludeSlug', currentArticleSlug);
    
    const response = await api.get<ApiResponse<NewsArticle[]>>(`/news/category/${categoryId}/related?${params.toString()}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching related news:', error);
    // Return empty array instead of throwing for related articles
    return [];
  }
};

/**
 * Fetch recent news articles
 */
export const fetchRecentNews = async (
  currentArticleSlug?: string, 
  limit: number = 5
): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('sortBy', 'publishDate');
    params.append('sortOrder', 'desc');
    
    if (currentArticleSlug) {
      params.append('excludeSlug', currentArticleSlug);
    }
    
    const response = await api.get<ApiResponse<PaginatedNewsResponse>>(`/news?${params.toString()}`);
    const data = handleApiResponse(response.data) as PaginatedNewsResponse;
    return data.articles;
  } catch (error) {
    console.error('Error fetching recent news:', error);
    // Return empty array instead of throwing for recent articles
    return [];
  }
};

// ========== ADMIN API FUNCTIONS ==========

/**
 * Fetch admin news article by ID for editing
 */
export const fetchAdminNewsArticleById = async (id: string): Promise<AdminNewsArticle | null> => {
  try {
    const response = await adminApi.get<ApiResponse<AdminNewsArticle>>(`/admin/news/${id}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching admin news article:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error('Failed to load article for editing. Please try again later.');
  }
};

/**
 * Create new admin news article with enhanced features
 */
export const createAdminNewsArticle = async (data: Partial<AdminNewsArticle>): Promise<AdminNewsArticle> => {
  try {
    // Prepare form data if there are file attachments
    const isMultipart = data.attachments && data.attachments.length > 0;
    
    let requestData: any;
    let config: any = {};
    
    if (isMultipart) {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(data).forEach(key => {
        if (key === 'attachments') return;
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
      
      // Add attachments metadata
      if (data.attachments) {
        formData.append('attachments', JSON.stringify(data.attachments));
      }
      
      requestData = formData;
      config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      requestData = data;
    }
    
    const response = await adminApi.post<ApiResponse<AdminNewsArticle>>('/admin/news', requestData, config);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error creating admin news article:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create article. Please try again later.');
  }
};

/**
 * Update admin news article with enhanced features
 */
export const updateAdminNewsArticle = async (id: string, data: Partial<AdminNewsArticle>): Promise<AdminNewsArticle> => {
  try {
    // Prepare form data if there are file attachments
    const isMultipart = data.attachments && data.attachments.length > 0;
    
    let requestData: any;
    let config: any = {};
    
    if (isMultipart) {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(data).forEach(key => {
        if (key === 'attachments') return;
        const value = (data as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
      
      // Add attachments metadata
      if (data.attachments) {
        formData.append('attachments', JSON.stringify(data.attachments));
      }
      
      requestData = formData;
      config.headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      requestData = data;
    }
    
    const response = await adminApi.put<ApiResponse<AdminNewsArticle>>(`/admin/news/${id}`, requestData, config);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error updating admin news article:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update article. Please try again later.');
  }
};

/**
 * Delete admin news article
 */
export const deleteAdminNewsArticle = async (id: string): Promise<void> => {
  try {
    await adminApi.delete(`/admin/news/${id}`);
  } catch (error) {
    console.error('Error deleting admin news article:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete article. Please try again later.');
  }
};

/**
 * Search news articles with advanced filtering
 */
export const searchNewsArticles = async (
  query: string,
  page: number = 1,
  limit: number = 9,
  filters?: {
    categoryId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    author?: string;
    tags?: string[];
  }
): Promise<PaginatedNewsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.author) params.append('author', filters.author);
      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
    }
    
    const response = await api.get<ApiResponse<PaginatedNewsResponse>>(`/search/news?${params.toString()}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error searching news articles:', error);
    throw new Error('Failed to search articles. Please try again later.');
  }
};

/**
 * Get news statistics for admin dashboard
 */
export const getNewsStats = async (): Promise<any> => {
  try {
    const response = await adminApi.get<ApiResponse<any>>('/admin/news/stats');
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching news stats:', error);
    throw new Error('Failed to load news statistics. Please try again later.');
  }
};

/**
 * Bulk operations for admin news management
 */
export const bulkUpdateNewsArticles = async (
  articleIds: string[],
  updates: Partial<AdminNewsArticle>
): Promise<void> => {
  try {
    await adminApi.patch('/admin/news/bulk', {
      articleIds,
      updates
    });
  } catch (error) {
    console.error('Error performing bulk update:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to perform bulk update. Please try again later.');
  }
};

/**
 * Duplicate news article
 */
export const duplicateNewsArticle = async (id: string): Promise<AdminNewsArticle> => {
  try {
    const response = await adminApi.post<ApiResponse<AdminNewsArticle>>(`/admin/news/${id}/duplicate`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error duplicating news article:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to duplicate article. Please try again later.');
  }
};

/**
 * Export news articles data
 */
export const exportNewsArticles = async (
  format: 'csv' | 'excel' | 'pdf',
  filters?: {
    categoryId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters) {
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
    }
    
    const response = await adminApi.get(`/admin/news/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error exporting news articles:', error);
    throw new Error('Failed to export articles. Please try again later.');
  }
}; 