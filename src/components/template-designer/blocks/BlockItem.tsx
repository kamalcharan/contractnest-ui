//src/components/template-designer/blocks/BlockItem.tsx

import React from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockMaster } from '@/utils/fakejson/templateBlocks';

interface BlockItemProps {
  block: BlockMaster;
  isExpanded: boolean;
  onToggle: () => void;
  searchTerm?: string;
}

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  isExpanded,
  onToggle,
  searchTerm
}) => {
  // Render block icons
  const renderIcons = () => {
    return (
      <div className="flex -space-x-1">
        {block.iconNames.slice(0, 2).map((iconName, index) => {
          const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.Box;
          return (
            <div
              key={index}
              className="relative bg-background rounded-full p-1 border"
              style={{ borderColor: block.hexColor }}
            >
              <IconComponent
                className="h-3 w-3"
                style={{ color: block.hexColor }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Highlight search term
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-inherit">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, variant: any) => {
    const dragData = {
      type: 'block',
      blockId: block.id,
      variantId: variant.id,
      nodeType: variant.nodeType,
      data: {
        label: variant.name,
        description: variant.description,
        blockType: block.blockType,
        config: variant.defaultConfig,
        iconNames: block.iconNames,
        hexColor: block.hexColor,
        borderStyle: block.borderStyle,
        canRotate: block.canRotate,
        canResize: block.canResize,
        isBidirectional: block.isBidirectional
      }
    };
    
    e.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="group">
      <button
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-md transition-all",
          "hover:bg-accent/50",
          isExpanded && "bg-accent/50"
        )}
        style={{
          borderLeft: `3px ${block.borderStyle} ${block.hexColor}`
        }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 flex-1">
          {renderIcons()}
          <span className="text-sm font-medium">
            {highlightText(block.name)}
          </span>
        </div>
        {block.variants.length > 0 && (
          <>
            <span className="text-xs text-muted-foreground mr-2">
              {block.variants.length}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </>
        )}
      </button>

      {isExpanded && block.variants.length > 0 && (
        <div className="pl-8 mt-1 space-y-1">
          {block.variants.map(variant => (
            <div
              key={variant.id}
              draggable
              onDragStart={(e) => handleDragStart(e, variant)}
              className={cn(
                "p-3 rounded-md cursor-grab transition-all",
                "hover:shadow-md active:cursor-grabbing",
                "border bg-card"
              )}
              style={{
                borderColor: `${block.hexColor}40`,
                backgroundColor: `${block.hexColor}05`
              }}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {highlightText(variant.name)}
                  </div>
                  {variant.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {highlightText(variant.description)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockItem;