// src/hooks/queries/useFormTemplates.ts
// B2.4 — approved form templates for tenant-facing pickers (block wizard
// Evidence step). Reads GET /api/forms/templates (status=approved default),
// which proxies the smart-forms edge function.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';

export interface FormTemplateOption {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  form_type: string;
  version: number;
  status: string;
  source?: string | null;
  resource_template_id?: string | null;
}

export const useApprovedFormTemplates = (options?: { enabled?: boolean }) => {
  const { currentTenant } = useAuth();

  return useQuery<FormTemplateOption[]>({
    queryKey: ['form-templates', 'approved'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SMART_FORMS.TEMPLATES({ status: 'approved' }));
      const payload = response.data;
      const rows = payload?.data || payload || [];
      return (Array.isArray(rows) ? rows : []).map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        form_type: t.form_type,
        version: t.version,
        status: t.status,
        source: t.source,
        resource_template_id: t.resource_template_id,
      }));
    },
    enabled: !!currentTenant?.id && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// ---------------------------------------------------------------------------
// B2.5 — resolved form mappings for a contract (written at activation by the
// D9 resolver). Read by the execution surface (OperationsTab / SellerTasksTab)
// so the service-ticket drawer shows the RESOLVED requirement, not just the
// contract wizard's evidence fields. Block-level rows come first from the API.
// ---------------------------------------------------------------------------

export interface ContractFormMapping {
  effective_from?: string | null;
  effective_to?: string | null;
  id: string;
  contract_id: string;
  contract_block_id: string | null;
  form_template_id: string;
  resource_template_id?: string | null;
  require_upload: boolean;
  resolved_via: string; // block_config | kt_type | contract_fallback | platform_default
  timing?: string | null;
  is_mandatory: boolean;
  form_name: string;
  form_version?: number;
  form_category?: string;
  form_type?: string;
}

export const useContractFormMappings = (
  contractId?: string,
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery<ContractFormMapping[]>({
    queryKey: ['contract-form-mappings', contractId],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SMART_FORMS.MAPPINGS(contractId!));
      const rows = response.data?.data || [];
      return (Array.isArray(rows) ? rows : []).map((m: any) => ({
        id: m.id,
        effective_from: m.effective_from,
        effective_to: m.effective_to,
        contract_id: m.contract_id,
        contract_block_id: m.contract_block_id ?? null,
        original_block_id: m.original_block_id ?? null,
        form_template_id: m.form_template_id,
        resource_template_id: m.resource_template_id ?? null,
        require_upload: !!m.require_upload,
        resolved_via: m.resolved_via,
        timing: m.timing ?? null,
        is_mandatory: m.is_mandatory !== false,
        form_name: m.m_form_templates?.name || 'Form',
        form_version: m.m_form_templates?.version,
        form_category: m.m_form_templates?.category,
        form_type: m.m_form_templates?.form_type,
      }));
    },
    enabled: !!currentTenant?.id && !!contractId && (options?.enabled !== false),
      staleTime: 0,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

// ---------------------------------------------------------------------------
// B3.4 — single template with schema (drives the form-fill renderer),
// and submission create (event_asset_id-bound; server gate enforces the
// per-asset rules and the API forwards event_asset_id since B2.5).
// ---------------------------------------------------------------------------

export interface FormSchemaField {
  /** Absent on historical templates; those fields remain technician answers. */
  binding?: import('@/types/assetMetadata').FieldBinding;
  id: string;
  type: string; // select | textarea | text | number | date | checkbox
  label: string;
  help_text?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  placeholder?: string;
  step?: number;
  validation?: { required?: boolean; min?: number; max?: number };
  reading_range?: { normal_min: number | null; normal_max: number | null; unit: string | null };
  reading_stage?: 'before' | 'final';
}

export interface FormSchemaSection {
  id: string;
  title: string;
  fields: FormSchemaField[];
}

export interface FormTemplateDetail extends FormTemplateOption {
  schema: {
    title?: string;
    sections: FormSchemaSection[];
    settings?: Record<string, unknown>;
  };
}

export const useFormTemplateDetail = (
  templateId?: string,
  options?: { enabled?: boolean }
) => {
  const { currentTenant } = useAuth();

  return useQuery<FormTemplateDetail>({
    queryKey: ['form-template-detail', templateId],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.SMART_FORMS.TEMPLATE_DETAIL(templateId!));
      return response.data?.data || response.data;
    },
    enabled: !!currentTenant?.id && !!templateId && (options?.enabled !== false),
    staleTime: 0,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

export interface CreateSubmissionInput {
  submission_id?: string;
  save_draft?: boolean;
  form_template_id: string;
  service_event_id: string;
  contract_id: string;
  mapping_id?: string;
  event_asset_id?: string;
  responses: Record<string, unknown>;
}

export const useCreateFormSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubmissionInput) => {
      const {submission_id, save_draft, ...body} = input;
      const response = submission_id
        ? await api.put(API_ENDPOINTS.SMART_FORMS.SUBMISSIONS.UPDATE(submission_id), {responses: body.responses, status: save_draft ? 'draft' : 'submitted'})
        : await api.post(API_ENDPOINTS.SMART_FORMS.SUBMISSIONS.CREATE, {...body,status:save_draft?'draft':'submitted'});
      const saved = response.data?.data || response.data;
      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
    },
    // Errors are surfaced by the caller (FormFillModal shows the server's
    // specific gate message — REQUIRED / MISMATCH / PLACEHOLDER).
  });
};

