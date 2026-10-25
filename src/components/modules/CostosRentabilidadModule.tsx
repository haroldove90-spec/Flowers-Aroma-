import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CostRecord } from '../../types';
import { Plus, Trash2, PieChart, TrendingUp, Calculator, DollarSign, X } from 'lucide-react';

export const CostosRentabilidadModule: React.FC = () => {
  const { costRecords, addCost, deleteCost } = useApp();
  const [showModal, setShowModal] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCost(formData);
    setShowModal(false);
  };

  const costoTalloPromedio = costRecords.length > 0
    ? (costRecords.reduce((acc, c) => acc + c.costoPorTallo, 0) / costRecords.length).toFixed(2)
    : '0';

  const costoPaquetePromedio = costRecords.length > 0
    ? (costRecords.reduce((acc, c) => acc + c.costoPorPaquete, 0) / costRecords.length).toFixed(2)
    : '0';

  const margenPromedio = costRecords.length > 0
    ? Math.round(costRecords.reduce((acc, c) => acc + c.margenContribucionPorc, 0) / costRecords.length)
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
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Calcular Costo por Variedad</span>
        </button>
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
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Análisis Económico por Variedad y Módulo</h3>
          <span className="text-xs text-stone-500 font-medium">{costRecords.length} análisis</span>
        </div>

        {costRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <PieChart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay análisis de costos registrados.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Calcular Costo por Variedad" para desglosar insumos, mano de obra y márgenes.</p>
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
                  <th className="py-3 px-4">Tallos Producidos</th>
                  <th className="py-3 px-4">Costo / Tallo & Paq.</th>
                  <th className="py-3 px-4">Margen %</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {costRecords.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="font-bold text-emerald-800">{c.variedad}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-[180px]">{c.modulo}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {c.periodoMes}
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-[11px]">
                      <div>MO: ${c.costoManoObra.toLocaleString()} &bull; Ins: ${c.costoInsumos.toLocaleString()}</div>
                      <div>Energía/Agua: ${c.costoAguaEnergia.toLocaleString()} &bull; Fijo: ${c.costoFijoIndirecto.toLocaleString()}</div>
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
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        {c.margenContribucionPorc}% margen
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteCost(c.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar análisis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                Cálculo de Costo y Margen de Variedad
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo y Variedad *</label>
                  <input
                    type="text"
                    required
                    value={formData.modulo}
                    onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Periodo (Mes/Año) *</label>
                  <input
                    type="text"
                    required
                    value={formData.periodoMes}
                    onChange={(e) => setFormData({ ...formData, periodoMes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mano de Obra ($)</label>
                  <input
                    type="number"
                    value={formData.costoManoObra}
                    onChange={(e) =>
                      handleCostsChange(
                        Number(e.target.value),
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Insumos/Fert ($)</label>
                  <input
                    type="number"
                    value={formData.costoInsumos}
                    onChange={(e) =>
                      handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        Number(e.target.value),
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Agua y Luz ($)</label>
                  <input
                    type="number"
                    value={formData.costoAguaEnergia}
                    onChange={(e) =>
                      handleCostsChange(
                        formData.costoManoObra,
                        Number(e.target.value),
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costos Fijos ($)</label>
                  <input
                    type="number"
                    value={formData.costoFijoIndirecto}
                    onChange={(e) =>
                      handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        Number(e.target.value),
                        formData.tallosProducidos,
                        formData.precioPromedioVentaPaquete
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tallos Producidos en Periodo</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tallosProducidos}
                    onChange={(e) =>
                      handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        Number(e.target.value),
                        formData.precioPromedioVentaPaquete
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Precio Promedio Venta Paquete 25 ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.precioPromedioVentaPaquete}
                    onChange={(e) =>
                      handleCostsChange(
                        formData.costoManoObra,
                        formData.costoAguaEnergia,
                        formData.costoInsumos,
                        formData.costoFijoIndirecto,
                        formData.tallosProducidos,
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Calculated Results Live */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Costo / Tallo</span>
                  <span className="text-sm font-black text-stone-900">${formData.costoPorTallo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Costo / Paquete 25</span>
                  <span className="text-sm font-black text-stone-900">${formData.costoPorPaquete}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">Margen de Ganancia</span>
                  <span className="text-sm font-black text-emerald-800">{formData.margenContribucionPorc}%</span>
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
                  Guardar Estructura de Costos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
