# Tích Hợp Dữ Liệu Động cho NewsDetailPage

## Tổng Quan

NewsDetailPage.tsx đã được hoàn toàn refactor để sử dụng dữ liệu động từ `newsService.ts` thay vì dữ liệu placeholder tĩnh. Component hiện hỗ trợ đầy đủ loading states, error handling, routing động theo slug, và responsive design.

## Những Gì Đã Hoàn Thành

### 1. Cập Nhật Service Layer

**File:** `src/services/newsService.ts`

**Các hàm mới được thêm:**

```typescript
// Lấy bài viết theo slug từ URL
export const fetchNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null>

// Lấy tin tức liên quan (cùng category, loại trừ bài hiện tại)
export const fetchRelatedNews = async (
  currentArticleSlug: string, 
  categoryId: string, 
  limit: number = 4
): Promise<NewsArticle[]>

// Lấy tin tức gần đây cho sidebar (loại trừ bài hiện tại)
export const fetchRecentNews = async (
  currentArticleSlug?: string, 
  limit: number = 5
): Promise<NewsArticle[]>
```

**Cập nhật Mock Data:**
- Thêm trường `content` và `contentEn` cho tất cả articles
- Nội dung HTML hoàn chỉnh với các thẻ semantic (h2, h3, ul, blockquote)
- Hỗ trợ đầy đủ đa ngôn ngữ cho mọi trường dữ liệu

### 2. Routing Configuration

**File:** `src/App.tsx`

```typescript
// Cập nhật routing để sử dụng slug thay vì articleId
<Route path="/news/:slug" element={<NewsDetailPage />} />
<Route path="/events/:slug" element={<NewsDetailPage />} />
```

### 3. Skeleton Components

**File:** `src/components/skeletons/NewsDetailPageSkeleton.tsx`

**Components được tạo:**
- `ArticleHeroSkeleton`: Skeleton cho hero image và metadata
- `ArticleBodySkeleton`: Skeleton cho nội dung bài viết
- `SidebarSkeleton`: Skeleton cho sidebar desktop
- `RelatedNewsSkeleton`: Skeleton cho section tin liên quan
- `NewsDetailPageSkeleton`: Skeleton tổng hợp cho toàn trang

### 4. NewsDetailPage Refactor

**File:** `src/pages/NewsDetailPage.tsx`

**State Management:**
```typescript
const [articleData, setArticleData] = useState<NewsArticle | null>(null);
const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
const [categories, setCategories] = useState<NewsCategory[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
```

**URL Parameter Handling:**
```typescript
const { slug } = useParams<{ slug: string }>();
```

**Data Fetching:**
- Fetch article theo slug từ URL
- Nếu article không tồn tại: hiển thị error state
- Parallel loading cho related data: `Promise.all()`
- Error handling với try-catch và fallback states

**Dynamic Content Display:**
- Breadcrumbs động: Home > News > Category > Article Title
- Content theo ngôn ngữ: `titleEn`, `contentEn`, `excerptEn`
- Date formatting với `formatDate()` utility
- Dynamic links: `/news/{slug}`, `/news/category/{categorySlug}`

### 5. Loading & Error States

**Loading State:**
- Toàn bộ trang hiển thị skeleton
- Skeleton components theo responsive design
- Maintain layout structure trong khi loading

**Error States:**
- **Article Not Found**: Hiển thị 404-style message với navigation options
- **Network Error**: Hiển thị error message với retry options
- **No Slug**: Handle trường hợp URL không có slug parameter

**Error UI Components:**
- Icon và typography nhất quán với design system
- Navigation buttons: "Quay lại" và "Trang tin tức"
- Responsive layout cho mobile và desktop

### 6. Responsive Design

**Desktop (>= lg):**
- Article content: 70% width
- Sidebar: 30% width, sticky positioning
- Related news: 4-column grid

**Mobile:**
- Single column layout
- Sidebar ẩn đi
- Related news: 1-column grid

### 7. Multi-language Support

**Dynamic Content:**
```typescript
const displayTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
const displayContent = language === 'en' && article.contentEn ? article.contentEn : article.content;
const displayCategory = language === 'en' && category.nameEn ? category.nameEn : category.name;
```

**Translation Keys Added:**
```typescript
news: {
  detail: {
    notFound: "Bài viết không tìm thấy",
    notFoundDesc: "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    error: "Có lỗi xảy ra",
    errorDesc: "Không thể tải nội dung bài viết. Vui lòng thử lại sau.",
    author: "Tác giả",
    // ... other keys
  }
},
common: {
  goBack: "Quay lại",
  loading: "Đang tải...",
  // ... other common keys
}
```

### 8. Theme Support

