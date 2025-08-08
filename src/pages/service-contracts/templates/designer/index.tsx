// src/pages/service-contracts/templates/designer/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Eye, 
  Save, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  HelpCircle,
  Shield,
  Users
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useToast } from '../../../../components/ui/use-toast';
import { captureException } from '../../../../utils/sentry';
import { analyticsService } from '../../../../services/analytics.service';
import useBlocks from '../../../../hooks/service-contracts/blocks/useBlocks';
import useTemplateBuilder from '../../../../hooks/service-contracts/templates/useTemplateBuilder';
import BlockLibrary from '../../../../components/service-contracts/templates/TemplateDesigner/BlockLibrary';
import TemplateCanvas from '../../../../components/service-contracts/templates/TemplateDesigner/TemplateCanvas';
import BlockConfigPanel from '../../../../components/service-contracts/templates/TemplateDesigner/BlockConfigPanel';

const TemplateDesignerPage: React.FC = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const { toast } = useToast();
  
  // UI State
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // User permissions (this would come from auth context in real implementation)
  const [userRole, setUserRole] = useState<'admin' | 'tenant' | 'user'>('tenant'); // Default to tenant
  const [isAdmin, setIsAdmin] = useState(false);

  // Track page views and user role detection
  useEffect(() => {
    try {
      // Track analytics
      analyticsService.trackPageView('template-designer', 'Template Designer Page', {
        templateId: templateId || 'new',
        userRole
      });

      // TODO: Replace with actual auth context when available
      // const currentUser = useAuth(); // This would come from your auth context
      // setUserRole(currentUser?.role || 'tenant');
      // setIsAdmin(currentUser?.role === 'admin');
      
      // For now, simulate role detection
      const simulatedRole = localStorage.getItem('user_role') || 'tenant';
      setUserRole(simulatedRole as 'admin' | 'tenant' | 'user');
      setIsAdmin(simulatedRole === 'admin');
      
    } catch (error) {
      captureException(error, {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'initialization',
          templateId: templateId || 'new'
        }
      });
    }
  }, [templateId, userRole]);

  // Hooks with error handling
  const {
    templateBuilderBlocks,
    isLoading: blocksLoading,
    error: blocksError,
    searchBlocks
  } = useBlocks({
    enableTemplateBuilder: true,
    autoFetch: true
  });

  const {
    template,
    addBlock,
    removeBlock,
    moveBlock,
    selectBlock,
    selectedBlock,
    updateTemplate,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    canDrop,
    validateTemplate,
    getValidationErrors,
    isDirty
  } = useTemplateBuilder({
    initialTemplate: {
      // Set template type based on user role
      templateName: isAdmin ? 'Global Template' : 'My Template',
      industry: '',
      contractType: 'service'
    }
  });

  // Error handling for blocks loading
  useEffect(() => {
    if (blocksError) {
      captureException(new Error(blocksError), {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'blocks_loading_error',
          userRole
        }
      });
      
      toast({
        variant: "destructive",
        title: "Error Loading Blocks",
        description: blocksError
      });
    }
  }, [blocksError, toast, userRole]);

  // Handlers with error handling and analytics
  const handleBlockSelect = (instanceId: string | null) => {
    try {
      selectBlock(instanceId);
      
      // Track block selection
      if (instanceId) {
        const block = template.blocks.find(b => b.id === instanceId);
        analyticsService.trackEvent('template_designer_block_selected', {
          blockType: block?.blockType,
          blockName: block?.name,
          templateId: templateId || 'new',
          userRole
        });
      }
      
      // Open right panel when block is selected
      if (instanceId && rightPanelCollapsed) {
        setRightPanelCollapsed(false);
      }
    } catch (error) {
      captureException(error, {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'block_selection',
          blockId: instanceId || 'none'
        }
      });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // Validate template before saving
      const isValid = validateTemplate();
      
      if (!isValid) {
        const errors = getValidationErrors();
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: `Please fix ${errors.length} error${errors.length !== 1 ? 's' : ''} before saving.`
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Saving Template",
        description: "Please wait while we save your template..."
      });

      // Track save attempt
      analyticsService.trackEvent('template_designer_save_attempted', {
        templateId: templateId || 'new',
        blockCount: template.blocks.length,
        userRole,
        isGlobal: isAdmin,
        industry: template.industry,
        contractType: template.contractType
      });

      // TODO: Implement actual save functionality
      console.log('Saving template:', template);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Template Saved",
        description: `${template.templateName || 'Template'} has been saved successfully.`
      });

      // Track successful save
      analyticsService.trackEvent('template_designer_save_completed', {
        templateId: templateId || 'new',
        userRole,
        isGlobal: isAdmin
      });
      
    } catch (error) {
      captureException(error, {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'save_template',
          templateId: templateId || 'new'
        }
      });
      
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save template. Please try again."
      });
    }
  };

  const handlePreviewTemplate = () => {
    try {
      // Track preview action
      analyticsService.trackEvent('template_designer_preview_opened', {
        templateId: templateId || 'new',
        blockCount: template.blocks.length,
        userRole
      });

      // TODO: Implement preview functionality
      console.log('Previewing template:', template);
      
      toast({
        title: "Template Preview",
        description: "Preview functionality will be available soon."
      });
      
    } catch (error) {
      captureException(error, {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'preview_template'
        }
      });
    }
  };

  const handleGoBack = () => {
    try {
      if (isDirty) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave without saving?'
        );
        if (!confirmLeave) return;
      }

      // Track navigation
      analyticsService.trackEvent('template_designer_navigation_back', {
        templateId: templateId || 'new',
        hadUnsavedChanges: isDirty,
        userRole
      });

      // Navigate back based on user role
      if (isAdmin) {
        navigate('/service-contracts/templates/admin/global-templates');
      } else {
        navigate('/service-contracts/templates');
      }
      
    } catch (error) {
      captureException(error, {
        tags: { 
          component: 'TemplateDesignerPage', 
          action: 'navigation_back'
        }
      });
    }
  };

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  // Loading state
  if (blocksLoading) {
    return (
      <div 
        className="flex items-center justify-center h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center">
          <Loader2 
            className="h-8 w-8 animate-spin mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <div 
            className="text-lg font-semibold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Loading Template Designer
          </div>
          <div 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Fetching blocks and initializing...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (blocksError) {
    return (
      <div 
        className="flex items-center justify-center h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle 
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: colors.semantic.error }}
          />
          <div 
            className="text-lg font-semibold mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Error Loading Template Designer
          </div>
          <div 
            className="mb-4 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {blocksError}
          </div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              Retry
            </button>
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: 'transparent',
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="flex h-screen transition-colors"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        {/* Left Panel - Block Library */}
        <div 
          className={`
            ${leftPanelCollapsed ? 'w-12' : 'w-80'} 
            transition-all duration-300 border-r
          `}
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          {/* Panel Header */}
          <div 
            className="flex items-center justify-between p-4 border-b transition-colors"
            style={{ borderColor: colors.utility.secondaryText + '20' }}
          >
            {!leftPanelCollapsed && (
              <div>
                <h3 
                  className="font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Block Library
                </h3>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Drag blocks to canvas
                  {isAdmin && (
                    <span 
                      className="ml-2 inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded transition-colors"
                      style={{
                        backgroundColor: colors.brand.primary + '20',
                        color: colors.brand.primary
                      }}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                </p>
              </div>
            )}
            <button
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className="p-2 rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.utility.secondaryText + '10',
                color: colors.utility.secondaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.utility.primaryText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.utility.secondaryText;
              }}
              title={leftPanelCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {leftPanelCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Panel Content */}
          {!leftPanelCollapsed && (
            <div className="flex-1 overflow-hidden">
              <BlockLibrary
                blocks={templateBuilderBlocks}
                isLoading={blocksLoading}
                onSearch={searchBlocks}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div 
            className="flex items-center justify-between p-4 border-b transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: 'transparent',
                  color: colors.utility.primaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Go back to templates"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Template Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={template.templateName}
                    onChange={(e) => updateTemplate({ templateName: e.target.value })}
                    placeholder={isAdmin ? "Global Template Name" : "Template Name"}
                    className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-background px-2 py-1 rounded transition-colors"
                    style={{
                      color: colors.utility.primaryText,
                      backgroundColor: 'transparent'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  />
                  {isAdmin && (
                    <span 
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border transition-colors"
                      style={{
                        backgroundColor: colors.brand.primary + '20',
                        color: colors.brand.primary,
                        borderColor: colors.brand.primary + '30'
                      }}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Global Template
                    </span>
                  )}
                </div>
                <div 
                  className="flex items-center space-x-2 text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <span>{template.blocks.length} block{template.blocks.length !== 1 ? 's' : ''}</span>
                  {isDirty && <span>• Unsaved changes</span>}
                  {!isValid && (
                    <span 
                      className="flex items-center"
                      style={{ color: colors.semantic.error }}
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {template.industry && <span>• {template.industry}</span>}
                  <span>• {template.contractType} contract</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Help Button */}
              <button
                onClick={() => setShowHelpModal(true)}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: colors.utility.secondaryText + '10',
                  color: colors.utility.secondaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.utility.primaryText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.utility.secondaryText;
                }}
                title="Help & guidance"
              >
                <HelpCircle size={20} />
              </button>

              {/* Preview Button */}
              <button
                onClick={handlePreviewTemplate}
                disabled={template.blocks.length === 0}
                className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: 'transparent',
                  color: colors.utility.primaryText
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Preview template"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Preview</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSaveTemplate}
                disabled={!isDirty || !isValid}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white rounded-lg transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
                title={!isDirty ? "No changes to save" : !isValid ? "Fix validation errors first" : "Save template"}
              >
                <Save size={16} />
                <span className="hidden sm:inline">
                  {isAdmin ? "Save Global" : "Save"}
                </span>
              </button>

              {/* Settings Panel Toggle */}
              <button
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: !rightPanelCollapsed 
                    ? colors.utility.secondaryText + '20' 
                    : colors.utility.secondaryText + '10',
                  color: colors.utility.secondaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.utility.primaryText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.utility.secondaryText;
                }}
                title={rightPanelCollapsed ? 'Open settings panel' : 'Close settings panel'}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Template Type Banner for Admin */}
          {isAdmin && (
            <div 
              className="px-4 py-2 border-b transition-colors"
              style={{
                backgroundColor: colors.brand.primary + '10',
                borderColor: colors.brand.primary + '20'
              }}
            >
              <div 
                className="flex items-center space-x-2 text-sm"
                style={{ color: colors.brand.primary }}
              >
                <Shield className="w-4 h-4" />
                <span>
                  You're creating a <strong>Global Template</strong> that will be available to all tenants in the marketplace.
                </span>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 overflow-auto">
            <TemplateCanvas
              blocks={template.blocks}
              selectedBlockId={template.selectedBlockId}
              onBlockSelect={handleBlockSelect}
              onBlockRemove={removeBlock}
              onBlockMove={moveBlock}
              onDrop={handleDrop}
              canDrop={canDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Right Panel - Block Configuration */}
        {!rightPanelCollapsed && (
          <div 
            className="w-80 border-l transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            {/* Panel Header */}
            <div 
              className="flex items-center justify-between p-4 border-b transition-colors"
              style={{ borderColor: colors.utility.secondaryText + '20' }}
            >
              <div>
                <h3 
                  className="font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {selectedBlock ? 'Block Settings' : 'Template Settings'}
                </h3>
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {selectedBlock 
                    ? selectedBlock.name 
                    : isAdmin 
                      ? 'Configure global template properties'
                      : 'Configure template properties'
                  }
                </p>
              </div>
              <button
                onClick={() => setRightPanelCollapsed(true)}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: colors.utility.secondaryText + '10',
                  color: colors.utility.secondaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.utility.primaryText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.utility.secondaryText;
                }}
                title="Close panel"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-auto">
              <BlockConfigPanel
                selectedBlock={selectedBlock}
                template={template}
                onUpdateTemplate={updateTemplate}
                validationErrors={validationErrors}
                isAdmin={isAdmin}
                userRole={userRole}
              />
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="fixed inset-0 backdrop-blur-sm transition-opacity"
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
              }}
              onClick={() => setShowHelpModal(false)}
            />
            <div 
              className="rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border relative transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div 
                className="p-6 border-b transition-colors"
                style={{ borderColor: colors.utility.secondaryText + '20' }}
              >
                <div className="flex items-center justify-between">
                  <h2 
                    className="text-xl font-semibold transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Template Designer Help
                  </h2>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="p-2 rounded-md transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: colors.utility.secondaryText + '10',
                      color: colors.utility.secondaryText
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div 
                  className="p-4 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                >
                  <h3 
                    className="font-medium mb-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    🎯 Getting Started
                  </h3>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Drag blocks from the left panel to the canvas to build your template. 
                    {isAdmin ? ' As an admin, you\'re creating a global template for all tenants.' : ''}
                  </p>
                </div>
                <div 
                  className="p-4 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                >
                  <h3 
                    className="font-medium mb-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    🧱 Block Types
                  </h3>
                  <div 
                    className="text-sm space-y-1 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    <div>• <strong>Core blocks:</strong> Essential contract elements (required)</div>
                    <div>• <strong>Event blocks:</strong> Services and milestones</div>
                    <div>• <strong>Content blocks:</strong> Legal clauses and media</div>
                    <div>• <strong>Commercial blocks:</strong> Billing and revenue</div>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                >
                  <h3 
                    className="font-medium mb-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    ⚙️ Configuration
                  </h3>
                  <p 
                    className="text-sm transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Click on any block to configure its settings in the right panel. 
                    Some blocks have dependencies and constraints.
                  </p>
                </div>
                {isAdmin && (
                  <div 
                    className="p-4 rounded-lg border transition-colors"
                    style={{
                      backgroundColor: colors.brand.primary + '10',
                      borderColor: colors.brand.primary + '20'
                    }}
                  >
                    <h3 
                      className="font-medium mb-2 flex items-center transition-colors"
                      style={{ color: colors.brand.primary }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Features
                    </h3>
                    <p 
                      className="text-sm transition-colors"
                      style={{ color: colors.brand.primary + 'cc' }}
                    >
                      Global templates you create will be available in the marketplace for all tenants to copy and use.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TemplateDesignerPage;