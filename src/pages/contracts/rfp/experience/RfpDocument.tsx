import React from 'react';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import { commitmentSummary, type RfpDraft } from './model';
export default function RfpDocument({draft:d,number,status='Draft'}:{draft:RfpDraft;number?:string;status?:string}) {
 return <article className="rfp-document rfp-print-document"><header><small>REQUEST FOR PROPOSALS · {status}</small><h2>{d.title}</h2><p>{number}</p></header>
 <SafeHtml html={d.brief}/><h3>Scope & intended agreement</h3><p>{d.nomenclature?.label||'Agreement label not specified'} · {d.location}</p><p>Preferred start: {d.start} · {d.months} months</p>
 {d.coverage.map(c=><section key={c.id}><strong>{c.name} × {c.quantity}</strong><p>{c.location}</p></section>)}
 <h3>Requested work</h3>{d.blocks.map(b=><section key={b.id}><strong>{b.name}</strong><SafeHtml html={b.description}/><p>{commitmentSummary(b,d)}</p></section>)}
 <h3>Questions to answer</h3>{d.questions.length?<ol>{d.questions.map(q=><li key={q.id}>{q.text}{q.required?' — required':''}{q.eligibility?' — eligibility condition':''}</li>)}</ol>:<p>No additional questionnaire.</p>}
 <h3>Evaluation</h3><p>Approach & delivery {d.weights[0]}% · Experience & capability {d.weights[1]}% · Commercial value {d.weights[2]}%</p>
 <h3>Terms & participation</h3><SafeHtml html={d.terms}/><p>Quote currency: {d.currency}. Vendors propose their own billing terms.</p>
 {d.shareBudget&&d.budget&&<p>Indicative budget: {d.currency} {d.budget}</p>}
 <p>{d.security==='deposit'?'Bid security / EMD: '+d.currency+' '+d.securityAmount:d.security==='declaration'?'Bid declaration required':'No bid security required'}</p>
 {d.security==='deposit'&&<><SafeHtml html={d.releaseTerms}/>{d.exemption&&<p>Exemption requests with evidence are allowed.</p>}</>}
 {d.performance&&<p>Performance security after award: {d.performancePct}%.</p>}
 <h3>Response deadline</h3><p>{d.deadline} · {d.deadlineTime} IST (Asia/Kolkata)</p><p>Clarifications by {d.questionsBy}.</p>
 <footer><p>This request is an invitation to propose, not a contract award.</p></footer></article>;
}

