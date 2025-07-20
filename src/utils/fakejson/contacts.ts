// src/utils/fakejson/contacts.ts
import { ContactSummary, ContactDetail, ContactTypeConfig } from '@/models/contacts/types';

// Fake contact types (master data)
export const fakeContactTypes: ContactTypeConfig[] = [
  {
    id: 'ct_001',
    code: 'customer',
    name: 'Customer',
    color: '#3b82f6',
    icon: 'user',
    formType: 'INDIVIDUAL',
    isActive: true,
    customFields: [
      {
        name: 'customer_since',
        type: 'date',
        label: 'Customer Since',
        required: false
      },
      {
        name: 'loyalty_tier',
        type: 'select',
        label: 'Loyalty Tier',
        options: ['Bronze', 'Silver', 'Gold', 'Platinum']
      }
    ]
  },
  {
    id: 'ct_002',
    code: 'vendor',
    name: 'Vendor',
    color: '#10b981',
    icon: 'building',
    formType: 'CORPORATE',
    isActive: true,
    customFields: [
      {
        name: 'vendor_code',
        type: 'text',
        label: 'Vendor Code',
        required: true
      },
      {
        name: 'payment_terms',
        type: 'select',
        label: 'Payment Terms',
        options: ['Net 30', 'Net 45', 'Net 60', 'COD']
      }
    ]
  },
  {
    id: 'ct_003',
    code: 'partner',
    name: 'Partner',
    color: '#f59e0b',
    icon: 'handshake',
    formType: 'CORPORATE',
    isActive: true
  },
  {
    id: 'ct_004',
    code: 'employee',
    name: 'Employee',
    color: '#8b5cf6',
    icon: 'user-check',
    formType: 'INDIVIDUAL',
    isActive: true,
    customFields: [
      {
        name: 'employee_id',
        type: 'text',
        label: 'Employee ID',
        required: true
      },
      {
        name: 'department',
        type: 'text',
        label: 'Department'
      }
    ]
  },
  {
    id: 'ct_005',
    code: 'lead',
    name: 'Lead',
    color: '#ef4444',
    icon: 'user-plus',
    formType: 'INDIVIDUAL',
    isActive: true
  }
];

// Fake contact sources (master data)
export const fakeContactSources = [
  { id: 'src_001', name: 'Manual Entry', code: 'manual' },
  { id: 'src_002', name: 'Website Form', code: 'website' },
  { id: 'src_003', name: 'Import', code: 'import' },
  { id: 'src_004', name: 'API', code: 'api' },
  { id: 'src_005', name: 'Referral', code: 'referral' },
  { id: 'src_006', name: 'Social Media', code: 'social' }
];

// Fake contact tags (master data)
export const fakeContactTags = [
  { id: 'tag_001', name: 'VIP', color: '#ef4444' },
  { id: 'tag_002', name: 'Regular', color: '#3b82f6' },
  { id: 'tag_003', name: 'Premium', color: '#f59e0b' },
  { id: 'tag_004', name: 'New', color: '#10b981' },
  { id: 'tag_005', name: 'Inactive', color: '#6b7280' }
];

