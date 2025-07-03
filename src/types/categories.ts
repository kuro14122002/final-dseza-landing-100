// src/types/categories.ts

// Base Category interface
export interface Category {
  id: number;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: number;
  order: number;
  isActive: boolean;
  created_at: string;
  updated_at?: string;
}

// Category types for different purposes
export const CATEGORY_TYPES = [
  'document_field',         // Lĩnh vực văn bản
  'issuing_agency',        // Cơ quan ban hành
  'issuing_level',         // Cấp ban hành
  'news_category',         // Danh mục tin tức
  'slideshow_location'     // Vị trí slideshow
] as const;

export type CategoryType = typeof CATEGORY_TYPES[number];

// Form data for creating/updating categories
export interface CategoryFormData {
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: number;
  order: number;
  isActive: boolean;
}

// API Request interfaces
export interface CategoryFilters {
  type?: CategoryType;
  parentId?: number;
  isActive?: boolean;
  searchTerm?: string;
  sortBy?: 'name' | 'order' | 'created_at';
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// API Response interfaces
export interface CategoriesApiResponse {
  status: string;
  data: Category[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CategoryApiResponse {
  status: string;
  data: Category;
  message?: string;
}

// Category tree structure for hierarchical display
export interface CategoryTreeNode extends Category {
  children?: CategoryTreeNode[];
  level: number;
}

// Constants for predefined categories
export const DOCUMENT_FIELD_CATEGORIES = [
  'Đầu tư',
  'Quy hoạch',
  'Xây dựng',
  'Môi trường',
  'Thuế',
  'Hải quan',
  'Lao động',
  'Tài chính',
  'Pháp luật',
  'Hành chính'
] as const;

export const ISSUING_AGENCY_CATEGORIES = [
  'Chính phủ',
  'Thủ tướng Chính phủ',
  'Bộ Kế hoạch và Đầu tư',
  'Bộ Tài chính',
  'Bộ Xây dựng',
  'Bộ Tài nguyên và Môi trường',
  'UBND Thành phố Đà Nẵng',
  'Ban Quản lý KCNC Đà Nẵng',
  'Sở Kế hoạch và Đầu tư TP. Đà Nẵng'
] as const;

export const ISSUING_LEVEL_CATEGORIES = [
  'Trung ương',
  'Tỉnh/Thành phố',
  'Quận/Huyện',
  'Phường/Xã',
  'Khu Công nghệ cao'
] as const;

export type DocumentFieldCategory = typeof DOCUMENT_FIELD_CATEGORIES[number];
export type IssuingAgencyCategory = typeof ISSUING_AGENCY_CATEGORIES[number];
export type IssuingLevelCategory = typeof ISSUING_LEVEL_CATEGORIES[number];

// Component Props interfaces
export interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

export interface CategoryFormProps {
  category?: Category;
  categoryType: CategoryType;
  isLoading: boolean;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

export interface CategorySelectProps {
  categoryType: CategoryType;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowEmpty?: boolean;
} 