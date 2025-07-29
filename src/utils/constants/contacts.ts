// src/utils/constants/contacts.ts - Complete Version 3
// Contact-specific constants that extend the global constants

export const CONTACT_FORM_TYPES = {
  INDIVIDUAL: 'individual',
  CORPORATE: 'corporate'
} as const;

export const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work', 
  OFFICE: 'office',
  BILLING: 'billing',
  SHIPPING: 'shipping',
  FACTORY: 'factory',
  WAREHOUSE: 'warehouse',
  OTHER: 'other'
} as const;

export const SALUTATIONS = [
  { value: 'mr', label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'miss', label: 'Miss' },
  { value: 'dr', label: 'Dr.' },
  { value: 'prof', label: 'Prof.' }
];

// Contact Status Management
export const CONTACT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive', 
  LEAD: 'lead',
  ARCHIVED: 'archived'
} as const;

export const CONTACT_STATUS_LABELS = {
  [CONTACT_STATUS.ACTIVE]: 'Active',
  [CONTACT_STATUS.INACTIVE]: 'Inactive',
  [CONTACT_STATUS.LEAD]: 'Lead',  
  [CONTACT_STATUS.ARCHIVED]: 'Archived'
} as const;

// Domain-Specific Classifications (Aligned with industries.ts)
export const DOMAIN_CLASSIFICATIONS = {
  healthcare: [
    { id: 'patient', label: 'Patient', description: 'Receives medical services', color: 'blue' },
    { id: 'provider', label: 'Healthcare Provider', description: 'Doctors, nurses, medical staff', color: 'green' },
    { id: 'vendor', label: 'Medical Vendor', description: 'Supplies medical equipment/pharmaceuticals', color: 'purple' },
    { id: 'insurance', label: 'Insurance Provider', description: 'Health insurance companies', color: 'orange' }
  ],
  financial_services: [
    { id: 'client', label: 'Client', description: 'Receives financial services', color: 'blue' },
    { id: 'advisor', label: 'Financial Advisor', description: 'Provides financial guidance', color: 'green' },
    { id: 'institution', label: 'Financial Institution', description: 'Banks, credit unions, etc.', color: 'purple' },
    { id: 'vendor', label: 'Service Provider', description: 'Financial service vendors', color: 'orange' }
  ],
  manufacturing: [
    { id: 'customer', label: 'Customer', description: 'Purchases manufactured goods', color: 'blue' },
    { id: 'supplier', label: 'Supplier', description: 'Provides raw materials/components', color: 'green' },
    { id: 'distributor', label: 'Distributor', description: 'Distributes manufactured products', color: 'purple' },
    { id: 'contractor', label: 'Contractor', description: 'Manufacturing service providers', color: 'orange' }
  ],
  retail: [
    { id: 'customer', label: 'Customer', description: 'Purchases retail products', color: 'blue' },
    { id: 'supplier', label: 'Supplier', description: 'Provides products for retail', color: 'green' },
    { id: 'vendor', label: 'Vendor', description: 'Retail service providers', color: 'purple' },
    { id: 'partner', label: 'Retail Partner', description: 'Business collaboration partners', color: 'orange' }
  ],
  technology: [
    { id: 'client', label: 'Client', description: 'Receives technology services', color: 'blue' },
    { id: 'developer', label: 'Developer', description: 'Software/hardware developers', color: 'green' },
    { id: 'vendor', label: 'Tech Vendor', description: 'Technology service providers', color: 'purple' },
    { id: 'partner', label: 'Tech Partner', description: 'Technology collaboration partners', color: 'orange' }
  ],
  education: [
    { id: 'student', label: 'Student', description: 'Receives educational services', color: 'blue' },
    { id: 'educator', label: 'Educator', description: 'Teachers, professors, trainers', color: 'green' },
    { id: 'vendor', label: 'Education Vendor', description: 'Educational service providers', color: 'purple' },
    { id: 'institution', label: 'Institution', description: 'Schools, universities, training centers', color: 'orange' }
  ],
  government: [
    { id: 'citizen', label: 'Citizen', description: 'Receives government services', color: 'blue' },
    { id: 'official', label: 'Government Official', description: 'Government employees/representatives', color: 'green' },
    { id: 'contractor', label: 'Government Contractor', description: 'Provides services to government', color: 'purple' },
    { id: 'agency', label: 'Government Agency', description: 'Government departments/agencies', color: 'orange' }
  ],
  nonprofit: [
    { id: 'beneficiary', label: 'Beneficiary', description: 'Receives nonprofit services', color: 'blue' },
    { id: 'volunteer', label: 'Volunteer', description: 'Provides volunteer services', color: 'green' },
    { id: 'donor', label: 'Donor', description: 'Provides funding/donations', color: 'purple' },
    { id: 'partner', label: 'Partner Organization', description: 'Collaborative nonprofit partners', color: 'orange' }
  ],
  professional_services: [
    { id: 'client', label: 'Client', description: 'Receives professional services', color: 'blue' },
    { id: 'consultant', label: 'Consultant', description: 'Provides professional consulting', color: 'green' },
    { id: 'vendor', label: 'Service Vendor', description: 'Professional service providers', color: 'purple' },
    { id: 'partner', label: 'Professional Partner', description: 'Professional collaboration partners', color: 'orange' }
  ],
  telecommunications: [
    { id: 'subscriber', label: 'Subscriber', description: 'Uses telecommunication services', color: 'blue' },
    { id: 'provider', label: 'Service Provider', description: 'Provides telecom services', color: 'green' },
    { id: 'vendor', label: 'Telecom Vendor', description: 'Telecom equipment/service vendors', color: 'purple' },
    { id: 'partner', label: 'Network Partner', description: 'Telecom collaboration partners', color: 'orange' }
  ],
  transportation: [
    { id: 'customer', label: 'Customer', description: 'Uses transportation services', color: 'blue' },
    { id: 'carrier', label: 'Carrier', description: 'Provides transportation services', color: 'green' },
    { id: 'supplier', label: 'Logistics Supplier', description: 'Transportation service providers', color: 'purple' },
    { id: 'partner', label: 'Logistics Partner', description: 'Transportation collaboration partners', color: 'orange' }
  ],
  energy: [
    { id: 'consumer', label: 'Consumer', description: 'Uses energy/utility services', color: 'blue' },
    { id: 'provider', label: 'Energy Provider', description: 'Provides energy/utility services', color: 'green' },
    { id: 'supplier', label: 'Energy Supplier', description: 'Energy equipment/service suppliers', color: 'purple' },
    { id: 'contractor', label: 'Energy Contractor', description: 'Energy service contractors', color: 'orange' }
  ],
  construction: [
    { id: 'client', label: 'Client', description: 'Requests construction/real estate services', color: 'blue' },
    { id: 'contractor', label: 'Contractor', description: 'Provides construction services', color: 'green' },
    { id: 'supplier', label: 'Supplier', description: 'Supplies construction materials', color: 'purple' },
    { id: 'subcontractor', label: 'Subcontractor', description: 'Specialized construction services', color: 'orange' }
  ],
  hospitality: [
    { id: 'guest', label: 'Guest', description: 'Uses hospitality services', color: 'blue' },
    { id: 'operator', label: 'Service Operator', description: 'Provides hospitality services', color: 'green' },
    { id: 'supplier', label: 'Hospitality Supplier', description: 'Supplies hospitality products/services', color: 'purple' },
    { id: 'partner', label: 'Tourism Partner', description: 'Hospitality collaboration partners', color: 'orange' }
  ],
  media: [
    { id: 'audience', label: 'Audience', description: 'Consumes media content', color: 'blue' },
    { id: 'creator', label: 'Content Creator', description: 'Creates media content', color: 'green' },
    { id: 'vendor', label: 'Media Vendor', description: 'Media service providers', color: 'purple' },
    { id: 'partner', label: 'Media Partner', description: 'Media collaboration partners', color: 'orange' }
  ],
  agriculture: [
    { id: 'buyer', label: 'Buyer', description: 'Purchases agricultural products', color: 'blue' },
    { id: 'farmer', label: 'Farmer', description: 'Produces agricultural products', color: 'green' },
    { id: 'supplier', label: 'Agricultural Supplier', description: 'Supplies farming equipment/materials', color: 'purple' },
    { id: 'distributor', label: 'Distributor', description: 'Distributes agricultural products', color: 'orange' }
  ],
  pharma: [
    { id: 'patient', label: 'Patient', description: 'Uses pharmaceutical products', color: 'blue' },
    { id: 'provider', label: 'Healthcare Provider', description: 'Prescribes pharmaceutical products', color: 'green' },
    { id: 'supplier', label: 'Pharma Supplier', description: 'Supplies pharmaceutical materials', color: 'purple' },
    { id: 'distributor', label: 'Distributor', description: 'Distributes pharmaceutical products', color: 'orange' }
  ],
  automotive: [
    { id: 'customer', label: 'Customer', description: 'Purchases automotive products/services', color: 'blue' },
    { id: 'dealer', label: 'Dealer', description: 'Sells automotive products', color: 'green' },
    { id: 'supplier', label: 'Parts Supplier', description: 'Supplies automotive parts/materials', color: 'purple' },
    { id: 'service_provider', label: 'Service Provider', description: 'Provides automotive services', color: 'orange' }
  ],
  aerospace: [
    { id: 'customer', label: 'Customer', description: 'Uses aerospace/defense services', color: 'blue' },
    { id: 'contractor', label: 'Defense Contractor', description: 'Provides aerospace/defense services', color: 'green' },
    { id: 'supplier', label: 'Aerospace Supplier', description: 'Supplies aerospace materials/components', color: 'purple' },
    { id: 'partner', label: 'Defense Partner', description: 'Aerospace collaboration partners', color: 'orange' }
  ],
  default: [
    { id: 'buyer', label: 'Buyer', description: 'Purchases services/products', color: 'blue' },
    { id: 'seller', label: 'Seller', description: 'Provides services/products', color: 'green' },
    { id: 'vendor', label: 'Vendor', description: 'Supplies products/services', color: 'purple' },
    { id: 'partner', label: 'Partner', description: 'Business collaboration partner', color: 'orange' }
  ],
  other: [
    { id: 'contact', label: 'Contact', description: 'General business contact', color: 'blue' },
    { id: 'vendor', label: 'Vendor', description: 'Service/product provider', color: 'green' },
    { id: 'partner', label: 'Partner', description: 'Business partner', color: 'purple' },
    { id: 'client', label: 'Client', description: 'Business client', color: 'orange' }
  ]
} as const;

