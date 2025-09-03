// src/utils/constants/businessTypes.ts
export interface BusinessType {
  id: string;
  name: string;
  description: string;
  helpText: string;
  icon: string;
  examples: string[];
  color: string; // Theme color for visual distinction
}

export const businessTypes: BusinessType[] = [
  {
    id: 'buyer',
    name: 'Buyer',
    description: 'Organizations that purchase services from external providers',
    helpText: 'As a Buyer, you engage service providers to fulfill specific needs for your organization. You create service requests, manage contracts with vendors, track SLA compliance, and oversee service delivery. You are responsible for defining requirements, approving invoices, and ensuring contracted services meet your standards.',
    icon: 'ShoppingCart',
    color: '#3B82F6', // Blue theme
    examples: [
      'ABC Manufacturing contracts TechServ Inc. to maintain their CNC machines monthly',
      'City General Hospital hires MedEquip Solutions for MRI machine servicing',
      'Metro Office Tower contracts CleanPro for daily janitorial services',
      'Fashion Retail Corp outsources IT helpdesk to TechSupport Plus',
      'State Department of Health procures consulting from Policy Advisors LLC'
    ]
  },
  {
    id: 'seller',
    name: 'Service Provider (Seller)',
    description: 'Organizations that deliver specialized services to other businesses',
    helpText: 'As a Service Provider, you deliver specialized services to other organizations under contractual agreements. You respond to service requests, manage client relationships, track service delivery performance, and handle billing. You are responsible for meeting SLAs, maintaining service quality, and growing your client base through excellent service delivery.',
    icon: 'Wrench',
    color: '#10B981', // Green theme
    examples: [
      'TechServ Inc. provides monthly CNC machine maintenance to ABC Manufacturing',
      'MedEquip Solutions services MRI machines for City General Hospital',
      'CleanPro delivers daily janitorial services to Metro Office Tower',
      'TechSupport Plus offers IT helpdesk services to Fashion Retail Corp',
      'Policy Advisors LLC provides consulting services to State Department of Health'
    ]
  }
];