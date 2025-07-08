/*
 * File: frontend/src/components/common/SearchBox.js
 * Description: Advanced search component with suggestions, filters, and keyboard navigation
 * Author: Warehouse Management System
 * Created: 2025
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './SearchBox.css';

const SearchBox = ({
  // Basic props
  value = '',
  placeholder = 'Tìm kiếm...',
  onChange,
  onSearch,
  onClear,
  
  // Appearance
  size = 'md', // sm, md, lg
  variant = 'default', // default, outlined, filled, minimal
  width = 'auto',
  
  // Features
  showClearButton = true,
  showSearchIcon = true,
  showFilterButton = false,
  loading = false,
  disabled = false,
  error = false,
  
  // Suggestions
  suggestions = [],
  showSuggestions = true,
  maxSuggestions = 8,
  highlightMatches = true,
  
  // Recent searches
  recentSearches = [],
  showRecentSearches = true,
  maxRecentSearches = 5,
  
  // Filters
  filters = [],
  activeFilters = {},
  onFilterChange,
  
  // Debouncing
  debounceMs = 300,
  
  // Callbacks
  onSuggestionClick,
  onFocus,
  onBlur,
  onKeyDown,
  
  // Custom styling
  className = '',
  inputProps = {}
}) => {
  // State
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  // Refs
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Sync external value
  useEffect(() => {
    setInputValue(value);
    setDebouncedValue(value);
  }, [value]);
  
  // Debounce input changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
      onChange?.(inputValue);
    }, debounceMs);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, debounceMs, onChange]);
  
  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim() || !showSuggestions) return [];
    
    const query = inputValue.toLowerCase();
    return suggestions
      .filter(suggestion => {
        const text = suggestion.title || suggestion.text || suggestion;
        return text.toLowerCase().includes(query);
      })
      .slice(0, maxSuggestions);
  }, [inputValue, suggestions, showSuggestions, maxSuggestions]);
  
  // Combine suggestions with recent searches
  const displayItems = useMemo(() => {
    const items = [];
    
    // Add recent searches if no input
    if (!inputValue.trim() && showRecentSearches && recentSearches.length > 0) {
      items.push({
        type: 'section',
        title: 'Tìm kiếm gần đây'
      });
      
      recentSearches.slice(0, maxRecentSearches).forEach(search => {
        items.push({
          type: 'recent',
          title: search.title || search,
          description: search.description,
          icon: '🕒'
        });
      });
    }
    
    // Add filtered suggestions
    if (filteredSuggestions.length > 0) {
      if (items.length > 0) {
        items.push({
          type: 'section',
          title: 'Gợi ý'
        });
      }
      
      filteredSuggestions.forEach(suggestion => {
        items.push({
          type: 'suggestion',
          ...suggestion
        });
      });
    }
    
    return items;
  }, [inputValue, filteredSuggestions, recentSearches, showRecentSearches, maxRecentSearches]);
  
  // Handle input change
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setHighlightedIndex(-1);
    
    if (newValue.trim()) {
      setShowDropdown(true);
    }
  }, []);
  
  // Handle input focus
  const handleInputFocus = useCallback((e) => {
    setShowDropdown(true);
    setShowFilters(false);
    onFocus?.(e);
  }, [onFocus]);
  
  // Handle input blur
  const handleInputBlur = useCallback((e) => {
    // Delay hiding dropdown to allow clicks
    setTimeout(() => {
      setShowDropdown(false);
      setShowFilters(false);
    }, 150);
    onBlur?.(e);
  }, [onBlur]);
  
  // Handle clear
  const handleClear = useCallback(() => {
    setInputValue('');
    setDebouncedValue('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
    onClear?.();
    onChange?.('');
  }, [onClear, onChange]);
  
  // Handle search
  const handleSearch = useCallback((searchValue = inputValue) => {
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
      setShowDropdown(false);
    }
  }, [inputValue, onSearch]);
  
  // Handle suggestion click
  const handleSuggestionClick = useCallback((item) => {
    const searchValue = item.title || item.text || item;
    setInputValue(searchValue);
    setDebouncedValue(searchValue);
    setShowDropdown(false);
    onSuggestionClick?.(item);
    onChange?.(searchValue);
    handleSearch(searchValue);
  }, [onSuggestionClick, onChange, handleSearch]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const actionableItems = displayItems.filter(item => item.type !== 'section');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < actionableItems.length - 1 ? prev + 1 : 0
        );
        setShowDropdown(true);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : actionableItems.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && actionableItems[highlightedIndex]) {
          handleSuggestionClick(actionableItems[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
        
      case 'Escape':
        setShowDropdown(false);
        setShowFilters(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
        
      default:
        break;
    }
    
    onKeyDown?.(e);
  }, [displayItems, highlightedIndex, handleSuggestionClick, handleSearch, onKeyDown]);
  
  // Toggle filters
  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
    setShowDropdown(false);
  }, []);
  
  // Highlight matching text
  const highlightText = useCallback((text, query) => {
    if (!highlightMatches || !query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
          {part}
        </mark>
      ) : part
    );
  }, [highlightMatches]);
  
  // Render suggestion item
  const renderSuggestionItem = useCallback((item, index) => {
    if (item.type === 'section') {
      return (
        <div key={`section-${index}`} className="search-section-title">
          {item.title}
        </div>
      );
    }
    
    const actionableIndex = displayItems
      .slice(0, index)
      .filter(i => i.type !== 'section').length;
    
    const isHighlighted = actionableIndex === highlightedIndex;
    
    return (
      <div
        key={index}
        className={`suggestion-item ${isHighlighted ? 'highlighted' : ''}`}
        onClick={() => handleSuggestionClick(item)}
        onMouseEnter={() => setHighlightedIndex(actionableIndex)}
      >
        {item.icon && (
          <div className="suggestion-icon">{item.icon}</div>
        )}
        <div className="suggestion-content">
          <div className="suggestion-title">
            {highlightText(item.title || item.text || item, inputValue)}
          </div>
          {item.description && (
            <div className="suggestion-description">
              {item.description}
            </div>
          )}
        </div>
        {item.meta && (
          <div className="suggestion-meta">{item.meta}</div>
        )}
      </div>
    );
  }, [displayItems, highlightedIndex, highlightText, inputValue, handleSuggestionClick]);
  
  return (
    <div 
      className={`search-container ${width === 'full' ? 'full-width' : ''} ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
     
      
      
      {/* Suggestions Dropdown */}
      {showDropdown && displayItems.length > 0 && (
        <div
          ref={dropdownRef}
          className={`search-suggestions show`}
          role="listbox"
          aria-label="Gợi ý tìm kiếm"
        >
          {displayItems.map(renderSuggestionItem)}
        </div>
      )}
      
      {/* No Results */}
      {showDropdown && inputValue.trim() && displayItems.length === 0 && (
        <div className="search-suggestions show">
          <div className="search-no-results">
            <div className="search-no-results-icon">🔍</div>
            <div className="search-no-results-text">
              Không tìm thấy kết quả cho "{inputValue}"
            </div>
          </div>
        </div>
      )}
      
      {/* Advanced Filters */}
      {showFilters && filters.length > 0 && (
        <div className="search-filters show">
          <div className="search-filters-grid">
            {filters.map((filter, index) => (
              <div key={index} className="search-filter-group">
                <label className="search-filter-label">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <select
                    className="search-filter-select"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {filter.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type || 'text'}
                    className="search-filter-input"
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="search-filters-actions">
            <button
              type="button"
              className="search-filter-btn-action"
              onClick={() => {
                Object.keys(activeFilters).forEach(key => {
                  onFilterChange?.(key, '');
                });
              }}
            >
              Xóa bộ lọc
            </button>
            <button
              type="button"
              className="search-filter-btn-action primary"
              onClick={() => setShowFilters(false)}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
      
      {/* Active Filters */}
      {Object.entries(activeFilters).some(([, value]) => value) && (
        <div className="search-active-filters">
          {Object.entries(activeFilters)
            .filter(([, value]) => value)
            .map(([key, value]) => {
              const filter = filters.find(f => f.key === key);
              const displayValue = filter?.type === 'select' 
                ? filter.options?.find(opt => opt.value === value)?.label || value
                : value;
              
              return (
                <div key={key} className="search-active-filter">
                  <span>{filter?.label}: {displayValue}</span>
                  <button
                    type="button"
                    className="search-active-filter-remove"
                    onClick={() => onFilterChange?.(key, '')}
                    aria-label={`Xóa bộ lọc ${filter?.label}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

// Hook for search state management
export const useSearch = (initialValue = '') => {
  const [query, setQuery] = useState(initialValue);
  const [filters, setFilters] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  
  const handleSearch = useCallback((searchQuery) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return newSearches.slice(0, 10); // Keep last 10 searches
      });
    }
  }, []);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);
  
  return {
    query,
    setQuery,
    filters,
    setFilters,
    recentSearches,
    handleSearch,
    handleFilterChange,
    clearFilters,
    clearRecentSearches
  };
};

// Simple search component for basic use cases
export const SimpleSearch = ({ 
  placeholder = 'Tìm kiếm...', 
  onSearch, 
  className = '',
  ...props 
}) => {
  const [value, setValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <SearchBox
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        onSearch={onSearch}
        showSuggestions={false}
        {...props}
      />
    </form>
  );
};

// Search bar with integrated filters
export const SearchBar = ({
  value,
  onChange,
  onSearch,
  filters = [],
  activeFilter,
  onFilterChange,
  className = '',
  ...props
}) => (
  <div className={`search-bar ${className}`}>
    <SearchBox
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      showSuggestions={false}
      {...props}
    />
    
    {filters.length > 0 && (
      <div className="search-bar-filters">
        {filters.map((filter, index) => (
          <button
            key={index}
            type="button"
            className={`search-bar-filter ${activeFilter === filter.value ? 'active' : ''}`}
            onClick={() => onFilterChange?.(filter.value)}
          >
            {filter.icon && <span>{filter.icon}</span>}
            {filter.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

// Warehouse-specific search suggestions
export const getWarehouseSuggestions = (query, data = []) => {
  const suggestions = [];
  
  // Product suggestions
  const products = data.filter(item => 
    item.type === 'product' && 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  products.forEach(product => {
    suggestions.push({
      title: product.name,
      description: `Mã: ${product.code} - Tồn kho: ${product.stock}`,
      icon: '📦',
      meta: product.category,
      type: 'product',
      data: product
    });
  });
  
  // Location suggestions
  const locations = data.filter(item => 
    item.type === 'location' && 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  locations.forEach(location => {
    suggestions.push({
      title: location.name,
      description: `Khu vực: ${location.area} - Trạng thái: ${location.status}`,
      icon: '📍',
      meta: location.zone,
      type: 'location',
      data: location
    });
  });
  
  // Order suggestions
  const orders = data.filter(item => 
    item.type === 'order' && 
    (item.id.includes(query) || item.customer.toLowerCase().includes(query.toLowerCase()))
  );
  
  orders.forEach(order => {
    suggestions.push({
      title: `Đơn hàng #${order.id}`,
      description: `Khách hàng: ${order.customer}`,
      icon: '🧾',
      meta: order.status,
      type: 'order',
      data: order
    });
  });
  
  return suggestions;
};

// Common search filters for warehouse
export const warehouseSearchFilters = [
  {
    key: 'category',
    label: 'Danh mục',
    type: 'select',
    options: [
      { value: 'electronics', label: 'Điện tử' },
      { value: 'furniture', label: 'Nội thất' },
      { value: 'clothing', label: 'Quần áo' },
      { value: 'food', label: 'Thực phẩm' }
    ]
  },
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      { value: 'active', label: 'Hoạt động' },
      { value: 'inactive', label: 'Không hoạt động' },
      { value: 'pending', label: 'Đang chờ' }
    ]
  },
  {
    key: 'dateFrom',
    label: 'Từ ngày',
    type: 'date'
  },
  {
    key: 'dateTo',
    label: 'Đến ngày',
    type: 'date'
  },
  {
    key: 'minPrice',
    label: 'Giá từ',
    type: 'number',
    placeholder: '0'
  },
  {
    key: 'maxPrice',
    label: 'Giá đến',
    type: 'number',
    placeholder: '1000000'
  }
];

export default SearchBox;