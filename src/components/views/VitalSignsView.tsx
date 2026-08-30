import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  Droplets, 
  Scale, 
  Thermometer, 
  Wind, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ShieldCheck, 
  Info,
  ChevronRight
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
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import { VitalSignDataPoint, TimeFilter, VitalType } from '../../types';

interface VitalSignsViewProps {
  weeklyVitals: VitalSignDataPoint[];
  monthlyVitals: VitalSignDataPoint[];
  yearlyVitals: VitalSignDataPoint[];
  onOpenAddVitalModal: () => void;
}

export const VitalSignsView: React.FC<VitalSignsViewProps> = ({
  weeklyVitals,
  monthlyVitals,
  yearlyVitals,
  onOpenAddVitalModal,
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('semana');
  const [activeMetric, setActiveMetric] = useState<VitalType>('presion');

  const currentData = timeFilter === 'semana' ? weeklyVitals : timeFilter === 'mes' ? monthlyVitals : yearlyVitals;
  const latestEntry = currentData[currentData.length - 1];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Seguimiento Integral de Signos Vitales</h2>
          <p className="text-xs text-slate-600 mt-0.5">Monitoreo biométrico continuo sincronizado con tu equipo médico tratante.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs">
            {(['semana', 'mes', 'ano'] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  timeFilter === f ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'ano' ? 'Año' : f}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddVitalModal}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Medición</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Quick Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* 1. Presión Arterial */}
        <div
          onClick={() => setActiveMetric('presion')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'presion'
              ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Heart className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Óptima
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Presión Arterial</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.systolicBP}/{latestEntry?.diastolicBP}
          </p>
          <p className="text-[10px] text-slate-500">mmHg</p>
        </div>

        {/* 2. Frecuencia Cardíaca */}
        <div
          onClick={() => setActiveMetric('cardiaco')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'cardiaco'
              ? 'bg-rose-50/80 border-rose-600 ring-2 ring-rose-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Normal
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Frecuencia Cardíaca</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.heartRate}
          </p>
          <p className="text-[10px] text-slate-500">bpm</p>
        </div>

        {/* 3. Nivel de Glucosa */}
        <div
          onClick={() => setActiveMetric('glucosa')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'glucosa'
              ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Droplets className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Meta
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Glucosa en Sangre</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.glucose}
          </p>
          <p className="text-[10px] text-slate-500">mg/dL</p>
        </div>

        {/* 4. Peso Corporal */}
        <div
          onClick={() => setActiveMetric('peso')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'peso'
              ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
              -1.2 kg
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Peso Corporal</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.weight}
          </p>
          <p className="text-[10px] text-slate-500">kg (IMC 24.1)</p>
        </div>

        {/* 5. Saturación de Oxígeno */}
        <div
          onClick={() => setActiveMetric('spo2')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'spo2'
              ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Wind className="w-4 h-4 text-teal-600" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Excelente
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Saturación SpO2</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.spo2}%
          </p>
          <p className="text-[10px] text-slate-500">Capilar</p>
        </div>

        {/* 6. Temperatura */}
        <div
          onClick={() => setActiveMetric('temperatura')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeMetric === 'temperatura'
              ? 'bg-orange-50/80 border-orange-600 ring-2 ring-orange-600'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              Afebril
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-600 mt-2">Temperatura</p>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {latestEntry?.temperature}°C
          </p>
          <p className="text-[10px] text-slate-500">Axilar</p>
        </div>

      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {activeMetric === 'presion' && 'Evolución de Presión Arterial (Sistólica y Diastólica)'}
              {activeMetric === 'cardiaco' && 'Evolución de Frecuencia Cardíaca en Reposo'}
              {activeMetric === 'glucosa' && 'Evolución de Glucosa Sanguínea (mg/dL)'}
              {activeMetric === 'peso' && 'Evolución de Peso Corporal y Composición (kg)'}
              {activeMetric === 'spo2' && 'Evolución de Saturación de Oxígeno (%)'}
              {activeMetric === 'temperatura' && 'Evolución de Temperatura Corporal (°C)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualización temporal ({timeFilter === 'semana' ? 'Últimos 7 días' : timeFilter === 'mes' ? 'Últimas 4 semanas' : 'Últimos 12 meses'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rango Clínico Recomendado:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              {activeMetric === 'presion' && '< 120/80 mmHg'}
              {activeMetric === 'cardiaco' && '60 - 90 bpm'}
              {activeMetric === 'glucosa' && '70 - 99 mg/dL en ayunas'}
              {activeMetric === 'peso' && '75 - 78 kg (Meta)'}
              {activeMetric === 'spo2' && '95 - 100%'}
              {activeMetric === 'temperatura' && '36.0 - 37.2 °C'}
            </span>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === 'presion' ? (
              <LineChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 150]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <ReferenceLine y={120} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Meta Sistólica 120', fill: '#64748b', fontSize: 10 }} />
                <ReferenceLine y={80} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Meta Diastólica 80', fill: '#64748b', fontSize: 10 }} />
                <Line type="monotone" dataKey="systolicBP" name="Sistólica (mmHg)" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="diastolicBP" name="Diastólica (mmHg)" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 4, fill: '#0D9488' }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : activeMetric === 'cardiaco' ? (
              <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 110]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <ReferenceLine y={75} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Promedio 75 bpm', fill: '#64748b', fontSize: 10 }} />
                <Area type="monotone" dataKey="heartRate" name="Pulsaciones (bpm)" stroke="#E11D48" strokeWidth={3} fill="url(#heartGrad)" dot={{ r: 4, fill: '#E11D48' }} />
              </AreaChart>
            ) : activeMetric === 'glucosa' ? (
              <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="glucosaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 130]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <ReferenceLine y={100} stroke="#f87171" strokeDasharray="3 3" label={{ value: 'Límite 100 mg/dL', fill: '#ef4444', fontSize: 10 }} />
                <Area type="monotone" dataKey="glucose" name="Glucosa (mg/dL)" stroke="#D97706" strokeWidth={3} fill="url(#glucosaGrad)" dot={{ r: 4, fill: '#D97706' }} />
              </AreaChart>
            ) : activeMetric === 'peso' ? (
              <LineChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="weight" name="Peso Corporal (kg)" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 7 }} />
              </LineChart>
            ) : activeMetric === 'spo2' ? (
              <AreaChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <ReferenceLine y={95} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Alerta <95%', fill: '#d97706', fontSize: 10 }} />
                <Area type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#059669" strokeWidth={3} fill="#a7f3d0" dot={{ r: 4, fill: '#059669' }} />
              </AreaChart>
            ) : (
              <LineChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[35.5, 38.5]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <ReferenceLine y={37.5} stroke="#f87171" strokeDasharray="3 3" label={{ value: 'Fiebre >37.5°C', fill: '#ef4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="temperature" name="Temperatura (°C)" stroke="#EA580C" strokeWidth={3} dot={{ r: 4, fill: '#EA580C' }} activeDot={{ r: 7 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Telemetry Log Table */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="font-bold text-xs text-slate-800 mb-3">Historial de Registros ({currentData.length} mediciones)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Presión</th>
                  <th className="py-2.5 px-3">Pulso</th>
                  <th className="py-2.5 px-3">Glucosa</th>
                  <th className="py-2.5 px-3">Peso</th>
                  <th className="py-2.5 px-3">SpO2</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentData.slice().reverse().map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 text-slate-800 font-bold">{entry.formattedDate}</td>
                    <td className="py-2 px-3 text-blue-600 font-semibold">{entry.systolicBP}/{entry.diastolicBP} mmHg</td>
                    <td className="py-2 px-3 text-rose-600 font-semibold">{entry.heartRate} bpm</td>
                    <td className="py-2 px-3 text-amber-600 font-semibold">{entry.glucose} mg/dL</td>
                    <td className="py-2 px-3 text-indigo-600 font-semibold">{entry.weight} kg</td>
                    <td className="py-2 px-3 text-emerald-600 font-semibold">{entry.spo2}%</td>
                    <td className="py-2 px-3 text-orange-600 font-semibold">{entry.temperature}°C</td>
                    <td className="py-2 px-3 text-slate-500 italic truncate max-w-xs">{entry.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
