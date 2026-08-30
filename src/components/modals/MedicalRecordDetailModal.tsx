import React from 'react';
import { X, ClipboardList, Download, FileText, Activity, ShieldCheck, User, Calendar, MapPin, Video } from 'lucide-react';
import { MedicalHistoryItem, PatientProfile } from '../../types';

interface MedicalRecordDetailModalProps {
  record: MedicalHistoryItem | null;
  patient: PatientProfile;
  onClose: () => void;
}

export const MedicalRecordDetailModal: React.FC<MedicalRecordDetailModalProps> = ({
  record,
  patient,
  onClose,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Expediente Clínico & Informe de Consulta</h3>
              <p className="text-[11px] text-slate-300">ID de Registro: {record.id.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={record.doctorPhoto}
                alt={record.doctorName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-slate-950 text-sm">{record.doctorName}</h4>
                <p className="text-xs text-blue-600 font-semibold">{record.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    {record.date}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                    {record.modality === 'virtual' ? 'Teleconsulta Virtual' : 'Consulta Presencial'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
              <span className="text-[10px] text-slate-600 uppercase font-bold">Paciente</span>
              <p className="text-xs font-bold text-slate-900">{patient.name}</p>
              <p className="text-[11px] text-slate-600">{patient.documentId}</p>
            </div>
          </div>

          {/* Diagnosis & CIE-10 */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Diagnóstico Principal</span>
              {record.cie10Code && (
                <span className="text-xs font-mono font-bold bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded">
                  CIE-10: {record.cie10Code}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-950 mt-1">{record.diagnosis}</p>
          </div>

          {/* Vitals at consultation */}
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              Signos Vitales Registrados en Consulta
            </h5>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
              {record.vitalSummary}
            </div>
          </div>

          {/* Clinical Notes & Findings */}
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-1.5">Evolución & Notas Médicas</h5>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {record.clinicalNotes}
            </div>
          </div>

          {/* Treatment plan */}
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-1.5">Plan de Tratamiento & Conducta Médica</h5>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed">
              <p className="font-semibold text-emerald-950">{record.treatment}</p>
              {record.prescriptionGiven && (
                <p className="text-xs text-emerald-800 mt-2 pt-2 border-t border-emerald-200/60">
                  <strong>Receta emitida:</strong> {record.prescriptionGiven}
                </p>
              )}
            </div>
          </div>

          {/* Attached Files / Lab Reports */}
          {record.attachments && record.attachments.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">Documentos y Estudios Adjuntos</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {record.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 truncate">{att.name}</p>
                        <span className="text-[10px] text-slate-600">{att.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Descargando archivo adjunto: ${att.name}`)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
};
