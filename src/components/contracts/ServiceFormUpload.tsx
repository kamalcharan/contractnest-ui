import React from 'react';
import {useUploadEvidence,useEvidenceUrl,useContractEvidence} from '@/hooks/queries/useEvidenceQueries';

// Reuse the evidence broker and bind files to the saved equipment outcome.
export default function ServiceFormUpload({contractId,eventId,submissionId,readOnly}:{contractId:string;eventId:string;submissionId?:string;readOnly:boolean}) {
  const upload=useUploadEvidence(),url=useEvidenceUrl(),query=useContractEvidence(contractId);
  const files=query.data?.evidence||[];
  const selectFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; e.target.value='';
    if(!file || !submissionId)return;
    try { await upload.mutateAsync({file,target:{scope:'contract',contractId,eventId,formSubmissionId:submissionId}}); }
    catch { /* Existing broker hook reports errors as toasts. */ }
  };
  return <div className="w-full text-sm space-y-2">
    <p>Supporting photo or document required.</p>
    {files.filter(f=>submissionId&&f.form_submission_id===submissionId&&f.event_id===eventId&&f.confirmed_at).map(f=><button key={f.evidence_id} className="block border rounded-lg px-3 py-2" onClick={async()=>{
      try {const result=await url.mutateAsync(f.evidence_id);window.open(result.url,'_blank','noopener,noreferrer');}catch{/* Existing hook reports errors. */}
    }}>{f.file_name}</button>)}
    {!readOnly && (submissionId ? <label className="inline-block border rounded-lg px-4 py-2 font-semibold">
      {upload.isPending?'Uploading…':'Upload supporting evidence'}
      <input aria-label="Upload supporting evidence" className="block mt-2 max-w-full" type="file" disabled={upload.isPending} onChange={selectFile}/>
    </label> : <p>Save the equipment outcome first, then attach its evidence.</p>)}
  </div>;
}
