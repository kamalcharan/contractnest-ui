// src/hooks/service-contracts/templates/useTemplateBuilder.ts
import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Block instance in template
interface BlockInstance {
  id: string; // Unique instance ID
  variantId: string; // Reference to block variant
  blockType: string; // node_type from variant
  name: string; // Display name
  position: number; // Order in template
  isRequired: boolean;
  configuration: Record<string, any>;
  isValid: boolean;
  validationErrors: string[];
  dependencies: string[]; // Other block instance IDs this depends on
  
  // UI state
  isSelected: boolean;
  isConfiguring: boolean;
  isDragging: boolean;
}

// Template builder state
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

// Drag and drop data
interface DragData {
  type: 'block-variant' | 'block-instance';
  variantId?: string;
  instanceId?: string;
  blockType?: string;
  name?: string;
  sourceIndex?: number;
}

interface UseTemplateBuilderOptions {
  initialTemplate?: Partial<TemplateBuilderState>;
  autoValidate?: boolean;
}

interface UseTemplateBuilderReturn {
  // State
  template: TemplateBuilderState;
  
  // Block operations
  addBlock: (variantId: string, blockType: string, name: string, defaultConfig?: any) => void;
  removeBlock: (instanceId: string) => void;
  moveBlock: (instanceId: string, newPosition: number) => void;
  updateBlockConfiguration: (instanceId: string, config: Record<string, any>) => void;
  
  // Selection
  selectBlock: (instanceId: string | null) => void;
  selectedBlock: BlockInstance | null;
  
  // Template operations
  updateTemplate: (updates: Partial<TemplateBuilderState>) => void;
  resetTemplate: () => void;
  
  // Validation
  validateTemplate: () => boolean;
  validateBlock: (instanceId: string) => boolean;
  getValidationErrors: () => string[];
  
  // Drag and drop
  handleDragStart: (data: DragData) => void;
  handleDragEnd: () => void;
  handleDrop: (data: DragData, targetPosition: number) => void;
  canDrop: (data: DragData, targetPosition: number) => boolean;
  
  // Utilities
  getBlockById: (instanceId: string) => BlockInstance | undefined;
  getBlocksByType: (blockType: string) => BlockInstance[];
  hasBlockType: (blockType: string) => boolean;
  getNextPosition: () => number;
  isDirty: boolean;
}

const INITIAL_TEMPLATE: TemplateBuilderState = {
  templateName: '',
  templateDescription: '',
  industry: '',
  contractType: 'service',
  blocks: [],
  selectedBlockId: null,
  isDirty: false
};

// Block type constraints (from PRD)
const BLOCK_CONSTRAINTS = {
  // Core blocks - single instance only
  'contact-block': { maxInstances: 1, required: true },
  'base-details-block': { maxInstances: 1, required: true },
  'equipment-block': { maxInstances: 1, required: false },
  'acceptance-block': { maxInstances: 1, required: true },
  
  // Commercial blocks - single instance
  'billing-rules-block': { maxInstances: 1, required: false },
  'revenue-sharing-block': { maxInstances: 1, required: false },
  
  // Event blocks - multiple instances allowed
  'service-commitment-block': { maxInstances: null, required: false },
  'milestone-block': { maxInstances: null, required: false },
  
  // Content blocks - multiple instances allowed
  'legal-clauses-block': { maxInstances: null, required: false },
  'image-upload-block': { maxInstances: null, required: false },
  'video-upload-block': { maxInstances: null, required: false },
  'document-upload-block': { maxInstances: null, required: false }
};

// Block dependencies (from PRD)
const BLOCK_DEPENDENCIES = {
  'base-details-block': ['contact-block'],
  'equipment-block': ['base-details-block'],
  'service-commitment-block': ['equipment-block'],
  'billing-rules-block': ['service-commitment-block'],
  'legal-clauses-block': ['base-details-block'],
  'acceptance-block': ['base-details-block']
};

