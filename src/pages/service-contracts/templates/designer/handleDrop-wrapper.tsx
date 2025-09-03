// src/pages/service-contracts/templates/designer/handleDrop-wrapper.tsx
// This is a wrapper for the handleDrop function to fix the data structure mismatch

import { useCallback } from 'react';

// This wraps the useTemplateBuilder's handleDrop to fix the data structure
export const useFixedHandleDrop = (originalHandleDrop: any, addBlock: any) => {
  return useCallback((item: any, targetPosition: number) => {
    console.log('🎯 Fixed handleDrop - received item:', item);
    console.log('🎯 Target position:', targetPosition);

    // Check if it's a new block from the library (BLOCK_DRAG_TYPE)
    if (item && !item.type) {
      // This is from BlockLibrary - transform the data
      const transformedData = {
        type: 'block-variant',
        variantId: item.id,  // Map 'id' to 'variantId'
        blockType: item.nodeType || item.node_type,  // Map 'nodeType' to 'blockType'
        name: item.name,
        defaultConfig: item.defaultConfig || item.default_config || {}
      };
      
      console.log('🔄 Transformed data for handleDrop:', transformedData);
      
      // Call addBlock directly since handleDrop expects specific structure
      if (transformedData.variantId && transformedData.blockType && transformedData.name) {
        addBlock(
          transformedData.variantId,
          transformedData.blockType,
          transformedData.name,
          transformedData.defaultConfig
        );
      }
    } else {
      // This is an existing block being moved or proper data structure
      console.log('📦 Using original handleDrop for:', item);
      originalHandleDrop(item, targetPosition);
    }
  }, [originalHandleDrop, addBlock]);
};