import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Pill, 
  Clock,
  Printer
} from 'lucide-react';
import { Prescription } from '../../types';

interface DigitalPrescriptionsViewProps {
  prescriptions: Prescription[];
  onViewPrescription: (prescription: Prescription) => void;
}

export const DigitalPrescriptionsView: React.FC<DigitalPrescriptionsViewProps> = ({
  prescriptions,
  onViewPrescription,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'activa' | 'por_vencer' | 'vencida'>('todas');

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchSearch = searchQuery.trim() === '' ||
      p.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'todas' ? true : p.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recetas Médicas Digitales</h2>
          <p className="text-xs text-slate-600 mt-0.5">Recetas oficiales con firma electrónica avanzada y código QR interoperable para farmacias.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
            {prescriptions.filter(p => p.status === 'activa' || p.status === 'por_vencer').length} Recetas Vigentes
          </span>
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
            placeholder="Buscar por medicamento, médico o diagnóstico..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
          >
            <option value="todas">Todos los estados</option>
            <option value="activa">Vigentes / Activas</option>
            <option value="por_vencer">Por vencer</option>
            <option value="vencida">Historial Vencidas</option>
          </select>
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Status & Code */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  rx.status === 'activa'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rx.status === 'por_vencer'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {rx.status === 'activa' ? '● Vigente' : rx.status === 'por_vencer' ? '⚠️ Por Vencer' : 'Vencida'}
                </span>

                <span className="font-mono text-[10px] text-slate-400 font-semibold">
                  RX-{rx.id.slice(-4).toUpperCase()}
                </span>
              </div>

              {/* Medication and dosage */}
              <div className="mt-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{rx.medicationName}</h3>
                </div>
                <p className="text-xs font-semibold text-slate-700 pl-6">
                  {rx.dosage} • {rx.frequency}
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  Duración: <strong className="text-slate-700">{rx.duration}</strong>
                </p>
              </div>

              {/* Prescribing doctor & Diagnostic */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Médico Emisor</span>
                  <span className="text-[10px] text-blue-600 font-medium">{rx.specialty}</span>
                </div>
                <p className="font-bold text-slate-900">{rx.doctorName}</p>
                <p className="text-[11px] text-slate-500">{rx.doctorLicense}</p>
                <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span>Diagnóstico:</span>
                  <span className="font-semibold text-slate-800">{rx.diagnosis}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span>Emisión:</span>
                  <p className="font-bold text-slate-700">{rx.issueDate}</p>
                </div>
                <div>
                  <span>Vigencia:</span>
                  <p className="font-bold text-slate-700">{rx.expirationDate}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onViewPrescription(rx)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Ver Receta</span>
              </button>
              
              <button
                onClick={() => onViewPrescription(rx)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
