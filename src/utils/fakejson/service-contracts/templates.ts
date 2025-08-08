// src/utils/fakejson/service-contracts/templates.ts
export interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  templateCount: number;
  isActive: boolean;
}

// Industry configurations
export const INDUSTRIES: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical services, patient care, and healthcare management',
    templateCount: 12,
    isActive: true
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Production, assembly, and industrial services',
    templateCount: 8,
    isActive: true
  },
  {
    id: 'financial',
    name: 'Financial Services',
    icon: '💰',
    description: 'Banking, insurance, and financial consulting',
    templateCount: 6,
    isActive: true
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Software development, IT services, and digital solutions',
    templateCount: 10,
    isActive: true
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: '🛒',
    description: 'Commerce, sales, and customer service',
    templateCount: 5,
    isActive: true
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Training, courses, and educational services',
    templateCount: 7,
    isActive: true
  },
  {
    id: 'government',
    name: 'Government',
    icon: '🏛️',
    description: 'Public services and government contracts',
    templateCount: 4,
    isActive: true
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    icon: '🤝',
    description: 'Charitable organizations and community services',
    templateCount: 3,
    isActive: true
  },
  {
    id: 'consulting',
    name: 'Consulting',
    icon: '💼',
    description: 'Professional advisory and consulting services',
    templateCount: 9,
    isActive: true
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Legal services and law firm operations',
    templateCount: 4,
    isActive: true
  }
];

