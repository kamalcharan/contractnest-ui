// src/hooks/queries/useServiceExecution.ts
// Service Execution TanStack Query Hooks — tickets, evidence, audit
// Follows useContractEventQueries pattern

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { financeKeys } from '@/hooks/queries/useFinanceQueries';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import type { ServiceTicketFilters, ServiceEvidenceFilters, AuditLogFilters } from '@/services/serviceURLs';
import type { ContractEvent } from '@/types/contractEvents';

// The workspace must also find services beyond the first timeline page.
export function useServiceWorkspaceEvents(contractId: string, options?: {enabled?: boolean; per_page?: number}) {
  const {currentTenant}=useAuth();
  return useQuery({
    queryKey:['contract-events','service-workspace',currentTenant?.id,contractId],
    enabled:!!currentTenant?.id && !!contractId && options?.enabled!==false,
    queryFn:async()=>{
      const items:ContractEvent[]=[];
      for(let page=1;;page++) {
        const r=await api.get(API_ENDPOINTS.CONTRACT_EVENTS.LIST_WITH_FILTERS({contract_id:contractId,page,per_page:100,sort_by:'scheduled_date',sort_order:'asc'}));
        const data=r.data?.data||r.data;
        items.push(...(data?.items||[]));
        if(!data?.items?.length || !data.page_info?.has_next_page) break;
      }
      return {items};
    },staleTime:30000,
  });
}

// =================================================================
// TYPES
// =================================================================

export interface ServiceTicket {
  id: string;
  ticket_number: string;
  contract_id: string;
  status: string;
  assigned_to_id: string | null;
  assigned_to_name: string | null;
  created_by_id: string;
  created_by_name: string;
  notes: string | null;
  version: number;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  event_count: number;
  evidence_count: number;
}

export interface ServiceTicketDetail extends ServiceTicket {
  events: Array<{
    id: string;
    event_id: string;
    event_type: string;
    block_name: string;
  }>;
  evidence: ServiceEvidence[];
}

export interface ServiceEvidence {
  id: string;
  ticket_id: string;
  contract_id: string;
  block_id: string | null;
  block_name: string | null;
  evidence_type: string;
  status: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  otp_code: string | null;
  otp_verified: boolean;
  otp_verified_at: string | null;
  otp_verified_by_name: string | null;
  form_data: any;
  uploaded_by_id: string | null;
  uploaded_by_name: string | null;
  verified_by_id: string | null;
  verified_by_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  category: string;
  action: string;
  description: string | null;
  old_value: any;
  new_value: any;
  performed_by_id: string;
  performed_by_name: string;
  created_at: string;
}

interface TicketListResponse {
  items: ServiceTicket[];
  total_count: number;
  page: number;
  per_page: number;
}

interface EvidenceListResponse {
  items: ServiceEvidence[];
  total_count: number;
  page: number;
  per_page: number;
}

interface AuditLogResponse {
  items: AuditLogEntry[];
  total_count: number;
  page: number;
  per_page: number;
  category_counts?: Record<string, number>;
}

// =================================================================
// QUERY KEYS
// =================================================================

export const serviceExecutionKeys = {
  all: ['service-execution'] as const,

  // Tickets
  tickets: () => [...serviceExecutionKeys.all, 'tickets'] as const,
  ticketList: (filters: ServiceTicketFilters) => [...serviceExecutionKeys.tickets(), 'list', { filters }] as const,
  ticketDetail: (ticketId: string) => [...serviceExecutionKeys.tickets(), 'detail', ticketId] as const,

  // Evidence
  evidence: () => [...serviceExecutionKeys.all, 'evidence'] as const,
  evidenceList: (filters: ServiceEvidenceFilters) => [...serviceExecutionKeys.evidence(), 'list', { filters }] as const,
  ticketEvidence: (ticketId: string) => [...serviceExecutionKeys.evidence(), 'ticket', ticketId] as const,

  // Audit
  audit: () => [...serviceExecutionKeys.all, 'audit'] as const,
  auditLog: (filters: AuditLogFilters) => [...serviceExecutionKeys.audit(), 'list', { filters }] as const,
};

// =================================================================
// TICKET HOOKS
// =================================================================

