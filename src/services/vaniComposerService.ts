// src/services/vaniComposerService.ts
// VaNi Contract Composer — UI client for the per-step /api/vani-composer
// pipeline. Each canvas card corresponds to exactly one call here; a card is
// shown only when its call has returned (honest progress).
// CPU LLM inference is slow (30–90s per LLM step) — timeouts are per-request.

import api, { getCurrentEnvironment } from './api';

const BASE = '/api/vani-composer';
const LLM_TIMEOUT_MS = 300000;   // parse-intent, select-blocks
const FAST_TIMEOUT_MS = 60000;   // resolve-buyer, shortlist, assemble

export interface VaniParsedIntent {
  contract_kind: string;
  nomenclature: string;
  buyer_text: string;
  duration: { value: number; unit: 'days' | 'months' | 'years' | '' };
  start_date: string;
  grace_period_days: number;
  acceptance: 'payment' | 'signoff' | 'auto' | '';
  billing: { mode: 'prepaid' | 'emi' | 'per_block' | ''; emi_months: number; cycle: string };
  equipment_hint: string;
  activities: string[];
  special_asks: string[];
}

export interface VaniNomenclatureMatch {
  id: string;
  name: string;
  group: string;
}

export interface VaniParseStepResult {
  intent: VaniParsedIntent;
  nomenclatureMatch: VaniNomenclatureMatch | null;
  interactionId: string;
}

export interface VaniBuyerResolution {
  status: 'resolved' | 'ambiguous' | 'not_found';
  contact?: { id: string; name: string };
  candidates?: Array<{ id: string; name: string; company_name?: string }>;
}

export interface VaniCandidate {
  key: string;
  block_id: string;
  name: string;
  description: string;
  activity: string;
  cycle_days: number;
  price: number;
  currency: string;
  tax_rate: number;
  form_template_id: string | null;
  equipment: string;
  icon: string;
}

export interface VaniShortlistResult {
  candidates: VaniCandidate[];
  scannedCount: number;
}

export interface VaniGap {
  severity: 'warning' | 'info';
  message: string;
}

export interface VaniSelectResult {
  selections: Array<{ block_id: string; quantity: number; reason: string }>;
  gaps: VaniGap[];
  summary: string;
  interactionId: string;
}

export interface VaniStepReadiness {
  id: string;
  label: string;
  ready: boolean;
  note?: string;
}

export type VaniRelationship = 'client' | 'partner' | 'vendor';
export interface VaniScope {
  tenantId: string;
  environment: 'live' | 'test';
  workflow: 'contract' | 'template' | 'rfq';
  relationship: VaniRelationship | null;
}
export function assertVaniScope(scope: VaniScope): void {
  const tenant = localStorage.getItem('tenant_id') || sessionStorage.getItem('tenant_id');
  if (!scope || scope.tenantId !== tenant || scope.environment !== getCurrentEnvironment())
    throw new Error('Workspace or Live/Test changed. Reopen VaNi before continuing.');
}
export interface VaniComposeResult {
  context: VaniScope & { schemaVersion: 1; currencySource: 'request' | 'catalogue' | 'template'; calendar: 'agreement' | 'illustrative'; template?: { id: string; revision: string | null } };
  draft: {
    contractName: string;
    buyerId: string;
    buyerName: string;
    nomenclatureId: string | null;
    nomenclatureName: string | null;
    nomenclatureGroup: string | null;
    acceptanceMethod: 'payment' | 'signoff' | 'auto';
    startDate?: string;
    durationValue: number;
    durationUnit: string;
    gracePeriodValue: number;
    gracePeriodUnit: string;
    currency: string;
    paymentMode: 'prepaid' | 'emi' | 'defined';
    emiMonths: number;
    billingCycleType: 'unified' | 'mixed';
    perBlockPaymentType: Record<string, 'prepaid' | 'postpaid'>;
    selectedBlocks: any[]; // ConfigurableBlock-shaped
    equipmentDetails: any[];
    allowBuyerToAdd: boolean;
    coverageTypes: any[];
    evidencePolicyType: 'none' | 'upload' | 'smart_form';
    evidenceSelectedForms: any[];
    description: string;
    totalValue: number;
    baseSubtotal: number;
    taxTotal: number;
    grandTotal: number;
    selectedTaxRateIds: string[];
    taxBreakdown: any[];
  };
  vani: {
    summary: string;
    gaps: VaniGap[];
    blockReasons: Record<string, string>;
  };
  readiness: {
    steps: VaniStepReadiness[];
    readyCount: number;
    totalCount: number;
    needsYou: string[];
  };
  eventsPreview: {
    serviceEvents: number;
    billingEvents: number;
    estimatedTotal: number;
  };
}