// Fake contact summaries for list view
export const fakeContacts: ContactSummary[] = [
  {
    id: 'cnt_001',
    contactId: 'CNT-2024-001',
    displayName: 'John Doe',
    formType: 'INDIVIDUAL',
    primaryEmail: 'john.doe@example.com',
    primaryPhone: '+91 98765 43210',
    photoUrl: 'https://i.pravatar.cc/150?img=1',
    types: [
      { id: 'ct_001', name: 'Customer', color: '#3b82f6', isPrimary: true },
      { id: 'ct_005', name: 'Lead', color: '#ef4444', isPrimary: false }
    ],
    tags: ['tag_001', 'tag_003'],
    isUser: true,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastActivityAt: '2024-03-10T14:20:00Z'
  },
  {
    id: 'cnt_002',
    contactId: 'CNT-2024-002',
    displayName: 'Acme Corporation',
    formType: 'CORPORATE',
    primaryEmail: 'contact@acme.com',
    primaryPhone: '+91 11 2345 6789',
    types: [
      { id: 'ct_002', name: 'Vendor', color: '#10b981', isPrimary: true }
    ],
    tags: ['tag_003'],
    isUser: false,
    isActive: true,
    createdAt: '2024-01-14T09:15:00Z'
  },
  {
    id: 'cnt_003',
    contactId: 'CNT-2024-003',
    displayName: 'Sarah Johnson',
    formType: 'INDIVIDUAL',
    primaryEmail: 'sarah.j@techcorp.com',
    primaryPhone: '+91 98765 12345',
    photoUrl: 'https://i.pravatar.cc/150?img=5',
    types: [
      { id: 'ct_004', name: 'Employee', color: '#8b5cf6', isPrimary: true }
    ],
    tags: ['tag_002'],
    isUser: true,
    isActive: true,
    createdAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 'cnt_004',
    contactId: 'CNT-2024-004',
    displayName: 'Global Solutions Ltd',
    formType: 'CORPORATE',
    primaryEmail: 'info@globalsolutions.com',
    primaryPhone: '+91 22 3456 7890',
    types: [
      { id: 'ct_003', name: 'Partner', color: '#f59e0b', isPrimary: true },
      { id: 'ct_002', name: 'Vendor', color: '#10b981', isPrimary: false }
    ],
    tags: ['tag_001', 'tag_003'],
    isUser: false,
    isActive: true,
    createdAt: '2024-02-01T08:30:00Z'
  },
  {
    id: 'cnt_005',
    contactId: 'CNT-2024-005',
    displayName: 'Michael Chen',
    formType: 'INDIVIDUAL',
    primaryEmail: 'michael.chen@email.com',
    primaryPhone: '+91 87654 32109',
    photoUrl: 'https://i.pravatar.cc/150?img=3',
    types: [
      { id: 'ct_001', name: 'Customer', color: '#3b82f6', isPrimary: true }
    ],
    tags: ['tag_004'],
    isUser: false,
    isActive: true,
    createdAt: '2024-02-15T13:20:00Z'
  },
  {
    id: 'cnt_006',
    contactId: 'CNT-2024-006',
    displayName: 'Tech Innovations Inc',
    formType: 'CORPORATE',
    primaryEmail: 'hello@techinnovations.com',
    types: [
      { id: 'ct_002', name: 'Vendor', color: '#10b981', isPrimary: true }
    ],
    tags: ['tag_005'],
    isUser: false,
    isActive: false,
    createdAt: '2024-01-10T16:45:00Z'
  }
];

// Fake contact detail
export const fakeContactDetail: ContactDetail = {
  id: 'cnt_001',
  contactId: 'CNT-2024-001',
  displayName: 'John Doe',
  formType: 'INDIVIDUAL',
  salutation: 'mr',
  firstName: 'John',
  lastName: 'Doe',
  primaryEmail: 'john.doe@example.com',
  primaryPhone: '+91 98765 43210',
  photoUrl: 'https://i.pravatar.cc/150?img=1',
  types: [
    { id: 'ct_001', name: 'Customer', color: '#3b82f6', isPrimary: true },
    { id: 'ct_005', name: 'Lead', color: '#ef4444', isPrimary: false }
  ],
  tags: ['tag_001', 'tag_003'],
  isUser: true,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  lastActivityAt: '2024-03-10T14:20:00Z',
  channels: [
    {
      id: 'ch_001',
      type: 'email',
      value: 'john.doe@example.com',
      isPrimary: true,
      isVerified: true,
      verifiedAt: '2024-01-15T10:35:00Z'
    },
    {
      id: 'ch_002',
      type: 'mobile',
      value: '9876543210',
      countryCode: 'IN',
      isPrimary: false,
      isVerified: true,
      verifiedAt: '2024-01-16T09:00:00Z'
    },
    {
      id: 'ch_003',
      type: 'email',
      value: 'john.personal@gmail.com',
      isPrimary: false,
      isVerified: false
    },
    {
      id: 'ch_004',
      type: 'whatsapp',
      value: '9876543210',
      countryCode: 'IN',
      isPrimary: false,
      isVerified: true
    }
  ],
  addresses: [
    {
      id: 'addr_001',
      addressType: 'home',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
      landmark: 'Near City Mall',
      isPrimary: true
    },
    {
      id: 'addr_002',
      addressType: 'work',
      street: '456 Business Park, Tower A',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400051',
      isPrimary: false
    }
  ],
  source: {
    id: 'src_002',
    name: 'Website Form'
  },
  notes: 'VIP customer since 2020. Prefers email communication. Has referred 5 new customers.',
  customFields: {
    customer_since: '2020-01-15',
    loyalty_tier: 'Platinum'
  },
  createdBy: {
    id: 'user_001',
    name: 'Admin User'
  },
  updatedAt: '2024-03-10T14:20:00Z',
  updatedBy: {
    id: 'user_002',
    name: 'Sales Manager'
  }
};

