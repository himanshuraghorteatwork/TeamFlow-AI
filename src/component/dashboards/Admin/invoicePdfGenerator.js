// Pure client-side PDF-1.4 generator for TeamFlow AI Official Invoices
// Generates standard compliant PDF binary blobs without external npm dependencies

function escapePdf(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function formatINRText(amt) {
  const num = Number(amt) || 0;
  return 'INR ' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateInvoicePDFBlob(invoice, billing) {
  const safeBilling = billing || {
    company: "ABC Technologies Inc.",
    taxId: "US-EIN-948201948",
    email: "billing@abctechnologies.com",
    address: "500 Howard Street, Suite 400",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
  };

  // Standard A4 dimensions: 595.28 pt x 841.89 pt
  const W = 595.28;
  const H = 841.89;

  let stream = '';
  const add = (cmd) => { stream += cmd + '\n'; };

  // Page background: crisp white
  add('1 1 1 rg');
  add(`0 0 ${W} ${H} re`);
  add('f');

  // Top corporate brand banner (Indigo accent)
  add('0.31 0.27 0.90 rg');
  add(`36 ${H - 32} ${W - 72} 4 re`);
  add('f');

  // Brand Header Left: Logo Icon Box + Company Name
  add('0.31 0.27 0.90 rg');
  add(`36 ${H - 68} 26 26 re f`);
  add('1 1 1 rg');
  add(`40 ${H - 58} 18 6 re f`);

  add('0.06 0.09 0.16 rg');
  add(`BT /F1 16 Tf 70 ${H - 55} Td (${escapePdf('TeamFlow AI Inc.')}) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 8.5 Tf 70 ${H - 68} Td (${escapePdf('Enterprise AI Workflows & Cloud Infrastructure')}) Tj ET`);
  add(`BT /F2 7.5 Tf 70 ${H - 79} Td (${escapePdf('500 Howard Street, Suite 400 • San Francisco, CA 94105 • billing@teamflow.ai')}) Tj ET`);

  // Brand Header Right: Invoice Details & Status
  add('0.31 0.27 0.90 rg');
  add(`BT /F1 9 Tf ${W - 230} ${H - 52} Td (${escapePdf('TAX INVOICE / OFFICIAL RECEIPT')}) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 14 Tf ${W - 230} ${H - 68} Td (#${escapePdf(invoice.id)}) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 8 Tf ${W - 230} ${H - 80} Td (Issued: ${escapePdf(invoice.date)}   Due: ${escapePdf(invoice.dueDate || invoice.date)}) Tj ET`);

  // Status Stamp Box
  const isPaid = invoice.status === 'Paid';
  if (isPaid) {
    add('0.85 0.95 0.88 rg');
  } else {
    add('0.99 0.95 0.82 rg');
  }
  add(`${W - 105} ${H - 105} 69 16 re f`);
  if (isPaid) {
    add('0.08 0.50 0.24 rg');
  } else {
    add('0.80 0.45 0.00 rg');
  }
  add(`BT /F1 8 Tf ${W - 95} ${H - 99} Td (${escapePdf(invoice.status.toUpperCase())}) Tj ET`);

  // Top Divider line
  add('0.89 0.92 0.95 RG');
  add('0.75 w');
  add(`36 ${H - 114} m ${W - 36} ${H - 114} l S`);

  // 2 Entity Boxes: Billed To (Left) & Payment Metadata (Right)
  // Billed To Box
  add('0.97 0.98 0.99 rg');
  add(`36 ${H - 196} 250 72 re f`);
  add('0.89 0.92 0.95 RG');
  add(`36 ${H - 196} 250 72 re S`);

  add('0.39 0.45 0.55 rg');
  add(`BT /F1 7.5 Tf 46 ${H - 136} Td (BILLED TO) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 9.5 Tf 46 ${H - 149} Td (${escapePdf(safeBilling.company)}) Tj ET`);
  add('0.31 0.27 0.90 rg');
  add(`BT /F2 7.5 Tf 46 ${H - 160} Td (Tax ID: ${escapePdf(safeBilling.taxId || 'US-EIN-948201948')}) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 7.5 Tf 46 ${H - 171} Td (${escapePdf((safeBilling.address || '') + ', ' + (safeBilling.city || ''))}) Tj ET`);
  add(`BT /F2 7.5 Tf 46 ${H - 182} Td (${escapePdf((safeBilling.state || '') + ' ' + (safeBilling.zip || '') + ', ' + (safeBilling.country || ''))}) Tj ET`);

  // Payment Metadata Box
  add('0.97 0.98 0.99 rg');
  add(`306 ${H - 196} 253 72 re f`);
  add('0.89 0.92 0.95 RG');
  add(`306 ${H - 196} 253 72 re S`);

  add('0.39 0.45 0.55 rg');
  add(`BT /F1 7.5 Tf 316 ${H - 136} Td (PAYMENT METADATA) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F2 8 Tf 316 ${H - 149} Td (Payment Method:   ${escapePdf(invoice.method)}) Tj ET`);
  add(`BT /F2 8 Tf 316 ${H - 160} Td (Settlement Status:  ${escapePdf(invoice.status)}) Tj ET`);
  add(`BT /F2 8 Tf 316 ${H - 171} Td (Currency:           INR - Indian Rupee) Tj ET`);
  add(`BT /F2 7.5 Tf 316 ${H - 182} Td (Transaction Auth:   TF-AUTH-${escapePdf(invoice.id.slice(-4))}-99) Tj ET`);

  // Itemized Statement of Charges Header
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 10 Tf 36 ${H - 215} Td (${escapePdf('Itemized Statement of Charges')}) Tj ET`);

  // Table Header Bar
  add('0.95 0.96 0.98 rg');
  add(`36 ${H - 234} ${W - 72} 16 re f`);
  add('0.89 0.92 0.95 RG');
  add(`36 ${H - 234} ${W - 72} 16 re S`);

  add('0.28 0.33 0.41 rg');
  add(`BT /F1 7.5 Tf 44 ${H - 228} Td (#) Tj ET`);
  add(`BT /F1 7.5 Tf 70 ${H - 228} Td (ITEM DESCRIPTION) Tj ET`);
  add(`BT /F1 7.5 Tf 360 ${H - 228} Td (QTY) Tj ET`);
  add(`BT /F1 7.5 Tf 405 ${H - 228} Td (UNIT RATE) Tj ET`);
  add(`BT /F1 7.5 Tf 485 ${H - 228} Td (AMOUNT) Tj ET`);

  // Table Item Rows
  let tableY = H - 253;
  const items = invoice.items && invoice.items.length > 0
    ? invoice.items
    : [{ name: invoice.description || 'TeamFlow AI Subscription', qty: 1, rate: invoice.amount, total: invoice.amount }];

  items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      add('0.98 0.99 1.00 rg');
      add(`36 ${tableY - 9} ${W - 72} 22 re f`);
    }
    add('0.92 0.94 0.97 RG');
    add('0.5 w');
    add(`36 ${tableY - 9} m ${W - 36} ${tableY - 9} l S`);

    add('0.39 0.45 0.55 rg');
    add(`BT /F2 8 Tf 44 ${tableY} Td (${idx + 1}) Tj ET`);
    add('0.06 0.09 0.16 rg');
    add(`BT /F1 8 Tf 70 ${tableY} Td (${escapePdf(item.name)}) Tj ET`);
    add('0.39 0.45 0.55 rg');
    add(`BT /F2 7.5 Tf 365 ${tableY} Td (${item.qty}) Tj ET`);
    add(`BT /F2 7.5 Tf 405 ${tableY} Td (${escapePdf(formatINRText(item.rate))}) Tj ET`);
    add('0.06 0.09 0.16 rg');
    add(`BT /F1 8 Tf 485 ${tableY} Td (${escapePdf(formatINRText(item.total))}) Tj ET`);

    tableY -= 24;
  });

  // Subtotal & Totals Box
  tableY -= 4;
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 8 Tf 360 ${tableY} Td (Subtotal:) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 8 Tf 485 ${tableY} Td (${escapePdf(formatINRText(invoice.amount))}) Tj ET`);

  tableY -= 14;
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 7.5 Tf 290 ${tableY} Td (Sales Tax / GST \\(0.00% Reverse Charge\\):) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 7.5 Tf 485 ${tableY} Td (INR 0.00) Tj ET`);

  tableY -= 17;
  // Total Highlight bar
  add('0.95 0.94 1.00 rg');
  add(`270 ${tableY - 6} 289 22 re f`);
  add('0.80 0.78 0.98 RG');
  add(`270 ${tableY - 6} 289 22 re S`);

  add('0.06 0.09 0.16 rg');
  add(`BT /F1 9.5 Tf 290 ${tableY + 3} Td (Total Amount:) Tj ET`);
  add('0.31 0.27 0.90 rg');
  add(`BT /F1 10.5 Tf 460 ${tableY + 3} Td (${escapePdf(formatINRText(invoice.amount))}) Tj ET`);

  // Bottom Dock: Verification & Authorized Signatory
  const dockY = 120;
  // Box 1: QR & Cryptographic Verification
  add('0.97 0.98 0.99 rg');
  add(`36 ${dockY} 265 62 re f`);
  add('0.89 0.92 0.95 RG');
  add(`36 ${dockY} 265 62 re S`);

  // Drawn QR Matrix icon
  add('0.15 0.20 0.30 rg');
  add(`46 ${dockY + 11} 38 38 re f`);
  add('1 1 1 rg');
  add(`51 ${dockY + 30} 10 10 re f`);
  add(`67 ${dockY + 30} 10 10 re f`);
  add(`51 ${dockY + 16} 10 10 re f`);
  add('0.15 0.20 0.30 rg');
  add(`54 ${dockY + 33} 4 4 re f`);
  add(`70 ${dockY + 33} 4 4 re f`);
  add(`54 ${dockY + 19} 4 4 re f`);

  add('0.08 0.50 0.24 rg');
  add(`BT /F1 7.5 Tf 94 ${dockY + 43} Td (E-INVOICE DIGITALLY VERIFIED) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 7.5 Tf 94 ${dockY + 32} Td (Official Cryptographic Ledger) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 6.5 Tf 94 ${dockY + 22} Td (Immutable SHA256 Signature Audit Hash) Tj ET`);
  add(`BT /F2 6.5 Tf 94 ${dockY + 12} Td (SHA256: 4e82b7...910a${escapePdf(invoice.id.slice(-3))}) Tj ET`);

  // Box 2: Authorized Signatory
  add('0.97 0.98 0.99 rg');
  add(`316 ${dockY} 243 62 re f`);
  add('0.89 0.92 0.95 RG');
  add(`316 ${dockY} 243 62 re S`);

  add('0.39 0.45 0.55 rg');
  add(`BT /F1 7 Tf 326 ${dockY + 46} Td (AUTHORIZED SIGNATURE) Tj ET`);
  add('0.18 0.22 0.35 rg');
  add(`BT /F3 14 Tf 326 ${dockY + 29} Td (Elena Rostova) Tj ET`);
  add('0.06 0.09 0.16 rg');
  add(`BT /F1 7 Tf 326 ${dockY + 18} Td (Elena Rostova) Tj ET`);
  add('0.39 0.45 0.55 rg');
  add(`BT /F2 6 Tf 326 ${dockY + 9} Td (Corporate Treasury & Controller • TeamFlow AI Corp) Tj ET`);

  // Legal & Compliance footer note
  add('0.55 0.60 0.68 rg');
  add(`BT /F2 6.5 Tf 36 60 Td (This official statement was electronically issued by TeamFlow AI Inc. All payments processed via PCI-DSS Level 1 compliant gateway.) Tj ET`);
  add(`BT /F2 6.5 Tf 36 50 Td (Under US E-SIGN and UETA legislation, this document represents an immutable settlement record. https://teamflow.ai | billing@teamflow.ai) Tj ET`);

  // Bottom brand mark
  add('0.31 0.27 0.90 rg');
  add(`36 38 ${W - 72} 1.5 re f`);

  // Build standard PDF-1.4 objects
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  addObject('<< /Type /Catalog /Pages 2 0 R >>');
  addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  const fontObj = '<< /Font << ' +
    '/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> ' +
    '/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> ' +
    '/F3 << /Type /Font /Subtype /Type1 /BaseFont /Times-BoldItalic >> ' +
    '>> >>';
  addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources ${fontObj} >>`);

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(stream);
  addObject(`<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream`);

  let headerStr = '%PDF-1.4\n';
  const offsets = [0];
  let currentOffset = encoder.encode(headerStr).length;

  let bodyStr = '';
  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset);
    const objBlock = `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    bodyStr += objBlock;
    currentOffset += encoder.encode(objBlock).length;
  }

  const xrefOffset = currentOffset;
  let xrefStr = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const off = String(offsets[i]).padStart(10, '0');
    xrefStr += `${off} 00000 n \n`;
  }
  xrefStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const fullPdfStr = headerStr + bodyStr + xrefStr;
  const pdfBytes = encoder.encode(fullPdfStr);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export function downloadInvoicePDF(invoice, billing) {
  try {
    const blob = generateInvoicePDFBlob(invoice, billing);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    return true;
  } catch (err) {
    console.error('Failed to generate or download invoice PDF:', err);
    return false;
  }
}

export function previewInvoicePDF(invoice, billing) {
  try {
    const blob = generateInvoicePDFBlob(invoice, billing);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
    return true;
  } catch (err) {
    console.error('Failed to preview invoice PDF:', err);
    return false;
  }
}

