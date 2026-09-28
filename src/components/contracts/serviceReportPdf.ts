import { jsPDF } from 'jspdf';

export interface ReportRow { label: string; value: string }
export interface ReportSection { title: string; rows: ReportRow[] }
export interface ReportPdfData {
  reportId: string;
  contractNumber: string;
  serviceName: string;
  status: string;
  recordedAt: string;
  seller: string;
  buyer: string;
  partySource?: string;
  summary: ReportRow[];
  sections: ReportSection[];
}

// The built-in PDF font cannot draw emoji or typographic dashes used in
// configured answer options. Keep the meaning, but use printable text.
export const pdfText = (value: string): string => value
  .replace(/[\u2010-\u2015]/g, '-')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/\u00a0/g, ' ')
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, '')
  .replace(/\s+/g, ' ').trim();

export function buildServiceReportPdf(data: ReportPdfData): jsPDF {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const left = 18, right = 192, contentWidth = right - left, bottom = 270;
  let y = 0;

  const ink = () => pdf.setTextColor(30, 48, 56);
  const muted = () => pdf.setTextColor(94, 110, 119);
  const brand = () => pdf.setTextColor(20, 79, 89);
  const newPage = (first = false) => {
    if (!first) pdf.addPage();
    pdf.setFillColor(20, 79, 89); pdf.rect(0, 0, 210, 5, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); brand();
    pdf.text('CONTRACTNEST  /  SERVICE RECORD', left, 17);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); muted();
    pdf.text(pdfText(data.contractNumber), right, 17, { align: 'right' });
    pdf.setDrawColor(214, 225, 227); pdf.line(left, 21, right, 21);
    y = 29;
  };
  const ensure = (height: number) => { if (y + height > bottom) newPage(); };
  const title = (value: string, kicker?: string) => {
    if (kicker) { pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); brand(); pdf.text(kicker, left, y); y += 8; }
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(19); ink();
    const lines = pdf.splitTextToSize(pdfText(value), contentWidth) as string[];
    pdf.text(lines, left, y); y += lines.length * 8 + 3;
  };
  const section = (value: string, firstRowHeight = 9) => {
    ensure(13 + firstRowHeight);
    y += 3;
    pdf.setFillColor(231, 240, 241); pdf.roundedRect(left, y - 3, contentWidth, 9, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); brand();
    pdf.text(pdfText(value).toUpperCase(), left + 4, y + 2.5);
    y += 10;
  };
  const row = (label: string, value: string, index: number) => {
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9);
    const leftLines = pdf.splitTextToSize(pdfText(label), 68) as string[];
    const rightLines = pdf.splitTextToSize(pdfText(value || 'Not recorded'), 91) as string[];
    const height = Math.max(7.5, Math.max(leftLines.length, rightLines.length) * 4 + 3.5);
    ensure(height);
    if (index % 2 === 0) { pdf.setFillColor(247, 249, 249); pdf.rect(left, y - 3.5, contentWidth, height, 'F'); }
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8.5); muted(); pdf.text(leftLines, left + 4, y + 1);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); ink(); pdf.text(rightLines, left + 78, y + 1);
    y += height;
  };

  newPage(true);
  title('Service visit report', 'RECORDED SERVICE EVIDENCE');
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); muted();
  const subtitle = pdf.splitTextToSize(pdfText(data.serviceName), contentWidth) as string[];
  pdf.text(subtitle, left, y); y += subtitle.length * 5 + 8;
  pdf.setFillColor(241, 246, 246); pdf.roundedRect(left, y - 4, contentWidth, 18, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); brand();
  pdf.text(`CONTRACT ${pdfText(data.contractNumber)}  |  ${pdfText(data.status).toUpperCase()}`, left + 4, y + 3);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); muted();
  pdf.text(`Saved ${pdfText(data.recordedAt)}  |  Report ${data.reportId.slice(0, 8).toUpperCase()}`, left + 4, y + 10);
  y += 23;

  section('Contract parties', 24);
  const partyWidth = 84;
  [[data.seller, 'SERVICE PROVIDER / SELLER', left], [data.buyer, 'CUSTOMER / BUYER', left + 90]].forEach(([name, label, x]) => {
    const origin = Number(x);
    pdf.setDrawColor(213, 224, 227); pdf.roundedRect(origin, y - 2, partyWidth, 25, 2, 2, 'S');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.5); muted(); pdf.text(String(label), origin + 4, y + 4);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); ink();
    pdf.text(pdf.splitTextToSize(pdfText(String(name || 'Not recorded')), partyWidth - 8).slice(0, 2), origin + 4, y + 12);
  });
  y += 29;

  section('Visit and equipment');
  data.summary.forEach((item, index) => row(item.label, item.value, index));
  data.sections.forEach(group => {
    if (!group.rows.length) return;
    if (group.rows.length <= 6) {
      const estimatedRows = group.rows.reduce((sum, item) => {
        const labelLines = (pdf.splitTextToSize(pdfText(item.label), 68) as string[]).length;
        const valueLines = (pdf.splitTextToSize(pdfText(item.value || 'Not recorded'), 91) as string[]).length;
        return sum + Math.max(7.5, Math.max(labelLines, valueLines) * 4 + 3.5);
      }, 0);
      ensure(13 + estimatedRows);
    }
    section(group.title);
    group.rows.forEach((item, index) => row(item.label, item.value, index));
  });

  const pages = pdf.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    pdf.setPage(page);
    pdf.setDrawColor(214, 225, 227); pdf.line(left, 280, right, 280);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); muted();
    pdf.text(`Submission ${data.reportId}  |  ${data.partySource || 'Parties captured with submission'}`, left, 286);
    pdf.text(`${page} / ${pages}`, right, 286, { align: 'right' });
  }
  pdf.setProperties({ title: `Service visit report - ${data.contractNumber}`, subject: data.serviceName, author: 'ContractNest' });
  return pdf;
}
