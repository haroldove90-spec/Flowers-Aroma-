import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetRecord } from '../../types';
import {
  Plus,
  Trash2,
  Wrench,
  Shield,
  Calendar,
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

export const ActivosMantenimientoModule: React.FC = () => {
  const { assetRecords, addAsset, updateAsset, toggleDeactivateAsset, deleteAsset, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<AssetRecord | null>(null);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'desactivados'>('todos');

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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    updateAsset(editingAsset.id, editingAsset);
    setEditingAsset(null);
  };

  const handleExportSinglePDF = (a: AssetRecord) => {
    exportRecordToPDF('11. ACTIVOS, INFRAESTRUCTURA Y MANTENIMIENTO', `Ficha de Activo - ${a.codigo} ${a.nombre}`, [
      { label: 'Código de Activo', value: a.codigo },
      { label: 'Nombre / Equipo', value: a.nombre },
      { label: 'Tipo de Activo', value: a.tipo },
      { label: 'Régimen de Tenencia', value: a.tenencia },
      { label: 'Valor Adquisición', value: `$${a.valorAdquisicion.toLocaleString()} MXN` },
      { label: 'Fecha de Adquisición', value: a.fechaAdquisicion },
      { label: 'Vida Útil Estimada', value: `${a.vidaUtilAnos} años` },
      { label: 'Próximo Mantenimiento', value: a.proximoMantenimiento },
      { label: 'Estado Operativo', value: a.estadoOperativo },
      { label: 'Bitácora y Observaciones', value: a.bitacoraNotas || 'Sin bitácora registrada' },
      { label: 'Estado en Sistema', value: a.desactivado ? 'DESACTIVADO / BAJA TÉCNICA' : 'ACTIVO' }
    ]);
    showToast(`PDF de ${a.nombre} generado`, 'success');
  };

  const handleExportTablePDF = () => {
    exportModuleTableToPDF(
      '11. ACTIVOS, INFRAESTRUCTURA Y MANTENIMIENTO',
      'Inventario de Activos y Programa de Mantenimiento',
      ['Código', 'Nombre / Equipo', 'Tipo', 'Tenencia', 'Valor Adq.', 'Vida Útil', 'Próx. Manto.', 'Estado Op.', 'Estado'],
      filteredAssets.map((a) => [
        a.codigo,
        a.nombre,
        a.tipo,
        a.tenencia,
        `$${a.valorAdquisicion.toLocaleString()}`,
        `${a.vidaUtilAnos} años`,
        a.proximoMantenimiento,
        a.estadoOperativo,
        a.desactivado ? 'Desactivado' : 'Activo'
      ])
    );
    showToast('Reporte en PDF de Activos generado', 'success');
  };

  const filteredAssets = assetRecords.filter((a) => {
    if (statusFilter === 'activos') return !a.desactivado;
    if (statusFilter === 'desactivados') return a.desactivado;
    return true;
  });

  const activeAssets = assetRecords.filter((a) => !a.desactivado);
  const valorTotalActivos = activeAssets.reduce((acc, a) => acc + (a.valorAdquisicion || 0), 0);
  const totalActivos = assetRecords.length;
  const requierenMantenimiento = activeAssets.filter((a) => a.estadoOperativo === 'Requiere Mantenimiento' || a.estadoOperativo === 'En Reparación').length;
  const totalDesactivados = assetRecords.filter((a) => a.desactivado).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">11.</span> ACTIVOS, INFRAESTRUCTURA Y MANTENIMIENTO
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Inventario de naves góticas, cabezales de riego, tractores, cámaras frías, bitácoras y fichas técnicas PDF.
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
            <span>Registrar Activo</span>
          </button>
        </div>
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
          <span className="text-[10px] text-stone-500 font-medium">{totalDesactivados} fuera de servicio</span>
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
        <div className="px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">Bitácora de Infraestructura y Mantenimiento</h3>
            <span className="text-xs text-stone-500 font-medium">({filteredAssets.length} activos)</span>
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
                Todos ({assetRecords.length})
              </button>
              <button
                onClick={() => setStatusFilter('activos')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'activos' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Activos ({assetRecords.length - totalDesactivados})
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

        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Wrench className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay activos registrados con este criterio.</p>
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
                  <th className="py-3 px-4">Próximo Manto.</th>
                  <th className="py-3 px-4">Estado Operativo</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAssets.map((a) => {
                  const isDeactivated = a.desactivado;
                  return (
                    <tr
                      key={a.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isDeactivated ? 'bg-stone-50/50 opacity-70' : ''}`}
                    >
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
                            onClick={() => setViewingAsset(a)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAsset(a)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Editar activo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleDeactivateAsset(a.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isDeactivated
                                ? 'text-red-600 hover:text-emerald-700 hover:bg-emerald-50'
                                : 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={isDeactivated ? 'Reactivar activo' : 'Dar de baja / desactivar'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportSinglePDF(a)}
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="Descargar Ficha en PDF"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAsset(a.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar activo"
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
      {viewingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Ficha Técnica de Infraestructura</h3>
              </div>
              <button onClick={() => setViewingAsset(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 font-bold block">Código de Identificación</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{viewingAsset.codigo}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Estado en Sistema</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${viewingAsset.desactivado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {viewingAsset.desactivado ? 'Desactivado / Baja' : 'Activo'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Nombre del Activo / Equipo</span>
                <span className="font-bold text-stone-900 text-sm">{viewingAsset.nombre}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Tipo de Activo</span>
                  <span className="font-semibold text-stone-800">{viewingAsset.tipo}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Régimen de Tenencia</span>
                  <span className="font-semibold text-stone-800">{viewingAsset.tenencia}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-stone-500 font-bold block">Valor Adquisición</span>
                  <span className="text-sm font-black text-emerald-950">${viewingAsset.valorAdquisicion.toLocaleString()} MXN</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Vida Útil</span>
                  <span className="text-sm font-bold text-stone-800">{viewingAsset.vidaUtilAnos} años</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Operatividad</span>
                  <span className="font-bold text-stone-800">{viewingAsset.estadoOperativo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Fecha Adquisición</span>
                  <span className="text-stone-800 font-medium">{viewingAsset.fechaAdquisicion}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Próximo Mantenimiento</span>
                  <span className="text-stone-800 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {viewingAsset.proximoMantenimiento}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Bitácora / Historial de Mantenimientos</span>
                <p className="mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                  {viewingAsset.bitacoraNotas || 'Sin registros de bitácora.'}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingAsset)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold"
                >
                  <FileDown className="w-4 h-4 text-emerald-700" />
                  Descargar Ficha PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingAsset(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Activo */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Editar Activo ({editingAsset.codigo})
              </h3>
              <button onClick={() => setEditingAsset(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código de Activo *</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.codigo}
                    onChange={(e) => setEditingAsset({ ...editingAsset, codigo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre / Equipo *</label>
                  <input
                    type="text"
                    required
                    value={editingAsset.nombre}
                    onChange={(e) => setEditingAsset({ ...editingAsset, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Activo</label>
                  <select
                    value={editingAsset.tipo}
                    onChange={(e) => setEditingAsset({ ...editingAsset, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Invernadero / Estructura">Invernadero / Estructura</option>
                    <option value="Sistema de Riego / Bombas">Sistema de Riego / Bombas</option>
                    <option value="Tractor / Vehículo">Tractor / Vehículo</option>
                    <option value="Cámara Fría / Poscosecha">Cámara Fría / Poscosecha</option>
                    <option value="Maquinaria y Herramientas">Maquinaria y Herramientas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tenencia</label>
                  <select
                    value={editingAsset.tenencia}
                    onChange={(e) => setEditingAsset({ ...editingAsset, tenencia: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Propio">Propio</option>
                    <option value="Arrendado">Arrendado</option>
                    <option value="Comodato">Comodato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Valor Adquisición ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingAsset.valorAdquisicion}
                    onChange={(e) => setEditingAsset({ ...editingAsset, valorAdquisicion: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Vida Útil (Años)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingAsset.vidaUtilAnos}
                    onChange={(e) => setEditingAsset({ ...editingAsset, vidaUtilAnos: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado Operativo</label>
                  <select
                    value={editingAsset.estadoOperativo}
                    onChange={(e) => setEditingAsset({ ...editingAsset, estadoOperativo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
                    <option value="En Reparación">En Reparación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Próximo Mantenimiento Preventivo</label>
                <input
                  type="date"
                  value={editingAsset.proximoMantenimiento}
                  onChange={(e) => setEditingAsset({ ...editingAsset, proximoMantenimiento: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bitácora / Historial de Mantenimientos</label>
                <textarea
                  rows={2}
                  value={editingAsset.bitacoraNotas}
                  onChange={(e) => setEditingAsset({ ...editingAsset, bitacoraNotas: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Actualizar Activo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Activo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-700" />
                Registrar Activo o Infraestructura
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código de Activo *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre / Equipo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Activo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Invernadero / Estructura">Invernadero / Estructura</option>
                    <option value="Sistema de Riego / Bombas">Sistema de Riego / Bombas</option>
                    <option value="Tractor / Vehículo">Tractor / Vehículo</option>
                    <option value="Cámara Fría / Poscosecha">Cámara Fría / Poscosecha</option>
                    <option value="Maquinaria y Herramientas">Maquinaria y Herramientas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tenencia</label>
                  <select
                    value={formData.tenencia}
                    onChange={(e) => setFormData({ ...formData, tenencia: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Propio">Propio</option>
                    <option value="Arrendado">Arrendado</option>
                    <option value="Comodato">Comodato</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado Operativo</label>
                  <select
                    value={formData.estadoOperativo}
                    onChange={(e) => setFormData({ ...formData, estadoOperativo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
                    <option value="En Reparación">En Reparación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha de Compra</label>
                  <input
                    type="date"
                    value={formData.fechaAdquisicion}
                    onChange={(e) => setFormData({ ...formData, fechaAdquisicion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Próximo Mantenimiento Preventivo</label>
                  <input
                    type="date"
                    value={formData.proximoMantenimiento}
                    onChange={(e) => setFormData({ ...formData, proximoMantenimiento: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bitácora / Historial de Mantenimientos</label>
                <textarea
                  rows={2}
                  placeholder="Últimos servicios, cambio de piezas, garantías..."
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
