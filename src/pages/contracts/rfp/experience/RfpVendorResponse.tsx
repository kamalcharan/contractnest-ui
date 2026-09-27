import React, { useRef, useState } from 'react';
import type { RfpDraft } from './model';
import type { QuoteMe } from '@/pages/quote/useVendorQuote';
import { rfpRpc, rfpError } from './rfpLifecycle';
import RfpDocument from './RfpDocument';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import ProposalBlocks, { proposalTotal, proposalBlockErrors, type ProposalBlock } from './ProposalBlocks';
import VendorNextSteps from './VendorNextSteps';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { InlineLoader } from '@/components/common/loaders/UnifiedLoader';
const richText = (html: string) => new DOMParser().parseFromString(html, 'text/html').body.textContent?.replace(/\u00a0/g, ' ').trim() || '';
import './rfp-buyer.css';
import './rfp-vendor.css';

const steps = ['Understand the request', 'Your approach', 'Your price', 'Review & respond'];
export default function RfpVendorResponse({ draft, number, status, cnak, secret, me }: { draft: RfpDraft; number: string; status: string; cnak: string; secret: string; me: QuoteMe }) {
  const [step, setStep] = useState(0);
  const {addToast}=useVaNiToast();
  const [blocks,setBlocks] = useState<ProposalBlock[]>(me.proposal?.blocks || []);
  const [editingBlock,setEditingBlock] = useState(false);
  const amount = String(proposalTotal(blocks));
  const [billing, setBilling] = useState(me.proposal?.billingTerms || ''), [approach, setApproach] = useState(me.proposal?.approach || '');
  const [answers, setAnswers] = useState<Record<string, string>>(me.proposal?.answers || {});
  const [accepted, setAccepted] = useState(me.proposal?.acceptTerms===true), [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false), [error, setError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const closed = !['sent', 'quotes_received'].includes(status) || Date.parse(draft.deadline + 'T' + draft.deadlineTime + ':00+05:30') <= Date.now();
  function move(next: number) {
    if (busy) return;
    if (next > step && !closed) {
      if (step === 1 && (!richText(approach) || draft.questions.some(q => q.type === 'text' && q.required && !richText(answers[q.id] || '')))) {
        setError('Complete your approach and all required text answers.'); return;
      }
      if (step === 2 && !richText(billing)) { setError('Enter your proposed billing terms.'); return; }
      if (step === 2 && (editingBlock || proposalBlockErrors(blocks,draft).length)) { setError(editingBlock?'Apply or cancel your commitment edit first.':proposalBlockErrors(blocks,draft).join(' ')); return; }
      if (!form.current?.reportValidity()) return;
    }
    setError(''); setStep(next);
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) { move(step + 1); return; }
    if (busy || closed) return;
    if (editingBlock || proposalBlockErrors(blocks,draft).length || !richText(approach) || !richText(billing) || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !accepted) {
      setError('Complete your approach, price and billing terms, then acknowledge the request.'); return;
    }
    setBusy(true); setError('');
    try {
      await rfpRpc('rfp_submit_response', { p_cnak: cnak, p_secret: secret, p_response: { schema: 2, blocks, amount: Number(amount), billingTerms: billing, approach, answers, acceptTerms: accepted } }, true);
      setDone(true);
      addToast({type:'success',title:'Proposal submitted',message:'The buyer can now review your commitments and answers. No contract or payment was created.'});
    } catch (e) { setError(rfpError(e)); } finally { setBusy(false); }
  }
  const shownAmount = !blocks.length && me.quoted_amount != null ? String(me.quoted_amount) : amount;
  const price = shownAmount ? `${draft.currency} ${Number(shownAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Not entered';
  return <div className="rfp-buyer rfp-vendor">
    <header className="rv-top"><div className="rv-logo">Contract<span>Nest</span></div><span className="rfp-tag">Requests & proposals · Private vendor copy</span></header>
    <div className="rfp-shell">
      <aside className="rfp-rail"><small>YOUR PROPOSAL</small><nav aria-label="Proposal progress">{steps.map((label, i) => <button type="button" key={label} aria-current={step === i ? 'step' : undefined} disabled={busy || done || (i > step && !closed)} onClick={() => move(i)}><b>{i < step ? '✓' : i + 1}</b>{label}</button>)}</nav><p>Your response stays private.<br />Other vendors cannot see your price or answers.</p></aside>
      <main className="rfp-main">
        <header className="rv-hero"><small>{step + 1} OF 4 · VENDOR EXPERIENCE</small><h1 ref={heading} tabIndex={-1}>A proposal, built around their need.</h1><p>Understand the brief, answer what matters, and put a clear offer on the table.</p></header>
        <div className="rfp-grid"><div className="rfp-stack">
          <section className="rfp-paper rv-context"><div><span className="rfp-tag">{number}</span><h2>{draft.title}</h2><p>Responding as <strong>{me.vendor_name}</strong></p></div><div><small>RESPOND BY</small><strong>{draft.deadline} · {draft.deadlineTime} IST</strong></div></section>
          {(done || me.response_status==='quoted' || me.response_status==='accepted') && <VendorNextSteps cnak={cnak} secret={secret} awarded={me.response_status==='accepted' && status==='awarded'} buyerPreparing={me.agreement_prepared_by==='buyer'}/>}
          {me.response_status==='accepted' && <section className="rfp-paper"><h2>Your submitted commitments</h2>{blocks.length?<ProposalBlocks draft={draft} blocks={blocks} onChange={()=>{}} readOnly/>:<p>Your earlier total-only quote is preserved. Review and complete the commitments when preparing the agreement.</p>}</section>}
          {done ? <section className="rfp-paper" role="status"><div className="rv-success">✓</div><h2>Your proposal is with the buyer.</h2><p>{price} · Your approach, billing terms and answers have been submitted.</p><div className="rfp-note">No award yet. This submission does not create a contract or confirm a payment.</div></section> : <form ref={form} onSubmit={submit} id="vendor-proposal">
            {status==='awarded' && me.response_status!=='accepted' && <section className="rfp-paper"><h2>Thank you for your proposal.</h2><p>The buyer selected another proposal for this request. Your submission remains private, and we appreciate the time you invested.</p></section>}
            {closed && <p className="rfp-note" role="status">This request is closed for responses. You can still review the request.</p>}
            {me.response_status === 'quoted' && <p className="rfp-note">Your saved response is shown below. Submitting again replaces it while the request is open. Older total-only quotes remain valid; add structured commitments before revising them.</p>}
            {step === 0 && <><div className="rfp-row between"><h2>Understand the request.</h2><button type="button" className="rfp-button" onClick={() => window.print()}>Print / Save PDF</button></div><RfpDocument draft={draft} number={number} status={status} /></>}
            {step === 1 && <section className="rfp-paper"><h2>Show how you will deliver.</h2><p>Answer in your own words. Required fields are marked *.</p><fieldset disabled={busy || closed}><div className="rfp-field"><RichTextEditor label="Your proposed approach" required disabled={busy || closed} value={approach} onChange={setApproach} placeholder="Explain your delivery plan, experience and any assumptions." /></div>
              {draft.questions.map((q, i) => <article className="rfp-unit" key={q.id}><span className="rfp-tag">{q.section}</span><div className="rfp-field">{q.type !== 'text' && <span>{i + 1}. {q.text}{q.required ? ' *' : ''}</span>}
                {q.type === 'yesno' ? <select aria-label={q.text} required={q.required} value={answers[q.id] || ''} onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}><option value="">Choose an answer</option><option>Yes</option><option>No</option></select> : q.type === 'text' ? <RichTextEditor label={`${i + 1}. ${q.text}`} required={q.required} disabled={busy || closed} value={answers[q.id] || ''} onChange={value => setAnswers({ ...answers, [q.id]: value })} /> : <input aria-label={q.text} required={q.required} type={q.type === 'number' ? 'number' : 'url'} step="any" pattern={q.type === 'file' ? 'https://.*' : undefined} placeholder={q.type === 'file' ? 'https:// — supporting document link' : undefined} value={answers[q.id] || ''} onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })} />}
                {q.eligibility && <small>Eligibility condition — the buyer will assess your answer.</small>}{q.type === 'file' && <small>Use an HTTPS document link accessible to the buyer. File upload is not available.</small>}
              </div></article>)}
            </fieldset></section>}
            {step === 2 && <section className="rfp-paper"><h2>Your commitments and commercial proposal.</h2><p>The buyer’s requirements remain unchanged. Propose your own quantities and delivery plan, and explain any exclusions in a Text block.</p><ProposalBlocks draft={draft} blocks={blocks} onChange={setBlocks} disabled={busy || closed} onEditing={setEditingBlock}/><fieldset disabled={busy || closed}><div className="rfp-field"><RichTextEditor label="Your proposed billing terms" required disabled={busy || closed} value={billing} onChange={setBilling} placeholder="State advances, milestones, payment timing, taxes and exclusions clearly." /></div></fieldset><div className="rv-total"><span>Total from your commitments</span><strong>{price}</strong></div></section>}
            {step === 3 && <><article className="rfp-document rfp-print-document"><small>VENDOR PROPOSAL · AGAINST {number}</small><h2>{draft.title}</h2><p>From {me.vendor_name}</p><section><h3>Our approach</h3><SafeHtml html={approach} /></section>{draft.questions.map(q => <section key={q.id}><h3>{q.text}</h3>{q.type === 'text' ? <SafeHtml html={answers[q.id] || 'Not supplied'} /> : <p className="rv-preserve">{answers[q.id] || 'Not supplied'}</p>}</section>)}<section><h3>Commercial proposal</h3><ProposalBlocks draft={draft} blocks={blocks} onChange={()=>{}} readOnly/><div className="rv-total"><span>Total · {draft.currency}</span><strong>{price}</strong></div><h3>Billing terms & assumptions</h3><SafeHtml html={billing} /></section><p>This is a proposal, not an active service agreement. No payment is confirmed.</p></article><section className="rfp-paper"><label className="rfp-check"><input required type="checkbox" checked={accepted} disabled={busy || closed} onChange={e => setAccepted(e.target.checked)} />I have reviewed the request and its participation terms, including any bid or performance security requirements.</label><div className="rfp-note">Submitting does not accept a contract or confirm payment. The buyer decides after reviewing responses.</div><button type="button" className="rfp-button" onClick={() => window.print()}>Print / Save PDF</button></section></>}
            {busy && <InlineLoader text="Saving your proposal"/>}
            {error && <p className="rfp-error" role="alert">{error}</p>}
          </form>}
        </div><aside className="rfp-summary"><small>YOUR REQUEST · {number}</small><h2>{draft.title}</h2><span className="rfp-tag">{closed ? 'Closed for responses' : 'Open for proposals'}</span><dl><dt>Coverage</dt><dd>{draft.coverage.length} items</dd><dt>Term</dt><dd>{draft.months} months</dd><dt>Requested work</dt><dd>{draft.blocks.length} requirements</dd><dt>Questions</dt><dd>{draft.questions.length}</dd><dt>Respond by</dt><dd>{draft.deadline}<br />{draft.deadlineTime} IST</dd><dt>Bid security</dt><dd>{draft.security === 'none' ? 'Not required' : draft.security === 'declaration' ? 'Declaration' : `${draft.currency} ${draft.securityAmount}`}</dd></dl><hr /><strong>One request. Independent proposals.</strong><p>Your response is private to the requesting business.</p></aside></div>
      </main>
    </div>
    <footer className="rfp-footer"><div><strong>{done ? 'Proposal submitted' : closed ? 'Request closed for new responses' : 'Your proposal stays private'}</strong><small>{done ? 'No contract or payment created.' : closed ? 'Review your saved proposal. Award alone does not activate an agreement.' : 'Not submitted until the final step. Keep this page open; refreshing clears unsubmitted inputs.'}</small></div>{!done && <div className="rfp-row">{step > 0 && <button type="button" className="rfp-button" disabled={busy} onClick={() => move(step - 1)}>← Back</button>}{(!closed || step<3) && <button form="vendor-proposal" type="submit" className="rfp-button primary" disabled={busy}>{busy ? 'Submitting proposal…' : step === 3 ? 'Submit proposal →' : 'Continue →'}</button>}</div>}</footer>
  </div>;
}
