# Admin Layout Migration Script

## 🎯 Mục tiêu
Cập nhật tất cả các trang admin còn lại để sử dụng layout chuẩn đã tạo.

## ✅ Đã hoàn thành
- [x] AdminPageLayout component
- [x] AdminTableLayout component  
- [x] DashboardPage
- [x] AdminNewsFormPage

## 🔄 Danh sách cần cập nhật

### 1. AdminUserManagementPage.tsx
**Type**: Table Layout
**Breadcrumbs**: Quản trị hệ thống > Quản lý thành viên

```tsx
// 1. Import layouts
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AdminTableLayout from '@/components/admin/AdminTableLayout';

// 2. Thêm breadcrumbs
const breadcrumbs = [
  { label: 'Quản trị hệ thống', href: '/admin/dashboard' },
  { label: 'Quản lý thành viên' }
];

// 3. Filters config
const filters = [
  {
    label: 'Vai trò',
    value: selectedRole,
    onValueChange: setSelectedRole,
    options: [
      { label: 'Tất cả vai trò', value: 'all' },
      { label: 'Admin', value: 'admin' },
      { label: 'Biên tập viên', value: 'editor' },
      { label: 'Phóng viên', value: 'reporter' }
    ]
  },
  {
    label: 'Trạng thái',
    value: selectedStatus,
    onValueChange: setSelectedStatus,
    options: [
      { label: 'Tất cả trạng thái', value: 'all' },
      { label: 'Hoạt động', value: 'active' },
      { label: 'Không hoạt động', value: 'inactive' },
      { label: 'Đình chỉ', value: 'suspended' }
    ]
  }
];

// 4. Replace JSX structure
<AdminPageLayout
  title="Quản lý thành viên"
  description="Quản lý tài khoản người dùng và phân quyền"
  breadcrumbs={breadcrumbs}
  actions={
    <Button onClick={handleCreateUser}>
      <Plus className="h-4 w-4 mr-2" />
      Thêm người dùng
    </Button>
  }
>
  <AdminTableLayout
    searchValue={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Tìm kiếm người dùng..."
    filters={filters}
    totalItems={users.length}
    onRefresh={fetchUsers}
  >
    {/* Table content */}
  </AdminTableLayout>
</AdminPageLayout>
```

### 2. AdminCategoriesPage.tsx
**Type**: Table Layout
**Status**: Đã import, cần áp dụng

```tsx
// Đã import, cần thay thế structure:
const breadcrumbs = [
  { label: 'Quản trị hệ thống', href: '/admin/dashboard' },
  { label: 'Quản lý danh mục' }
];

const filters = [
  {
    label: 'Loại danh mục',
    value: categoryType,
    onValueChange: handleCategoryTypeChange,
    options: CATEGORY_TYPES.map(type => ({
      label: CATEGORY_TYPE_LABELS[type],
      value: type
    }))
  },
  // ... other filters
];
```

### 3. AdminDocumentListPage.tsx
**Type**: Table Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị nội dung', href: '/admin/dashboard' },
  { label: 'Văn bản pháp lý' }
];

const filters = [
  {
    label: 'Lĩnh vực',
    value: selectedField,
    onValueChange: setSelectedField,
    options: [
      { label: 'Tất cả lĩnh vực', value: 'all' },
      // ... document fields
    ]
  },
  {
    label: 'Cơ quan ban hành',
    value: selectedAgency,
    onValueChange: setSelectedAgency,
    options: [
      { label: 'Tất cả cơ quan', value: 'all' },
      // ... agencies
    ]
  }
];
```

### 4. AdminEventsPage.tsx
**Type**: Table Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị nội dung', href: '/admin/dashboard' },
  { label: 'Sự kiện & Lịch công tác' }
];

const filters = [
  {
    label: 'Loại sự kiện',
    value: selectedType,
    onValueChange: setSelectedType,
    options: [
      { label: 'Tất cả loại', value: 'all' },
      { label: 'Hội thảo', value: 'seminar' },
      { label: 'Họp báo', value: 'press' },
      { label: 'Khánh thành', value: 'opening' }
    ]
  }
];
```

### 5. AdminMediaLibraryPage.tsx
**Type**: Table Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị nội dung', href: '/admin/dashboard' },
  { label: 'Thư viện đa phương tiện' }
];

