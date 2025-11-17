// src/utils/fakejson/bbbMockData.ts
// File 2/13 - BBB Directory Mock Data

import { TenantMarketProfile, TenantProfile, SemanticCluster, BBBAdminStats, BBBSearchResult } from '../../types/bbb';

// Mock Tenant Profiles
export const mockTenantProfiles: TenantProfile[] = [
  {
    id: 'tp-001',
    tenant_id: 't-001',
    business_name: 'Vikuna Technologies',
    business_email: 'charan@vikuna.tech',
    business_phone: '9949701175',
    business_phone_code: '+91',
    website_url: 'https://www.vikuna.tech',
    logo_url: 'https://via.placeholder.com/150/007bff/ffffff?text=VT',
    business_category: 'IT Services',
    city: 'Hyderabad',
    address_line1: 'Madhapur',
    postal_code: '500081',
    country_code: 'IN',
    state_code: 'TG'
  },
  {
    id: 'tp-002',
    tenant_id: 't-002',
    business_name: 'DigiGrow Marketing',
    business_email: 'rahul@digigrow.in',
    business_phone: '9887162776',
    business_phone_code: '+91',
    website_url: 'https://www.digigrow.in',
    logo_url: 'https://via.placeholder.com/150/28a745/ffffff?text=DG',
    business_category: 'Digital Marketing',
    city: 'Hyderabad',
    address_line1: 'Banjara Hills',
    postal_code: '500034',
    country_code: 'IN',
    state_code: 'TG'
  },
  {
    id: 'tp-003',
    tenant_id: 't-003',
    business_name: 'Legal Solutions & Associates',
    business_email: 'priya@legalsolutions.in',
    business_phone: '9876543210',
    business_phone_code: '+91',
    website_url: 'https://www.legalsolutions.in',
    logo_url: 'https://via.placeholder.com/150/dc3545/ffffff?text=LS',
    business_category: 'Legal Services',
    city: 'Hyderabad',
    address_line1: 'Jubilee Hills',
    postal_code: '500033',
    country_code: 'IN',
    state_code: 'TG'
  },
  {
    id: 'tp-004',
    tenant_id: 't-004',
    business_name: 'NetConnect Systems',
    business_email: 'info@netconnect.in',
    business_phone: '9123456789',
    business_phone_code: '+91',
    website_url: 'https://www.netconnect.in',
    logo_url: 'https://via.placeholder.com/150/6c757d/ffffff?text=NC',
    business_category: 'Networking Services',
    city: 'Hyderabad',
    address_line1: 'HITEC City',
    postal_code: '500081',
    country_code: 'IN',
    state_code: 'TG'
  },
  {
    id: 'tp-005',
    tenant_id: 't-005',
    business_name: 'Ayurveda Wellness Center',
    business_email: 'care@ayurvedacenter.in',
    business_phone: '9988776655',
    business_phone_code: '+91',
    website_url: 'https://www.ayurvedacenter.in',
    logo_url: 'https://via.placeholder.com/150/17a2b8/ffffff?text=AW',
    business_category: 'Healthcare',
    city: 'Hyderabad',
    address_line1: 'Ameerpet',
    postal_code: '500016',
    country_code: 'IN',
    state_code: 'TG'
  }
];

