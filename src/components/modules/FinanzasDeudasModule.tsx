import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinanceRecord } from '../../types';
import {
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  X,
  CheckCircle2,
  Eye,
  Edit2,
  Power,
  FileDown,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';

export const FinanzasDeudasModule: React.FC = () => {
  const { financeRecords, addFinance, updateFinance, toggleDeactivateFinance, deleteFinance, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewingFinance, setViewingFinance] = useState<FinanceRecord | null>(null);
  const [editingFinance, setEditingFinance] = useState<FinanceRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'desactivados'>('todos');

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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFinance) return;
    updateFinance(editingFinance.id, editingFinance);
    setEditingFinance(null);
  };

  const handleExportSinglePDF = (f: FinanceRecord) => {
    exportRecordToPDF('09. FINANZAS, DEUDAS Y CRÉDITOS', `Movimiento Financiero - ${f.fecha}`, [
      { label: 'Fecha de Operación', value: f.fecha },
      { label: 'Tipo de Flujo', value: f.tipo },
      { label: 'Categoría', value: f.categoria },
      { label: 'Cuenta / Banco', value: f.cuentaBancaria },
      { label: 'Monto Operación', value: `$${f.monto.toLocaleString()} MXN` },
      { label: 'Concepto Detallado', value: f.concepto },
      { label: 'Conciliación Bancaria', value: f.conciliado ? 'Conciliado con Estado de Cuenta' : 'Pendiente por Conciliar' },
      { label: 'Estado en Sistema', value: f.desactivado ? 'DESACTIVADO / ANULADO' : 'ACTIVO' }
    ]);
    showToast(`PDF de movimiento financiero generado`, 'success');
  };

  const handleExportTablePDF = () => {
    exportModuleTableToPDF(
      '09. FINANZAS, DEUDAS Y CRÉDITOS',
      'Libro Diario de Caja y Bancos',
      ['Fecha', 'Tipo', 'Categoría', 'Cuenta / Banco', 'Concepto', 'Monto', 'Conciliado', 'Estado'],
      filteredRecords.map((f) => [
        f.fecha,
        f.tipo,
        f.categoria,
        f.cuentaBancaria,
        f.concepto,
        `$${f.monto.toLocaleString()}`,
        f.conciliado ? 'Sí' : 'No',
        f.desactivado ? 'Desactivado' : 'Activo'
      ])
    );
    showToast('Reporte en PDF de Finanzas generado', 'success');
  };

  const filteredRecords = financeRecords.filter((f) => {
    if (statusFilter === 'activos') return !f.desactivado;
    if (statusFilter === 'desactivados') return f.desactivado;
    return true;
  });

  const ingresos = financeRecords
    .filter((f) => !f.desactivado && f.tipo === 'Ingreso Operativo')
    .reduce((acc, f) => acc + f.monto, 0);

  const egresosFinca = financeRecords
    .filter((f) => !f.desactivado && (f.tipo === 'Egreso Finca' || f.tipo === 'Amortización Préstamo'))
    .reduce((acc, f) => acc + f.monto, 0);

  const gastosPersonales = financeRecords
    .filter((f) => !f.desactivado && f.tipo === 'Gasto Personal (Excluido Finca)')
    .reduce((acc, f) => acc + f.monto, 0);

  const balanceNetoFinca = ingresos - egresosFinca;
  const totalDesactivados = financeRecords.filter((f) => f.desactivado).length;

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
            <span>Registrar Movimiento</span>
          </button>
        </div>
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
          <span className="text-[10px] text-amber-700 font-semibold">Excluidos de costos finca</span>
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
        <div className="px-5 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">Libro Diario de Caja y Bancos</h3>
            <span className="text-xs text-stone-500 font-medium">({filteredRecords.length} movimientos)</span>
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
                Todos ({financeRecords.length})
              </button>
              <button
                onClick={() => setStatusFilter('activos')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                  statusFilter === 'activos' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Activos ({financeRecords.length - totalDesactivados})
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

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <DollarSign className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay movimientos financieros con este criterio.</p>
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
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRecords.map((f) => {
                  const isIngreso = f.tipo === 'Ingreso Operativo';
                  const isPersonal = f.tipo === 'Gasto Personal (Excluido Finca)';
                  const isDeactivated = f.desactivado;
                  return (
                    <tr
                      key={f.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isDeactivated ? 'bg-stone-50/50 opacity-70' : ''}`}
                    >
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
                      <td className="py-3 px-4 text-stone-800 text-[11px] max-w-xs truncate">
                        {f.concepto}
                      </td>
                      <td className="py-3 px-4 text-right font-black">
                        <span className={isIngreso ? 'text-emerald-800' : isPersonal ? 'text-stone-700' : 'text-red-600'}>
                          {isIngreso ? '+' : '-'}${f.monto.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {f.conciliado ? 'Sí' : 'No'}
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
                            onClick={() => setViewingFinance(f)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingFinance(f)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Editar movimiento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleDeactivateFinance(f.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isDeactivated
                                ? 'text-red-600 hover:text-emerald-700 hover:bg-emerald-50'
                                : 'text-stone-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={isDeactivated ? 'Reactivar movimiento' : 'Desactivar movimiento'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportSinglePDF(f)}
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="Descargar Ficha en PDF"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFinance(f.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar movimiento"
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
      {viewingFinance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">Detalle de Movimiento Financiero</h3>
              </div>
              <button onClick={() => setViewingFinance(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <span className="text-stone-500 font-bold block">Fecha</span>
                  <span className="font-bold text-stone-900 text-sm">{viewingFinance.fecha}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Estado en Sistema</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full font-bold ${viewingFinance.desactivado ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {viewingFinance.desactivado ? 'Desactivado' : 'Activo'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-semibold text-[11px] block">Monto de la Operación</span>
                  <span className="text-2xl font-black text-emerald-950">${viewingFinance.monto.toLocaleString()} MXN</span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-emerald-900 border border-emerald-200">
                  {viewingFinance.tipo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 font-bold block">Categoría Contable</span>
                  <span className="font-semibold text-stone-800">{viewingFinance.categoria}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">Cuenta / Banco</span>
                  <span className="font-semibold text-stone-800">{viewingFinance.cuentaBancaria}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Concepto / Glosa</span>
                <p className="mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                  {viewingFinance.concepto}
                </p>
              </div>

              <div>
                <span className="text-stone-500 font-bold block">Estado de Conciliación</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" /> {viewingFinance.conciliado ? 'Conciliado en Banco' : 'Pendiente'}
                </span>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingFinance)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold"
                >
                  <FileDown className="w-4 h-4 text-emerald-700" />
                  Descargar Ficha PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingFinance(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Movimiento */}
      {editingFinance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-700" />
                Editar Movimiento Financiero
              </h3>
              <button onClick={() => setEditingFinance(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={editingFinance.fecha}
                    onChange={(e) => setEditingFinance({ ...editingFinance, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Flujo</label>
                  <select
                    value={editingFinance.tipo}
                    onChange={(e) => setEditingFinance({ ...editingFinance, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Ingreso Operativo">Ingreso Operativo (Ventas)</option>
                    <option value="Egreso Finca">Egreso Finca (Operación)</option>
                    <option value="Amortización Préstamo">Amortización Préstamo</option>
                    <option value="Gasto Personal (Excluido Finca)">Gasto Personal (Excluido Finca)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={editingFinance.categoria}
                    onChange={(e) => setEditingFinance({ ...editingFinance, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Fertilizantes y Químicos">Fertilizantes y Químicos</option>
                    <option value="Nómina">Nómina</option>
                    <option value="Energía Eléctrica">Energía Eléctrica</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Venta de Flor">Venta de Flor</option>
                    <option value="Retiro de Socio">Retiro de Socio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cuenta / Banco</label>
                  <select
                    value={editingFinance.cuentaBancaria}
                    onChange={(e) => setEditingFinance({ ...editingFinance, cuentaBancaria: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="BBVA Finca Flores">BBVA Finca Flores</option>
                    <option value="Santander Operaciones">Santander Operaciones</option>
                    <option value="Caja Chica Efectivo">Caja Chica Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Monto ($ MXN)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={editingFinance.monto}
                  onChange={(e) => setEditingFinance({ ...editingFinance, monto: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Concepto Detallado</label>
                <textarea
                  rows={2}
                  required
                  value={editingFinance.concepto}
                  onChange={(e) => setEditingFinance({ ...editingFinance, concepto: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editConciliado"
                  checked={editingFinance.conciliado}
                  onChange={(e) => setEditingFinance({ ...editingFinance, conciliado: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-700"
                />
                <label htmlFor="editConciliado" className="text-xs text-stone-700 font-medium">
                  Conciliado con Estado de Cuenta Bancario
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingFinance(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition"
                >
                  Actualizar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Movimiento */}
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Flujo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Ingreso Operativo">Ingreso Operativo (Ventas)</option>
                    <option value="Egreso Finca">Egreso Finca (Operación)</option>
                    <option value="Amortización Préstamo">Amortización Préstamo</option>
                    <option value="Gasto Personal (Excluido Finca)">Gasto Personal (Excluido Finca)</option>
                  </select>
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
                    <option value="Fertilizantes y Químicos">Fertilizantes y Químicos</option>
                    <option value="Nómina">Nómina</option>
                    <option value="Energía Eléctrica">Energía Eléctrica</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Venta de Flor">Venta de Flor</option>
                    <option value="Retiro de Socio">Retiro de Socio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cuenta / Banco</label>
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
                <label className="block text-xs font-bold text-stone-700 mb-1">Monto ($ MXN)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Concepto Detallado</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Descripción detallada para auditoría de hacienda/finca..."
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newConciliado"
                  checked={formData.conciliado}
                  onChange={(e) => setFormData({ ...formData, conciliado: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-700"
                />
                <label htmlFor="newConciliado" className="text-xs text-stone-700 font-medium">
                  Conciliado con Estado de Cuenta Bancario
                </label>
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
