import { LegalDocument, DocumentFormData, DocumentsApiResponse, DocumentApiResponse } from '@/types/documents';

const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api/v1/admin/documents';

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create headers with authentication
const createHeaders = (isFormData = false): HeadersInit => {
  const headers: HeadersInit = {};
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

// Fetch all documents with pagination and filtering
export const fetchDocuments = async (params: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  documentType?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
} = {}): Promise<DocumentsApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params.documentType) queryParams.append('documentType', params.documentType);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  
  const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: createHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Fetch single document by ID
export const fetchDocumentById = async (id: number): Promise<DocumentApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: createHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Create new document
export const createDocument = async (data: DocumentFormData): Promise<DocumentApiResponse> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  formData.append('document_type', data.document_type);
  if (data.issued_date) formData.append('issued_date', data.issued_date);
  if (data.file) formData.append('file', data.file);
  
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: createHeaders(true), // Don't set Content-Type for FormData
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Update document
export const updateDocument = async (id: number, data: DocumentFormData): Promise<DocumentApiResponse> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  formData.append('document_type', data.document_type);
  if (data.issued_date) formData.append('issued_date', data.issued_date);
  if (data.file) formData.append('file', data.file);
  
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: createHeaders(true),
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Delete document
export const deleteDocument = async (id: number): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: createHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}; 