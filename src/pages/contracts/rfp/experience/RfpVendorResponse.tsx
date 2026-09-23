import React,{useState} from 'react';
import type {RfpDraft} from './model';
import type {QuoteMe} from '@/pages/quote/useVendorQuote';
import {rfpRpc,rfpError} from './rfpLifecycle';
import RfpDocument from './RfpDocument';
import './rfp-buyer.css';
export default function RfpVendorResponse({draft,number,status,cnak,secret,me}:{draft:RfpDraft;number:string;status:string;cnak:string;secret:string;me:QuoteMe}) {
 const [amount,setAmount]=useState(String(me.quoted_amount||''));
 const [billing,setBilling]=useState(''),[approach,setApproach]=useState(''),[answers,setAnswers]=useState<Record<string,string>>({});
 const [accepted,setAccepted]=useState(false),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 const closed=!['sent','quotes_received'].includes(status)||Date.parse(draft.deadline+'T'+draft.deadlineTime+':00+05:30')<=Date.now();
 async function submit(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError('');
 try{await rfpRpc('rfp_submit_response',{p_cnak:cnak,p_secret:secret,p_response:{amount:Number(amount),billingTerms:billing,approach,answers,acceptTerms:accepted}},true);setDone(true);}catch(e){setError(rfpError(e));}finally{setBusy(false);}}
 return <main className="rfp-buyer"><div style={{maxWidth:900,margin:'auto'}}>
 <header className="rfp-paper"><small>PRIVATE VENDOR COPY</small><h1>Review the request. Propose your approach.</h1><p>For {me.vendor_name}. Your response is private to the requesting business.</p><button className="rfp-button" onClick={()=>window.print()}>Print / Save PDF</button></header>
 <RfpDocument draft={draft} number={number} status={status}/>
 <section className="rfp-paper"><h2>Your proposal</h2>{done?<div role="status"><h3>Proposal submitted</h3><p>Your pricing, billing terms and answers have been saved for the buyer.</p></div>:closed?<p>This request is closed for responses.</p>:<form onSubmit={submit}>
 {me.response_status==='quoted'&&<p>You have already submitted a proposal. Submitting again replaces your previous response.</p>}
 <fieldset disabled={busy} style={{border:0,padding:0}}><label className="rfp-field">Your total price ({draft.currency}) *<input required type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label>
 <label className="rfp-field">Your proposed approach<textarea required value={approach} onChange={e=>setApproach(e.target.value)}/></label>
 <label className="rfp-field">Your proposed billing terms *<textarea required placeholder="Describe your advance, milestones or payment schedule." value={billing} onChange={e=>setBilling(e.target.value)}/></label>
 {draft.questions.map(q=><label className="rfp-field" key={q.id}>{q.text}{q.required?' *':''}{q.eligibility&&<small>Eligibility condition — answer honestly; the buyer will assess eligibility.</small>}
 {q.type==='yesno'?<select required={q.required} value={answers[q.id]||''} onChange={e=>setAnswers({...answers,[q.id]:e.target.value})}><option value="">Choose an answer</option><option>Yes</option><option>No</option></select>:q.type==='text'?<textarea required={q.required} value={answers[q.id]||''} onChange={e=>setAnswers({...answers,[q.id]:e.target.value})}/>:<input required={q.required} type={q.type==='number'?'number':'url'} step="any" placeholder={q.type==='file'?'https:// — link to your supporting document':undefined} value={answers[q.id]||''} onChange={e=>setAnswers({...answers,[q.id]:e.target.value})}/>}
 {q.type==='file'&&<small>Provide a secure document link accessible to the buyer. This form does not upload files.</small>}</label>)}
 <label className="rfp-check"><input required type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>I have reviewed the request and its participation terms, including any bid or performance security requirements.</label>
 {error&&<p className="rfp-error" role="alert">{error}</p>}<button className="rfp-button primary" disabled={busy}>{busy?'Submitting proposal…':'Submit proposal'}</button></fieldset></form>}</section></div></main>;
}

