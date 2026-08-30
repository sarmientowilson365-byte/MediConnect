import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  FileText, 
  Download, 
  Eye, 
  CreditCard, 
  Activity, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  PhoneCall, 
  TrendingUp, 
  ShieldCheck,
  Stethoscope,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  PatientProfile, 
  Doctor, 
  Appointment, 
  Prescription, 
  VitalSignDataPoint, 
  MedicalHistoryItem, 
  PaymentItem, 
  NavigationTab,
  TimeFilter,
  VitalType
} from '../../types';

interface DashboardOverviewProps {
  patient: PatientProfile;
  appointments: Appointment[];
  doctors: Doctor[];
  prescriptions: Prescription[];
  weeklyVitals: VitalSignDataPoint[];
  monthlyVitals: VitalSignDataPoint[];
  yearlyVitals: VitalSignDataPoint[];
  medicalHistory: MedicalHistoryItem[];
  payments: PaymentItem[];
  setActiveTab: (tab: NavigationTab) => void;
  onJoinVideoCall: (appointment: Appointment) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onViewPrescription: (prescription: Prescription) => void;
  onPayBill: (payment: PaymentItem) => void;
  onViewMedicalRecord: (record: MedicalHistoryItem) => void;
  onSelectDoctorToBook: (doctor: Doctor) => void;
  onOpenAddVitalModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patient,
  appointments = [],
  doctors = [],
  prescriptions = [],
  weeklyVitals = [],
  monthlyVitals = [],
  yearlyVitals = [],
  medicalHistory = [],
  payments = [],
  setActiveTab = (_tab: NavigationTab) => {},
  onJoinVideoCall = (_appointment: Appointment) => {},
  onRescheduleAppointment = (_appointment: Appointment) => {},
  onCancelAppointment = (_appointment: Appointment) => {},
  onViewPrescription = (_prescription: Prescription) => {},
  onPayBill = (_payment: PaymentItem) => {},
  onViewMedicalRecord = (_record: MedicalHistoryItem) => {},
  onSelectDoctorToBook = (_doctor: Doctor) => {},
  onOpenAddVitalModal = () => {},
}) => {
  const [selectedVitalType, setSelectedVitalType] = useState<VitalType>('presion');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('semana');

  const safeAppointments = appointments || [];
  const safePrescriptions = prescriptions || [];
  const safePayments = payments || [];
  const safeDoctors = doctors || [];
  const safeMedicalHistory = medicalHistory || [];

  // Filter active and upcoming appointments
  const upcomingAppointments = safeAppointments.filter(a => a.status === 'confirmada');
  const nextAppointment = upcomingAppointments[0] || null;
  const completedAppointmentsCount = safeAppointments.filter(a => a.status === 'completada').length;
  
  const activePrescriptions = safePrescriptions.filter(p => p.status === 'activa' || p.status === 'por_vencer');
  const expiringPrescription = safePrescriptions.find(p => p.status === 'por_vencer');

  const pendingPayments = safePayments.filter(p => p.status === 'pendiente');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Vital signs dataset according to filter
  const currentVitalDataset = (selectedTimeFilter === 'semana' 
    ? (weeklyVitals || [])
    : selectedTimeFilter === 'mes' 
      ? (monthlyVitals || [])
      : (yearlyVitals || []));

  // Chart styling configs
  const getVitalChartConfig = () => {
    switch (selectedVitalType) {
      case 'presion':
        return {
          title: 'Presión Arterial (Sistólica / Diastólica)',
          unit: 'mmHg',
          color1: '#2563EB',
          color2: '#0D9488',
          dataKey1: 'systolicBP',
          dataKey2: 'diastolicBP',
          name1: 'Sistólica',
          name2: 'Diastólica',
          currentVal: '119 / 78',
          status: 'Óptima',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'cardiaco':
        return {
          title: 'Frecuencia Cardíaca',
          unit: 'bpm',
          color1: '#E11D48',
          dataKey1: 'heartRate',
          name1: 'Pulsaciones',
          currentVal: '69',
          status: 'Normal en reposo',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'glucosa':
        return {
          title: 'Nivel de Glucosa en Sangre',
          unit: 'mg/dL',
          color1: '#D97706',
          dataKey1: 'glucose',
          name1: 'Glucosa en Ayunas',
          currentVal: '90',
          status: 'En Rango Meta (70-99)',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'peso':
        return {
          title: 'Peso Corporal & Evolución',
          unit: 'kg',
          color1: '#4F46E5',
          dataKey1: 'weight',
          name1: 'Peso (kg)',
          currentVal: '76.5',
          status: 'IMC 24.1 (Saludable)',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'spo2':
        return {
          title: 'Saturación de Oxígeno',
          unit: '% SpO2',
          color1: '#059669',
          dataKey1: 'spo2',
          name1: 'Oxigenación',
          currentVal: '99%',
          status: 'Excelente (95-100%)',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
      case 'temperatura':
        return {
          title: 'Temperatura Corporal',
          unit: '°C',
          color1: '#EA580C',
          dataKey1: 'temperature',
          name1: 'Temperatura',
          currentVal: '36.5',
          status: 'Afebril / Normal',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        };
    }
  };

  const chartConfig = getVitalChartConfig();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Portal del Paciente Activo • MediConnect TeleSalud</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            ¡Hola, {patient.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Tu salud está bajo control. Hoy tienes una <strong className="text-white">teleconsulta programada a las 16:30 hrs</strong> y tus signos vitales se mantienen en rango óptimo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="dashboard-header-book-btn"
            onClick={() => setActiveTab('agendar')}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Nueva Cita</span>
          </button>
          
          <button
            onClick={() => setActiveTab('signos')}
            className="px-4 py-2.5 bg-blue-800/80 hover:bg-blue-900/80 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-teal-300" />
            <span>Ver Signos</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Tarjetas Resumen) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Próxima Cita Médica */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
              {nextAppointment ? 'Hoy' : 'Sin citas'}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600">Próxima Cita Médica</p>
            {nextAppointment ? (
              <div className="mt-1">
                <p className="text-sm font-bold text-slate-900 truncate">{nextAppointment.doctorName}</p>
                <p className="text-xs text-blue-600 font-medium">{nextAppointment.specialty} • {nextAppointment.time} hrs</p>
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-400 mt-1">No tienes citas agendadas</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            {nextAppointment && nextAppointment.modality === 'virtual' ? (
              <button
                onClick={() => onJoinVideoCall(nextAppointment)}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-blue-500/20"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Entrar a Videollamada</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('citas')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver mis citas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Consultas Completadas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              100% Asistencia
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600">Consultas Completadas</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{completedAppointmentsCount}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Historial clínico al día</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('historial')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Ver expediente clínico</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Recetas Activas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            {expiringPrescription && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                1 por vencer
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600">Recetas Digitales Activas</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{activePrescriptions.length}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Firmas médicas validadas</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('recetas')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>Descargar recetas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Pagos Pendientes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            {pendingPayments.length > 0 ? (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full">
                Por abonar
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Al día
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600">Pagos y Facturación</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              ${totalPendingAmount.toFixed(2)} <span className="text-xs font-normal text-slate-600">USD</span>
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {pendingPayments.length > 0 ? '1 consulta por confirmar' : 'Sin saldos pendientes'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            {pendingPayments.length > 0 ? (
              <button
                onClick={() => onPayBill(pendingPayments[0])}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-rose-500/20"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pagar Ahora</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('pagos')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>Ver comprobantes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Appointments, Vitals Tracker, Digital Prescriptions, Medical History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Próximas Citas */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Próximas Citas Médicas</h3>
                  <p className="text-xs text-slate-600">Consultas virtuales HD y presenciales programadas</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('citas')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver todas ({upcomingAppointments.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={apt.doctorPhoto}
                      alt={apt.doctorName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{apt.doctorName}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md">
                          {apt.specialty}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md flex items-center gap-1 ${
                          apt.modality === 'virtual' 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {apt.modality === 'virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {apt.modality === 'virtual' ? 'Virtual HD' : 'Presencial'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-600" />
                          {apt.time} hrs
                        </span>
                        {apt.location && (
                          <span className="text-[11px] text-slate-600 truncate max-w-xs">
                            📍 {apt.location.split('-')[0]}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        Motivo: <span className="text-slate-700 font-medium">{apt.consultationReason}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    {apt.modality === 'virtual' && (
                      <button
                        onClick={() => onJoinVideoCall(apt)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Unirse a videollamada</span>
                      </button>
                    )}

                    <button
                      onClick={() => onRescheduleAppointment(apt)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Reprogramar
                    </button>

                    <button
                      onClick={() => onCancelAppointment(apt)}
                      className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Seguimiento de Signos Vitales (Interactive Dynamic Charts) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Seguimiento de Signos Vitales</h3>
                  <p className="text-xs text-slate-600">Evolución biométrica y telemetría sincronizada</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Time range filters */}
                <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs">
                  {(['semana', 'mes', 'ano'] as TimeFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedTimeFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                        selectedTimeFilter === filter
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter === 'ano' ? 'Año' : filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onOpenAddVitalModal}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar</span>
                </button>
              </div>
            </div>

            {/* Vital selector pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'presion' as VitalType, label: 'Presión Arterial', value: '119/78 mmHg' },
                { id: 'cardiaco' as VitalType, label: 'Frecuencia Cardíaca', value: '69 bpm' },
                { id: 'glucosa' as VitalType, label: 'Nivel Glucosa', value: '90 mg/dL' },
                { id: 'peso' as VitalType, label: 'Peso Corporal', value: '76.5 kg' },
                { id: 'spo2' as VitalType, label: 'Saturación SpO2', value: '99%' },
                { id: 'temperatura' as VitalType, label: 'Temperatura', value: '36.5 °C' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVitalType(v.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                    selectedVitalType === v.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold">{v.label}</p>
                  <p className={`text-[11px] ${selectedVitalType === v.id ? 'text-blue-100' : 'text-slate-600'}`}>{v.value}</p>
                </button>
              ))}
            </div>

            {/* Chart Area with Recharts */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{chartConfig.title}</h4>
                  <p className="text-[11px] text-slate-600">Unidad de medida: {chartConfig.unit}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Último: <strong className="text-blue-600 font-black">{chartConfig.currentVal}</strong>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${chartConfig.statusColor}`}>
                    {chartConfig.status}
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedVitalType === 'presion' ? (
                    <LineChart data={currentVitalDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 150]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                      />
                      <ReferenceLine y={120} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Meta 120', fill: '#94a3b8', fontSize: 10 }} />
                      <Line type="monotone" dataKey="systolicBP" name="Sistólica" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="diastolicBP" name="Diastólica" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 4, fill: '#0D9488' }} />
                    </LineChart>
                  ) : (
                    <AreaChart data={currentVitalDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartConfig.color1} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={chartConfig.color1} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                      />
                      <Area type="monotone" dataKey={chartConfig.dataKey1} name={chartConfig.name1} stroke={chartConfig.color1} strokeWidth={3} fillOpacity={1} fill="url(#vitalGrad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section: Recetas Digitales */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recetas Digitales Activas</h3>
                  <p className="text-xs text-slate-600">Prescripciones oficiales con firma médica verificada</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('recetas')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver todas ({prescriptions.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activePrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        rx.status === 'activa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {rx.status === 'activa' ? 'Vigente' : 'Vence en 4 días'}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">RX-{rx.id.slice(-3)}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-2">{rx.medicationName}</h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{rx.dosage} • {rx.frequency}</p>
                    <p className="text-[11px] text-slate-600 mt-1">Prescrito por: <strong className="text-slate-700">{rx.doctorName}</strong></p>
                    <p className="text-[11px] text-slate-600">Válida hasta: <strong className="text-slate-700">{rx.expirationDate}</strong></p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewPrescription(rx)}
                      className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Ver receta</span>
                    </button>
                    <button
                      onClick={() => onViewPrescription(rx)}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Historial Médico Reciente */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Historial Médico Reciente</h3>
                  <p className="text-xs text-slate-600">Registro cronológico de diagnósticos y tratamientos</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('historial')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Ver historial completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {medicalHistory.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.date}</span>
                        <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                          {item.specialty}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{item.diagnosis}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">Médico: {item.doctorName} • Tratamiento: {item.treatment.slice(0, 60)}...</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewMedicalRecord(item)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 shrink-0 transition-colors"
                  >
                    Ver detalle
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Especialistas Recomendados, Pagos Pendientes/Recientes, Emergency Card */}
        <div className="space-y-6">
          
          {/* Especialistas Recomendados */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h3 className="font-bold text-sm text-slate-900">Especialistas Recomendados</h3>
              </div>
              <button
                onClick={() => setActiveTab('medicos')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-3.5">
              {doctors.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-[11px] text-blue-600 font-medium">{doc.specialty}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          {doc.rating}
                        </span>
                        <span>({doc.reviewCount} opiniones)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-600">Disponibilidad:</span>
                      <p className="text-[11px] font-bold text-emerald-700">{doc.nextAvailableSlot.split(',')[0]}</p>
                    </div>

                    <button
                      onClick={() => onSelectDoctorToBook(doc)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs shadow-blue-500/20"
                    >
                      Agendar cita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagos Realizados y Pendientes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Pagos & Facturación</h3>
              </div>
              <button
                onClick={() => setActiveTab('pagos')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2.5">
              {payments.slice(0, 3).map((pay) => (
                <div
                  key={pay.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{pay.concept.split(' ')[0]} {pay.specialty}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        pay.status === 'pagado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pay.status === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {pay.date} • {pay.method === 'tarjeta' ? `Tarjeta *${pay.methodLast4 || '4242'}` : pay.method.toUpperCase()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-slate-900">${pay.amount.toFixed(2)}</p>
                    {pay.status === 'pendiente' ? (
                      <button
                        onClick={() => onPayBill(pay)}
                        className="mt-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-md transition-colors"
                      >
                        Pagar ahora
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 justify-end">
                        <CheckCircle2 className="w-3 h-3" />
                        Comprobante
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Health Tip / Adherence */}
          <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50/60 rounded-2xl border border-teal-200/80 space-y-2">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recomendación Preventiva del Día</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              El Dr. Alejandro Morales recomienda mantener un vaso de agua antes del desayuno y evitar alimentos ultraprocesados para proteger tu presión arterial.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
