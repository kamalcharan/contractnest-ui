
// src/data/seo-pages.data.ts
import { SEOData } from '../types/seo.types';
import { SEO_CONSTANTS } from '../constants/seo.constants';

export const SEO_PAGES: Record<string, SEOData> = {
  home: {
    title: 'Service Contract Exchange Platform - Turn Commitments into Assets | ContractNest',
    description: 'Transform service agreements into automated, collaborative digital contracts. Manage compliance, automate invoicing, and scale your service relationships. ₹250/contract pricing.',
    keywords: SEOUtils.generateKeywords([
      'service contract exchange',
      'digital service agreements',
      'automated contract compliance',
      'service contract platform India'
    ]),
    canonical: SEOUtils.generateCanonicalUrl('/'),
    ogType: 'website',
    ogImage: SEO_CONSTANTS.DEFAULT_IMAGE
  },
  
  features: {
    title: 'Contract Management Features - Automation, Compliance & Analytics',
    description: 'Discover ContractNest features: automated reminders, SLA tracking, invoice generation, partner collaboration, and performance analytics for service contracts.',
    keywords: SEOUtils.generateKeywords([
      'contract management features',
      'SLA compliance automation',
      'automated invoice generation',
      'service contract analytics'
    ]),
    canonical: SEOUtils.generateCanonicalUrl('/features'),
    ogType: 'website'
  },
  
  industries: {
    title: 'Industry Solutions - Healthcare, Manufacturing, HVAC, Consulting',
    description: 'Specialized service contract management for healthcare, manufacturing, HVAC, and consulting industries. Compliance-ready templates and automation.',
    keywords: SEOUtils.generateKeywords([
      'healthcare contract management',
      'manufacturing service agreements',
      'HVAC maintenance contracts',
      'consulting contract automation'
    ]),
    canonical: SEOUtils.generateCanonicalUrl('/industries'),
    ogType: 'website'
  },
  
  pricing: {
    title: 'Contract-Based Pricing - ₹250 per Contract | No User Limits',
    description: 'Simple, transparent pricing at ₹250 per contract with no user limits. 100% OpEx model with automated billing and flexible contract management.',
    keywords: SEOUtils.generateKeywords([
      'contract management pricing',
      'affordable contract software',
      'OpEx contract platform',
      'per contract pricing model'
    ]),
    canonical: SEOUtils.generateCanonicalUrl('/pricing'),
    ogType: 'website'
  },

  'how-it-works': {
    title: 'How ContractNest Works - 4 Simple Steps to Digital Contracts',
    description: 'Learn how to digitize service contracts in 4 steps: Create, Collaborate, Automate, Scale. Transform manual processes into automated workflows.',
    keywords: SEOUtils.generateKeywords([
      'how contract management works',
      'digital contract process',
      'service agreement automation steps',
      'contract digitization guide'
    ]),
    canonical: SEOUtils.generateCanonicalUrl('/how-it-works'),
    ogType: 'website'
  }
};