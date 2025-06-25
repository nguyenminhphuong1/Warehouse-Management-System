// =============================================================================
// IMPORTS – BỔ SUNG TẤT CẢ BIẾN SỬ DỤNG TRONG FILE
// =============================================================================

import ConfirmDialog, {
  useConfirmDialog,
  confirmDelete,
  confirmSave,
  confirmLogout
} from './ConfirmDialog';

import DataTable from './DataTable';

import Modal, {
  useModal,
  ConfirmationModal,
  InfoModal,
  FormModal,
  ModalFormGroup,
  ModalInput,
  ModalSelect,
  ModalTextarea
} from './Modal';

import Loading, {
  Spinner,
  ProgressBar,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  TableLoading,
  FormLoading,
  CardLoading,
  ListLoading,
  LoadingOverlay,
  useButtonLoading,
  LoadingButton,
  FullscreenLoading,
  PageLoading,
  ApiLoading,
  ImageLoading,
  LoadingWrapper
} from './Loading';

import Toast, {
  ToastProvider,
  useToast,
  showToast,
  toast,
  warehouseToasts
} from './Toast';

import Pagination, {
  usePagination,
  getPaginationData,
  SimplePagination,
  CompactPagination
} from './Pagination';

import SearchBox, {
  useSearch,
  SimpleSearch,
  SearchBar,
  getWarehouseSuggestions,
  warehouseSearchFilters
} from './SearchBox';

import Header, {
  useHeader,
  warehouseNavigation,
  warehouseUserMenu,
  warehouseActions
} from './Header';

import Footer, {
  warehouseFooterSections,
  warehouseSocialLinks,
  warehouseLegalLinks,
  warehouseContact,
  warehouseStats,
  MinimalFooter,
  FullFooter
} from './Footer';

import Sidebar, {
  useSidebar,
  warehouseNavigation as warehouseSidebarNavigation,
  warehouseNavigationGrouped,
  MinimalSidebar,
  AdminSidebar,
  ResponsiveSidebar,
  SidebarWithBreadcrumb
} from './Sidebar';


// =============================================================================
// EXPORTS
// =============================================================================

// Loading
export { default as Loading } from './Loading';
export {
  Spinner,
  ProgressBar,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  TableLoading,
  FormLoading,
  CardLoading,
  ListLoading,
  LoadingOverlay,
  useButtonLoading,
  LoadingButton,
  FullscreenLoading,
  PageLoading,
  ApiLoading,
  ImageLoading,
  LoadingWrapper
} from './Loading';

// ConfirmDialog
export { default as ConfirmDialog } from './ConfirmDialog';
export {
  useConfirmDialog,
  confirmDelete,
  confirmSave,
  confirmLogout
} from './ConfirmDialog';

// Modal
export { default as Modal } from './Modal';
export {
  useModal,
  ConfirmationModal,
  InfoModal,
  FormModal,
  ModalFormGroup,
  ModalInput,
  ModalSelect,
  ModalTextarea
} from './Modal';

// Toast
export { default as Toast } from './Toast';
export {
  ToastProvider,
  useToast,
  showToast,
  toast,
  warehouseToasts
} from './Toast';

// Pagination
export { default as Pagination } from './Pagination';
export {
  usePagination,
  getPaginationData,
  SimplePagination,
  CompactPagination
} from './Pagination';

// SearchBox
export { default as SearchBox } from './SearchBox';
export {
  useSearch,
  SimpleSearch,
  SearchBar,
  getWarehouseSuggestions,
  warehouseSearchFilters
} from './SearchBox';

// Header
export { default as Header } from './Header';
export {
  useHeader,
  warehouseNavigation,
  warehouseUserMenu,
  warehouseActions
} from './Header';

// Footer
export { default as Footer } from './Footer';
export {
  warehouseFooterSections,
  warehouseSocialLinks,
  warehouseLegalLinks,
  warehouseContact,
  warehouseStats,
  MinimalFooter,
  FullFooter
} from './Footer';

// Sidebar
export { default as Sidebar } from './Sidebar';
export {
  useSidebar,
  warehouseNavigation as warehouseSidebarNavigation,
  warehouseNavigationGrouped,
  MinimalSidebar,
  AdminSidebar,
  ResponsiveSidebar,
  SidebarWithBreadcrumb
} from './Sidebar';

// DataTable
export { default as DataTable } from './DataTable';


// =============================================================================
// COMPOSITE EXPORTS – OBJECTS
// =============================================================================

export const LoadingComponents = {
  Loading,
  Spinner,
  ProgressBar,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  TableLoading,
  FormLoading,
  CardLoading,
  ListLoading,
  LoadingOverlay,
  LoadingButton,
  FullscreenLoading,
  PageLoading,
  ApiLoading,
  ImageLoading,
  LoadingWrapper
};

export const ModalComponents = {
  Modal,
  ConfirmationModal,
  InfoModal,
  FormModal,
  ModalFormGroup,
  ModalInput,
  ModalSelect,
  ModalTextarea
};

export const NavigationComponents = {
  Header,
  Footer,
  Sidebar,
  Pagination,
  SearchBox
};

export const FeedbackComponents = {
  Toast,
  ConfirmDialog,
  Loading: LoadingComponents
};

