//src/components/template-designer/blocks/BlockCategory.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockCategory as BlockCategoryType, BlockMaster } from '@/utils/fakejson/templateBlocks';
import BlockItem from './BlockItem';

interface BlockCategoryProps {
  category: BlockCategoryType;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm?: string;
}

const BlockCategory: React.FC<BlockCategoryProps> = ({
  category,
  isExpanded,
  onToggle,
  searchTerm
}) => {
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([]);

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev =>
      prev.includes(blockId)
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  // Get icon component
  const IconComponent = Icons[category.icon as keyof typeof Icons] || Icons.Layers;

  return (
    <div className="select-none">
      <button
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors",
          isExpanded && "bg-accent"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4" />
          <span className="font-medium text-sm">{category.name}</span>
          <span className="text-xs text-muted-foreground">
            ({category.blocks.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="pl-2 mt-1 space-y-1">
          {category.blocks.map(block => (
            <BlockItem
              key={block.id}
              block={block}
              isExpanded={expandedBlocks.includes(block.id)}
              onToggle={() => toggleBlock(block.id)}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockCategory;