export interface VaniEntitlement {
  /** Mirrors the tenant-table truth (t_tenants.vani_enabled via vani_is_enabled). */
  entitled: boolean;
  /** 'tenant' on current API builds; 'open' | 'subscription' on older ones. */
  mode: 'open' | 'subscription' | 'tenant';
  llm_enabled: boolean;
}

/** Template tier — a signed-off template matched the request */
export interface VaniTemplateMatch {
  template_id: string;
  name: string;
  score: number;
  reasons: string[];
  category: string | null;
  total: number | null;
  currency: string;
  blocks_count: number;
}

export interface VaniTemplateMatchResult {
  match: VaniTemplateMatch | null;
  considered: number;
  /** Present when the server quick-parsed the text AND a template matched it */
  quickIntent: VaniParsedIntent | null;
  nomenclatureMatch: VaniNomenclatureMatch | null;
}

function unwrap<T>(response: any, fallbackMessage: string): T {
  if (!response.data?.success) {
    throw new Error(response.data?.error?.message || fallbackMessage);
  }
  return response.data.data as T;
}

class VaniComposerService {
  constructor(private scope?: VaniScope, private token?: string | null) {}
  /** One client per open flow, never a mutable singleton workspace. */
  withContext(workflow: VaniScope['workflow'], relationship: VaniRelationship | null) {
    return new VaniComposerService({
      tenantId: localStorage.getItem('tenant_id') || sessionStorage.getItem('tenant_id') || '',
      environment: getCurrentEnvironment(), workflow, relationship,
    }, localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));
  }
  private assertCurrent() {
    if (!this.scope) throw new Error('Open VaNi with a workspace context first.');
    assertVaniScope(this.scope);
    if (this.token !== (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')))
      throw new Error('Your sign-in changed. Reopen VaNi before continuing.');
  }
  private contextReady?: Promise<void>;
  private async post(url: string, body: any, options: any) {
    this.assertCurrent();
    if (!this.contextReady) {
      this.contextReady = this.getContext().then(data => {
        if (data?.schemaVersion !== 1) throw new Error('Update the API shared-context release before using VaNi.');
      }).catch(error => { this.contextReady = undefined; throw error; });
    }
    await this.contextReady;
    this.assertCurrent();
    const response = await api.post(url, { ...body, context: this.scope }, options);
    this.assertCurrent(); // reject a late result after a tenant/environment/account change
    return response;
  }
  async getContext() {
    this.assertCurrent();
    const response = await api.get(`${BASE}/context`, { params: { context: JSON.stringify(this.scope) } });
    this.assertCurrent();
    return unwrap<any>(response, 'Workspace context unavailable');
  }
  /** Is VaNi visible/usable for this tenant? UI hides the entry point when not. */
  async checkEntitlement(): Promise<VaniEntitlement> {
    try {
      const response = await api.get(`${BASE}/entitlement`, { timeout: 15000 });
      if (response.data?.success) return response.data.data;
    } catch {
      /* fall through */
    }
    return { entitled: false, mode: 'open', llm_enabled: false };
  }

  /** STEP 1 — LLM: text → intent + nomenclature */
  async parseIntent(text: string): Promise<VaniParseStepResult> {
    const response = await this.post(`${BASE}/parse-intent`, { text }, { timeout: LLM_TIMEOUT_MS });
    return unwrap<VaniParseStepResult>(response, 'VaNi could not read your request');
  }

  async validateContacts(contacts: Array<{ id: string; relationship: VaniRelationship }>) {
    const response = await this.post(`${BASE}/validate-contacts`, { contacts }, { timeout: FAST_TIMEOUT_MS });
    return unwrap<{ contacts: Array<{ id: string; name: string; relationship: VaniRelationship }> }>(response, 'Contact validation failed');
  }

  /** STEP 2 — deterministic: buyer lookup */
  async resolveBuyer(buyerText: string): Promise<VaniBuyerResolution> {
    const response = await this.post(`${BASE}/resolve-buyer`, { buyer_text: buyerText }, { timeout: FAST_TIMEOUT_MS });
    return unwrap<VaniBuyerResolution>(response, 'Buyer lookup failed');
  }

  /** STEP 3 — deterministic: catalog scan → candidates */
  async shortlist(intent: VaniParsedIntent): Promise<VaniShortlistResult> {
    const response = await this.post(`${BASE}/shortlist`, { intent }, { timeout: FAST_TIMEOUT_MS });
    return unwrap<VaniShortlistResult>(response, 'Catalog shortlist failed');
  }

  /** Smart helper chips — deterministic, per-tenant; [] on any failure */
  async getSuggestions(mode: 'contract' | 'template'): Promise<string[]> {
    try {
      this.assertCurrent();
      const response = await api.get(`${BASE}/suggestions?mode=${mode}`, {
        timeout: 20000, params: { context: JSON.stringify(this.scope) },
      });
      this.assertCurrent();
      if (response.data?.success) return response.data.data?.suggestions || [];
    } catch { /* chips are cosmetic */ }
    return [];
  }

  /** TEMPLATE TIER — deterministic: does a signed-off template answer this?
   *  Pass intent when the LLM already parsed; omit it to let the server
   *  quick-parse simple requests (zero-LLM fast path). */
  async matchTemplate(text: string, intent?: VaniParsedIntent | null): Promise<VaniTemplateMatchResult> {
    const response = await this.post(
      `${BASE}/match-template`,
      { text, intent: intent || undefined },
      { timeout: FAST_TIMEOUT_MS }
    );
    return unwrap<VaniTemplateMatchResult>(response, 'Template match failed');
  }

  /** TEMPLATE TIER — deterministic: instantiate a matched template as a draft */
  async assembleFromTemplate(
    templateId: string,
    intent: VaniParsedIntent,
    buyer: { id: string; name: string } | null,
    defaultCurrency?: string,
    cadenceSelections?: Array<{ block_id: string; cycle: string }>
  ): Promise<VaniComposeResult> {
    const response = await this.post(
      `${BASE}/assemble-from-template`,
      {
        template_id: templateId,
        intent,
        buyer_id: buyer?.id || '',
        buyer_name: buyer?.name || '',
        default_currency: defaultCurrency || '',
        cadence_selections: cadenceSelections || [],
      },
      { timeout: FAST_TIMEOUT_MS }
    );
    return unwrap<VaniComposeResult>(response, 'VaNi could not assemble from the template');
  }

  /** STEP 4 — LLM: select blocks + flag gaps */
  async selectBlocks(
    intent: VaniParsedIntent,
    nomenclature: VaniNomenclatureMatch | null,
    candidates: VaniCandidate[]
  ): Promise<VaniSelectResult> {
    const response = await this.post(
      `${BASE}/select-blocks`,
      { intent, nomenclature, candidates },
      { timeout: LLM_TIMEOUT_MS }
    );
    return unwrap<VaniSelectResult>(response, 'VaNi could not compose the block selection');
  }

  /** STEP 5 — deterministic: assemble the reviewable draft */
  async assemble(
    intent: VaniParsedIntent,
    buyer: { id: string; name: string } | null,
    candidates: VaniCandidate[],
    selection: VaniSelectResult,
    defaultCurrency?: string,
    cadenceSelections?: Array<{ block_id: string; cycle: string }>
  ): Promise<VaniComposeResult> {
    const response = await this.post(
      `${BASE}/assemble`,
      {
        intent,
        buyer_id: buyer?.id || '',
        buyer_name: buyer?.name || '',
        candidates,
        selections: selection.selections,
        gaps: selection.gaps,
        summary: selection.summary,
        default_currency: defaultCurrency || '',
        cadence_selections: cadenceSelections || [],
      },
      { timeout: FAST_TIMEOUT_MS }
    );
    return unwrap<VaniComposeResult>(response, 'VaNi could not assemble the draft');
  }

  /** Fire-and-forget quality signals — never blocks or throws */
  sendFeedback(
    interactionIds: string[],
    feedback: { was_accepted?: boolean; was_edited?: boolean; user_rating?: number }
  ): void {
    if (!interactionIds || interactionIds.length === 0) return;
    api
      .post(`${BASE}/feedback`, { interaction_ids: interactionIds, ...feedback })
      .catch(() => { /* logging must never disturb the user flow */ });
  }
}

export const vaniComposerService = new VaniComposerService();
export default vaniComposerService;
