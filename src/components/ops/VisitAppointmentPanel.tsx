import React, {useState} from 'react';
import {CalendarCheck,MessageCircle,Copy,Mail,X} from 'lucide-react';
import {useInvoiceTheme} from '@/pages/invoices/ui';
import {useScheduleVisit,useAskVisitSlot,type AskVisitSlotResult} from '@/hooks/queries/useCollectionsQueries';
import {vaniToast} from '@/components/common/toast/VaNiToast';

interface Props {
  eventId:string;
  initialAt:string;
  scheduledAt?:string|null;
  hasSlot:boolean;
  initialMode:'schedule'|'ask';
  askChannels?:Array<'email'|'whatsapp'>;
  locked?:boolean;
  onClose:()=>void;
  onScheduled?:(at:string)=>void;
  onBusyChange?:(busy:boolean)=>void;
}

// Extracted from JobCard's Schedule / Ask customer panels. Contract Tasks and
// every Time Board JobCard now render this same control and use the same tools.
export default function VisitAppointmentPanel({eventId,initialAt,scheduledAt,hasSlot,initialMode,askChannels=[],locked,onClose,onScheduled,onBusyChange}:Props){
  const {colors,sub}=useInvoiceTheme();
  const brand=colors.brand.primary;
  const schedule=useScheduleVisit(),ask=useAskVisitSlot();
  const [at,setAt]=useState(initialAt),[agreed,setAgreed]=useState(false);
  const [mode,setMode]=useState(initialMode),[savedAt,setSavedAt]=useState(scheduledAt||''),[slotSaved,setSlotSaved]=useState(hasSlot);
  const [working,setWorking]=useState(false),[result,setResult]=useState<AskVisitSlotResult|null>(null),[shareDone,setShareDone]=useState('');
  const busy=working||!!locked;
  const run=async(work:()=>Promise<void>)=>{if(busy)return;setWorking(true);onBusyChange?.(true);try{await work();}catch{/* Existing mutation hooks display complete error toasts. */}finally{setWorking(false);onBusyChange?.(false);}};
  const buttonStyle={border:`1px solid ${brand}45`,color:brand,backgroundColor:colors.utility.secondaryBackground};
  const Btn=({children,onClick,primary=false,disabled=false}:{children:React.ReactNode;onClick:()=>void;primary?:boolean;disabled?:boolean})=><button type="button" disabled={busy||disabled} onClick={onClick} className="inline-flex items-center justify-center gap-1.5 rounded-full font-bold px-3.5 min-h-[40px] text-xs disabled:opacity-50 disabled:cursor-not-allowed" style={primary?{backgroundColor:brand,color:'#fff'}:buttonStyle}>{children}</button>;
  const save=()=>run(async()=>{
    if(!at||Number.isNaN(new Date(at).getTime())){vaniToast.error('Pick a valid date and time first');return;}
    const response=await schedule.mutateAsync({eventId,scheduledAt:new Date(at).toISOString(),confirmed:agreed});
    setSavedAt(response.scheduled_at);setSlotSaved(true);setResult(null);setShareDone('');onScheduled?.(response.scheduled_at);
    if(agreed)onClose();else setMode('ask');
  });
  const share=(how:'wa'|'copy')=>run(async()=>{
    const response=await ask.mutateAsync({eventId,channel:'share'});setResult(response);
    const text=response.message?.body||response.link;
    if(how==='wa'){window.open(`https://wa.me/${(response.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');setShareDone('WhatsApp opened — send the message there.');}
    else{try{await navigator.clipboard.writeText(text);setShareDone('Message copied.');}catch{setShareDone('Clipboard unavailable — use the link below.');vaniToast.error('Could not copy automatically',{message:'The confirmation link is shown below.'});}}
  });
  const send=(channel:'email'|'whatsapp')=>run(async()=>{await ask.mutateAsync({eventId,channel});onClose();});
  const canAsk=slotSaved&&!!savedAt&&new Date(savedAt).getTime()>Date.now();
  return <div className="mt-2.5 rounded-xl border p-3 space-y-3" style={{borderColor:`${colors.utility.primaryText}14`,backgroundColor:colors.utility.primaryBackground}}>
    <div className="flex flex-wrap gap-2"><Btn onClick={()=>setMode('schedule')} primary={mode==='schedule'}><CalendarCheck size={13}/>Schedule</Btn><Btn onClick={()=>setMode('ask')} primary={mode==='ask'}><MessageCircle size={13}/>Ask customer</Btn><Btn onClick={onClose}><X size={13}/>Close</Btn></div>
    {mode==='schedule'?<><label className="block text-sm" style={sub}>Visit slot<input aria-label="Visit slot" type="datetime-local" value={at} disabled={busy} onChange={e=>setAt(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-2" style={{borderColor:`${brand}60`,backgroundColor:colors.utility.primaryBackground,color:colors.utility.primaryText}}/></label><label className="flex items-center gap-2 text-sm" style={sub}><input type="checkbox" disabled={busy} checked={agreed} onChange={e=>setAgreed(e.target.checked)}/>Agreed with the customer</label><p className="text-xs" style={sub}>Saving a proposed slot does not send a request. Use Ask customer next. No service ticket is created.</p><Btn onClick={save} primary>{working?'Saving…':agreed?'Confirm slot':'Save proposed slot'}</Btn></>:<>
      <p className="text-sm" style={sub}>{canAsk?`Ask the customer to confirm ${new Date(savedAt).toLocaleString('en-IN')} or suggest another time.`:'Choose and save a future slot before asking the customer. The old due date will not be sent.'}</p>
      {canAsk?<><div className="flex flex-wrap gap-2"><Btn onClick={()=>share('wa')} primary><MessageCircle size={13}/>Share on WhatsApp</Btn><Btn onClick={()=>share('copy')}><Copy size={13}/>Copy message</Btn>{askChannels.includes('whatsapp')&&<Btn onClick={()=>send('whatsapp')}><MessageCircle size={13}/>Send on WhatsApp</Btn>}{askChannels.includes('email')&&<Btn onClick={()=>send('email')}><Mail size={13}/>Send by email</Btn>}</div><p className="text-xs" style={sub}>Share opens your WhatsApp. Send uses ContractNest’s configured business channel; queued is not confirmed delivery.</p></>:<Btn onClick={()=>setMode('schedule')} primary>Choose a slot</Btn>}
      {result&&<p className="text-xs break-all" style={sub}>{shareDone} <a href={result.link} target="_blank" rel="noreferrer" style={{color:brand}}>Open customer confirmation link</a></p>}
    </>}
  </div>;
}
