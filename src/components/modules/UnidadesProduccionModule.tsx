import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionUnit } from '../../types';
import { Plus, Trash2, MapPin, Layers, Target, Compass, X } from 'lucide-react';

export const UnidadesProduccionModule: React.FC = () => {
  const { productionUnits, addProductionUnit, deleteProductionUnit } = useApp();
  const [showModal, setShowModal] = useState(false);

  // Form State
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const densidad = formData.superficieM2 > 0 ? Number((formData.numPlantas / formData.superficieM2).toFixed(2)) : 0;
    addProductionUnit({
      ...formData,
      densidadM2: densidad
    });
    setShowModal(false);
  };

  const totalSuperficie = productionUnits.reduce((acc, u) => acc + (u.superficieM2 || 0), 0);
  const totalPlantas = productionUnits.reduce((acc, u) => acc + (u.numPlantas || 0), 0);
  const totalMeta = productionUnits.reduce((acc, u) => acc + (u.metaTallosAnual || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with Title and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">01.</span> UNIDADES DE PRODUCCIÓN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gestión de predios, superficies de invernadero, túneles, camas, densidades y metas productivas.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Unidad / Cama</span>
        </button>
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
          <p className="text-xl font-black text-emerald-800 mt-1">{productionUnits.length}</p>
          <span className="text-[10px] text-stone-500 font-medium">Unidades censadas</span>
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

      {/* Responsive Table / Cards */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Catálogo de Predios, Módulos y Camas</h3>
          <span className="text-xs text-stone-500 font-medium">{productionUnits.length} registros</span>
        </div>

        {productionUnits.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Layers className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay unidades registradas.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Unidad / Cama" para ingresar un nuevo predio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Módulo & Sección</th>
                  <th className="py-3 px-4">Predio & Tenencia</th>
                  <th className="py-3 px-4">Variedad & Color</th>
                  <th className="py-3 px-4">Superficie & Camas</th>
                  <th className="py-3 px-4">Plantas & Densidad</th>
                  <th className="py-3 px-4">Ubicación GPS</th>
                  <th className="py-3 px-4">Meta Anual</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productionUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-stone-50/80 transition-colors">
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
                    <td className="py-3 px-4 text-stone-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                        <span className="truncate max-w-[130px]">{unit.coordenadas}</span>
                      </div>
                      <div className="text-[10px] text-stone-400">{unit.altitudMsnm} msnm</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      {unit.metaTallosAnual.toLocaleString()} tallos
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteProductionUnit(unit.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar registro"
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

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-700" />
                Registrar Unidad de Producción, Predio y Camas
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                    placeholder="Ej. Rosa Freedom, Rosa Explorer, Mondial..."
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
                  onClick={() => setShowModal(false)}
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
