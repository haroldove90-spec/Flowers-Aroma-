import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetRecord } from '../../types';
import { Plus, Trash2, Wrench, Shield, Calendar, DollarSign, X } from 'lucide-react';

export const ActivosMantenimientoModule: React.FC = () => {
  const { assetRecords, addAsset, deleteAsset } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<AssetRecord, 'id'>>({
    codigo: 'MAQ-TRAC-02',
    nombre: 'Tractor Agrícola Kubota 45HP con Atomizador Turbo 1000L',
    tipo: 'Tractor / Vehículo',
    tenencia: 'Propio',
    valorAdquisicion: 540000,
    fechaAdquisicion: '2023-05-15',
    vidaUtilAnos: 10,
    proximoMantenimiento: '2026-11-20',
    estadoOperativo: 'Excelente',
    bitacoraNotas: 'Servicio de 500 horas realizado; cambio de filtros y aceites.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset(formData);
    setShowModal(false);
  };

  const valorTotalActivos = assetRecords.reduce((acc, a) => acc + (a.valorAdquisicion || 0), 0);
  const totalActivos = assetRecords.length;
  const requierenMantenimiento = assetRecords.filter((a) => a.estadoOperativo === 'Requiere Mantenimiento' || a.estadoOperativo === 'En Reparación').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">11.</span> ACTIVOS, INFRAESTRUCTURA Y MANTENIMIENTO
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Inventario de naves góticas, cabezales de fertirriego, cámara fría, tractores, vida útil y mantenimiento preventivo.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Activo / Infraestructura</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Valor de Infraestructura</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${valorTotalActivos.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Inversión en capital fijo</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Activos Registrados</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalActivos}</p>
          <span className="text-[10px] text-stone-500 font-medium">Equipos e instalaciones</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Mantenimiento Pendiente</span>
          <p className="text-xl font-black text-amber-700 mt-1">{requierenMantenimiento}</p>
          <span className="text-[10px] text-stone-500 font-medium">Equipos a revisar</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Vida Útil Promedio</span>
          <p className="text-xl font-black text-stone-900 mt-1">11 Años</p>
          <span className="text-[10px] text-stone-500 font-medium">Estructuras galvanizadas</span>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Bitácora de Infraestructura y Mantenimiento</h3>
          <span className="text-xs text-stone-500 font-medium">{assetRecords.length} activos</span>
        </div>

        {assetRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Wrench className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay activos registrados.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Activo" para dar de alta invernaderos, bombas o cámaras frigoríficas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Código & Nombre</th>
                  <th className="py-3 px-4">Tipo & Tenencia</th>
                  <th className="py-3 px-4">Valor Adquisición</th>
                  <th className="py-3 px-4">Vida Útil</th>
                  <th className="py-3 px-4">Próximo Mantenimiento</th>
                  <th className="py-3 px-4">Estado Operativo</th>
                  <th className="py-3 px-4">Bitácora / Notas</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {assetRecords.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="font-mono text-emerald-800 text-[11px]">{a.codigo}</div>
                      <div className="text-xs font-bold text-stone-900">{a.nombre}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{a.tipo}</div>
                      <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        {a.tenencia}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ${a.valorAdquisicion.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {a.vidaUtilAnos} años
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {a.proximoMantenimiento}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.estadoOperativo === 'Excelente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.estadoOperativo === 'Requiere Mantenimiento'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {a.estadoOperativo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-[11px] max-w-xs truncate">
                      {a.bitacoraNotas}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteAsset(a.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar activo"
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
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-700" />
                Registrar Activo e Infraestructura
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código del Activo *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Activo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Invernadero / Nave">Invernadero / Nave</option>
                    <option value="Tractor / Vehículo">Tractor / Vehículo</option>
                    <option value="Sistema Fertirriego / Bombeo">Sistema Fertirriego / Bombeo</option>
                    <option value="Cámara Fría">Cámara Fría</option>
                    <option value="Herramienta Mayor">Herramienta Mayor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre y Modelo Detallado *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tenencia</label>
                  <select
                    value={formData.tenencia}
                    onChange={(e) => setFormData({ ...formData, tenencia: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Propio">Propio</option>
                    <option value="Arrendado">Arrendado</option>
                    <option value="Compartido">Compartido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Valor Adquisición ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.valorAdquisicion}
                    onChange={(e) => setFormData({ ...formData, valorAdquisicion: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Vida Útil (Años)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.vidaUtilAnos}
                    onChange={(e) => setFormData({ ...formData, vidaUtilAnos: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Próximo Mantenimiento</label>
                  <input
                    type="date"
                    required
                    value={formData.proximoMantenimiento}
                    onChange={(e) => setFormData({ ...formData, proximoMantenimiento: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado Operativo</label>
                  <select
                    value={formData.estadoOperativo}
                    onChange={(e) => setFormData({ ...formData, estadoOperativo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
                    <option value="En Reparación">En Reparación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bitácora Técnica y Reparaciones</label>
                <textarea
                  rows={2}
                  value={formData.bitacoraNotas}
                  onChange={(e) => setFormData({ ...formData, bitacoraNotas: e.target.value })}
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
                  Guardar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