export const useServiceTickets = (
  filters: ServiceTicketFilters = {},
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceExecutionKeys.ticketList(filters),
    queryFn: async (): Promise<TicketListResponse> => {
      if (!currentTenant?.id) throw new Error('No tenant selected');

      const url = API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.LIST_WITH_FILTERS(filters);
      const response = await api.get(url);
      const data = response.data?.data || response.data;

      return data || { items: [], total_count: 0, page: 1, per_page: 25 };
    },
    enabled: !!currentTenant?.id && (options?.enabled !== false),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useServiceTicketsForContract = (
  contractId: string | null,
  options?: { enabled?: boolean }
) => {
  return useServiceTickets(
    { contract_id: contractId || undefined, per_page: 100 },
    { enabled: !!contractId && (options?.enabled !== false) }
  );
};

export const useServiceTicketDetail = (
  ticketId: string | null,
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceExecutionKeys.ticketDetail(ticketId || ''),
    queryFn: async (): Promise<ServiceTicketDetail> => {
      if (!currentTenant?.id) throw new Error('No tenant selected');
      if (!ticketId) throw new Error('No ticket ID');

      const url = API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.GET(ticketId);
      const response = await api.get(url);
      const data = response.data?.data || response.data;
      return data;
    },
    enabled: !!currentTenant?.id && !!ticketId && (options?.enabled !== false),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// =================================================================
// TICKET MUTATIONS
// =================================================================

export function useServiceTicketForEvent(contractId:string,eventId:string,enabled:boolean) {
 const {currentTenant}=useAuth();
 return useQuery<ServiceTicketDetail|null>({
  queryKey:[...serviceExecutionKeys.all,'event-ticket',currentTenant?.id,eventId], enabled:!!currentTenant?.id&&enabled,
  queryFn:async()=>{
   for(let page=1;;page++){
    const response=await api.get(API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.LIST_WITH_FILTERS({contract_id:contractId,page,per_page:100}));
    const data=response.data?.data||response.data;
    const rows=data.tickets||data.items||[];
    for(const row of rows){
     const detail=await api.get(API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.GET(row.id));
     const ticket=detail.data?.data||detail.data;
     if(ticket.events?.some((e:any)=>e.event_id===eventId||e.id===eventId)&&ticket.status!=='cancelled')return ticket;
    }
    if(!rows.length||page >= (data.pagination?.total_pages??Math.ceil((data.total_count??rows.length)/100)))return null;
   }
  },staleTime:30000,
 });
}

interface CreateTicketPayload {
  contract_id: string;
  event_ids: string[];
  // B3.1: field is `assigned_to` — the RPC chain reads body.assigned_to.
  // (The old `assigned_to_id` name was silently dropped end-to-end.)
  assigned_to?: string;
  assigned_to_name?: string;
  notes?: string;
  // B3.1: true when created from Start Service — ticket born in_progress
  // with started_at stamped server-side.
  start_now?: boolean;
}

interface UpdateTicketPayload {
  ticketId: string;
  status?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  notes?: string;
  version: number;
}

export const useCreateServiceTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateTicketPayload) => {
      const response = await api.post(API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.CREATE, payload);
      return response.data?.data || response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.tickets() });
      toast({
        title: 'Service Ticket Created',
        description: `Ticket ${data?.ticket_number || ''} created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create ticket',
        description: error?.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// B3.5 — beyond-scope invoice raised from a ticket's beyond-scope lines.
// Server (create_beyond_scope_invoice) totals lines itself, applies the
// tenant's default tax rate, and writes an UNPAID invoice with contract +
// ticket provenance. No billing event is created (D5).
export const useCreateBeyondScopeInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      ticketId: string;
      contract_id: string;
      line_items: { name: string; description?: string; amount: number; block_id?: string }[];
      notes?: string;
      currency?: string;
    }) => {
      const response = await api.post(
        API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.INVOICE(params.ticketId),
        {
          contract_id: params.contract_id,
          line_items: params.line_items,
          notes: params.notes,
        }
      );
      return response.data?.data || response.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
      queryClient.invalidateQueries({ queryKey: ['contract-details-v2'] });
      toast({
        title: 'Beyond-scope invoice created',
        description: `${data?.invoice_number || 'Invoice'} · total ${data?.total_amount ?? ''} (incl. tax)`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Beyond-scope invoice failed',
        description: error?.response?.data?.error || error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateServiceTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, ...payload }: UpdateTicketPayload) => {
      const url = API_ENDPOINTS.SERVICE_EXECUTION.TICKETS.UPDATE(ticketId);
      const response = await api.patch(url, payload);
      return response.data?.data || response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.ticketDetail(variables.ticketId) });
      toast({
        title: 'Ticket Updated',
        description: 'Service ticket updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update ticket',
        description: error?.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// =================================================================
// EVIDENCE HOOKS
// =================================================================

export const useServiceEvidence = (
  filters: ServiceEvidenceFilters = {},
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceExecutionKeys.evidenceList(filters),
    queryFn: async (): Promise<EvidenceListResponse> => {
      if (!currentTenant?.id) throw new Error('No tenant selected');

      const url = API_ENDPOINTS.SERVICE_EXECUTION.EVIDENCE.LIST_WITH_FILTERS(filters);
      const response = await api.get(url);
      const data = response.data?.data || response.data;

      return data || { items: [], total_count: 0, page: 1, per_page: 25 };
    },
    enabled: !!currentTenant?.id && (options?.enabled !== false),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useContractEvidence = (
  contractId: string | null,
  options?: { enabled?: boolean }
) => {
  return useServiceEvidence(
    { contract_id: contractId || undefined, per_page: 200 },
    { enabled: !!contractId && (options?.enabled !== false) }
  );
};

export const useTicketEvidence = (
  ticketId: string | null,
  options?: { enabled?: boolean }
) => {
  return useServiceEvidence(
    { ticket_id: ticketId || undefined, per_page: 50 },
    { enabled: !!ticketId && (options?.enabled !== false) }
  );
};

// =================================================================
// EVIDENCE MUTATIONS
// =================================================================

interface CreateEvidencePayload {
  ticketId: string;
  contract_id: string;
  block_id?: string;
  block_name?: string;
  evidence_type: string;
  /** The file in t_contract_evidence (evidence-storage/008). Preferred over file_url. */
  evidence_id?: string;
  label?: string;
  /** Legacy durable URL. Only set by rows written before the broker. */
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  form_data?: any;
  notes?: string;
}

interface UpdateEvidencePayload {
  ticketId: string;
  evidenceId: string;
  action: 'verify' | 'reject' | 'verify_otp' | 'update_file' | 'update_form';
  otp_code?: string;
  file_url?: string;
  file_name?: string;
  form_data?: any;
  notes?: string;
}

export const useCreateServiceEvidence = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, ...payload }: CreateEvidencePayload) => {
      const url = API_ENDPOINTS.SERVICE_EXECUTION.EVIDENCE.CREATE(ticketId);
      const response = await api.post(url, payload);
      return response.data?.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.evidence() });
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.tickets() });
      toast({ title: 'Evidence Uploaded', description: 'Evidence added successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to upload evidence',
        description: error?.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateServiceEvidence = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, evidenceId, ...payload }: UpdateEvidencePayload) => {
      const url = API_ENDPOINTS.SERVICE_EXECUTION.EVIDENCE.UPDATE(ticketId, evidenceId);
      const response = await api.patch(url, payload);
      return response.data?.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceExecutionKeys.evidence() });
      toast({ title: 'Evidence Updated', description: 'Evidence updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update evidence',
        description: error?.response?.data?.message || error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// =================================================================
// AUDIT LOG HOOKS
// =================================================================

export const useAuditLog = (
  filters: AuditLogFilters = {},
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceExecutionKeys.auditLog(filters),
    queryFn: async (): Promise<AuditLogResponse> => {
      if (!currentTenant?.id) throw new Error('No tenant selected');

      const url = API_ENDPOINTS.SERVICE_EXECUTION.AUDIT.LIST_WITH_FILTERS(filters);
      const response = await api.get(url);
      const data = response.data?.data || response.data;

      return data || { items: [], total_count: 0, page: 1, per_page: 25, category_counts: {} };
    },
    enabled: !!currentTenant?.id && (options?.enabled !== false),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useContractAuditLog = (
  contractId: string | null,
  filters?: { category?: string; page?: number; per_page?: number },
  options?: { enabled?: boolean }
) => {
  return useAuditLog(
    {
      contract_id: contractId || undefined,
      entity_type: 'contract',
      entity_id: contractId || undefined,
      category: filters?.category,
      page: filters?.page,
      per_page: filters?.per_page || 50,
    },
    { enabled: !!contractId && (options?.enabled !== false) }
  );
};
