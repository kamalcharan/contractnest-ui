import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {rememberDestination} from '@/utils/navigation/entry';
import {rfpRpc,rfpError} from './rfpLifecycle';
import {InlineLoader} from '@/components/common/loaders/UnifiedLoader';
export default function VendorNextSteps({cnak,secret,awarded,buyerPreparing=false}:{cnak:string;secret:string;awarded:boolean;buyerPreparing?:boolean}){
 const {isAuthenticated,currentTenant,isLive,perspective}=useAuth();
 const navigate=useNavigate(); const [busy,setBusy]=useState(false),[error,setError]=useState('');
 function signIn(register:boolean){rememberDestination(`/quote/${encodeURIComponent(cnak)}/${encodeURIComponent(secret)}`);navigate(register?'/register':'/login');}
 async function prepare(){if(busy)return;setBusy(true);setError('');try{const result=await rfpRpc('rfp_vendor_prepare',{p_cnak:cnak,p_secret:secret,p_tenant:currentTenant?.id,p_live:isLive});const saved=result.data??result;if(!saved.id)throw Error('Contract draft was not confirmed.');navigate(`/contracts/experience/create?relationship=client&draft=${encodeURIComponent(saved.id)}`);}catch(e){setError(rfpError(e));}finally{setBusy(false);}}
 if(awarded&&buyerPreparing)return <section className="rfp-paper"><h2>Your proposal has been selected.</h2><p>The buyer has already started the linked agreement. They will send it for your review; there is no need to create another draft.</p><p>Award alone does not activate a contract or confirm payment.</p></section>;
 return <section className="rfp-paper"><h2>{awarded?'Your proposal has been selected.':'Keep this opportunity connected.'}</h2><p>{awarded?'Prepare the agreement from your submitted commitments. The buyer reviews it before acceptance; award alone does not activate services or confirm payment.':'Create an account to manage this proposal and future agreements. Your response is already submitted; signup is optional.'}</p>
 {!isAuthenticated?<div className="rfp-row"><button type="button" className="rfp-button primary" onClick={()=>signIn(true)}>Set up your workspace</button><button type="button" className="rfp-button" onClick={()=>signIn(false)}>Already registered? Sign in</button></div>:awarded?<><p>Workspace: <strong>{currentTenant?.name||'Choose a workspace'}</strong>. Use the account with the verified email or mobile that received the invitation.</p>{perspective!=='revenue'?<p>Switch to Revenue to prepare an agreement as the service provider.</p>:<button type="button" disabled={busy||!currentTenant} className="rfp-button primary" onClick={()=>void prepare()}>{busy?'Opening agreement…':'Prepare agreement →'}</button>}</>:<p>Keep your private request link to return to this proposal.</p>}
 {busy&&<InlineLoader text="Opening your linked agreement"/>}{error&&<p className="rfp-error" role="alert">{error}</p>}</section>;
}
