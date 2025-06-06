# PublicLayout - Flexible Layout for MVP Projects

## Overview

`PublicLayout` is a flexible, reusable layout component designed to work across multiple MVP projects. It provides customizable header and footer options with responsive design.

## Features

- ✅ **Toggle Hero Background**: Show/hide hero section with background
- ✅ **Custom Header/Footer**: Replace default components with custom ones
- ✅ **Auto Header Padding**: Automatically adds padding when hero background is disabled
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Theme Support**: Supports light/dark themes
- ✅ **TypeScript Support**: Fully typed interface

## Usage Examples

### 1. Default Layout (Homepage)
```tsx
import PublicLayout from '@/layouts/PublicLayout';

const HomePage = () => (
  <PublicLayout>
    <div>Your homepage content</div>
  </PublicLayout>
);
```

### 2. Simple Layout (Content Pages)
```tsx
import PublicLayout from '@/layouts/PublicLayout';

const ContentPage = () => (
  <PublicLayout showHeroBackground={false}>
    <div>Your content page</div>
  </PublicLayout>
);
```

### 3. No Footer Layout
```tsx
import PublicLayout from '@/layouts/PublicLayout';

const LandingPage = () => (
  <PublicLayout showFooter={false}>
    <div>Your landing page content</div>
  </PublicLayout>
);
```

### 4. Custom Header Layout
```tsx
import PublicLayout from '@/layouts/PublicLayout';
import CustomHeader from './CustomHeader';

const SpecialPage = () => (
  <PublicLayout 
    customHeader={<CustomHeader />}
    addHeaderPadding={true}
  >
    <div>Content with custom header</div>
  </PublicLayout>
);
```

### 5. MVP-Specific Layout
```tsx
import PublicLayout from '@/layouts/PublicLayout';

const MVPPage = () => (
  <PublicLayout 
    showHeroBackground={false}
    mainClassName="bg-gray-50 dark:bg-gray-900"
    customFooter={<MVPFooter />}
  >
    <div>Your MVP-specific content</div>
  </PublicLayout>
);
```

## Props Interface

```tsx
interface PublicLayoutProps {
  children: React.ReactNode;
  
  /** Whether to show the full hero section with background (default: true) */
  showHeroBackground?: boolean;
  
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
  
  /** Additional CSS classes for the main content area */
  mainClassName?: string;
  
  /** Whether to add top padding for fixed header layouts (auto-determined) */
  addHeaderPadding?: boolean;
  
  /** Custom header component to replace default header */
  customHeader?: React.ReactNode;
  
  /** Custom footer component to replace default footer */
  customFooter?: React.ReactNode;
}
```

## Migration Guide

### From SimplePublicLayout
```tsx
// Before
<SimplePublicLayout>
  <Content />
</SimplePublicLayout>

// After
<PublicLayout showHeroBackground={false}>
  <Content />
</PublicLayout>
```

### From Old PublicLayout
```tsx
// Before (old fixed layout)
<PublicLayout>
  <Content />
</PublicLayout>

// After (same behavior)
<PublicLayout>
  <Content />
</PublicLayout>
```

## Best Practices

1. **Use `showHeroBackground={false}`** for content pages
2. **Add `mainClassName`** for page-specific styling
3. **Use custom headers/footers** for MVP-specific branding
4. **Let `addHeaderPadding` auto-determine** unless you need specific control

## Examples by Use Case

| Use Case | Configuration |
|----------|---------------|
| Homepage | Default props |
| Blog/News | `showHeroBackground={false}` |
| Landing Page | `showFooter={false}` |
| MVP App | Custom header/footer |
| Admin Panel | `customHeader={<AdminHeader />}` |

## Responsive Behavior

- **Mobile**: Header components automatically adapt
- **Desktop**: Full navigation and hero section
- **Tablet**: Responsive breakpoints maintained

This layout system allows you to maintain consistency across different MVP projects while providing the flexibility to customize as needed. 