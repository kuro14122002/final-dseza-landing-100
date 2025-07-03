# Hướng dẫn Layout chuẩn cho trang Admin

## Tổng quan

Để đồng nhất giao diện trang quản trị, tôi đã tạo ra hai component layout chính:

1. **AdminPageLayout** - Layout tổng thể cho trang admin
2. **AdminTableLayout** - Layout cho các trang có bảng dữ liệu

## 1. AdminPageLayout

### Mục đích
- Tạo header đồng nhất với title, description, breadcrumbs
- Hỗ trợ các actions button ở góc phải
- Loading state tự động
- Back button tùy chọn

### Cách sử dụng

```tsx
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const MyAdminPage = () => {
  const breadcrumbs = [
    { label: 'Quản trị nội dung', href: '/admin/dashboard' },
    { label: 'Tin tức' }
  ];

  return (
    <AdminPageLayout
      title="Quản lý tin tức"
      description="Danh sách và quản lý các bài viết tin tức"
      breadcrumbs={breadcrumbs}
      actions={
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo mới
        </Button>
      }
      isLoading={isLoading}
      showBackButton={true}
      backUrl="/admin/dashboard"
    >
      {/* Nội dung trang */}
    </AdminPageLayout>
  );
};
```

### Props

| Prop | Type | Mô tả | Bắt buộc |
|------|------|-------|----------|
| title | string | Tiêu đề trang | ✓ |
| description | string | Mô tả trang | ✗ |
| breadcrumbs | BreadcrumbItem[] | Đường dẫn điều hướng | ✗ |
| actions | ReactNode | Các nút action | ✗ |
| children | ReactNode | Nội dung trang | ✓ |
| isLoading | boolean | Trạng thái loading | ✗ |
| className | string | CSS class tùy chỉnh | ✗ |
| showBackButton | boolean | Hiển thị nút back | ✗ |
| backUrl | string | URL khi nhấn back | ✗ |

## 2. AdminTableLayout

### Mục đích
- Layout chuẩn cho các trang có bảng dữ liệu
- Tích hợp sẵn search, filter, actions
- Loading state cho table
- Summary thông tin (tổng số, đã chọn)

### Cách sử dụng

```tsx
import AdminTableLayout from '@/components/admin/AdminTableLayout';

const MyTablePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  const filters = [
    {
      label: 'Trạng thái',
      value: statusFilter,
      onValueChange: setStatusFilter,
      options: [
        { label: 'Tất cả', value: 'all' },
        { label: 'Hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' }
      ]
    }
  ];

  return (
    <AdminPageLayout title="Danh sách dữ liệu">
      <AdminTableLayout
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm..."
        filters={filters}
        totalItems={totalItems}
        selectedItems={selectedItems.length}
        primaryAction={{
          label: 'Tạo mới',
          onClick: handleCreate,
          icon: Plus
        }}
        onRefresh={handleRefresh}
      >
        <Table>
          {/* Nội dung table */}
        </Table>
      </AdminTableLayout>
    </AdminPageLayout>
  );
};
```

### Props

| Prop | Type | Mô tả | Bắt buộc |
|------|------|-------|----------|
| searchValue | string | Giá trị tìm kiếm | ✗ |
| onSearchChange | function | Callback khi thay đổi search | ✗ |
| searchPlaceholder | string | Placeholder cho search | ✗ |
| filters | FilterOption[] | Danh sách filter | ✗ |
| primaryAction | ActionConfig | Action chính (thường là tạo mới) | ✗ |
| secondaryActions | ReactNode | Các action phụ | ✗ |
| children | ReactNode | Nội dung table | ✓ |
| isLoading | boolean | Trạng thái loading | ✗ |
| totalItems | number | Tổng số items | ✗ |
| selectedItems | number | Số items đã chọn | ✗ |
| onRefresh | function | Callback làm mới dữ liệu | ✗ |
| className | string | CSS class tùy chỉnh | ✗ |

## 3. Quy tắc áp dụng

### Cho trang danh sách (List pages)
```tsx
<AdminPageLayout + AdminTableLayout>
```

### Cho trang form (Form pages)
```tsx
<AdminPageLayout với showBackButton={true}>
```

### Cho trang dashboard
```tsx
<AdminPageLayout không cần AdminTableLayout>
```

## 4. Ví dụ hoàn chỉnh

Xem file: `src/pages/admin/AdminPageExample.tsx`

## 5. Migration checklist

Để cập nhật các trang admin hiện có:

### ✅ Đã hoàn thành
- [x] Tạo AdminPageLayout component
- [x] Tạo AdminTableLayout component  
- [x] Cập nhật DashboardPage
- [x] Tạo ví dụ AdminPageExample

### 🔄 Cần cập nhật
- [ ] AdminNewsListPage
- [ ] AdminNewsFormPage
- [ ] AdminCategoriesPage
- [ ] AdminUserManagementPage
- [ ] AdminDocumentListPage
- [ ] AdminDocumentFormPage
- [ ] AdminEventsPage
- [ ] AdminEventFormPage
- [ ] AdminMediaLibraryPage
- [ ] AdminTranslationsPage
- [ ] AdminPermissionSystemPage
- [ ] AdminWebsiteManagerPage

### Các bước migration cho từng trang:

1. **Import các layout components**
```tsx
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AdminTableLayout from '@/components/admin/AdminTableLayout'; // nếu có table
```

2. **Định nghĩa breadcrumbs**
```tsx
const breadcrumbs = [
  { label: 'Nhóm chức năng', href: '/admin/dashboard' },
  { label: 'Tên trang hiện tại' }
];
```

3. **Cấu hình filters** (cho table pages)
```tsx
const filters = [
  {
    label: 'Filter name',
    value: filterValue,
    onValueChange: setFilterValue,
    options: [...]
  }
];
```

4. **Thay thế JSX structure**
- Bọc toàn bộ nội dung trong `AdminPageLayout`
- Với table, bọc table trong `AdminTableLayout`
- Di chuyển header actions vào prop `actions`
- Di chuyển search/filter logic vào AdminTableLayout props

## 6. Lợi ích

- **Nhất quán**: Tất cả trang admin có cùng look & feel
- **Dễ maintain**: Thay đổi layout ở một nơi, áp dụng toàn bộ
- **Loading states**: Tự động xử lý trạng thái loading
- **Responsive**: Tối ưu cho mobile và desktop
- **Accessibility**: Tuân thủ các tiêu chuẩn a11y
- **Developer Experience**: Ít code boilerplate, dễ sử dụng

## 7. Best Practices

### Breadcrumbs
- Luôn bắt đầu từ Dashboard
- Tối đa 3 cấp
- Cấp cuối không có link

### Actions
- Primary action ở bên phải header
- Secondary actions trong AdminTableLayout
- Sử dụng icon phù hợp

### Loading
- Sử dụng `isLoading` prop để tự động hiển thị skeleton
- Không cần tự implement loading UI

### Search & Filter
- Search ở đầu tiên, filters theo sau
- Sử dụng debounce cho search
- Persist filter states trong URL params nếu cần

### Table Actions
- View, Edit, Delete theo thứ tự đó
- Sử dụng tooltips cho clarity
- Confirm dialog cho destructive actions 