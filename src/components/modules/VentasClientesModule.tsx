import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaleRecord } from '../../types';
import { Plus, Trash2, ShoppingBag, DollarSign, Calendar, AlertCircle, X, CheckCircle2 } from 'lucide-react';

export const VentasClientesModule: React.FC = () => {
  const { salesRecords, addSale, deleteSale } = useApp();
  const [showModal, setShowModal] = useState(false);

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

  const handlePriceOrQtyChange = (paquetes: number, precio: number) => {
    setFormData({
      ...formData,
      paquetesVendidos: paquetes,
      precioPorPaquete: precio,
      totalVenta: paquetes * precio
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSale(formData);
    setShowModal(false);
  };

  const totalVentas = salesRecords.reduce((acc, s) => acc + (s.totalVenta || 0), 0);
  const totalPaquetes = salesRecords.reduce((acc, s) => acc + (s.paquetesVendidos || 0), 0);
  const cuentasPorCobrar = salesRecords
    .filter((s) => s.estadoCobro === 'Pendiente' || s.estadoCobro === 'Vencido')
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
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nota de Venta</span>
        </button>
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Temporada Especial</span>
          <p className="text-xl font-black text-stone-900 mt-1">San Valentín / Madres</p>
          <span className="text-[10px] text-red-600 font-bold">Pico de demanda alta</span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Registro de Notas de Venta y Cobros</h3>
          <span className="text-xs text-stone-500 font-medium">{salesRecords.length} transacciones</span>
        </div>

        {salesRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay ventas registradas.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Nota de Venta" para emitir un pedido de flor.</p>
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
                  <th className="py-3 px-4">Campaña</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {salesRecords.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.estadoCobro === 'Cobrado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.estadoCobro === 'Pendiente'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {s.estadoCobro === 'Cobrado' && <CheckCircle2 className="w-3 h-3" />}
                        {s.estadoCobro} &bull; {s.tipoPago}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 text-[11px]">
                      {s.campanaEspecial || 'Regular'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteSale(s.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Eliminar venta"
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
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                Registrar Pedido y Nota de Venta
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                  onClick={() => setShowModal(false)}
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
