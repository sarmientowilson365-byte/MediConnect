import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Appointment } from '../../types';

interface CancelModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmCancel: (appointmentId: string, reason: string) => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState('Motivos de viaje o imprevisto de agenda');

  if (!appointment) return null;

  const reasons = [
    'Motivos de viaje o imprevisto de agenda',
    'Me siento recuperado / no necesito la consulta',
    'Encontré un especialista antes',
    'Deseo reprogramar para el próximo mes',
    'Problemas técnicos / preferencia presencial',
  ];

  const handleConfirm = () => {
    onConfirmCancel(appointment.id, selectedReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-5 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">¿Deseas cancelar esta cita médica?</h3>
            <p className="text-xs text-slate-600 mt-1">
              Consulta con <span className="font-semibold text-slate-800">{appointment.doctorName}</span> ({appointment.specialty}) programada para el <span className="font-semibold text-slate-800">{appointment.date}</span> a las {appointment.time} hrs.
            </p>
          </div>

          <div className="text-left space-y-2">
            <label className="block text-xs font-bold text-slate-700">Selecciona el motivo de cancelación:</label>
            <div className="space-y-1.5">
              {reasons.map((r, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === r 
                      ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-medium' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {appointment.paymentStatus === 'pagado' && (
            <div className="p-3 bg-emerald-50 rounded-xl text-left text-[11px] text-emerald-800 border border-emerald-200">
              <span className="font-bold">Política de Reembolso Automático:</span> El monto de ${appointment.fee}.00 USD será reembolsado a tu método de pago original o abonado a tu saldo MediConnect en un plazo de 24 a 48 hrs.
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Mantener mi cita
            </button>
            <button
              onClick={handleConfirm}
              id="confirm-cancel-appointment-btn"
              className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all"
            >
              Sí, Cancelar Cita
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
