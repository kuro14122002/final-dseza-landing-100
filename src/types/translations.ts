export interface Translation {
  id: number;
  key: string;
  vietnamese: string;
  english: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranslationCategory {
  id: string;
  name: string;
  description?: string;
}

export interface TranslationFormData {
  key: string;
  vietnamese: string;
  english: string;
  category: string;
  description?: string;
  is_active: boolean;
}

export interface CreateTranslationRequest {
  key: string;
  vietnamese: string;
  english: string;
  category: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateTranslationRequest extends CreateTranslationRequest {
  id: number;
}

export interface TranslationResponse {
  id: number;
  key: string;
  vietnamese: string;
  english: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranslationsListResponse {
  translations: Translation[];
  total: number;
  page: number;
  limit: number;
  categories: TranslationCategory[];
} 