// src/types/news.ts
export interface NewsArticle {
  id: string;
  slug: string; // Thêm slug để tạo URL chi tiết
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  imageUrl: string;
  publishDate: string; // Sử dụng string ISO 8601
  category: NewsCategory; // Tham chiếu đến interface NewsCategory
  readingTime?: string; // Thời gian đọc ước tính
  readingTimeEn?: string;
  content?: string; // Nội dung chi tiết (có thể tải sau)
  contentEn?: string;
  isFeatured?: boolean; // Để xác định tin nổi bật
}

export interface NewsCategory {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
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