// src/pages/templates/designer.tsx
import React from 'react';
import { ReactFlow, ReactFlowProvider, Background, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import TemplateCanvas from '@/components/template-designer/canvas/TemplateCanvas';
import { CanvasToolbar } from '@/components/template-designer/canvas/CanvasToolbar';
import { CanvasControls } from '@/components/template-designer/canvas/CanvasControls';
import BlockPalette from '@/components/template-designer/blocks/BlockPalette';
import PropertiesPanel from '@/components/template-designer/properties/PropertiesPanel';
import { ModeToggle, PanelToggle } from '@/components/template-designer/shared/ViewToggle';
import { ValidationStatus, useConnectionValidator } from '@/components/template-designer/canvas/ConnectionValidator';
import ContractView from '@/components/template-designer/preview/ContractView';
import TemplatePreview from '@/components/template-designer/preview/TemplatePreview';

// Hooks
import { useTemplateDesigner } from '@/hooks/useTemplateDesigner';

export default function TemplateDesignerPage() {
  const navigate = useNavigate();
  const { id: templateId } = useParams();
  
  // Use the template designer hook
  const {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    template,
    isDirty,
    isLoading,
    isSaving,
    error,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    updateNode,
    updateEdge,
    updateTemplate,
    saveTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    exportTemplate
  } = useTemplateDesigner(templateId);
  
  // State management
  const [viewMode, setViewMode] = React.useState<'design' | 'contract' | 'preview'>('design');
  const [showLeftPanel, setShowLeftPanel] = React.useState(true);
  const [showRightPanel, setShowRightPanel] = React.useState(true);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showMinimap, setShowMinimap] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);
  const [showValidation, setShowValidation] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  // Toolbar handlers
  const handleSave = async () => {
    await saveTemplate();
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExport = () => {
    exportTemplate();
  };

  const handleShare = () => {
    console.log('Share template');
  };

  const handleSettings = () => {
    navigate(`/settings/templates/${template.id}/settings`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Template</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/settings/templates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  // Render different views
  if (viewMode === 'contract') {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <CanvasToolbar
          templateName={template.name}
          isDirty={isDirty}
          canUndo={canUndo}
          canRedo={canRedo}
          viewMode={viewMode}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPreview={handlePreview}
          onExport={handleExport}
          onShare={handleShare}
          onViewModeChange={setViewMode}
          onSettings={handleSettings}
        />
        <div className="flex-1 overflow-auto">
          <ContractView nodes={nodes} edges={edges} mode="view" />
        </div>
      </div>
    );
  }

  if (viewMode === 'preview') {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <CanvasToolbar
          templateName={template.name}
          isDirty={isDirty}
          canUndo={canUndo}
          canRedo={canRedo}
          viewMode={viewMode}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPreview={handlePreview}
          onExport={handleExport}
          onShare={handleShare}
          onViewModeChange={setViewMode}
          onSettings={handleSettings}
        />
        <div className="flex-1 overflow-auto p-8">
          <TemplatePreview
            templateId={template.id}
            onClose={() => setViewMode('design')}
          />
        </div>
      </div>
    );
  }

  // Design mode (default)
  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Toolbar */}
        <CanvasToolbar
          templateName={template.name}
          isDirty={isDirty}
          canUndo={canUndo}
          canRedo={canRedo}
          viewMode={viewMode}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPreview={handlePreview}
          onExport={handleExport}
          onShare={handleShare}
          onViewModeChange={setViewMode}
          onSettings={handleSettings}
        />

        {/* Main Content */}
        <div className="flex-1 flex relative">
          {/* Left Panel - Block Palette */}
          {showLeftPanel && (
            <div className="w-80 bg-white border-r border-gray-200 shadow-lg z-10">
              <BlockPalette />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 relative">
            <TemplateCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              isLocked={isLocked}
              showGrid={showGrid}
              showMinimap={showMinimap}
            />

            {/* Canvas Controls */}
            <CanvasControls
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
              showMinimap={showMinimap}
              onToggleMinimap={() => setShowMinimap(!showMinimap)}
              isLocked={isLocked}
              onToggleLock={() => setIsLocked(!isLocked)}
            />

            {/* Panel Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <PanelToggle
                leftPanel={showLeftPanel}
                rightPanel={showRightPanel}
                onToggleLeft={() => setShowLeftPanel(!showLeftPanel)}
                onToggleRight={() => setShowRightPanel(!showRightPanel)}
              />
            </div>
          </div>

          {/* Right Panel - Properties */}
          {showRightPanel && (
            <div className="w-96 bg-white border-l border-gray-200 shadow-lg z-10">
              <PropertiesPanel
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                template={template}
                onNodeUpdate={updateNode}
                onEdgeUpdate={updateEdge}
                onTemplateUpdate={updateTemplate}
              />
            </div>
          )}
        </div>

        {/* Validation Status */}
        {showValidation && (
          <ValidationStatus
            results={[]}
            onClose={() => setShowValidation(false)}
          />
        )}

        {/* Preview Modal */}
        {showPreview && (
          <TemplatePreview
            templateId={template.id}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}