const filters = [
  {
    label: 'Loại file',
    value: selectedFileType,
    onValueChange: setSelectedFileType,
    options: [
      { label: 'Tất cả', value: 'all' },
      { label: 'Hình ảnh', value: 'image' },
      { label: 'Video', value: 'video' },
      { label: 'Tài liệu', value: 'document' }
    ]
  }
];
```

### 6. AdminTranslationsPage.tsx
**Type**: Table Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị hệ thống', href: '/admin/dashboard' },
  { label: 'Đa ngôn ngữ' }
];

const filters = [
  {
    label: 'Ngôn ngữ',
    value: selectedLanguage,
    onValueChange: setSelectedLanguage,
    options: [
      { label: 'Tất cả', value: 'all' },
      { label: 'Tiếng Việt', value: 'vi' },
      { label: 'English', value: 'en' }
    ]
  }
];
```

### 7. AdminPermissionSystemPage.tsx
**Type**: Table Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị hệ thống', href: '/admin/dashboard' },
  { label: 'Phân quyền' }
];
```

### 8. AdminWebsiteManagerPage.tsx
**Type**: Form Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị hệ thống', href: '/admin/dashboard' },
  { label: 'Quản lý website' }
];

// Sử dụng AdminPageLayout với showBackButton=false
<AdminPageLayout
  title="Quản lý Website"
  description="Cấu hình chung cho website"
  breadcrumbs={breadcrumbs}
>
  {/* Form content */}
</AdminPageLayout>
```

### 9. AdminDocumentFormPage.tsx
**Type**: Form Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị nội dung', href: '/admin/dashboard' },
  { label: 'Văn bản pháp lý', href: '/admin/documents' },
  { label: isEditMode ? 'Chỉnh sửa văn bản' : 'Tạo văn bản' }
];

<AdminPageLayout
  title={isEditMode ? 'Chỉnh sửa văn bản' : 'Tạo văn bản'}
  breadcrumbs={breadcrumbs}
  showBackButton={true}
  backUrl="/admin/documents"
  actions={formActions}
>
  {/* Form content */}
</AdminPageLayout>
```

### 10. AdminEventFormPage.tsx
**Type**: Form Layout

```tsx
const breadcrumbs = [
  { label: 'Quản trị nội dung', href: '/admin/dashboard' },
  { label: 'Sự kiện & Lịch công tác', href: '/admin/events' },
  { label: isEditMode ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện' }
];

<AdminPageLayout
  title={isEditMode ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện'}
  breadcrumbs={breadcrumbs}
  showBackButton={true}
  backUrl="/admin/events"
  actions={formActions}
>
  {/* Form content */}
</AdminPageLayout>
```

## 🔧 Migration Steps cho mỗi file

### Bước 1: Import layouts
```tsx
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AdminTableLayout from '@/components/admin/AdminTableLayout'; // cho table pages
```

### Bước 2: Tạo breadcrumbs
```tsx
const breadcrumbs = [
  { label: 'Nhóm chức năng', href: '/admin/dashboard' },
  { label: 'Tên trang hiện tại' }
];
```

### Bước 3: Config filters (cho table pages)
```tsx
const filters = [
  {
    label: 'Filter name',
    value: filterValue,
    onValueChange: setFilterValue,
    options: [
      { label: 'Option 1', value: 'value1' },
      // ...
    ]
  }
];
```

### Bước 4: Replace JSX structure
- Bọc nội dung trong AdminPageLayout
- Với table pages, bọc table trong AdminTableLayout  
- Di chuyển header actions vào props
- Di chuyển search/filter logic vào AdminTableLayout

### Bước 5: Update thẻ đóng
- Thay </div> cuối cùng bằng </AdminPageLayout>
- Với table pages: </AdminTableLayout></AdminPageLayout>

## 🚀 Automated Migration Commands

```bash
# Có thể tạo script automation nếu cần
# npm run migrate:admin-layouts
```

## ✅ Checklist sau khi migration

Cho mỗi file đã cập nhật:
- [ ] Import đúng layouts
- [ ] Breadcrumbs chính xác
- [ ] Actions hoạt động
- [ ] Search/filters hoạt động
- [ ] Responsive design OK
- [ ] Loading states hoạt động
- [ ] Không có lỗi ESLint/TypeScript

## 📝 Notes

1. **Form pages** không cần AdminTableLayout
2. **Table pages** cần cả AdminPageLayout + AdminTableLayout  
3. **Special pages** (Dashboard) chỉ cần AdminPageLayout
4. Luôn test trên mobile sau khi migration
5. Kiểm tra dark mode compatibility

## 🎨 Final Result

Sau khi hoàn thành migration:
- Tất cả trang admin có giao diện nhất quán
- Loading states tự động
- Responsive design đồng bộ
- Breadcrumbs navigation đầy đủ
- Search/filter experience tốt hơn 