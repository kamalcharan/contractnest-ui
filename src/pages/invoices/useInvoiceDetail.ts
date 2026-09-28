// ============================================================================
// useInvoiceDetail — one invoice as a document, contract-optional.
// Backed by GET /api/invoices/:id → get_invoice_detail (bbb-foundation/069).
// Kept beside the invoices pages rather than added to the shared
// useInvoiceQueries so the standalone viewer owns its own read.
// ============================================================================

import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import { vaniToast } from '@/components/common/toast';

export interface InvoiceDocLine {
  name: string; qty: number; unit_price: number; amount: number; block_id?: string | null;
}
export interface InvoiceDocReceipt {
  id: string; receipt_number: string; amount: number; currency: string;
  payment_date: string; payment_method: string; reference_number: string | null;
  notes: string | null; is_offline: boolean; cancelled_at: string | null;
}
export interface InvoiceDoc {
  id: string; invoice_number: string; invoice_type: string; status: string;
  is_adhoc: boolean;
  contract_id: string | null; contract_number: string | null; contract_title: string | null;
  contact_id: string | null; contact_name: string | null;
  amount: number; tax_amount: number; total_amount: number; amount_paid: number; balance: number;
  currency: string;
  issued_at: string | null; due_date: string | null; paid_at: string | null;
  notes: string | null;
  line_items: InvoiceDocLine[];
  receipts: InvoiceDocReceipt[];
}

// Additional-work invoices retain their ticket provenance in a line-items
// envelope. The shared invoice viewer expects a flat list, so adapt only the
// read model and leave the stored invoice/audit data intact.
export function invoiceDocumentLines(value: unknown): InvoiceDocLine[] {
  const raw = Array.isArray(value) ? value : value && typeof value === 'object' && Array.isArray((value as {items?: unknown}).items)
    ? (value as {items: unknown[]}).items : [];
  return raw.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object').map(item => {
    const amount = Number(item.amount ?? 0);
    const qty = Number(item.qty ?? item.quantity ?? 1);
    return {
      name: String(item.name ?? 'Additional work'),
      qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
      unit_price: Number.isFinite(Number(item.unit_price)) ? Number(item.unit_price) : amount,
      amount: Number.isFinite(amount) ? amount : 0,
      block_id: typeof item.block_id === 'string' ? item.block_id : null,
    };
  });
}

export const useInvoiceDetail = (invoiceId: string | undefined) => {
  const { currentTenant } = useAuth();
  return useQuery({
    queryKey: ['invoice-detail', currentTenant?.id || '', invoiceId || ''],
    queryFn: async (): Promise<InvoiceDoc> => {
      if (!currentTenant?.id) throw new Error('Missing tenant');
      if (!invoiceId) throw new Error('Missing invoice');
      const res = await api.get(API_ENDPOINTS.INVOICES.DETAIL(invoiceId));
      const invoice = (res.data?.data || res.data) as InvoiceDoc;
      return { ...invoice, line_items: invoiceDocumentLines(invoice.line_items) };
    },
    enabled: !!currentTenant?.id && !!invoiceId,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export interface SendInvoiceResult {
  ok: boolean;
  jtd_id?: string;
  channel?: string;
  recipient_name?: string;
  recipient_contact?: string;
  invoice_number?: string;
  payment_link?: string | null;
}

/**
 * Queue one payment request for this invoice.
 *
 * Every refusal the backend can produce is a 400 carrying {reason, rule_key},
 * not a thrown 500 — so the user is told WHY nothing went out. The one that
 * needs a route rather than a message is `rule_disabled`: the tenant has the
 * automation rule switched off, and the fix is a screen away. The caller gets
 * the reason back so it can offer that link.
 */
export const useSendInvoice = () => {
  return useMutation({
    mutationFn: async (vars: { invoiceId: string; channel: 'email' | 'whatsapp' }): Promise<SendInvoiceResult> => {
      const res = await api.post(API_ENDPOINTS.INVOICES.SEND(vars.invoiceId), { channel: vars.channel });
      return res.data?.data || res.data;
    },
    onSuccess: (data) => {
      vaniToast.success(
        data?.recipient_contact
          ? `${data.invoice_number || 'Invoice'} sent to ${data.recipient_name || data.recipient_contact}`
          : 'Invoice sent'
      );
    },
    // Deliberately no toast here: `rule_disabled` needs an actionable prompt
    // rather than a red banner, so the page decides what to show.
  });
};

/** Reason code from a refused send, or null when the failure was unexpected. */
export const sendRefusal = (err: any): { reason: string; message: string } | null => {
  const d = err?.response?.data;
  const reason = d?.details?.reason || d?.error?.details?.reason;
  if (!reason) return null;
  return { reason, message: d?.message || d?.error?.message || 'Invoice could not be sent' };
};
