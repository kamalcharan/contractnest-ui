// src/types/billing.ts
// FIXED: Type definitions for billing module with proper typing

export interface PlanOption {
  id: string;
  name: string;
  description: string; // Required - will use fallback if undefined
}

export interface TenantOption {
  id: string;
  name: string;
  email?: string;
  currentPlanId?: string | null;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
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

// Form data types for invoice creation
export interface CreateInvoiceFormData {
  tenantId: string;
  planId: string;
  currency: string;
  dueDate: string;
  items: InvoiceItem[];
}

// Helper types for billing operations
export type PaymentMethod = 'bank_transfer' | 'payment_gateway' | 'manual';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type BillingPeriod = '7d' | '30d' | '90d' | 'ytd' | 'all';

export interface BillingFilters {
  status?: InvoiceStatus | 'all';
  period?: BillingPeriod;
  tenantId?: string;
  planId?: string;
}

export interface BillingStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
}

// Billing service interfaces
export interface BillingService {
  createInvoice: (data: CreateInvoiceFormData) => Promise<Invoice>;
  getInvoices: (filters?: BillingFilters) => Promise<Invoice[]>;
  getInvoiceById: (id: string) => Promise<Invoice | undefined>;
  getBillingSummary: (period: BillingPeriod) => Promise<BillingSummaryData>;
  markInvoiceAsPaid: (id: string) => Promise<boolean>;
  sendInvoiceReminder: (id: string) => Promise<boolean>;
}