// src/components/template-designer/nodes/BaseNode.tsx
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BaseNodeData {
  label: string;
  description?: string;
  blockType: string;
  iconNames?: string[];
  hexColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  canRotate?: boolean;
  canResize?: boolean;
  isBidirectional?: boolean;
  config?: any;
}

interface BaseNodeProps extends NodeProps<BaseNodeData> {
  children?: React.ReactNode;
  className?: string;
}

const BaseNode: React.FC<BaseNodeProps> = memo(({ 
  data, 
  id, 
  selected,
  children,
  className 
}) => {
  const {
    label,
    description,
    iconNames = [],
    hexColor = '#6B7280',
    borderStyle = 'solid',
    canResize = false,
    isBidirectional = false
  } = data;

  // Clean ID for handle IDs
  const cleanId = id.replace(/[^a-zA-Z0-9]/g, '');

  // Render icons
  const renderIcons = () => {
    if (!iconNames?.length) return null;

    return (
      <div className="flex -space-x-2 mb-2">
        {iconNames.slice(0, 2).map((iconName, index) => {
          const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.Box;
          return (
            <div
              key={index}
              className="relative bg-background rounded-full p-1.5 border-2"
              style={{ 
                borderColor: hexColor,
                zIndex: iconNames.length - index
              }}
            >
              <IconComponent
                size={16}
                style={{ color: hexColor }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg shadow-sm transition-all duration-200",
        "bg-background",
        selected && "shadow-lg ring-2 ring-primary ring-offset-2",
        canResize && "resize overflow-hidden",
        className
      )}
      style={{
        border: `2px ${borderStyle} ${hexColor}`,
        minWidth: '200px',
        minHeight: '80px'
      }}
    >
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id={`${cleanId}-target`}
        className={cn(
          "w-3 h-3 !bg-background rounded-full transition-all",
          "hover:scale-125"
        )}
        style={{
          border: `2px solid ${hexColor}`,
          top: -8
        }}
      />

      {/* Content */}
      <div className="flex flex-col items-center text-center">
        {renderIcons()}
        
        <div className="space-y-1">
          <h3 
            className="font-medium text-sm"
            style={{ color: hexColor }}
          >
            {label}
          </h3>
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {/* Custom content from child components */}
        {children && (
          <div className="mt-3 w-full">
            {children}
          </div>
        )}
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${cleanId}-source`}
        className={cn(
          "w-3 h-3 !bg-background rounded-full transition-all",
          "hover:scale-125"
        )}
        style={{
          border: `2px solid ${hexColor}`,
          bottom: -8
        }}
      />

      {/* Bidirectional Handle */}
      {isBidirectional && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id={`${cleanId}-target-left`}
            className={cn(
              "w-3 h-3 !bg-background rounded-full transition-all",
              "hover:scale-125"
            )}
            style={{
              border: `2px solid ${hexColor}`,
              left: -8
            }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id={`${cleanId}-source-right`}
            className={cn(
              "w-3 h-3 !bg-background rounded-full transition-all",
              "hover:scale-125"
            )}
            style={{
              border: `2px solid ${hexColor}`,
              right: -8
            }}
          />
        </>
      )}
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode;
