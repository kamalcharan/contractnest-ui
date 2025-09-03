// src/pages/templates/template-designer/index.tsx
import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  Settings,
  Info,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import components
import BlockLibrary from '../../../components/service-contracts/templates/TemplateDesigner/BlockLibrary';
import TemplateCanvas from '../../../components/service-contracts/templates/TemplateDesigner/TemplateCanvas';
import BlockConfigPanel from '../../../components/service-contracts/templates/TemplateDesigner/BlockConfigPanel';

// Types
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

const TemplateDesignerPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Template state
  const [template, setTemplate] = useState<TemplateBuilderState>({
    templateName: 'New Template',
    templateDescription: '',
    industry: '',
    contractType: 'service',
    blocks: [],
    selectedBlockId: null,
    isDirty: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  // Handle drop from block library
  const handleDrop = useCallback((item: any, targetPosition: number) => {
    console.log('🎯 handleDrop called:', { item, targetPosition });

    // Check if it's a new block from library or moving existing block
    if (item.type === 'block-instance') {
      // Moving existing block
      const sourceIndex = item.sourceIndex;
      if (sourceIndex === targetPosition || sourceIndex === targetPosition - 1) {
        return; // No change needed
      }

      setTemplate(prev => {
        const newBlocks = [...prev.blocks];
        const [movedBlock] = newBlocks.splice(sourceIndex, 1);
        
        let adjustedPosition = targetPosition;
        if (sourceIndex < targetPosition) {
          adjustedPosition--;
        }
        
        newBlocks.splice(adjustedPosition, 0, movedBlock);
        
        // Update positions
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index
        }));

        return {
          ...prev,
          blocks: updatedBlocks,
          isDirty: true
        };
      });
    } else {
      // Adding new block from library
      const newBlock: BlockInstance = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        variantId: item.id,
        blockType: item.nodeType || item.blockMaster?.node_type || 'generic-block',
        name: item.name || 'New Block',
        position: targetPosition,
        isRequired: isBlockRequired(item.nodeType),
        configuration: item.defaultConfig || {},
        isValid: true,
        validationErrors: [],
        dependencies: item.dependencies || [],
        isSelected: false,
        isConfiguring: false,
        isDragging: false
      };

      console.log('📦 Creating new block:', newBlock);

      setTemplate(prev => {
        const newBlocks = [...prev.blocks];
        
        // Insert at position
        newBlocks.splice(targetPosition, 0, newBlock);
        
        // Update positions
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index
        }));

        console.log('✅ Updated blocks:', updatedBlocks);

        return {
          ...prev,
          blocks: updatedBlocks,
          selectedBlockId: newBlock.id,
          isDirty: true
        };
      });

      toast({
        title: "Block Added",
        description: `${newBlock.name} has been added to your template`,
        duration: 2000
      });
    }
  }, [toast]);

  // Check if drop is allowed
  const canDrop = useCallback((item: any, targetPosition: number) => {
    console.log('🤔 canDrop check:', { item, targetPosition });
    
    // For now, allow all drops
    // You can add validation logic here later
    // e.g., check dependencies, max instances, etc.
    
    return true;
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((item: any) => {
    console.log('🎬 Drag started:', item);
    setDraggedItem(item);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    console.log('🏁 Drag ended');
    setDraggedItem(null);
  }, []);

  // Block selection
  const handleBlockSelect = useCallback((blockId: string | null) => {
    setTemplate(prev => ({
      ...prev,
      selectedBlockId: blockId,
      blocks: prev.blocks.map(block => ({
        ...block,
        isSelected: block.id === blockId
      }))
    }));
  }, []);

  // Remove block
  const handleBlockRemove = useCallback((blockId: string) => {
    setTemplate(prev => {
      const newBlocks = prev.blocks.filter(b => b.id !== blockId);
      
      // Update positions
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        position: index
      }));

      return {
        ...prev,
        blocks: updatedBlocks,
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
        isDirty: true
      };
    });

    toast({
      title: "Block Removed",
      description: "The block has been removed from your template",
      duration: 2000
    });
  }, [toast]);

  // Move block (not used with drag-drop but kept for keyboard shortcuts)
  const handleBlockMove = useCallback((blockId: string, newPosition: number) => {
    console.log('📍 Block move:', { blockId, newPosition });
    // Implementation if needed for keyboard navigation
  }, []);

  // Update template metadata
  const handleUpdateTemplate = useCallback((updates: Partial<TemplateBuilderState>) => {
    setTemplate(prev => ({
      ...prev,
      ...updates,
      isDirty: true
    }));
  }, []);

  // Save template
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save template
      console.log('Saving template:', template);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setTemplate(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: new Date()
      }));

      toast({
        title: "Template Saved",
        description: "Your template has been saved successfully",
        duration: 3000
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to determine if block is required
  const isBlockRequired = (nodeType?: string): boolean => {
    const requiredBlocks = ['contact-block', 'base-details-block'];
    return requiredBlocks.includes(nodeType || '');
  };

  // Get selected block
  const selectedBlock = template.blocks.find(b => b.id === template.selectedBlockId) || null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {template.templateName || 'Untitled Template'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {template.isDirty ? 'Unsaved changes' : 'All changes saved'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !template.isDirty}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Block Library */}
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <BlockLibrary />
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-y-auto">
            <TemplateCanvas
              blocks={template.blocks}
              selectedBlockId={template.selectedBlockId}
              onBlockSelect={handleBlockSelect}
              onBlockRemove={handleBlockRemove}
              onBlockMove={handleBlockMove}
              onDrop={handleDrop}
              canDrop={canDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>

          {/* Right Panel - Configuration */}
          <div className="w-96 border-l border-border bg-card overflow-y-auto">
            <BlockConfigPanel
              selectedBlock={selectedBlock}
              template={template}
              onUpdateTemplate={handleUpdateTemplate}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="border-t border-border bg-muted/50 px-6 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Blocks: {template.blocks.length}</span>
            <span>Selected: {template.selectedBlockId || 'none'}</span>
            <span>Dragging: {draggedItem ? 'yes' : 'no'}</span>
            <span>Dirty: {template.isDirty ? 'yes' : 'no'}</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default TemplateDesignerPage;