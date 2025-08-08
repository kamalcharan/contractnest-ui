// src/utils/service-contracts/templates.ts
// Clean abstraction layer for template data access

import { 
  Template, 
  Industry, 
  TemplateStats 
} from '../../types/service-contracts/template';

// Import mock data from the fakejson folder
import {
  MOCK_TEMPLATES,
  INDUSTRIES,
  getTemplateStats as getMockTemplateStats,
  getTemplatesByIndustry as getMockTemplatesByIndustry,
  getTemplatesByType as getMockTemplatesByType,
  getPopularTemplates as getMockPopularTemplates,
  searchTemplates as searchMockTemplates,
  getTemplateById as getMockTemplateById,
  TEMPLATE_COMPLEXITY_LABELS,
  CONTRACT_TYPE_LABELS,
  ITEMS_PER_PAGE_OPTIONS
} from '../fakejson/service-contracts/templates';

// Environment configuration
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK === 'true';

// Re-export constants for components
export { 
  INDUSTRIES,
  TEMPLATE_COMPLEXITY_LABELS,
  CONTRACT_TYPE_LABELS,
  ITEMS_PER_PAGE_OPTIONS 
};

// Re-export types
export type { Template, Industry, TemplateStats };

// Re-export mock data for direct access when needed
export { MOCK_TEMPLATES };

// Abstracted data access functions
export const getTemplateStats = (): TemplateStats => {
  if (USE_MOCK_DATA) {
    return getMockTemplateStats();
  }
  throw new Error('API implementation pending');
};

export const getTemplatesByIndustry = (industryId: string): Template[] => {
  if (USE_MOCK_DATA) {
    return getMockTemplatesByIndustry(industryId);
  }
  throw new Error('API implementation pending');
};

export const getTemplatesByType = (contractType: 'service' | 'partnership'): Template[] => {
  if (USE_MOCK_DATA) {
    return getMockTemplatesByType(contractType);
  }
  throw new Error('API implementation pending');
};

export const getPopularTemplates = (): Template[] => {
  if (USE_MOCK_DATA) {
    return getMockPopularTemplates();
  }
  throw new Error('API implementation pending');
};

export const searchTemplates = (query: string): Template[] => {
  if (USE_MOCK_DATA) {
    return searchMockTemplates(query);
  }
  throw new Error('API implementation pending');
};

export const getTemplateById = (id: string): Template | undefined => {
  if (USE_MOCK_DATA) {
    return getMockTemplateById(id);
  }
  throw new Error('API implementation pending');
};