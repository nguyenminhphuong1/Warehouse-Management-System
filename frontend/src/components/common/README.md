# 🏭 Common Components Library

Modern, accessible, and performant React components for the Warehouse Management System.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Components](#components)
- [Usage Examples](#usage-examples)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Development](#development)

## 🎯 Overview

This library contains **11 essential components** designed specifically for warehouse management applications:

### 📊 **Data & Display**
- **DataTable** - Advanced table with sorting, filtering, pagination
- **Pagination** - Flexible pagination with multiple variants
- **Loading** - Multiple loading states and skeleton components

### 🔔 **Feedback & Interactions**
- **ConfirmDialog** - Confirmation dialogs with animations
- **Modal** - Modern modals with focus management
- **Toast** - Notification system with positioning

### 🧭 **Navigation & Layout**
- **Header** - Application header with navigation
- **Sidebar** - Collapsible navigation sidebar
- **Footer** - Company footer with social links

### 🔍 **Input & Search**
- **SearchBox** - Advanced search with suggestions and filters

## 🚀 Installation

### Import all components:
```javascript
import CommonComponents from './components/common';

// Or import specific components
import { DataTable, Modal, Toast } from './components/common';
```

### Import styles:
```javascript
import './components/common/styles.css';
```

## 📦 Components

### 1. ConfirmDialog

Modern confirmation dialogs with smooth animations.

```javascript
import { ConfirmDialog, useConfirmDialog } from './components/common';

function MyComponent() {
  const { showConfirm, ConfirmDialog } = useConfirmDialog();
  
  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa mục này?',
      type: 'danger'
    });
    
    if (confirmed) {
      // Perform delete action
    }
  };
  
  return (
    <>
      <button onClick={handleDelete}>Delete Item</button>
      <ConfirmDialog />
    </>
  );
}
```

**Features:**
- ✅ 4 types: success, error, warning, info
- ✅ Glassmorphism design
- ✅ Keyboard navigation
- ✅ Promise-based API

### 2. DataTable

Advanced data table with comprehensive features.

```javascript
import { DataTable } from './components/common';

const columns = [
  { key: 'name', title: 'Tên sản phẩm', sortable: true },
  { key: 'price', title: 'Giá', type: 'currency' },
  { key: 'stock', title: 'Tồn kho', type: 'number' }
];

const data = [
  { id: 1, name: 'Laptop Dell', price: 15000000, stock: 25 },
  { id: 2, name: 'Mouse Logitech', price: 500000, stock: 100 }
];

const rowActions = [
  { icon: '👁️', title: 'Xem', onClick: (row) => console.log('View', row) },
  { icon: '✏️', title: 'Sửa', onClick: (row) => console.log('Edit', row) },
  { icon: '🗑️', title: 'Xóa', onClick: (row) => console.log('Delete', row) }
];

function ProductTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      rowActions={rowActions}
      searchable={true}
      sortable={true}
      paginated={true}
      selectable={true}
    />
  );
}
```

**Features:**
- ✅ Sorting, filtering, pagination
- ✅ Row selection with bulk actions
- ✅ Real-time search
- ✅ Mobile responsive

### 3. Modal

Modern modal component with focus management.

```javascript
import { Modal, useModal } from './components/common';

function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  
  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      
      <Modal
        show={isOpen}
        onClose={closeModal}
        title="Thêm sản phẩm mới"
        size="lg"
        primaryAction={{
          label: 'Lưu',
          onClick: handleSave
        }}
        secondaryAction={{
          label: 'Hủy',
          onClick: closeModal
        }}
      >
        <form>
          {/* Form content */}
        </form>
      </Modal>
    </>
  );
}
```

**Features:**
- ✅ Multiple sizes: sm, md, lg, xl, full
- ✅ Focus trapping
- ✅ Keyboard navigation
- ✅ Form components included

### 4. Loading

Comprehensive loading states and animations.

```javascript
import { 
  Loading, 
  Spinner, 
  SkeletonText, 
  LoadingButton 
} from './components/common';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  
  return (
    <>
      {/* Full page loading */}
      <Loading 
        show={loading}
        type="gradient"
        text="Đang tải dữ liệu..."
        layout="fullscreen"
      />
      
      {/* Inline spinner */}
      <Spinner type="dots" size="sm" />
      
      {/* Skeleton loading */}
      <SkeletonText lines={3} />
      
      {/* Loading button */}
      <LoadingButton loading={loading} onClick={handleSubmit}>
        Lưu dữ liệu
      </LoadingButton>
    </>
  );
}
```

**Features:**
- ✅ 7 animation types
- ✅ Skeleton components
- ✅ Button loading states
- ✅ Multiple layouts

### 5. Toast

Notification system with positioning and animations.

```javascript
import { ToastProvider, useToast } from './components/common';

// Wrap your app
function App() {
  return (
    <ToastProvider position="top-right">
      <MyComponent />
    </ToastProvider>
  );
}

// Use in components
function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Đã lưu thành công!');
  };
  
  const handleError = () => {
    toast.error('Có lỗi xảy ra!');
  };
  
  const handlePromise = async () => {
    await toast.promise(
      saveData(),
      {
        loading: 'Đang lưu...',
        success: 'Đã lưu thành công!',
        error: 'Lưu thất bại!'
      }
    );
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handlePromise}>Promise Toast</button>
    </div>
  );
}
```

**Features:**
- ✅ 5 types with icons
- ✅ 6 position options
- ✅ Auto-dismiss with progress
- ✅ Promise-based API

### 6. SearchBox

Advanced search with suggestions and filters.

```javascript
import { SearchBox, useSearch } from './components/common';

function ProductSearch() {
  const { query, setQuery, handleSearch } = useSearch();
  
  const suggestions = [
    { title: 'Laptop Dell XPS', category: 'Electronics' },
    { title: 'Mouse Logitech', category: 'Accessories' }
  ];
  
  const filters = [
    {
      key: 'category',
      label: 'Danh mục',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Điện tử' },
        { value: 'accessories', label: 'Phụ kiện' }
      ]
    }
  ];
  
  return (
    <SearchBox
      value={query}
      onChange={setQuery}
      onSearch={handleSearch}
      suggestions={suggestions}
      filters={filters}
      placeholder="Tìm kiếm sản phẩm..."
      showFilterButton={true}
    />
  );
}
```

**Features:**
- ✅ Real-time suggestions
- ✅ Advanced filters
- ✅ Keyboard navigation
- ✅ Debounced search

### 7. Pagination

Flexible pagination with multiple variants.

```javascript
import { Pagination, usePagination } from './components/common';

function ProductList() {
  const {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(10);
  
  return (
    <Pagination
      currentPage={currentPage}
      totalItems={500}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      showInfo={true}
      showPageSize={true}
      showJumpToPage={true}
      variant="default"
      size="md"
    />
  );
}
```

**Features:**
- ✅ Multiple variants
- ✅ Jump to page
- ✅ Page size selector
- ✅ Mobile responsive

### 8. Header

Application header with navigation and user controls.

```javascript
import { Header, warehouseNavigation } from './components/common';

function App() {
  const user = {
    name: 'Nguyễn Văn A',
    role: 'Admin',
    avatar: '/path/to/avatar.jpg'
  };
  
  const handleSearch = (query) => {
    console.log('Search:', query);
  };
  
  return (
    <Header
      title="Warehouse System"
      navigation={warehouseNavigation}
      user={user}
      onSearch={handleSearch}
      showSearch={true}
      notifications={[
        { id: 1, title: 'New order', read: false }
      ]}
    />
  );
}
```

**Features:**
- ✅ Responsive navigation
- ✅ User menu with avatar
- ✅ Search integration
- ✅ Notifications

### 9. Sidebar

Collapsible navigation sidebar with hierarchical menu.

```javascript
import { 
  Sidebar, 
  useSidebar, 
  warehouseSidebarNavigation 
} from './components/common';

function App() {
  const { collapsed, toggle } = useSidebar();
  
  const user = {
    name: 'Nguyễn Văn A',
    role: 'Admin'
  };
  
  return (
    <Sidebar
      navigation={warehouseSidebarNavigation}
      user={user}
      collapsed={collapsed}
      onToggle={toggle}
      title="WMS"
      subtitle="Management"
    />
  );
}
```

**Features:**
- ✅ Hierarchical navigation
- ✅ Collapsible design
- ✅ Mobile responsive
- ✅ User profile

### 10. Footer

Company footer with social links and information.

```javascript
import { 
  Footer, 
  warehouseFooterSections,
  warehouseSocialLinks 
} from './components/common';

function App() {
  const handleNewsletterSubmit = async (email) => {
    console.log('Newsletter subscription:', email);
  };
  
  return (
    <Footer
      sections={warehouseFooterSections}
      socialLinks={warehouseSocialLinks}
      showNewsletter={true}
      onNewsletterSubmit={handleNewsletterSubmit}
      copyright="© 2025 Warehouse Management System"
    />
  );
}
```

**Features:**
- ✅ Social media links
- ✅ Newsletter subscription
- ✅ Company information
- ✅ Multiple variants

## 🎨 Theming

### CSS Variables

All components use CSS custom properties for consistent theming:

```css
:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  
  --border-color: #e5e7eb;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Dark Mode

Automatic dark mode support based on user preference:

```css
[data-theme="dark"] {
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}
```

### Theme Switching

```javascript
// Toggle theme
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

## ♿ Accessibility

All components follow WCAG 2.1 guidelines:

### Keyboard Navigation
- ✅ Full keyboard support
- ✅ Focus management
- ✅ Logical tab order
- ✅ Escape key handling

### Screen Readers
- ✅ Proper ARIA labels
- ✅ Role attributes
- ✅ Live regions for dynamic content
- ✅ Alternative text for icons

### Visual Accessibility
- ✅ High contrast mode support
- ✅ Reduced motion preferences
- ✅ Color-blind friendly design
- ✅ Sufficient color contrast

### Example Usage:
```javascript
// Components automatically include accessibility features
<DataTable
  ariaLabel="Product inventory table"
  caption="List of all products in warehouse"
  data={products}
  columns={columns}
/>

<Modal
  show={isOpen}
  onClose={closeModal}
  ariaLabel="Add new product"
  ariaDescribedBy="product-form-description"
>
  <p id="product-form-description">
    Fill out the form below to add a new product to inventory
  </p>
</Modal>
```

## ⚡ Performance

### Optimizations Included:

#### Code Splitting
- ✅ Lazy loading of components
- ✅ Dynamic imports
- ✅ Bundle size optimization

#### Memory Management
- ✅ Proper cleanup in useEffect
- ✅ Event listener removal
- ✅ Reference cleanup

#### Rendering Performance
- ✅ React.memo for pure components
- ✅ useCallback for event handlers
- ✅ useMemo for expensive calculations
- ✅ Virtualization for large lists

#### Animation Performance
- ✅ GPU-accelerated animations
- ✅ 60fps animations
- ✅ Reduced motion support

### Performance Best Practices:

```javascript
// Use debounced search
const { query, setQuery, handleSearch } = useSearch();

// Memoize expensive operations
const filteredData = useMemo(() => {
  return data.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}, [data, query]);

// Use callback refs for dynamic lists
const rowRef = useCallback((node) => {
  if (node) {
    // Handle row intersection
  }
}, []);
```

## 🛠️ Development

### Project Structure
```
frontend/src/components/common/
├── index.js                 # Main export file
├── styles.css              # Global styles and variables
├── README.md               # This file
│
├── ConfirmDialog.js        # Confirmation dialogs
├── ConfirmDialog.css
│
├── DataTable.js            # Advanced data table
├── DataTable.css
│
├── Modal.js                # Modal components
├── Modal.css
│
├── Loading.js              # Loading states
├── Loading.css
│
├── Toast.js                # Notifications
├── Toast.css
│
├── Pagination.js           # Pagination controls
├── Pagination.css
│
├── SearchBox.js            # Search functionality
├── SearchBox.css
│
├── Header.js               # App header
├── Header.css
│
├── Sidebar.js              # Navigation sidebar
├── Sidebar.css
│
├── Footer.js               # App footer
└── Footer.css
```

### Adding New Components

1. **Create component files:**
```bash
# Create JS and CSS files
touch MyComponent.js MyComponent.css
```

2. **Follow naming conventions:**
```javascript
// MyComponent.js
import React from 'react';
import './MyComponent.css';

const MyComponent = ({ 
  // Props with default values
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  return (
    <div className={`my-component ${variant} ${size} ${className}`} {...props}>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

3. **Add to index.js:**
```javascript
// Add to exports
export { default as MyComponent } from './MyComponent';
```

### Styling Guidelines

#### CSS Class Naming
- Use kebab-case: `.my-component-header`
- Use BEM methodology: `.block__element--modifier`
- Prefix with component name: `.modal-header`, `.sidebar-nav`

#### CSS Variables
- Use semantic names: `--primary-color`, `--text-secondary`
- Group related variables: `--border-*`, `--shadow-*`
- Support both light and dark themes

#### Responsive Design
```css
/* Mobile first approach */
.my-component {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .my-component {
    padding: var(--spacing-6);
  }
}
```

### Testing Components

#### Unit Testing
```javascript
// MyComponent.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent>Test Content</MyComponent>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick}>Click me</MyComponent>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Accessibility Testing
```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE | 11 | ❌ Not supported |

### Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.0.0"
}
```

## 📚 Advanced Usage

### Custom Hooks Integration

```javascript
// Custom hook for data fetching
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};

// Use with components
function ProductsPage() {
  const { products, loading, error, refetch } = useProducts();
  const toast = useToast();

  const handleDelete = async (productId) => {
    try {
      await api.deleteProduct(productId);
      toast.success('Đã xóa sản phẩm thành công');
      refetch();
    } catch (err) {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <DataTable
      data={products}
      columns={productColumns}
      rowActions={[
        {
          icon: '🗑️',
          title: 'Xóa',
          onClick: (row) => handleDelete(row.id)
        }
      ]}
    />
  );
}
```

### Form Integration

```javascript
// Complete form with validation
function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState(product || {});
  const [errors, setErrors] = useState({});
  const { loading, withLoading } = useButtonLoading();
  const toast = useToast();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Tên sản phẩm là bắt buộc';
    if (!formData.price) newErrors.price = 'Giá là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    await withLoading(async () => {
      try {
        await onSave(formData);
        toast.success('Đã lưu sản phẩm thành công');
      } catch (error) {
        toast.error('Lưu sản phẩm thất bại');
      }
    });
  };

  return (
    <Modal
      show={true}
      onClose={onCancel}
      title={product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalFormGroup
          label="Tên sản phẩm"
          required
          error={errors.name}
        >
          <ModalInput
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            placeholder="Nhập tên sản phẩm"
          />
        </ModalFormGroup>

        <ModalFormGroup
          label="Giá"
          required
          error={errors.price}
        >
          <ModalInput
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              price: Number(e.target.value)
            }))}
            placeholder="Nhập giá"
          />
        </ModalFormGroup>

        <div className="modal-footer">
          <button type="button" onClick={onCancel}>
            Hủy
          </button>
          <LoadingButton type="submit" loading={loading}>
            {product ? 'Cập nhật' : 'Thêm mới'}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
```

### Layout Composition

```javascript
// Complete app layout
function AppLayout({ children }) {
  const { collapsed, toggle, openMobile, closeMobile } = useSidebar();
  const { user, notifications } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="app-layout">
      <Header
        navigation={warehouseNavigation}
        user={user}
        notifications={notifications}
        onMobileMenuClick={openMobile}
      />
      
      <Sidebar
        navigation={warehouseSidebarNavigation}
        user={user}
        collapsed={collapsed}
        onToggle={toggle}
        onClose={closeMobile}
      />
      
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        {children}
      </main>
      
      <Footer
        sections={warehouseFooterSections}
        socialLinks={warehouseSocialLinks}
        variant="minimal"
      />
    </div>
  );
}

// Page with layout
function ProductsPage() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <SearchBox placeholder="Tìm kiếm sản phẩm..." />
      </div>
      
      <div className="page-content">
        <ProductTable />
      </div>
    </AppLayout>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

#### Components not styling correctly
```javascript
// Make sure to import the styles
import './components/common/styles.css';

// Or import individual component styles
import './components/common/Modal.css';
```

#### Dark mode not working
```javascript
// Check if theme is set correctly
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}, []);
```

#### Performance issues with large datasets
```javascript
// Use pagination or virtualization
<DataTable
  data={largeDataset}
  paginated={true}
  pageSize={50}
  // Enable virtual scrolling for very large datasets
  virtualScrolling={true}
/>
```

#### TypeScript errors (if using TypeScript)
```typescript
// Add type definitions
interface Product {
  id: number;
  name: string;
  price: number;
}

// Use with components
<DataTable<Product>
  data={products}
  columns={columns}
/>
```

## 📞 Support

For questions, issues, or feature requests:

1. **Documentation**: Check this README and component prop documentation
2. **Issues**: Create an issue in the project repository
3. **Discussions**: Use GitHub Discussions for questions
4. **Code Review**: Submit a pull request for improvements

## 🚀 Future Roadmap

### Planned Components
- 📅 **DatePicker** - Date selection with calendar
- 📊 **Charts** - Data visualization components
- 🗂️ **Tabs** - Tabbed content navigation
- 📤 **Upload** - File upload with drag-and-drop
- 🏷️ **Tags** - Tag input and management
- 📱 **Drawer** - Sliding panel component

### Planned Features
- 🎨 **Theme Builder** - Visual theme customization
- 📚 **Storybook** - Component documentation
- 🧪 **Testing Suite** - Comprehensive test coverage
- 📦 **NPM Package** - Standalone package distribution
- 🌐 **Internationalization** - Multi-language support

---

**Built with ❤️ for the Warehouse Management System**

*Last updated: June 2025*