**Dark/Light Mode:**
- Skeleton components adapt theo theme
- Error states với theme-appropriate colors
- Content prose styling theo theme context
- CSS custom properties cho typography colors

## Cách Sử Dụng

### 1. Navigation từ NewsSections

Tất cả links trong `NewsSection.tsx` và `MobileNewsSection.tsx` đã được cập nhật:

```typescript
<a href={`/news/${article.slug}`}>
```

### 2. URL Structure

```
/news/dseza-thu-hut-fdi-100-trieu-usd
/news/hoi-thao-xuc-tien-dau-tu-singapore
/news/da-nang-nang-cao-nang-luc-canh-tranh
```

### 3. Breadcrumb Navigation

```
Home > Tin tức > Đầu tư – Hợp tác quốc tế > Article Title
```

Mỗi breadcrumb level đều có link functional:
- Home: `/`
- Tin tức: `/news`
- Category: `/news/category/{categorySlug}`

### 4. Sidebar Links (Desktop)

**Recent News:**
- Link đến: `/news/{articleSlug}`

**Category Tags:**
- Link đến: `/news/category/{categorySlug}`

### 5. Related News

- Cards link đến: `/news/{relatedArticleSlug}`
- Cùng category với bài viết hiện tại
- Exclude bài viết đang đọc

## Testing URLs

Với mock data hiện tại, có thể test các URLs sau:

```
/news/dseza-thu-hut-fdi-100-trieu-usd
/news/hoi-thao-xuc-tien-dau-tu-singapore
/news/da-nang-nang-cao-nang-luc-canh-tranh
/news/khoi-dong-chuong-trinh-uom-tao-khoi-nghiep
/news/dseza-hop-tac-dh-fpt-dao-tao-nhan-luc
/news/trien-khai-he-thong-quan-ly-thong-minh
```

**Test Error States:**
```
/news/invalid-slug-that-doesnt-exist
/news/
```

## Performance Considerations

### 1. Parallel Data Fetching

```typescript
const [related, recent, categoriesData] = await Promise.all([
  fetchRelatedNews(slug, article.category.id, 4),
  fetchRecentNews(slug, 5),
  fetchNewsCategories()
]);
```

### 2. Lazy Loading

- Images có `loading="lazy"` attribute
- Component-level code splitting có thể implement later

### 3. Caching Strategy

Hiện tại sử dụng mock delay. Với real API:
- Consider React Query hoặc SWR cho caching
- Implement stale-while-revalidate patterns
- Local storage cho recently viewed articles

## Migration to Real API

### 1. Service Layer Update

Thay thế mock functions trong `newsService.ts`:

```typescript
export const fetchNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const response = await fetch(`/api/news/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch article');
  }
  return response.json();
};
```

### 2. Error Handling Enhancement

- Network errors vs 404 vs 500 errors
- Retry mechanisms
- Offline support

### 3. SEO Optimization

- Server-side rendering cho article content
- Meta tags dynamic theo article content
- Open Graph tags cho social sharing

## Troubleshooting

**1. Component không load:**
- Check browser console cho network errors
- Verify slug parameter trong URL
- Check newsService function implementations

**2. Styling issues:**
- Verify theme context provider
- Check CSS custom properties
- Test dark/light mode switches

**3. Responsive problems:**
- Test với different viewport sizes
- Check useIsMobile hook functionality
- Verify grid layouts và sticky positioning

**4. Translation missing:**
- Check translation keys trong translations.ts
- Verify language context provider
- Test language switching functionality

## Next Steps

### 1. Additional Features

- [ ] Share functionality implementation
- [ ] Print-friendly styling
- [ ] Reading progress indicator
- [ ] Article bookmarking
- [ ] Comments section
- [ ] Article rating/feedback

### 2. Performance Optimization

- [ ] Image optimization và lazy loading
- [ ] Code splitting cho large pages
- [ ] Service Worker cho offline reading
- [ ] Bundle size optimization

### 3. SEO & Analytics

- [ ] Meta tags và structured data
- [ ] Google Analytics integration
- [ ] Reading time tracking
- [ ] Page view analytics

### 4. Accessibility

- [ ] ARIA labels cho screen readers
- [ ] Keyboard navigation support
- [ ] High contrast mode support
- [ ] Voice-over testing

---

## Technical Stack

- **React 18** với Hooks
- **TypeScript** cho type safety
- **React Router** cho URL-based navigation
- **Tailwind CSS** cho styling
- **shadcn/ui** cho UI components
- **Lucide React** cho icons
- **Context API** cho theme và language state

NewsDetailPage hiện đã hoàn chỉnh với dynamic data integration và sẵn sàng cho production deployment! 