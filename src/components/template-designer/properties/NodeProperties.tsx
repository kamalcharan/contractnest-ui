// src/components/template-designer/properties/NodeProperties.tsx
import React from 'react';
import {
  Type,
  Hash,
  Calendar,
  Link,
  Image,
  List,
  Table,
  FileText,
  ChevronDown,
  Plus,
  Trash2,
  Settings,
  AlertCircle
} from 'lucide-react';
import Alert from '@/components/ui/Alert';

interface BlockField {
  name: string;
  type: 'text' | 'longtext' | 'number' | 'select' | 'boolean' | 'array' | 'date' | 'email' | 'url';
  label: string;
  value?: any;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

interface NodePropertiesProps {
  node: any;
  onUpdate: (data: any) => void;
}

// Get default fields based on block type
const getDefaultFields = (blockType: string): BlockField[] => {
  switch (blockType) {
    case 'header':
      return [
        { name: 'title', type: 'text', label: 'Contract Title', required: true, placeholder: 'Enter contract title' },
        { name: 'subtitle', type: 'text', label: 'Subtitle', required: false, placeholder: 'Optional subtitle' },
        { name: 'contractNumber', type: 'text', label: 'Contract Number', required: true, placeholder: 'AUTO-GENERATED' },
        { name: 'date', type: 'date', label: 'Contract Date', required: true },
        { name: 'version', type: 'text', label: 'Version', required: false, defaultValue: '1.0' }
      ];
    
    case 'section':
      return [
        { name: 'sectionTitle', type: 'text', label: 'Section Title', required: true, placeholder: 'Enter section title' },
        { name: 'sectionNumber', type: 'text', label: 'Section Number', required: false, placeholder: 'e.g., 1.1' },
        { name: 'description', type: 'longtext', label: 'Description', required: false, placeholder: 'Optional section description' },
        { name: 'isCollapsible', type: 'boolean', label: 'Collapsible Section', defaultValue: false }
      ];
    
    case 'paragraph':
      return [
        { name: 'content', type: 'longtext', label: 'Paragraph Content', required: true, placeholder: 'Enter paragraph text...' },
        { name: 'alignment', type: 'select', label: 'Text Alignment', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
        { name: 'fontSize', type: 'select', label: 'Font Size', options: ['small', 'normal', 'large'], defaultValue: 'normal' },
        { name: 'emphasis', type: 'boolean', label: 'Emphasize Text', defaultValue: false }
      ];
    
    case 'list':
      return [
        { name: 'listType', type: 'select', label: 'List Type', options: ['bullet', 'numbered', 'checklist'], defaultValue: 'bullet', required: true },
        { name: 'items', type: 'array', label: 'List Items', required: true, placeholder: 'Add list items...' },
        { name: 'indentLevel', type: 'number', label: 'Indent Level', defaultValue: 0, min: 0, max: 3 }
      ];
    
    case 'table':
      return [
        { name: 'tableTitle', type: 'text', label: 'Table Title', required: false, placeholder: 'Optional table title' },
        { name: 'columns', type: 'array', label: 'Column Headers', required: true, placeholder: 'Column 1, Column 2, ...' },
        { name: 'rows', type: 'number', label: 'Number of Rows', required: true, defaultValue: 3, min: 1, max: 50 },
        { name: 'showBorders', type: 'boolean', label: 'Show Borders', defaultValue: true },
        { name: 'striped', type: 'boolean', label: 'Striped Rows', defaultValue: false }
      ];
    
    case 'image':
      return [
        { name: 'imageUrl', type: 'url', label: 'Image URL', required: true, placeholder: 'https://...' },
        { name: 'altText', type: 'text', label: 'Alt Text', required: true, placeholder: 'Describe the image' },
        { name: 'caption', type: 'text', label: 'Caption', required: false, placeholder: 'Optional caption' },
        { name: 'width', type: 'select', label: 'Width', options: ['small', 'medium', 'large', 'full'], defaultValue: 'medium' },
        { name: 'alignment', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'], defaultValue: 'center' }
      ];
    
    case 'signature':
      return [
        { name: 'signerName', type: 'text', label: 'Signer Name', required: true, placeholder: 'Full name' },
        { name: 'signerTitle', type: 'text', label: 'Title/Role', required: false, placeholder: 'e.g., CEO, Manager' },
        { name: 'signerEmail', type: 'email', label: 'Email', required: false, placeholder: 'email@example.com' },
        { name: 'signDate', type: 'date', label: 'Sign Date', required: false },
        { name: 'isRequired', type: 'boolean', label: 'Required Signature', defaultValue: true },
        { name: 'signatureType', type: 'select', label: 'Signature Type', options: ['draw', 'type', 'upload'], defaultValue: 'draw' }
      ];
    
    case 'condition':
      return [
        { name: 'conditionName', type: 'text', label: 'Condition Name', required: true, placeholder: 'e.g., Has Insurance' },
        { name: 'fieldToCheck', type: 'select', label: 'Field to Check', required: true, options: ['contract_value', 'client_type', 'custom'], placeholder: 'Select field' },
        { name: 'operator', type: 'select', label: 'Operator', required: true, options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains'], defaultValue: 'equals' },
        { name: 'value', type: 'text', label: 'Value to Compare', required: true, placeholder: 'Enter value' },
        { name: 'trueLabel', type: 'text', label: 'True Path Label', defaultValue: 'Yes' },
        { name: 'falseLabel', type: 'text', label: 'False Path Label', defaultValue: 'No' }
      ];
    
    default:
      return [
        { name: 'content', type: 'text', label: 'Content', required: true, placeholder: 'Enter content...' }
      ];
  }
};

const NodeProperties: React.FC<NodePropertiesProps> = ({ node, onUpdate }) => {
  const [fields, setFields] = React.useState<BlockField[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = React.useState('properties');

  React.useEffect(() => {
    // Initialize fields with existing values or defaults
    const blockType = node.data?.blockType || node.type;
    const defaultFields = getDefaultFields(blockType);
    
    const fieldsWithValues = defaultFields.map(field => ({
      ...field,
      value: node.data?.fields?.[field.name] || field.defaultValue || ''
    }));
    
    setFields(fieldsWithValues);
  }, [node]);

  const handleFieldChange = (fieldName: string, value: any) => {
    // Update field value
    const updatedFields = fields.map(field => 
      field.name === fieldName ? { ...field, value } : field
    );
    setFields(updatedFields);

    // Update node data
    const fieldValues = updatedFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value
    }), {});

    onUpdate({
      ...node.data,
      fields: fieldValues
    });

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !field.value) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field: BlockField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'longtext':
        return (
          <textarea
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.value || field.defaultValue || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Enable</span>
          </label>
        );

      case 'array':
        return (
          <div className="space-y-2">
            {(field.value || []).map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(field.value || [])];
                    newItems[index] = e.target.value;
                    handleFieldChange(field.name, newItems);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    const newItems = (field.value || []).filter((_: any, i: number) => i !== index);
                    handleFieldChange(field.name, newItems);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [...(field.value || []), ''];
                handleFieldChange(field.name, newItems);
              }}
              className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={field.value || field.defaultValue || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
    }
  };

