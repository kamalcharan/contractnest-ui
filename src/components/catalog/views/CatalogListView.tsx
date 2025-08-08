// src/components/catalog/views/CatalogListView.tsx
import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Copy, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from '../../../utils/helpers/catalogHelpers';
import type { CatalogItemDetailed, CatalogItemType } from '../../../types/catalogTypes';
import { 
  CATALOG_TYPE_LABELS,
  PRICING_TYPE_LABELS,
  CURRENCY_SYMBOLS
} from '../../../utils/constants/catalog';

interface CatalogListViewProps {
  items: CatalogItemDetailed[];
  catalogType: CatalogItemType;
  onEdit: (item: CatalogItemDetailed) => void;
  onView: (item: CatalogItemDetailed) => void;
  onDelete: (item: CatalogItemDetailed) => void;
  onRestore: (item: CatalogItemDetailed) => void;
  onToggleStatus: (item: CatalogItemDetailed) => void;
  onDuplicate: (item: CatalogItemDetailed) => void;
}

const CatalogListView: React.FC<CatalogListViewProps> = ({
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
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleRowExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  const handleBulkAction = (action: 'delete' | 'activate' | 'deactivate') => {
    // Implement bulk actions here
    console.log(`Bulk ${action} for items:`, Array.from(selectedItems));
  };

  return (
    <div className="bg-card shadow-sm rounded-lg overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="relative w-12 px-6">
                <input
                  type="checkbox"
                  checked={selectedItems.size === items.length && items.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pricing
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {items.map((item) => {
              const isExpanded = expandedRows.has(item.id);
              const isSelected = selectedItems.has(item.id);
              const basePricing = item.pricing_list?.find(p => p.is_base_currency) || item.pricing_list?.[0];
              
              return (
                <React.Fragment key={item.id}>
                  <tr className={`${isSelected ? 'bg-primary/5' : ''} hover:bg-muted/30 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.short_description || item.description_content}
                          </div>
                        </div>
                        {item.pricing_list && item.pricing_list.length > 1 && (
                          <button
                            onClick={() => toggleRowExpansion(item.id)}
                            className="ml-2 p-1 hover:bg-muted rounded"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted text-muted-foreground">
                        {CATALOG_TYPE_LABELS[item.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {basePricing ? (
                          <>
                            <div className="font-medium text-foreground">
                              {CURRENCY_SYMBOLS[basePricing.currency as keyof typeof CURRENCY_SYMBOLS] || basePricing.currency}{' '}
                              {basePricing.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {PRICING_TYPE_LABELS[item.price_attributes?.type] || 'Fixed'}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDistanceToNow(item.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onView(item)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Edit item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDuplicate(item)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Duplicate item"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {item.is_active ? (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onRestore(item)}
                            className="text-primary hover:text-primary/80 transition-colors"
                            title="Restore item"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row for multi-currency pricing */}
                  {isExpanded && item.pricing_list && item.pricing_list.length > 1 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-muted/20">
                        <div className="text-sm">
                          <h4 className="font-medium text-foreground mb-3">
                            All Currency Pricing
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {item.pricing_list.map((pricing, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <span className={`text-sm ${pricing.is_base_currency ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                                  {pricing.currency}
                                </span>
                                <span className="text-sm text-foreground">
                                  {pricing.price.toLocaleString()}
                                </span>
                                {pricing.is_base_currency && (
                                  <span className="text-xs text-primary">(Base)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state for table */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items to display</p>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedItems.size > 0 && (
        <div className="bg-muted/30 px-6 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm font-medium bg-card border border-border rounded-md hover:bg-muted transition-colors"
              >
                Activate
              </button>
              <button 
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm font-medium bg-card border border-border rounded-md hover:bg-muted transition-colors"
              >
                Deactivate
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm font-medium text-destructive bg-card border border-border rounded-md hover:bg-destructive/10 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogListView;