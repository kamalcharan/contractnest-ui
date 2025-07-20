// src/components/template-designer/nodes/nodeTypes.ts
import DynamicNode from './DynamicNode';
import { NodeTypes } from 'reactflow';

// Register all node types
export const nodeTypes: NodeTypes = {
  // Default node type - all blocks use DynamicNode
  default: DynamicNode,
  
  // Specific node types (all map to DynamicNode for now)
  singleContactNode: DynamicNode,
  multiContactNode: DynamicNode,
  basicServiceNode: DynamicNode,
  recurringServiceNode: DynamicNode,
  milestoneBillingNode: DynamicNode,
  subscriptionBillingNode: DynamicNode,
  standardTermsNode: DynamicNode,
  customTermsNode: DynamicNode,
};

// Node default settings
export const nodeDefaults = {
  type: 'default',
  style: {
    cursor: 'grab',
  },
};

// Edge default settings
export const edgeDefaults = {
  type: 'smoothstep',
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#94a3b8',
  },
  markerEnd: {
    type: 'arrowclosed',
    width: 20,
    height: 20,
    color: '#94a3b8',
  },
};

// Connection validation rules
export const connectionValidation = {
  // Source -> Target allowed connections
  allowedConnections: {
    'contact': ['service', 'billing', 'terms'],
    'service': ['billing', 'terms'],
    'billing': ['terms'],
    'terms': [], // Terms can't connect to anything
  },
  
  // Check if connection is valid
  isValidConnection: (sourceType: string, targetType: string): boolean => {
    const allowed = connectionValidation.allowedConnections[sourceType] || [];
    return allowed.includes(targetType);
  },
};