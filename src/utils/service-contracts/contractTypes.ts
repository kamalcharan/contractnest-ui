// src/utils/service-contracts/contractTypes.ts
import { 
  ContractType, 
  AcceptanceCriteria, 
  BillingFrequency, 
  Priority 
} from '../../../types/contracts/contract';

// Contract type configurations
export interface ContractTypeConfig {
  id: ContractType;
  name: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  features: string[];
  suitableFor: string[];
  complexityLevel: 'simple' | 'medium' | 'complex';
  estimatedSetupTime: string;
  availableBlocks: string[];
  requiredBlocks: string[];
  defaultAcceptanceCriteria: AcceptanceCriteria;
  defaultBillingFrequency: BillingFrequency;
  maxDuration?: number; // months
  minDuration?: number; // months
}

export const CONTRACT_TYPE_CONFIGS: Record<ContractType, ContractTypeConfig> = {
  service: {
    id: 'service',
    name: 'Service Contract',
    description: 'Direct business relationship between buyer and seller with comprehensive service delivery, tracking, and billing.',
    icon: '🤝',
    color: 'text-blue-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    features: [
      'Service event tracking',
      'Equipment integration',
      'Milestone-based billing',
      'SLA compliance monitoring',
      'Automated invoicing',
      'Performance metrics',
      'Customer acceptance workflow'
    ],
    suitableFor: [
      'Equipment maintenance contracts',
      'Professional services',
      'IT support agreements',
      'Healthcare services',
      'Manufacturing support',
      'Consulting engagements'
    ],
    complexityLevel: 'complex',
    estimatedSetupTime: '15-30 minutes',
    availableBlocks: [
      'contact',
      'base-details',
      'equipment',
      'acceptance-criteria',
      'service-commitment',
      'milestone',
      'billing-rules',
      'legal-clauses',
      'image-upload',
      'video-upload',
      'document-upload'
    ],
    requiredBlocks: [
      'contact',
      'base-details',
      'acceptance-criteria',
      'billing-rules'
    ],
    defaultAcceptanceCriteria: 'signoff',
    defaultBillingFrequency: 'milestone',
    minDuration: 1,
    maxDuration: 60
  },
  partnership: {
    id: 'partnership',
    name: 'Partnership Agreement',
    description: 'Revenue sharing and collaboration agreement where partners execute services on behalf of the primary seller.',
    icon: '🤲',
    color: 'text-purple-600',
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    features: [
      'Revenue sharing model',
      'Commission tracking',
      'Partner performance metrics',
      'Simplified workflow',
      'Automated payouts',
      'Territory management',
      'Collaborative terms'
    ],
    suitableFor: [
      'Channel partnerships',
      'Reseller agreements',
      'Affiliate programs',
      'Joint ventures',
      'Distribution partnerships',
      'Service delivery partnerships'
    ],
    complexityLevel: 'medium',
    estimatedSetupTime: '10-20 minutes',
    availableBlocks: [
      'contact',
      'base-details',
      'partnership-terms',
      'revenue-sharing',
      'commission-structure',
      'territory-definition',
      'performance-metrics',
      'legal-clauses',
      'document-upload'
    ],
    requiredBlocks: [
      'contact',
      'base-details',
      'partnership-terms',
      'revenue-sharing'
    ],
    defaultAcceptanceCriteria: 'signoff',
    defaultBillingFrequency: 'monthly',
    minDuration: 6,
    maxDuration: 36
  }
};

// Acceptance criteria configurations
export interface AcceptanceCriteriaConfig {
  id: AcceptanceCriteria;
  name: string;
  description: string;
  icon: string;
  color: string;
  automationLevel: 'manual' | 'semi-automatic' | 'automatic';
  requirements: string[];
  timeline: string;
  suitableFor: ContractType[];
}

export const ACCEPTANCE_CRITERIA_CONFIGS: Record<AcceptanceCriteria, AcceptanceCriteriaConfig> = {
  payment: {
    id: 'payment',
    name: 'Payment Received',
    description: 'Contract becomes active when the initial payment or deposit is received',
    icon: '💳',
    color: 'text-green-600',
    automationLevel: 'automatic',
    requirements: [
      'Payment gateway integration',
      'Invoice generation',
      'Payment confirmation'
    ],
    timeline: 'Immediate upon payment confirmation',
    suitableFor: ['service', 'partnership']
  },
  signoff: {
    id: 'signoff',
    name: 'Customer Sign-off',
    description: 'Contract requires explicit acceptance and digital signature from the customer',
    icon: '✍️',
    color: 'text-blue-600',
    automationLevel: 'manual',
    requirements: [
      'Digital signature capability',
      'Document review workflow',
      'Notification system'
    ],
    timeline: 'Within 7-14 days of contract creation',
    suitableFor: ['service', 'partnership']
  },
  creation: {
    id: 'creation',
    name: 'Auto-accept on Creation',
    description: 'Contract becomes active immediately upon creation (internal agreements)',
    icon: '⚡',
    color: 'text-orange-600',
    automationLevel: 'automatic',
    requirements: [
      'Internal approval workflow',
      'Risk assessment'
    ],
    timeline: 'Immediate',
    suitableFor: ['partnership']
  }
};