export default useApprovedFormTemplates;

export interface ServiceFormSubmission {
  id: string; form_template_id: string; form_template_version: number;
  service_event_id: string; event_asset_id?: string | null; status: string;
  responses: Record<string, any>; updated_at?: string;
  asset_metadata_snapshot?: Record<string, unknown> | null;
  service_context_snapshot?: Record<string, unknown> | null;
  form_schema_snapshot?: FormTemplateDetail['schema'] | null;
}
export interface FormExecutionContext {
  values: Record<string, unknown>;
  asset_snapshot: Record<string, unknown> | null;
  service_snapshot: Record<string, unknown>;
  missing_form_metadata: Array<{key:string;label:string}>;
}
export function useServiceStartMetadataProblem(eventId?: string, enabled = true) {
  const { currentTenant } = useAuth();
  return useQuery<{problem:string|null}>({
    queryKey: ['service-start-metadata', currentTenant?.id, eventId],
    enabled: enabled && !!currentTenant?.id && !!eventId,
    queryFn: async () => {
      const r = await api.get(API_ENDPOINTS.SMART_FORMS.SUBMISSIONS.START_CHECK(eventId!));
      return r.data?.data || r.data;
    },
    staleTime: 0,
  });
}
export function useFormExecutionContext(eventId?: string, assetId?: string, templateId?: string, enabled = true) {
  const { currentTenant } = useAuth();
  return useQuery<FormExecutionContext>({
    queryKey: ['form-execution-context', currentTenant?.id, eventId, assetId, templateId],
    enabled: enabled && !!currentTenant?.id && !!eventId && !!templateId,
    queryFn: async () => {
      const r = await api.get(API_ENDPOINTS.SMART_FORMS.SUBMISSIONS.CONTEXT(eventId!,templateId!,assetId));
      return r.data?.data || r.data;
    },
    staleTime: 0,
  });
}
export function useServiceFormSubmissions(eventId?: string) {
  const { currentTenant } = useAuth();
  return useQuery<ServiceFormSubmission[]>({
    queryKey: ['form-submissions', currentTenant?.id, eventId],
    enabled: !!currentTenant?.id && !!eventId,
    queryFn: async () => {
      const r = await api.get(API_ENDPOINTS.SMART_FORMS.SUBMISSIONS.LIST_WITH_FILTERS({event_id:eventId}));
      const data = r.data?.data ?? r.data;
      return Array.isArray(data) ? data : data?.items || [];
    },
  });
}
