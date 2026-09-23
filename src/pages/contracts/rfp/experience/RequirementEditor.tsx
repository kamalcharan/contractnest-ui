import React from 'react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { REQUIREMENT_TYPES, type Requirement, type Coverage } from './model';

export default function RequirementEditor({requirement:b,coverage,onChange,onRemove}:{requirement:Requirement;coverage:Coverage[];onChange:(patch:Partial<Requirement>)=>void;onRemove:()=>void}) {
 const recurring=b.type==='service'||b.type==='session';
 return <article className="rfp-unit" aria-label={`${REQUIREMENT_TYPES[b.type]} requirement`}>
  <div className="rfp-row between"><span className="rfp-tag">{REQUIREMENT_TYPES[b.type]}</span><button type="button" className="rfp-button" onClick={onRemove}>Remove requirement</button></div>
  <label className="rfp-field">Requirement name *<input value={b.name} onChange={e=>onChange({name:e.target.value})} placeholder="Describe what vendors should propose"/></label>
  <RichTextEditor label="Your requirements" value={b.description} onChange={description=>onChange({description})} toolbarButtons={['bold','italic','underline','bulletList','orderedList','table']} minHeight={110}/>
  <fieldset style={{border:0,padding:0,margin:'16px 0'}}><legend>Applies to *</legend><div className="rfp-row wrap">{coverage.map(c=><label key={c.id} className="rfp-check"><input type="checkbox" checked={b.coverageIds.includes(c.id)} onChange={e=>onChange({coverageIds:e.target.checked?[...b.coverageIds,c.id]:b.coverageIds.filter(id=>id!==c.id)})}/>{c.name} × {c.quantity}</label>)}</div>{!coverage.length&&<p>Add covered items above, then link this requirement.</p>}</fieldset>
  {b.type!=='text'&&<div className="rfp-fields"><label className="rfp-field">{b.type==='spare'?'Quantity *':b.type==='session'?'Number of sessions *':'Number of visits *'}<input type="number" min="1" step="1" disabled={b.unlimited} value={Number.isFinite(b.quantity)?b.quantity:''} onChange={e=>onChange({quantity:e.target.value===''?NaN:Number(e.target.value)})}/></label>{recurring&&<label className="rfp-check"><input type="checkbox" checked={b.unlimited} onChange={e=>onChange({unlimited:e.target.checked})}/>On demand</label>}</div>}
  {recurring&&<label className="rfp-field">Repeat every · days (optional)<input type="number" min="1" step="1" value={b.serviceCycleDays??''} onChange={e=>onChange({serviceCycleDays:e.target.value===''?undefined:Number(e.target.value)})}/><small>Leave blank when you are not specifying an interval.</small></label>}
  {b.type!=='text'&&<p>Quantity covers the selected items together, not each item separately.</p>}
 </article>;
}
