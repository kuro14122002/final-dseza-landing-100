# Wireframe Chi Tiết - Các Trang Con Chính

## 1. Trang Chi Tiết Tin Tức/Sự Kiện

### Desktop Layout
```
[TopBar]
[NavigationBar]
[Breadcrumb]
[Main Content Container]
  [Article Content - 70%] [Sidebar - 30%]
[Related News]
[Footer]
```

**Article Content**:
- Hero image (full-width, height: 400px)
- Category badge + Reading time
- H1 Title (font-size: 36px)
- Meta info: Author | Date | Share buttons
- Article body với:
  - Paragraphs (font-size: 16px, line-height: 1.8)
  - H2/H3 subheadings
  - Inline images với captions
  - Blockquotes
  - Lists (ul/ol)

**Sidebar**:
- Sticky positioned
- Recent news list (5 items)
- Category tags cloud
- Newsletter signup box

**Related News**:
- Section title
- Grid 3 columns của news cards

### Mobile Layout
- Single column
- Hero image (aspect ratio 16:9)
- Meta info stacked
- No sidebar (content moved to bottom)
- Related news: Vertical stack

## 2. Trang Danh Sách (News/Events/Documents)

### Desktop Layout
```
[Header với page title + description]
[Filter Bar]
  [Search] [Category Dropdown] [Date Range] [Sort By]
[Results Grid]
  [Item] [Item] [Item]
  [Item] [Item] [Item]
[Pagination]
```

**Filter Bar**:
- Sticky below navigation
- Horizontal layout các filter controls
- Active filters hiển thị như tags

**Item Card** (News/Event):
- Thumbnail image (aspect 16:9)
- Category tag
- Title (2 lines max)
- Excerpt (3 lines max)
- Date + Read more link

**Item Card** (Document):
- File type icon
- Title
- File size + Upload date
- Download button

**Pagination**:
- Page numbers + Previous/Next
- Items per page selector

### Mobile Layout
- Filter bar: Collapsible accordion
- Grid: Single column
- Sticky "Filter" button khi scroll

## 3. Trang Chi Tiết Khu Công Nghiệp/Khu Chức Năng

### Desktop Layout
```
[Hero Banner với tên khu]
[Tab Navigation]
  [Tổng quan] [Hạ tầng] [Ưu đãi] [Doanh nghiệp] [Liên hệ]
[Tab Content Area]
```

**Tab: Tổng quan**:
- 2 columns layout:
  - Left: Description text + Key features list
  - Right: Image gallery/slider

**Tab: Hạ tầng**:
- Infrastructure specs table
- Utilities icons grid
- Transportation access map

**Tab: Ưu đãi**:
- Investment incentives cards
- Tax benefits timeline
- Support services list

**Tab: Doanh nghiệp**:
- Statistics cards (số lượng, ngành nghề)
- Company logos grid
- Success stories carousel

**Tab: Liên hệ**:
- Contact form (50%)
- Contact info + Map (50%)

### Mobile Layout
- Tabs: Horizontal scroll
- Content: Single column
- Gallery: Full-width slider
- Tables: Horizontal scroll

## 4. Trang Liên Hệ

### Desktop Layout
```
[Page Header]
[Contact Content]
  [Contact Form - 60%] [Contact Info - 40%]
[Google Maps - Full Width]
[Office Locations Grid]
```

**Contact Form**:
- Input fields:
  - Họ tên*
  - Email*
  - Số điện thoại
  - Công ty
  - Chủ đề*
  - Nội dung* (textarea)
- Captcha
- Submit button

**Contact Info**:
- Office address với icon
- Phone numbers (hotline prominently)
- Email addresses
- Working hours
- Social media links

**Office Locations**:
- Cards grid (3 columns)
- Each card: Name, Address, Phone, "Xem bản đồ"

### Mobile Layout
- Form và Info stacked
- Map height: 300px
- Locations: Single column

## 5. Trang Sitemap

### Desktop Layout
```
[Page Title]
[Search Bar]
[Sitemap Tree]
  [Main Category]
    [Subcategory]
      [Page Link]
      [Page Link]
    [Subcategory]
  [Main Category]
```

**Tree Structure**:
- Collapsible/Expandable nodes
- Icons cho different page types
- Indent levels với connecting lines
- Hover: Highlight full path

### Mobile Layout
- Same structure nhưng:
- Larger tap targets
- Full-width items
- Deeper indent cho readability

## 6. Trang Kết Quả Tìm Kiếm

### Desktop Layout
```
[Search Header]
  [Search Box với keyword] [Search Button]
  "Tìm thấy X kết quả cho 'keyword'"
[Filter Sidebar - 25%] [Results - 75%]
```

**Filter Sidebar**:
- Content type checkboxes
- Date range picker
- Category filter
- Clear filters button

**Search Result Item**:
- Page type badge
- Title (highlighted matching text)
- URL breadcrumb
- Excerpt với highlighted keywords
- Meta info (date, author nếu có)

**No Results State**:
- Message + Suggestions
- Popular searches
- Browse by category links

### Mobile Layout
- Filters: Collapsible panel
- Results: Full-width
- Load more button thay vì pagination

## 7. Wireframe Các Luồng Tương Tác

### Luồng Tìm Kiếm
1. **Trigger**: Click search icon hoặc focus search input
2. **Search Dropdown** (khi typing):
   - Recent searches (nếu có)
   - Suggested results (realtime)
   - "Xem tất cả kết quả" link
3. **Submit**: Navigate to search results page
4. **Results Page**: Apply filters → Update results (AJAX)

### Luồng Chuyển Đổi Ngôn Ngữ
1. **Current State**: Hiển thị "VIE" hoặc "ENG"
2. **Click**: Toggle immediately
3. **Effect**: 
   - Update UI text labels
   - Reload content trong ngôn ngữ mới
   - Persist choice (localStorage)
   - Update URL nếu cần

### Luồng Chuyển Theme
1. **Icons**: ☀️ (light) | 🌙 (dark)
2. **Click**: Toggle theme class on <html>
3. **Transition**: Smooth color transitions (200ms)
4. **Persist**: Save to localStorage

### Luồng Mega Menu (Desktop)
1. **Hover on menu item**: 
   - Delay 200ms
   - Slide down mega menu
   - Darken overlay on page
2. **Mouse leave**:
   - Delay 300ms
   - Slide up menu
3. **Content Structure**:
   ```
   [Category Title]
   - Submenu Link
   - Submenu Link
   [Featured Content]
   ```

### Luồng Mobile Menu
1. **Tap hamburger**: Sheet slides từ right
2. **Menu structure**:
   - Search bar (sticky top)
   - Menu items với arrow cho subitems
   - Tap arrow: Expand/collapse submenu
   - Tap item: Navigate và close menu
3. **Close**: Tap X hoặc backdrop
4. **Gesture**: Swipe right để close 