// Contact Channel Types (extending global CHANNELS)
export const CONTACT_CHANNEL_TYPES = {
  PHONE: 'mobile',
  EMAIL: 'email', 
  WHATSAPP: 'whatsapp',
  LINKEDIN: 'linkedin',
  WEBSITE: 'website',
  SKYPE: 'skype',
  TELEGRAM: 'telegram'
} as const;

// Default Contact Channel (Phone by default)
export const DEFAULT_CONTACT_CHANNEL = CONTACT_CHANNEL_TYPES.PHONE;

export const DEFAULT_COUNTRY_CODE = 'IN';
export const DEFAULT_PHONE_CODE = '+91';

// User Account Status
export const USER_ACCOUNT_STATUS = {
  HAS_ACCOUNT: 'has_account',
  NO_ACCOUNT: 'no_account',
  INVITATION_SENT: 'invitation_sent',
  INVITATION_PENDING: 'invitation_pending'
} as const;

// User Status Messages
export const USER_STATUS_MESSAGES = {
  [USER_ACCOUNT_STATUS.HAS_ACCOUNT]: {
    icon: '👤',
    text: 'This contact has a user account - Ready to create contracts',
    action: 'Create Contract',
    actionType: 'primary' as const
  },
  [USER_ACCOUNT_STATUS.NO_ACCOUNT]: {
    icon: '📧', 
    text: 'No user account found - Send invitation to get started',
    action: 'Send Invite',
    actionType: 'secondary' as const
  },
  [USER_ACCOUNT_STATUS.INVITATION_SENT]: {
    icon: '⏳',
    text: 'Invitation sent - Waiting for user to accept',
    action: 'Resend Invite', 
    actionType: 'secondary' as const
  },
  [USER_ACCOUNT_STATUS.INVITATION_PENDING]: {
    icon: '📨',
    text: 'Invitation pending - User will receive access soon',
    action: 'Elevate Relationship',
    actionType: 'secondary' as const
  }
} as const;

