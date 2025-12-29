// src/pages/catalog-studio/components/category-panel.tsx
import React from 'react';
import { BlockCategory } from '../types';

interface CategoryPanelProps {
  categories: BlockCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
          <span>📁</span> Block Types
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer mb-1 border-2 transition-all ${
              selectedCategory === category.id
                ? 'bg-purple-50 border-purple-500'
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-lg"
              style={{ backgroundColor: category.bgColor }}
            >
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} blocks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPanel;
