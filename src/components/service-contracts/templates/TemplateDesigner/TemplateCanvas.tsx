// src/components/service-contracts/templates/TemplateDesigner/TemplateCanvas.tsx
import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Trash2, Move, Settings, AlertCircle } from 'lucide-react';

interface BlockInstance {
  id: string;
  variantId: string;
  blockType: string;
  name: string;
  position: number;
  isRequired: boolean;
  configuration: Record<string, any>;
  isValid: boolean;
  validationErrors: string[];
  dependencies: string[];
  isSelected: boolean;
  isConfiguring: boolean;
  isDragging: boolean;
}

interface TemplateCanvasProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  onBlockSelect: (instanceId: string | null) => void;
  onBlockRemove: (instanceId: string) => void;
  onBlockMove: (instanceId: string, newPosition: number) => void;
  onDrop: (data: any, targetPosition: number) => void;
  canDrop: (data: any, targetPosition: number) => boolean;
  onDragStart: (data: any) => void;
  onDragEnd: () => void;
}

// Drop Zone Component
const DropZone: React.FC<{
  position: number;
  onDrop: (data: any, position: number) => void;
  canDrop: (data: any, position: number) => boolean;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ position, onDrop, canDrop, isFirst = false, isLast = false }) => {
  const [{ isOver, canDropHere }, drop] = useDrop({
    accept: ['block-variant', 'block-instance'],
    drop: (item: any) => {
      onDrop(item, position);
    },
    canDrop: (item: any) => canDrop(item, position),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropHere: monitor.canDrop()
    })
  });

  const showDropZone = isOver || (isFirst && position === 0);
  const height = isFirst || isLast ? 'h-16' : 'h-8';

  return (
    <div
      ref={drop}
      className={`
        ${height} w-full transition-all duration-200
        ${showDropZone 
          ? canDropHere 
            ? 'bg-primary/20 border-2 border-dashed border-primary' 
            : 'bg-red-100 border-2 border-dashed border-red-300'
          : 'border-2 border-transparent'
        }
        ${isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : ''}
        flex items-center justify-center
      `}
    >
      {showDropZone && (
        <div className={`text-sm font-medium ${canDropHere ? 'text-primary' : 'text-red-500'}`}>
          {canDropHere ? 'Drop block here' : 'Cannot drop here'}
        </div>
      )}
    </div>
  );
};

