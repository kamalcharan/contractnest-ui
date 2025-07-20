// src/components/template-designer/preview/ContractView.tsx
import React from 'react';
import { Node, Edge } from 'reactflow';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Hash,
  Type,
  Calendar,
  DollarSign,
  User,
  Link2,
  Image as ImageIcon,
  List,
  Table,
  FileSignature,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Layers
} from 'lucide-react';

interface ContractViewProps {
  nodes: Node[];
  edges: Edge[];
  data?: Record<string, any>;
  mode?: 'edit' | 'view' | 'print';
  onFieldChange?: (nodeId: string, fieldName: string, value: any) => void;
}

interface BlockField {
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'email' | 'phone' | 'url' | 'address';
  label: string;
  value?: any;
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export const ContractView: React.FC<ContractViewProps> = ({
  nodes,
  edges,
  data = {},
  mode = 'view',
  onFieldChange
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  // Sort nodes based on their connections to create a logical flow
  const sortedNodes = React.useMemo(() => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const incomingEdges = new Map<string, number>();
    
    // Count incoming edges for each node
    edges.forEach(edge => {
      incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1);
    });
    
    // Find root nodes (no incoming edges)
    const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));
    const visited = new Set<string>();
    const sorted: Node[] = [];
    
    // DFS to sort nodes
    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = nodeMap.get(nodeId);
      if (node) {
        sorted.push(node);
        
        // Visit connected nodes
        edges
          .filter(edge => edge.source === nodeId)
          .forEach(edge => visit(edge.target));
      }
    };
    
    rootNodes.forEach(node => visit(node.id));
    
    // Add any unvisited nodes
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        sorted.push(node);
      }
    });
    
    return sorted;
  }, [nodes, edges]);

  const toggleSection = (nodeId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedSections(newExpanded);
  };

  const validateField = (field: BlockField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation;
      
      if (field.type === 'number' || field.type === 'currency') {
        const numValue = parseFloat(value);
        if (min !== undefined && numValue < min) {
          return message || `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && numValue > max) {
          return message || `${field.label} must be at most ${max}`;
        }
      }
      
      if (pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return message || `${field.label} format is invalid`;
        }
      }
    }

    return null;
  };

  const handleFieldChange = (nodeId: string, field: BlockField, value: any) => {
    const error = validateField(field, value);
    
    setValidationErrors(prev => ({
      ...prev,
      [`${nodeId}-${field.name}`]: error || ''
    }));

    if (onFieldChange) {
      onFieldChange(nodeId, field.name, value);
    }
  };

  const renderField = (nodeId: string, field: BlockField) => {
    const fieldKey = `${nodeId}-${field.name}`;
    const error = validationErrors[fieldKey];
    const isEditable = mode === 'edit';

    const getFieldIcon = () => {
      switch (field.type) {
        case 'text': return <Type className="w-4 h-4" />;
        case 'number': return <Hash className="w-4 h-4" />;
        case 'date': return <Calendar className="w-4 h-4" />;
        case 'currency': return <DollarSign className="w-4 h-4" />;
        case 'email': return <Mail className="w-4 h-4" />;
        case 'phone': return <Phone className="w-4 h-4" />;
        case 'url': return <Globe className="w-4 h-4" />;
        case 'address': return <MapPin className="w-4 h-4" />;
        default: return <Type className="w-4 h-4" />;
      }
    };

    return (
      <div key={field.name} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <div className="flex items-center gap-2">
            {getFieldIcon()}
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </div>
        </label>
        
        {isEditable ? (
          <div>
            {field.type === 'address' ? (
              <textarea
                value={field.value || ''}
                onChange={(e) => handleFieldChange(nodeId, field, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows={3}
              />
            ) : (
              <input
                type={field.type === 'currency' ? 'number' : field.type}
                value={field.value || ''}
                onChange={(e) => handleFieldChange(nodeId, field, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                step={field.type === 'currency' ? '0.01' : undefined}
              />
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="px-3 py-2 bg-gray-50 rounded-lg">
            {field.value || <span className="text-gray-400">Not set</span>}
          </div>
        )}
      </div>
    );
  };

  const renderBlock = (node: Node) => {
    const blockType = node.data.blockType || node.type;
    const isSection = blockType === 'section';
    const isExpanded = expandedSections.has(node.id);
    
    // Mock fields for demonstration
    const fields: BlockField[] = node.data.fields || getMockFields(blockType);

    const getBlockIcon = () => {
      switch (blockType) {
        case 'header': return <FileText className="w-5 h-5" />;
        case 'section': return <Layers className="w-5 h-5" />;
        case 'paragraph': return <Type className="w-5 h-5" />;
        case 'list': return <List className="w-5 h-5" />;
        case 'table': return <Table className="w-5 h-5" />;
        case 'image': return <ImageIcon className="w-5 h-5" />;
        case 'signature': return <FileSignature className="w-5 h-5" />;
        case 'condition': return <AlertCircle className="w-5 h-5" />;
        default: return <FileText className="w-5 h-5" />;
      }
    };

    return (
      <div
        key={node.id}
        className={`mb-6 ${mode === 'print' ? 'break-inside-avoid' : ''}`}
      >
        {isSection ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(node.id)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                {getBlockIcon()}
                <h3 className="font-semibold text-gray-900">{node.data.label}</h3>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {isExpanded && (
              <div className="p-4">
                {fields.map(field => renderField(node.id, field))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {getBlockIcon()}
              <h4 className="font-medium text-gray-900">{node.data.label}</h4>
            </div>
            {fields.map(field => renderField(node.id, field))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${mode === 'print' ? 'print:bg-white' : 'bg-gray-50'} min-h-full`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        {mode !== 'print' && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Contract Document</h1>
              <div className="flex items-center gap-2">
                {mode === 'edit' && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>Click on sections to expand/collapse</span>
                  </div>
                )}
              </div>
            </div>
            {Object.keys(validationErrors).some(key => validationErrors[key]) && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Please fix the validation errors before proceeding</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contract Content */}
        <div className="space-y-6">
          {sortedNodes.map(node => renderBlock(node))}
        </div>

        {/* Footer */}
        {mode === 'view' && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Generated on {new Date().toLocaleDateString()}
              </div>
              <div>
                {nodes.length} sections • {edges.length} connections
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock fields generator for demonstration
const getMockFields = (blockType: string): BlockField[] => {
  switch (blockType) {
    case 'header':
      return [
        { name: 'title', type: 'text', label: 'Contract Title', required: true },
        { name: 'contractNumber', type: 'text', label: 'Contract Number', required: true },
        { name: 'date', type: 'date', label: 'Contract Date', required: true }
      ];
    
    case 'paragraph':
      return [
        { name: 'content', type: 'text', label: 'Content', required: true }
      ];
    
    case 'signature':
      return [
        { name: 'signerName', type: 'text', label: 'Signer Name', required: true },
        { name: 'signerTitle', type: 'text', label: 'Title' },
        { name: 'signDate', type: 'date', label: 'Sign Date' }
      ];
    
    case 'list':
      return [
        { name: 'items', type: 'text', label: 'List Items', placeholder: 'Enter items separated by commas' }
      ];
    
    case 'table':
      return [
        { name: 'headers', type: 'text', label: 'Table Headers' },
        { name: 'rows', type: 'text', label: 'Table Data' }
      ];
    
    default:
      return [
        { name: 'value', type: 'text', label: 'Value' }
      ];
  }
};

// Export additional components for different view modes
export const ContractPrintView: React.FC<{ nodes: Node[]; edges: Edge[]; data?: Record<string, any> }> = (props) => {
  return (
    <div className="print:m-0">
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>
      <ContractView {...props} mode="print" />
    </div>
  );
};

export default ContractView;