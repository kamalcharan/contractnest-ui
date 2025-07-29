// src/components/catalog/modals/DeleteConfirmModal.tsx
import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  CATALOG_ITEM_TYPE_LABELS,
  CATALOG_ITEM_TYPE_COLORS
} from '../../../utils/constants/catalog';
import type { CatalogItemDetailed } from '../../../types/catalogTypes';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItemDetailed;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirm,
  isDeleting = false
}) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;
  
  const catalogTitle = CATALOG_ITEM_TYPE_LABELS[item.type];
  const catalogSingular = catalogTitle.slice(0, -1);
  const catalogColor = CATALOG_ITEM_TYPE_COLORS[item.type];
  
  // Get color classes based on catalog type
  const getColorClasses = () => {
    const colorMap = {
      purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
      orange: 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800',
      green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
      gray: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
    };
    return colorMap[catalogColor as keyof typeof colorMap] || 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800';
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Delete {catalogSingular}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6">
          <p className={`text-base mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Are you sure you want to delete this {catalogSingular.toLowerCase()}?
          </p>
          
          {/* Item Details */}
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {item.name}
            </h3>
            {item.short_description && (
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {item.short_description}
              </p>
            )}
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                Version: {item.version_number}
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                Status: {item.status}
              </span>
            </div>
          </div>
          
          {/* Warning Message */}
          <div className={`mt-4 p-3 rounded-lg flex items-start space-x-2 ${
            isDarkMode 
              ? 'bg-yellow-900/20 border border-yellow-700/50' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                This action can be undone. The {catalogSingular.toLowerCase()} will be marked as deleted but can be restored later.
              </p>
              {item.variant_count > 0 && (
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                }`}>
                  This item has {item.variant_count} variant{item.variant_count > 1 ? 's' : ''} that will also be affected.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete {catalogSingular}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;