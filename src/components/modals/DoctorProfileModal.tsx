import React from 'react';
import { X, Star, Calendar, Clock, MapPin, Award, CheckCircle2, ShieldCheck, Video, Building, Globe } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header banner */}
        <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors h-fit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-3">
            <div className="flex items-end gap-3.5">
              <img
                src={doctor.photoUrl}
                alt={doctor.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white"
              />
              <div className="mb-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-slate-950">{doctor.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-blue-600">{doctor.specialty}</p>
                <p className="text-[11px] text-slate-600">{doctor.licenseNumber}</p>
              </div>
            </div>

            <div className="text-right sm:mb-1 bg-blue-50/70 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
              <span className="text-xs text-slate-600">Tarifa de consulta:</span>
              <p className="text-lg font-black text-slate-900">${doctor.consultationFee}.00 <span className="text-xs font-normal text-slate-600">USD</span></p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{doctor.rating}</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">{doctor.reviewCount} reseñas</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="font-bold text-slate-800">{doctor.experienceYears} años</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Experiencia</p>
            </div>
            <div>
              <p className="font-bold text-emerald-600">{doctor.nextAvailableSlot.split(',')[0]}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Disponibilidad</p>
            </div>
          </div>

          {/* Bio and Info */}
          <div className="mt-4 space-y-3.5 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Acerca del Especialista</h4>
              <p className="leading-relaxed text-slate-600">{doctor.bio}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700"><strong className="text-slate-900">Formación:</strong> {doctor.education}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-slate-700"><strong className="text-slate-900">Sede / Hospital:</strong> {doctor.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="text-slate-700"><strong className="text-slate-900">Idiomas:</strong> {doctor.languages.join(', ')}</span>
              </div>
            </div>

            {/* Modalities */}
            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">Modalidades Disponibles</h4>
              <div className="flex gap-2">
                {doctor.modalities.includes('virtual') && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold text-xs">
                    <Video className="w-3.5 h-3.5" />
                    Telemedicina Virtual HD
                  </span>
                )}
                {doctor.modalities.includes('presencial') && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-semibold text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    Consulta Presencial en Clínica
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-600">Próximo turno libre:</p>
              <p className="text-xs font-bold text-slate-900">{doctor.nextAvailableSlot}</p>
            </div>

            <button
              id="doctor-profile-book-btn"
              onClick={() => {
                onBookAppointment(doctor);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Agendar Cita Ahora
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
