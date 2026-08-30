import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Search, 
  Download, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Video, 
  MapPin, 
  Activity,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { MedicalHistoryItem, PatientProfile } from '../../types';

interface MedicalHistoryViewProps {
  medicalHistory: MedicalHistoryItem[];
  patient: PatientProfile;
  onViewRecordDetail: (record: MedicalHistoryItem) => void;
}

export const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({
  medicalHistory,
  patient,
  onViewRecordDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');

  const specialties = ['Todas', ...Array.from(new Set(medicalHistory.map(h => h.specialty)))];

  const filteredHistory = medicalHistory.filter(item => {
    const matchSearch = searchQuery.trim() === '' ||
      item.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.cie10Code && item.cie10Code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchSpec = selectedSpecialty === 'Todas' || item.specialty === selectedSpecialty;

    return matchSearch && matchSpec;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Historial Clínico Digital</h2>
          <p className="text-xs text-slate-600 mt-0.5">Expediente médico unificado, diagnósticos CIE-10, evolución y tratamientos prescritos.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Generando y descargando Expediente Clínico Completo en formato PDF oficial...')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Descargar Expediente Completo</span>
          </button>
        </div>
      </div>

      {/* Patient Key Medical Profile Bar */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-blue-300 text-[10px] uppercase font-bold">Grupo Sanguíneo</span>
          <p className="text-sm font-black mt-0.5">{patient.bloodType}</p>
        </div>
        <div>
          <span className="text-blue-300 text-[10px] uppercase font-bold">Alergias Conocidas</span>
          <p className="text-xs font-bold mt-0.5">{patient.allergies.join(', ')}</p>
        </div>
        <div>
          <span className="text-blue-300 text-[10px] uppercase font-bold">Condiciones Crónicas</span>
          <p className="text-xs font-bold mt-0.5">{patient.chronicConditions.join(', ')}</p>
        </div>
        <div>
          <span className="text-blue-300 text-[10px] uppercase font-bold">Seguro / Póliza</span>
          <p className="text-xs font-bold mt-0.5 truncate">{patient.insurance.provider}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por diagnóstico, CIE-10, médico o tratamiento..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden"
          />
        </div>

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
        >
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec === 'Todas' ? 'Todas las especialidades' : spec}</option>
          ))}
        </select>
      </div>

      {/* Chronological Timeline */}
      <div className="space-y-4">
        {filteredHistory.map((item, index) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={item.doctorPhoto}
                  alt={item.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{item.doctorName}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md">
                      {item.specialty}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.modality === 'virtual' ? 'Teleconsulta Virtual' : 'Presencial'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {item.cie10Code && (
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded-lg">
                    CIE-10: {item.cie10Code}
                  </span>
                )}
                <button
                  onClick={() => onViewRecordDetail(item)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Detalle Clínico</span>
                </button>
              </div>
            </div>

            {/* Diagnosis & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Diagnóstico Principal</span>
                <p className="font-bold text-slate-900 text-sm">{item.diagnosis}</p>
                <p className="text-slate-600 text-[11px] pt-1">{item.clinicalNotes}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl space-y-1 border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Tratamiento & Conducta</span>
                <p className="font-semibold text-emerald-950">{item.treatment}</p>
                {item.prescriptionGiven && (
                  <p className="text-[11px] text-emerald-800 pt-1">
                    <strong>Receta:</strong> {item.prescriptionGiven}
                  </p>
                )}
              </div>
            </div>

            {/* Vitals Summary at consultation */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Signos en consulta: <strong className="text-slate-800">{item.vitalSummary}</strong></span>
              </div>

              {item.attachments && item.attachments.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-blue-600 font-semibold mt-1 sm:mt-0">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{item.attachments.length} archivo(s) adjunto(s)</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
