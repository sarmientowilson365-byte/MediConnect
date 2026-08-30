import React, { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Appointment } from '../../types';

interface RescheduleModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  onClose,
  onConfirmReschedule,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-09-08');
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [reason, setReason] = useState('Conflicto con horario laboral');

  if (!appointment) return null;

  const availableHours = ['09:00', '10:30', '11:00', '14:30', '16:00', '17:30'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReschedule(appointment.id, selectedDate, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">Reprogramar Cita Médica</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
            <img src={appointment.doctorPhoto} alt={appointment.doctorName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-xs font-bold text-slate-900">{appointment.doctorName}</p>
              <p className="text-[11px] text-blue-700 font-medium">{appointment.specialty}</p>
              <p className="text-[11px] text-slate-600">Fecha actual: {appointment.date} a las {appointment.time} hrs</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nueva Fecha</label>
            <input
              type="date"
              value={selectedDate}
              min="2026-08-30"
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Horarios Disponibles</label>
            <div className="grid grid-cols-3 gap-2">
              {availableHours.map((hour) => (
                <button
                  type="button"
                  key={hour}
                  onClick={() => setSelectedTime(hour)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    selectedTime === hour
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {hour} hrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Reprogramación (Opcional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl outline-hidden"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>La reprogramación no genera cargos adicionales si se realiza con al menos 2 horas de anticipación.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
            >
              Confirmar Nueva Fecha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
