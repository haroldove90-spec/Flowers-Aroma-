import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CulturalLabor } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  X,
  TrendingUp,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer
} from 'lucide-react';

export const ProduccionLaboresModule: React.FC = () => {
  const {
    culturalLabors,
    addCulturalLabor,
    updateCulturalLabor,
    toggleDeactivateCulturalLabor,
    deleteCulturalLabor,
    updateLaborStatus
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLabor, setEditingLabor] = useState<CulturalLabor | null>(null);
  const [viewingLabor, setViewingLabor] = useState<CulturalLabor | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<Omit<CulturalLabor, 'id'>>({
    modulo: 'Módulo 1 - Alta Densidad',
    seccion: 'Sección A2',
    labor: 'Desahije',
    fechaProgramada: new Date().toISOString().split('T')[0],
    responsableEquipo: 'Cuadrilla Norte (Don Juan)',
    avancePorcentaje: 0,
    estado: 'Programada',
    incidencias: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCulturalLabor(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabor) return;
    updateCulturalLabor(editingLabor.id, editingLabor);
    setEditingLabor(null);
  };

  const handleExportSinglePDF = (lab: CulturalLabor) => {
    exportRecordToPDF(
      '02. PRODUCCIÓN Y LABORES CULTURALES',
      lab.id,
      [
        { label: 'Labor Cultural', value: lab.labor, highlight: true },
        { label: 'Módulo y Nave', value: lab.modulo },
        { label: 'Sección Específica', value: lab.seccion },
        { label: 'Fecha Programada', value: lab.fechaProgramada },
        { label: 'Responsable / Cuadrilla', value: lab.responsableEquipo, highlight: true },
        { label: 'Porcentaje de Avance', value: `${lab.avancePorcentaje}%` },
        { label: 'Estado de Ejecución', value: lab.estado },
        { label: 'Condición en Sistema', value: lab.desactivado ? 'Desactivado' : 'Activo' }
      ],
      lab.incidencias || 'Sin incidencias reportadas por la cuadrilla.',
      lab.desactivado ? 'Desactivado' : lab.estado
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Labor', 'Módulo', 'Fecha', 'Responsable', 'Avance', 'Estado'];
    const rows = filteredLabors.map((l) => [
      l.id,
      l.labor,
      l.modulo,
      l.fechaProgramada,
      l.responsableEquipo,
      `${l.avancePorcentaje}%`,
      l.desactivado ? 'Desactivado' : l.estado
    ]);
    exportModuleTableToPDF('02. Producción y Labores Culturales', headers, rows);
  };

  const filteredLabors = culturalLabors.filter((l) => {
    if (filterStatus === 'active') return !l.desactivado;
    if (filterStatus === 'inactive') return l.desactivado;
    return true;
  });

  const totalLabores = culturalLabors.length;
  const concluidas = culturalLabors.filter((l) => l.estado === 'Concluida' && !l.desactivado).length;
  const enCurso = culturalLabors.filter((l) => l.estado === 'En curso' && !l.desactivado).length;
  const atrasadas = culturalLabors.filter((l) => l.estado === 'Atrasada' && !l.desactivado).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">02.</span> PRODUCCIÓN Y LABORES CULTURALES
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Programación, asignación, seguimiento de avance, incidencias fotográficas y alertas de atraso.
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
            <span>Programar Labor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Programadas</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalLabores}</p>
          <span className="text-[10px] text-stone-500 font-medium">Labores registradas</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Concluidas</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{concluidas}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Ejecución confirmada</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">En Curso</span>
          <p className="text-xl font-black text-blue-700 mt-1">{enCurso}</p>
          <span className="text-[10px] text-blue-600 font-medium">Cuadrillas activas</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Alertas de Atraso</span>
          <p className="text-xl font-black text-red-600 mt-1">{atrasadas}</p>
          <span className="text-[10px] text-red-600 font-semibold">Requieren atención</span>
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
            Todas ({culturalLabors.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activas ({culturalLabors.filter((l) => !l.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Desactivadas ({culturalLabors.filter((l) => l.desactivado).length})
          </button>
        </div>
      </div>

      {/* Labors Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Bitácora de Labores Culturales</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredLabors.length} actividades</span>
        </div>

        {filteredLabors.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Clock className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay labores con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Labor</th>
                  <th className="py-3 px-4">Módulo & Sección</th>
                  <th className="py-3 px-4">Fecha Programada</th>
                  <th className="py-3 px-4">Responsable / Cuadrilla</th>
                  <th className="py-3 px-4">Avance (%)</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center min-w-[170px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLabors.map((lab) => (
                  <tr
                    key={lab.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      lab.desactivado ? 'bg-stone-50/60 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-stone-900">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                        {lab.labor}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div className="font-semibold">{lab.modulo}</div>
                      <div className="text-[11px] text-stone-500">{lab.seccion}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {lab.fechaProgramada}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-800 font-medium">
                      {lab.responsableEquipo}
                    </td>
                    <td className="py-3 px-4 w-36">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                        <span>{lab.avancePorcentaje}%</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            lab.avancePorcentaje === 100
                              ? 'bg-emerald-600'
                              : lab.estado === 'Atrasada'
                              ? 'bg-red-500'
                              : 'bg-emerald-700'
                          }`}
                          style={{ width: `${lab.avancePorcentaje}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {lab.desactivado ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          Desactivada
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lab.estado === 'Concluida'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lab.estado === 'En curso'
                              ? 'bg-blue-100 text-blue-800'
                              : lab.estado === 'Atrasada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {lab.estado === 'Concluida' && <CheckCircle2 className="w-3 h-3" />}
                          {lab.estado === 'Atrasada' && <AlertTriangle className="w-3 h-3" />}
                          {lab.estado}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Concluir rápido */}
                        {lab.estado !== 'Concluida' && !lab.desactivado && (
                          <button
                            onClick={() => updateLaborStatus(lab.id, 100, 'Concluida')}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                            title="Marcar al 100% como concluida"
                          >
                            Fin
                          </button>
                        )}
                        {/* Ver */}
                        <button
                          onClick={() => setViewingLabor(lab)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver detalle de labor"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingLabor(lab)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar labor"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Activar */}
                        <button
                          onClick={() => toggleDeactivateCulturalLabor(lab.id)}
                          className={`p-1.5 rounded-lg transition ${
                            lab.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={lab.desactivado ? 'Reactivar labor' : 'Desactivar labor'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Exportar PDF */}
                        <button
                          onClick={() => handleExportSinglePDF(lab)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                          title="Exportar ficha a PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => deleteCulturalLabor(lab.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar labor"
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
      {viewingLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Labor: {viewingLabor.labor} ({viewingLabor.id})
                </h3>
              </div>
              <button onClick={() => setViewingLabor(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Módulo & Sección</span>
                  <span className="font-bold text-stone-900">{viewingLabor.modulo} ({viewingLabor.seccion})</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Fecha Programada</span>
                  <span className="font-bold text-stone-900">{viewingLabor.fechaProgramada}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Responsable / Cuadrilla</span>
                  <span className="font-bold text-emerald-950">{viewingLabor.responsableEquipo}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Avance & Estado</span>
                  <span className="font-bold text-stone-900">{viewingLabor.avancePorcentaje}% &bull; {viewingLabor.estado}</span>
                </div>
              </div>

              {viewingLabor.incidencias && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Incidencias y Observaciones</span>
                  <p className="text-stone-800 leading-relaxed">{viewingLabor.incidencias}</p>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingLabor)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar Ficha PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingLabor(null)}
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
      {editingLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-700" />
                Editar Labor Cultural: {editingLabor.id}
              </h3>
              <button onClick={() => setEditingLabor(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Labor *</label>
                <select
                  value={editingLabor.labor}
                  onChange={(e) => setEditingLabor({ ...editingLabor, labor: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Desahije">Desahije</option>
                  <option value="Tutoreo">Tutoreo</option>
                  <option value="Toque de hoja">Toque de hoja</option>
                  <option value="Desmalezado">Desmalezado</option>
                  <option value="Pinch">Pinch</option>
                  <option value="Poda">Poda</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Manejo de cortinas">Manejo de cortinas</option>
                  <option value="Descompactación">Descompactación</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo *</label>
                  <input
                    type="text"
                    required
                    value={editingLabor.modulo}
                    onChange={(e) => setEditingLabor({ ...editingLabor, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sección *</label>
                  <input
                    type="text"
                    required
                    value={editingLabor.seccion}
                    onChange={(e) => setEditingLabor({ ...editingLabor, seccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha Programada *</label>
                  <input
                    type="date"
                    required
                    value={editingLabor.fechaProgramada}
                    onChange={(e) => setEditingLabor({ ...editingLabor, fechaProgramada: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Responsable / Cuadrilla *</label>
                  <input
                    type="text"
                    required
                    value={editingLabor.responsableEquipo}
                    onChange={(e) => setEditingLabor({ ...editingLabor, responsableEquipo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Avance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingLabor.avancePorcentaje}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const estado = val === 100 ? 'Concluida' : val > 0 ? 'En curso' : 'Programada';
                      setEditingLabor({ ...editingLabor, avancePorcentaje: val, estado });
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado</label>
                  <select
                    value={editingLabor.estado}
                    onChange={(e) => setEditingLabor({ ...editingLabor, estado: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Programada">Programada</option>
                    <option value="En curso">En curso</option>
                    <option value="Concluida">Concluida</option>
                    <option value="Atrasada">Atrasada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Incidencias y Observaciones</label>
                <textarea
                  rows={2}
                  value={editingLabor.incidencias || ''}
                  onChange={(e) => setEditingLabor({ ...editingLabor, incidencias: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingLabor(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Actualizar Labor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                Programar Labor Cultural
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Labor Cultural *</label>
                <select
                  value={formData.labor}
                  onChange={(e) => setFormData({ ...formData, labor: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Desahije">Desahije</option>
                  <option value="Tutoreo">Tutoreo</option>
                  <option value="Toque de hoja">Toque de hoja</option>
                  <option value="Desmalezado">Desmalezado</option>
                  <option value="Pinch">Pinch</option>
                  <option value="Poda">Poda</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Manejo de cortinas">Manejo de cortinas</option>
                  <option value="Descompactación">Descompactación</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sección *</label>
                  <input
                    type="text"
                    required
                    value={formData.seccion}
                    onChange={(e) => setFormData({ ...formData, seccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha Programada *</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaProgramada}
                    onChange={(e) => setFormData({ ...formData, fechaProgramada: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Equipo / Responsable *</label>
                  <input
                    type="text"
                    required
                    value={formData.responsableEquipo}
                    onChange={(e) => setFormData({ ...formData, responsableEquipo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Avance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.avancePorcentaje}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const estado = val === 100 ? 'Concluida' : val > 0 ? 'En curso' : 'Programada';
                      setFormData({ ...formData, avancePorcentaje: val, estado });
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Programada">Programada</option>
                    <option value="En curso">En curso</option>
                    <option value="Concluida">Concluida</option>
                    <option value="Atrasada">Atrasada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Incidencias y Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de la labor, brotación, clima, evidencia de avance..."
                  value={formData.incidencias}
                  onChange={(e) => setFormData({ ...formData, incidencias: e.target.value })}
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
                  Programar Labor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