// Block Item Component
const CanvasBlockItem: React.FC<{
  block: BlockInstance;
  onSelect: () => void;
  onRemove: () => void;
  onDragStart: (data: any) => void;
  onDragEnd: () => void;
}> = ({ block, onSelect, onRemove, onDragStart, onDragEnd }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'block-instance',
    item: {
      type: 'block-instance',
      instanceId: block.id,
      sourceIndex: block.position
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    begin: () => {
      onDragStart({
        type: 'block-instance',
        instanceId: block.id,
        sourceIndex: block.position
      });
    },
    end: () => {
      onDragEnd();
    }
  });

  // Combine refs
  drag(ref);

  // Get block type styling
  const getBlockTypeStyle = (blockType: string) => {
    if (blockType.includes('core') || blockType.includes('contact') || blockType.includes('base-details')) {
      return 'border-blue-200 bg-blue-50 hover:border-blue-300';
    }
    if (blockType.includes('event') || blockType.includes('service') || blockType.includes('milestone')) {
      return 'border-green-200 bg-green-50 hover:border-green-300';
    }
    if (blockType.includes('content') || blockType.includes('clause') || blockType.includes('upload')) {
      return 'border-purple-200 bg-purple-50 hover:border-purple-300';
    }
    if (blockType.includes('commercial') || blockType.includes('billing') || blockType.includes('revenue')) {
      return 'border-orange-200 bg-orange-50 hover:border-orange-300';
    }
    return 'border-gray-200 bg-gray-50 hover:border-gray-300';
  };

  const blockStyle = getBlockTypeStyle(block.blockType);

  return (
    <div
      ref={ref}
      className={`
        relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        ${block.isSelected 
          ? 'border-primary bg-primary/10 shadow-lg' 
          : blockStyle
        }
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${!block.isValid ? 'border-red-300 bg-red-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 cursor-move p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <Move size={14} className="text-muted-foreground" />
      </div>

      {/* Block Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Block Header */}
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-foreground">{block.name}</h3>
            
            {/* Indicators */}
            <div className="flex items-center space-x-1">
              {block.isRequired && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                  Required
                </span>
              )}
              {!block.isValid && (
                <AlertCircle size={16} className="text-red-500" />
              )}
              {block.dependencies.length > 0 && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  Depends: {block.dependencies.length}
                </span>
              )}
            </div>
          </div>

          {/* Block Type */}
          <p className="text-sm text-muted-foreground mb-2">
            {block.blockType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>

          {/* Configuration Summary */}
          {Object.keys(block.configuration).length > 0 && (
            <div className="text-xs text-muted-foreground">
              {Object.keys(block.configuration).length} configuration{Object.keys(block.configuration).length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Validation Errors */}
          {!block.isValid && block.validationErrors.length > 0 && (
            <div className="mt-2 space-y-1">
              {block.validationErrors.slice(0, 2).map((error, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  {error}
                </div>
              ))}
              {block.validationErrors.length > 2 && (
                <div className="text-xs text-red-600">
                  +{block.validationErrors.length - 2} more errors
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="p-1 rounded hover:bg-accent"
            title="Configure block"
          >
            <Settings size={16} className="text-muted-foreground" />
          </button>
          
          {!block.isRequired && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded hover:bg-red-100 text-red-600"
              title="Remove block"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyCanvas: React.FC = () => (
  <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <Move size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Start Building Your Template</h3>
      <p className="text-muted-foreground mb-4">
        Drag blocks from the library on the left to start creating your contract template.
      </p>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Core blocks (required)</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Event blocks (services, milestones)</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
          <span>Content blocks (clauses, media)</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Commercial blocks (billing)</span>
        </div>
      </div>
    </div>
  </div>
);

// Main Template Canvas Component
const TemplateCanvas: React.FC<TemplateCanvasProps> = ({
  blocks,
  selectedBlockId,
  onBlockSelect,
  onBlockRemove,
  onBlockMove,
  onDrop,
  canDrop,
  onDragStart,
  onDragEnd
}) => {
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  const handleBlockSelect = (instanceId: string) => {
    onBlockSelect(instanceId === selectedBlockId ? null : instanceId);
  };

  return (
    <div className="min-h-full p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Canvas Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Template Canvas</h2>
          <p className="text-muted-foreground">
            {blocks.length === 0 
              ? 'Add blocks to start building your template' 
              : `${blocks.length} block${blocks.length !== 1 ? 's' : ''} added`
            }
          </p>
        </div>

        {/* Canvas Content */}
        {blocks.length === 0 ? (
          <div className="group">
            <DropZone 
              position={0} 
              onDrop={onDrop} 
              canDrop={canDrop} 
              isFirst={true} 
            />
            <EmptyCanvas />
          </div>
        ) : (
          <div className="space-y-0 group">
            {/* Drop zone before first block */}
            <DropZone 
              position={0} 
              onDrop={onDrop} 
              canDrop={canDrop} 
              isFirst={true} 
            />

            {/* Blocks with drop zones between them */}
            {sortedBlocks.map((block, index) => (
              <div key={block.id}>
                <CanvasBlockItem
                  block={block}
                  onSelect={() => handleBlockSelect(block.id)}
                  onRemove={() => onBlockRemove(block.id)}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
                
                {/* Drop zone after each block */}
                <DropZone 
                  position={index + 1} 
                  onDrop={onDrop} 
                  canDrop={canDrop} 
                  isLast={index === sortedBlocks.length - 1}
                />
              </div>
            ))}
          </div>
        )}

        {/* Canvas Footer */}
        {blocks.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Template contains {blocks.length} block{blocks.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>Required: {blocks.filter(b => b.isRequired).length}</span>
                <span>Valid: {blocks.filter(b => b.isValid).length}</span>
                <span>Errors: {blocks.filter(b => !b.isValid).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCanvas;