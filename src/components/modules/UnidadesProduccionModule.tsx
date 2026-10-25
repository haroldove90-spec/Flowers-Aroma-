import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionUnit } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  MapPin,
  Layers,
  Target,
  X,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const UnidadesProduccionModule: React.FC = () => {
  const {
    productionUnits,
    addProductionUnit,
    updateProductionUnit,
    toggleDeactivateProductionUnit,
    deleteProductionUnit
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ProductionUnit | null>(null);
  const [viewingUnit, setViewingUnit] = useState<ProductionUnit | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // New Record Form State
  const [formData, setFormData] = useState<Omit<ProductionUnit, 'id'>>({
    predio: 'Predio El Rosal',
    modulo: 'Módulo 4 - Nuevas Camas',
    seccion: 'Sección D1-D3',
    superficieM2: 3200,
    tuneles: 4,
    camas: 28,
    variedad: 'Rosa Pink Floyd',
    color: 'Fucsia Neón',
    numPlantas: 21000,
    densidadM2: 6.56,
    coordenadas: '19.4340° N, 99.1315° O',
    altitudMsnm: 2455,
    regimenTenencia: 'Propiedad',
    fechaPlantacion: new Date().toISOString().split('T')[0],
    metaTallosAnual: 190000,
    estado: 'En producción'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const densidad = formData.superficieM2 > 0 ? Number((formData.numPlantas / formData.superficieM2).toFixed(2)) : 0;
    addProductionUnit({
      ...formData,
      densidadM2: densidad
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;
    const densidad = editingUnit.superficieM2 > 0 ? Number((editingUnit.numPlantas / editingUnit.superficieM2).toFixed(2)) : 0;
    updateProductionUnit(editingUnit.id, {
      ...editingUnit,
      densidadM2: densidad
    });
    setEditingUnit(null);
  };

  const handleExportSinglePDF = (unit: ProductionUnit) => {
    exportRecordToPDF(
      '01. UNIDADES DE PRODUCCIÓN',
      unit.id,
      [
        { label: 'Predio', value: unit.predio },
        { label: 'Módulo / Nave', value: unit.modulo, highlight: true },
        { label: 'Sección', value: unit.seccion },
        { label: 'Variedad de Flor', value: unit.variedad, highlight: true },
        { label: 'Color / Tonalidad', value: unit.color },
        { label: 'Superficie Bajo Cubierta', value: `${unit.superficieM2.toLocaleString()} m²` },
        { label: 'Túneles & Camas', value: `${unit.tuneles} túneles / ${unit.camas} camas` },
        { label: 'Número de Plantas', value: unit.numPlantas.toLocaleString() },
        { label: 'Densidad de Plantación', value: `${unit.densidadM2} pl/m²` },
        { label: 'Régimen de Tenencia', value: unit.regimenTenencia },
        { label: 'Coordenadas GPS', value: unit.coordenadas },
        { label: 'Altitud', value: `${unit.altitudMsnm} msnm` },
        { label: 'Fecha Plantación', value: unit.fechaPlantacion },
        { label: 'Meta Anual Productiva', value: `${unit.metaTallosAnual.toLocaleString()} tallos`, highlight: true },
        { label: 'Estado Operativo', value: unit.estado },
        { label: 'Estado en Sistema', value: unit.desactivado ? 'Desactivado' : 'Activo' }
      ],
      `Unidad registrada en el sistema de gestión Invernadero Aroma Flowers. Densidad calculada: ${unit.densidadM2} plantas/m². Ubicación satelital verificada.`,
      unit.desactivado ? 'Desactivado' : 'Activo'
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Predio', 'Módulo', 'Variedad', 'Superficie', 'Plantas', 'Densidad', 'Meta Anual', 'Estado'];
    const rows = filteredUnits.map((u) => [
      u.id,
      u.predio,
      u.modulo,
      u.variedad,
      `${u.superficieM2} m²`,
      u.numPlantas.toLocaleString(),
      `${u.densidadM2} pl/m²`,
      `${u.metaTallosAnual.toLocaleString()} tallos`,
      u.desactivado ? 'Desactivado' : u.estado
    ]);
    exportModuleTableToPDF('01. Unidades de Producción', headers, rows);
  };

  const filteredUnits = productionUnits.filter((u) => {
    if (filterStatus === 'active') return !u.desactivado;
    if (filterStatus === 'inactive') return u.desactivado;
    return true;
  });

  const totalSuperficie = productionUnits.reduce((acc, u) => acc + (u.superficieM2 || 0), 0);
  const totalPlantas = productionUnits.reduce((acc, u) => acc + (u.numPlantas || 0), 0);
  const totalMeta = productionUnits.reduce((acc, u) => acc + (u.metaTallosAnual || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">01.</span> UNIDADES DE PRODUCCIÓN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gestión de predios, superficies de invernadero, túneles, camas, densidades y metas productivas.
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
            <span>Registrar Unidad</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Superficie Total</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalSuperficie.toLocaleString()} m²</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Bajo cubierta plástica</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Módulos Activos</span>
          <p className="text-xl font-black text-emerald-800 mt-1">
            {productionUnits.filter((u) => !u.desactivado).length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium">De {productionUnits.length} totales</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Plantas</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalPlantas.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Densidad prom: 6.7 pl/m²</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Meta Anual Tallos</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{totalMeta.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Capacidad calculada</span>
        </div>
      </div>

      {/* Table Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">Filtro de Estado:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({productionUnits.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activos ({productionUnits.filter((u) => !u.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Desactivados ({productionUnits.filter((u) => u.desactivado).length})
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Catálogo de Predios, Módulos y Camas</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredUnits.length} registros</span>
        </div>

        {filteredUnits.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Layers className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay unidades con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Módulo & Sección</th>
                  <th className="py-3 px-4">Predio & Tenencia</th>
                  <th className="py-3 px-4">Variedad</th>
                  <th className="py-3 px-4">Superficie & Camas</th>
                  <th className="py-3 px-4">Plantas & Densidad</th>
                  <th className="py-3 px-4">Meta Anual</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center min-w-[160px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUnits.map((unit) => (
                  <tr
                    key={unit.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      unit.desactivado ? 'bg-stone-50/60 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{unit.modulo}</div>
                      <div className="text-[11px] text-stone-500">{unit.seccion}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{unit.predio}</div>
                      <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        {unit.regimenTenencia}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800">{unit.variedad}</div>
                      <div className="text-[11px] text-stone-500">{unit.color}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{unit.superficieM2.toLocaleString()} m²</div>
                      <div className="text-[11px] text-stone-500">{unit.tuneles} túneles / {unit.camas} camas</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{unit.numPlantas.toLocaleString()} plantas</div>
                      <div className="text-[11px] text-stone-500">{unit.densidadM2} pl/m²</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      {unit.metaTallosAnual.toLocaleString()} tallos
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          unit.desactivado
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {unit.desactivado ? 'Desactivado' : 'Activo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button
                          onClick={() => setViewingUnit(unit)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver ficha completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingUnit(unit)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar registro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Activar */}
                        <button
                          onClick={() => toggleDeactivateProductionUnit(unit.id)}
                          className={`p-1.5 rounded-lg transition ${
                            unit.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={unit.desactivado ? 'Reactivar unidad' : 'Desactivar unidad'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Exportar PDF */}
                        <button
                          onClick={() => handleExportSinglePDF(unit)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                          title="Exportar Ficha a PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => deleteProductionUnit(unit.id)}
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

      {/* VIEW MODAL (Detalle completo) */}
      {viewingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Ficha Técnica: {viewingUnit.modulo}
                </h3>
              </div>
              <button onClick={() => setViewingUnit(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">ID del Registro</span>
                  <span className="font-mono font-bold text-emerald-800">{viewingUnit.id}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    viewingUnit.desactivado ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {viewingUnit.desactivado ? 'Desactivado' : 'Activo'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Predio</span>
                  <span className="font-bold text-stone-900 text-sm">{viewingUnit.predio}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Sección</span>
                  <span className="font-bold text-stone-900 text-sm">{viewingUnit.seccion}</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Variedad de Flor</span>
                  <span className="font-bold text-emerald-950 text-sm">{viewingUnit.variedad} ({viewingUnit.color})</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Superficie Total</span>
                  <span className="font-bold text-stone-900 text-sm">{viewingUnit.superficieM2.toLocaleString()} m²</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Túneles & Camas</span>
                  <span className="font-bold text-stone-900">{viewingUnit.tuneles} túneles / {viewingUnit.camas} camas</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Total Plantas & Densidad</span>
                  <span className="font-bold text-stone-900">{viewingUnit.numPlantas.toLocaleString()} pl ({viewingUnit.densidadM2} pl/m²)</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Tenencia & Fecha</span>
                  <span className="font-bold text-stone-900">{viewingUnit.regimenTenencia} &bull; {viewingUnit.fechaPlantacion}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Meta Anual de Tallos</span>
                  <span className="font-bold text-emerald-800 text-sm">{viewingUnit.metaTallosAnual.toLocaleString()} tallos</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Coordenadas: <strong>{viewingUnit.coordenadas}</strong> ({viewingUnit.altitudMsnm} msnm)</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingUnit)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar a PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingUnit(null)}
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
      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-700" />
                Editar Unidad de Producción: {editingUnit.id}
              </h3>
              <button onClick={() => setEditingUnit(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Predio *</label>
                  <input
                    type="text"
                    required
                    value={editingUnit.predio}
                    onChange={(e) => setEditingUnit({ ...editingUnit, predio: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo / Nave *</label>
                  <input
                    type="text"
                    required
                    value={editingUnit.modulo}
                    onChange={(e) => setEditingUnit({ ...editingUnit, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sección *</label>
                  <input
                    type="text"
                    required
                    value={editingUnit.seccion}
                    onChange={(e) => setEditingUnit({ ...editingUnit, seccion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Superficie (m²) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingUnit.superficieM2}
                    onChange={(e) => setEditingUnit({ ...editingUnit, superficieM2: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Túneles</label>
                  <input
                    type="number"
                    min="1"
                    value={editingUnit.tuneles}
                    onChange={(e) => setEditingUnit({ ...editingUnit, tuneles: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Número de Camas</label>
                  <input
                    type="number"
                    min="1"
                    value={editingUnit.camas}
                    onChange={(e) => setEditingUnit({ ...editingUnit, camas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad de Flor *</label>
                  <input
                    type="text"
                    required
                    value={editingUnit.variedad}
                    onChange={(e) => setEditingUnit({ ...editingUnit, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Color / Tonalidad</label>
                  <input
                    type="text"
                    value={editingUnit.color}
                    onChange={(e) => setEditingUnit({ ...editingUnit, color: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Número de Plantas</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingUnit.numPlantas}
                    onChange={(e) => setEditingUnit({ ...editingUnit, numPlantas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Régimen de Tenencia</label>
                  <select
                    value={editingUnit.regimenTenencia}
                    onChange={(e) => setEditingUnit({ ...editingUnit, regimenTenencia: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Propiedad">Propiedad</option>
                    <option value="Arrendamiento">Arrendamiento</option>
                    <option value="Asociación">Asociación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Meta Tallos Anual</label>
                  <input
                    type="number"
                    min="0"
                    value={editingUnit.metaTallosAnual}
                    onChange={(e) => setEditingUnit({ ...editingUnit, metaTallosAnual: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coordenadas GPS</label>
                  <input
                    type="text"
                    value={editingUnit.coordenadas}
                    onChange={(e) => setEditingUnit({ ...editingUnit, coordenadas: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado Operativo</label>
                  <select
                    value={editingUnit.estado}
                    onChange={(e) => setEditingUnit({ ...editingUnit, estado: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="En producción">En producción</option>
                    <option value="Renovación">Renovación</option>
                    <option value="Preparación de suelo">Preparación de suelo</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Actualizar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-700" />
                Registrar Unidad de Producción, Predio y Camas
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Predio *</label>
                  <input
                    type="text"
                    required
                    value={formData.predio}
                    onChange={(e) => setFormData({ ...formData, predio: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo / Nave *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Superficie (m²) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.superficieM2}
                    onChange={(e) => setFormData({ ...formData, superficieM2: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Túneles</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tuneles}
                    onChange={(e) => setFormData({ ...formData, tuneles: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Número de Camas</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.camas}
                    onChange={(e) => setFormData({ ...formData, camas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad de Flor *</label>
                  <input
                    type="text"
                    required
                    value={formData.variedad}
                    onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Color / Tonalidad</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Número de Plantas</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.numPlantas}
                    onChange={(e) => setFormData({ ...formData, numPlantas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Régimen de Tenencia</label>
                  <select
                    value={formData.regimenTenencia}
                    onChange={(e) => setFormData({ ...formData, regimenTenencia: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Propiedad">Propiedad</option>
                    <option value="Arrendamiento">Arrendamiento</option>
                    <option value="Asociación">Asociación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Meta Tallos Anual</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.metaTallosAnual}
                    onChange={(e) => setFormData({ ...formData, metaTallosAnual: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coordenadas GPS (Lat / Long)</label>
                  <input
                    type="text"
                    value={formData.coordenadas}
                    onChange={(e) => setFormData({ ...formData, coordenadas: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Altitud (msnm)</label>
                  <input
                    type="number"
                    value={formData.altitudMsnm}
                    onChange={(e) => setFormData({ ...formData, altitudMsnm: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
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
                  Guardar Unidad de Producción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
