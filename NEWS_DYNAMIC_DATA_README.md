# Hoàn Thiện Dữ Liệu Động và Tích Hợp API cho NewsSection và MobileNewsSection

## Tổng Quan

Dự án đã được cập nhật để hỗ trợ hiển thị tin tức một cách động từ API thay vì dữ liệu placeholder cố định. Cả desktop (`NewsSection.tsx`) và mobile (`MobileNewsSection.tsx`) components đều đã được refactor để nhận dữ liệu qua props và hiển thị trạng thái loading.

## Những Gì Đã Hoàn Thành

### 1. Định Nghĩa TypeScript Interfaces

**File:** `src/types/news.ts`

```typescript
export interface NewsArticle {
  id: string;
  slug: string; // Để tạo URL chi tiết
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  imageUrl: string;
  publishDate: string; // ISO 8601 format
  category: NewsCategory;
  readingTime?: string;
  readingTimeEn?: string;
  content?: string; // Nội dung chi tiết
  contentEn?: string;
  isFeatured?: boolean; // Tin nổi bật
}

export interface NewsCategory {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
}

export interface NewsSectionProps {
  featuredArticle: NewsArticle | null;
  regularNews: NewsArticle[];
  categories: NewsCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading: boolean;
}

export interface MobileNewsSectionProps {
  newsArticles: NewsArticle[];
  categories: NewsCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading: boolean;
}
```

### 2. Service Layer cho API

**File:** `src/services/newsService.ts`

Các hàm placeholder để fetch dữ liệu:

- `fetchNewsCategories()`: Lấy danh sách categories
- `fetchNewsArticles(categoryId?, limit, featured?)`: Lấy danh sách bài viết
- `fetchFeaturedArticle()`: Lấy bài viết nổi bật
- `fetchRegularNews(categoryId?, limit)`: Lấy tin tức thường

**Mock Data:** Hiện tại sử dụng dữ liệu mẫu với delay 1s để giả lập API call.

### 3. Refactored Components

#### NewsSection.tsx (Desktop)
- ✅ Nhận dữ liệu qua props thay vì hardcode
- ✅ Hiển thị loading state với skeleton components
- ✅ Hỗ trợ đa ngôn ngữ (VN/EN)
- ✅ Tự động format ngày tháng
- ✅ Link động đến chi tiết bài viết (`/news/{slug}`)
- ✅ Link "Xem tất cả" đến category (`/news/category/{slug}`)

#### MobileNewsSection.tsx (Mobile)
- ✅ Nhận dữ liệu qua props
- ✅ Hiển thị loading state với skeleton
- ✅ Tabs navigation với shadcn/ui components
- ✅ Responsive design với grid layout
- ✅ Hỗ trợ đa ngôn ngữ
- ✅ Link động tương tự desktop

#### Index.tsx (Parent Component)
- ✅ State management cho news data
- ✅ Fetch dữ liệu từ service layer
- ✅ Handle category change events
- ✅ Truyền props xuống child components
- ✅ Khác biệt logic giữa desktop và mobile

### 4. Loading States

- **NewsCardSkeleton:** Skeleton cho từng news card
- **Responsive:** Skeleton adapt theo kích thước card (large/small)
- **Grid Support:** Hiển thị multiple skeletons trong grid layout

### 5. Translations Support

**Đã thêm vào `src/utils/translations.ts`:**

```typescript
news: {
  title: "TIN TỨC",
  subtitle: "Cập nhật thông tin mới nhất về hoạt động đầu tư và phát triển tại DSEZA",
  viewAll: "Xem tất cả", 
  noFeatured: "Không có tin nổi bật",
  noArticles: "Không có bài viết nào",
  // ... categories, detail, etc.
}
```

## Cách Sử Dụng

### 1. Thêm Bài Viết Mới

Cập nhật `mockArticles` trong `src/services/newsService.ts`:

```typescript
const newArticle: NewsArticle = {
  id: "unique-id",
  slug: "bai-viet-moi",
  title: "Tiêu đề bài viết",
  titleEn: "English Title",
  excerpt: "Tóm tắt ngắn...",
  excerptEn: "Short excerpt...",
  imageUrl: "https://example.com/image.jpg",
  publishDate: "2025-01-15T10:00:00Z",
  category: mockCategories[0], // Reference to category
  isFeatured: false,
  readingTime: "5 phút",
  readingTimeEn: "5 min"
};
```

### 2. Thêm Category Mới

Cập nhật `mockCategories` trong service:

```typescript
const newCategory: NewsCategory = {
  id: "new-category",
  slug: "danh-muc-moi", 
  name: "Danh Mục Mới",
  nameEn: "New Category"
};
```

### 3. Tích Hợp API Thật

Thay thế các hàm mock trong `newsService.ts`:

```typescript
export const fetchNewsArticles = async (
  categoryId?: string, 
  limit: number = 5, 
  featured?: boolean
): Promise<NewsArticle[]> => {
  const response = await fetch('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryId, limit, featured })
  });
  
  const data = await response.json();
  return data.articles;
};
```

## Routing URLs

Các URL pattern được sử dụng:

- **Chi tiết bài viết:** `/news/{article.slug}`
- **Danh mục:** `/news/category/{category.slug}`
- **Tất cả tin tức:** `/news/category/all`

**Lưu ý:** Các routes này cần được định nghĩa trong router config.

## Responsive Design

- **Desktop:** Featured article (2/3 width) + Regular articles sidebar (1/3 width)
- **Mobile:** 2-column grid với tabs navigation
- **Loading:** Skeleton components maintain layout structure

## Tối Ưu Performance

1. **Lazy Loading:** Images có `loading="lazy"`
2. **Parallel Fetching:** Sử dụng `Promise.all()` cho multiple API calls
3. **Error Handling:** Try-catch blocks với fallback states
4. **Memoization:** Consider useMemo cho expensive calculations

## Các Bước Tiếp Theo

### 1. Tích Hợp API Backend
- [ ] Thay thế mock service bằng real API endpoints
- [ ] Implement caching strategy (React Query/SWR)
- [ ] Add error boundary cho error handling

### 2. SEO & Performance
- [ ] Add meta tags cho news articles
- [ ] Implement image optimization
- [ ] Add pagination cho large lists

### 3. Advanced Features
- [ ] Search functionality
- [ ] Article bookmarking
- [ ] Social sharing
- [ ] Newsletter subscription

### 4. Routes Implementation
- [ ] Tạo NewsDetailPage component 
- [ ] Tạo CategoryPage component
- [ ] Update router config với dynamic routes

## Testing

Để test các changes:

```bash
npm run dev
```

1. Kiểm tra loading states khi page load
2. Test category switching
3. Verify responsive design trên different screen sizes
4. Check đa ngôn ngữ (VN/EN)

## Troubleshooting

**Lỗi TypeScript:** Đảm bảo all imports đều chính xác
**Loading không hiện:** Check isLoading state trong parent component  
**Data không update:** Verify service functions được called correctly
**Styling issues:** Check theme context và CSS classes

---

## Technical Stack

- **TypeScript:** Strict typing cho data structures
- **React Hooks:** useState, useEffect cho state management
- **shadcn/ui:** Skeleton, Tabs components
- **Tailwind CSS:** Styling với theme support
- **i18n:** Multi-language support với translation utilities

Dự án hiện đã sẵn sàng cho việc tích hợp API thật và có thể dễ dàng mở rộng với các tính năng mới. 