  const getBlockIcon = () => {
    const blockType = node.data?.blockType || node.type;
    switch (blockType) {
      case 'header': return <FileText className="w-5 h-5" />;
      case 'section': return <Settings className="w-5 h-5" />;
      case 'paragraph': return <Type className="w-5 h-5" />;
      case 'list': return <List className="w-5 h-5" />;
      case 'table': return <Table className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'condition': return <AlertCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4">
      {/* Node Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {getBlockIcon()}
          <h3 className="text-lg font-semibold">{node.data?.label || 'Untitled Block'}</h3>
        </div>
        <div className="text-sm text-gray-500">
          <span>Type: {node.data?.blockType || node.type}</span>
          {node.data?.variant && <span className="ml-3">Variant: {node.data.variant}</span>}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection('properties')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeSection === 'properties'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveSection('styling')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeSection === 'styling'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Styling
          </button>
          <button
            onClick={() => setActiveSection('advanced')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeSection === 'advanced'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Content based on active section */}
      {activeSection === 'properties' && (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'styling' && (
        <div className="space-y-4">
          <Alert variant="info">
            Styling options will be available in the next update.
          </Alert>
        </div>
      )}

      {activeSection === 'advanced' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block ID
            </label>
            <input
              type="text"
              value={node.id}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom CSS Classes
            </label>
            <input
              type="text"
              placeholder="e.g., custom-class another-class"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeProperties;