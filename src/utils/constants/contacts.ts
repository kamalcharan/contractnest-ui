// src/utils/constants/contacts.ts
// Contact-specific constants that extend the global constants

export const CONTACT_FORM_TYPES = {
  INDIVIDUAL: 'INDIVIDUAL',
  CORPORATE: 'CORPORATE'
} as const;

export const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  BILLING: 'billing',
  SHIPPING: 'shipping',
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

export const DEFAULT_COUNTRY_CODE = 'IN';
export const DEFAULT_PHONE_CODE = '+91';

export const CONTACT_SOURCES = {
  MANUAL: 'manual',
  IMPORT: 'import',
  API: 'api',
  WEBSITE: 'website',
  REFERRAL: 'referral',
  SOCIAL: 'social'
} as const;

export const BULK_ACTIONS = {
  DELETE: 'delete',
  EXPORT: 'export',
  TAG: 'tag',
  CHANGE_TYPE: 'changeType',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate'
} as const;

export const CONTACT_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Date Created' },
  { value: 'updated', label: 'Last Updated' },
  { value: 'type', label: 'Contact Type' }
];

export const CONTACT_VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

export const IMPORT_FILE_TYPES = {
  CSV: '.csv',
  EXCEL: '.xlsx,.xls',
  VCF: '.vcf'
} as const;

export const MAX_IMPORT_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMPORT_ROWS = 1000;

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

export const SUCCESS_MESSAGES = {
  CONTACT_CREATED: 'Contact created successfully',
  CONTACT_UPDATED: 'Contact updated successfully',
  CONTACT_DELETED: 'Contact deleted successfully',
  CONTACTS_IMPORTED: (count: number) => `${count} contacts imported successfully`,
  CONTACTS_EXPORTED: 'Contacts exported successfully'
};

export const PLACEHOLDER_TEXTS = {
  SEARCH: 'Search by name, email, or phone...',
  FIRST_NAME: 'John',
  LAST_NAME: 'Doe',
  COMPANY_NAME: 'Acme Corporation',
  EMAIL: 'john.doe@example.com',
  PHONE: '9876543210',
  STREET: '123 Main Street',
  CITY: 'Mumbai',
  STATE: 'Maharashtra',
  POSTAL_CODE: '400001',
  NOTES: 'Add any additional notes here...'
};