// Mock global templates data - these are now marked as global templates owned by platform admin
export const MOCK_TEMPLATES = [
  // Healthcare Templates
  {
    id: 'hc-equipment-maintenance',
    name: 'Medical Equipment Maintenance',
    description: 'Comprehensive maintenance contract for medical devices including calibration, preventive maintenance, and emergency repairs.',
    industry: 'healthcare',
    contractType: 'service' as const,
    estimatedDuration: '15-20 min',
    complexity: 'medium' as const,
    tags: ['equipment', 'maintenance', 'medical-devices', 'calibration', 'compliance'],
    blocks: ['contact', 'equipment', 'service-commitments', 'calibration', 'billing', 'legal-clauses'],
    previewImage: '/templates/healthcare-equipment.jpg',
    usageCount: 234,
    rating: 4.8,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null, // null for original global templates
    tenantId: 'admin'
  },
  {
    id: 'hc-patient-services',
    name: 'Patient Care Services',
    description: 'Service agreement for comprehensive patient care including nursing, therapy, and medical support services.',
    industry: 'healthcare',
    contractType: 'service' as const,
    estimatedDuration: '12-15 min',
    complexity: 'simple' as const,
    tags: ['patient-care', 'nursing', 'therapy', 'medical-support'],
    blocks: ['contact', 'services', 'schedule', 'billing', 'compliance'],
    usageCount: 189,
    rating: 4.7,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-03-05T11:20:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },
  {
    id: 'hc-telemedicine',
    name: 'Telemedicine Services',
    description: 'Remote healthcare delivery contract covering virtual consultations, remote monitoring, and digital health services.',
    industry: 'healthcare',
    contractType: 'service' as const,
    estimatedDuration: '10-12 min',
    complexity: 'simple' as const,
    tags: ['telemedicine', 'remote-care', 'digital-health', 'virtual-consultations'],
    blocks: ['contact', 'services', 'technology-requirements', 'billing', 'privacy-compliance'],
    usageCount: 156,
    rating: 4.6,
    isPopular: false,
    status: 'active' as const,
    createdAt: '2024-02-01T13:45:00Z',
    updatedAt: '2024-03-15T16:10:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Manufacturing Templates
  {
    id: 'mfg-quality-control',
    name: 'Quality Control Services',
    description: 'Comprehensive quality assurance and testing services for manufacturing processes and products.',
    industry: 'manufacturing',
    contractType: 'service' as const,
    estimatedDuration: '18-25 min',
    complexity: 'complex' as const,
    tags: ['quality-control', 'testing', 'inspection', 'compliance', 'manufacturing'],
    blocks: ['contact', 'equipment', 'testing-procedures', 'reporting', 'billing', 'quality-standards'],
    usageCount: 198,
    rating: 4.9,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-03-12T10:45:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },
  {
    id: 'mfg-equipment-calibration',
    name: 'Industrial Equipment Calibration',
    description: 'Precision calibration services for industrial machinery and measurement equipment.',
    industry: 'manufacturing',
    contractType: 'service' as const,
    estimatedDuration: '20-30 min',
    complexity: 'complex' as const,
    tags: ['calibration', 'precision', 'industrial-equipment', 'measurement'],
    blocks: ['contact', 'equipment', 'calibration-procedures', 'certification', 'billing', 'compliance'],
    usageCount: 145,
    rating: 4.7,
    isPopular: false,
    status: 'active' as const,
    createdAt: '2024-01-25T11:20:00Z',
    updatedAt: '2024-03-08T15:30:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Financial Services Templates
  {
    id: 'fin-audit-services',
    name: 'Annual Audit Services',
    description: 'Comprehensive financial audit services including planning, execution, and reporting phases.',
    industry: 'financial',
    contractType: 'service' as const,
    estimatedDuration: '25-35 min',
    complexity: 'complex' as const,
    tags: ['audit', 'financial', 'compliance', 'reporting', 'annual'],
    blocks: ['contact', 'audit-scope', 'milestones', 'deliverables', 'billing', 'confidentiality'],
    usageCount: 167,
    rating: 4.8,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-05T14:15:00Z',
    updatedAt: '2024-03-20T09:25:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },
  {
    id: 'fin-investment-advisory',
    name: 'Investment Advisory Services',
    description: 'Professional investment management and advisory services for portfolio optimization.',
    industry: 'financial',
    contractType: 'service' as const,
    estimatedDuration: '15-20 min',
    complexity: 'medium' as const,
    tags: ['investment', 'advisory', 'portfolio-management', 'financial-planning'],
    blocks: ['contact', 'investment-objectives', 'risk-assessment', 'fee-structure', 'reporting'],
    usageCount: 123,
    rating: 4.5,
    isPopular: false,
    status: 'active' as const,
    createdAt: '2024-02-10T12:40:00Z',
    updatedAt: '2024-03-18T14:55:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Technology Templates
  {
    id: 'tech-software-development',
    name: 'Software Development Services',
    description: 'Custom software development contract covering requirements, development, testing, and deployment.',
    industry: 'technology',
    contractType: 'service' as const,
    estimatedDuration: '20-30 min',
    complexity: 'complex' as const,
    tags: ['software-development', 'custom-solutions', 'agile', 'deployment'],
    blocks: ['contact', 'project-scope', 'development-phases', 'deliverables', 'billing', 'ip-rights'],
    usageCount: 289,
    rating: 4.9,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-03-22T11:15:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },
  {
    id: 'tech-it-support',
    name: 'IT Support Services',
    description: 'Comprehensive IT support including helpdesk, maintenance, and technical assistance.',
    industry: 'technology',
    contractType: 'service' as const,
    estimatedDuration: '12-18 min',
    complexity: 'medium' as const,
    tags: ['it-support', 'helpdesk', 'maintenance', 'technical-assistance'],
    blocks: ['contact', 'support-levels', 'response-times', 'billing', 'service-level-agreement'],
    usageCount: 201,
    rating: 4.6,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-02-05T09:30:00Z',
    updatedAt: '2024-03-14T13:40:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Partnership Templates
  {
    id: 'partner-reseller-agreement',
    name: 'Reseller Partnership Agreement',
    description: 'Partnership agreement for product reselling with commission structure and territory definitions.',
    industry: 'retail',
    contractType: 'partnership' as const,
    estimatedDuration: '15-20 min',
    complexity: 'medium' as const,
    tags: ['reseller', 'partnership', 'commission', 'territory', 'sales'],
    blocks: ['contact', 'partnership-terms', 'commission-structure', 'territory', 'performance-metrics'],
    usageCount: 178,
    rating: 4.7,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-18T10:50:00Z',
    updatedAt: '2024-03-16T15:20:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },
  {
    id: 'partner-affiliate-marketing',
    name: 'Affiliate Marketing Partnership',
    description: 'Digital marketing partnership with performance-based compensation and tracking.',
    industry: 'technology',
    contractType: 'partnership' as const,
    estimatedDuration: '10-15 min',
    complexity: 'simple' as const,
    tags: ['affiliate', 'digital-marketing', 'performance-based', 'tracking'],
    blocks: ['contact', 'marketing-channels', 'commission-rates', 'tracking-methods', 'payment-terms'],
    usageCount: 134,
    rating: 4.4,
    isPopular: false,
    status: 'active' as const,
    createdAt: '2024-02-15T14:10:00Z',
    updatedAt: '2024-03-19T16:35:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Education Templates
  {
    id: 'edu-training-services',
    name: 'Professional Training Services',
    description: 'Corporate training and professional development services with certification programs.',
    industry: 'education',
    contractType: 'service' as const,
    estimatedDuration: '18-25 min',
    complexity: 'medium' as const,
    tags: ['training', 'professional-development', 'certification', 'corporate'],
    blocks: ['contact', 'training-modules', 'certification', 'schedule', 'billing', 'assessment'],
    usageCount: 156,
    rating: 4.6,
    isPopular: false,
    status: 'active' as const,
    createdAt: '2024-01-22T11:45:00Z',
    updatedAt: '2024-03-11T14:20:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  },

  // Consulting Templates
  {
    id: 'cons-business-consulting',
    name: 'Business Strategy Consulting',
    description: 'Strategic business consulting services for organizational development and growth planning.',
    industry: 'consulting',
    contractType: 'service' as const,
    estimatedDuration: '22-30 min',
    complexity: 'complex' as const,
    tags: ['strategy', 'business-consulting', 'organizational-development', 'growth'],
    blocks: ['contact', 'consulting-scope', 'methodology', 'deliverables', 'billing', 'confidentiality'],
    usageCount: 142,
    rating: 4.8,
    isPopular: true,
    status: 'active' as const,
    createdAt: '2024-01-28T13:15:00Z',
    updatedAt: '2024-03-17T10:30:00Z',
    createdBy: 'admin',
    // New Global Template Fields
    globalTemplate: true,
    globalTemplateId: null,
    tenantId: 'admin'
  }
];

// Template statistics
export const getTemplateStats = () => ({
  total: MOCK_TEMPLATES.length,
  service: MOCK_TEMPLATES.filter(t => t.contractType === 'service').length,
  partnership: MOCK_TEMPLATES.filter(t => t.contractType === 'partnership').length,
  popular: MOCK_TEMPLATES.filter(t => t.isPopular).length,
  industries: INDUSTRIES.length,
  byIndustry: INDUSTRIES.reduce((acc, industry) => {
    acc[industry.id] = MOCK_TEMPLATES.filter(t => t.industry === industry.id).length;
    return acc;
  }, {} as Record<string, number>),
  byComplexity: {
    simple: MOCK_TEMPLATES.filter(t => t.complexity === 'simple').length,
    medium: MOCK_TEMPLATES.filter(t => t.complexity === 'medium').length,
    complex: MOCK_TEMPLATES.filter(t => t.complexity === 'complex').length
  },
  averageRating: MOCK_TEMPLATES.reduce((sum, t) => sum + t.rating, 0) / MOCK_TEMPLATES.length,
  totalUsage: MOCK_TEMPLATES.reduce((sum, t) => sum + t.usageCount, 0)
});

// Helper functions for template operations
export const getTemplatesByIndustry = (industryId: string) => {
  return MOCK_TEMPLATES.filter(template => template.industry === industryId);
};

export const getTemplatesByType = (contractType: 'service' | 'partnership') => {
  return MOCK_TEMPLATES.filter(template => template.contractType === contractType);
};

export const getPopularTemplates = () => {
  return MOCK_TEMPLATES.filter(template => template.isPopular)
    .sort((a, b) => b.usageCount - a.usageCount);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return MOCK_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    template.industry.toLowerCase().includes(searchTerm)
  );
};

export const getTemplateById = (id: string) => {
  return MOCK_TEMPLATES.find(template => template.id === id);
};

// Template complexity labels and descriptions
export const TEMPLATE_COMPLEXITY_LABELS = {
  simple: 'Simple',
  medium: 'Medium',
  complex: 'Complex'
};

export const CONTRACT_TYPE_LABELS = {
  service: 'Service Contract',
  partnership: 'Partnership Agreement'
};

export const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48] as const;