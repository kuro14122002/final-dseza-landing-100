# Wireframes và Mockups - DSEZA Landing Page

## Tổng quan

Dự án này bao gồm wireframes chi tiết và mockups UI cho cổng thông tin đầu tư "danang-invest-hub-online" của Ban Quản lý Khu công nghệ cao và các KCN Đà Nẵng (DSEZA).

## Cấu trúc thư mục

```
docs/
├── wireframes/
│   ├── homepage-wireframe.md      # Wireframe chi tiết trang chủ (Desktop & Mobile)
│   └── subpages-wireframe.md      # Wireframe các trang con và luồng tương tác
└── mockups/
    ├── homepage-desktop-mockup.html   # Mockup HTML trang chủ Desktop
    └── mobile-homepage-mockup.html    # Mockup HTML trang chủ Mobile
```

## 1. Wireframes

### 1.1 Homepage Wireframe (homepage-wireframe.md)

**Desktop Layout:**
- TopBar với glassmorphism effect
- NavigationBar sticky với logo và search
- Hero Section với SocialBar, Main Content, và ImageTabs
- 12 sections chính theo PRD
- Responsive grid layouts

**Mobile Layout:**
- Fixed header với menu hamburger
- Touch-friendly components
- Horizontal scroll carousels
- Accordion-style footer

### 1.2 Subpages Wireframe (subpages-wireframe.md)

Bao gồm wireframes cho:
- Trang Chi tiết Tin tức/Sự kiện
- Trang Danh sách (News/Events/Documents)
- Trang Chi tiết Khu công nghiệp
- Trang Liên hệ
- Trang Sitemap
- Trang Kết quả Tìm kiếm

**Luồng tương tác:**
- Luồng tìm kiếm với auto-suggest
- Chuyển đổi ngôn ngữ (VIE/ENG)
- Chuyển đổi theme (Light/Dark)
- Mega menu navigation
- Mobile menu interactions

## 2. Mockups UI

### 2.1 Desktop Mockup (homepage-desktop-mockup.html)

**Đặc điểm:**
- Sử dụng Tailwind CSS với custom DSEZA colors
- Font: Montserrat (headings) + Inter (body)
- Màu sắc chính:
  - Primary: #416628
  - Secondary: #F2F2F2
  - Accent: #6B8E23
- Glassmorphism cho navigation
- Hover effects và transitions
- Grid layouts responsive

**Sections đã implement:**
1. TopBar với social links và contact info
2. NavigationBar với logo và search
3. Hero Section với background image và CTAs
4. Quick Access Buttons (5 columns)
5. Featured Events (asymmetric grid)
6. News Section với category filters
7. Functional Zones với zone selector
8. Investment Information carousel
9. Location với VR Tour/Map tabs
10. Resources gallery
11. Business Partners carousel
12. Footer multi-column

### 2.2 Mobile Mockup (mobile-homepage-mockup.html)

**Đặc điểm:**
- Optimized cho màn hình < 768px
- Touch-friendly với minimum 44px tap targets
- Horizontal scroll carousels
- Collapsed navigation với sheet menu
- Simplified layouts
- Sticky header

**Components mobile-specific:**
- Mobile header với burger menu
- Touch carousels cho Quick Access
- Stacked news cards
- Single column layouts
- Accordion footer

## 3. Hướng dẫn sử dụng

### Xem Mockups:

1. **Desktop Mockup:**
   ```bash
   # Mở file trong browser
   open docs/mockups/homepage-desktop-mockup.html
   ```

2. **Mobile Mockup:**
   ```bash
   # Mở file trong browser
   open docs/mockups/mobile-homepage-mockup.html
   # Hoặc sử dụng Chrome DevTools để xem ở kích thước mobile
   ```

### Tùy chỉnh:

1. **Thay đổi màu sắc:**
   - Chỉnh sửa object `colors.dseza` trong Tailwind config
   - Áp dụng dark mode bằng cách thêm class "dark" vào `<html>`

2. **Thay đổi font:**
   - Update Google Fonts link
   - Chỉnh sửa `fontFamily` trong Tailwind config

3. **Thêm animations:**
   - Sử dụng Tailwind animations hoặc custom CSS
   - Tham khảo phần keyframes trong mockup files

## 4. Next Steps

### Development:
1. Convert HTML mockups sang React components
2. Integrate với data từ API/CMS
3. Implement interactive features
4. Add page routing
5. Optimize performance

### Design:
1. Hoàn thiện mockups cho các trang con
2. Design system documentation
3. Dark mode variations
4. Micro-interactions
5. Loading states

### Testing:
1. Cross-browser testing
2. Responsive testing trên devices thật
3. Accessibility audit
4. Performance testing
5. User testing

## 5. Lưu ý kỹ thuật

- Mockups sử dụng CDN Tailwind CSS cho demo nhanh
- Production nên sử dụng Tailwind CSS build để optimize
- Images sử dụng placeholder, cần replace với assets thật
- Một số features (search, menu toggle) chỉ là visual, chưa có JS
- Cần thêm ARIA labels cho accessibility

## 6. Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [DSEZA Style Guide](../style-guide.md) (cần tạo)
- [Component Library](../components/) (existing)
- [PRD Document](../Product%20Requirements%20Document%20(PRD)%20Sơ%20Bộ.md) 