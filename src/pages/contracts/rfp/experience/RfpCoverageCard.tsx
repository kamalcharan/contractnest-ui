import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MachineCard from '@/components/contracts/fleet/MachineCard';
import assetRegistryService from '@/services/assetRegistryService';
import type { TenantAsset } from '@/types/assetRegistry';
import type { ContractEquipmentDetail } from '@/types/contracts';
import { InlineLoader } from '@/components/common/loaders/UnifiedLoader';
import { ownRegistryItem } from './selectionPolicy';
import type { RfpDraft } from './model';

type Coverage = RfpDraft['coverage'][number];
export default function RfpCoverageCard({coverage,asset,colors,tenantId,live,onRemove}:{coverage:Coverage;asset?:TenantAsset;colors:any;tenantId:string;live:boolean;onRemove?:()=>void}) {
 const query=useQuery({queryKey:['rfp-coverage-detail',tenantId,live,coverage.registryId],enabled:!!coverage.registryId&&!asset,queryFn:()=>assetRegistryService.getAsset(coverage.registryId!)});
 const resolved=asset||query.data;
 const item=resolved&&ownRegistryItem(resolved,tenantId,live,coverage.family)?resolved:undefined;
 const detail:ContractEquipmentDetail={id:coverage.id,asset_registry_id:coverage.registryId,
  resource_type:coverage.family==='facility'?'entity':'equipment',category_id:coverage.resourceId,category_name:'',
  item_name:coverage.name,quantity:coverage.quantity,location:item?.location||coverage.location,
  make:item?.make,model:item?.model,serial_number:item?.serial_number,condition:item?.condition,criticality:item?.criticality};
 return <div className="rfp-unit">
  {!!coverage.registryId&&!asset&&query.isLoading&&<InlineLoader text="Loading registry details"/>}
  {(query.isError||(resolved&&!item))&&<p role="alert">Registry details could not be verified. <button type="button" onClick={()=>void query.refetch()}>Retry</button></p>}
  <MachineCard colors={colors} detail={detail} isPlaceholder={false} hasServiceData={false}
   canAttach={false} canRemove={!!onRemove} removing={false} onRemove={onRemove}
   pillLabel={coverage.registryId?'Registry linked':'Request only'} noVisitsNote={coverage.quantity+' unit'+(coverage.quantity===1?'':'s')+' covered by this request'}/>
 </div>;
}
