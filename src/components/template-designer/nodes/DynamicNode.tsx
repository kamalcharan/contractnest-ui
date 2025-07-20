// src/components/template-designer/nodes/DynamicNode.tsx

import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, Users } from 'lucide-react';

interface DynamicNodeData extends BaseNodeData {
  nodeType?: string;
  fields?: Array<{
    name: string;
    value?: any;
    type?: string;
  }>;
}

const DynamicNode: React.FC<NodeProps<DynamicNodeData>> = memo((props) => {
  const { data } = props;
  const { blockType, nodeType, fields = [], config = {} } = data;

  // Render different content based on block type
  const renderNodeContent = () => {
    switch (blockType) {
      case 'contact':
        return (
          <div className="space-y-2 w-full">
            {nodeType === 'multiContactNode' && (
              <Badge variant="secondary" className="text-xs">
                Max: {config.maxContacts || 5} contacts
              </Badge>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Users size={12} />
              <span>{nodeType === 'singleContactNode' ? 'Single' : 'Multiple'}</span>
            </div>
          </div>
        );

      case 'service':
        return (
          <div className="space-y-2 w-full">
            {config.scheduleType && (
              <Badge variant="secondary" className="text-xs">
                {config.scheduleType}
              </Badge>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>Service Schedule</span>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-2 w-full">
            {config.billingType && (
              <Badge variant="secondary" className="text-xs">
                {config.billingType}
              </Badge>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <DollarSign size={12} />
              <span>Payment Terms</span>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-2 w-full">
            {config.isEditable !== undefined && (
              <Badge variant={config.isEditable ? "default" : "secondary"} className="text-xs">
                {config.isEditable ? 'Editable' : 'Fixed'}
              </Badge>
            )}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <FileText size={12} />
              <span>Terms & Conditions</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-xs text-muted-foreground">
            {nodeType || 'Custom Block'}
          </div>
        );
    }
  };

  return (
    <BaseNode {...props}>
      {renderNodeContent()}
    </BaseNode>
  );
});

DynamicNode.displayName = 'DynamicNode';

export default DynamicNode;