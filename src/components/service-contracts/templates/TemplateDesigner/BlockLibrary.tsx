// src/components/service-contracts/templates/TemplateDesigner/BlockLibrary.tsx
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ChevronDown, ChevronRight, Grip } from 'lucide-react';
import { useBlocks } from '../../../../hooks/service-contracts/blocks/useBlocks';
import { BlockCategory, BlockMaster, BlockVariant } from '../../../../types/service-contracts/block';

// Drag item type
export const BLOCK_DRAG_TYPE = 'BLOCK_VARIANT';

// Draggable Block Variant Component
interface DraggableBlockVariantProps {
  variant: BlockVariant;
  blockMaster: BlockMaster;
  category: BlockCategory;
}

const DraggableBlockVariant: React.FC<DraggableBlockVariantProps> = ({ 
  variant, 
  blockMaster, 
  category 
}) => {
  // Updated useDrag API - using item() instead of deprecated begin()
  const [{ isDragging }, drag] = useDrag({
    type: BLOCK_DRAG_TYPE,
    item: () => ({
      id: variant.id,
      blockId: blockMaster.id,
      categoryId: category.id,
      name: variant.name,
      description: variant.description,
      nodeType: variant.node_type,
      defaultConfig: variant.default_config,
      blockMaster,
      category
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-move
        transition-all duration-200 hover:shadow-md
        ${isDragging 
          ? 'opacity-50 shadow-lg border-primary bg-primary/5' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
        }
      `}
    >
      <div className="flex-shrink-0">
        <Grip className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {blockMaster.hex_color && (
            <div 
              className="w-5 h-5 rounded"
              style={{ backgroundColor: blockMaster.hex_color + '33' }}
            >
              <div 
                className="w-full h-full rounded border-2"
                style={{ borderColor: blockMaster.hex_color }}
              />
            </div>
          )}
          <h4 className="font-medium text-sm text-foreground truncate">
            {variant.name}
          </h4>
        </div>
        
        {variant.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {variant.description}
          </p>
        )}
      </div>
    </div>
  );
};

// Block Master Component (contains variants)
interface BlockMasterComponentProps {
  blockMaster: BlockMaster;
  category: BlockCategory;
}

const BlockMasterComponent: React.FC<BlockMasterComponentProps> = ({ blockMaster, category }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If no variants, show the master as draggable
  if (!blockMaster.variants || blockMaster.variants.length === 0) {
    return (
      <DraggableBlockVariant
        variant={{
          id: `${blockMaster.id}-default`,
          block_id: blockMaster.id,
          name: blockMaster.name,
          description: blockMaster.description,
          node_type: blockMaster.node_type,
          default_config: {},
          active: true,
          created_at: blockMaster.created_at || new Date().toISOString(),
          parent_id: null,
          version: 1
        }}
        blockMaster={blockMaster}
        category={category}
      />
    );
  }

  // If single variant, show it directly
  if (blockMaster.variants.length === 1) {
    return (
      <DraggableBlockVariant
        variant={blockMaster.variants[0]}
        blockMaster={blockMaster}
        category={category}
      />
    );
  }

  // Multiple variants - show expandable list
  return (
    <div className="space-y-1">
      {/* Master Block Header */}
      <div
        className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          {blockMaster.hex_color && (
            <div 
              className="w-5 h-5 rounded"
              style={{ backgroundColor: blockMaster.hex_color + '33' }}
            >
              <div 
                className="w-full h-full rounded border-2"
                style={{ borderColor: blockMaster.hex_color }}
              />
            </div>
          )}
          <div>
            <h3 className="font-medium text-sm text-foreground">
              {blockMaster.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {blockMaster.variants.length} variants
            </p>
          </div>
        </div>
      </div>

      {/* Variants List */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {blockMaster.variants.map((variant) => (
            <DraggableBlockVariant
              key={variant.id}
              variant={variant}
              blockMaster={blockMaster}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Block Category Component
interface BlockCategoryComponentProps {
  category: BlockCategory;
}

const BlockCategoryComponent: React.FC<BlockCategoryComponentProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check for blockMasters or masters property
  const masters = (category as any).blockMasters || (category as any).masters || [];
  
  if (!masters || masters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div
        className="flex items-center gap-2 p-3 mb-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-foreground" />
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <div className="w-5 h-5 text-primary">
            <div className="w-5 h-5 bg-primary/20 rounded" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {masters.length} blocks
        </div>
      </div>

      {/* Block Masters List */}
      {isExpanded && (
        <div className="space-y-2">
          {masters.map((blockMaster: any) => (
            <BlockMasterComponent
              key={blockMaster.id}
              blockMaster={blockMaster}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Block Library Component
interface BlockLibraryProps {
  className?: string;
}

const BlockLibrary: React.FC<BlockLibraryProps> = ({ className = '' }) => {
  // Call useBlocks at the top level (fixed hook call issue)
  const { categories, templateBuilderBlocks, isLoading, error } = useBlocks();

  // Use templateBuilderBlocks if available, otherwise fall back to categories
  const displayData = templateBuilderBlocks.length > 0 ? templateBuilderBlocks : categories;

  // Debug logging
  console.log('BlockLibrary Debug:', {
    categories: categories.length,
    templateBuilderBlocks: templateBuilderBlocks.length,
    displayData: displayData.length,
    isLoading,
    error
  });

  if (isLoading) {
    return (
      <div className={`${className} p-4`}>
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-4`}>
        <div className="text-center">
          <div className="text-destructive mb-2">⚠️</div>
          <h3 className="font-semibold text-foreground mb-1">Failed to Load Blocks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error || 'Unable to load block library'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <div className={`${className} p-4`}>
        <div className="text-center">
          <div className="text-muted-foreground mb-2">📦</div>
          <h3 className="font-semibold text-foreground mb-1">No Blocks Available</h3>
          <p className="text-sm text-muted-foreground">
            The block library is empty. Blocks will appear here when available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} p-4 space-y-2`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Block Library
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag blocks to the canvas to build your template
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {displayData.map((category) => (
          <BlockCategoryComponent
            key={category.id}
            category={category}
          />
        ))}
      </div>
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-muted/30 rounded text-xs text-muted-foreground">
        <div>Debug: {displayData.length} categories loaded</div>
        <div>Source: {templateBuilderBlocks.length > 0 ? 'templateBuilderBlocks' : 'categories'}</div>
      </div>
    </div>
  );
};

export default BlockLibrary;