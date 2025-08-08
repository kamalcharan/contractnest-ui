// src/hooks/service-contracts/templates/useTemplates.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Template, 
  TemplateFilters, 
  TemplateSearchResult, 
  TemplateStats,
  UseTemplatesReturn,
  DEFAULT_TEMPLATE_FILTERS,
  ITEMS_PER_PAGE_OPTIONS,
  CopyTemplatePayload,
  TemplateCardContext
} from "@/types/service-contracts/template";

// Import from abstraction layer
import { 
  MOCK_TEMPLATES, 
  INDUSTRIES, 
  getTemplatesByIndustry,
  getTemplatesByType,
  getPopularTemplates,
  searchTemplates,
  getTemplateById,
  getTemplateStats
} from '@/utils/service-contracts/templates';

// Environment flag to switch between mock and API data
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_MOCK === 'true';

// Context interface for template usage scenarios
export interface TemplateContext {
  mode?: 'marketplace' | 'management' | 'selection';
  isGlobal?: boolean;
  tenantId?: string;
  userRole?: 'admin' | 'user';
}

export const useTemplates = (
  initialFilters?: Partial<TemplateFilters>,
  context?: TemplateContext
): UseTemplatesReturn => {
  // State management
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    ...DEFAULT_TEMPLATE_FILTERS,
    ...initialFilters
  });
  const [stats, setStats] = useState<TemplateStats | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<TemplateSearchResult['pagination'] | null>(null);

  // Debounced search term
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search || '');
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Mock API simulation with delay
  const simulateApiCall = useCallback(async <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }, []);

  // Apply filters to templates (enhanced with global/local filtering)
  const applyFilters = useCallback((templateList: Template[], filterParams: TemplateFilters): TemplateSearchResult => {
    let filteredTemplates = [...templateList];

    // Apply global/local template filtering based on context
    if (context?.isGlobal !== undefined) {
      filteredTemplates = filteredTemplates.filter(t => t.globalTemplate === context.isGlobal);
    } else if (filterParams.globalTemplate !== undefined) {
      filteredTemplates = filteredTemplates.filter(t => t.globalTemplate === filterParams.globalTemplate);
    }

    // Apply tenant filtering
    if (context?.tenantId) {
      filteredTemplates = filteredTemplates.filter(t => t.tenantId === context.tenantId);
    } else if (filterParams.tenantId) {
      filteredTemplates = filteredTemplates.filter(t => t.tenantId === filterParams.tenantId);
    }

    // Apply industry filter
    if (filterParams.industry) {
      filteredTemplates = filteredTemplates.filter(t => t.industry === filterParams.industry);
    }

    // Apply contract type filter
    if (filterParams.contractType) {
      filteredTemplates = filteredTemplates.filter(t => t.contractType === filterParams.contractType);
    }

    // Apply complexity filter
    if (filterParams.complexity) {
      filteredTemplates = filteredTemplates.filter(t => t.complexity === filterParams.complexity);
    }

    // Apply popular filter
    if (filterParams.isPopular) {
      filteredTemplates = filteredTemplates.filter(t => t.isPopular);
    }

    // Apply tag filters
    if (filterParams.tags && filterParams.tags.length > 0) {
      filteredTemplates = filteredTemplates.filter(t => 
        filterParams.tags!.some(tag => t.tags.includes(tag))
      );
    }

    // Apply search filter
    if (filterParams.search && filterParams.search.trim()) {
      const searchTerm = filterParams.search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        t.industry.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const sortBy = filterParams.sortBy || 'usageCount';
    const sortOrder = filterParams.sortOrder || 'desc';
    
    filteredTemplates.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Template];
      let bValue: any = b[sortBy as keyof Template];

      // Handle date sorting
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const page = filterParams.page || 1;
    const limit = filterParams.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    return {
      templates: paginatedTemplates,
      pagination: {
        page,
        limit,
        total: filteredTemplates.length,
        totalPages: Math.ceil(filteredTemplates.length / limit)
      },
      filters: filterParams
    };
  }, [context]);

  // Enhanced template stats calculation
  const calculateStats = useCallback((templateList: Template[]): TemplateStats => {
    const baseStats = getTemplateStats();
    
    // Calculate global/local stats
    const globalTemplates = templateList.filter(t => t.globalTemplate);
    const localTemplates = templateList.filter(t => !t.globalTemplate);
    
    // Calculate by tenant stats
    const byTenant = templateList.reduce((acc, template) => {
      acc[template.tenantId] = (acc[template.tenantId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...baseStats,
      global: globalTemplates.length,
      local: localTemplates.length,
      byTenant
    };
  }, []);

  // Fetch templates (mock or API)
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock implementation with context-aware filtering
        let templateData = [...MOCK_TEMPLATES];
        
        // For demo purposes, add some mock local templates
        if (context?.mode === 'management' && !context.isGlobal) {
          // Add some mock tenant templates
          const mockTenantTemplates = MOCK_TEMPLATES.slice(0, 3).map(template => ({
            ...template,
            id: `tenant-${template.id}`,
            name: `My ${template.name}`,
            globalTemplate: false,
            globalTemplateId: template.id,
            tenantId: 'current-tenant',
            usageCount: Math.floor(template.usageCount * 0.3),
            isPopular: false
          }));
          
          templateData = [...templateData, ...mockTenantTemplates];
        }
        
        const result = applyFilters(templateData, filters);
        const templateStats = calculateStats(templateData);
        
        // Simulate API delay
        await simulateApiCall(result, 300);
        
        setTemplates(result.templates);
        setPagination(result.pagination);
        setStats(templateStats);
      } else {
        // TODO: Replace with actual API call
        throw new Error('API implementation pending');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(errorMessage);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, applyFilters, calculateStats, context]);

  // Initial fetch and refetch when filters or context change
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Update filters function
  const updateFilters = useCallback((newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset page when filters change (except when changing page itself)
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  }, []);

  // Clear filters function
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_TEMPLATE_FILTERS);
  }, []);

  // Search templates function
  const searchTemplatesFunction = useCallback((query: string) => {
    updateFilters({ search: query, page: 1 });
  }, [updateFilters]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchTemplates();
  }, [fetchTemplates]);

  // Copy global template to local (new function)
  const copyGlobalTemplate = useCallback(async (
    templateId: string, 
    payload?: Partial<CopyTemplatePayload>
  ): Promise<Template> => {
    try {
      if (USE_MOCK_DATA) {
        const originalTemplate = getTemplateById(templateId);
        if (!originalTemplate) {
          throw new Error('Template not found');
        }

        if (!originalTemplate.globalTemplate) {
          throw new Error('Can only copy global templates');
        }

        // Create copied template
        const copiedTemplate: Template = {
          ...originalTemplate,
          id: `local-${templateId}-${Date.now()}`,
          name: payload?.name || `My ${originalTemplate.name}`,
          description: payload?.description || originalTemplate.description,
          tags: payload?.tags || [...originalTemplate.tags, 'copied'],
          globalTemplate: false,
          globalTemplateId: templateId,
          tenantId: 'current-tenant', // Should be actual tenant ID
          usageCount: 0,
          isPopular: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current-user'
        };

        // Simulate API delay
        await simulateApiCall(copiedTemplate, 500);
        
        // Refresh templates to include the new copy
        await refetch();
        
        return copiedTemplate;
      } else {
        // TODO: Replace with actual API call
        throw new Error('API implementation pending');
      }
    } catch (error) {
      console.error('Error copying template:', error);
      throw error;
    }
  }, [refetch]);

  // Get global templates only
  const getGlobalTemplates = useCallback(() => {
    return templates.filter(t => t.globalTemplate);
  }, [templates]);

  // Get local templates only
  const getLocalTemplates = useCallback(() => {
    return templates.filter(t => !t.globalTemplate);
  }, [templates]);

  // Memoized computed values
  const hasActiveFilters = useMemo(() => {
    const defaultFilters = DEFAULT_TEMPLATE_FILTERS;
    return (
      filters.industry !== defaultFilters.industry ||
      filters.contractType !== defaultFilters.contractType ||
      filters.complexity !== defaultFilters.complexity ||
      filters.isPopular !== defaultFilters.isPopular ||
      filters.globalTemplate !== undefined ||
      filters.tenantId !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.search && filters.search.trim().length > 0)
    );
  }, [filters]);

  const isEmpty = useMemo(() => {
    return !loading && templates.length === 0;
  }, [loading, templates.length]);

  const isSearching = useMemo(() => {
    return !!(filters.search && filters.search.trim().length > 0);
  }, [filters.search]);

  // Return enhanced hook interface
  return {
    templates,
    loading,
    error,
    pagination,
    filters,
    stats,
    refetch,
    updateFilters,
    clearFilters,
    searchTemplates: searchTemplatesFunction,
    
    // New: Global/Local template operations
    copyGlobalTemplate,
    getGlobalTemplates,
    getLocalTemplates,
    
    // Additional computed properties for convenience
    hasActiveFilters,
    isEmpty,
    isSearching,
    totalTemplates: pagination?.total || 0,
    currentPage: pagination?.page || 1,
    totalPages: pagination?.totalPages || 1,
    
    // Quick access functions
    getTemplateById: useCallback((id: string) => getTemplateById(id), []),
    getIndustries: useCallback(() => INDUSTRIES, []),
    getPopularTemplates: useCallback(() => getPopularTemplates(), [])
  } as UseTemplatesReturn & {
    hasActiveFilters: boolean;
    isEmpty: boolean;
    isSearching: boolean;
    totalTemplates: number;
    currentPage: number;
    totalPages: number;
    getTemplateById: (id: string) => Template | undefined;
    getIndustries: () => typeof INDUSTRIES;
    getPopularTemplates: () => Template[];
  };
};

