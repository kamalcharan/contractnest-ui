// src/pages/catalog-studio/components/block-wizard/wizard-header.tsx
import React from 'react';
import { X } from 'lucide-react';
import { WizardMode, BlockCategory } from '../../types';

interface WizardHeaderProps {
  mode: WizardMode;
  blockType: string;
  categories: BlockCategory[];
  onClose: () => void;
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ mode, blockType, categories, onClose }) => {
  const category = categories.find((c) => c.id === blockType);

  return (
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        {mode === 'create' ? '➕ Create New Block' : '✏️ Edit Block'}
        <span
          className="text-xs px-2 py-1 rounded-full font-semibold"
          style={{ backgroundColor: category?.bgColor, color: category?.color }}
        >
          {blockType.charAt(0).toUpperCase() + blockType.slice(1)}
        </span>
      </h1>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WizardHeader;
