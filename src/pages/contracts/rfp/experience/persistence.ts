import { API_ENDPOINTS } from '@/services/serviceURLs';
import { draftPayload, RFP_KEY, type RfpDraft } from './model';

type Transport = {
  get: (url: string) => Promise<any>;
  post: (url: string, body: any, config: any) => Promise<any>;
  put: (url: string, body: any, config: any) => Promise<any>;
};
export class DraftSaveError extends Error {
  constructor(message: string, public outcome: 'rejected' | 'uncertain') { super(message); this.name='DraftSaveError'; }
}
export const unwrap = (response: any) => {
  if (response.data?.success === false) throw new DraftSaveError(response.data.error?.message || response.data.error || 'Request failed', 'rejected');
  return response.data?.data ?? response.data;
};
const canonical = (value: unknown) => JSON.stringify(value, (_key, x) =>
  x && typeof x === 'object' && !Array.isArray(x)
    ? Object.keys(x).sort().reduce((o: any, key) => { o[key] = x[key]; return o; }, {}) : x);

/** Save via the existing RFQ transaction and verify the entire snapshot before success. */
export async function persistDraft(
  api: Transport, snapshot: RfpDraft, record: any,
  urls: { get: (id: string) => string; update: (id: string) => string },
  idempotencyKey: string, isCurrent: () => boolean,
) {
  const inScope = (value: any) => value.tenant_id === snapshot.tenantId && value.is_live === snapshot.isLive && value.status === 'draft' && value.record_type === 'rfq';
  let metadata = record?.metadata;
  if (record) {
    const current = unwrap(await api.get(urls.get(record.id)));
    if (!inScope(current) || current.version !== record.version) throw new Error('This draft changed elsewhere. Reopen it before editing; your current screen has not been overwritten.');
    metadata = current.metadata;
  }
  if (!isCurrent()) throw new Error('Workspace changed. Save cancelled before writing.');
  const payload = draftPayload(snapshot, metadata);
  const config = { headers: { 'x-idempotency-key': idempotencyKey } };
  let saved: any;
  try {
    // Use the existing RFQ-capable transaction, not a fabricated buyer ID.
    saved = record
      ? unwrap(await api.put(urls.update(record.id), { ...payload, version: record.version }, config))
      : unwrap(await api.post(API_ENDPOINTS.CONTRACTS.CREATE, payload, config));
  } catch (error: any) {
    if (error instanceof DraftSaveError) throw error;
    const status=error?.response?.status;
    const rejected=typeof status==='number' && status>=400 && status<500 && status!==408;
    const detail=error?.response?.data?.error;
    throw new DraftSaveError(typeof detail==='string'?detail:detail?.message||error.message||'Draft save failed', rejected?'rejected':'uncertain');
  }
  try {
    const id = record?.id || saved.id;
    if (!id) throw new Error('The save returned no request ID. Check saved drafts before retrying.');
    if (!isCurrent()) throw new Error('Workspace changed. Reopen the original workspace to check the saved draft.');
    const confirmed = unwrap(await api.get(urls.get(id)));
    if (!inScope(confirmed) || canonical(confirmed.metadata?.[RFP_KEY]) !== canonical(snapshot)) throw new Error('The server did not confirm the complete draft. Reopen saved drafts before retrying.');
    return confirmed;
  } catch (error: any) {
    throw new DraftSaveError(error.message || 'Draft confirmation failed', 'uncertain');
  }
}
