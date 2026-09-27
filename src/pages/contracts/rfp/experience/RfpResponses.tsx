import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { InlineLoader } from '@/components/common/loaders/UnifiedLoader';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import { unwrap } from './persistence';
import { rfpError, rfpRpc } from './rfpLifecycle';
import ProposalBlocks from './ProposalBlocks';
import type { RfpDraft } from './model';

export default function RfpResponses({ draft, recordId }: { draft: RfpDraft; recordId: string }) {
  const cache = useQueryClient(), { addToast } = useVaNiToast();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>(null), [note, setNote] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const flight = useRef(false), dialog = useRef<HTMLDialogElement>(null);
  async function load() {
    const data = unwrap(await api.get(API_ENDPOINTS.CONTRACTS.GET(recordId)));
    if (data.tenant_id !== draft.tenantId || data.is_live !== draft.isLive || data.record_type !== 'rfq' || !Array.isArray(data.vendors)) throw new Error('Proposals could not be verified in this workspace.');
    return data;
  }
  const query = useQuery({ queryKey: ['rfp-responses', draft.tenantId, draft.isLive, recordId], queryFn: load, refetchInterval: selected ? false : 15000 });
  const data = query.data, vendors: any[] = data?.vendors || [];
  const response = (v: any, record = data) => record?.metadata?.['rfp_response_' + v.id];
  const money = (v: any) => v.quoted_amount == null ? 'Not quoted' : new Intl.NumberFormat(undefined, { style: 'currency', currency: draft.currency }).format(Number(v.quoted_amount));
  const proposals = vendors.filter(v => v.quoted_amount != null);
  const winner = vendors.find(v => v.response_status === 'accepted');
  const notices = useQuery({ queryKey: ['rfp-award-delivery',draft.tenantId,draft.isLive,recordId], enabled: !!winner,
    queryFn: () => rfpRpc('rfp_award_delivery',{p_id:recordId,p_tenant:draft.tenantId,p_live:draft.isLive}), refetchInterval: winner ? 15000 : false });
  const vendorPreparing = data?.metadata?.rfp_agreement_prepared_by === 'vendor';
  const [prepareConfirmed,setPrepareConfirmed] = useState(false);
  const canAward = data?.status === 'quotes_received' && !winner;
  function choose(v: any) { setSelected({ ...v, snapshot: JSON.stringify(response(v)) }); setNote(''); setError(''); dialog.current?.showModal(); }
  async function award() {
    if (!selected || flight.current || !note.trim()) return;
    flight.current = true; setBusy(true); setError('');
    try {
      const fresh = await load(), candidate = fresh.vendors.find((v: any) => v.id === selected.id);
      if (fresh.status !== 'quotes_received' || !candidate || candidate.response_status !== 'quoted' || String(candidate.quoted_amount) !== String(selected.quoted_amount) || JSON.stringify(response(candidate, fresh)) !== selected.snapshot) throw new Error('This request or proposal changed. Close this confirmation, refresh and review it again.');
      const result = unwrap(await api.post(`/api/rfq/${recordId}/award`, { vendor_id: candidate.vendor_id, note: note.trim(), is_live: draft.isLive }));
      if (result?.success === false) throw new Error(result.error || 'Award failed');
      const confirmed = await load();
      if (confirmed.status !== 'awarded' || !confirmed.vendors.some((v: any) => v.vendor_id === candidate.vendor_id && v.response_status === 'accepted')) throw new Error('Award outcome is not confirmed. Refresh before attempting another award.');
      cache.setQueryData(['rfp-responses', draft.tenantId, draft.isLive, recordId], confirmed);
      await cache.invalidateQueries({ queryKey: ['rfp-receipt', draft.tenantId, draft.isLive, recordId] });
      dialog.current?.close(); setSelected(null);
      addToast({ type: 'success', title: 'Award recorded', message: 'The selected proposal is awarded. No contract or payment was created.' });
    } catch (e) { setError(rfpError(e)); await query.refetch(); }
    finally { flight.current = false; setBusy(false); }
  }
  async function prepareContract() {
    if (flight.current) return;
    flight.current = true; setBusy(true); setError('');
    try {
      const result = unwrap(await api.post(`/api/rfq/${recordId}/prepare-contract`, { is_live: draft.isLive }));
      if (!result?.id) throw new Error('The contract draft was not confirmed. Refresh before retrying.');
      navigate(`/contracts/experience/create?relationship=vendor&draft=${encodeURIComponent(result.id)}`);
    } catch (e) { setError(rfpError(e)); }
    finally { flight.current = false; setBusy(false); }
  }
  return <section className="rfp-paper" id="proposals" style={{ margin: '24px 0' }}>
    <div className="rfp-row between"><div><small>REVIEW & AWARD</small><h2>Choose the best fit. Not just a number.</h2></div><button className="rfp-button" onClick={() => void query.refetch()} disabled={busy}>Refresh proposals</button></div>
    <p>Compare the same scope, read the answers and review billing terms before choosing.</p>
    {query.isLoading && <InlineLoader text="Loading vendor proposals" />}
    {query.isError && <p className="rfp-error" role="alert">{rfpError(query.error)}</p>}
    {winner && <div className="rfp-note"><strong>Awarded to {winner.vendor_company || winner.vendor_name} · {money(winner)}</strong><p>{vendorPreparing ? 'The vendor is preparing the linked agreement in their workspace. They will send it for your review; no second draft is needed.' : data?.metadata?.rfp_contract_draft_id ? 'Your linked buyer-prepared draft is ready to continue. Nothing is activated by opening it.' : 'The vendor can prepare the agreement from their submitted commitments using their private request link. You review it before acceptance.'}</p>
      {!vendorPreparing && (data?.metadata?.rfp_contract_draft_id ? <button className="rfp-button primary" disabled={busy} onClick={() => void prepareContract()}>Open linked agreement →</button> : <details><summary>Need to prepare it on the buyer’s behalf instead?</summary><p>This uses the same proposal and reserves one shared draft for your workspace. The vendor will not create a second draft.</p><label className="rfp-check"><input type="checkbox" checked={prepareConfirmed} onChange={e=>setPrepareConfirmed(e.target.checked)}/>I will prepare the agreement for the vendor to review.</label><button className="rfp-button" disabled={busy || !prepareConfirmed} onClick={() => void prepareContract()}>{busy?'Opening agreement…':'Prepare as buyer →'}</button></details>)}
      <h3>Award messages</h3><p>The winner receives the award next step; other vendors receive a thank-you. Queued messages are not confirmed delivery.</p>
      {notices.isLoading && <InlineLoader text="Checking award messages"/>}
      {notices.isError && <p role="alert">{rfpError(notices.error)}</p>}
      {Array.isArray(notices.data) && notices.data.map((n:any,i:number)=><p key={n.id||i}>{n.name} · {n.channel} · {({awaiting_template:'Waiting for approved provider template',channel_disabled:'Channel disabled',no_invitation_destination:'No saved invitation destination',created:'Queued',queued:'Queued',delivered:'Delivered',sent:'Sent — delivery not confirmed'} as Record<string,string>)[n.status]||n.status}{n.error?` · ${n.error}`:''}</p>)}
      <button className="rfp-button" disabled={busy} onClick={async()=>{setBusy(true);try{await rfpRpc('rfp_award_delivery',{p_id:recordId,p_tenant:draft.tenantId,p_live:draft.isLive,p_retry:true});await notices.refetch();addToast({type:'info',title:'Award messages checked',message:'See each channel’s status below. Existing messages were not duplicated.'});}catch(e){setError(rfpError(e));}finally{setBusy(false);}}}>Queue missing award messages</button>
    </div>}
    {!selected && error && <p className="rfp-error" role="alert">{error}</p>}
    {data && <div className="rfp-row">{vendors.map(v => <span className="rfp-tag" key={v.id}>{v.vendor_company || v.vendor_name} · {v.response_status === 'accepted' ? 'Awarded' : v.response_status}</span>)}</div>}
    {data && !proposals.length && <p>No submitted proposals yet. Invitations and delivery status are shown below.</p>}
    {!!proposals.length && <><p>{proposals.length} proposal{proposals.length === 1 ? '' : 's'} received{proposals.length === 1 ? ' — additional submissions will appear alongside this one.' : '.'}</p><div style={{ overflowX: 'auto' }} tabIndex={0} aria-label="Compare vendor proposals"><table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}><thead><tr><th style={cell}>Compare like for like</th>{proposals.map(v => <th key={v.id} style={cell}>{v.vendor_company || v.vendor_name}<small>{v.response_status === 'accepted' ? 'Awarded' : v.response_status}</small></th>)}</tr></thead><tbody>
      <tr><th style={cell}>Proposed total</th>{proposals.map(v => <td key={v.id} style={cell}><strong>{money(v)}</strong></td>)}</tr>
      <tr><th style={cell}>Commitments & delivery</th>{proposals.map(v=><td key={v.id} style={cell}>{response(v)?.blocks?.length?<ProposalBlocks draft={draft} blocks={response(v).blocks} onChange={()=>{}} readOnly/>:<p>Earlier total-only proposal. Allocate item prices and review the delivery plan during agreement preparation.</p>}</td>)}</tr>
      <tr><th style={cell}>Approach</th>{proposals.map(v => <td key={v.id} style={cell}><SafeHtml html={response(v)?.approach || 'Not supplied'} /></td>)}</tr>
      <tr><th style={cell}>Billing terms</th>{proposals.map(v => <td key={v.id} style={cell}><SafeHtml html={response(v)?.billingTerms || 'Not supplied'} /></td>)}</tr>
      {draft.questions.map(q => <tr key={q.id}><th style={cell}>{q.text}{q.required && <small>Required</small>}{q.eligibility && <small>Eligibility condition</small>}</th>{proposals.map(v => { const answer = response(v)?.answers?.[q.id]; return <td key={v.id} style={cell}>{q.type === 'text' ? <SafeHtml html={answer || 'Not answered'} /> : q.type === 'file' && typeof answer === 'string' && /^https:\/\//i.test(answer) ? <a href={answer} target="_blank" rel="noopener noreferrer">View supporting document</a> : <span>{answer == null || answer === '' ? 'Not answered' : String(answer)}</span>}</td>; })}</tr>)}
      <tr><th style={cell}>Participation terms</th>{proposals.map(v => <td key={v.id} style={cell}>{response(v)?.acceptTerms === true ? 'Acknowledged' : 'Not recorded'}</td>)}</tr>
      <tr><th style={cell}>Decision</th>{proposals.map(v => <td key={v.id} style={cell}>{v.response_status === 'accepted' ? 'Awarded' : canAward && v.response_status === 'quoted' ? <button className="rfp-button primary" onClick={() => choose(v)}>Award this proposal</button> : 'Not available for award'}</td>)}</tr>
    </tbody></table></div></>}
    <dialog ref={dialog} className="rfp-modal" aria-labelledby="award-heading" onCancel={e => { if (busy) e.preventDefault(); else setSelected(null); }}>
      <h2 id="award-heading">Award to {selected?.vendor_company || selected?.vendor_name}?</h2><p>Proposed total: <strong>{selected && money(selected)}</strong></p>
      <p>This selects this vendor and declines the other invited vendors. No contract or payment is created.</p>
      <p>Verify eligibility, supporting evidence and any bid security before confirming. These checks are not automatic.</p>
      <label className="rfp-field">Why is this proposal the right fit? *<textarea value={note} onChange={e => setNote(e.target.value)} disabled={busy} style={{ minHeight: 100, padding: 12, border: '1px solid #dce3da', borderRadius: 9 }} /></label>
      {error && <p className="rfp-error" role="alert">{error}</p>}
      <div className="rfp-row"><button className="rfp-button" disabled={busy} onClick={() => { dialog.current?.close(); setSelected(null); }}>Cancel</button><button className="rfp-button primary" disabled={busy || !note.trim()} onClick={() => void award()}>{busy ? 'Recording award…' : 'Confirm award'}</button></div>
    </dialog>
  </section>;
}
const cell: React.CSSProperties = { padding: '18px 16px', borderBottom: '1px solid #dce3da', minWidth: 220, maxWidth: 450, verticalAlign: 'top', overflowWrap: 'anywhere' };
