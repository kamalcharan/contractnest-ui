// src/components/catalog/views/CatalogGridView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, MoreVertical, Eye, Copy, Package, Settings, Box, Wrench, RotateCcw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from '../../../utils/helpers/catalogHelpers';
import type { CatalogItemDetailed, CatalogItemType } from '../../../types/catalogTypes';
import { 
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_LABELS,
  PRICING_TYPE_LABELS,
  CURRENCY_SYMBOLS
} from '../../../utils/constants/catalog';

interface CatalogGridViewProps {
  items: CatalogItemDetailed[];
  catalogType: CatalogItemType;
  onEdit: (item: CatalogItemDetailed) => void;
  onView: (item: CatalogItemDetailed) => void;
  onDelete: (item: CatalogItemDetailed) => void;
  onRestore: (item: CatalogItemDetailed) => void;
  onToggleStatus: (item: CatalogItemDetailed) => void;
  onDuplicate: (item: CatalogItemDetailed) => void;
}

const CatalogGridView: React.FC<CatalogGridViewProps> = ({
  items,
  catalogType,
  onEdit,
  onView,
  onDelete,
  onRestore,
  onToggleStatus,
  onDuplicate
}) => {
  const { isDarkMode } = useTheme();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMenuToggle = (itemId: string) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  // Icon mapping
  const iconMap = {
    [CATALOG_ITEM_TYPES.SERVICE]: Package,
    [CATALOG_ITEM_TYPES.EQUIPMENT]: Settings,
    [CATALOG_ITEM_TYPES.SPARE_PART]: Wrench,
    [CATALOG_ITEM_TYPES.ASSET]: Box
  };

  // Get type-specific styling
  const getTypeStyles = (type: CatalogItemType) => {
    const styleMap = {
      [CATALOG_ITEM_TYPES.SERVICE]: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      [CATALOG_ITEM_TYPES.EQUIPMENT]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      [CATALOG_ITEM_TYPES.SPARE_PART]: 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
      [CATALOG_ITEM_TYPES.ASSET]: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    };
    return styleMap[type] || styleMap[CATALOG_ITEM_TYPES.SERVICE];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = iconMap[item.type] || Package;
        const typeStyles = getTypeStyles(item.type);
        const basePricing = item.pricing_list?.find(p => p.is_base_currency) || item.pricing_list?.[0];
        
        return (
          <div
            key={item.id}
            className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border group"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyles}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {CATALOG_TYPE_LABELS[item.type]}
                    </p>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="relative" ref={(el) => menuRefs.current[item.id] = el}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(item.id);
                    }}
                    className="p-1 rounded-md hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                  
                  {openMenuId === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onView(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            onEdit(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDuplicate(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center transition-colors"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => {
                            onToggleStatus(item);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center transition-colors"
                        >
                          {item.is_active ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </button>
                        <hr className="my-1 border-border" />
                        <button
                          onClick={() => {
                            if (item.is_active) {
                              onDelete(item);
                            } else {
                              onRestore(item);
                            }
                            setOpenMenuId(null);
                          }}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center transition-colors ${
                            item.is_active 
                              ? 'text-destructive hover:bg-destructive/10' 
                              : 'text-primary hover:bg-primary/10'
                          }`}
                        >
                          {item.is_active ? (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restore
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.short_description || item.description_content || 'No description available'}
              </p>

              {/* Pricing Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {basePricing ? PRICING_TYPE_LABELS[item.price_attributes?.type] || 'Pricing' : 'No Pricing Set'}
                  </span>
                  {item.pricing_summary && item.pricing_summary.count > 1 && (
                    <span className="text-xs text-muted-foreground">
                      {item.pricing_summary.count} currencies
                    </span>
                  )}
                </div>
                
                {/* Price Display */}
                {basePricing ? (
                  <div className="text-lg font-semibold text-foreground">
                    {CURRENCY_SYMBOLS[basePricing.currency as keyof typeof CURRENCY_SYMBOLS] || basePricing.currency}{' '}
                    {basePricing.price.toLocaleString()}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No pricing set
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Version {item.version_number || 1}
                </span>
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs
                  ${item.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }
                `}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-muted/30 border-t border-border">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onEdit(item)}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Quick Edit
                </button>
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(item.updated_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogGridView;