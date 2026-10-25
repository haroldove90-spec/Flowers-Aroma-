import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmployeeRecord } from '../../types';
import { Plus, Trash2, Users, Award, Shield, DollarSign, X } from 'lucide-react';

export const PersonalRRHHModule: React.FC = () => {
  const { employees, addEmployee, deleteEmployee } = useApp();
  const [showModal, setShowModal] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(formData);
    setShowModal(false);
  };

  const totalColaboradores = employees.length;
  const nominaSemanal = employees.reduce((acc, e) => acc + (e.salarioBaseSemanal + e.bonoProductividad), 0);
  const bonosTotales = employees.reduce((acc, e) => acc + e.bonoProductividad, 0);

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
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Trabajador</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Plantilla Activa</span>
          <p className="text-xl font-black text-stone-900 mt-1">{totalColaboradores}</p>
          <span className="text-[10px] text-stone-500 font-medium">Colaboradores registrados</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Nómina Semanal</span>
          <p className="text-xl font-black text-emerald-800 mt-1">${nominaSemanal.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Incluye bonos devengados</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Bonos Productividad</span>
          <p className="text-xl font-black text-stone-900 mt-1">${bonosTotales.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 font-medium">Incentivos por tallo</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Asistencia Promedio</span>
          <p className="text-xl font-black text-stone-900 mt-1">98.5%</p>
          <span className="text-[10px] text-stone-500 font-medium">Jornada 6 días</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Padrón de Trabajadores y Cuadrillas</h3>
          <span className="text-xs text-stone-500 font-medium">{employees.length} personas</span>
        </div>

        {employees.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <Users className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium">No hay trabajadores registrados.</p>
            <p className="text-xs text-stone-400 mt-1">Presione "Registrar Trabajador" para añadir colaboradores y cuadrillas.</p>
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
                  <th className="py-3 px-4">Herramientas / EPP</th>
                  <th className="py-3 px-4">Permisos & Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-stone-50/80 transition-colors">
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
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate text-[11px]">
                      {emp.herramientasEntregadas}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {emp.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteEmployee(emp.id)}
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
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                Registrar Colaborador de Invernadero
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                  onClick={() => setShowModal(false)}
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
