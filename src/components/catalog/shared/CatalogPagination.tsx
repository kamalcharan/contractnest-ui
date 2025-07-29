// src/components/catalog/shared/CatalogPagination.tsx
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageSize = false,
  pageSize = 20,
  onPageSizeChange
}) => {
  const { isDarkMode } = useTheme();
  
  // Calculate page numbers to display
  const pageNumbers = useMemo(() => {
    const delta = 2; // Pages to show on each side of current page
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;
    
    // Always show first page
    range.push(1);
    
    // Calculate range
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    
    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    // Add dots where needed
    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i as number;
    });
    
    return rangeWithDots;
  }, [currentPage, totalPages]);
  
  // Button styles
  const getButtonStyles = (isActive: boolean = false, isDisabled: boolean = false) => {
    if (isDisabled) {
      return isDarkMode
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
        : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200';
    }
    
    if (isActive) {
      return isDarkMode
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-transparent shadow-md'
        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-transparent shadow-md';
    }
    
    return isDarkMode
      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400';
  };
  
  const pageSizeOptions = [10, 20, 50, 100];
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Page Size Selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Show
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            per page
          </span>
        </div>
      )}
      
      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${getButtonStyles(false, currentPage === 1)}`}
          aria-label="First page"
          title="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 ${getButtonStyles(false, currentPage === 1)}`}
          aria-label="Previous page"
          title="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-1 px-2">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className={`px-2 py-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }
            
            const page = pageNum as number;
            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  getButtonStyles(isActive)
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${getButtonStyles(false, currentPage === totalPages)}`}
          aria-label="Next page"
          title="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 ${getButtonStyles(false, currentPage === totalPages)}`}
          aria-label="Last page"
          title="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Page Info */}
      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>
    </div>
  );
};

export default CatalogPagination;