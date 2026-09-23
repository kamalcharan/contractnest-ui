import React,{useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {InlineLoader} from '@/components/common/loaders/UnifiedLoader';
import {rfpRpc,rfpError} from './rfpLifecycle';
import RfpDocument from './RfpDocument';
import type {RfpDraft} from './model';
export default function RfpConfirmation({draft,record}:{draft:RfpDraft;record:any}) {
 const [view,setView]=useState(false);
 const q=useQuery({queryKey:['rfp-receipt',draft.tenantId,draft.isLive,record.id],queryFn:()=>rfpRpc('rfp_delivery_receipt',{p_id:record.id,p_tenant:draft.tenantId,p_live:draft.isLive}),refetchInterval:15000});
 return <main className="rfp-buyer"><div style={{maxWidth:1000,margin:'auto'}}>
 <section className="rfp-paper"><small>REQUEST CONFIRMATION</small><h1>Your request is finalized.</h1><h2>{draft.title}</h2>
 <div className="rfp-row"><span className="rfp-tag">{record.rfq_number}</span><span className="rfp-tag">{q.data?.status||record.status}</span><span className="rfp-tag">{q.data?.cnak||record.global_access_id}</span></div>
 <p>The request is available through each vendor’s private link. Message delivery is tracked separately below.</p>
 <div className="rfp-row"><button className="rfp-button primary" onClick={()=>setView(!view)}>{view?'Hide document':'View request'}</button><button className="rfp-button" onClick={()=>{setView(true);setTimeout(()=>window.print(),100);}}>Print / Save PDF</button><Link className="rfp-button" to="/requests">Back to Requests</Link></div></section>
 <section className="rfp-paper"><div className="rfp-row between"><h2>Vendor invitations</h2><button className="rfp-button" onClick={()=>void q.refetch()}>Refresh delivery status</button></div>
 {q.isLoading&&<InlineLoader text="Checking delivery"/>}{q.isError&&<p role="alert">{rfpError(q.error)}</p>}
 {q.data?.disabledChannels?.length>0&&<p role="status">Disabled in this workspace: {q.data.disabledChannels.join(', ')}. No messages are sent on disabled channels.</p>}
 {q.data?.deliveries?.map((x:any)=><div key={x.id} className="rfp-unit rfp-row between"><strong>{x.name}</strong><span>{x.channel==='whatsapp'?'WhatsApp':'Email'}</span><span className="rfp-tag">{['created','scheduled','pending'].includes(x.status)?'Queued':x.status}</span>{x.error&&<p role="alert">{x.error}</p>}</div>)}
 {q.data?.deliveries?.length===0&&<p>No invitation delivery records were found. This is not a delivery confirmation.</p>}
 <p>Queued or sent does not mean delivered. Disabled channels and provider errors are not reported as successful delivery.</p></section>
 {view&&<RfpDocument draft={draft} number={record.rfq_number} status={q.data?.status||record.status}/>}</div></main>;
}
