# Wireframe Chi Tiết - Trang Chủ (Homepage)

## Desktop Layout

### 1. TopBar (Fixed top)
- **Cấu trúc**: Thanh ngang full-width, height: 40px
- **Bố cục**: Flexbox với 3 phần
  - Trái: Links mạng xã hội (icons)
  - Giữa: Thông tin liên hệ (email, phone)
  - Phải: Language switcher (VIE/ENG) + Theme toggle (☀️/🌙)
- **Hiệu ứng**: Glassmorphism background

### 2. NavigationBar (Sticky sau TopBar)
- **Cấu trúc**: Container max-width với padding
- **Bố cục**: 
  - Trái: Logo DSEZA + SearchBar (width: 300px)
  - Phải: Menu items ngang (7-8 items)
- **Tương tác**: 
  - Hover menu item → Mega menu dropdown
  - Search bar có icon và placeholder text

### 3. Hero Section
- **Container**: Full-width, height: 80vh
- **Layout Grid**: 
  ```
  [SocialBar] [Main Content Area] [ImageTabs]
     60px          flex-1             300px
  ```
- **Main Content**:
  - Background: Large image/video với overlay gradient
  - Content overlay:
    - H1 Title (font-size: 48px, Montserrat)
    - Subtitle text (font-size: 20px, Inter)
    - CTA Buttons group (2-3 buttons)
  - Bottom: Image carousel indicators

### 4. Quick Access Buttons
- **Container**: Max-width với padding-y: 80px
- **Grid**: 5 columns, gap: 20px
- **Card structure**:
  ```
  [Icon]
  [Title]
  [Description]
  ```
- **Hover**: Scale 1.05 + shadow effect

### 5. Featured Events
- **Layout**: Asymmetric grid
  ```
  [Main Event - 60%] [Sub Events - 40%]
                     [Event 2]
                     [Event 3]
  ```
- **Event Card**:
  - Image background với overlay
  - Date badge (top-right)
  - Title + short description
  - "Xem thêm" link

### 6. News Section
- **Header**: Section title + Category filter tabs
- **Layout**: 
  ```
  [Main News - 50%] [Side News - 50%]
                    [News 2]
                    [News 3]
                    [News 4]
  ```
- **News Card**: Image thumbnail + Title + Date + Category tag

### 7. Functional Zones
- **Layout**: Split view
  ```
  [Zone Details - 70%] [Zone Selector - 30%]
  ```
- **Zone Details**: 
  - Large image/map
  - Zone info (name, area, occupancy)
  - Description text
- **Zone Selector**: Grid of zone thumbnails

### 8. Investment Information
- **Tab Navigation**: 2 main tabs
- **Content**: Horizontal carousel of info cards
- **Card**: Icon + Title + Description + Link

### 9. Location Section
- **Layout**: 2 columns
  ```
  [Tab Selector] [Content Display]
      30%             70%
  ```
- **Tabs**: VR Tour | Digital Map
- **Content**: Interactive map or VR viewer

### 10. Resources
- **Tab Bar**: Images | Videos | Documents
- **Content Grid**: 3-4 columns
- **Item**: Thumbnail + Title + Meta info

### 11. Businesses & Partners
- **Layout**: Infinite scroll carousel
- **Content**: Logo images với consistent height

### 12. Footer
- **Layout**: 4 columns + bottom bar
  ```
  [About] [Quick Links] [Contact] [Map]
  [Copyright Bar]
  ```

---

## Mobile Layout (< 768px)

### 1. Mobile Header (Fixed)
- **Top Bar**: 
  - Logo (left) + Menu burger (right)
  - Height: 60px
- **Collapsed**: Show search icon + language/theme toggles

### 2. Mobile Menu (Sheet overlay)
- **Trigger**: Hamburger menu
- **Content**: 
  - Search bar (top)
  - Vertical menu list với collapsible sub-items
  - Language/Theme toggles (bottom)

### 3. Mobile Hero
- **Height**: 70vh
- **Layout**:
  ```
  [Image Carousel]
  [Thumbnail Row]
  [Title/CTA]
  ```
- **Swipeable**: Touch gestures for image change

### 4. Mobile Quick Access
- **Layout**: Horizontal scroll carousel
- **Cards**: Smaller, 2.5 visible at once

### 5. Mobile Featured Events
- **Layout**: Vertical stack
- **Card**: Full-width với aspect ratio 16:9

### 6. Mobile News
- **Tab bar**: Horizontal scroll
- **Content**: Vertical list của news cards

### 7. Mobile Functional Zones
- **Layout**: Carousel với 1 zone per view
- **Navigation**: Dots indicator

### 8. Mobile Investment Info
- **Tabs**: Full-width
- **Cards**: Vertical stack

### 9. Mobile Location
- **Tabs**: Top của section
- **Content**: Full-width below tabs

### 10. Mobile Resources
- **Same như desktop nhưng**:
- **Grid**: 2 columns thay vì 3-4

### 11. Mobile Businesses
- **Same carousel nhưng smaller logos**

### 12. Mobile Footer
- **Accordion sections** thay vì columns
- **Contact info**: Stacked vertical 