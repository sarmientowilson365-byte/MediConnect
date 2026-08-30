import React, { useState } from 'react';
import { X, Activity, Heart, Thermometer, Droplets, Scale, CheckCircle2, ShieldCheck } from 'lucide-react';
import { VitalSignDataPoint } from '../../types';

interface AddVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVital: (data: Omit<VitalSignDataPoint, 'id'>) => void;
}

export const AddVitalModal: React.FC<AddVitalModalProps> = ({
  isOpen,
  onClose,
  onAddVital,
}) => {
  const [systolicBP, setSystolicBP] = useState(120);
  const [diastolicBP, setDiastolicBP] = useState(80);
  const [heartRate, setHeartRate] = useState(70);
  const [glucose, setGlucose] = useState(92);
  const [weight, setWeight] = useState(76.5);
  const [spo2, setSpo2] = useState(99);
  const [temperature, setTemperature] = useState(36.5);
  const [notes, setNotes] = useState('Medición en reposo domiciliario');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
    const dateStr = today.toISOString().split('T')[0];

    onAddVital({
      date: dateStr,
      formattedDate: `Hoy (${formattedDate})`,
      systolicBP: Number(systolicBP),
      diastolicBP: Number(diastolicBP),
      heartRate: Number(heartRate),
      glucose: Number(glucose),
      weight: Number(weight),
      spo2: Number(spo2),
      temperature: Number(temperature),
      notes: notes.trim() ? notes : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Registrar Nuevos Signos Vitales</h3>
              <p className="text-[11px] text-slate-300">Monitoreo y telemetría de salud preventiva</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Presión Arterial */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Presión Arterial (mmHg)
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Meta: &lt;120/80
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 font-semibold mb-0.5">Sistólica (Alta)</label>
                <input
                  type="number"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  min={70}
                  max={220}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 font-semibold mb-0.5">Diastólica (Baja)</label>
                <input
                  type="number"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  min={40}
                  max={140}
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
                />
              </div>
            </div>
          </div>

          {/* Grid of other metrics */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Frecuencia Cardíaca */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-800 mb-1">
                Frecuencia Cardíaca (bpm)
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                min={40}
                max={190}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
              />
            </div>

            {/* Glucosa */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-amber-500" />
                Glucosa (mg/dL)
              </label>
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                min={50}
                max={400}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
              />
            </div>

            {/* Peso Corporal */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-500" />
                Peso Corporal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                min={30}
                max={250}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
              />
            </div>

            {/* SpO2 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-800 mb-1">
                Saturación SpO2 (%)
              </label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                min={80}
                max={100}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
              />
            </div>

            {/* Temperatura */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                Temperatura (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                min={34}
                max={42}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden font-bold"
              />
            </div>

            {/* Notes */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-800 mb-1">
                Contexto / Nota
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. En ayunas, post caminata"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-hidden"
              />
            </div>

          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20"
            >
              Guardar Medición
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
