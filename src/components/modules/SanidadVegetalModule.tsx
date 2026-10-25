import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhytosanitaryRecord } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  ShieldAlert,
  Clock,
  X,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer
} from 'lucide-react';

export const SanidadVegetalModule: React.FC = () => {
  const {
    phytosanitaryRecords,
    addPhytosanitary,
    updatePhytosanitary,
    toggleDeactivatePhytosanitary,
    deletePhytosanitary
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PhytosanitaryRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PhytosanitaryRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<Omit<PhytosanitaryRecord, 'id'>>({
    fecha: new Date().toISOString().split('T')[0],
    moduloSeccion: 'Módulo 1 - Sección A1',
    plagaEnfermedad: 'Trips',
    incidenciaPorc: 3.5,
    severidad: 'Leve (1)',
    productoComercial: 'Spintor 12 SC',
    ingredienteActivo: 'Spinosad',
    dosisPorHectolitro: '50 cc / 100 L',
    volumenAguaLitros: 450,
    operarioEquipo: 'Javier Morales (Pistola a 25 bar)',
    loteProducto: 'SPN-2026-10',
    periodoReingresoHoras: 12,
    eppRequerido: 'Traje impermeable Tyvek, mascarilla con filtros vapores, guantes nitrilo',
    eficaciaPorc: 94,
    costoTotal: 720.00
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPhytosanitary(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updatePhytosanitary(editingRecord.id, editingRecord);
    setEditingRecord(null);
  };

  const handleExportSinglePDF = (rec: PhytosanitaryRecord) => {
    exportRecordToPDF(
      '04. SANIDAD VEGETAL',
      rec.id,
      [
        { label: 'Blanco Biológico (Plaga/Enfermedad)', value: rec.plagaEnfermedad, highlight: true },
        { label: 'Módulo y Sección', value: rec.moduloSeccion },
        { label: 'Fecha de Tratamiento', value: rec.fecha },
        { label: 'Incidencia Evaluada', value: `${rec.incidenciaPorc}%` },
        { label: 'Severidad', value: rec.severidad },
        { label: 'Producto Comercial', value: rec.productoComercial, highlight: true },
        { label: 'Ingrediente Activo', value: rec.ingredienteActivo },
        { label: 'Dosis Recomendada', value: rec.dosisPorHectolitro },
        { label: 'Volumen Caldo / Agua', value: `${rec.volumenAguaLitros} Litros` },
        { label: 'Operario & Equipo', value: rec.operarioEquipo },
        { label: 'Lote del Agroquímico', value: rec.loteProducto },
        { label: 'Periodo de Reingreso (PIR)', value: `${rec.periodoReingresoHoras} horas`, highlight: true },
        { label: 'EPP Obligatorio', value: rec.eppRequerido },
        { label: 'Eficacia de Control Evaluada', value: `${rec.eficaciaPorc || 0}%` },
        { label: 'Costo Total Tratamiento', value: `$${rec.costoTotal.toLocaleString()} MXN` },
        { label: 'Estado en Sistema', value: rec.desactivado ? 'Desactivado' : 'Activo' }
      ],
      `Registro oficial fitosanitario Invernadero Aroma Flowers. Uso obligatorio de EPP y respeto irrestricto de las ${rec.periodoReingresoHoras} horas de intervalo de reingreso para la seguridad del personal.`,
      rec.desactivado ? 'Desactivado' : 'Activo'
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Fecha', 'Módulo', 'Plaga/Enfermedad', 'Producto', 'Dosis', 'PIR (hrs)', 'Eficacia %', 'Costo'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.fecha,
      r.moduloSeccion,
      r.plagaEnfermedad,
      r.productoComercial,
      r.dosisPorHectolitro,
      `${r.periodoReingresoHoras} h`,
      `${r.eficaciaPorc || 0}%`,
      `$${r.costoTotal.toLocaleString()}`
    ]);
    exportModuleTableToPDF('04. Sanidad Vegetal', headers, rows);
  };

  const filteredRecords = phytosanitaryRecords.filter((r) => {
    if (filterStatus === 'active') return !r.desactivado;
    if (filterStatus === 'inactive') return r.desactivado;
    return true;
  });

  const totalAplicaciones = phytosanitaryRecords.length;
  const costoTotalFitosanitario = phytosanitaryRecords.reduce((acc, r) => acc + (r.costoTotal || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-red-600">04.</span> SANIDAD VEGETAL
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Monitoreo de plagas/enfermedades, aplicaciones fitosanitarias, periodos de reingreso (PIR), EPP y eficacia.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportTablePDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
            title="Exportar tabla completa a PDF"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Exportar Tabla PDF</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Tratamiento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Tratamientos Aplicados</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalAplicaciones}</p>
          <span className="text-[10px] text-stone-500 font-medium">Eventos fitosanitarios</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Eficacia Promedio</span>
          <p className="text-xl font-black text-emerald-800 mt-1">94%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Control evaluado</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Inversión Fitosanitaria</span>
          <p className="text-xl font-black text-stone-900 mt-1">${costoTotalFitosanitario.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Costo de ingredientes</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Reingreso Seguro</span>
          <p className="text-xl font-black text-stone-900 mt-1">12 a 24 hrs</p>
          <span className="text-[10px] text-red-600 font-bold">Protocolo EPP estricto</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">Filtro:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({phytosanitaryRecords.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activos ({phytosanitaryRecords.filter((r) => !r.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Desactivados ({phytosanitaryRecords.filter((r) => r.desactivado).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Bitácora Fitosanitaria y Monitoreo</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredRecords.length} registros</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <ShieldAlert className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay registros con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Fecha & Módulo</th>
                  <th className="py-3 px-4">Blanco Biológico</th>
                  <th className="py-3 px-4">Incidencia / Severidad</th>
                  <th className="py-3 px-4">Producto & Dosis</th>
                  <th className="py-3 px-4">PIR (Reingreso)</th>
                  <th className="py-3 px-4">Eficacia</th>
                  <th className="py-3 px-4">Costo</th>
                  <th className="py-3 px-4 text-center min-w-[170px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      rec.desactivado ? 'bg-stone-50/60 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{rec.moduloSeccion}</div>
                      <div className="text-[11px] text-stone-500">{rec.fecha}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px] font-bold">
                        {rec.plagaEnfermedad}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div className="font-bold">{rec.incidenciaPorc}%</div>
                      <div className="text-[11px] text-stone-500">{rec.severidad}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-800">
                      <div className="font-bold text-stone-900">{rec.productoComercial}</div>
                      <div className="text-[11px] text-stone-500">{rec.dosisPorHectolitro}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        {rec.periodoReingresoHoras} h PIR
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {rec.eficaciaPorc}%
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ${rec.costoTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button
                          onClick={() => setViewingRecord(rec)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver detalle del tratamiento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingRecord(rec)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar tratamiento"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Activar */}
                        <button
                          onClick={() => toggleDeactivatePhytosanitary(rec.id)}
                          className={`p-1.5 rounded-lg transition ${
                            rec.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={rec.desactivado ? 'Reactivar tratamiento' : 'Desactivar tratamiento'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Exportar PDF */}
                        <button
                          onClick={() => handleExportSinglePDF(rec)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                          title="Exportar ficha a PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => deletePhytosanitary(rec.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-stone-900">
                  Tratamiento: {viewingRecord.plagaEnfermedad} ({viewingRecord.id})
                </h3>
              </div>
              <button onClick={() => setViewingRecord(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Módulo & Fecha</span>
                  <span className="font-bold text-stone-900">{viewingRecord.moduloSeccion} &bull; {viewingRecord.fecha}</span>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-red-800 font-bold block mb-1">Blanco Biológico</span>
                  <span className="font-bold text-red-950 text-sm">{viewingRecord.plagaEnfermedad} ({viewingRecord.incidenciaPorc}% / {viewingRecord.severidad})</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Producto & Dosis</span>
                  <span className="font-bold text-stone-900">{viewingRecord.productoComercial} ({viewingRecord.ingredienteActivo}) &bull; {viewingRecord.dosisPorHectolitro}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Volumen & Operario</span>
                  <span className="font-bold text-stone-900">{viewingRecord.volumenAguaLitros} L &bull; {viewingRecord.operarioEquipo}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-amber-800 font-bold block mb-1">Periodo de Reingreso (PIR)</span>
                  <span className="font-black text-amber-950 text-sm">{viewingRecord.periodoReingresoHoras} Horas</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Eficacia & Costo Total</span>
                  <span className="font-bold text-emerald-950">{viewingRecord.eficaciaPorc}% &bull; ${viewingRecord.costoTotal.toLocaleString()} MXN</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Equipo de Protección Personal (EPP)</span>
                <p className="text-stone-900 font-medium leading-relaxed">{viewingRecord.eppRequerido}</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingRecord)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar Ficha PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingRecord(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-700" />
                Editar Tratamiento: {editingRecord.id}
              </h3>
              <button onClick={() => setEditingRecord(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={editingRecord.fecha}
                    onChange={(e) => setEditingRecord({ ...editingRecord, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo y Sección *</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.moduloSeccion}
                    onChange={(e) => setEditingRecord({ ...editingRecord, moduloSeccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Plaga / Enfermedad</label>
                  <select
                    value={editingRecord.plagaEnfermedad}
                    onChange={(e) => setEditingRecord({ ...editingRecord, plagaEnfermedad: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Trips">Trips</option>
                    <option value="Arañita Roja">Arañita Roja</option>
                    <option value="Botrytis">Botrytis</option>
                    <option value="Oídio">Oídio</option>
                    <option value="Mildeo Velloso">Mildeo Velloso</option>
                    <option value="Minador">Minador</option>
                    <option value="Pulgón">Pulgón</option>
                    <option value="Preventivo">Preventivo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Producto Comercial *</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.productoComercial}
                    onChange={(e) => setEditingRecord({ ...editingRecord, productoComercial: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ingrediente Activo</label>
                  <input
                    type="text"
                    value={editingRecord.ingredienteActivo}
                    onChange={(e) => setEditingRecord({ ...editingRecord, ingredienteActivo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dosis por 100L</label>
                  <input
                    type="text"
                    value={editingRecord.dosisPorHectolitro}
                    onChange={(e) => setEditingRecord({ ...editingRecord, dosisPorHectolitro: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">PIR (horas)</label>
                  <input
                    type="number"
                    value={editingRecord.periodoReingresoHoras}
                    onChange={(e) => setEditingRecord({ ...editingRecord, periodoReingresoHoras: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costo Total ($)</label>
                  <input
                    type="number"
                    value={editingRecord.costoTotal}
                    onChange={(e) => setEditingRecord({ ...editingRecord, costoTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">EPP Requerido</label>
                <input
                  type="text"
                  value={editingRecord.eppRequerido}
                  onChange={(e) => setEditingRecord({ ...editingRecord, eppRequerido: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Actualizar Tratamiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Registrar Tratamiento / Monitoreo Fitosanitario
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo y Sección *</label>
                  <input
                    type="text"
                    required
                    value={formData.moduloSeccion}
                    onChange={(e) => setFormData({ ...formData, moduloSeccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Plaga o Enfermedad</label>
                  <select
                    value={formData.plagaEnfermedad}
                    onChange={(e) => setFormData({ ...formData, plagaEnfermedad: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Trips">Trips</option>
                    <option value="Arañita Roja">Arañita Roja</option>
                    <option value="Botrytis">Botrytis</option>
                    <option value="Oídio">Oídio</option>
                    <option value="Mildeo Velloso">Mildeo Velloso</option>
                    <option value="Minador">Minador</option>
                    <option value="Pulgón">Pulgón</option>
                    <option value="Preventivo">Preventivo / Estimulante</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Incidencia (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.incidenciaPorc}
                    onChange={(e) => setFormData({ ...formData, incidenciaPorc: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Severidad</label>
                  <select
                    value={formData.severidad}
                    onChange={(e) => setFormData({ ...formData, severidad: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Leve (1)">Leve (1)</option>
                    <option value="Moderada (2)">Moderada (2)</option>
                    <option value="Alta (3)">Alta (3)</option>
                    <option value="Crítica (4)">Crítica (4)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Producto Comercial *</label>
                  <input
                    type="text"
                    required
                    value={formData.productoComercial}
                    onChange={(e) => setFormData({ ...formData, productoComercial: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ingrediente Activo</label>
                  <input
                    type="text"
                    value={formData.ingredienteActivo}
                    onChange={(e) => setFormData({ ...formData, ingredienteActivo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dosis por 100 L</label>
                  <input
                    type="text"
                    value={formData.dosisPorHectolitro}
                    onChange={(e) => setFormData({ ...formData, dosisPorHectolitro: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Volumen Agua (Litros)</label>
                  <input
                    type="number"
                    value={formData.volumenAguaLitros}
                    onChange={(e) => setFormData({ ...formData, volumenAguaLitros: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Periodo Reingreso (hrs)</label>
                  <input
                    type="number"
                    value={formData.periodoReingresoHoras}
                    onChange={(e) => setFormData({ ...formData, periodoReingresoHoras: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Operario y Equipo</label>
                  <input
                    type="text"
                    value={formData.operarioEquipo}
                    onChange={(e) => setFormData({ ...formData, operarioEquipo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Eficacia Estimada (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.eficaciaPorc}
                    onChange={(e) => setFormData({ ...formData, eficaciaPorc: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costo Total ($ MXN)</label>
                  <input
                    type="number"
                    value={formData.costoTotal}
                    onChange={(e) => setFormData({ ...formData, costoTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Medidas de Seguridad y EPP Requerido</label>
                <input
                  type="text"
                  value={formData.eppRequerido}
                  onChange={(e) => setFormData({ ...formData, eppRequerido: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Guardar Fitosanitario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