// Company Size Options
export const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10)', description: 'Early stage company' },
  { value: 'small', label: 'Small (11-50)', description: 'Small business' },  
  { value: 'medium', label: 'Medium (51-200)', description: 'Medium enterprise' },
  { value: 'large', label: 'Large (201-1000)', description: 'Large enterprise' },
  { value: 'enterprise', label: 'Enterprise (1000+)', description: 'Enterprise organization' }
] as const;

// Enhanced Address Types with Labels
export const ADDRESS_TYPE_LABELS = {
  [ADDRESS_TYPES.HOME]: { label: 'Home', icon: '🏠', description: 'Residential address' },
  [ADDRESS_TYPES.WORK]: { label: 'Work', icon: '🏢', description: 'Work location' },
  [ADDRESS_TYPES.OFFICE]: { label: 'Office', icon: '🏢', description: 'Business office' },
  [ADDRESS_TYPES.BILLING]: { label: 'Billing', icon: '💳', description: 'Billing address' },
  [ADDRESS_TYPES.SHIPPING]: { label: 'Shipping', icon: '📦', description: 'Delivery address' },
  [ADDRESS_TYPES.FACTORY]: { label: 'Factory', icon: '🏭', description: 'Manufacturing facility' },
  [ADDRESS_TYPES.WAREHOUSE]: { label: 'Warehouse', icon: '🏬', description: 'Storage facility' },
  [ADDRESS_TYPES.OTHER]: { label: 'Other', icon: '📍', description: 'Other address type' }
} as const;

