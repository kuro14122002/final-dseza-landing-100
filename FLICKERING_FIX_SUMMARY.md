# Báo cáo sửa lỗi Flickering - AdminNewsFormPage.tsx

## Vấn đề ban đầu
Trang AdminNewsFormPage.tsx (cả ở chế độ Tạo mới `/admin/news/create` và Chỉnh sửa `/admin/news/edit/:articleId`) gặp phải hiện tượng "nhấp nháy" (flickering) trên giao diện do vòng lặp re-render không kiểm soát và cách xử lý các trạng thái chưa tối ưu.

## Các nguyên nhân đã xác định được

### 1. **useEffect Dependencies không đúng**
- `useEffect` cho việc load initial data có dependency array không bao gồm `form.reset` và `form.setValue`
- Các function này được tạo mới ở mỗi render gây ra re-render liên tục

### 2. **Quá nhiều useWatch hooks**
- Sử dụng 6 `useWatch` hooks riêng biệt gây ra nhiều re-render không cần thiết
- Mỗi useWatch tạo ra một subscription riêng với form state

### 3. **Callback functions không được memoize đúng cách**
- Các callback functions được tạo mới ở mỗi render
- Thiếu memoization cho các event handlers

### 4. **Logic conditional rendering chưa tối ưu**
- Chỉ sử dụng `isInitialLoading` để kiểm soát hiển thị
- Thiếu state để track việc data đã sẵn sàng để hiển thị

### 5. **Race conditions trong async operations**
- Không có cơ chế cleanup để tránh state updates sau khi component unmount

## Các giải pháp đã áp dụng

### 1. **Tối ưu useEffect hooks**
```tsx
// Trước
useEffect(() => {
  // fetch data và update form
}, [articleId, isEditMode, navigate, t]);

// Sau  
useEffect(() => {
  let isMounted = true; // Cleanup flag
  
  const loadInitialData = async () => {
    if (!isMounted) return;
    // ... async operations với isMounted checks
  };
  
  loadInitialData();
  
  return () => {
    isMounted = false; // Cleanup
  };
}, [articleId, isEditMode, navigate, t, formReset, formSetValue]);
```

### 2. **Consolidate useWatch hooks**
```tsx
// Trước - 6 useWatch hooks riêng biệt
const watchedTitle = useWatch({ control: form.control, name: 'title' });
const watchedCategory = useWatch({ control: form.control, name: 'category' });
// ... 4 hooks khác

// Sau - 1 useWatch duy nhất
const watchedValues = useWatch({
  control: form.control,
  name: ['title', 'category', 'status', 'publishDate', 'isFeatured']
});
const [watchedTitle, watchedCategory, watchedStatus, watchedPublishDate, watchedIsFeatured] = watchedValues;
```

### 3. **Memoize form functions**
```tsx
// Thêm các memoized functions
const formReset = useCallback((data: NewsFormValues) => {
  form.reset(data);
}, [form]);

const formSetValue = useCallback((field: keyof NewsFormValues, value: any) => {
  form.setValue(field, value);
}, [form]);
```

### 4. **Consolidate callback functions**
```tsx
// Trước - nhiều callback riêng biệt
const setCategoryValue = useCallback((value: string) => {
  form.setValue('category', value);
}, [form]);

// Sau - một factory function duy nhất
const handleSelectChange = useCallback((field: keyof NewsFormValues) => {
  return (value: string | boolean) => {
    formSetValue(field, value);
  };
}, [formSetValue]);
```

### 5. **Cải thiện loading state management**
```tsx
// Thêm state để track data readiness
const [dataLoaded, setDataLoaded] = useState(false);

// Cải thiện conditional rendering
if (isInitialLoading || !dataLoaded) {
  return <ImprovedSkeletonUI />;
}
```

### 6. **Tối ưu slug generation**
```tsx
// Chỉ generate slug khi data đã loaded và không ở edit mode
useEffect(() => {
  if (watchedTitle && !isEditMode && dataLoaded) {
    const generatedSlug = generateSlug(watchedTitle);
    form.setValue('slug', generatedSlug, { 
      shouldValidate: false, 
      shouldDirty: false,
      shouldTouch: false 
    });
  }
}, [watchedTitle, generateSlug, isEditMode, dataLoaded, form]);
```

## Cải tiến về UX

### 1. **Skeleton UI chi tiết hơn**
- Chia skeleton thành các sections phù hợp với layout thật
- Đảm bảo skeleton layout match với form layout

### 2. **Tránh layout shift**
- Đảm bảo skeleton có dimensions tương tự như content thật
- Cải thiện transition giữa loading và loaded states

## Kết quả đạt được

✅ **Loại bỏ hoàn toàn hiện tượng flickering**
✅ **Giảm số lượng re-render không cần thiết**  
✅ **Cải thiện performance loading**
✅ **Code dễ maintain hơn với ít callbacks**
✅ **Tránh được race conditions và memory leaks**
✅ **UX mượt mà hơn với skeleton loading**

## Testing

- Build thành công không lỗi TypeScript/ESLint
- Trang hiển thị ổn định, không còn nhấp nháy
- Form hoạt động bình thường sau khi fix
- Loading states hoạt động đúng cách

## Lưu ý khi maintain

1. **Dependency arrays**: Luôn đảm bảo include tất cả dependencies cần thiết
2. **useWatch**: Cân nhắc consolidate khi có nhiều watched fields
3. **Async operations**: Luôn implement cleanup để tránh race conditions
4. **Memoization**: Sử dụng useCallback/useMemo cho functions/values expensive

---
*Fixed by: AI Assistant - Claude Sonnet 4*
*Date: Hôm nay* 