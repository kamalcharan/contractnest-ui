import type { ConfigurableBlock } from '@/components/catalog-studio';

export const RFP_KEY = 'rfp_buyer_v1';
export type Family = 'equipment' | 'facility' | 'service';
export interface Coverage { id: string; name: string; family: Family; quantity: number; location: string; resourceId: string | null; registryId: string | null }
export interface Question { id: string; text: string; section: string; type: 'text' | 'number' | 'yesno' | 'file'; required: boolean; eligibility: boolean }
export interface Invite { id: string; name: string; email: string; contactId: string | null }
export interface RfpDraft {
  schema: 1; tenantId: string; isLive: boolean; step: number; title: string; family: Family;
  brief: string; location: string; start: string; months: number; currency: string;
  nomenclature: { id: string; label: string; group: string } | null;
  coverage: Coverage[]; blocks: Array<ConfigurableBlock & { coverageIds: string[] }>;
  questions: Question[]; weights: number[]; terms: string; deadline: string; deadlineTime: string; questionsBy: string;
  budget: string; shareBudget: boolean; security: 'none' | 'declaration' | 'deposit'; securityAmount: string;
  releaseTerms: string; exemption: boolean; performance: boolean; performancePct: string; invites: Invite[];
}
export const textOf = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
export function newDraft(tenantId: string, isLive: boolean, currency: string): RfpDraft {
  return { schema: 1, tenantId, isLive, step: 0, title: '', family: 'equipment', brief: '', location: '', start: '', months: 0, currency,
    nomenclature: null, coverage: [], blocks: [], questions: [], weights: [40, 30, 30], terms: '', deadline: '', deadlineTime: '', questionsBy: '',
    budget: '', shareBudget: false, security: 'none', securityAmount: '', releaseTerms: '', exemption: false, performance: false, performancePct: '', invites: [] };
}
export function validate(d: RfpDraft, step: number): string[] {
  const errors: string[] = [];
  if (!d.title.trim()) errors.push('Give your request a name.');
  if (step === 0) {
    if (!textOf(d.brief) || !d.location.trim()) errors.push('Describe the outcome and location.');
    if (!d.start || !Number.isFinite(Date.parse(d.start)) || !Number.isInteger(d.months) || d.months < 1 || d.months > 120) errors.push('Choose a valid start date and a term of 1–120 whole months.');
    if (!d.coverage.length) errors.push('Add at least one coverage entry.');
    if (!d.blocks.length) errors.push('Add at least one requirement.');
    for (const c of d.coverage) if (!c.name.trim() || !Number.isInteger(c.quantity) || c.quantity < 1) errors.push('Coverage needs a name and a positive whole-number count.');
    for (const b of d.blocks) {
      if (!b.name.trim()) errors.push('Every requirement needs a name.');
      if (!b.coverageIds.length || b.coverageIds.some(id => !d.coverage.some(c => c.id === id))) errors.push(`${b.name || 'Requirement'}: link its coverage.`);
      if (!b.unlimited && (!Number.isInteger(b.quantity) || b.quantity < 1)) errors.push(`${b.name}: enter a positive quantity.`);
      if (b.serviceCycleDays !== undefined && (!Number.isInteger(b.serviceCycleDays) || b.serviceCycleDays < 1)) errors.push(`${b.name}: service interval must be positive whole days.`);
      if (b.serviceCycleDays && !b.unlimited && d.start && d.months > 0) {
        const last = new Date(d.start + 'T12:00:00'); last.setDate(last.getDate() + (b.quantity - 1) * b.serviceCycleDays);
        const end = new Date(d.start + 'T12:00:00'); end.setMonth(end.getMonth() + d.months);
        if (last > end) errors.push(`${b.name}: visits extend beyond the requested term.`);
      }
    }
  }
  if (step === 1) {
    if (d.weights.length !== 3 || d.weights.some(x => !Number.isFinite(x) || x < 0 || x > 100) || d.weights.reduce((a,b)=>a+b,0)!==100) errors.push('Evaluation weights must total 100%.');
    d.questions.forEach(q => { if (!q.text.trim()) errors.push('Each question needs a prompt.'); if (q.eligibility && (q.type !== 'yesno' || !q.required)) errors.push('Eligibility conditions must be required Yes / No questions.'); });
  }
  if (step === 2) {
    if (!d.currency) errors.push('Choose the quote currency.');
    if (!textOf(d.terms)) errors.push('Add the terms vendors should review.');
    if (!d.deadline || !d.deadlineTime || !Number.isFinite(Date.parse(`${d.deadline}T${d.deadlineTime}:00+05:30`))) errors.push('Set the response date and time (Asia/Kolkata).');
    if (!d.questionsBy || d.questionsBy > d.deadline) errors.push('Clarification deadline must be on or before the response deadline.');
    if (d.security === 'deposit' && (!(Number(d.securityAmount)>0) || !textOf(d.releaseTerms))) errors.push('Bid security needs a positive amount and release conditions.');
    if (d.performance && (!(Number(d.performancePct)>0) || Number(d.performancePct)>100)) errors.push('Performance security must be between 1 and 100%.');
    if (d.budget && (!Number.isFinite(Number(d.budget)) || Number(d.budget)<0)) errors.push('Budget must be a non-negative amount.');
  }
  if (step === 3) {
    if (!d.invites.length) errors.push('Add at least one intended recipient.');
    const emails = new Set<string>();
    for (const v of d.invites) { const e=v.email.trim().toLowerCase(); if (!v.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errors.push('Each recipient needs a name and valid email.'); if (emails.has(e)) errors.push('Remove duplicate recipient emails.'); emails.add(e); }
  }
  return errors;
}
export function restore(raw: unknown, tenantId: string, isLive: boolean): RfpDraft {
  const d = raw as RfpDraft;
  if (!d || d.schema !== 1 || d.tenantId !== tenantId || d.isLive !== isLive || !Array.isArray(d.coverage) || !Array.isArray(d.blocks) || !Array.isArray(d.questions) || !Array.isArray(d.invites) || !Array.isArray(d.weights) || typeof d.title !== 'string' || typeof d.terms !== 'string') throw new Error('This is not a compatible RFP draft in the current workspace and environment.');
  if (!Number.isInteger(d.step) || d.step<0 || d.step>4) throw new Error('The saved RFP step is invalid.');
  return d;
}
// Draft-only storage uses the existing contract transaction. Do not pass acceptance,
// vendors or computed events: recipients are intentions until the response release.
export function draftPayload(d: RfpDraft, metadata: Record<string, unknown> = {}) {
  return { record_type: 'rfq', contract_type: 'vendor', contact_classification: 'vendor', name: d.title.trim(), title: d.title.trim(),
    description: d.brief, currency: d.currency, ...(d.start ? { start_date: d.start+'T00:00:00+05:30' } : {}),
    ...(d.months>0?{duration_value:d.months,duration_unit:'months'}:{}),
    metadata: { ...metadata, [RFP_KEY]: d, rfp_release_stage: 'buyer_draft_only' } };
}
export function commitmentSummary(b: RfpDraft['blocks'][number], d: RfpDraft) {
  const names=b.coverageIds.map(id=>d.coverage.find(c=>c.id===id)?.name || 'Missing coverage').join(', ');
  return `${b.unlimited?'Unlimited / on demand':b.quantity+' occurrences'}${b.serviceCycleDays?' · every '+b.serviceCycleDays+' days':''} · ${names || 'Coverage not linked'} · ${b.cycle || 'Billing not specified'} billing`;
}
