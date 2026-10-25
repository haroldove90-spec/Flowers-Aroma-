import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Download,
  Upload,
  Database,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
  Printer,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Code,
  FileDown,
  Eye,
  X
} from 'lucide-react';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import { AuditLog } from '../../types';

export const ReportesAdminModule: React.FC = () => {
  const {
    isSampleDataHidden,
    clearAllSampleData,
    restoreSampleData,
    auditLogs,
    supabaseConfig,
    updateSupabaseConfig,
    clearSupabaseRemoteData,
    productionUnits,
    culturalLabors,
    fertirrigationRecords,
    phytosanitaryRecords,
    employees,
    harvestRecords,
    salesRecords,
    warehouseItems,
    financeRecords,
    costRecords,
    assetRecords,
    showToast
  } = useApp();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [isPurgingSupabase, setIsPurgingSupabase] = useState(false);
  const [viewingLog, setViewingLog] = useState<AuditLog | null>(null);

  // Supabase Form state
  const [sbUrl, setSbUrl] = useState(supabaseConfig.supabaseUrl);
  const [sbKey, setSbKey] = useState(supabaseConfig.supabaseAnonKey);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({
      configured: Boolean(sbUrl && sbKey),
      supabaseUrl: sbUrl,
      supabaseAnonKey: sbKey,
      lastSync: new Date().toISOString()
    });
  };

  const handlePurgeSupabase = async () => {
    setIsPurgingSupabase(true);
    const res = await clearSupabaseRemoteData();
    setIsPurgingSupabase(false);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Export full system backup as JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      app: 'Invernadero Aroma Flowers',
      productionUnits,
      culturalLabors,
      fertirrigationRecords,
      phytosanitaryRecords,
      employees,
      harvestRecords,
      salesRecords,
      warehouseItems,
      financeRecords,
      costRecords,
      assetRecords,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aroma-flowers-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Respaldo del sistema descargado en JSON', 'success');
  };

  // Export CSV Report of Sales & Production
  const handleExportCSV = () => {
    const headers = ['Fecha', 'Cliente', 'Mercado', 'Variedad', 'Paquetes 25', 'Total Venta', 'Estado Cobro'];
    const rows = salesRecords.map((s) => [
      s.fecha,
      `"${s.cliente}"`,
      `"${s.mercado}"`,
      `"${s.variedad}"`,
      s.paquetesVendidos,
      s.totalVenta,
      s.estadoCobro
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aroma-flowers-reporte-ventas-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Reporte en formato CSV generado', 'success');
  };

  const handleExportAuditPDF = () => {
    exportModuleTableToPDF(
      '12. REPORTES, SEGURIDAD Y ADMINISTRACIÓN',
      'Bitácora Completa de Auditoría y Eventos del Sistema',
      ['Fecha y Hora', 'Usuario / Rol', 'Módulo', 'Acción', 'Detalle'],
      auditLogs.map((l) => [l.timestamp, l.usuario, l.modulo, l.accion, l.detalle])
    );
    showToast('Bitácora de auditoría exportada en PDF', 'success');
  };

  const handleExportExecutiveSummaryPDF = () => {
    const totalVentas = salesRecords.filter((s) => !s.desactivado).reduce((acc, s) => acc + s.totalVenta, 0);
    const totalTallosCosechados = harvestRecords.filter((h) => !h.desactivado).reduce((acc, h) => acc + h.tallosCortados, 0);
    const inventarioVal = warehouseItems.reduce((acc, i) => acc + (i.stockActual * i.costoUnitario), 0);
    const activosVal = assetRecords.reduce((acc, a) => acc + (a.valorAdquisicion || 0), 0);

    exportRecordToPDF('12. REPORTES, SEGURIDAD Y ADMINISTRACIÓN', 'Resumen Ejecutivo Consolidado Finca', [
      { label: 'Unidades de Producción Activas', value: `${productionUnits.filter((u) => !u.desactivado).length} de ${productionUnits.length}` },
      { label: 'Superficie Bajo Cubierta', value: `${productionUnits.reduce((acc, u) => acc + u.superficieM2, 0).toLocaleString()} m²` },
      { label: 'Total Plantas en Cultivo', value: `${productionUnits.reduce((acc, u) => acc + u.numPlantas, 0).toLocaleString()} plantas` },
      { label: 'Plantilla de Personal Activa', value: `${employees.filter((e) => !e.desactivado).length} trabajadores` },
      { label: 'Tallos Cosechados Registrados', value: `${totalTallosCosechados.toLocaleString()} tallos` },
      { label: 'Facturación Total Acumulada', value: `$${totalVentas.toLocaleString()} MXN` },
      { label: 'Valor en Inventario de Insumos', value: `$${inventarioVal.toLocaleString()} MXN` },
      { label: 'Valor Infraestructura y Activos', value: `$${activosVal.toLocaleString()} MXN` },
      { label: 'Eventos de Auditoría Registrados', value: `${auditLogs.length} eventos` },
      { label: 'Integración Supabase', value: supabaseConfig.configured ? 'Configurada y Vinculada' : 'No Conectada (Local)' }
    ]);
    showToast('Resumen ejecutivo exportado en PDF', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">12.</span> REPORTES, SEGURIDAD Y ADMINISTRACIÓN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Panel ejecutivo para dirección general, auditoría, respaldos, exportación PDF/CSV y conexión con Supabase.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExecutiveSummaryPDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Resumen Ejecutivo PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
          >
            <Printer className="w-4 h-4 text-stone-700" />
            <span>Imprimir Vista</span>
          </button>
        </div>
      </div>

      {/* Database Management & Supabase Control (User explicit requirement) */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Gestión de Datos de Muestra y Supabase</h3>
              <p className="text-xs text-stone-500">
                Active el modo limpio para que el navegador no vuelva a mostrar registros demo y quede listo para Supabase.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSampleDataHidden ? (
              <button
                onClick={restoreSampleData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition"
              >
                <RotateCcw className="w-4 h-4 text-emerald-700" />
                <span>Restaurar datos muestra</span>
              </button>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Borrar datos de muestra del todo el sistema</span>
              </button>
            )}
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Respaldo JSON</span>
            </button>
          </div>
        </div>

        {/* Current State Indicator */}
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isSampleDataHidden ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-xs font-bold text-stone-800">
              Estado de la base local: {isSampleDataHidden ? 'Limpia (Sin datos demo en el navegador)' : 'Modo Demostración Activo'}
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            Preferencia guardada en: localStorage (Persistente)
          </span>
        </div>

        {/* Supabase Configuration Form */}
        <div className="mt-4 pt-2 border-t border-stone-100">
          <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-700" />
            Configuración de Supabase (Base de Datos en la Nube)
          </h4>
          <form onSubmit={handleSaveSupabaseConfig} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">SUPABASE_URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={sbUrl}
                onChange={(e) => setSbUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">SUPABASE_ANON_KEY</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={sbKey}
                onChange={(e) => setSbKey(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition"
              >
                Guardar Configuración
              </button>
              <button
                type="button"
                onClick={() => setShowSqlSchema(!showSqlSchema)}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition"
              >
                <Code className="w-3.5 h-3.5 inline mr-1" />
                Script SQL
              </button>
              {supabaseConfig.configured && (
                <button
                  type="button"
                  onClick={handlePurgeSupabase}
                  disabled={isPurgingSupabase}
                  className="px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                >
                  {isPurgingSupabase ? 'Borrando...' : 'Borrar en Supabase'}
                </button>
              )}
            </div>
          </form>

          {/* SQL Script Viewer */}
          {showSqlSchema && (
            <div className="mt-4 p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] max-h-60 overflow-y-auto">
              <div className="flex justify-between items-center text-xs text-emerald-400 font-bold mb-2">
                <span>-- Script SQL de Creación de Tablas para Supabase (12 Módulos Aroma Flowers)</span>
                <span className="text-stone-400">PostgreSQL</span>
              </div>
              <pre className="text-stone-300 whitespace-pre">
{`-- Schema Invernadero Aroma Flowers
CREATE TABLE IF NOT EXISTS aroma_unidades_produccion (
  id TEXT PRIMARY KEY,
  predio TEXT,
  modulo TEXT,
  seccion TEXT,
  superficie_m2 NUMERIC,
  tuneles INT,
  camas INT,
  variedad TEXT,
  color TEXT,
  num_plantas INT,
  densidad_m2 NUMERIC,
  coordenadas TEXT,
  altitud_msnm INT,
  regimen_tenencia TEXT,
  meta_tallos_anual INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS aroma_cosecha_poscosecha (
  id TEXT PRIMARY KEY,
  codigo_lote TEXT UNIQUE,
  fecha DATE,
  modulo TEXT,
  variedad TEXT,
  tallos_cortados INT,
  paquetes_25 INT,
  longitud_cm TEXT,
  calidad TEXT,
  merma_tallos INT,
  temperatura_camara_c NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS aroma_ventas_clientes (
  id TEXT PRIMARY KEY,
  fecha DATE,
  cliente TEXT,
  mercado TEXT,
  variedad TEXT,
  paquetes_vendidos INT,
  precio_paquete NUMERIC,
  total_venta NUMERIC,
  estado_cobro TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* System Audit Log */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">Bitácora de Cambios y Auditoría del Sistema</h3>
            <span className="text-xs text-stone-500 font-medium">({auditLogs.length} eventos auditados)</span>
          </div>
          <button
            onClick={handleExportAuditPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition"
          >
            <FileDown className="w-4 h-4 text-emerald-700" />
            <span>Exportar Auditoría PDF</span>
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            No hay registros de auditoría aún.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-4">Fecha y Hora</th>
                  <th className="py-2.5 px-4">Rol / Usuario</th>
                  <th className="py-2.5 px-4">Módulo</th>
                  <th className="py-2.5 px-4">Acción</th>
                  <th className="py-2.5 px-4">Detalle de la Operación</th>
                  <th className="py-2.5 px-4 text-center">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-stone-900 truncate max-w-[140px]">
                      {log.usuario}
                    </td>
                    <td className="py-2.5 px-4 text-stone-700">
                      {log.modulo}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.accion === 'Creación'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.accion === 'Eliminación' || log.accion === 'Vaciado de prueba'
                            ? 'bg-red-100 text-red-800'
                            : log.accion === 'Desactivación'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.accion}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-stone-800 text-[11px]">
                      {log.detalle}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => setViewingLog(log)}
                        className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Ver detalle de auditoría"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Ver Detalle Auditoría */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">Registro de Auditoría</h3>
              </div>
              <button onClick={() => setViewingLog(null)} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <span className="text-stone-500 font-bold block">Timestamp</span>
                <span className="font-mono text-stone-800">{viewingLog.timestamp}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Usuario / Rol</span>
                  <span className="font-bold text-stone-900">{viewingLog.usuario}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Acción</span>
                  <span className="font-bold text-stone-900">{viewingLog.accion}</span>
                </div>
              </div>
              <div>
                <span className="text-stone-500 font-bold block">Módulo</span>
                <span className="font-bold text-emerald-800">{viewingLog.modulo}</span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block">Detalle Completo</span>
                <p className="mt-1 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                  {viewingLog.detalle}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setViewingLog(null)}
                  className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Clear Sample Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-stone-900">¿Borrar todos los datos de muestra?</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              Esta función limpiará las tablas de los 12 módulos y activará la preferencia en su navegador para que no se vuelvan a cargar los registros demo. El sistema operará con almacenamiento en blanco listo para conectar con Supabase.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllSampleData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                Sí, borrar datos demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