// Fake corporate contact detail
export const fakeCorporateDetail: ContactDetail = {
  id: 'cnt_002',
  contactId: 'CNT-2024-002',
  displayName: 'Acme Corporation',
  formType: 'CORPORATE',
  corporateName: 'Acme Corporation',
  tradeName: 'Acme Corp',
  registrationNumber: 'REG123456789',
  primaryEmail: 'contact@acme.com',
  primaryPhone: '+91 11 2345 6789',
  types: [
    { id: 'ct_002', name: 'Vendor', color: '#10b981', isPrimary: true }
  ],
  tags: ['tag_003'],
  isUser: false,
  isActive: true,
  createdAt: '2024-01-14T09:15:00Z',
  channels: [
    {
      id: 'ch_005',
      type: 'email',
      value: 'contact@acme.com',
      isPrimary: true,
      isVerified: true
    },
    {
      id: 'ch_006',
      type: 'phone',
      value: '1123456789',
      countryCode: 'IN',
      isPrimary: true,
      isVerified: true
    }
  ],
  addresses: [
    {
      id: 'addr_003',
      addressType: 'billing',
      street: '789 Corporate Boulevard',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110001',
      isPrimary: true
    }
  ],
  contactPersons: [
    {
      id: 'cp_001',
      salutation: 'mr',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      designation: 'Purchase Manager',
      department: 'Procurement',
      isPrimary: true,
      channels: [
        {
          id: 'ch_007',
          type: 'email',
          value: 'rajesh.kumar@acme.com',
          isPrimary: true,
          isVerified: true
        },
        {
          id: 'ch_008',
          type: 'mobile',
          value: '9988776655',
          countryCode: 'IN',
          isPrimary: false,
          isVerified: true
        }
      ],
      isUser: true
    },
    {
      id: 'cp_002',
      salutation: 'ms',
      firstName: 'Priya',
      lastName: 'Sharma',
      designation: 'Finance Manager',
      department: 'Finance',
      isPrimary: false,
      channels: [
        {
          id: 'ch_009',
          type: 'email',
          value: 'priya.sharma@acme.com',
          isPrimary: true,
          isVerified: true
        }
      ],
      isUser: false
    }
  ],
  source: {
    id: 'src_005',
    name: 'Referral'
  },
  notes: 'Premium vendor. Net 45 payment terms. Annual contract renewal in June.',
  customFields: {
    vendor_code: 'VND-2024-002',
    payment_terms: 'Net 45'
  },
  createdBy: {
    id: 'user_001',
    name: 'Admin User'
  }
};

// Helper functions to simulate API responses
export const getContactsByType = (typeId: string): ContactSummary[] => {
  return fakeContacts.filter(contact => 
    contact.types.some(type => type.id === typeId)
  );
};

export const searchContacts = (query: string): ContactSummary[] => {
  const lowerQuery = query.toLowerCase();
  return fakeContacts.filter(contact => 
    contact.displayName.toLowerCase().includes(lowerQuery) ||
    contact.primaryEmail?.toLowerCase().includes(lowerQuery) ||
    contact.primaryPhone?.includes(query)
  );
};

export const getContactById = (id: string): ContactDetail | null => {
  if (id === 'cnt_001') return fakeContactDetail;
  if (id === 'cnt_002') return fakeCorporateDetail;
  
  // Generate a simple detail from summary
  const summary = fakeContacts.find(c => c.id === id);
  if (!summary) return null;
  
  return {
    ...summary,
    channels: [
      {
        id: `ch_${id}_1`,
        type: 'email',
        value: summary.primaryEmail || '',
        isPrimary: true,
        isVerified: true
      }
    ],
    addresses: [],
    source: { id: 'src_001', name: 'Manual Entry' },
    createdBy: { id: 'user_001', name: 'Admin User' }
  };
};

// Pagination helper
export const getPaginatedContacts = (page: number = 1, pageSize: number = 12) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: fakeContacts.slice(start, end),
    total: fakeContacts.length,
    page,
    pageSize,
    totalPages: Math.ceil(fakeContacts.length / pageSize)
  };
};