export const useTemplateBuilder = (options: UseTemplateBuilderOptions = {}): UseTemplateBuilderReturn => {
  const { initialTemplate, autoValidate = true } = options;
  
  // State
  const [template, setTemplate] = useState<TemplateBuilderState>({
    ...INITIAL_TEMPLATE,
    ...initialTemplate
  });

  // Get selected block
  const selectedBlock = useMemo(() => {
    if (!template.selectedBlockId) return null;
    return template.blocks.find(block => block.id === template.selectedBlockId) || null;
  }, [template.selectedBlockId, template.blocks]);

  // Add block to template
  const addBlock = useCallback((variantId: string, blockType: string, name: string, defaultConfig: any = {}) => {
    // Check constraints
    const constraint = BLOCK_CONSTRAINTS[blockType as keyof typeof BLOCK_CONSTRAINTS];
    if (constraint?.maxInstances === 1) {
      const existing = template.blocks.find(block => block.blockType === blockType);
      if (existing) {
        console.warn(`Block type ${blockType} can only have one instance`);
        return;
      }
    }

    const newBlock: BlockInstance = {
      id: uuidv4(),
      variantId,
      blockType,
      name,
      position: template.blocks.length,
      isRequired: constraint?.required || false,
      configuration: defaultConfig,
      isValid: true,
      validationErrors: [],
      dependencies: BLOCK_DEPENDENCIES[blockType as keyof typeof BLOCK_DEPENDENCIES] || [],
      isSelected: false,
      isConfiguring: false,
      isDragging: false
    };

    setTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
      selectedBlockId: newBlock.id,
      isDirty: true
    }));
  }, [template.blocks]);

  // Remove block from template
  const removeBlock = useCallback((instanceId: string) => {
    setTemplate(prev => {
      const newBlocks = prev.blocks.filter(block => block.id !== instanceId);
      // Reorder positions
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        position: index
      }));
      
      return {
        ...prev,
        blocks: reorderedBlocks,
        selectedBlockId: prev.selectedBlockId === instanceId ? null : prev.selectedBlockId,
        isDirty: true
      };
    });
  }, []);

  // Move block to new position
  const moveBlock = useCallback((instanceId: string, newPosition: number) => {
    setTemplate(prev => {
      const blocks = [...prev.blocks];
      const blockIndex = blocks.findIndex(block => block.id === instanceId);
      
      if (blockIndex === -1) return prev;
      
      // Remove from current position
      const [movedBlock] = blocks.splice(blockIndex, 1);
      
      // Insert at new position
      blocks.splice(newPosition, 0, movedBlock);
      
      // Update all positions
      const reorderedBlocks = blocks.map((block, index) => ({
        ...block,
        position: index
      }));
      
      return {
        ...prev,
        blocks: reorderedBlocks,
        isDirty: true
      };
    });
  }, []);

  // Update block configuration
  const updateBlockConfiguration = useCallback((instanceId: string, config: Record<string, any>) => {
    setTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === instanceId 
          ? { ...block, configuration: { ...block.configuration, ...config }, isDirty: true }
          : block
      ),
      isDirty: true
    }));
  }, []);

  // Select block
  const selectBlock = useCallback((instanceId: string | null) => {
    setTemplate(prev => ({
      ...prev,
      selectedBlockId: instanceId,
      blocks: prev.blocks.map(block => ({
        ...block,
        isSelected: block.id === instanceId
      }))
    }));
  }, []);

  // Update template metadata
  const updateTemplate = useCallback((updates: Partial<TemplateBuilderState>) => {
    setTemplate(prev => ({
      ...prev,
      ...updates,
      isDirty: true
    }));
  }, []);

  // Reset template
  const resetTemplate = useCallback(() => {
    setTemplate({ ...INITIAL_TEMPLATE, ...initialTemplate });
  }, [initialTemplate]);

  // Validate individual block
  const validateBlock = useCallback((instanceId: string): boolean => {
    const block = template.blocks.find(b => b.id === instanceId);
    if (!block) return false;

    const errors: string[] = [];

    // Check dependencies
    const dependencies = BLOCK_DEPENDENCIES[block.blockType as keyof typeof BLOCK_DEPENDENCIES] || [];
    for (const depType of dependencies) {
      const hasDepBlock = template.blocks.some(b => b.blockType === depType);
      if (!hasDepBlock) {
        errors.push(`Missing required block: ${depType}`);
      }
    }

    // Update block validation state
    setTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => 
        b.id === instanceId 
          ? { ...b, isValid: errors.length === 0, validationErrors: errors }
          : b
      )
    }));

    return errors.length === 0;
  }, [template.blocks]);

  // Validate entire template
  const validateTemplate = useCallback((): boolean => {
    let isValid = true;
    
    // Validate each block
    template.blocks.forEach(block => {
      const blockValid = validateBlock(block.id);
      if (!blockValid) isValid = false;
    });

    // Check required blocks
    const requiredBlockTypes = Object.entries(BLOCK_CONSTRAINTS)
      .filter(([_, constraint]) => constraint.required)
      .map(([blockType]) => blockType);

    for (const requiredType of requiredBlockTypes) {
      const hasBlock = template.blocks.some(block => block.blockType === requiredType);
      if (!hasBlock) {
        isValid = false;
        console.warn(`Missing required block type: ${requiredType}`);
      }
    }

    return isValid;
  }, [template.blocks, validateBlock]);

  // Get all validation errors
  const getValidationErrors = useCallback((): string[] => {
    const errors: string[] = [];
    
    template.blocks.forEach(block => {
      errors.push(...block.validationErrors);
    });

    return errors;
  }, [template.blocks]);

  // Drag and drop handlers
  const handleDragStart = useCallback((data: DragData) => {
    if (data.type === 'block-instance' && data.instanceId) {
      setTemplate(prev => ({
        ...prev,
        blocks: prev.blocks.map(block => 
          block.id === data.instanceId 
            ? { ...block, isDragging: true }
            : block
        )
      }));
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => ({ ...block, isDragging: false }))
    }));
  }, []);

  const canDrop = useCallback((data: DragData, targetPosition: number): boolean => {
    if (data.type === 'block-variant' && data.blockType) {
      // Check if block type is already at max instances
      const constraint = BLOCK_CONSTRAINTS[data.blockType as keyof typeof BLOCK_CONSTRAINTS];
      if (constraint?.maxInstances === 1) {
        const existing = template.blocks.find(block => block.blockType === data.blockType);
        if (existing) return false;
      }
      return true;
    }
    
    if (data.type === 'block-instance') {
      // Always allow reordering existing blocks
      return true;
    }
    
    return false;
  }, [template.blocks]);

  const handleDrop = useCallback((data: DragData, targetPosition: number) => {
    if (data.type === 'block-variant' && data.variantId && data.blockType && data.name) {
      // Add new block
      addBlock(data.variantId, data.blockType, data.name);
    } else if (data.type === 'block-instance' && data.instanceId) {
      // Move existing block
      moveBlock(data.instanceId, targetPosition);
    }
  }, [addBlock, moveBlock]);

  // Utility functions
  const getBlockById = useCallback((instanceId: string) => {
    return template.blocks.find(block => block.id === instanceId);
  }, [template.blocks]);

  const getBlocksByType = useCallback((blockType: string) => {
    return template.blocks.filter(block => block.blockType === blockType);
  }, [template.blocks]);

  const hasBlockType = useCallback((blockType: string) => {
    return template.blocks.some(block => block.blockType === blockType);
  }, [template.blocks]);

  const getNextPosition = useCallback(() => {
    return template.blocks.length;
  }, [template.blocks]);

  return {
    // State
    template,
    
    // Block operations
    addBlock,
    removeBlock,
    moveBlock,
    updateBlockConfiguration,
    
    // Selection
    selectBlock,
    selectedBlock,
    
    // Template operations
    updateTemplate,
    resetTemplate,
    
    // Validation
    validateTemplate,
    validateBlock,
    getValidationErrors,
    
    // Drag and drop
    handleDragStart,
    handleDragEnd,
    handleDrop,
    canDrop,
    
    // Utilities
    getBlockById,
    getBlocksByType,
    hasBlockType,
    getNextPosition,
    isDirty: template.isDirty
  };
};

export default useTemplateBuilder;