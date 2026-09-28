import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose} from '@/components/ui/dialog';
import {useAssignVisit,useScheduleVisit,useConfirmVisitSlot,useStartVisit,useCompleteVisit,useAskVisitSlot} from '@/hooks/queries/useCollectionsQueries';
import JobCard, {type JobCardActions} from '@/components/ops/JobCard';
import HistoryDrawer from '@/components/ops/HistoryDrawer';
import ServiceWorkspaceEntry from './ServiceWorkspaceEntry';
import {useTheme} from '@/contexts/ThemeContext';
import {useCollectionsBoard} from '@/hooks/queries/useCollectionsQueries';

// Reuse the full Time Board service card, not a second set of service controls.
export default function ContractAppointmentDialog({eventId,name,scheduledAt,hasSlot,onClose}:{eventId:string;name:string;scheduledAt?:string;hasSlot:boolean;onClose:()=>void}){
 const {isDarkMode,currentTheme}=useTheme(),colors=isDarkMode?currentTheme.darkMode.colors:currentTheme.colors;
 const board=useCollectionsBoard({perspective:'revenue',lanes:['services'],q:name,limit:200,horizon:365});
 const card=board.data?.buckets.flatMap(b=>b.cards).find(c=>c.id===eventId);
 const navigate=useNavigate();
 const assign=useAssignVisit(),schedule=useScheduleVisit(),confirm=useConfirmVisitSlot(),start=useStartVisit(),complete=useCompleteVisit(),ask=useAskVisitSlot();
 const [busy,setBusy]=useState(false),[history,setHistory]=useState(false);
 const [work,setWork]=useState<{contractId:string;eventId:string}|null>(null);
 const run=async(fn:()=>Promise<unknown>)=>{setBusy(true);try{return await fn();}finally{setBusy(false);}};
 const fire=(fn:()=>Promise<unknown>)=>{void run(fn).catch(()=>{/* Mutation hook displays the error toast. */});};
 const unused=()=>{};
 const actions:JobCardActions={
  onNudge:unused,onCall:unused,onAssign:unused,onPause:unused,onResume:unused,onConfirm:unused,onReview:unused,onViewInvoice:unused,onSendInvoice:unused,
  onOpen:c=>{onClose();navigate(`/contracts/${c.contract_id}`);},onHistory:()=>setHistory(true),
  onAssignVisit:(c,userId)=>run(()=>assign.mutateAsync({eventId:c.id,assignTo:userId})),
  onSchedule:(c,scheduledAt,confirmed)=>run(()=>schedule.mutateAsync({eventId:c.id,scheduledAt,confirmed})),
  onConfirmSlot:c=>fire(()=>confirm.mutateAsync({eventId:c.id})),
  onStartVisit:c=>setWork({contractId:c.contract_id,eventId:c.id}),
  onCompleteVisit:c=>setWork({contractId:c.contract_id,eventId:c.id}),
  onAskCustomer:(c,channel)=>ask.mutateAsync({eventId:c.id,channel}),
 };
 const d=scheduledAt&&new Date(scheduledAt).getTime()>Date.now()?new Date(scheduledAt):new Date();
 if(!scheduledAt||new Date(scheduledAt).getTime()<=Date.now()){d.setDate(d.getDate()+1);d.setHours(10,0,0,0);}
 const pad=(n:number)=>String(n).padStart(2,'0');
 const initialAt=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
 return <>
 <Dialog open={!history&&!work} onOpenChange={open=>{if(!open)onClose();}}>
 <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-xl" style={{backgroundColor:colors.utility.primaryBackground,color:colors.utility.primaryText}}>
 <DialogTitle className="pr-8">Manage service</DialogTitle><DialogDescription className="break-words">{name}</DialogDescription>
 {board.isPending?<p role="status">Loading service actions…</p>:board.isError?<div role="alert"><p>Could not load this service. Nothing has changed.</p><button type="button" className="mt-3 border rounded-lg px-4 py-2" onClick={()=>board.refetch()}>Try again</button></div>:card?<JobCard card={card} team={board.data?.team||[]} askChannels={board.data?.ask_channels} busy={busy} actions={actions} defaultSlotAt={initialAt}/>:<p role="status">This service is not in the current Time Board results. Close this view to review its latest status in Tasks.</p>}
 <DialogFooter><DialogClose asChild><button type="button" className="border rounded-lg px-5 py-2.5 font-semibold">Cancel / close</button></DialogClose></DialogFooter>
 </DialogContent></Dialog>
 {history&&card&&<HistoryDrawer contractId={card.contract_id} title={name} subtitle={card.contract_number} onClose={()=>setHistory(false)} onOpenContract={()=>{onClose();navigate(`/contracts/${card.contract_id}`);}}/>}
 {work&&<ServiceWorkspaceEntry {...work} onClose={()=>setWork(null)}/>}
 </>;
}
