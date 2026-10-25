import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaleRecord } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  ShoppingBag,
  X,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer
} from 'lucide-react';

export const VentasClientesModule: React.FC = () => {
  const {
    salesRecords,
    addSale,
    updateSale,
    toggleDeactivateSale,
    deleteSale
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
  const [viewingSale, setViewingSale] = useState<SaleRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<Omit<SaleRecord, 'id'>>({
    fecha: new Date().toISOString().split('T')[0],
    cliente: 'Floristería Alta Gracia',
    mercado: 'Florerías Locales',
    variedad: 'Rosa Explorer 70cm',
    clasificacion: 'Exportación Grado A',
    paquetesVendidos: 80,
    precioPorPaquete: 215.00,
    totalVenta: 17200.00,
    tipoPago: 'Transferencia',
    estadoCobro: 'Cobrado',
    campanaEspecial: 'Semana Regular'
  });

  const handlePriceOrQtyChange = (paquetes: number, precio: number, isEditing: boolean = false) => {
    const total = paquetes * precio;
    if (isEditing && editingSale) {
      setEditingSale({
        ...editingSale,
        paquetesVendidos: paquetes,
        precioPorPaquete: precio,
        totalVenta: total
      });
    } else {
      setFormData({
        ...formData,
        paquetesVendidos: paquetes,
        precioPorPaquete: precio,
        totalVenta: total
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSale(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;
    updateSale(editingSale.id, editingSale);
    setEditingSale(null);
  };

  const handleExportSinglePDF = (s: SaleRecord) => {
    exportRecordToPDF(
      '07. VENTAS Y CLIENTES',
      s.id,
      [
        { label: 'Cliente / Razón Social', value: s.cliente, highlight: true },
        { label: 'Mercado Destino', value: s.mercado },
        { label: 'Fecha de Operación', value: s.fecha },
        { label: 'Variedad de Flor', value: s.variedad },
        { label: 'Clasificación / Calidad', value: s.clasificacion },
        { label: 'Paquetes Vendidos (x25)', value: `${s.paquetesVendidos} paquetes (${s.paquetesVendidos * 25} tallos)` },
        { label: 'Precio Unitario por Paquete', value: `$${s.precioPorPaquete.toLocaleString()} MXN` },
        { label: 'Importe Total de Venta', value: `$${s.totalVenta.toLocaleString()} MXN`, highlight: true },
        { label: 'Forma de Pago', value: s.tipoPago },
        { label: 'Estado del Cobro', value: s.estadoCobro, highlight: true },
        { label: 'Campaña / Temporada', value: s.campanaEspecial || 'Regular' },
        { label: 'Estatus en Sistema', value: s.desactivado ? 'Desactivado / Cancelado' : 'Activo' }
      ],
      `Nota de venta comercial emitida por Invernadero Aroma Flowers. Flor cortada y empacada con estándares fitosanitarios internacionales.`,
      s.desactivado ? 'Desactivado' : s.estadoCobro
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Cliente', 'Mercado', 'Variedad', 'Paquetes', 'Precio/Paq', 'Total', 'Estado Cobro'];
    const rows = filteredSales.map((s) => [
      s.id,
      s.cliente,
      s.mercado,
      s.variedad,
      `${s.paquetesVendidos} paq`,
      `$${s.precioPorPaquete}`,
      `$${s.totalVenta.toLocaleString()}`,
      s.desactivado ? 'Cancelada' : s.estadoCobro
    ]);
    exportModuleTableToPDF('07. Ventas y Clientes', headers, rows);
  };

  const filteredSales = salesRecords.filter((s) => {
    if (filterStatus === 'active') return !s.desactivado;
    if (filterStatus === 'inactive') return s.desactivado;
    return true;
  });

  const totalVentas = salesRecords
    .filter((s) => !s.desactivado)
    .reduce((acc, s) => acc + (s.totalVenta || 0), 0);
  const totalPaquetes = salesRecords
    .filter((s) => !s.desactivado)
    .reduce((acc, s) => acc + (s.paquetesVendidos || 0), 0);
  const cuentasPorCobrar = salesRecords
    .filter((s) => !s.desactivado && (s.estadoCobro === 'Pendiente' || s.estadoCobro === 'Vencido'))
    .reduce((acc, s) => acc + s.totalVenta, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">07.</span> VENTAS Y CLIENTES
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gestión comercial, mercados de exportación y nacional, pedidos, notas de venta, cobros y campañas especiales.
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
            <span>Registrar Venta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Ingresos Totales</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${totalVentas.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Facturación acumulada</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Paquetes Vendidos</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalPaquetes.toLocaleString()} ramos</p>
          <span className="text-[10px] text-stone-500 font-medium">({totalPaquetes * 25} tallos)</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Cuentas por Cobrar</span>
          <p className="text-xl font-black text-amber-700 mt-1">${cuentasPorCobrar.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Créditos vigentes</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Ventas Registradas</span>
          <p className="text-xl font-black text-stone-900 mt-1">
            {salesRecords.filter((s) => !s.desactivado).length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium">Notas emitidas</span>
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
            Todas ({salesRecords.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activas ({salesRecords.filter((s) => !s.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Canceladas/Desactivadas ({salesRecords.filter((s) => s.desactivado).length})
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Registro de Notas de Venta y Cobros</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredSales.length} transacciones</span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay ventas con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Fecha & Cliente</th>
                  <th className="py-3 px-4">Mercado Destino</th>
                  <th className="py-3 px-4">Variedad & Grado</th>
                  <th className="py-3 px-4">Paquetes / Precio</th>
                  <th className="py-3 px-4">Total Venta</th>
                  <th className="py-3 px-4">Pago & Estado</th>
                  <th className="py-3 px-4 text-center min-w-[170px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSales.map((s) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      s.desactivado ? 'bg-stone-50/60 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{s.cliente}</div>
                      <div className="text-[11px] text-stone-500">{s.fecha}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {s.mercado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-800">
                      <div className="font-bold text-emerald-800">{s.variedad}</div>
                      <div className="text-[11px] text-stone-500">{s.clasificacion}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{s.paquetesVendidos} paquetes</div>
                      <div className="text-[11px] text-stone-500">${s.precioPorPaquete}/paq</div>
                    </td>
                    <td className="py-3 px-4 font-black text-stone-900">
                      ${s.totalVenta.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {s.desactivado ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          Cancelada
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.estadoCobro === 'Cobrado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.estadoCobro === 'Pendiente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {s.estadoCobro} &bull; {s.tipoPago}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button
                          onClick={() => setViewingSale(s)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver nota de venta completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingSale(s)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar venta"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Cancelar */}
                        <button
                          onClick={() => toggleDeactivateSale(s.id)}
                          className={`p-1.5 rounded-lg transition ${
                            s.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={s.desactivado ? 'Reactivar venta' : 'Cancelar / desactivar venta'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Exportar PDF */}
                        <button
                          onClick={() => handleExportSinglePDF(s)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                          title="Imprimir nota de venta PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => deleteSale(s.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar venta"
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
      {viewingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Nota de Venta: {viewingSale.cliente} ({viewingSale.id})
                </h3>
              </div>
              <button onClick={() => setViewingSale(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Mercado & Fecha</span>
                  <span className="font-bold text-stone-900">{viewingSale.mercado} &bull; {viewingSale.fecha}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Variedad & Clasificación</span>
                  <span className="font-bold text-stone-900">{viewingSale.variedad} ({viewingSale.clasificacion})</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Volumen Vendido</span>
                  <span className="font-bold text-stone-900">{viewingSale.paquetesVendidos} paquetes ({viewingSale.paquetesVendidos * 25} tallos)</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Total Facturación</span>
                  <span className="font-black text-emerald-950 text-sm">${viewingSale.totalVenta.toLocaleString()} MXN</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Pago & Estado</span>
                  <span className="font-bold text-stone-900">{viewingSale.tipoPago} &bull; {viewingSale.estadoCobro}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Campaña / Festividad</span>
                  <span className="font-bold text-stone-900">{viewingSale.campanaEspecial || 'Regular'}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingSale)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Nota PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingSale(null)}
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
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-700" />
                Editar Nota de Venta: {editingSale.id}
              </h3>
              <button onClick={() => setEditingSale(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={editingSale.cliente}
                    onChange={(e) => setEditingSale({ ...editingSale, cliente: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mercado / Destino</label>
                  <select
                    value={editingSale.mercado}
                    onChange={(e) => setEditingSale({ ...editingSale, mercado: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Exportación Miami">Exportación Miami</option>
                    <option value="Exportación Europa">Exportación Europa</option>
                    <option value="Central de Abasto">Central de Abasto</option>
                    <option value="Florerías Locales">Florerías Locales</option>
                    <option value="Eventos / Bodas">Eventos / Bodas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Variedad *</label>
                  <input
                    type="text"
                    required
                    value={editingSale.variedad}
                    onChange={(e) => setEditingSale({ ...editingSale, variedad: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={editingSale.fecha}
                    onChange={(e) => setEditingSale({ ...editingSale, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Paquetes Vendidos</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSale.paquetesVendidos}
                    onChange={(e) => handlePriceOrQtyChange(Number(e.target.value), editingSale.precioPorPaquete, true)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Precio por Paquete ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSale.precioPorPaquete}
                    onChange={(e) => handlePriceOrQtyChange(editingSale.paquetesVendidos, Number(e.target.value), true)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Total ($)</label>
                  <input
                    type="number"
                    readOnly
                    value={editingSale.totalVenta}
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Forma de Pago</label>
                  <select
                    value={editingSale.tipoPago}
                    onChange={(e) => setEditingSale({ ...editingSale, tipoPago: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Crédito 15 días">Crédito 15 días</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado de Cobro</label>
                  <select
                    value={editingSale.estadoCobro}
                    onChange={(e) => setEditingSale({ ...editingSale, estadoCobro: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Cobrado">Cobrado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Actualizar Nota de Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                Registrar Pedido y Nota de Venta
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mercado / Canal de Venta</label>
                  <select
                    value={formData.mercado}
                    onChange={(e) => setFormData({ ...formData, mercado: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Exportación Miami">Exportación Miami</option>
                    <option value="Exportación Europa">Exportación Europa</option>
                    <option value="Central de Abasto">Central de Abasto</option>
                    <option value="Florerías Locales">Florerías Locales</option>
                    <option value="Eventos / Bodas">Eventos / Bodas</option>
                  </select>
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Clasificación / Calidad</label>
                  <input
                    type="text"
                    value={formData.clasificacion}
                    onChange={(e) => setFormData({ ...formData, clasificacion: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Paquetes Vendidos (x25)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.paquetesVendidos}
                    onChange={(e) => handlePriceOrQtyChange(Number(e.target.value), formData.precioPorPaquete)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Precio por Paquete ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.precioPorPaquete}
                    onChange={(e) => handlePriceOrQtyChange(formData.paquetesVendidos, Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Total Calculado ($)</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.totalVenta}
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-300 rounded-lg font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Forma de Pago</label>
                  <select
                    value={formData.tipoPago}
                    onChange={(e) => setFormData({ ...formData, tipoPago: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Crédito 15 días">Crédito 15 días</option>
                    <option value="Crédito 30 días">Crédito 30 días</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Estado del Cobro</label>
                  <select
                    value={formData.estadoCobro}
                    onChange={(e) => setFormData({ ...formData, estadoCobro: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Cobrado">Cobrado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Campaña / Festividad</label>
                  <select
                    value={formData.campanaEspecial}
                    onChange={(e) => setFormData({ ...formData, campanaEspecial: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Semana Regular">Semana Regular</option>
                    <option value="San Valentín">San Valentín</option>
                    <option value="Día de las Madres">Día de las Madres</option>
                    <option value="Día de Muertos">Día de Muertos</option>
                    <option value="Navidad">Navidad</option>
                  </select>
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
                  Generar Nota de Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
