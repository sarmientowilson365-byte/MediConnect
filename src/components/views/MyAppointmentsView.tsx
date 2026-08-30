import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Plus,
  FileText,
  CreditCard,
  Share2
} from 'lucide-react';
import { Appointment, Modality, NavigationTab } from '../../types';

interface MyAppointmentsViewProps {
  appointments: Appointment[];
  setActiveTab: (tab: NavigationTab) => void;
  onJoinVideoCall: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({
  appointments,
  setActiveTab,
  onJoinVideoCall,
  onReschedule,
  onCancel,
}) => {
  const [activeTab, setActiveFilterTab] = useState<'proximas' | 'pasadas' | 'canceladas'>('proximas');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<'todas' | 'virtual' | 'presencial'>('todas');

  const filteredAppointments = appointments.filter(apt => {
    // Status match
    const statusMatch = activeTab === 'proximas' 
      ? apt.status === 'confirmada' || apt.status === 'pendiente'
      : activeTab === 'pasadas'
        ? apt.status === 'completada'
        : apt.status === 'cancelada';

    // Modality match
    const modalityMatch = modalityFilter === 'todas' ? true : apt.modality === modalityFilter;

    // Search match
    const searchMatch = searchQuery.trim() === '' || 
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.consultationReason.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && modalityMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mis Citas Médicas</h2>
          <p className="text-xs text-slate-600 mt-0.5">Administra tus teleconsultas virtuales y citas presenciales programadas.</p>
        </div>

        <button
          onClick={() => setActiveTab('agendar')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main Status Tabs */}
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs self-start">
            <button
              onClick={() => setActiveFilterTab('proximas')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'proximas' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Próximas ({appointments.filter(a => a.status === 'confirmada' || a.status === 'pendiente').length})
            </button>
            <button
              onClick={() => setActiveFilterTab('pasadas')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'pasadas' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historial Completadas ({appointments.filter(a => a.status === 'completada').length})
            </button>
            <button
              onClick={() => setActiveFilterTab('canceladas')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'canceladas' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Canceladas ({appointments.filter(a => a.status === 'cancelada').length})
            </button>
          </div>

          {/* Search Input & Modality Pill */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por médico o especialidad..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden"
              />
            </div>

            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
            >
              <option value="todas">Todas las modalidades</option>
              <option value="virtual">Telemedicina Virtual</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>

        </div>
      </div>

      {/* Appointments Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No se encontraron citas médicas</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No tienes citas en esta categoría. Puedes agendar una consulta virtual o presencial con nuestros especialistas certificados.
          </p>
          <button
            onClick={() => setActiveTab('agendar')}
            className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Agendar Cita Médica
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Doctor and Date info */}
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorPhoto}
                  alt={apt.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{apt.doctorName}</h3>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-md">
                      {apt.specialty}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 ${
                      apt.modality === 'virtual'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {apt.modality === 'virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {apt.modality === 'virtual' ? 'Virtual HD' : 'Presencial'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      apt.status === 'confirmada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'completada'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                    }`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {apt.time} hrs
                    </span>
                    {apt.location && (
                      <span className="flex items-center gap-1 text-slate-600">
                        📍 {apt.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 pt-0.5">
                    <strong className="text-slate-700">Motivo:</strong> {apt.consultationReason}
                  </p>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Nota médica: {apt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                {apt.status === 'confirmada' && (
                  <>
                    {apt.modality === 'virtual' && (
                      <button
                        onClick={() => onJoinVideoCall(apt)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Video className="w-4 h-4" />
                        <span>Unirse a videollamada</span>
                      </button>
                    )}

                    <button
                      onClick={() => onReschedule(apt)}
                      className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Reprogramar
                    </button>

                    <button
                      onClick={() => onCancel(apt)}
                      className="px-3.5 py-2.5 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {apt.status === 'completada' && (
                  <button
                    onClick={() => setActiveTab('historial')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ver informe clínico</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
