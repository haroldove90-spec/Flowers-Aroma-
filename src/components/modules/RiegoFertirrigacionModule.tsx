import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FertirrigationRecord } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  Droplets,
  Calculator,
  X,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer
} from 'lucide-react';

export const RiegoFertirrigacionModule: React.FC = () => {
  const {
    fertirrigationRecords,
    addFertirrigation,
    updateFertirrigation,
    toggleDeactivateFertirrigation,
    deleteFertirrigation
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FertirrigationRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<FertirrigationRecord | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Form State
  const [formData, setFormData] = useState<Omit<FertirrigationRecord, 'id'>>({
    sector: 'Sector 3 - Nave Central',
    modulo: 'Módulo 1 - Alta Densidad',
    fecha: new Date().toISOString().split('T')[0],
    bombaValvula: 'Bomba Goulds 5HP - Electroválvula EV-04',
    tiempoRiegoMin: 40,
    caudalLitrosHora: 7200,
    volumenM3: 4.8,
    ph: 5.85,
    conductividadElectrica: 1.62,
    tensionCbar: 20,
    tanqueA_kg: 'Nitrato de Calcio 15kg + Quelato Hierro 350g',
    tanqueB_kg: 'Nitrato de Potasio 12kg + Fosfato Monopotásico 8kg + Sulfato Mg 5kg',
    costoEstimado: 380.00,
    observaciones: 'Lectura de pH y CE óptimas; goteros autocompensantes aforados.'
  });

  // Fertilizer Calculator State
  const [calcAreaM2, setCalcAreaM2] = useState<number>(5000);
  const [calcFrecuencia, setCalcFrecuencia] = useState<number>(3);
  const [calcDosisGramosM2, setCalcDosisGramosM2] = useState<number>(5.5);

  const calcTotalKgSemana = Number(((calcAreaM2 * calcDosisGramosM2 * calcFrecuencia) / 1000).toFixed(1));
  const calcVolumenEstimadoM3 = Number(((calcAreaM2 * 1.2 * calcFrecuencia) / 1000).toFixed(1));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = Number(((formData.caudalLitrosHora * (formData.tiempoRiegoMin / 60)) / 1000).toFixed(2));
    addFertirrigation({
      ...formData,
      volumenM3: vol
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const vol = Number(((editingRecord.caudalLitrosHora * (editingRecord.tiempoRiegoMin / 60)) / 1000).toFixed(2));
    updateFertirrigation(editingRecord.id, {
      ...editingRecord,
      volumenM3: vol
    });
    setEditingRecord(null);
  };

  const handleExportSinglePDF = (rec: FertirrigationRecord) => {
    exportRecordToPDF(
      '03. RIEGO Y FERTIRRIGACIÓN',
      rec.id,
      [
        { label: 'Sector / Electroválvula', value: rec.sector, highlight: true },
        { label: 'Módulo', value: rec.modulo },
        { label: 'Fecha de Riego', value: rec.fecha },
        { label: 'Equipo / Bomba', value: rec.bombaValvula },
        { label: 'Tiempo de Riego', value: `${rec.tiempoRiegoMin} min` },
        { label: 'Caudal Aforado', value: `${rec.caudalLitrosHora.toLocaleString()} L/h` },
        { label: 'Volumen Aplicado', value: `${rec.volumenM3} m³`, highlight: true },
        { label: 'pH de Solución', value: rec.ph.toString() },
        { label: 'Conductividad Eléctrica (CE)', value: `${rec.conductividadElectrica} mS/cm`, highlight: true },
        { label: 'Tensiómetro de Suelo', value: `${rec.tensionCbar} cbar` },
        { label: 'Tanque A (Calcio / Quelato)', value: rec.tanqueA_kg },
        { label: 'Tanque B (Potasio / Fósforo)', value: rec.tanqueB_kg },
        { label: 'Costo Estimado de Solución', value: `$${rec.costoEstimado.toLocaleString()} MXN` },
        { label: 'Condición en Sistema', value: rec.desactivado ? 'Desactivado' : 'Activo' }
      ],
      rec.observaciones || 'Sin incidencias en goteros ni presión hidrostática.',
      rec.desactivado ? 'Desactivado' : 'Activo'
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Sector', 'Módulo', 'Fecha', 'Tiempo', 'Volumen', 'pH / CE', 'Tensiómetro', 'Costo'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.sector,
      r.modulo,
      r.fecha,
      `${r.tiempoRiegoMin} min`,
      `${r.volumenM3} m³`,
      `${r.ph} / ${r.conductividadElectrica}`,
      `${r.tensionCbar} cb`,
      `$${r.costoEstimado.toLocaleString()}`
    ]);
    exportModuleTableToPDF('03. Riego y Fertirrigación', headers, rows);
  };

  const filteredRecords = fertirrigationRecords.filter((r) => {
    if (filterStatus === 'active') return !r.desactivado;
    if (filterStatus === 'inactive') return r.desactivado;
    return true;
  });

  const totalVolumenM3 = fertirrigationRecords.reduce((acc, r) => acc + (r.volumenM3 || 0), 0);
  const totalCosto = fertirrigationRecords.reduce((acc, r) => acc + (r.costoEstimado || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">03.</span> RIEGO Y FERTIRRIGACIÓN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Control de caudales, recetas tanques A y B, mediciones de pH/CE, tensiómetros y calculadora de fertilizantes.
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
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Calculadora Dosis</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Riego</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Agua Aplicada Total</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalVolumenM3.toFixed(2)} m³</p>
          <span className="text-[10px] text-stone-500 font-medium">Consumo acumulado</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">pH / CE Promedio</span>
          <p className="text-xl font-black text-emerald-800 mt-1">5.88 &bull; 1.62</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Rango fisiológico óptimo</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Inversión Nutricional</span>
          <p className="text-xl font-black text-stone-900 mt-1">${totalCosto.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Sales y fertilizantes</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Eventos Activos</span>
          <p className="text-xl font-black text-stone-900 mt-1">
            {fertirrigationRecords.filter((r) => !r.desactivado).length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium">Riegos registrados</span>
        </div>
      </div>

      {/* Calculator Panel */}
      {showCalculator && (
        <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" />
              Calculadora Nutricional por Superficie y Frecuencia
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">Invernadero Aroma Flowers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Superficie a Fertilizar (m²)</label>
              <input
                type="number"
                value={calcAreaM2}
                onChange={(e) => setCalcAreaM2(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Frecuencia (Riegos por Semana)</label>
              <input
                type="number"
                min="1"
                max="14"
                value={calcFrecuencia}
                onChange={(e) => setCalcFrecuencia(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Dosis Objetivo (g/m² por riego)</label>
              <input
                type="number"
                step="0.1"
                value={calcDosisGramosM2}
                onChange={(e) => setCalcDosisGramosM2(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Consumo semanal:</span>
              <span className="text-emerald-800 font-black text-sm">{calcTotalKgSemana} kg de sales</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Volumen agua aprox:</span>
              <span className="text-stone-800 font-bold text-sm">{calcVolumenEstimadoM3} m³</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Tanque A (Calcio):</span>
              <span className="text-emerald-800 font-bold text-sm">{Number((calcTotalKgSemana * 0.45).toFixed(1))} kg</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Tanque B (Potasio/Fósforo):</span>
              <span className="text-emerald-800 font-bold text-sm">{Number((calcTotalKgSemana * 0.55).toFixed(1))} kg</span>
            </div>
          </div>
        </div>
      )}

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
            Todos ({fertirrigationRecords.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activos ({fertirrigationRecords.filter((r) => !r.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Desactivados ({fertirrigationRecords.filter((r) => r.desactivado).length})
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Historial de Fertirriego y Parámetros</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredRecords.length} eventos</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Droplets className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay riegos con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Fecha & Sector</th>
                  <th className="py-3 px-4">Tiempo & Caudal</th>
                  <th className="py-3 px-4">Volumen</th>
                  <th className="py-3 px-4">pH / CE</th>
                  <th className="py-3 px-4">Tensiómetro</th>
                  <th className="py-3 px-4">Receta Tanques A y B</th>
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
                      <div>{rec.sector}</div>
                      <div className="text-[11px] text-stone-500">{rec.fecha} &bull; {rec.modulo}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{rec.tiempoRiegoMin} min</div>
                      <div className="text-[11px] text-stone-500">{rec.caudalLitrosHora.toLocaleString()} L/h</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {rec.volumenM3} m³
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-stone-800">
                        <span>pH: {rec.ph}</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-emerald-800">CE: {rec.conductividadElectrica}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {rec.tensionCbar} cbar
                    </td>
                    <td className="py-3 px-4 max-w-xs text-[11px]">
                      <div className="truncate text-stone-800 font-medium">A: {rec.tanqueA_kg}</div>
                      <div className="truncate text-stone-500">B: {rec.tanqueB_kg}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      ${rec.costoEstimado.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button
                          onClick={() => setViewingRecord(rec)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver detalle de riego"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingRecord(rec)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar registro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Activar */}
                        <button
                          onClick={() => toggleDeactivateFertirrigation(rec.id)}
                          className={`p-1.5 rounded-lg transition ${
                            rec.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={rec.desactivado ? 'Reactivar riego' : 'Desactivar riego'}
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
                          onClick={() => deleteFertirrigation(rec.id)}
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
                <Droplets className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Ficha de Riego: {viewingRecord.sector} ({viewingRecord.id})
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
                  <span className="font-bold text-stone-900">{viewingRecord.modulo} &bull; {viewingRecord.fecha}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Equipo / Bomba</span>
                  <span className="font-bold text-stone-900">{viewingRecord.bombaValvula}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Tiempo & Caudal</span>
                  <span className="font-bold text-stone-900">{viewingRecord.tiempoRiegoMin} min &bull; {viewingRecord.caudalLitrosHora.toLocaleString()} L/h</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Volumen de Agua</span>
                  <span className="font-black text-emerald-950 text-sm">{viewingRecord.volumenM3} m³</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">pH y Conductividad</span>
                  <span className="font-bold text-stone-900">pH: {viewingRecord.ph} &bull; CE: {viewingRecord.conductividadElectrica} mS/cm</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Tensiómetro / Costo</span>
                  <span className="font-bold text-stone-900">{viewingRecord.tensionCbar} cbar &bull; ${viewingRecord.costoEstimado.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Tanque A (Calcio & Hierro)</span>
                  <p className="text-stone-900 font-semibold">{viewingRecord.tanqueA_kg}</p>
                </div>
                <div className="pt-1.5 border-t border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Tanque B (Potasio, Fósforo & Micros)</span>
                  <p className="text-stone-900 font-semibold">{viewingRecord.tanqueB_kg}</p>
                </div>
              </div>

              {viewingRecord.observaciones && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Observaciones Técnicas</span>
                  <p className="text-stone-800 leading-relaxed">{viewingRecord.observaciones}</p>
                </div>
              )}

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
                Editar Registro de Riego: {editingRecord.id}
              </h3>
              <button onClick={() => setEditingRecord(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sector *</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.sector}
                    onChange={(e) => setEditingRecord({ ...editingRecord, sector: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo *</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.modulo}
                    onChange={(e) => setEditingRecord({ ...editingRecord, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tiempo (min)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingRecord.tiempoRiegoMin}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tiempoRiegoMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Caudal (L/h)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingRecord.caudalLitrosHora}
                    onChange={(e) => setEditingRecord({ ...editingRecord, caudalLitrosHora: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">pH</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.ph}
                    onChange={(e) => setEditingRecord({ ...editingRecord, ph: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">CE (mS/cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.conductividadElectrica}
                    onChange={(e) => setEditingRecord({ ...editingRecord, conductividadElectrica: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tensiómetro (cbar)</label>
                  <input
                    type="number"
                    value={editingRecord.tensionCbar}
                    onChange={(e) => setEditingRecord({ ...editingRecord, tensionCbar: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanque A</label>
                <input
                  type="text"
                  value={editingRecord.tanqueA_kg}
                  onChange={(e) => setEditingRecord({ ...editingRecord, tanqueA_kg: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanque B</label>
                <input
                  type="text"
                  value={editingRecord.tanqueB_kg}
                  onChange={(e) => setEditingRecord({ ...editingRecord, tanqueB_kg: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Costo Estimado ($ MXN)</label>
                <input
                  type="number"
                  value={editingRecord.costoEstimado}
                  onChange={(e) => setEditingRecord({ ...editingRecord, costoEstimado: Number(e.target.value) })}
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
                  Actualizar Riego
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
                <Droplets className="w-5 h-5 text-emerald-700" />
                Registrar Riego y Nutrición
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sector / Electroválvula *</label>
                  <input
                    type="text"
                    required
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo *</label>
                  <input
                    type="text"
                    required
                    value={formData.modulo}
                    onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tiempo de Riego (min)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.tiempoRiegoMin}
                    onChange={(e) => setFormData({ ...formData, tiempoRiegoMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Caudal Aforado (L/h)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.caudalLitrosHora}
                    onChange={(e) => setFormData({ ...formData, caudalLitrosHora: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">pH Solución (5.5 - 6.5)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Conductividad (mS/cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.conductividadElectrica}
                    onChange={(e) => setFormData({ ...formData, conductividadElectrica: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tensiómetro Suelo (cbar)</label>
                  <input
                    type="number"
                    value={formData.tensionCbar}
                    onChange={(e) => setFormData({ ...formData, tensionCbar: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Receta Tanque A (Nitrato de Calcio + Hierro)</label>
                <input
                  type="text"
                  value={formData.tanqueA_kg}
                  onChange={(e) => setFormData({ ...formData, tanqueA_kg: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Receta Tanque B (Potasio, Fósforo, Magnesio, Micros)</label>
                <input
                  type="text"
                  value={formData.tanqueB_kg}
                  onChange={(e) => setFormData({ ...formData, tanqueB_kg: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Costo Estimado de Solución ($ MXN)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.costoEstimado}
                  onChange={(e) => setFormData({ ...formData, costoEstimado: Number(e.target.value) })}
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
                  Guardar Riego y Parámetros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
