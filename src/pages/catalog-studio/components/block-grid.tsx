// src/pages/catalog-studio/components/block-grid.tsx
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Block, BlockCategory } from '../types';
import BlockCard from './block-card';

interface BlockGridProps {
  blocks: Block[];
  category: BlockCategory;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBlockClick: (block: Block) => void;
  onAddBlock: () => void;
}

const BlockGrid: React.FC<BlockGridProps> = ({
  blocks,
  category,
  searchQuery,
  onSearchChange,
  onBlockClick,
  onAddBlock,
}) => {
  const filteredBlocks = blocks.filter((block) => {
    if (searchQuery === '') return true;
    return (
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: category.bgColor }}
          >
            {category.icon}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{category.name} Blocks</h2>
            <p className="text-xs text-gray-500">{category.description}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBlocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              category={category}
              onClick={() => onBlockClick(block)}
            />
          ))}
          <div
            onClick={onAddBlock}
            className="bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center min-h-[180px] gap-2 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600">
              Add {category.name} Block
            </span>
          </div>
        </div>
        {filteredBlocks.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-lg font-semibold text-gray-700">No blocks found</div>
            <div className="text-sm text-gray-500 mt-1">Try adjusting your search query</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockGrid;
