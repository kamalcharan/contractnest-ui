// src/components/template-designer/canvas/ConnectionValidator.tsx
import React from 'react';
import { Connection, Edge, Node, useReactFlow } from 'reactflow';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Connection rules based on block types
const CONNECTION_RULES: Record<string, {
  allowedTargets: string[];
  maxConnections?: number;
  minConnections?: number;
  validationMessage?: string;
}> = {
  'header': {
    allowedTargets: ['section', 'paragraph', 'list', 'table'],
    maxConnections: 5,
    validationMessage: 'Headers can only connect to content blocks'
  },
  'section': {
    allowedTargets: ['section', 'paragraph', 'list', 'table', 'image', 'signature'],
    maxConnections: 10,
    validationMessage: 'Sections can connect to most block types'
  },
  'paragraph': {
    allowedTargets: ['paragraph', 'list', 'table', 'signature'],
    maxConnections: 3,
    validationMessage: 'Paragraphs have limited connections'
  },
  'list': {
    allowedTargets: ['paragraph', 'list', 'signature'],
    maxConnections: 3,
    validationMessage: 'Lists can connect to text blocks'
  },
  'table': {
    allowedTargets: ['paragraph', 'signature'],
    maxConnections: 2,
    validationMessage: 'Tables have limited connection options'
  },
  'signature': {
    allowedTargets: [],
    maxConnections: 0,
    validationMessage: 'Signature blocks cannot have outgoing connections'
  },
  'condition': {
    allowedTargets: ['section', 'paragraph', 'list', 'table'],
    maxConnections: 2,
    minConnections: 2,
    validationMessage: 'Condition blocks must have exactly 2 connections (true/false)'
  }
};

interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export const useConnectionValidator = () => {
  const { getNodes, getEdges } = useReactFlow();

  const validateConnection = (connection: Connection): ValidationResult => {
    const nodes = getNodes();
    const edges = getEdges();

    // Find source and target nodes
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      return {
        isValid: false,
        message: 'Invalid connection: Node not found',
        type: 'error'
      };
    }

    const sourceType = sourceNode.data.blockType || sourceNode.type;
    const targetType = targetNode.data.blockType || targetNode.type;

    // Check if connection is allowed based on rules
    const rules = CONNECTION_RULES[sourceType];
    if (!rules) {
      return {
        isValid: true,
        message: 'No specific rules for this block type',
        type: 'info'
      };
    }

    // Check allowed targets
    if (rules.allowedTargets.length > 0 && !rules.allowedTargets.includes(targetType)) {
      return {
        isValid: false,
        message: rules.validationMessage || `Cannot connect ${sourceType} to ${targetType}`,
        type: 'error'
      };
    }

    // Check max connections
    if (rules.maxConnections !== undefined) {
      const currentConnections = edges.filter(e => e.source === connection.source).length;
      if (currentConnections >= rules.maxConnections) {
        return {
          isValid: false,
          message: `Maximum ${rules.maxConnections} connections allowed for ${sourceType}`,
          type: 'error'
        };
      }
    }

    // Check for circular dependencies
    if (hasCircularDependency(connection, edges)) {
      return {
        isValid: false,
        message: 'This connection would create a circular dependency',
        type: 'error'
      };
    }

    // Check for duplicate connections
    const isDuplicate = edges.some(
      e => e.source === connection.source && e.target === connection.target
    );
    if (isDuplicate) {
      return {
        isValid: false,
        message: 'This connection already exists',
        type: 'warning'
      };
    }

    return {
      isValid: true,
      message: 'Connection is valid',
      type: 'info'
    };
  };

  const validateNode = (nodeId: string): ValidationResult[] => {
    const nodes = getNodes();
    const edges = getEdges();
    const node = nodes.find(n => n.id === nodeId);

    if (!node) {
      return [{
        isValid: false,
        message: 'Node not found',
        type: 'error'
      }];
    }

    const results: ValidationResult[] = [];
    const nodeType = node.data.blockType || node.type;
    const rules = CONNECTION_RULES[nodeType];

    if (!rules) {
      return results;
    }

    // Check minimum connections
    if (rules.minConnections !== undefined) {
      const connections = edges.filter(e => e.source === nodeId).length;
      if (connections < rules.minConnections) {
        results.push({
          isValid: false,
          message: `${nodeType} requires at least ${rules.minConnections} connections`,
          type: 'warning'
        });
      }
    }

    // Check maximum connections
    if (rules.maxConnections !== undefined) {
      const connections = edges.filter(e => e.source === nodeId).length;
      if (connections > rules.maxConnections) {
        results.push({
          isValid: false,
          message: `${nodeType} allows maximum ${rules.maxConnections} connections`,
          type: 'error'
        });
      }
    }

    return results;
  };

  const validateTemplate = (): ValidationResult[] => {
    const nodes = getNodes();
    const results: ValidationResult[] = [];

    // Check if template has required blocks
    const hasHeader = nodes.some(n => n.data.blockType === 'header');
    const hasSignature = nodes.some(n => n.data.blockType === 'signature');

    if (!hasHeader) {
      results.push({
        isValid: false,
        message: 'Template must have at least one header block',
        type: 'warning'
      });
    }

    if (!hasSignature) {
      results.push({
        isValid: false,
        message: 'Template must have at least one signature block',
        type: 'warning'
      });
    }

    // Validate each node
    nodes.forEach(node => {
      const nodeResults = validateNode(node.id);
      results.push(...nodeResults);
    });

    // Check for orphaned nodes
    const orphanedNodes = findOrphanedNodes(nodes, getEdges());
    orphanedNodes.forEach(node => {
      results.push({
        isValid: false,
        message: `Block "${node.data.label}" is not connected to the flow`,
        type: 'warning'
      });
    });

    return results;
  };

  return {
    validateConnection,
    validateNode,
    validateTemplate
  };
};

// Helper function to check for circular dependencies
const hasCircularDependency = (connection: Connection, edges: Edge[]): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Get all outgoing edges from this node
    const outgoingEdges = edges.filter(e => e.source === nodeId);
    
    // Add the potential new connection
    if (connection.source === nodeId) {
      outgoingEdges.push({ target: connection.target } as Edge);
    }

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (hasCycle(edge.target)) {
          return true;
        }
      } else if (recursionStack.has(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  return hasCycle(connection.target!);
};

// Helper function to find orphaned nodes
const findOrphanedNodes = (nodes: Node[], edges: Edge[]): Node[] => {
  const connectedNodeIds = new Set<string>();
  
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  // First node is usually the start node, so it's okay if it has no incoming connections
  return nodes.filter((node, index) => 
    index > 0 && !connectedNodeIds.has(node.id)
  );
};

// Validation Status Component
interface ValidationStatusProps {
  results: ValidationResult[];
  onClose: () => void;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ results, onClose }) => {
  const errors = results.filter(r => r.type === 'error');
  const warnings = results.filter(r => r.type === 'warning');
  const hasIssues = errors.length > 0 || warnings.length > 0;

  return (
    <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-50">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {hasIssues ? (
            <AlertCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          Template Validation
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {!hasIssues ? (
        <div className="text-green-600 text-sm">
          ✓ Template is valid and ready to use
        </div>
      ) : (
        <div className="space-y-3">
          {errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-1">
                Errors ({errors.length})
              </h4>
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-orange-600 mb-1">
                Warnings ({warnings.length})
              </h4>
              <ul className="space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};