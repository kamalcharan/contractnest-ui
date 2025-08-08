{/* Template Statistics */}// src/components/service-contracts/templates/TemplateDesigner/BlockConfigPanel.tsx
import React from 'react';
import { AlertCircle, CheckCircle, Info, Settings } from 'lucide-react';

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

interface TemplateBuilderState {
  templateId?: string;
  templateName: string;
  templateDescription: string;
  industry: string;
  contractType: 'service' | 'partnership';
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  isDirty: boolean;
  lastSaved?: Date;
}

interface BlockConfigPanelProps {
  selectedBlock: BlockInstance | null;
  template: TemplateBuilderState;
  onUpdateTemplate: (updates: Partial<TemplateBuilderState>) => void;
  validationErrors: string[];
  isAdmin?: boolean;
  userRole?: 'admin' | 'tenant' | 'user';
}

// Template Settings Component
const TemplateSettings: React.FC<{
  template: TemplateBuilderState;
  onUpdateTemplate: (updates: Partial<TemplateBuilderState>) => void;
  validationErrors: string[];
  isAdmin?: boolean;
  userRole?: 'admin' | 'tenant' | 'user';
}> = ({ template, onUpdateTemplate, validationErrors, isAdmin = false, userRole = 'tenant' }) => {
  const industries = [
    'Healthcare',
    'Manufacturing',
    'Financial Services',
    'Technology',
    'Construction',
    'Education',
    'Retail',
    'Transportation',
    'Energy',
    'Other'
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Template Basic Info */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Template Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={template.templateName}
              onChange={(e) => onUpdateTemplate({ templateName: e.target.value })}
              placeholder={isAdmin ? "Enter global template name" : "Enter template name"}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
            {isAdmin && (
              <p className="text-xs text-muted-foreground mt-1">
                This will be available to all tenants in the marketplace
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description {isAdmin && '*'}
            </label>
            <textarea
              value={template.templateDescription}
              onChange={(e) => onUpdateTemplate({ templateDescription: e.target.value })}
              placeholder={isAdmin ? "Describe this global template's purpose and use cases" : "Describe this template's purpose"}
              rows={isAdmin ? 4 : 3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
            />
            {isAdmin && (
              <p className="text-xs text-muted-foreground mt-1">
                This description will help tenants understand when to use this template
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Industry {isAdmin && '*'}
            </label>
            <select
              value={template.industry}
              onChange={(e) => onUpdateTemplate({ industry: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            >
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry.toLowerCase()}>
                  {industry}
                </option>
              ))}
            </select>
            {isAdmin && !template.industry && (
              <p className="text-xs text-destructive mt-1">
                Industry is required for global templates
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Contract Type
            </label>
            <select
              value={template.contractType}
              onChange={(e) => onUpdateTemplate({ contractType: e.target.value as 'service' | 'partnership' })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            >
              <option value="service">Service Contract</option>
              <option value="partnership">Partnership Contract</option>
            </select>
            {isAdmin && (
              <p className="text-xs text-muted-foreground mt-1">
                This determines which blocks are available and required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Template Type Info for Admin */}
      {isAdmin && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-primary mb-2 flex items-center">
            <Shield size={16} className="mr-2" />
            Global Template
          </h4>
          <div className="text-sm text-primary/80 space-y-1">
            <p>• This template will be available to all tenants</p>
            <p>• Tenants can copy and customize it for their use</p>
            <p>• Industry and description are required for discoverability</p>
            <p>• Changes will create a new version</p>
          </div>
        </div>
      )}

      {/* User Role Info for non-admin */}
      {!isAdmin && userRole && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <User size={16} className="mr-2" />
            {userRole === 'tenant' ? 'Tenant Template' : 'Local Template'}
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• This template is private to your organization</p>
            <p>• You can create contracts from this template</p>
            <p>• Other tenants cannot see or use this template</p>
          </div>
        </div>
      )}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Template Statistics</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Blocks</span>
            <span className="font-medium">{template.blocks.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Required Blocks</span>
            <span className="font-medium">{template.blocks.filter(b => b.isRequired).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valid Blocks</span>
            <span className="font-medium text-green-600">{template.blocks.filter(b => b.isValid).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Blocks with Errors</span>
            <span className="font-medium text-red-600">{template.blocks.filter(b => !b.isValid).length}</span>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <AlertCircle size={16} className="text-red-500 mr-2" />
            Validation Issues
          </h4>
          <div className="space-y-2">
            {validationErrors.slice(0, 5).map((error, index) => (
              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            ))}
            {validationErrors.length > 5 && (
              <div className="text-sm text-muted-foreground">
                +{validationErrors.length - 5} more issues
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Block Configuration Component
const BlockConfiguration: React.FC<{
  block: BlockInstance;
}> = ({ block }) => {
  // Basic configuration form - this would be expanded based on block type
  const getBlockTypeDescription = (blockType: string) => {
    switch (blockType) {
      case 'contact-block':
        return 'Manages contract parties and their roles in the agreement.';
      case 'base-details-block':
        return 'Defines core contract information like title, dates, and priority.';
      case 'equipment-block':
        return 'Specifies equipment or assets involved in the contract.';
      case 'acceptance-block':
        return 'Sets criteria for how the contract becomes active.';
      case 'service-commitment-block':
        return 'Defines recurring services with schedules and cycles.';
      case 'milestone-block':
        return 'Creates project checkpoints with deliverables and payments.';
      case 'legal-clauses-block':
        return 'Adds legal terms, conditions, and compliance requirements.';
      case 'billing-rules-block':
        return 'Configures payment terms and billing schedules.';
      case 'revenue-sharing-block':
        return 'Sets up revenue distribution for partnership contracts.';
      default:
        return 'Configure this block\'s specific settings.';
    }
  };

  const getConfigurationFields = (blockType: string) => {
    // This would return different configuration forms based on block type
    // For now, showing a placeholder structure
    switch (blockType) {
      case 'contact-block':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Default Role
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg">
                <option>Buyer</option>
                <option>Seller</option>
                <option>Partner</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Allow multiple contacts</span>
              </label>
            </div>
          </div>
        );
      
      case 'service-commitment-block':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Default Service Type
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg">
                <option>Calibration</option>
                <option>Maintenance</option>
                <option>Inspection</option>
                <option>Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Default Cycle (days)
              </label>
              <input 
                type="number" 
                defaultValue="30"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Settings size={24} className="mx-auto mb-2" />
            <p>Configuration options for this block type will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Block Info */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="font-semibold text-foreground">{block.name}</h4>
          {block.isValid ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {getBlockTypeDescription(block.blockType)}
        </p>
        
        {/* Block Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Position</span>
            <span className="font-medium">{block.position + 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Required</span>
            <span className={`font-medium ${block.isRequired ? 'text-red-600' : 'text-green-600'}`}>
              {block.isRequired ? 'Yes' : 'No'}
            </span>
          </div>
          {block.dependencies.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dependencies</span>
              <span className="font-medium">{block.dependencies.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Block Configuration */}
      <div>
        <h5 className="font-medium text-foreground mb-3">Configuration</h5>
        {getConfigurationFields(block.blockType)}
      </div>

      {/* Validation Errors */}
      {!block.isValid && block.validationErrors.length > 0 && (
        <div>
          <h5 className="font-medium text-foreground mb-3 flex items-center">
            <AlertCircle size={16} className="text-red-500 mr-2" />
            Issues
          </h5>
          <div className="space-y-2">
            {block.validationErrors.map((error, index) => (
              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies Info */}
      {block.dependencies.length > 0 && (
        <div>
          <h5 className="font-medium text-foreground mb-3 flex items-center">
            <Info size={16} className="text-blue-500 mr-2" />
            Dependencies
          </h5>
          <div className="space-y-2">
            {block.dependencies.map((dep, index) => (
              <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                Requires: {dep.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Block Config Panel Component
const BlockConfigPanel: React.FC<BlockConfigPanelProps> = ({
  selectedBlock,
  template,
  onUpdateTemplate,
  validationErrors,
  isAdmin = false,
  userRole = 'tenant'
}) => {
  return (
    <div className="h-full overflow-auto">
      {selectedBlock ? (
        <BlockConfiguration block={selectedBlock} />
      ) : (
        <TemplateSettings 
          template={template}
          onUpdateTemplate={onUpdateTemplate}
          validationErrors={validationErrors}
          isAdmin={isAdmin}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default BlockConfigPanel;