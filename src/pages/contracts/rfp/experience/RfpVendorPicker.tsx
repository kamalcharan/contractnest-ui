import React, { useEffect, useRef, useState } from 'react';
import BuyerSelectionStep from '@/components/contracts/ContractWizard/steps/BuyerSelectionStep';
import contactService from '@/services/contactService';
import { InlineLoader } from '@/components/common/loaders/UnifiedLoader';
import { useVaNiToast } from '@/components/common/toast/VaNiToast';
import { recipientChannels, validRecipientChannel } from './recipientChannels';
import type { Invite } from './model';

export default function RfpVendorPicker({invites,onChange,tenantId,onBusyChange}:{invites:Invite[];onChange:(items:Invite[])=>void;tenantId:string;onBusyChange?:(busy:boolean)=>void}) {
 const [loading,setLoading]=useState(false),[error,setError]=useState('');
 const pending=useRef(false),alive=useRef(true);
 const {addToast}=useVaNiToast();
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 // Hydrate mobile-only recipients saved before mobile was retained in RFP drafts.
 useEffect(()=>{if(invites.some(v=>v.contactId&&!validRecipientChannel(v)))void select(invites.flatMap(v=>v.contactId?[v.contactId]:[]));},[]);
 async function select(ids:string[]) {
  if(pending.current)return;
  pending.current=true;onBusyChange?.(true);setLoading(true);setError('');
  try {
   const selected=await Promise.all(ids.map(async id=>{
    const existing=invites.find(v=>v.contactId===id);

    const contact=await contactService.getContact(id);
    if(contact.tenant_id!==tenantId||!contact.classifications.includes('vendor')||contact.status!=='active')throw new Error('Select an active vendor from this workspace.');
    const name=contact.displayName || contact.company_name || contact.name;
    if(!name?.trim())throw new Error('This vendor has no display name. Update the contact before selecting it.');
    const channels=recipientChannels(contact);
    return {id:existing?.id||crypto.randomUUID(),contactId:id,name,...channels};
   }));
   if(!alive.current)return;
   // Preserve old request-only recipients visibly; do not silently delete saved data.
   onChange([...invites.filter(v=>!v.contactId),...selected]);
  } catch(e:any) {
   if(alive.current){const message=e.message||'Could not load vendor details. Please retry.';setError(message);addToast({type:'error',title:'Vendor not selected',message});}
  } finally {pending.current=false;if(alive.current){setLoading(false);onBusyChange?.(false);}}
 }
 return <>
  <button type="button" className="rfp-button" disabled={loading} onClick={()=>void select(invites.flatMap(v=>v.contactId?[v.contactId]:[]))}>Refresh vendor details</button>
  {error&&<p className="rfp-error" role="alert">{error}</p>}
  {loading&&<InlineLoader text="Loading vendor details"/>}
  <fieldset disabled={loading} style={{border:0,padding:0,minWidth:0}} aria-busy={loading}>
   <BuyerSelectionStep contractType="vendor" multiSelect rfpDraftMode selectedBuyerId={null} selectedBuyerName="" onSelectBuyer={()=>{}}
    selectedVendorIds={invites.flatMap(v=>v.contactId?[v.contactId]:[])} selectedVendorNames={invites.filter(v=>v.contactId).map(v=>v.name)} onVendorsChange={ids=>void select(ids)}/>
   {invites.map(v=><div className="rfp-unit rfp-row between" key={v.id}><div><strong>{v.name}</strong><p>{[v.email,v.mobile ? [v.mobileCountryCode,v.mobile].filter(Boolean).join(' ') : ''].filter(Boolean).join(' · ') || 'No contact channel saved.'}{!validRecipientChannel(v)&&<small>Add a valid email or mobile number in Contacts, then refresh vendor details.</small>}</p>{!v.contactId&&<small>Previously saved prospect — replace with a saved vendor or remove.</small>}</div><button type="button" className="rfp-button" onClick={()=>onChange(invites.filter(x=>x.id!==v.id))}>Remove</button></div>)}
  </fieldset>
 </>;
}