// Specialized hook for template selection in contract creation
export const useTemplateSelection = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectionHistory, setSelectionHistory] = useState<Template[]>([]);

  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setSelectionHistory(prev => {
      const filtered = prev.filter(t => t.id !== template.id);
      return [template, ...filtered].slice(0, 5); // Keep last 5 selections
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  const isSelected = useCallback((templateId: string): boolean => {
    return selectedTemplate?.id === templateId;
  }, [selectedTemplate]);

  return {
    selectedTemplate,
    selectionHistory,
    selectTemplate,
    clearSelection,
    isSelected,
    hasSelection: !!selectedTemplate
  };
};

// Hook for template statistics and analytics
export const useTemplateAnalytics = () => {
  const [analytics, setAnalytics] = useState<TemplateStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        if (USE_MOCK_DATA) {
          const stats = getTemplateStats();
          // Add global/local breakdown
          const enhancedStats = {
            ...stats,
            global: MOCK_TEMPLATES.filter(t => t.globalTemplate).length,
            local: MOCK_TEMPLATES.filter(t => !t.globalTemplate).length
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 200));
          setAnalytics(enhancedStats);
        } else {
          // TODO: API call for analytics
          throw new Error('API implementation pending');
        }
      } catch (err) {
        console.error('Error fetching template analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    mostUsedTemplates: analytics ? 
      MOCK_TEMPLATES.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5) : [],
    topRatedTemplates: analytics ?
      MOCK_TEMPLATES.sort((a, b) => b.rating - a.rating).slice(0, 5) : [],
    industryDistribution: analytics?.byIndustry || {},
    complexityDistribution: analytics?.byComplexity || {},
    globalVsLocalDistribution: analytics ? {
      global: analytics.global || 0,
      local: analytics.local || 0
    } : { global: 0, local: 0 }
  };
};