// src/components/catalog/views/CatalogGridView.tsx
import React from 'react';
import { Edit2, Trash2, MoreVertical, Eye, Copy, Package, Settings, Box, Wrench } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CatalogItemDetailed, CatalogItemType } from '../../../types/catalogTypes';
import { 
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_COLORS,
  PRICING_TYPE_LABELS
} from '../../../utils/constants/catalog';

interface CatalogGridViewProps {
  items: CatalogItemDetailed[];
  catalogType: CatalogItemType;
  onEdit: (item: CatalogItemDetailed) => void;
  onDelete: (item: CatalogItemDetailed) => void;
  onToggleStatus?: (item: CatalogItemDetailed) => void;
}

const CatalogGridView: React.FC<CatalogGridViewProps> = ({
  items,
  catalogType,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleMenuToggle = (itemId: string) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Icon mapping
  const iconMap = {
    [CATALOG_ITEM_TYPES.SERVICE]: Package,
    [CATALOG_ITEM_TYPES.EQUIPMENT]: Settings,
    [CATALOG_ITEM_TYPES.SPARE_PART]: Wrench,
    [CATALOG_ITEM_TYPES.ASSET]: Box
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = iconMap[item.type] || Package;
        const colorClasses = CATALOG_TYPE_COLORS[item.type] || 'gray';
        const basePricing = item.pricing_list?.find(p => p.is_base_currency) || item.pricing_list?.[0];
        
        return (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${colorClasses}-100 dark:bg-${colorClasses}-900/20 text-${colorClasses}-600 dark:text-${colorClasses}-400`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuToggle(item.id);
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {openMenuId === item.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        {onToggleStatus && (
                          <button
                            onClick={() => onToggleStatus(item)}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {item.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={() => onDelete(item)}
                          className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.short_description || item.description_content || 'No description available'}
              </p>

              {/* Pricing Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {basePricing ? PRICING_TYPE_LABELS[item.price_attributes.type] || 'Pricing' : 'No Pricing Set'}
                  </span>
                  {item.pricing_summary && item.pricing_summary.count > 1 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.pricing_summary.count} currencies
                    </span>
                  )}
                </div>
                
                {/* Price Display */}
                {basePricing ? (
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {basePricing.currency} {basePricing.price.toLocaleString()}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No pricing set
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Version {item.version_number || 1}
                </span>
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full font-medium
                  ${item.is_active 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }
                `}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onEdit(item)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Quick Edit
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true })}
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