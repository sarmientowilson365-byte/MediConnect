import React from 'react';
import { X, PhoneCall, AlertTriangle, ShieldCheck, HeartPulse, MapPin, User } from 'lucide-react';
import { PatientProfile } from '../../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base">Protocolo de Emergencia Médica</h3>
              <p className="text-[11px] text-rose-100">Atención inmediata 24/7 y triage rápido</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-rose-100 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-rose-900">
              <p className="font-bold">¿Presentas dolor torácico opresivo, dificultad respiratoria grave o pérdida de conciencia?</p>
              <p className="mt-0.5 text-[11px]">Comunícate de inmediato con las líneas prioritarias o acude a la sala de emergencias más cercana.</p>
            </div>
          </div>

          {/* Emergency numbers */}
          <div className="space-y-2">
            <a
              href="tel:106"
              className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center font-black text-lg">
                  106
                </div>
                <div>
                  <p className="font-bold text-sm">SAMU (Ambulancia & Triage)</p>
                  <p className="text-[11px] text-slate-300">Servicio de Atención Médica de Urgencias</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-bold">
                Llamar Ahora
              </span>
            </a>

            <a
              href="tel:116"
              className="flex items-center justify-between p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-lg">
                  116
                </div>
                <div>
                  <p className="font-bold text-sm">Bomberos & Rescate</p>
                  <p className="text-[11px] text-slate-600">Emergencias de rescate y auxilio</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg font-semibold">
                Llamar
              </span>
            </a>
          </div>

          {/* Emergency contact info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Contacto de Emergencia Designado</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">{patient.emergencyContact.name}</p>
                <p className="text-[11px] text-slate-600">{patient.emergencyContact.relationship}</p>
              </div>
              <a
                href={`tel:${patient.emergencyContact.phone}`}
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {patient.emergencyContact.phone}
              </a>
            </div>
          </div>

          {/* Critical medical info */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <p className="font-bold text-amber-900 text-[11px]">Información Médica Crítica del Paciente:</p>
            <p className="text-[11px] text-amber-950">
              <strong>Grupo Sanguíneo:</strong> {patient.bloodType} | <strong>Alergias:</strong> {patient.allergies.join(', ')}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
            >
              Cerrar Protocolo
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
