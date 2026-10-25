import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FertirrigationRecord } from '../../types';
import { Plus, Trash2, Droplets, Gauge, Calculator, X, DollarSign } from 'lucide-react';

export const RiegoFertirrigacionModule: React.FC = () => {
  const { fertirrigationRecords, addFertirrigation, deleteFertirrigation } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

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
  const [calcFrecuencia, setCalcFrecuencia] = useState<number>(3); // riegos por semana
  const [calcDosisGramosM2, setCalcDosisGramosM2] = useState<number>(5.5); // g/m2 por riego

  const calcTotalKgSemana = Number(((calcAreaM2 * calcDosisGramosM2 * calcFrecuencia) / 1000).toFixed(1));
  const calcVolumenEstimadoM3 = Number(((calcAreaM2 * 1.2 * calcFrecuencia) / 1000).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = Number(((formData.caudalLitrosHora * (formData.tiempoRiegoMin / 60)) / 1000).toFixed(2));
    addFertirrigation({
      ...formData,
      volumenM3: vol
    });
    setShowModal(false);
  };

  const totalVolumenM3 = fertirrigationRecords.reduce((acc, r) => acc + (r.volumenM3 || 0), 0);
  const totalCosto = fertirrigationRecords.reduce((acc, r) => acc + (r.costoEstimado || 0), 0);
  const promedioPh = fertirrigationRecords.length > 0
    ? (fertirrigationRecords.reduce((acc, r) => acc + r.ph, 0) / fertirrigationRecords.length).toFixed(2)
    : '0';
  const promedioCE = fertirrigationRecords.length > 0
    ? (fertirrigationRecords.reduce((acc, r) => acc + r.conductividadElectrica, 0) / fertirrigationRecords.length).toFixed(2)
    : '0';

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg border border-stone-300 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Calculadora Dosis</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">pH Promedio Solución</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{promedioPh}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Rango ideal: 5.6 - 6.2</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">CE Promedio</span>
          <p className="text-xl font-black text-stone-900 mt-1">{promedioCE} mS/cm</p>
          <span className="text-[10px] text-stone-500 font-medium">Rango ideal: 1.4 - 1.8</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Costo Fertilizantes</span>
          <p className="text-xl font-black text-stone-900 mt-1">${totalCosto.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Gasto en soluciones</span>
        </div>
      </div>

      {/* Interactive Fertilizer Calculator Panel */}
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

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Historial de Fertirriego y Parámetros</h3>
          <span className="text-xs text-stone-500 font-medium">{fertirrigationRecords.length} eventos</span>
        </div>

        {fertirrigationRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Droplets className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay riegos registrados.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Riego" para asentar aforos, pH, CE y nutrición.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Fecha & Sector</th>
                  <th className="py-3 px-4">Tiempo & Caudal</th>
                  <th className="py-3 px-4">Volumen Aplicado</th>
                  <th className="py-3 px-4">pH / CE</th>
                  <th className="py-3 px-4">Tensiómetro</th>
                  <th className="py-3 px-4">Receta Tanques A y B</th>
                  <th className="py-3 px-4">Costo Est.</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {fertirrigationRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{rec.sector}</div>
                      <div className="text-[11px] text-stone-500">{rec.fecha} &bull; {rec.modulo}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{rec.tiempoRiegoMin} minutos</div>
                      <div className="text-[11px] text-stone-500">{rec.caudalLitrosHora.toLocaleString()} L/h</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {rec.volumenM3} m³
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-stone-800">
                        <span>pH: {rec.ph}</span>
                        <span className="text-stone-300">|</span>
                        <span className="text-emerald-800">CE: {rec.conductividadElectrica} mS/cm</span>
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
                      <button
                        onClick={() => deleteFertirrigation(rec.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-emerald-700" />
                Registrar Riego y Nutrición
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">pH de Solución (5.5 - 6.5)</label>
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
                  onClick={() => setShowModal(false)}
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
