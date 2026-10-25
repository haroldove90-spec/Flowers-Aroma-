export interface PDFField {
  label: string;
  value: string | number | undefined | null;
  highlight?: boolean;
}

export function exportRecordToPDF(
  moduleTitle: string,
  recordCode: string,
  fields: PDFField[],
  notes?: string,
  status: string = 'Activo'
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permita ventanas emergentes para generar el reporte PDF.');
    return;
  }

  const dateStr = new Date().toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha Oficial - ${recordCode} - Aroma Flowers</title>
  <style>
    @page {
      size: letter portrait;
      margin: 18mm 15mm 18mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1c1917;
      margin: 0;
      padding: 20px;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      border-bottom: 2px solid #15803d;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .brand-title span {
      color: #15803d;
    }
    .brand-sub {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #78716c;
      font-weight: 600;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #57534e;
    }
    .meta-box strong {
      color: #1c1917;
    }
    .doc-banner {
      background: #f5f5f4;
      border: 1px solid #e7e5e4;
      border-left: 4px solid #15803d;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-title {
      font-size: 14px;
      font-weight: 800;
      color: #1c1917;
      text-transform: uppercase;
    }
    .doc-code {
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: bold;
      color: #15803d;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      background: #dcfce7;
      color: #166534;
    }
    .badge-inactive {
      background: #fee2e2;
      color: #991b1b;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .field-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .field-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #78716c;
      margin-bottom: 2px;
    }
    .field-val {
      font-size: 13px;
      font-weight: 600;
      color: #1c1917;
      word-break: break-word;
    }
    .highlight {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .highlight .field-val {
      color: #15803d;
      font-weight: 800;
    }
    .notes-box {
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 30px;
      background: #fafaf9;
    }
    .notes-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #44403c;
      margin-bottom: 6px;
    }
    .notes-body {
      font-size: 12px;
      color: #292524;
      line-height: 1.5;
    }
    .signatures {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      padding-top: 20px;
      border-top: 1px dashed #d6d3d1;
    }
    .sig-line {
      border-top: 1px solid #78716c;
      margin-top: 35px;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: #57534e;
      text-transform: uppercase;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 9px;
      color: #a8a29e;
      border-top: 1px solid #e7e5e4;
      padding-top: 8px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">AROMA <span>FLOWERS</span></div>
      <div class="brand-sub">Invernadero &bull; Floricultura de Excelencia</div>
    </div>
    <div class="meta-box">
      <div>Folio Oficial: <strong>${recordCode}</strong></div>
      <div>Fecha de Emisión: ${dateStr}</div>
      <div style="margin-top: 4px;">
        <span class="badge ${status === 'Desactivado' ? 'badge-inactive' : ''}">${status}</span>
      </div>
    </div>
  </div>

  <div class="doc-banner">
    <div>
      <div class="doc-title">${moduleTitle}</div>
      <div style="font-size: 11px; color: #57534e;">Ficha Técnica Operativa y de Trazabilidad</div>
    </div>
    <div class="doc-code">${recordCode}</div>
  </div>

  <div class="grid">
    ${fields
      .map(
        (f) => `
      <div class="field-card ${f.highlight ? 'highlight' : ''}">
        <div class="field-label">${f.label}</div>
        <div class="field-val">${f.value !== undefined && f.value !== null && f.value !== '' ? f.value : '—'}</div>
      </div>
    `
      )
      .join('')}
  </div>

  ${
    notes
      ? `
  <div class="notes-box">
    <div class="notes-title">Observaciones / Incidencias / Bitácora</div>
    <div class="notes-body">${notes}</div>
  </div>
  `
      : ''
  }

  <div class="signatures">
    <div>
      <div style="font-size: 10px; color: #78716c; text-align: center;">Responsable de Área / Cuadrilla</div>
      <div class="sig-line">Firma y Sello Operativo</div>
    </div>
    <div>
      <div style="font-size: 10px; color: #78716c; text-align: center;">Supervisión Técnica y Calidad</div>
      <div class="sig-line">Aprobación Dirección Finca</div>
    </div>
  </div>

  <div class="footer">
    Documento confidencial emitido por el Sistema Integral Invernadero Aroma Flowers &bull; Todos los derechos reservados
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportModuleTableToPDF(
  moduleTitle: string,
  arg2: string | string[],
  arg3: string[] | (string | number)[][],
  arg4?: (string | number)[][]
) {
  const isSubtitleProvided = typeof arg2 === 'string';
  const subtitle = isSubtitleProvided ? arg2 : '';
  const headers = (isSubtitleProvided ? arg3 : arg2) as string[];
  const rows = (isSubtitleProvided ? arg4 : arg3) as (string | number)[][];

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permita ventanas emergentes para generar el reporte PDF.');
    return;
  }

  const dateStr = new Date().toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte - ${moduleTitle} - Aroma Flowers</title>
  <style>
    @page {
      size: letter landscape;
      margin: 12mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1c1917;
      margin: 0;
      padding: 15px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      border-bottom: 2px solid #15803d;
      padding-bottom: 8px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 18px;
      font-weight: 900;
    }
    .brand span { color: #15803d; }
    .sub { font-size: 10px; color: #78716c; text-transform: uppercase; letter-spacing: 1.5px; }
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #1c1917;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    th {
      background: #15803d;
      color: #ffffff;
      padding: 6px 8px;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9px;
    }
    td {
      padding: 6px 8px;
      border-bottom: 1px solid #e7e5e4;
      color: #292524;
    }
    tr:nth-child(even) td {
      background: #fafaf9;
    }
    .footer {
      margin-top: 15px;
      font-size: 8px;
      color: #a8a29e;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">AROMA <span>FLOWERS</span></div>
      <div class="sub">Invernadero &bull; Floricultura de Exportación</div>
    </div>
    <div style="text-align: right; font-size: 10px; color: #57534e;">
      <div>Fecha de Emisión: ${dateStr}</div>
      <div>Total Registros: <strong>${rows.length}</strong></div>
    </div>
  </div>

  <div class="title">${moduleTitle} - Listado Completo</div>

  <table>
    <thead>
      <tr>
        ${headers.map((h) => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) => `
        <tr>
          ${r.map((cell) => `<td>${cell !== undefined && cell !== null ? cell : '—'}</td>`).join('')}
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    Reporte generado automáticamente por Sistema Aroma Flowers &bull; Página 1
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
