import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CostRecord } from '../../types';
import {
  Plus,
  Trash2,
  PieChart,
  TrendingUp,
  Calculator,
  DollarSign,
  X,
  Eye,
  Edit2,
  Power,
  FileDown,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';

export const CostosRentabilidadModule: React.FC = () => {
  const { costRecords, addCost, updateCost, toggleDeactivateCost, deleteCost, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewingCost, setViewingCost] = useState<CostRecord | null>(null);
  const [editingCost, setEditingCost] = useState<CostRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'desactivados'>('todos');

  const [formData, setFormData] = useState<Omit<CostRecord, 'id'>>({
    modulo: 'Módulo 3 - Variedades Especiales (Explorer)',
    variedad: 'Rosa Explorer',
    periodoMes: 'Octubre 2026',
    costoManoObra: 14500,
    costoAguaEnergia: 5200,
    costoInsumos: 12800,
    costoFijoIndirecto: 6500,
    totalCosto: 39000,
    tallosProducidos: 20000,
    costoPorTallo: 1.95,
    costoPorPaquete: 48.75,
    precioPromedioVentaPaquete: 215.00,
    margenContribucionPorc: 77.3
  });

  const handleCostsChange = (mo: number, ae: number, ins: number, fix: number, tallos: number, precioPaq: number) => {
    const total = mo + ae + ins + fix;
    const costTallo = tallos > 0 ? Number((total / tallos).toFixed(2)) : 0;
    const costPaq = Number((costTallo * 25).toFixed(2));
    const margen = precioPaq > 0 ? Number((((precioPaq - costPaq) / precioPaq) * 100).toFixed(1)) : 0;

    setFormData({
      ...formData,
      costoManoObra: mo,
      costoAguaEnergia: ae,
      costoInsumos: ins,
      costoFijoIndirecto: fix,
      totalCosto: total,
      tallosProducidos: tallos,
      costoPorTallo: costTallo,
      costoPorPaquete: costPaq,
      precioPromedioVentaPaquete: precioPaq,
      margenContribucionPorc: margen
    });
  };

  const handleEditCostsChange = (mo: number, ae: number, ins: number, fix: number, tallos: number, precioPaq: number) => {
    if (!editingCost) return;
    const total = mo + ae + ins + fix;
    const costTallo = tallos > 0 ? Number((total / tallos).toFixed(2)) : 0;
    const costPaq = Number((costTallo * 25).toFixed(2));
    const margen = precioPaq > 0 ? Number((((precioPaq - costPaq) / precioPaq) * 100).toFixed(1)) : 0;

    setEditingCost({
      ...editingCost,
      costoManoObra: mo,
      costoAguaEnergia: ae,
      costoInsumos: ins,
      costoFijoIndirecto: fix,
      totalCosto: total,
      tallosProducidos: tallos,
      costoPorTallo: costTallo,
      costoPorPaquete: costPaq,
      precioPromedioVentaPaquete: precioPaq,
      margenContribucionPorc: margen
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCost(formData);
    setShowModal(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCost) return;
    updateCost(editingCost.id, editingCost);
    setEditingCost(null);
  };

  const handleExportSinglePDF = (c: CostRecord) => {
    exportRecordToPDF('10. COSTOS Y RENTABILIDAD', `Costo Variedad - ${c.variedad} (${c.periodoMes})`, [
      { label: 'Variedad / Flor', value: c.variedad },
      { label: 'Módulo / Invernadero', value: c.modulo },
      { label: 'Periodo Evaluado', value: c.periodoMes },
      { label: 'Mano de Obra Directa', value: `$${c.costoManoObra.toLocaleString()} MXN` },
      { label: 'Agua y Energía', value: `$${c.costoAguaEnergia.toLocaleString()} MXN` },
      { label: 'Insumos y Agroquímicos', value: `$${c.costoInsumos.toLocaleString()} MXN` },
      { label: 'Costos Indirectos Fijos', value: `$${c.costoFijoIndirecto.toLocaleString()} MXN` },
      { label: 'Costo Total Acumulado', value: `$${c.totalCosto.toLocaleString()} MXN` },
      { label: 'Tallos Cosechados', value: `${c.tallosProducidos.toLocaleString()} tallos` },
      { label: 'Costo Unitario por Tallo', value: `$${c.costoPorTallo} MXN` },
      { label: 'Costo por Paquete (25u)', value: `$${c.costoPorPaquete} MXN` },
      { label: 'Precio Promedio Venta', value: `$${c.precioPromedioVentaPaquete} MXN / paquete` },
      { label: 'Margen de Contribución', value: `${c.margenContribucionPorc}%` },
      { label: 'Estado en Sistema', value: c.desactivado ? 'DESACTIVADO' : 'ACTIVO' }
    ]);
    showToast(`PDF de costos para ${c.variedad} generado`, 'success');
  };

  const handleExportTablePDF = () => {
    exportModuleTableToPDF(
      '10. COSTOS Y RENTABILIDAD',
      'Estructura de Costos y Márgenes por Variedad',
      ['Variedad', 'Módulo', 'Periodo', 'Total Costo', 'Tallos', 'Costo Tallo', 'Costo Paq 25', 'Margen %', 'Estado'],
      filteredRecords.map((c) => [
        c.variedad,
        c.modulo,
        c.periodoMes,
        `$${c.totalCosto.toLocaleString()}`,
        `${c.tallosProducidos.toLocaleString()}`,
        `$${c.costoPorTallo}`,
        `$${c.costoPorPaquete}`,
        `${c.margenContribucionPorc}%`,
        c.desactivado ? 'Desactivado' : 'Activo'
      ])
    );
    showToast('Reporte en PDF de Costos generado', 'success');
  };

  const filteredRecords = costRecords.filter((c) => {
    if (statusFilter === 'activos') return !c.desactivado;
    if (statusFilter === 'desactivados') return c.desactivado;
    return true;
  });

  const activeRecords = costRecords.filter((c) => !c.desactivado);
  const totalDesactivados = costRecords.filter((c) => c.desactivado).length;

  const costoTalloPromedio = activeRecords.length > 0
    ? (activeRecords.reduce((acc, c) => acc + c.costoPorTallo, 0) / activeRecords.length).toFixed(2)
    : '0';

  const costoPaquetePromedio = activeRecords.length > 0
    ? (activeRecords.reduce((acc, c) => acc + c.costoPorPaquete, 0) / activeRecords.length).toFixed(2)
    : '0';

  const margenPromedio = activeRecords.length > 0
    ? Math.round(activeRecords.reduce((acc, c) => acc + c.margenContribucionPorc, 0) / activeRecords.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">10.</span> COSTOS Y RENTABILIDAD
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Estructura de costos directos/indirectos, costo por tallo, paquete de 25 y margen de contribución por variedad.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportTablePDF}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Exportar Tabla PDF</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Calcular Costos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Costo Promedio por Tallo</span>
          <p className="text-xl font-black text-stone-900 mt-1">${costoTalloPromedio} MXN</p>
          <span className="text-[10px] text-stone-500 font-medium">Incluye mano de obra e insumos</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Costo Paquete (25 tallos)</span>
          <p className="text-xl font-black text-stone-900 mt-1">${costoPaquetePromedio} MXN</p>
          <span className="text-[10px] text-stone-500 font-medium">Base de costeo comercial</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Margen de Contribución</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{margenPromedio}%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Rentabilidad operativa alta</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Punto de Equilibrio</span>
          <p className="text-xl font-black text-stone-900 mt-1">11,200 tallos</p>
          <span className="text-[10px] text-stone-500 font-medium">Volumen mínimo mensual</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">Análisis Económico por Variedad y Módulo</h3>
            <span className="text-xs text-stone-500 font-medium">({filteredRecords.length} análisis)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Filtrar:</span>
            <div className="inline-flex rounded-lg border border-stone-200 p-0.5 bg-stone-50">
              <button
                onClick={() => setStatusFilter('todos')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'todos' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todos ({costRecords.length})
              </button>
              <button
                onClick={() => setStatusFilter('activos')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'activos' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Activos ({costRecords.length - totalDesactivados})
              </button>
              <button
                onClick={() => setStatusFilter('desactivados')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'desactivados' ? 'bg-white text-red-700 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Desactivados ({totalDesactivados})
              </button>
            </div>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <PieChart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay análisis de costos con este criterio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Variedad & Módulo</th>
                  <th className="py-3 px-4">Periodo</th>
                  <th className="py-3 px-4">Desglose Costos (MO / Insumos / Energía)</th>
                  <th className="py-3 px-4">Costo Total</th>
                  <th className="py-3 px-4">Tallos</th>
                  <th className="py-3 px-4">Costo / Tallo & Paq.</th>
                  <th className="py-3 px-4">Margen %</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRecords.map((c) => {
                  const isDeactivated = c.desactivado;
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isDeactivated ? 'bg-stone-50/50 opacity-70' : ''}`}
                    >
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        <div className="font-bold text-emerald-800">{c.variedad}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[160px]">{c.modulo}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {c.periodoMes}
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-[11px]">
                        <div>MO: ${c.costoManoObra.toLocaleString()} &bull; Ins: ${c.costoInsumos.toLocaleString()}</div>
                        <div>Energía: ${c.costoAguaEnergia.toLocaleString()} &bull; Fijo: ${c.costoFijoIndirecto.toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        ${c.totalCosto.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {c.tallosProducidos.toLocaleString()} tallos
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        <div>${c.costoPorTallo}/tallo</div>
                        <div className="text-[11px] text-stone-500">${c.costoPorPaquete}/paquete</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                          {c.margenContribucionPorc}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isDeactivated ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isDeactivated ? 'Desactivado' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingCost(c)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Ver desglose completo"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCost(c)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Editar costeo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleDeactivateCost(c.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isDeactivated
                                ? 'text-red-600 hover:text-emerald-700 hover:bg-emerald-50'
                                : 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={isDeactivated ? 'Reactivar costeo' : 'Desactivar costeo'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportSinglePDF(c)}
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="Descargar Ficha en PDF"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCost(c.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar análisis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Ver Detalles */}
      {viewingCost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Análisis Unitario de Rentabilidad</h3>
              </div>
              <button onClick={() => setViewingCost(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 font-bold block">Variedad</span>
                  <span className="font-black text-stone-900 text-sm">{viewingCost.variedad}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Estado en Sistema</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${viewingCost.desactivado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {viewingCost.desactivado ? 'Desactivado' : 'Activo'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Módulo & Periodo</span>
                <span className="font-semibold text-stone-800">{viewingCost.modulo} &bull; {viewingCost.periodoMes}</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-emerald-800 font-bold text-[10px] block">Costo / Tallo</span>
                  <span className="text-base font-black text-emerald-950">${viewingCost.costoPorTallo}</span>
                </div>
                <div>
                  <span className="text-emerald-800 font-bold text-[10px] block">Costo Paq 25</span>
                  <span className="text-base font-black text-emerald-950">${viewingCost.costoPorPaquete}</span>
                </div>
                <div>
                  <span className="text-emerald-800 font-bold text-[10px] block">Margen %</span>
                  <span className="text-base font-black text-emerald-950">{viewingCost.margenContribucionPorc}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block">Mano de Obra</span>
                  <span className="font-black text-stone-900">${viewingCost.costoManoObra.toLocaleString()} MXN</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block">Agua y Energía</span>
                  <span className="font-black text-stone-900">${viewingCost.costoAguaEnergia.toLocaleString()} MXN</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block">Insumos y Fertilizantes</span>
                  <span className="font-black text-stone-900">${viewingCost.costoInsumos.toLocaleString()} MXN</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block">Costos Fijos Indirectos</span>
                  <span className="font-black text-stone-900">${viewingCost.costoFijoIndirecto.toLocaleString()} MXN</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-100 rounded-lg">
                <div>
                  <span className="text-stone-600 font-bold block">Costo Total Periodo</span>
                  <span className="font-black text-stone-900 text-sm">${viewingCost.totalCosto.toLocaleString()} MXN</span>
                </div>
                <div>
                  <span className="text-stone-600 font-bold block">Tallos Cosechados</span>
                  <span className="font-black text-stone-900 text-sm">{viewingCost.tallosProducidos.toLocaleString()} tallos</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingCost)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold"
                >
                  <FileDown className="w-4 h-4 text-emerald-700" />
                  Descargar Ficha PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingCost(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Análisis */}
      {editingCost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Editar Análisis de Costos ({editingCost.variedad})
              </h3>
              <button onClick={() => setEditingCost(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo / Nave</label>
                  <input
                    type="text"
                    required
                    value={editingCost.modulo}
                    onChange={(e) => setEditingCost({ ...editingCost, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad</label>
                  <input
                    type="text"
                    required
                    value={editingCost.variedad}
                    onChange={(e) => setEditingCost({ ...editingCost, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Periodo (Mes/Año)</label>
                <input
                  type="text"
                  required
                  value={editingCost.periodoMes}
                  onChange={(e) => setEditingCost({ ...editingCost, periodoMes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Costos Directos e Indirectos</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Mano de Obra ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCost.costoManoObra}
                      onChange={(e) => handleEditCostsChange(
                        Number(e.target.value),
                        editingCost.costoAguaEnergia,
                        editingCost.costoInsumos,
                        editingCost.costoFijoIndirecto,
                        editingCost.tallosProducidos,
                        editingCost.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Agua y Energía ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCost.costoAguaEnergia}
                      onChange={(e) => handleEditCostsChange(
                        editingCost.costoManoObra,
                        Number(e.target.value),
                        editingCost.costoInsumos,
                        editingCost.costoFijoIndirecto,
                        editingCost.tallosProducidos,
                        editingCost.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Insumos/Químicos ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCost.costoInsumos}
                      onChange={(e) => handleEditCostsChange(
                        editingCost.costoManoObra,
                        editingCost.costoAguaEnergia,
                        Number(e.target.value),
                        editingCost.costoFijoIndirecto,
                        editingCost.tallosProducidos,
                        editingCost.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Indirectos Fijos ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCost.costoFijoIndirecto}
                      onChange={(e) => handleEditCostsChange(
                        editingCost.costoManoObra,
                        editingCost.costoAguaEnergia,
                        editingCost.costoInsumos,
                        Number(e.target.value),
                        editingCost.tallosProducidos,
                        editingCost.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tallos Cosechados</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCost.tallosProducidos}
                    onChange={(e) => handleEditCostsChange(
                      editingCost.costoManoObra,
                      editingCost.costoAguaEnergia,
                      editingCost.costoInsumos,
                      editingCost.costoFijoIndirecto,
                      Number(e.target.value),
                      editingCost.precioPromedioVentaPaquete
                    )}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Precio Venta Paquete (25u)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCost.precioPromedioVentaPaquete}
                    onChange={(e) => handleEditCostsChange(
                      editingCost.costoManoObra,
                      editingCost.costoAguaEnergia,
                      editingCost.costoInsumos,
                      editingCost.costoFijoIndirecto,
                      editingCost.tallosProducidos,
                      Number(e.target.value)
                    )}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingCost(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Actualizar Análisis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Análisis */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-700" />
                Calcular Costo y Margen por Variedad
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo / Nave</label>
                  <input
                    type="text"
                    required
                    value={formData.modulo}
                    onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad</label>
                  <input
                    type="text"
                    required
                    value={formData.variedad}
                    onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Periodo (Mes/Año)</label>
                <input
                  type="text"
                  required
                  value={formData.periodoMes}
                  onChange={(e) => setFormData({ ...formData, periodoMes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Costos Directos e Indirectos</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Mano de Obra ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.costoManoObra}
                      onChange={(e) => handleCostsChange(
                        Number(e.target.value),
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Agua y Energía ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.costoAguaEnergia}
                      onChange={(e) => handleCostsChange(
                        formData.costoManoObra,
                        Number(e.target.value),
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Insumos/Químicos ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.costoInsumos}
                      onChange={(e) => handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        Number(e.target.value),
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Indirectos Fijos ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.costoFijoIndirecto}
                      onChange={(e) => handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        Number(e.target.value),
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tallos Cosechados</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tallosProducidos}
                    onChange={(e) => handleCostsChange(
                      formData.costoManoObra,
                      formData.costoAguaEnergia,
                      formData.costoInsumos,
                      formData.costoFijoIndirecto,
                      Number(e.target.value),
                      formData.precioPromedioVentaPaquete
                    )}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Precio Venta Paquete (25u)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.precioPromedioVentaPaquete}
                    onChange={(e) => handleCostsChange(
                      formData.costoManoObra,
                      formData.costoAguaEnergia,
                      formData.costoInsumos,
                      formData.costoFijoIndirecto,
                      formData.tallosProducidos,
                      Number(e.target.value)
                    )}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Guardar Costeo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
