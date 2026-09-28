import React from 'react';
import { Download, X } from 'lucide-react';
import type { ContractDetail } from '@/types/contracts';
import type { FormSchemaField, FormSchemaSection, ServiceFormSubmission } from '@/hooks/queries/useFormTemplates';
import { buildServiceReportPdf } from './serviceReportPdf';
import { readingAssessment } from '@/utils/serviceForms';

interface Props {
  report: ServiceFormSubmission;
  sections: FormSchemaSection[];
  formName: string;
  contract?: ContractDetail;
  workspaceName?: string;
  workspaceId?: string;
  onClose: () => void;
}

const text = (value: unknown): string => value == null || value === '' ? 'Not recorded' : String(value);
const reportDate = (value?: string | null): string => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? text(value) : date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
};
const answer = (field: FormSchemaField, responses: Record<string, unknown>, bound: Record<string, unknown>): string => {
  const value = field.binding?.source && field.binding.source !== 'response' ? bound[field.id] : responses[field.id];
  if (value == null || value === '' || Array.isArray(value) && !value.length) return 'Not recorded';
  const optionLabel = (candidate: unknown) => field.options?.find(option => option.value === String(candidate))?.label || text(candidate);
  if (Array.isArray(value)) return value.map(optionLabel).join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  const measured = readingAssessment(field,value);
  return measured ? `${optionLabel(value)} - ${measured}` : optionLabel(value);
};

const ServiceReport: React.FC<Props> = ({ report, sections, formName, contract, workspaceName, workspaceId, onClose }) => {
  const asset = report.asset_metadata_snapshot || {};
  const service = report.service_context_snapshot || {};
  const bound = (service.bound_values || {}) as Record<string, unknown>;
  const parties = service.parties as Record<string, unknown> | undefined;
  const seller = parties ? parties.seller_name : contract?.seller_company || contract?.seller_name || (workspaceId === contract?.tenant_id ? workspaceName : undefined);
  const buyer = parties ? parties.buyer_name : contract?.buyer_company || contract?.buyer_name || (workspaceId === contract?.buyer_tenant_id ? workspaceName : undefined);
  const contractNumber = text(parties?.contract_number || contract?.contract_number);
  const details: Array<[string,string]> = [
    ['Service', formName], ['Contract', contractNumber],
    ['Visit', text(service.visit_number)], ['Scheduled', reportDate(service.scheduled_date as string | undefined)],
    ['Started', reportDate(service.started_at as string | undefined)], ['Technician', text(service.technician_name)],
    ['Equipment', text(asset.name)], ['Asset tag', text(asset.code)], ['Serial number', text(asset.serial_number)],
    ['Make / model', text([asset.make, asset.model].filter(Boolean).join(' '))], ['Location', text(asset.location)],
  ].filter(([label,value]) => !['Asset tag','Serial number','Make / model','Location'].includes(label) || value !== 'Not recorded');

  const downloadPdf = () => {
    const pdf = buildServiceReportPdf({
      reportId: report.id,
      contractNumber,
      serviceName: formName,
      status: report.status,
      recordedAt: reportDate(report.updated_at),
      seller: text(seller),
      buyer: text(buyer),
      partySource: parties ? 'Parties captured with submission' : 'Legacy: parties from current contract',
      summary: details.map(([label,value]) => ({ label, value })),
      sections: sections.map(section => ({ title: section.title, rows: section.fields.filter(field => field.type !== 'heading').map(field => ({ label: field.label, value: answer(field, report.responses || {}, bound) })) })),
    });
    pdf.save(`service-report-${contractNumber}-${report.id.slice(0, 8)}.pdf`);
  };

  return <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Service report">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <article className="relative w-full sm:max-w-3xl max-h-[94vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white text-slate-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-6 py-4">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Service evidence</p><h1 className="text-xl font-bold">Service report</h1></div>
        <div className="flex gap-2"><button type="button" onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white"><Download size={16}/>Download PDF</button><button type="button" onClick={onClose} className="rounded-lg border px-3 py-2" aria-label="Close report"><X size={17}/></button></div>
      </header>
      <div className="space-y-7 p-6 sm:p-8">
        <div className="rounded-xl bg-slate-100 p-4 text-sm"><strong>{formName}</strong><p>{contractNumber} · {report.status} · Saved {reportDate(report.updated_at)}</p><p className="text-xs text-slate-500">Report {report.id}</p></div>
        <section><h2 className="mb-3 border-b pb-2 text-base font-bold text-teal-900">Parties</h2><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs uppercase text-slate-500">Service provider / seller</p><p className="font-semibold">{text(seller)}</p></div><div><p className="text-xs uppercase text-slate-500">Customer / buyer</p><p className="font-semibold">{text(buyer)}</p></div></div>{!parties && <p className="mt-2 text-xs text-slate-500">Legacy report: party names are shown from the current contract.</p>}</section>
        <section><h2 className="mb-3 border-b pb-2 text-base font-bold text-teal-900">Service and equipment</h2><dl className="grid gap-3 sm:grid-cols-2">{details.map(([label,value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></section>
        <section><h2 className="mb-3 border-b pb-2 text-base font-bold text-teal-900">Recorded outcomes</h2><div className="space-y-5">{sections.map(section => <div key={section.id} className="rounded-xl border p-4"><h3 className="mb-3 font-bold">{section.title}</h3><dl className="space-y-3">{section.fields.filter(field => field.type !== 'heading').map(field => <div key={field.id} className="grid gap-1 border-t pt-2 sm:grid-cols-2"><dt className="text-sm text-slate-600">{field.label}</dt><dd className="whitespace-pre-wrap text-sm font-medium">{answer(field, report.responses || {}, bound)}</dd></div>)}</dl></div>)}</div></section>
      </div>
    </article>
  </div>;
};

export default ServiceReport;
