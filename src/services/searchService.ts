import axios from 'axios';
import { NewsArticle } from '@/types/news';

// API Base URL
const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search result interface
export interface SearchResult {
  type: 'news' | 'document';
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  imageUrl?: string;
  publishDate?: string;
  category?: {
    id: string;
    slug: string;
    name: string;
    nameEn?: string;
  };
  url: string;
}

// Search response interface
export interface SearchResponse {
  results: SearchResult[];
  query: string;
  type: string;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  resultsPerPage: number;
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
  if (response.status === 'error' || response.success === false) {
    throw new Error(response.message || 'API Error');
  }
  
  let data = response.data || response;
  
  if (data === null || data === undefined) {
    return data;
  }
  
  return data;
};

// Add request/response interceptors for logging and error handling
api.interceptors.request.use(
  (config) => {
    console.log(`[Search API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Search API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[Search API Response] ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('[Search API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

/**
 * Perform global search across all content types
 */
export const performSearch = async (
  query: string,
  type: 'all' | 'news' | 'documents' = 'all',
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }
    
    const params = new URLSearchParams();
    params.append('q', query.trim());
    params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get<ApiResponse<SearchResponse>>(`/search?${params.toString()}`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.error('Error performing search:', error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to perform search. Please try again later.');
  }
};

/**
 * Search specifically in news articles
 */
export const searchNews = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  return performSearch(query, 'news', page, limit);
};

/**
 * Search specifically in documents
 */
export const searchDocuments = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SearchResponse> => {
  return performSearch(query, 'documents', page, limit);
};

/**
 * Get search suggestions based on partial query
 */
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    // For now, we'll return empty suggestions
    // This can be enhanced later with a dedicated suggestions endpoint
    return [];
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

export default {
  performSearch,
  searchNews,
  searchDocuments,
  getSearchSuggestions,
}; 