// Billing frequency configurations
export interface BillingFrequencyConfig {
  id: BillingFrequency;
  name: string;
  description: string;
  icon: string;
  interval: number; // days
  suitableFor: ContractType[];
  advantages: string[];
  considerations: string[];
}

export const BILLING_FREQUENCY_CONFIGS: Record<BillingFrequency, BillingFrequencyConfig> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    description: 'Bill customers every month on a fixed date',
    icon: '📅',
    interval: 30,
    suitableFor: ['service', 'partnership'],
    advantages: [
      'Predictable cash flow',
      'Easy budgeting for customers',
      'Regular touchpoints'
    ],
    considerations: [
      'Higher administrative overhead',
      'More payment processing fees'
    ]
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly',
    description: 'Bill customers every three months',
    icon: '📊',
    interval: 90,
    suitableFor: ['service', 'partnership'],
    advantages: [
      'Reduced administrative burden',
      'Better cash flow per invoice',
      'Quarterly business reviews'
    ],
    considerations: [
      'Longer payment cycles',
      'Larger invoice amounts'
    ]
  },
  annually: {
    id: 'annually',
    name: 'Annually',
    description: 'Single annual payment for the entire contract',
    icon: '🗓️',
    interval: 365,
    suitableFor: ['service', 'partnership'],
    advantages: [
      'Maximum cash flow upfront',
      'Minimal billing overhead',
      'Annual planning alignment'
    ],
    considerations: [
      'Large upfront commitment',
      'Refund complications',
      'Cash flow impact on customers'
    ]
  },
  milestone: {
    id: 'milestone',
    name: 'Milestone-based',
    description: 'Bill based on project milestones and deliverables',
    icon: '🎯',
    interval: 0, // Variable
    suitableFor: ['service'],
    advantages: [
      'Payment tied to value delivery',
      'Risk mitigation',
      'Performance incentive'
    ],
    considerations: [
      'Complex milestone definition',
      'Potential disputes',
      'Irregular cash flow'
    ]
  },
  on_completion: {
    id: 'on_completion',
    name: 'On Completion',
    description: 'Single payment when all services are completed',
    icon: '🏁',
    interval: 0, // Variable
    suitableFor: ['service'],
    advantages: [
      'Customer pays for results',
      'Strong completion incentive',
      'Simple billing structure'
    ],
    considerations: [
      'Delayed cash flow',
      'Risk of scope creep',
      'Working capital impact'
    ]
  },
  prepaid: {
    id: 'prepaid',
    name: 'Prepaid',
    description: 'Customer pays upfront for services to be delivered',
    icon: '💰',
    interval: 0, // Upfront
    suitableFor: ['service'],
    advantages: [
      'Immediate cash flow',
      'No collection risk',
      'Customer commitment'
    ],
    considerations: [
      'Refund policy needed',
      'Service delivery pressure',
      'Customer cash flow impact'
    ]
  }
};

// Priority configurations
export interface PriorityConfig {
  id: Priority;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  slaMultiplier: number; // Affects response times
  escalationLevel: number;
}

export const PRIORITY_CONFIGS: Record<Priority, PriorityConfig> = {
  low: {
    id: 'low',
    name: 'Low',
    description: 'Standard priority for routine contracts',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    icon: '⬇️',
    slaMultiplier: 1.5,
    escalationLevel: 1
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Standard business priority',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: '➡️',
    slaMultiplier: 1.0,
    escalationLevel: 2
  },
  high: {
    id: 'high',
    name: 'High',
    description: 'Important contracts requiring faster processing',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    icon: '⬆️',
    slaMultiplier: 0.7,
    escalationLevel: 3
  },
  critical: {
    id: 'critical',
    name: 'Critical',
    description: 'Urgent contracts requiring immediate attention',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: '🚨',
    slaMultiplier: 0.5,
    escalationLevel: 4
  }
};

// Industry-specific configurations
export interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  commonContractTypes: ContractType[];
  typicalBillingFrequencies: BillingFrequency[];
  standardAcceptanceCriteria: AcceptanceCriteria[];
  requiredCompliance: string[];
  avgContractDuration: number; // months
}

