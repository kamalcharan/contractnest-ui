import React from 'react';
import {useServiceWorkspaceEvents as useContractEventsForContract} from '@/hooks/queries/useServiceExecution';
import ServiceExecutionDrawer from './ServiceExecutionDrawer';
export default function ServiceWorkspaceEntry({contractId,eventId,onClose}:{contractId:string;eventId:string;onClose:()=>void}) {
 const query=useContractEventsForContract(contractId,{per_page:200});
 const event=query.data?.items.find(e=>e.id===eventId);
 if(!event)return <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"><div className="bg-white text-slate-800 p-6 rounded-xl"><p>{query.isLoading?'Loading the selected service…':'This service could not be loaded. Open its contract to locate the task.'}</p><button onClick={onClose} className="border rounded-lg p-3 mt-4">Close</button></div></div>;
 return <ServiceExecutionDrawer isOpen contractId={contractId} date={event.scheduled_date} events={[event]} currency={event.currency||'INR'} onClose={onClose}/>;
}
