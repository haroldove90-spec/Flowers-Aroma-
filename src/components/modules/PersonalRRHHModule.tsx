import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmployeeRecord } from '../../types';
import { exportRecordToPDF, exportModuleTableToPDF } from '../../utils/pdfExport';
import {
  Plus,
  Trash2,
  Users,
  X,
  Eye,
  Edit2,
  Power,
  FileText,
  Printer
} from 'lucide-react';

export const PersonalRRHHModule: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    toggleDeactivateEmployee,
    deleteEmployee
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<EmployeeRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [formData, setFormData] = useState<Omit<EmployeeRecord, 'id'>>({
    nombre: 'Pedro Ramírez',
    puesto: 'Cuadrilla de Corte',
    equipoCuadrilla: 'Cuadrilla Cosecha Poniente',
    moduloAsignado: 'Módulo 2 - Exportación',
    salarioBaseSemanal: 2400,
    bonoProductividad: 500,
    asistenciaDias: 6,
    permisosVacaciones: 'Sin incidencias',
    herramientasEntregadas: 'Tijeras de corte profesionales, mandil, guantes',
    estado: 'Activo'
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    updateEmployee(editingEmployee.id, editingEmployee);
    setEditingEmployee(null);
  };

  const handleExportSinglePDF = (emp: EmployeeRecord) => {
    exportRecordToPDF(
      '05. PERSONAL Y RECURSOS HUMANOS',
      emp.id,
      [
        { label: 'Nombre Completo', value: emp.nombre, highlight: true },
        { label: 'Puesto Laboral', value: emp.puesto, highlight: true },
        { label: 'Equipo / Cuadrilla', value: emp.equipoCuadrilla },
        { label: 'Módulo Asignado', value: emp.moduloAsignado },
        { label: 'Salario Base Semanal', value: `$${emp.salarioBaseSemanal.toLocaleString()} MXN` },
        { label: 'Bono Productividad Estimado', value: `$${emp.bonoProductividad.toLocaleString()} MXN` },
        { label: 'Total Semanal Devengado', value: `$${(emp.salarioBaseSemanal + emp.bonoProductividad).toLocaleString()} MXN`, highlight: true },
        { label: 'Asistencia Registrada', value: `${emp.asistenciaDias} días / semana` },
        { label: 'Herramientas y EPP Entregado', value: emp.herramientasEntregadas },
        { label: 'Vacaciones y Permisos', value: emp.permisosVacaciones },
        { label: 'Estado Laboral', value: emp.estado },
        { label: 'Estatus en Sistema', value: emp.desactivado ? 'Desactivado / Inactivo' : 'Activo' }
      ],
      `Ficha laboral oficial Invernadero Aroma Flowers. Registra entrega y resguardo de herramientas de corte y equipo de protección personal.`,
      emp.desactivado ? 'Desactivado' : 'Activo'
    );
  };

  const handleExportTablePDF = () => {
    const headers = ['ID', 'Nombre', 'Puesto', 'Cuadrilla', 'Módulo', 'Salario Semanal', 'Bono', 'Total', 'Estado'];
    const rows = filteredEmployees.map((e) => [
      e.id,
      e.nombre,
      e.puesto,
      e.equipoCuadrilla,
      e.moduloAsignado,
      `$${e.salarioBaseSemanal.toLocaleString()}`,
      `$${e.bonoProductividad.toLocaleString()}`,
      `$${(e.salarioBaseSemanal + e.bonoProductividad).toLocaleString()}`,
      e.desactivado ? 'Inactivo' : e.estado
    ]);
    exportModuleTableToPDF('05. Personal y Recursos Humanos', headers, rows);
  };

  const filteredEmployees = employees.filter((e) => {
    if (filterStatus === 'active') return !e.desactivado;
    if (filterStatus === 'inactive') return e.desactivado;
    return true;
  });

  const totalColaboradores = employees.length;
  const nominaSemanal = employees
    .filter((e) => !e.desactivado)
    .reduce((acc, e) => acc + (e.salarioBaseSemanal + e.bonoProductividad), 0);
  const bonosTotales = employees
    .filter((e) => !e.desactivado)
    .reduce((acc, e) => acc + e.bonoProductividad, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-700">05.</span> PERSONAL Y RECURSOS HUMANOS
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Plantilla laboral, asignación de cuadrillas, control de asistencia, nómina semanal, bonos y entrega de herramientas.
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
            <span>Registrar Trabajador</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Plantilla Activa</span>
          <p className="text-xl font-black text-stone-900 mt-1">
            {employees.filter((e) => !e.desactivado).length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium">De {totalColaboradores} registrados</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Nómina Semanal Activa</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${nominaSemanal.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Incluye bonos devengados</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Bonos Productividad</span>
          <p className="text-xl font-black text-stone-900 mt-1">${bonosTotales.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Incentivos por cosecha</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Asistencia Promedio</span>
          <p className="text-xl font-black text-stone-900 mt-1">98.5%</p>
          <span className="text-[10px] text-stone-500 font-medium">Jornada 6 días</span>
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
            Todos ({employees.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'active' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Activos ({employees.filter((e) => !e.desactivado).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              filterStatus === 'inactive' ? 'bg-red-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Desactivados ({employees.filter((e) => e.desactivado).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Padrón de Trabajadores y Cuadrillas</h3>
          <span className="text-xs text-stone-500 font-medium">{filteredEmployees.length} personas</span>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Users className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay trabajadores con el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Nombre & Puesto</th>
                  <th className="py-3 px-4">Cuadrilla / Módulo</th>
                  <th className="py-3 px-4">Salario Base</th>
                  <th className="py-3 px-4">Bono Productividad</th>
                  <th className="py-3 px-4">Asistencia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center min-w-[170px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      emp.desactivado ? 'bg-stone-50/60 opacity-70' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{emp.nombre}</div>
                      <div className="text-[11px] text-emerald-800 font-bold">{emp.puesto}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{emp.equipoCuadrilla}</div>
                      <div className="text-[11px] text-stone-500">{emp.moduloAsignado}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      ${emp.salarioBaseSemanal.toLocaleString()}/sem
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      +${emp.bonoProductividad.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-semibold">
                        {emp.asistenciaDias} días
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.desactivado
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {emp.desactivado ? 'Inactivo' : emp.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition"
                          title="Ver ficha completa de empleado"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-stone-100 rounded-lg transition"
                          title="Editar colaborador"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Desactivar / Activar */}
                        <button
                          onClick={() => toggleDeactivateEmployee(emp.id)}
                          className={`p-1.5 rounded-lg transition ${
                            emp.desactivado
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={emp.desactivado ? 'Reactivar colaborador' : 'Desactivar / dar de baja temporal'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        {/* Exportar PDF */}
                        <button
                          onClick={() => handleExportSinglePDF(emp)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                          title="Exportar ficha laboral a PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar colaborador"
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
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Ficha Laboral: {viewingEmployee.nombre} ({viewingEmployee.id})
                </h3>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Puesto</span>
                  <span className="font-bold text-stone-900 text-sm">{viewingEmployee.puesto}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Cuadrilla & Módulo</span>
                  <span className="font-bold text-stone-900">{viewingEmployee.equipoCuadrilla} &bull; {viewingEmployee.moduloAsignado}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-500 font-bold block mb-1">Salario Base Semanal</span>
                  <span className="font-bold text-stone-900">${viewingEmployee.salarioBaseSemanal.toLocaleString()} MXN</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-emerald-800 font-bold block mb-1">Total Semanal (Base + Bono)</span>
                  <span className="font-black text-emerald-950 text-sm">
                    ${(viewingEmployee.salarioBaseSemanal + viewingEmployee.bonoProductividad).toLocaleString()} MXN
                  </span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Herramientas y EPP en Resguardo</span>
                <p className="text-stone-900 font-medium">{viewingEmployee.herramientasEntregadas}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Permisos y Vacaciones</span>
                <p className="text-stone-900">{viewingEmployee.permisosVacaciones}</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => handleExportSinglePDF(viewingEmployee)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar Ficha PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingEmployee(null)}
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
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-700" />
                Editar Colaborador: {editingEmployee.id}
              </h3>
              <button onClick={() => setEditingEmployee(null)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.nombre}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, nombre: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Puesto *</label>
                  <select
                    value={editingEmployee.puesto}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, puesto: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Supervisor de Campo">Supervisor de Campo</option>
                    <option value="Operario de Riego">Operario de Riego</option>
                    <option value="Fitosanitarista">Fitosanitarista</option>
                    <option value="Cuadrilla de Corte">Cuadrilla de Corte</option>
                    <option value="Clasificador Poscosecha">Clasificador Poscosecha</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Equipo / Cuadrilla</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.equipoCuadrilla}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, equipoCuadrilla: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo Asignado</label>
                  <input
                    type="text"
                    value={editingEmployee.moduloAsignado}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, moduloAsignado: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sueldo Base ($)</label>
                  <input
                    type="number"
                    value={editingEmployee.salarioBaseSemanal}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salarioBaseSemanal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Bono ($)</label>
                  <input
                    type="number"
                    value={editingEmployee.bonoProductividad}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, bonoProductividad: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Herramientas y EPP Entregados</label>
                <input
                  type="text"
                  value={editingEmployee.herramientasEntregadas}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, herramientasEntregadas: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition"
                >
                  Actualizar Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                Registrar Colaborador de Invernadero
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Puesto *</label>
                  <select
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  >
                    <option value="Supervisor de Campo">Supervisor de Campo</option>
                    <option value="Operario de Riego">Operario de Riego</option>
                    <option value="Fitosanitarista">Fitosanitarista</option>
                    <option value="Cuadrilla de Corte">Cuadrilla de Corte</option>
                    <option value="Clasificador Poscosecha">Clasificador Poscosecha</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Equipo / Cuadrilla</label>
                  <input
                    type="text"
                    required
                    value={formData.equipoCuadrilla}
                    onChange={(e) => setFormData({ ...formData, equipoCuadrilla: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Módulo Asignado</label>
                  <input
                    type="text"
                    value={formData.moduloAsignado}
                    onChange={(e) => setFormData({ ...formData, moduloAsignado: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Sueldo Base Semanal ($)</label>
                  <input
                    type="number"
                    value={formData.salarioBaseSemanal}
                    onChange={(e) => setFormData({ ...formData, salarioBaseSemanal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Bono Estimado ($)</label>
                  <input
                    type="number"
                    value={formData.bonoProductividad}
                    onChange={(e) => setFormData({ ...formData, bonoProductividad: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Herramientas / EPP Entregadas</label>
                <input
                  type="text"
                  placeholder="Ej. Tijeras Felco 2, Delantal, Botas, Medidor..."
                  value={formData.herramientasEntregadas}
                  onChange={(e) => setFormData({ ...formData, herramientasEntregadas: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
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
                  Registrar Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
