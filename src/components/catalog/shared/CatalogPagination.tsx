// src/components/catalog/shared/CatalogPagination.tsx
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
  
  // Button styles - Themed version
  const getButtonStyles = (isActive: boolean = false, isDisabled: boolean = false) => {
    const baseClasses = 'transition-all duration-200';
    
    if (isDisabled) {
      return {
        className: `${baseClasses} cursor-not-allowed border opacity-50`,
        style: {
          backgroundColor: colors.utility.secondaryBackground,
          color: colors.utility.secondaryText,
          borderColor: `${colors.utility.primaryText}20`
        }
      };
    }
    
    if (isActive) {
      return {
        className: `${baseClasses} border shadow-md text-white`,
        style: {
          background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
          borderColor: colors.brand.primary
        }
      };
    }
    
    return {
      className: `${baseClasses} hover:opacity-80 border`,
      style: {
        backgroundColor: colors.utility.secondaryBackground,
        color: colors.utility.primaryText,
        borderColor: `${colors.utility.primaryText}20`
      }
    };
  };
  
  const pageSizeOptions = [10, 20, 50, 100];
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Page Size Selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <label 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            Show
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-sm border transition-all hover:opacity-80 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText,
              borderColor: `${colors.utility.primaryText}20`,
              '--tw-ring-color': `${colors.brand.primary}20`
            } as React.CSSProperties}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
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
          {...getButtonStyles(false, currentPage === 1)}
          className={`p-2 rounded-lg ${getButtonStyles(false, currentPage === 1).className}`}
          style={getButtonStyles(false, currentPage === 1).style}
          aria-label="First page"
          title="Go to first page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${getButtonStyles(false, currentPage === 1).className}`}
          style={getButtonStyles(false, currentPage === 1).style}
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
                  className="px-2 py-1"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }
            
            const page = pageNum as number;
            const isActive = page === currentPage;
            const buttonStyle = getButtonStyles(isActive);
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] px-3 py-1.5 text-sm font-medium rounded-lg ${buttonStyle.className}`}
                style={buttonStyle.style}
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
          className={`p-2 rounded-lg ${getButtonStyles(false, currentPage === totalPages).className}`}
          style={getButtonStyles(false, currentPage === totalPages).style}
          aria-label="Next page"
          title="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${getButtonStyles(false, currentPage === totalPages).className}`}
          style={getButtonStyles(false, currentPage === totalPages).style}
          aria-label="Last page"
          title="Go to last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Page Info */}
      <div 
        className="text-sm"
        style={{ color: colors.utility.secondaryText }}
      >
        Page <span 
          className="font-medium"
          style={{ color: colors.utility.primaryText }}
        >{currentPage}</span> of{' '}
        <span 
          className="font-medium"
          style={{ color: colors.utility.primaryText }}
        >{totalPages}</span>
      </div>
    </div>
  );
};

export default CatalogPagination;