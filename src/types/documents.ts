// src/types/documents.ts
export interface LegalDocument {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  document_type: string;
  document_field?: string; // Lĩnh vực
  issuing_agency?: string; // Cơ quan ban hành
  issuing_level?: string; // Cấp ban hành
  document_number?: string; // Số văn bản
  issued_date?: string; // Date string in YYYY-MM-DD format
  effective_date?: string; // Ngày có hiệu lực  
  created_at: string; // ISO 8601 string
  updated_at?: string; // ISO 8601 string
}

// Interface for admin form
export interface DocumentFormData {
  title: string;
  description?: string;
  document_type: string;
  document_field?: string;
  issuing_agency?: string;
  issuing_level?: string;
  document_number?: string;
  issued_date?: string;
  effective_date?: string;
  file?: File;
}

// Props interfaces for components
export interface DocumentListProps {
  documents: LegalDocument[];
  isLoading: boolean;
  onEdit: (document: LegalDocument) => void;
  onDelete: (document: LegalDocument) => void;
}

// API Response interfaces
export interface DocumentsApiResponse {
  status: string;
  data: LegalDocument[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface DocumentApiResponse {
  status: string;
  data: LegalDocument;
  message?: string;
}

// Constants for document types
export const DOCUMENT_TYPES = [
  'Nghị định',
  'Thông tư', 
  'Quyết định',
  'Chỉ thị',
  'Thông báo',
  'Hướng dẫn'
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number]; 