export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical equipment, patient services, compliance',
    commonContractTypes: ['service'],
    typicalBillingFrequencies: ['monthly', 'quarterly'],
    standardAcceptanceCriteria: ['signoff', 'payment'],
    requiredCompliance: ['HIPAA', 'FDA', 'HITECH'],
    avgContractDuration: 12
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Equipment maintenance, quality control, production',
    commonContractTypes: ['service', 'partnership'],
    typicalBillingFrequencies: ['milestone', 'quarterly'],
    standardAcceptanceCriteria: ['signoff', 'payment'],
    requiredCompliance: ['ISO 9001', 'OSHA', 'EPA'],
    avgContractDuration: 18
  },
  financial: {
    id: 'financial',
    name: 'Financial Services',
    icon: '💰',
    description: 'Audit, consulting, compliance services',
    commonContractTypes: ['service'],
    typicalBillingFrequencies: ['milestone', 'monthly'],
    standardAcceptanceCriteria: ['signoff'],
    requiredCompliance: ['SOX', 'PCI DSS', 'GDPR'],
    avgContractDuration: 6
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Software development, IT support, maintenance',
    commonContractTypes: ['service', 'partnership'],
    typicalBillingFrequencies: ['monthly', 'milestone'],
    standardAcceptanceCriteria: ['signoff', 'creation'],
    requiredCompliance: ['SOC 2', 'ISO 27001', 'GDPR'],
    avgContractDuration: 12
  },
  professional: {
    id: 'professional',
    name: 'Professional Services',
    icon: '💼',
    description: 'Legal, consulting, accounting services',
    commonContractTypes: ['service'],
    typicalBillingFrequencies: ['monthly', 'milestone'],
    standardAcceptanceCriteria: ['signoff'],
    requiredCompliance: ['Professional Standards', 'Ethics Codes'],
    avgContractDuration: 9
  },
  logistics: {
    id: 'logistics',
    name: 'Logistics & Transport',
    icon: '🚛',
    description: 'Transportation, warehousing, delivery services',
    commonContractTypes: ['service', 'partnership'],
    typicalBillingFrequencies: ['monthly', 'quarterly'],
    standardAcceptanceCriteria: ['creation', 'signoff'],
    requiredCompliance: ['DOT', 'HAZMAT', 'International Trade'],
    avgContractDuration: 24
  }
};

// UI Configuration
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_TAGS_DISPLAY: 3,
  MAX_DESCRIPTION_LENGTH: 150,
  ANIMATION_DURATION: 200,
  LOADING_DELAY: 100,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
};

// Validation rules
export const VALIDATION_RULES = {
  CONTRACT_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_]+$/
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000
  },
  DURATION: {
    MIN_MONTHS: 1,
    MAX_MONTHS: 60
  },
  AMOUNT: {
    MIN_VALUE: 0,
    MAX_VALUE: 10000000
  }
};

// Helper functions
export const getContractTypeConfig = (type: ContractType): ContractTypeConfig => {
  return CONTRACT_TYPE_CONFIGS[type];
};

export const getAcceptanceCriteriaConfig = (criteria: AcceptanceCriteria): AcceptanceCriteriaConfig => {
  return ACCEPTANCE_CRITERIA_CONFIGS[criteria];
};

export const getBillingFrequencyConfig = (frequency: BillingFrequency): BillingFrequencyConfig => {
  return BILLING_FREQUENCY_CONFIGS[frequency];
};

export const getPriorityConfig = (priority: Priority): PriorityConfig => {
  return PRIORITY_CONFIGS[priority];
};

export const getIndustryConfig = (industry: string): IndustryConfig | undefined => {
  return INDUSTRY_CONFIGS[industry];
};

export const getAvailableContractTypes = (industry?: string): ContractType[] => {
  if (!industry) return ['service', 'partnership'];
  const industryConfig = getIndustryConfig(industry);
  return industryConfig?.commonContractTypes || ['service', 'partnership'];
};

export const getRecommendedBillingFrequencies = (industry?: string, contractType?: ContractType): BillingFrequency[] => {
  if (!industry) {
    return contractType === 'partnership' 
      ? ['monthly', 'quarterly'] 
      : ['monthly', 'quarterly', 'milestone'];
  }
  
  const industryConfig = getIndustryConfig(industry);
  return industryConfig?.typicalBillingFrequencies || ['monthly', 'quarterly'];
};

export const getRecommendedAcceptanceCriteria = (industry?: string, contractType?: ContractType): AcceptanceCriteria[] => {
  if (!industry) {
    return contractType === 'partnership' 
      ? ['signoff', 'creation'] 
      : ['signoff', 'payment'];
  }
  
  const industryConfig = getIndustryConfig(industry);
  return industryConfig?.standardAcceptanceCriteria || ['signoff'];
};