// Contact Sources
export const CONTACT_SOURCES = {
  MANUAL: 'manual',
  IMPORT: 'import',
  API: 'api',
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL: 'social'
} as const;

// Bulk Actions
export const BULK_ACTIONS = {
  DELETE: 'delete',
  EXPORT: 'export',
  TAG: 'tag',
  CHANGE_TYPE: 'changeType',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate'
} as const;

// Contact Sort Options
export const CONTACT_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date Created' },
  { value: 'updated', label: 'Last Updated' },
  { value: 'type', label: 'Contact Type' }
];

// Contact View Modes
export const CONTACT_VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

// Import Settings
export const IMPORT_FILE_TYPES = {
  CSV: '.csv',
  EXCEL: '.xlsx,.xls',
  VCF: '.vcf'
} as const;

export const MAX_IMPORT_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMPORT_ROWS = 1000;

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  COMPANY_MAX_LENGTH: 100,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  NOTES_MAX_LENGTH: 500,
  ADDRESS_MAX_LENGTH: 200,
  POSTAL_CODE_MAX_LENGTH: 10
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must not exceed ${max} characters`,
  DUPLICATE_PRIMARY: 'Only one item can be marked as primary',
  NO_CHANNELS: 'At least one contact method is required',
  NO_PRIMARY_CHANNEL: 'Please mark one contact method as primary',
  COUNTRY_CODE_REQUIRED: 'Country code is required for phone numbers'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CONTACT_CREATED: 'Contact created successfully',
  CONTACT_UPDATED: 'Contact updated successfully',
  CONTACT_DELETED: 'Contact deleted successfully',
  CONTACTS_IMPORTED: (count: number) => `${count} contacts imported successfully`,
  CONTACTS_EXPORTED: 'Contacts exported successfully'
};

// Placeholder Texts
export const PLACEHOLDER_TEXTS = {
  SEARCH: 'Search by name, email, or phone...',
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  FULL_NAME: 'John Doe',
  COMPANY_NAME: 'Acme Corporation',
  EMAIL: 'john.doe@example.com',
  PHONE: '9876543210',
  STREET: '123 Main Street',
  CITY: 'Mumbai',
  STATE: 'Maharashtra',
  POSTAL_CODE: '400001',
  NOTES: 'Add any additional notes here...'
};

// Utility functions for industry-specific configurations
export const getClassificationsForIndustry = (industryId: string) => {
  return DOMAIN_CLASSIFICATIONS[industryId as keyof typeof DOMAIN_CLASSIFICATIONS] || DOMAIN_CLASSIFICATIONS.default;
};

export const getMenuTerminologyForIndustry = (industryId: string) => {
  // Maps industry to contact terminology for menu items
  const terminologyMap = {
    healthcare: 'Patients & Providers',
    education: 'Students & Educators', 
    construction: 'Clients & Contractors',
    professional_services: 'Clients & Consultants',
    retail: 'Customers & Suppliers',
    manufacturing: 'Customers & Suppliers',
    government: 'Citizens & Officials',
    nonprofit: 'Beneficiaries & Donors',
    financial_services: 'Clients & Advisors',
    technology: 'Clients & Developers',
    telecommunications: 'Subscribers & Providers',
    transportation: 'Customers & Carriers',
    energy: 'Consumers & Providers',
    hospitality: 'Guests & Operators',
    media: 'Audience & Creators',
    agriculture: 'Buyers & Farmers',
    pharma: 'Patients & Providers',
    automotive: 'Customers & Dealers',
    aerospace: 'Customers & Contractors',
    other: 'Contacts',
    default: 'Contacts'
  };
  
  return terminologyMap[industryId as keyof typeof terminologyMap] || terminologyMap.default;
};

// Contact form validation schemas
export const FORM_VALIDATION_SCHEMA = {
  individual: {
    required: ['name', 'contact_channels'],
    optional: ['salutation', 'notes', 'tags', 'addresses']
  },
  corporate: {
    required: ['company_name', 'contact_channels'],
    optional: ['company_registration_number', 'website', 'industry', 'company_size', 'notes', 'tags', 'addresses', 'compliance_numbers', 'contact_persons']
  }
} as const;

// Type definitions for better TypeScript support
export type ContactFormType = typeof CONTACT_FORM_TYPES[keyof typeof CONTACT_FORM_TYPES];
export type ContactStatus = typeof CONTACT_STATUS[keyof typeof CONTACT_STATUS];
export type AddressType = typeof ADDRESS_TYPES[keyof typeof ADDRESS_TYPES];
export type UserAccountStatus = typeof USER_ACCOUNT_STATUS[keyof typeof USER_ACCOUNT_STATUS];
export type ContactChannelType = typeof CONTACT_CHANNEL_TYPES[keyof typeof CONTACT_CHANNEL_TYPES];
export type CompanySize = typeof COMPANY_SIZES[number]['value'];
export type ContactSource = typeof CONTACT_SOURCES[keyof typeof CONTACT_SOURCES];
export type BulkAction = typeof BULK_ACTIONS[keyof typeof BULK_ACTIONS];
export type ContactViewMode = typeof CONTACT_VIEW_MODES[keyof typeof CONTACT_VIEW_MODES];