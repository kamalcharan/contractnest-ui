// src/pages/catalog-studio/components/block-wizard/steps/type-selection.tsx
import React from 'react';
import { BlockCategory } from '../../../types';

interface TypeSelectionStepProps {
  categories: BlockCategory[];
  selectedType: string;
  onSelectType: (typeId: string) => void;
}

const TypeSelectionStep: React.FC<TypeSelectionStepProps> = ({ categories, selectedType, onSelectType }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-1">What type of block do you want to create?</h2>
      <p className="text-sm text-gray-500 mb-6">Each block type has different fields and behaviors.</p>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectType(cat.id)}
            className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
              selectedType === cat.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-sm font-bold text-gray-900">{cat.name}</div>
            <div className="text-xs text-gray-500">{cat.description.split(' ').slice(0, 3).join(' ')}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3">
        <span className="text-lg">💡</span>
        <div className="text-sm text-blue-800">
          <strong>Tip:</strong> Service blocks are for work that needs to be done. Spare Parts are physical products. Billing blocks define payment structures.
        </div>
      </div>
    </div>
  );
};

export default TypeSelectionStep;
