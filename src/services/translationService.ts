import { 
  Translation, 
  TranslationFormData, 
  TranslationsListResponse,
  CreateTranslationRequest,
  UpdateTranslationRequest 
} from '@/types/translations';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/final-dseza-landing-85/api';

// Get all translations with pagination and filtering
export const getTranslations = async (
  page = 1, 
  limit = 20, 
  category?: string, 
  search?: string
): Promise<TranslationsListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  
  try {
    const response = await fetch(`${API_BASE_URL}/translations?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`HTTP ${response.status}: Failed to fetch translations`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('API returned non-JSON response');
    }
    
    const responseData = await response.json();
    // Handle API response structure (status, data wrapper)
    if (responseData.status === 'success' && responseData.data) {
      return responseData.data;
    }
    return responseData;
  } catch (error) {
    console.error('getTranslations error:', error);
    throw error;
  }
};

// Get single translation by ID
export const getTranslation = async (id: number): Promise<Translation> => {
  const response = await fetch(`${API_BASE_URL}/translations/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch translation');
  }
  
  const responseData = await response.json();
  if (responseData.status === 'success' && responseData.data) {
    return responseData.data;
  }
  return responseData;
};

// Create new translation
export const createTranslation = async (data: CreateTranslationRequest): Promise<Translation> => {
  const response = await fetch(`${API_BASE_URL}/translations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create translation');
  }
  
  const responseData = await response.json();
  if (responseData.status === 'success' && responseData.data) {
    return responseData.data;
  }
  return responseData;
};

// Update translation
export const updateTranslation = async (id: number, data: UpdateTranslationRequest): Promise<Translation> => {
  const response = await fetch(`${API_BASE_URL}/translations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, id }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update translation');
  }
  
  const responseData = await response.json();
  if (responseData.status === 'success' && responseData.data) {
    return responseData.data;
  }
  return responseData;
};

// Delete translation
export const deleteTranslation = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/translations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete translation');
  }
};

// Bulk import translations
export const importTranslations = async (file: File): Promise<{ success: number; errors: string[] }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/translations/import`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to import translations');
  }
  
  const responseData = await response.json();
  if (responseData.status === 'success' && responseData.data) {
    return responseData.data;
  }
  return responseData;
};

// Export translations to JSON
export const exportTranslations = async (category?: string): Promise<Blob> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  
  const response = await fetch(`${API_BASE_URL}/translations/export?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to export translations');
  }
  
  return response.blob();
};

// Sync translations with frontend translation files
export const syncTranslations = async (): Promise<{ updated: number; added: number }> => {
  const response = await fetch(`${API_BASE_URL}/translations/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to sync translations');
  }
  
  const responseData = await response.json();
  if (responseData.status === 'success' && responseData.data) {
    return responseData.data;
  }
  return responseData;
}; 