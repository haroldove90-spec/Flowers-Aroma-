import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HarvestRecord } from '../../types';
import { Plus, Trash2, Scissors, Thermometer, QrCode, AlertCircle, X, Sparkles } from 'lucide-react';

export const CosechaPoscosechaModule: React.FC = () => {
  const { harvestRecords, addHarvest, deleteHarvest } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedLotForQR, setSelectedLotForQR] = useState<HarvestRecord | null>(null);

  const [formData, setFormData] = useState<Omit<HarvestRecord, 'id'>>({
    codigoLote: 'LOT-EXP-' + new Date().toISOString().slice(2, 10).replace(/-/g, ''),
    fecha: new Date().toISOString().split('T')[0],
    modulo: 'Módulo 3 - Variedades Especiales',
    variedad: 'Rosa Explorer',
    tallosCortados: 5000,
    personalCorte: 'Cuadrilla Cosecha (Don Juan)',
    longitudCm: '60 cm',
    calidad: 'Exportación',
    paquetes25: 200,
    mermaTallos: 100,
    mermaCausa: 'Tallo doblado en acarreo',
    tratamientoHidratacion: 'Solución STS + Chrysal',
    temperaturaCamaraC: 2.2,
    humedadCamaraPorc: 89,
    estadoLote: 'Cámara Fría'
  });

  const handleTallosChange = (val: number) => {
    const p25 = Math.floor(val / 25);
    setFormData({ ...formData, tallosCortados: val, paquetes25: p25 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHarvest(formData);
    setShowModal(false);
  };

  const totalTallos = harvestRecords.reduce((acc, h) => acc + (h.tallosCortados || 0), 0);
  const totalPaquetes = harvestRecords.reduce((acc, h) => acc + (h.paquetes25 || 0), 0);
  const totalMerma = harvestRecords.reduce((acc, h) => acc + (h.mermaTallos || 0), 0);
  const mermaPorc = totalTallos > 0 ? ((totalMerma / totalTallos) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">06.</span> COSECHA Y POSCOSECHA
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Recepción de tallos, clasificación por longitud, conversión a paquetes de 25, cámara fría y trazabilidad por lote.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Entrada de Cosecha</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Tallos Cosechados</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalTallos.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Volumen procesado</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Paquetes de 25</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{totalPaquetes.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Listos para mercado</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Merma de Selección</span>
          <p className="text-xl font-black text-red-600 mt-1">{mermaPorc}%</p>
          <span className="text-[10px] text-stone-500 font-medium">{totalMerma.toLocaleString()} tallos descartados</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Cámara Fría</span>
          <p className="text-xl font-black text-blue-700 mt-1">2.1 °C / 89% HR</p>
          <span className="text-[10px] text-blue-600 font-medium">Cadena de frío activa</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Control de Lotes y Poscosecha</h3>
          <span className="text-xs text-stone-500 font-medium">{harvestRecords.length} lotes</span>
        </div>

        {harvestRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Scissors className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay registros de cosecha.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Entrada de Cosecha" para iniciar el empaque y trazabilidad.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Lote & Fecha</th>
                  <th className="py-3 px-4">Variedad & Módulo</th>
                  <th className="py-3 px-4">Tallos / Paquetes 25</th>
                  <th className="py-3 px-4">Clasificación & Longitud</th>
                  <th className="py-3 px-4">Merma & Causa</th>
                  <th className="py-3 px-4">Cámara Fría</th>
                  <th className="py-3 px-4">Trazabilidad QR</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {harvestRecords.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="font-mono text-emerald-800">{h.codigoLote}</div>
                      <div className="text-[11px] text-stone-500">{h.fecha}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-800">
                      <div className="font-bold text-stone-900">{h.variedad}</div>
                      <div className="text-[11px] text-stone-500">{h.modulo}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div className="font-bold text-stone-900">{h.tallosCortados.toLocaleString()} tallos</div>
                      <div className="text-[11px] font-semibold text-emerald-800">{h.paquetes25} ramos (x25)</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{h.longitudCm}</div>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {h.calidad}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div className="text-red-600 font-semibold">{h.mermaTallos} tallos</div>
                      <div className="text-[10px] text-stone-400 truncate max-w-[120px]">{h.mermaCausa}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-stone-700">
                        <Thermometer className="w-3 h-3 text-blue-600" />
                        <span>{h.temperaturaCamaraC}°C ({h.humedadCamaraPorc}%)</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">{h.estadoLote}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedLotForQR(h)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Etiqueta</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteHarvest(h.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar lote"
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

      {/* QR & Traceability Modal */}
      {selectedLotForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-stone-200 p-6 text-center">
            <h3 className="text-base font-bold text-stone-900 mb-1">Etiqueta de Trazabilidad Floral</h3>
            <p className="text-xs text-stone-500 mb-4 font-mono font-bold text-emerald-800">{selectedLotForQR.codigoLote}</p>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center justify-center mb-4">
              {/* Simulated QR Pattern */}
              <div className="w-36 h-36 bg-white p-2 rounded-lg border-2 border-stone-900 flex flex-col items-center justify-center relative shadow-xs">
                <QrCode className="w-28 h-28 text-stone-900" />
                <span className="absolute bottom-1 text-[8px] font-mono font-bold text-emerald-800 bg-white px-1">
                  AROMA-FLOWERS
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-2 font-semibold">
                {selectedLotForQR.variedad} &bull; {selectedLotForQR.longitudCm}
              </p>
              <p className="text-[10px] text-stone-400">
                {selectedLotForQR.paquetes25} Paquetes (25 tallos) &bull; Cosecha: {selectedLotForQR.fecha}
              </p>
            </div>

            <button
              onClick={() => setSelectedLotForQR(null)}
              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition"
            >
              Cerrar Etiqueta
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-emerald-700" />
                Registrar Recepción de Cosecha y Clasificación
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código de Lote *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigoLote}
                    onChange={(e) => setFormData({ ...formData, codigoLote: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha de Corte *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad *</label>
                  <input
                    type="text"
                    required
                    value={formData.variedad}
                    onChange={(e) => setFormData({ ...formData, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo de Origen</label>
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tallos Cosechados *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.tallosCortados}
                    onChange={(e) => handleTallosChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Paquetes de 25 (Auto)</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.paquetes25}
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Longitud de Tallo</label>
                  <select
                    value={formData.longitudCm}
                    onChange={(e) => setFormData({ ...formData, longitudCm: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="40 cm">40 cm</option>
                    <option value="50 cm">50 cm</option>
                    <option value="60 cm">60 cm</option>
                    <option value="70 cm">70 cm</option>
                    <option value="80 cm">80 cm</option>
                    <option value="Selecta 90+">Selecta 90+ cm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Calidad</label>
                  <select
                    value={formData.calidad}
                    onChange={(e) => setFormData({ ...formData, calidad: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Exportación">Exportación</option>
                    <option value="Nacional Grado 1">Nacional Grado 1</option>
                    <option value="Nacional Grado 2">Nacional Grado 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Merma (tallos descartados)</label>
                  <input
                    type="number"
                    value={formData.mermaTallos}
                    onChange={(e) => setFormData({ ...formData, mermaTallos: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Causa de Merma</label>
                  <input
                    type="text"
                    value={formData.mermaCausa}
                    onChange={(e) => setFormData({ ...formData, mermaCausa: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Solución Hidratación Poscosecha</label>
                  <select
                    value={formData.tratamientoHidratacion}
                    onChange={(e) => setFormData({ ...formData, tratamientoHidratacion: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Solución STS + Chrysal">Solución STS + Chrysal</option>
                    <option value="Agua Clorada + Acidificante">Agua Clorada + Acidificante</option>
                    <option value="Bactericida flor">Bactericida flor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Temperatura Cámara (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperaturaCamaraC}
                    onChange={(e) => setFormData({ ...formData, temperaturaCamaraC: Number(e.target.value) })}
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
                  Registrar Lote de Cosecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