// Mock Market Profiles
export const mockMarketProfiles: TenantMarketProfile[] = [
  {
    id: 'mp-001',
    tenant_id: 't-001',
    tenant_profile_id: 'tp-001',
    mobile_number: '9949701175',
    whatsapp_number: '9949701175',
    marketplace_type: 'bbb',
    branch: 'bagyanagar',
    short_description: 'We provide IT services and custom software solutions for businesses.',
    ai_enhanced_description: 'We are Vikuna Technologies, a leading IT services provider in Hyderabad. We specialize in custom software development, cloud solutions, and digital transformation for businesses of all sizes. Our expert team delivers networking infrastructure, cybersecurity, and web/mobile applications tailored to your needs. With over 10 years of experience serving 200+ clients, we turn complex technology challenges into simple, scalable solutions. Contact us at +91 9949701175 or visit www.vikuna.tech to discuss how we can empower your digital journey.',
    raw_data: 'Vikuna Technologies IT Services Software Development Cloud Solutions Networking Cybersecurity Web Applications Mobile Apps Digital Transformation',
    suggested_keywords: ['IT Services', 'Software Development', 'Cloud', 'Networking', 'Cybersecurity', 'Web Apps'],
    approved_keywords: ['IT Services', 'Software Development', 'Cloud Solutions', 'Networking'],
    service_tags: ['Software', 'IT', 'Technology', 'Cloud', 'Digital'],
    business_category: 'IT Services',
    structured_data: {
      services: ['Custom Software', 'Cloud Migration', 'IT Consulting', 'Web Development'],
      experience_years: 10,
      client_count: 200
    },
    generation_method: 'ai_enhanced',
    profile_status: 'active',
    is_publicly_searchable: true,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-14T15:30:00Z',
    is_active: true
  },
  {
    id: 'mp-002',
    tenant_id: 't-002',
    tenant_profile_id: 'tp-002',
    mobile_number: '9887162776',
    whatsapp_number: '9887162776',
    marketplace_type: 'bbb',
    branch: 'bagyanagar',
    short_description: 'Digital marketing agency specializing in SEO, social media, and content marketing.',
    ai_enhanced_description: 'DigiGrow Marketing is your partner in digital success. We offer comprehensive digital marketing services including SEO, social media management, content creation, and performance marketing. Our data-driven strategies have helped over 150 brands increase their online presence and revenue. From startups to enterprises, we craft customized campaigns that deliver measurable results. Let us grow your digital footprint with our proven expertise in the ever-evolving digital landscape.',
    raw_data: 'DigiGrow Marketing Digital Marketing SEO Social Media Content Marketing Performance Marketing Brand Building Online Advertising',
    suggested_keywords: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Brand Building'],
    approved_keywords: ['Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Strategy'],
    service_tags: ['Marketing', 'Digital', 'SEO', 'Social Media', 'Advertising'],
    business_category: 'Digital Marketing',
    structured_data: {
      services: ['SEO', 'Social Media Management', 'Content Marketing', 'PPC Advertising'],
      clients_served: 150,
      industries: ['E-commerce', 'Healthcare', 'Education', 'Real Estate']
    },
    generation_method: 'ai_enhanced',
    profile_status: 'active',
    is_publicly_searchable: true,
    created_at: '2025-11-02T11:30:00Z',
    updated_at: '2025-11-14T16:00:00Z',
    is_active: true
  },
  {
    id: 'mp-003',
    tenant_id: 't-003',
    tenant_profile_id: 'tp-003',
    mobile_number: '9876543210',
    whatsapp_number: '9876543210',
    marketplace_type: 'bbb',
    branch: 'bagyanagar',
    short_description: 'Full-service law firm specializing in corporate law, contracts, and dispute resolution.',
    ai_enhanced_description: 'Legal Solutions & Associates is a premier law firm offering comprehensive legal services for businesses and individuals. Our expertise spans corporate law, contract drafting and review, intellectual property, and dispute resolution. With a team of experienced advocates, we provide practical legal solutions tailored to your business needs. We pride ourselves on transparent communication, cost-effective services, and successful outcomes for our clients across various industries.',
    raw_data: 'Legal Solutions Law Firm Corporate Law Contracts Dispute Resolution Intellectual Property Legal Advisory Advocates Litigation',
    suggested_keywords: ['Legal Services', 'Corporate Law', 'Contracts', 'Dispute Resolution', 'Advocates'],
    approved_keywords: ['Legal Services', 'Corporate Law', 'Contract Law', 'Litigation'],
    service_tags: ['Legal', 'Law', 'Contracts', 'Corporate', 'Litigation'],
    business_category: 'Legal Services',
    structured_data: {
      services: ['Corporate Law', 'Contract Drafting', 'Dispute Resolution', 'IP Rights'],
      experience_years: 15,
      case_success_rate: 92
    },
    generation_method: 'ai_enhanced',
    profile_status: 'pending',
    is_publicly_searchable: false,
    created_at: '2025-11-13T09:00:00Z',
    updated_at: '2025-11-14T10:00:00Z',
    is_active: true
  },
  {
    id: 'mp-004',
    tenant_id: 't-004',
    tenant_profile_id: 'tp-004',
    mobile_number: '9123456789',
    whatsapp_number: '9123456789',
    marketplace_type: 'bbb',
    branch: 'bagyanagar',
    short_description: 'Networking equipment and IT infrastructure solutions for enterprises.',
    ai_enhanced_description: 'NetConnect Systems delivers enterprise-grade networking solutions and IT infrastructure services. We specialize in LAN/WAN setup, WiFi networks, routers, switches, firewalls, and network security. Our certified engineers provide end-to-end implementation, from design to maintenance, ensuring optimal performance and reliability. Trusted by 300+ businesses, we offer scalable networking solutions that grow with your organization.',
    raw_data: 'NetConnect Networking Equipment LAN WAN WiFi Routers Switches Firewalls Network Security IT Infrastructure',
    suggested_keywords: ['Networking', 'LAN', 'WAN', 'WiFi', 'Routers', 'IT Infrastructure', 'Network Security'],
    approved_keywords: ['Networking Equipment', 'LAN', 'WAN', 'WiFi', 'Network Security'],
    service_tags: ['Networking', 'IT', 'Infrastructure', 'Security', 'Hardware'],
    business_category: 'Networking Services',
    structured_data: {
      services: ['LAN Setup', 'WiFi Networks', 'Network Security', 'IT Infrastructure'],
      certifications: ['Cisco', 'Juniper'],
      clients: 300
    },
    generation_method: 'website',
    profile_status: 'active',
    is_publicly_searchable: true,
    created_at: '2025-11-05T14:20:00Z',
    updated_at: '2025-11-14T12:00:00Z',
    is_active: true
  },
  {
    id: 'mp-005',
    tenant_id: 't-005',
    tenant_profile_id: 'tp-005',
    mobile_number: '9988776655',
    whatsapp_number: '9988776655',
    marketplace_type: 'bbb',
    branch: 'bagyanagar',
    short_description: 'Traditional Ayurvedic treatments and wellness therapies for holistic health.',
    ai_enhanced_description: 'Ayurveda Wellness Center brings ancient healing wisdom to modern wellness needs. We offer authentic Ayurvedic treatments, herbal therapies, yoga, and lifestyle consultations for holistic health. Our experienced practitioners provide personalized treatment plans for chronic conditions, stress management, and preventive care. Using 100% natural and organic products, we help you achieve balance and vitality through time-tested Ayurvedic principles.',
    raw_data: 'Ayurveda Wellness Herbal Treatments Natural Medicine Yoga Holistic Health Stress Management Organic Healthcare',
    suggested_keywords: ['Ayurveda', 'Wellness', 'Herbal', 'Natural Medicine', 'Yoga', 'Holistic Health'],
    approved_keywords: ['Ayurveda', 'Wellness', 'Herbal Treatments', 'Natural Medicine', 'Yoga'],
    service_tags: ['Healthcare', 'Ayurveda', 'Wellness', 'Natural', 'Holistic'],
    business_category: 'Healthcare',
    structured_data: {
      services: ['Ayurvedic Treatments', 'Herbal Therapies', 'Yoga Classes', 'Lifestyle Consulting'],
      practitioners: 8,
      experience_years: 12
    },
    generation_method: 'manual',
    profile_status: 'active',
    is_publicly_searchable: true,
    created_at: '2025-11-08T10:00:00Z',
    updated_at: '2025-11-14T14:30:00Z',
    is_active: true
  }
];

