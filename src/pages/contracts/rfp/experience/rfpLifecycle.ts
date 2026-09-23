import api from '@/services/api';
import axios from 'axios';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_KEY;
export async function rfpRpc(name:string,args:Record<string,unknown>,publicLink=false) {
 if(!url||!key)throw new Error('Request service is not configured.');
 const endpoint=url+'/rest/v1/rpc/'+name;
 const response=publicLink?await axios.post(endpoint,args,{headers:{apikey:key,Authorization:'Bearer '+key}}):await api.post(endpoint,args,{headers:{apikey:key}});
 if(response.data?.success===false)throw new Error(response.data.error||'Request failed');
 return response.data;
}
export const rfpError=(e:any)=>e?.response?.data?.message||e?.response?.data?.error?.message||e?.message||'Request failed';

