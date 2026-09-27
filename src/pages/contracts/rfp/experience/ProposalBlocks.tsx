import React, { useState } from 'react';
import CommitmentEditor from '@/components/contracts/ContractWizard/experience/CommitmentEditor';
import type { ConfigurableBlock } from '@/components/catalog-studio';
import SafeHtml from '@/components/catalog-studio/SafeHtml';
import type { RfpDraft } from './model';
import '@/components/contracts/ContractWizard/experience/services.css';

export type ProposalBlock = ConfigurableBlock & { requirementId?: string };
export const proposalTotal = (blocks: ProposalBlock[]) => blocks.reduce((sum,b) => sum + (b.categoryId === 'text' || b.config?.complimentary ? 0 : Math.round((b.config?.customPrice ?? b.price) * (b.unlimited ? 1 : b.quantity)*100)),0)/100;
export function proposalBlockErrors(blocks: ProposalBlock[], draft: RfpDraft) {
 const errors:string[]=[];
 if(!blocks.length)errors.push('Add the commitments you propose to deliver.');
 for(const b of blocks){
  if(!b.name.trim())errors.push('Name every commitment.');
  if(!Number.isInteger(b.quantity)||b.quantity<1)errors.push(`${b.name}: enter a positive whole quantity.`);
  if(b.categoryId!=='text'&&(!Number.isFinite(b.config?.customPrice??b.price)||(b.config?.customPrice??b.price)<0||(!(b.config?.customPrice??b.price)&&!b.config?.complimentary)))errors.push(`${b.name}: enter a price or mark it complimentary.`);
  if(b.requirementId&&!draft.blocks.some(r=>r.id===b.requirementId))errors.push(`${b.name}: choose a current requirement.`);
  if(draft.coverage.length&&!draft.coverage.some(c=>c.id===b.coverageTypeId))errors.push(`${b.name}: select the coverage it applies to.`);
 }
 for(const r of draft.blocks)if(!blocks.some(b=>b.requirementId===r.id))errors.push(`Respond to “${r.name}” with a commitment, or a Text block explaining the exception.`);
 return errors;
}
const colors={utility:{primaryText:'#243b35',secondaryText:'#667971'},brand:{primary:'#285f48'},semantic:{error:'#b42318',success:'#285f48',warning:'#9b6500'}};
export default function ProposalBlocks({draft,blocks,onChange,disabled=false,readOnly=false,onEditing}: {draft:RfpDraft;blocks:ProposalBlock[];onChange:(v:ProposalBlock[])=>void;disabled?:boolean;readOnly?:boolean;onEditing?:(v:boolean)=>void}){
 const [editing,setEditing]=useState<string|null>(null);
 function edit(id:string|null){setEditing(id);onEditing?.(!!id);}
 function add(type:string){const b:ProposalBlock={id:'proposal-'+crypto.randomUUID(),name:'',description:'',icon:'FileText',categoryId:type==='session'?'service':type,categoryName:{service:'Service',spare:'Spare Parts',session:'Group Session',text:'Text'}[type]!,categoryColor:'#285f48',isFlyBy:true,flyByType:type==='session'?'service':type,quantity:1,unlimited:false,price:0,totalPrice:0,currency:draft.currency,cycle:'prepaid',config:{showDescription:true,...(type==='session'?{audience:'group' as const}:{})}};onChange([...blocks,b]);edit(b.id);}
 return <div className="sv-page" style={{'--ag-bg':'#f7f8f5','--ag-panel':'white','--ag-line':'#dce3da','--ag-text':'#243b35','--ag-muted':'#667971','--ag-brand':'#285f48','--ag-onbrand':'white','--ag-error':'#b42318'} as React.CSSProperties}>
 {!readOnly&&<><p>Build your offer with the same commitment controls used in an agreement. These entries stay in this proposal; nothing is added to Catalog Studio.</p><div className="rfp-row">{['service','spare','session','text'].map(t=><button type="button" className="rfp-button" disabled={disabled||!!editing} key={t} onClick={()=>add(t)}>+ {{service:'Service',spare:'Spare Parts',session:'Group Session',text:'Text'}[t]}</button>)}</div></>}
 {blocks.map(b=><article className="rfp-unit" key={b.id}><span className="rfp-tag">{b.categoryName}</span><h3>{b.name||'New commitment'}</h3>
 {!readOnly&&<fieldset disabled={disabled||!!editing}><label className="rfp-field">Responds to<select value={b.requirementId||''} onChange={e=>onChange(blocks.map(x=>x.id===b.id?{...x,requirementId:e.target.value}:x))}><option value="">Additional proposal item</option>{draft.blocks.map(r=><option key={r.id} value={r.id}>{r.name} · requested {r.quantity}{r.serviceCycleDays?` · every ${r.serviceCycleDays} days`:''}</option>)}</select></label><label className="rfp-field">Covers<select value={b.coverageTypeId||''} onChange={e=>onChange(blocks.map(x=>x.id===b.id?{...x,coverageTypeId:e.target.value,coverageTypeName:draft.coverage.find(c=>c.id===e.target.value)?.name}:x))}><option value="">{draft.coverage.length?'Select coverage':'Whole agreement'}</option>{draft.coverage.map(c=><option key={c.id} value={c.id}>{c.name} × {c.quantity}</option>)}</select></label></fieldset>}
 {editing===b.id?<CommitmentEditor key={b.id} instance={b} colors={colors} isDarkMode={false} currency={draft.currency} checked expanded flyBy priced={b.categoryId!=='text'} mode="contract" durationMonths={draft.months} coverageUnitCount={draft.coverage.find(c=>c.id===b.coverageTypeId)?.quantity} onToggle={()=>{}} onToggleExpand={()=>edit(null)} onUpdate={patch=>onChange(blocks.map(x=>x.id===b.id?{...x,...patch,totalPrice:proposalTotal([{...x,...patch}])}:x))}/>:<><SafeHtml html={b.description}/><p>{b.coverageTypeName||'Whole agreement'} · {b.quantity} {b.config?.audience==='group'?'sessions':'units / occurrences'}{b.serviceCycleDays?` · every ${b.serviceCycleDays} days`:''} · {b.cycle}</p><strong>{b.categoryId==='text'?'Agreement content':`${draft.currency} ${proposalTotal([b]).toLocaleString()}`}</strong>{!readOnly&&<div className="rfp-row"><button type="button" className="rfp-button" disabled={disabled||!!editing} onClick={()=>edit(b.id)}>Edit commitment</button><button type="button" className="rfp-button" disabled={disabled||!!editing} onClick={()=>onChange(blocks.filter(x=>x.id!==b.id))}>Remove</button></div>}</>}
 </article>)}
 </div>;
}