// Mock Semantic Clusters
export const mockSemanticClusters: SemanticCluster[] = [
  {
    id: 'sc-001',
    primary_term: 'IT Services',
    related_terms: ['software', 'technology', 'IT', 'digital', 'computer', 'application', 'cloud', 'development'],
    category: 'Technology',
    is_active: true,
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 'sc-002',
    primary_term: 'Networking',
    related_terms: ['LAN', 'WAN', 'WiFi', 'router', 'switch', 'firewall', 'ethernet', 'broadband', 'internet', 'connectivity'],
    category: 'Technology',
    is_active: true,
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 'sc-003',
    primary_term: 'Legal',
    related_terms: ['lawyer', 'advocate', 'attorney', 'contract', 'agreement', 'court', 'litigation', 'dispute', 'law firm'],
    category: 'Professional Services',
    is_active: true,
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 'sc-004',
    primary_term: 'Digital Marketing',
    related_terms: ['SEO', 'social media', 'content', 'advertising', 'branding', 'online marketing', 'digital ads', 'marketing'],
    category: 'Marketing',
    is_active: true,
    created_at: '2025-11-01T10:00:00Z'
  },
  {
    id: 'sc-005',
    primary_term: 'Ayurveda',
    related_terms: ['herbal', 'natural', 'wellness', 'organic', 'traditional', 'holistic', 'medicine', 'yoga', 'healthcare'],
    category: 'Healthcare',
    is_active: true,
    created_at: '2025-11-01T10:00:00Z'
  }
];

// Mock Admin Stats
export const mockAdminStats: BBBAdminStats = {
  total_members: 45,
  active_members: 42,
  pending_approvals: 3,
  inactive_members: 0,
  branches: [
    { name: 'bagyanagar', count: 45 },
    { name: 'kukatpally', count: 0 },
    { name: 'madhapur', count: 0 }
  ]
};

// Mock Search Results
export const mockSearchResults: BBBSearchResult[] = [
  {
    profile: mockMarketProfiles[0],
    tenant_profile: mockTenantProfiles[0],
    similarity_score: 0.92,
    digital_card_url: `https://contractnest.com/card/${mockMarketProfiles[0].mobile_number}`
  },
  {
    profile: mockMarketProfiles[3],
    tenant_profile: mockTenantProfiles[3],
    similarity_score: 0.88,
    digital_card_url: `https://contractnest.com/card/${mockMarketProfiles[3].mobile_number}`
  }
];

// Helper function to get profile by tenant_id
export const getMockProfileByTenantId = (tenantId: string): { 
  marketProfile?: TenantMarketProfile; 
  tenantProfile?: TenantProfile;
} => {
  const marketProfile = mockMarketProfiles.find(p => p.tenant_id === tenantId);
  const tenantProfile = mockTenantProfiles.find(p => p.tenant_id === tenantId);
  return { marketProfile, tenantProfile };
};

// Helper function to simulate API delays
export const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};