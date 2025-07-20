// src/utils/fakejson/BillingData.ts

// Type definitions for billing-related data
export interface BillingSummaryData {
  totalRevenue: number;
  outstandingAmount: number;
  overdueDays?: number;
  invoicesCount: number;
  paidInvoicesCount: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  percentageChange?: {
    revenue: number;
    outstanding: number;
  };
}

export interface Invoice {
  id: string;
  tenantId: string;
  tenantName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate: string | null;
  createdAt: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  amount: number;
}

// Mock data for billing summary
export const fakeBillingSummary: Record<string, BillingSummaryData> = {
  '7d': {
    totalRevenue: 42000,
    outstandingAmount: 15000,
    overdueDays: 2,
    invoicesCount: 12,
    paidInvoicesCount: 8,
    pendingInvoicesCount: 3,
    overdueInvoicesCount: 1,
    percentageChange: {
      revenue: 8.5,
      outstanding: -2.1
    }
  },
  '30d': {
    totalRevenue: 125000,
    outstandingAmount: 32000,
    overdueDays: 3,
    invoicesCount: 35,
    paidInvoicesCount: 28,
    pendingInvoicesCount: 5,
    overdueInvoicesCount: 2,
    percentageChange: {
      revenue: 12.5,
      outstanding: -3.2
    }
  },
  '90d': {
    totalRevenue: 325000,
    outstandingAmount: 45000,
    overdueDays: 4,
    invoicesCount: 92,
    paidInvoicesCount: 78,
    pendingInvoicesCount: 9,
    overdueInvoicesCount: 5,
    percentageChange: {
      revenue: 15.8,
      outstanding: 2.4
    }
  },
  'ytd': {
    totalRevenue: 850000,
    outstandingAmount: 65000,
    overdueDays: 5,
    invoicesCount: 230,
    paidInvoicesCount: 205,
    pendingInvoicesCount: 15,
    overdueInvoicesCount: 10,
    percentageChange: {
      revenue: 22.5,
      outstanding: -5.1
    }
  },
  'all': {
    totalRevenue: 1250000,
    outstandingAmount: 65000,
    overdueDays: 5,
    invoicesCount: 350,
    paidInvoicesCount: 320,
    pendingInvoicesCount: 18,
    overdueInvoicesCount: 12,
    percentageChange: {
      revenue: 0,
      outstanding: 0
    }
  }
};

