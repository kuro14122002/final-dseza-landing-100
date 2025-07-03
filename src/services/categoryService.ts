import { 
  Category, 
  CategoryFormData, 
  CategoryFilters, 
  CategoriesApiResponse, 
  CategoryApiResponse, 
  CategoryType,
  DOCUMENT_FIELD_CATEGORIES,
  ISSUING_AGENCY_CATEGORIES,
  ISSUING_LEVEL_CATEGORIES
} from '@/types/categories';

// Mock data generator
const generateMockCategories = (): Category[] => {
  const categories: Category[] = [];
  let idCounter = 1;

  // Document Field Categories
  DOCUMENT_FIELD_CATEGORIES.forEach((name, index) => {
    categories.push({
      id: idCounter++,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'document_field',
      order: index + 1,
      isActive: true,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  });

  // Issuing Agency Categories
  ISSUING_AGENCY_CATEGORIES.forEach((name, index) => {
    categories.push({
      id: idCounter++,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'issuing_agency',
      order: index + 1,
      isActive: true,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  });

  // Issuing Level Categories
  ISSUING_LEVEL_CATEGORIES.forEach((name, index) => {
    categories.push({
      id: idCounter++,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'issuing_level',
      order: index + 1,
      isActive: true,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  });

  // News Categories
  const newsCategories = [
    'Tin tức chung',
    'Thông báo',
    'Sự kiện',
    'Chính sách mới',
    'Hoạt động đầu tư',
    'Thành tựu',
    'Hợp tác quốc tế'
  ];

  newsCategories.forEach((name, index) => {
    categories.push({
      id: idCounter++,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'news_category',
      order: index + 1,
      isActive: true,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  });

  // Slideshow Location Categories
  const slideshowLocations = [
    'Trang chủ - Hero Banner',
    'Trang chủ - Tin nổi bật', 
    'Trang chủ - Thành tựu',
    'Trang tin tức - Header',
    'Trang đầu tư - Banner',
    'Trang liên hệ - Gallery'
  ];

  slideshowLocations.forEach((name, index) => {
    categories.push({
      id: idCounter++,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'slideshow_location',
      order: index + 1,
      isActive: true,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    });
  });

  return categories;
};

// Store mock data
let mockCategories = generateMockCategories();

// API delay simulation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions
export const fetchCategories = async (filters?: CategoryFilters): Promise<CategoriesApiResponse> => {
  await delay(Math.random() * 1000 + 500);

  let filteredCategories = [...mockCategories];

  // Apply filters
  if (filters?.type) {
    filteredCategories = filteredCategories.filter(cat => cat.type === filters.type);
  }

  if (filters?.isActive !== undefined) {
    filteredCategories = filteredCategories.filter(cat => cat.isActive === filters.isActive);
  }

  if (filters?.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredCategories = filteredCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'order';
  const sortDirection = filters?.sortDirection || 'ASC';

  filteredCategories.sort((a, b) => {
    let aVal, bVal;
    switch(sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'created_at':
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
      default:
        aVal = a.order;
        bVal = b.order;
    }

    if (sortDirection === 'DESC') {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  return {
    status: 'success',
    data: paginatedCategories,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredCategories.length / limit),
      totalItems: filteredCategories.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < filteredCategories.length,
      hasPrevPage: page > 1,
    }
  };
};

export const fetchCategoryById = async (id: number): Promise<CategoryApiResponse> => {
  await delay(Math.random() * 500 + 200);

  const category = mockCategories.find(cat => cat.id === id);
  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  return {
    status: 'success',
    data: category
  };
};

export const createCategory = async (data: CategoryFormData): Promise<CategoryApiResponse> => {
  await delay(Math.random() * 1000 + 500);

  // Simulate validation
  if (!data.name.trim()) {
    throw new Error('Tên danh mục là bắt buộc');
  }

  // Check duplicate slug
  const existingCategory = mockCategories.find(cat => 
    cat.slug === data.slug && cat.type === data.type
  );
  if (existingCategory) {
    throw new Error('Slug đã tồn tại trong loại danh mục này');
  }

  const newCategory: Category = {
    id: Math.max(...mockCategories.map(cat => cat.id)) + 1,
    ...data,
    created_at: new Date().toISOString(),
  };

  mockCategories.push(newCategory);

  return {
    status: 'success',
    data: newCategory,
    message: 'Tạo danh mục thành công'
  };
};

export const updateCategory = async (id: number, data: CategoryFormData): Promise<CategoryApiResponse> => {
  await delay(Math.random() * 1000 + 500);

  const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Không tìm thấy danh mục');
  }

  // Check duplicate slug (excluding current category)
  const existingCategory = mockCategories.find(cat => 
    cat.slug === data.slug && cat.type === data.type && cat.id !== id
  );
  if (existingCategory) {
    throw new Error('Slug đã tồn tại trong loại danh mục này');
  }

  const updatedCategory: Category = {
    ...mockCategories[categoryIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  mockCategories[categoryIndex] = updatedCategory;

  return {
    status: 'success',
    data: updatedCategory,
    message: 'Cập nhật danh mục thành công'
  };
};

export const deleteCategory = async (id: number): Promise<{ status: string; message: string }> => {
  await delay(Math.random() * 500 + 200);

  const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Không tìm thấy danh mục');
  }

  mockCategories.splice(categoryIndex, 1);

  return {
    status: 'success',
    message: 'Xóa danh mục thành công'
  };
};

export const toggleCategoryStatus = async (id: number): Promise<CategoryApiResponse> => {
  await delay(Math.random() * 500 + 200);

  const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Không tìm thấy danh mục');
  }

  mockCategories[categoryIndex].isActive = !mockCategories[categoryIndex].isActive;
  mockCategories[categoryIndex].updated_at = new Date().toISOString();

  return {
    status: 'success',
    data: mockCategories[categoryIndex],
    message: `${mockCategories[categoryIndex].isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} danh mục thành công`
  };
};

// Utility function to get categories by type
export const getCategoriesByType = async (type: CategoryType): Promise<Category[]> => {
  const response = await fetchCategories({ type, isActive: true });
  return response.data;
};

// Generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalize Vietnamese characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd') // Replace đ/Đ with d
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}; 