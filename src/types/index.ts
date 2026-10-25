export interface ProductionUnit {
  id: string;
  predio: string;
  modulo: string;
  seccion: string;
  superficieM2: number;
  tuneles: number;
  camas: number;
  variedad: string;
  color: string;
  numPlantas: number;
  densidadM2: number;
  coordenadas: string;
  altitudMsnm: number;
  regimenTenencia: 'Propiedad' | 'Arrendamiento' | 'Asociación';
  fechaPlantacion: string;
  metaTallosAnual: number;
  croquisUrl?: string;
  estado: 'En producción' | 'Renovación' | 'Preparación de suelo';
}

export interface CulturalLabor {
  id: string;
  modulo: string;
  seccion: string;
  labor: 'Desahije' | 'Tutoreo' | 'Toque de hoja' | 'Desmalezado' | 'Pinch' | 'Poda' | 'Limpieza' | 'Manejo de cortinas' | 'Descompactación';
  fechaProgramada: string;
  responsableEquipo: string;
  avancePorcentaje: number;
  estado: 'Programada' | 'En curso' | 'Concluida' | 'Atrasada';
  incidencias?: string;
  evidenciaFoto?: string;
}

export interface FertirrigationRecord {
  id: string;
  sector: string;
  modulo: string;
  fecha: string;
  bombaValvula: string;
  tiempoRiegoMin: number;
  caudalLitrosHora: number;
  volumenM3: number;
  ph: number;
  conductividadElectrica: number; // mS/cm
  tensionCbar: number;
  tanqueA_kg: string; // e.g. Nitrato de Calcio, Quelato de Hierro
  tanqueB_kg: string; // e.g. Nitrato de Potasio, Fosfato Monopotásico
  costoEstimado: number;
  observaciones?: string;
}

export interface PhytosanitaryRecord {
  id: string;
  fecha: string;
  moduloSeccion: string;
  plagaEnfermedad: 'Trips' | 'Arañita Roja' | 'Botrytis' | 'Oídio' | 'Mildeo Velloso' | 'Minador' | 'Pulgón' | 'Preventivo';
  incidenciaPorc: number;
  severidad: 'Leve (1)' | 'Moderada (2)' | 'Alta (3)' | 'Crítica (4)';
  productoComercial: string;
  ingredienteActivo: string;
  dosisPorHectolitro: string;
  volumenAguaLitros: number;
  operarioEquipo: string;
  loteProducto: string;
  periodoReingresoHoras: number;
  eppRequerido: string;
  eficaciaPorc?: number;
  costoTotal: number;
}

export interface EmployeeRecord {
  id: string;
  nombre: string;
  puesto: 'Supervisor de Campo' | 'Operario de Riego' | 'Fitosanitarista' | 'Cuadrilla de Corte' | 'Clasificador Poscosecha' | 'Administrativo';
  equipoCuadrilla: string;
  moduloAsignado: string;
  salarioBaseSemanal: number;
  bonoProductividad: number;
  asistenciaDias: number;
  permisosVacaciones: string;
  herramientasEntregadas: string;
  estado: 'Activo' | 'Vacaciones' | 'Incapacidad';
}

export interface HarvestRecord {
  id: string;
  codigoLote: string;
  fecha: string;
  modulo: string;
  variedad: string;
  tallosCortados: number;
  personalCorte: string;
  longitudCm: '40 cm' | '50 cm' | '60 cm' | '70 cm' | '80 cm' | 'Selecta 90+';
  calidad: 'Exportación' | 'Nacional Grado 1' | 'Nacional Grado 2';
  paquetes25: number; // calculated: tallos / 25
  mermaTallos: number;
  mermaCausa: string;
  tratamientoHidratacion: 'Solución STS + Chrysal' | 'Agua Clorada + Acidificante' | 'Bactericida flor';
  temperaturaCamaraC: number;
  humedadCamaraPorc: number;
  estadoLote: 'En Hidratación' | 'Cámara Fría' | 'Listo Despacho' | 'Despachado';
}

export interface SaleRecord {
  id: string;
  fecha: string;
  cliente: string;
  mercado: 'Exportación Miami' | 'Exportación Europa' | 'Central de Abasto' | 'Florerías Locales' | 'Eventos / Bodas';
  variedad: string;
  clasificacion: string;
  paquetesVendidos: number;
  precioPorPaquete: number;
  totalVenta: number;
  tipoPago: 'Efectivo' | 'Transferencia' | 'Crédito 15 días' | 'Crédito 30 días';
  estadoCobro: 'Cobrado' | 'Pendiente' | 'Vencido';
  fechaVencimiento?: string;
  campanaEspecial?: 'San Valentín' | 'Día de las Madres' | 'Día de Muertos' | 'Navidad' | 'Semana Regular';
}

export interface WarehouseItem {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'Fertilizantes' | 'Fitosanitarios' | 'Material de Empaque' | 'Herramientas y EPP' | 'Riego y Repuestos';
  unidadMedida: 'Saco 25kg' | 'Litro' | 'Kilo' | 'Paquete 1000 pzas' | 'Pieza';
  stockActual: number;
  stockMinimo: number;
  almacenUbicacion: 'Almacén Principal' | 'Bodega Químicos' | 'Caseta de Riego' | 'Empaque';
  proveedorHabitual: string;
  costoUnitario: number;
  loteCaducidad?: string;
  estadoReposicion: 'Óptimo' | 'Alerta Reposición' | 'Agotado';
}

export interface FinanceRecord {
  id: string;
  fecha: string;
  tipo: 'Ingreso Operativo' | 'Egreso Finca' | 'Gasto Personal (Excluido Finca)' | 'Amortización Préstamo' | 'Inversión Activo';
  categoria: 'Venta de Flor' | 'Nómina' | 'Fertilizantes y Químicos' | 'Energía Eléctrica' | 'Mantenimiento' | 'Retiro de Socio';
  cuentaBancaria: 'BBVA Finca Flores' | 'Santander Operaciones' | 'Caja Chica Efectivo';
  monto: number;
  concepto: string;
  comprobanteUrl?: string;
  conciliado: boolean;
}

export interface CostRecord {
  id: string;
  modulo: string;
  variedad: string;
  periodoMes: string;
  costoManoObra: number;
  costoAguaEnergia: number;
  costoInsumos: number;
  costoFijoIndirecto: number;
  totalCosto: number;
  tallosProducidos: number;
  costoPorTallo: number;
  costoPorPaquete: number;
  precioPromedioVentaPaquete: number;
  margenContribucionPorc: number;
}

export interface AssetRecord {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'Invernadero / Nave' | 'Tractor / Vehículo' | 'Sistema Fertirriego / Bombeo' | 'Cámara Fría' | 'Herramienta Mayor';
  tenencia: 'Propio' | 'Arrendado' | 'Compartido';
  valorAdquisicion: number;
  fechaAdquisicion: string;
  vidaUtilAnos: number;
  proximoMantenimiento: string;
  estadoOperativo: 'Excelente' | 'Requiere Mantenimiento' | 'En Reparación';
  bitacoraNotas: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  modulo: string;
  accion: 'Creación' | 'Edición' | 'Eliminación' | 'Vaciado de prueba' | 'Restauración';
  detalle: string;
}

export interface SupabaseConfig {
  configured: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  lastSync?: string;
  tablePrefix?: string;
}
