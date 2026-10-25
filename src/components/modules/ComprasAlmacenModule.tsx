import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WarehouseItem } from '../../types';
import {
  Plus,
  Trash2,
  Package,
  AlertTriangle,
  X,
  Eye,
  Edit2,
  Power,
  FileDown,
  FileSpreadsheet,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';

export const ComprasAlmacenModule: React.FC = () => {
  const { warehouseItems, addWarehouseItem, updateWarehouseItem, toggleDeactivateWarehouseItem, deleteWarehouseItem, adjustStock, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<WarehouseItem | null>(null);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'desactivados'>('todos');

  const [formData, setFormData] = useState<Omit<WarehouseItem, 'id'>>({
    codigo: 'NUT-SULF-MG',
    nombre: 'Sulfato de Magnesio Heptahidratado',
    categoria: 'Fertilizantes',
    unidadMedida: 'Saco 25kg',
    stockActual: 20,
    stockMinimo: 8,
    almacenUbicacion: 'Caseta de Riego',
    proveedorHabitual: 'Agroquímicos del Centro S.A.',
    costoUnitario: 390.00,
    loteCaducidad: '2028-04-30',
    estadoReposicion: 'Óptimo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estado = formData.stockActual === 0 ? 'Agotado' : formData.stockActual <= formData.stockMinimo ? 'Alerta Reposición' : 'Óptimo';
    addWarehouseItem({
      ...formData,
      estadoReposicion: estado
    });
    setShowModal(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const estado = editingItem.stockActual === 0 ? 'Agotado' : editingItem.stockActual <= editingItem.stockMinimo ? 'Alerta Reposición' : 'Óptimo';
    updateWarehouseItem(editingItem.id, {
      ...editingItem,
      estadoReposicion: estado
    });
    setEditingItem(null);
  };

  const handleExportSinglePDF = (item: WarehouseItem) => {
    exportRecordToPDF('08. COMPRAS Y ALMACÉN', `Insumo - ${item.codigo} ${item.nombre}`, [
      { label: 'Código SKU', value: item.codigo },
      { label: 'Nombre Insumo', value: item.nombre },
      { label: 'Categoría', value: item.categoria },
      { label: 'Almacén / Ubicación', value: item.almacenUbicacion },
      { label: 'Unidad de Medida', value: item.unidadMedida },
      { label: 'Stock Actual', value: `${item.stockActual} ${item.unidadMedida}` },
      { label: 'Stock Mínimo', value: `${item.stockMinimo} ${item.unidadMedida}` },
      { label: 'Estado de Reposición', value: item.estadoReposicion },
      { label: 'Proveedor Habitual', value: item.proveedorHabitual },
      { label: 'Costo Unitario', value: `$${item.costoUnitario.toLocaleString()} MXN` },
      { label: 'Valor Total en Stock', value: `$${(item.stockActual * item.costoUnitario).toLocaleString()} MXN` },
      { label: 'Lote / Caducidad', value: item.loteCaducidad || 'N/A' },
      { label: 'Estado en Sistema', value: item.desactivado ? 'DESACTIVADO / INACTIVO' : 'ACTIVO' }
    ]);
    showToast(`PDF de ${item.nombre} generado`, 'success');
  };

  const handleExportTablePDF = () => {
    exportModuleTableToPDF(
      '08. COMPRAS Y ALMACÉN',
      'Catálogo y Existencias de Insumos',
      ['Código', 'Insumo', 'Categoría', 'Ubicación', 'Stock', 'Mínimo', 'Costo Unit.', 'Valor Stock', 'Estado'],
      filteredItems.map((item) => [
        item.codigo,
        item.nombre,
        item.categoria,
        item.almacenUbicacion,
        `${item.stockActual} ${item.unidadMedida}`,
        `${item.stockMinimo}`,
        `$${item.costoUnitario}`,
        `$${(item.stockActual * item.costoUnitario).toLocaleString()}`,
        item.desactivado ? 'Desactivado' : item.estadoReposicion
      ])
    );
    showToast('Reporte en PDF de Compras y Almacén generado', 'success');
  };

  const filteredItems = warehouseItems.filter((i) => {
    if (statusFilter === 'activos') return !i.desactivado;
    if (statusFilter === 'desactivados') return i.desactivado;
    return true;
  });

  const totalInsumos = warehouseItems.length;
  const valorInventario = warehouseItems.reduce((acc, i) => acc + (i.stockActual * i.costoUnitario), 0);
  const alertasReposicion = warehouseItems.filter((i) => !i.desactivado && i.stockActual <= i.stockMinimo).length;
  const totalDesactivados = warehouseItems.filter((i) => i.desactivado).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">08.</span> COMPRAS Y ALMACÉN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Catálogo de fertilizantes, agroquímicos, empaques, control de stock, acciones de edición y fichas PDF.
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
            <span>Agregar Insumo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Valor en Inventario</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${valorInventario.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Costo total activos</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Insumos Catalogados</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalInsumos}</p>
          <span className="text-[10px] text-stone-500 font-medium">{totalDesactivados} inactivos</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Alertas Reposición</span>
          <p className="text-xl font-black text-red-600 mt-1">{alertasReposicion}</p>
          <span className="text-[10px] text-red-600 font-bold">Bajo stock mínimo</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Bodegas Finca</span>
          <p className="text-xl font-black text-stone-900 mt-1">4 Ubicaciones</p>
          <span className="text-[10px] text-stone-500 font-medium">Riego, Químicos, Empaque</span>
        </div>
      </div>

      {/* Warehouse Items Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">Existencias por Almacén y Control de Stock</h3>
            <span className="text-xs text-stone-500 font-medium">({filteredItems.length} insumos)</span>
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
                Todos ({warehouseItems.length})
              </button>
              <button
                onClick={() => setStatusFilter('activos')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'activos' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Activos ({warehouseItems.length - totalDesactivados})
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

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay insumos registrados con este criterio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Código & Insumo</th>
                  <th className="py-3 px-4">Categoría & Ubicación</th>
                  <th className="py-3 px-4">Unidad & Proveedor</th>
                  <th className="py-3 px-4">Stock Actual</th>
                  <th className="py-3 px-4">Mínimo</th>
                  <th className="py-3 px-4">Costo / Valor</th>
                  <th className="py-3 px-4">Ajuste Rápido</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredItems.map((item) => {
                  const isLow = item.stockActual <= item.stockMinimo;
                  const isDeactivated = item.desactivado;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isDeactivated ? 'bg-stone-50/50 opacity-70' : ''}`}
                    >
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        <div className="font-mono text-emerald-800 text-[11px]">{item.codigo}</div>
                        <div className="text-xs font-bold text-stone-900">{item.nombre}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        <div>{item.categoria}</div>
                        <div className="text-[11px] text-stone-500 font-medium">{item.almacenUbicacion}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        <div className="font-medium text-stone-900">{item.unidadMedida}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[130px]">{item.proveedorHabitual}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-stone-900">{item.stockActual}</span>
                          {isLow && !isDeactivated && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Reorden
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {item.stockMinimo} {item.unidadMedida}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-800">
                        <div>${item.costoUnitario.toLocaleString()}</div>
                        <div className="text-[11px] text-stone-500">Val: ${(item.stockActual * item.costoUnitario).toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 font-bold rounded transition"
                            title="Descontar 1 unidad"
                          >
                            -
                          </button>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 font-bold rounded transition"
                            title="Ingresar 1 unidad"
                          >
                            +
                          </button>
                        </div>
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
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Editar insumo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleDeactivateWarehouseItem(item.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isDeactivated
                                ? 'text-red-600 hover:text-emerald-700 hover:bg-emerald-50'
                                : 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={isDeactivated ? 'Reactivar insumo' : 'Desactivar insumo'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportSinglePDF(item)}
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="Descargar Ficha en PDF"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteWarehouseItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar registro"
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
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Ficha Técnica de Insumo</h3>
              </div>
              <button onClick={() => setViewingItem(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 font-bold block">Código SKU</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{viewingItem.codigo}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Estado en Sistema</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${viewingItem.desactivado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {viewingItem.desactivado ? 'Desactivado' : 'Activo'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Nombre Completo</span>
                <span className="font-bold text-stone-900 text-sm">{viewingItem.nombre}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Categoría</span>
                  <span className="font-semibold text-stone-800">{viewingItem.categoria}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Almacén / Ubicación</span>
                  <span className="font-semibold text-stone-800">{viewingItem.almacenUbicacion}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <div>
                  <span className="text-stone-500 font-bold block">Stock Actual</span>
                  <span className="text-sm font-black text-emerald-900">{viewingItem.stockActual} {viewingItem.unidadMedida}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Stock Mínimo</span>
                  <span className="text-sm font-bold text-stone-800">{viewingItem.stockMinimo} {viewingItem.unidadMedida}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Reposición</span>
                  <span className="font-bold text-stone-800">{viewingItem.estadoReposicion}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Costo Unitario</span>
                  <span className="font-black text-stone-900 text-sm">${viewingItem.costoUnitario.toLocaleString()} MXN</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Valor Total en Stock</span>
                  <span className="font-black text-emerald-800 text-sm">${(viewingItem.stockActual * viewingItem.costoUnitario).toLocaleString()} MXN</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Proveedor Habitual</span>
                  <span className="text-stone-800 font-medium">{viewingItem.proveedorHabitual}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Lote / Caducidad</span>
                  <span className="text-stone-800 font-medium">{viewingItem.loteCaducidad || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold"
                >
                  <FileDown className="w-4 h-4 text-emerald-700" />
                  Descargar Ficha PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Insumo */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Editar Insumo ({editingItem.codigo})
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código / SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.codigo}
                    onChange={(e) => setEditingItem({ ...editingItem, codigo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Insumo *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.nombre}
                    onChange={(e) => setEditingItem({ ...editingItem, nombre: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={editingItem.categoria}
                    onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Fertilizantes">Fertilizantes</option>
                    <option value="Fitosanitarios">Fitosanitarios</option>
                    <option value="Material de Empaque">Material de Empaque</option>
                    <option value="Herramientas y EPP">Herramientas y EPP</option>
                    <option value="Riego y Repuestos">Riego y Repuestos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Almacén / Ubicación</label>
                  <select
                    value={editingItem.almacenUbicacion}
                    onChange={(e) => setEditingItem({ ...editingItem, almacenUbicacion: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Caseta de Riego">Caseta de Riego</option>
                    <option value="Bodega Químicos">Bodega Químicos</option>
                    <option value="Empaque">Empaque</option>
                    <option value="Almacén Principal">Almacén Principal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unidad Medida</label>
                  <select
                    value={editingItem.unidadMedida}
                    onChange={(e) => setEditingItem({ ...editingItem, unidadMedida: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Saco 25kg">Saco 25kg</option>
                    <option value="Litro">Litro</option>
                    <option value="Kilo">Kilo</option>
                    <option value="Paquete 1000 pzas">Paquete 1000 pzas</option>
                    <option value="Pieza">Pieza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Actual</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.stockActual}
                    onChange={(e) => setEditingItem({ ...editingItem, stockActual: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.stockMinimo}
                    onChange={(e) => setEditingItem({ ...editingItem, stockMinimo: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Proveedor Habitual</label>
                  <input
                    type="text"
                    value={editingItem.proveedorHabitual}
                    onChange={(e) => setEditingItem({ ...editingItem, proveedorHabitual: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costo Unitario ($ MXN)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingItem.costoUnitario}
                    onChange={(e) => setEditingItem({ ...editingItem, costoUnitario: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Actualizar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form: Crear Insumo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                Registrar Insumo en Almacén
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Código / SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Insumo *</label>
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Fertilizantes">Fertilizantes</option>
                    <option value="Fitosanitarios">Fitosanitarios</option>
                    <option value="Material de Empaque">Material de Empaque</option>
                    <option value="Herramientas y EPP">Herramientas y EPP</option>
                    <option value="Riego y Repuestos">Riego y Repuestos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Almacén / Bodega</label>
                  <select
                    value={formData.almacenUbicacion}
                    onChange={(e) => setFormData({ ...formData, almacenUbicacion: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Caseta de Riego">Caseta de Riego</option>
                    <option value="Bodega Químicos">Bodega Químicos</option>
                    <option value="Empaque">Empaque</option>
                    <option value="Almacén Principal">Almacén Principal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unidad Medida</label>
                  <select
                    value={formData.unidadMedida}
                    onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Saco 25kg">Saco 25kg</option>
                    <option value="Litro">Litro</option>
                    <option value="Kilo">Kilo</option>
                    <option value="Paquete 1000 pzas">Paquete 1000 pzas</option>
                    <option value="Pieza">Pieza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockActual}
                    onChange={(e) => setFormData({ ...formData, stockActual: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Proveedor Habitual</label>
                  <input
                    type="text"
                    value={formData.proveedorHabitual}
                    onChange={(e) => setFormData({ ...formData, proveedorHabitual: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Costo Unitario ($ MXN)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.costoUnitario}
                    onChange={(e) => setFormData({ ...formData, costoUnitario: Number(e.target.value) })}
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
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
