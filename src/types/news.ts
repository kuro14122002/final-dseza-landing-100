// src/types/news.ts

// Basic news category interface
export interface NewsCategory {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Basic news article interface (for public consumption)
export interface NewsArticle {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  imageUrl: string;
  category: NewsCategory;
  author: string;
  authorEn?: string;
  readingTime: string;
  readingTimeEn?: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'pending';
  viewCount?: number;
  tags?: string;
  attachments?: NewsAttachment[];
}

// File attachment interface
export interface NewsAttachment {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  downloadCount?: number;
  uploadedAt: string;
  uploadedBy: string;
}

// Admin news article interface (with additional fields for management)
export interface AdminNewsArticle extends NewsArticle {
  createdBy: string;
  lastModifiedBy: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  seoKeywords?: string;
  seoKeywordsEn?: string;
  socialImageUrl?: string;
  socialTitle?: string;
  socialTitleEn?: string;
  socialDescription?: string;
  socialDescriptionEn?: string;
  scheduledPublishDate?: string;
  isLocked?: boolean;
  lockedBy?: string;
  lockedAt?: string;
  revisionCount?: number;
  lastRevisionAt?: string;
  totalComments?: number;
  totalShares?: number;
  analytics?: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgTimeOnPage: number;
    socialShares: number;
    downloadCount: number;
  };
  workflow?: {
    status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
    reviewedBy?: string;
    reviewedAt?: string;
    approvedBy?: string;
    approvedAt?: string;
    publishedBy?: string;
    publishedAt?: string;
    archivedBy?: string;
    archivedAt?: string;
    reviewNotes?: string;
  };
  metadata?: {
    wordCount: number;
    characterCount: number;
    paragraphCount: number;
    readabilityScore?: number;
    lastBackupAt?: string;
    autoSavedAt?: string;
  };
  attachments?: NewsAttachment[];
}

// News article status enum
export type NewsStatus = 'published' | 'draft' | 'pending' | 'archived';

// News article sorting options
export type NewsSortBy = 'publishDate' | 'createdAt' | 'updatedAt' | 'title' | 'viewCount' | 'author';
export type SortOrder = 'asc' | 'desc';

// News filters interface for admin
export interface NewsFilters {
  categoryId?: string;
  status?: NewsStatus;
  author?: string;
  isFeatured?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  tags?: string[];
  sortBy?: NewsSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

// News statistics interface
export interface NewsStatistics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  pendingArticles: number;
  archivedArticles: number;
  featuredArticles: number;
  totalViews: number;
  totalComments: number;
  totalShares: number;
  totalDownloads: number;
  avgReadingTime: number;
  topCategories: {
    category: NewsCategory;
    articleCount: number;
    totalViews: number;
  }[];
  topAuthors: {
    author: string;
    articleCount: number;
    totalViews: number;
  }[];
  recentActivity: {
    date: string;
    articlesPublished: number;
    totalViews: number;
    totalComments: number;
  }[];
}

// News form data interface
export interface NewsFormData {
  title: string;
  titleEn?: string;
  slug?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  categoryId: string;
  imageUrl?: string;
  status: NewsStatus;
  isFeatured?: boolean;
  publishDate?: string;
  scheduledPublishDate?: string;
  author: string;
  authorEn?: string;
  tags?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  seoKeywords?: string;
  seoKeywordsEn?: string;
  socialImageUrl?: string;
  socialTitle?: string;
  socialTitleEn?: string;
  socialDescription?: string;
  socialDescriptionEn?: string;
  attachments?: NewsAttachment[];
}

// Bulk operations interface
export interface NewsBulkOperation {
  operation: 'publish' | 'unpublish' | 'archive' | 'delete' | 'feature' | 'unfeature' | 'changeCategory';
  articleIds: string[];
  data?: {
    categoryId?: string;
    status?: NewsStatus;
    isFeatured?: boolean;
    [key: string]: any;
  };
}

// News export options
export interface NewsExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filters?: NewsFilters;
  fields?: string[];
  includeContent?: boolean;
  includeAttachments?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Props interfaces for components
export interface NewsSectionProps {
  featuredArticle: NewsArticle | null;
  regularNews: NewsArticle[];
  categories: NewsCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading: boolean;
}

export interface MobileNewsSectionProps {
  newsArticles: NewsArticle[]; // Có thể là danh sách tin theo category đã chọn
  categories: NewsCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading: boolean;
} 