// Mock invoice data
export const fakeInvoices: Invoice[] = [
  {
    id: 'INV-001',
    tenantId: 'tenant_1',
    tenantName: 'Acme Inc.',
    planId: 'plan_1',
    planName: 'Premium Plan',
    amount: 25000,
    currency: 'INR',
    status: 'paid',
    dueDate: '2025-04-10T00:00:00Z',
    paidDate: '2025-04-08T14:30:00Z',
    createdAt: '2025-04-01T10:00:00Z',
    items: [
      {
        description: 'Premium Plan Subscription (10 users)',
        quantity: 10,
        unitPrice: 2500,
        currency: 'INR',
        amount: 25000
      }
    ]
  },
  {
    id: 'INV-002',
    tenantId: 'tenant_2',
    tenantName: 'Globex Corp',
    planId: 'plan_2',
    planName: 'Enterprise Plan',
    amount: 50000,
    currency: 'INR',
    status: 'pending',
    dueDate: '2025-05-15T00:00:00Z',
    paidDate: null,
    createdAt: '2025-04-15T11:30:00Z',
    items: [
      {
        description: 'Enterprise Plan Subscription (15 users)',
        quantity: 15,
        unitPrice: 3000,
        currency: 'INR',
        amount: 45000
      },
      {
        description: 'Additional SMS Credits (1000)',
        quantity: 1000,
        unitPrice: 5,
        currency: 'INR',
        amount: 5000
      }
    ]
  },
  {
    id: 'INV-003',
    tenantId: 'tenant_3',
    tenantName: 'Initech',
    planId: 'plan_1',
    planName: 'Premium Plan',
    amount: 25000,
    currency: 'INR',
    status: 'overdue',
    dueDate: '2025-05-01T00:00:00Z',
    paidDate: null,
    createdAt: '2025-04-20T09:15:00Z',
    items: [
      {
        description: 'Premium Plan Subscription (10 users)',
        quantity: 10,
        unitPrice: 2500,
        currency: 'INR',
        amount: 25000
      }
    ]
  },
  {
    id: 'INV-004',
    tenantId: 'tenant_4',
    tenantName: 'Umbrella Corp',
    planId: 'plan_3',
    planName: 'Basic Plan',
    amount: 10000,
    currency: 'INR',
    status: 'paid',
    dueDate: '2025-04-28T00:00:00Z',
    paidDate: '2025-04-25T16:45:00Z',
    createdAt: '2025-04-18T14:00:00Z',
    items: [
      {
        description: 'Basic Plan Subscription (5 users)',
        quantity: 5,
        unitPrice: 2000,
        currency: 'INR',
        amount: 10000
      }
    ]
  },
  {
    id: 'INV-005',
    tenantId: 'tenant_5',
    tenantName: 'Stark Industries',
    planId: 'plan_2',
    planName: 'Enterprise Plan',
    amount: 50000,
    currency: 'INR',
    status: 'pending',
    dueDate: '2025-05-20T00:00:00Z',
    paidDate: null,
    createdAt: '2025-04-20T10:30:00Z',
    items: [
      {
        description: 'Enterprise Plan Subscription (10 users)',
        quantity: 10,
        unitPrice: 4000,
        currency: 'INR',
        amount: 40000
      },
      {
        description: 'VaNi Add-on',
        quantity: 1,
        unitPrice: 5000,
        currency: 'INR',
        amount: 5000
      },
      {
        description: 'Additional Email Credits (10000)',
        quantity: 10000,
        unitPrice: 0.5,
        currency: 'INR',
        amount: 5000
      }
    ]
  },
  {
    id: 'INV-006',
    tenantId: 'tenant_1',
    tenantName: 'Acme Inc.',
    planId: 'plan_1',
    planName: 'Premium Plan',
    amount: 30000,
    currency: 'INR',
    status: 'pending',
    dueDate: '2025-05-30T00:00:00Z',
    paidDate: null,
    createdAt: '2025-05-01T10:00:00Z',
    items: [
      {
        description: 'Premium Plan Subscription (10 users)',
        quantity: 10,
        unitPrice: 2500,
        currency: 'INR',
        amount: 25000
      },
      {
        description: 'Additional WhatsApp Credits (500)',
        quantity: 500,
        unitPrice: 10,
        currency: 'INR',
        amount: 5000
      }
    ]
  },
  {
    id: 'INV-007',
    tenantId: 'tenant_6',
    tenantName: 'Wayne Enterprises',
    planId: 'plan_3',
    planName: 'Enterprise Plan',
    amount: 80000,
    currency: 'INR',
    status: 'paid',
    dueDate: '2025-04-15T00:00:00Z',
    paidDate: '2025-04-10T13:25:00Z',
    createdAt: '2025-04-01T09:00:00Z',
    items: [
      {
        description: 'Enterprise Plan Subscription (20 users)',
        quantity: 20,
        unitPrice: 4000,
        currency: 'INR',
        amount: 80000
      }
    ]
  }
];

// Helper functions
export const getBillingSummaryByPeriod = (period: string): BillingSummaryData => {
  return fakeBillingSummary[period] || fakeBillingSummary['30d'];
};

export const getInvoiceById = (id: string): Invoice | undefined => {
  return fakeInvoices.find(invoice => invoice.id === id);
};

export const getInvoicesByTenant = (tenantId: string): Invoice[] => {
  return fakeInvoices.filter(invoice => invoice.tenantId === tenantId);
};

export const getInvoicesByStatus = (status: 'paid' | 'pending' | 'overdue' | 'all'): Invoice[] => {
  if (status === 'all') return fakeInvoices;
  return fakeInvoices.filter(invoice => invoice.status === status);
};

export default {
  fakeBillingSummary,
  fakeInvoices,
  getBillingSummaryByPeriod,
  getInvoiceById,
  getInvoicesByTenant,
  getInvoicesByStatus
};