export const CommonHooks = {
  useConfirmDialog,
  useModal,
  useToast,
  usePagination,
  useSearch,
  useHeader,
  useSidebar,
  useButtonLoading
};

export const WarehouseNavigation = {
  header: warehouseNavigation,
  sidebar: warehouseSidebarNavigation,
  sidebarGrouped: warehouseNavigationGrouped,
  userMenu: warehouseUserMenu,
  actions: warehouseActions
};

export const WarehouseFooter = {
  sections: warehouseFooterSections,
  socialLinks: warehouseSocialLinks,
  legalLinks: warehouseLegalLinks,
  contact: warehouseContact,
  stats: warehouseStats
};

export const WarehouseSearch = {
  filters: warehouseSearchFilters,
  getSuggestions: getWarehouseSuggestions
};

export const WarehouseNotifications = {
  toasts: warehouseToasts
};

export const LayoutComponents = {
  AdminLayout: {
    Header,
    Sidebar: AdminSidebar,
    Footer: FullFooter,
    navigation: warehouseSidebarNavigation,
    userMenu: warehouseUserMenu
  },
  SimpleLayout: {
    Header,
    Sidebar: MinimalSidebar,
    Footer: MinimalFooter
  },
  MobileLayout: {
    Header,
    Sidebar: ResponsiveSidebar,
    Footer: MinimalFooter
  }
};

export const FormComponents = {
  SearchBox,
  ModalFormGroup,
  ModalInput,
  ModalSelect,
  ModalTextarea,
  LoadingButton
};

export const DataComponents = {
  DataTable,
  Pagination,
  Loading: LoadingComponents,
  Skeleton
};

export const ComponentUtils = {
  getPaginationData,
  getWarehouseSuggestions,
  showToast,
  toast,
  confirmDelete,
  confirmSave,
  confirmLogout
};

export const ThemeConfig = {
  cssVariables: {
    '--primary-color': '#3b82f6',
    '--primary-light': '#60a5fa',
    '--primary-dark': '#2563eb',
    '--success-color': '#10b981',
    '--warning-color': '#f59e0b',
    '--error-color': '#ef4444',
    '--info-color': '#3b82f6',
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f9fafb',
    '--bg-tertiary': '#f3f4f6',
    '--bg-quaternary': '#e5e7eb',
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--text-tertiary': '#9ca3af',
    '--text-disabled': '#d1d5db',
    '--border-color': '#e5e7eb',
    '--border-hover': '#d1d5db',
    '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '--radius-sm': '4px',
    '--radius-md': '8px',
    '--radius-lg': '12px',
    '--radius-xl': '16px',
    '--spacing-xs': '4px',
    '--spacing-sm': '8px',
    '--spacing-md': '16px',
    '--spacing-lg': '24px',
    '--spacing-xl': '32px'
  },
  darkMode: {
    '--bg-primary': '#1f2937',
    '--bg-secondary': '#111827',
    '--bg-tertiary': '#374151',
    '--bg-quaternary': '#4b5563',
    '--text-primary': '#f9fafb',
    '--text-secondary': '#d1d5db',
    '--text-tertiary': '#9ca3af',
    '--border-color': '#374151'
  }
};

export const AccessibilityHelpers = {
  srOnly: 'sr-only',
  focusManagement: {
    trapFocus: true,
    autoFocus: true,
    restoreFocus: true
  },
  ariaLabels: {
    close: 'Đóng',
    menu: 'Menu',
    search: 'Tìm kiếm',
    loading: 'Đang tải',
    previous: 'Trang trước',
    next: 'Trang sau',
    first: 'Trang đầu',
    last: 'Trang cuối'
  }
};

export const PerformanceConfig = {
  debounce: {
    search: 300,
    resize: 100,
    scroll: 50
  },
  animations: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  lazyLoading: {
    rootMargin: '50px',
    threshold: 0.1
  }
};

export const DevHelpers = {
  componentNames: {
    ConfirmDialog: 'WarehouseConfirmDialog',
    DataTable: 'WarehouseDataTable',
    Modal: 'WarehouseModal',
    Loading: 'WarehouseLoading',
    Toast: 'WarehouseToast',
    Pagination: 'WarehousePagination',
    SearchBox: 'WarehouseSearchBox',
    Header: 'WarehouseHeader',
    Footer: 'WarehouseFooter',
    Sidebar: 'WarehouseSidebar'
  },
  propTypesAvailable: process.env.NODE_ENV === 'development'
};

const CommonComponents = {
  ConfirmDialog,
  DataTable,
  Modal,
  Loading,
  Toast,
  Pagination,
  SearchBox,
  Header,
  Footer,
  Sidebar,
  LoadingComponents,
  ModalComponents,
  NavigationComponents,
  FeedbackComponents,
  LayoutComponents,
  FormComponents,
  DataComponents,
  ...CommonHooks,
  WarehouseNavigation,
  WarehouseFooter,
  WarehouseSearch,
  WarehouseNotifications,
  ThemeConfig,
  AccessibilityHelpers,
  PerformanceConfig,
  DevHelpers,
  ComponentUtils
};

export default CommonComponents;
