import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinanceRecord } from '../../types';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, AlertCircle, ArrowRightLeft, X, CheckCircle2 } from 'lucide-react';

export const FinanzasDeudasModule: React.FC = () => {
  const { financeRecords, addFinance, deleteFinance } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<Omit<FinanceRecord, 'id'>>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Egreso Finca',
    categoria: 'Fertilizantes y Químicos',
    cuentaBancaria: 'BBVA Finca Flores',
    monto: 8500.00,
    concepto: 'Pago de nitrato de calcio y fosfatos para fertirriego semana 43',
    conciliado: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFinance(formData);
    setShowModal(false);
  };

  const ingresos = financeRecords
    .filter((f) => f.tipo === 'Ingreso Operativo')
    .reduce((acc, f) => acc + f.monto, 0);

  const egresosFinca = financeRecords
    .filter((f) => f.tipo === 'Egreso Finca' || f.tipo === 'Amortización Préstamo')
    .reduce((acc, f) => acc + f.monto, 0);

  const gastosPersonales = financeRecords
    .filter((f) => f.tipo === 'Gasto Personal (Excluido Finca)')
    .reduce((acc, f) => acc + f.monto, 0);

  const balanceNetoFinca = ingresos - egresosFinca;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">09.</span> FINANZAS, DEUDAS Y CRÉDITOS
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Flujo de caja, conciliación bancaria, amortización de préstamos y separación estricta de gastos personales vs finca.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Movimiento Financiero</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Ingresos Operativos</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${ingresos.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Venta de flor liquidada</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Egresos de Finca</span>
          <p className="text-xl font-black text-red-600 mt-1">${egresosFinca.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Nómina, insumos, energía</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Gastos Personales (Auditados)</span>
          <p className="text-xl font-black text-stone-700 mt-1">${gastosPersonales.toLocaleString()}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Excluidos de costos de finca</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Flujo Neto Finca</span>
          <p className={`text-xl font-black mt-1 ${balanceNetoFinca >= 0 ? 'text-emerald-800' : 'text-red-600'}`}>
            ${balanceNetoFinca.toLocaleString()}
          </p>
          <span className="text-[10px] text-stone-500 font-medium">Superávit disponible</span>
        </div>
      </div>

      {/* Finance Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Libro Diario de Caja y Bancos</h3>
          <span className="text-xs text-stone-500 font-medium">{financeRecords.length} movimientos</span>
        </div>

        {financeRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <DollarSign className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay movimientos financieros registrados.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Movimiento Financiero" para asentar ingresos, compras o préstamos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Fecha & Tipo</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Cuenta / Banco</th>
                  <th className="py-3 px-4">Concepto / Detalle</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Conciliado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {financeRecords.map((f) => {
                  const isIngreso = f.tipo === 'Ingreso Operativo';
                  const isPersonal = f.tipo === 'Gasto Personal (Excluido Finca)';
                  return (
                    <tr key={f.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        <div>{f.fecha}</div>
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isIngreso
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPersonal
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {f.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {f.categoria}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {f.cuentaBancaria}
                      </td>
                      <td className="py-3 px-4 text-stone-800 text-[11px] max-w-sm truncate">
                        {f.concepto}
                      </td>
                      <td className="py-3 px-4 text-right font-black">
                        <span className={isIngreso ? 'text-emerald-800' : isPersonal ? 'text-stone-700' : 'text-red-600'}>
                          {isIngreso ? '+' : '-'}${f.monto.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sí
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteFinance(f.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar movimiento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                <DollarSign className="w-5 h-5 text-emerald-700" />
                Registrar Movimiento Financiero
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Movimiento *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Ingreso Operativo">Ingreso Operativo (Venta Flor)</option>
                    <option value="Egreso Finca">Egreso Finca (Operación)</option>
                    <option value="Gasto Personal (Excluido Finca)">Gasto Personal (Separado)</option>
                    <option value="Amortización Préstamo">Amortización Préstamo</option>
                    <option value="Inversión Activo">Inversión Activo</option>
                  </select>
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Venta de Flor">Venta de Flor</option>
                    <option value="Nómina">Nómina y Jornales</option>
                    <option value="Fertilizantes y Químicos">Fertilizantes y Químicos</option>
                    <option value="Energía Eléctrica">Energía Eléctrica y Agua</option>
                    <option value="Mantenimiento">Mantenimiento y Refacciones</option>
                    <option value="Retiro de Socio">Retiro de Socio / Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cuenta Bancaria / Caja</label>
                  <select
                    value={formData.cuentaBancaria}
                    onChange={(e) => setFormData({ ...formData, cuentaBancaria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="BBVA Finca Flores">BBVA Finca Flores</option>
                    <option value="Santander Operaciones">Santander Operaciones</option>
                    <option value="Caja Chica Efectivo">Caja Chica Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Monto ($ MXN) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Concepto y Detalle *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descripción del gasto o ingreso, referencia de factura o comprobante..."
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
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
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
