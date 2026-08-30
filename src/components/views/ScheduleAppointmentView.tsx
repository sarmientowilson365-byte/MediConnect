import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Stethoscope, 
  HeartPulse, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Building,
  CreditCard,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Doctor, Modality, Appointment, PatientProfile, NavigationTab } from '../../types';
import { specialtiesList } from '../../data/mockData';

interface ScheduleAppointmentViewProps {
  doctors: Doctor[];
  patient: PatientProfile;
  preSelectedDoctor?: Doctor | null;
  onAppointmentBooked: (newAppointment: Appointment) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ScheduleAppointmentView: React.FC<ScheduleAppointmentViewProps> = ({
  doctors,
  patient,
  preSelectedDoctor,
  onAppointmentBooked,
  setActiveTab,
}) => {
  const [step, setStep] = useState<number>(preSelectedDoctor ? 3 : 1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(preSelectedDoctor ? preSelectedDoctor.specialty : 'Cardiología');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(preSelectedDoctor || doctors[0]);
  const [selectedModality, setSelectedModality] = useState<Modality>('virtual');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-02');
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  const [consultationReason, setConsultationReason] = useState<string>('Control preventivo y evaluación de síntomas generales.');
  const [symptoms, setSymptoms] = useState<string[]>(['Monitoreo de rutina']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [specialtySearch, setSpecialtySearch] = useState('');

  const filteredSpecialties = specialtiesList.filter(s => 
    s.name.toLowerCase().includes(specialtySearch.toLowerCase()) || 
    s.description.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  const specialtyDoctors = doctors.filter(d => 
    selectedSpecialty ? d.specialty.toLowerCase() === selectedSpecialty.toLowerCase() : true
  );

  const availableHours = selectedDoctor ? selectedDoctor.availableHours : ['09:00', '10:30', '14:00', '16:30', '18:00'];

  const handleConfirmBooking = () => {
    if (!selectedDoctor) return;

    const newApt: Appointment = {
      id: `apt-2026-${Math.floor(Math.random() * 900 + 100)}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      doctorPhoto: selectedDoctor.photoUrl,
      licenseNumber: selectedDoctor.licenseNumber,
      date: selectedDate,
      time: selectedTime,
      modality: selectedModality,
      status: 'confirmada',
      meetingUrl: selectedModality === 'virtual' ? `https://telemed.mediconnect.health/room/carlos-mendoza-${selectedDoctor.id}` : undefined,
      location: selectedModality === 'presencial' ? `${selectedDoctor.hospital} - Consultorio Especializado` : undefined,
      consultationReason: consultationReason || 'Consulta médica general',
      symptoms: symptoms,
      fee: selectedDoctor.consultationFee,
      paymentStatus: 'pagado',
      paymentId: `pay-${Math.floor(Math.random() * 8000 + 1000)}`,
      notes: 'Confirmación generada en plataforma. Se aplicó cobertura Sanitas Salud.',
    };

    onAppointmentBooked(newApt);
    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const stepsList = [
    { num: 1, title: 'Especialidad' },
    { num: 2, title: 'Especialista' },
    { num: 3, title: 'Modalidad & Turno' },
    { num: 4, title: 'Motivo de Consulta' },
    { num: 5, title: 'Confirmación' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Agendar Cita Médica</h2>
            <p className="text-xs text-slate-600 mt-0.5">Elige especialista, modalidad virtual o presencial y reserva tu turno en minutos.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold self-start sm:self-auto">
            Cobertura Sanitas 85% Habilitada
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 z-0"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <button
                    onClick={() => s.num < step && setStep(s.num)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </button>
                  <span className={`text-[10px] sm:text-xs font-semibold mt-1.5 hidden sm:block ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Form Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        
        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">¡Cita Médica Confirmada con Éxito!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Tu cita con <strong className="text-slate-900">{selectedDoctor?.name}</strong> ha quedado registrada para el <strong className="text-slate-900">{selectedDate}</strong> a las <strong className="text-slate-900">{selectedTime} hrs</strong>.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Modalidad:</span>
                <span className="font-bold text-slate-900">{selectedModality === 'virtual' ? '💻 Telemedicina Virtual HD' : '🏥 Consulta Presencial en Clínica'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Especialidad:</span>
                <span className="font-bold text-slate-900">{selectedDoctor?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Lugar / Acceso:</span>
                <span className="font-semibold text-blue-600 truncate max-w-xs">{selectedModality === 'virtual' ? 'Sala Virtual MediConnect HD' : selectedDoctor?.hospital}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">Estado de pago:</span>
                <span className="font-bold text-emerald-700">Pagado con Cobertura Sanitas</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('citas')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                Ver Mis Citas Agendadas
              </button>
              <button
                onClick={() => setActiveTab('inicio')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        ) : (
          <div>
            
            {/* Step 1: Especialidad */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Paso 1: Selecciona la Especialidad</h3>
                    <p className="text-xs text-slate-600">Contamos con más de 120 especialistas certificados.</p>
                  </div>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={specialtySearch}
                      onChange={(e) => setSpecialtySearch(e.target.value)}
                      placeholder="Filtrar especialidad..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSpecialties.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => {
                        setSelectedSpecialty(spec.name);
                        setStep(2);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-xs flex items-start gap-3.5 ${
                        selectedSpecialty === spec.name
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl ${
                        selectedSpecialty === spec.name ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-600'
                      }`}>
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{spec.name}</h4>
                          <span className="text-[10px] text-slate-600 font-semibold">{spec.count} médicos</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{spec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Especialista */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Paso 2: Selecciona al Médico Especialista</h3>
                    <p className="text-xs text-slate-600">Especialistas disponibles en <strong className="text-blue-600">{selectedSpecialty}</strong></p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Cambiar especialidad
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(specialtyDoctors.length > 0 ? specialtyDoctors : doctors.slice(0, 4)).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        selectedDoctor?.id === doc.id
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h4>
                          <p className="text-xs text-blue-600 font-semibold">{doc.title}</p>
                          <p className="text-[11px] text-slate-600">{doc.hospital}</p>
                          
                          <div className="flex items-center gap-2 mt-1.5 text-xs">
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                              {doc.rating}
                            </span>
                            <span className="text-slate-600 text-[11px]">({doc.reviewCount} opiniones)</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-600">Próximo turno:</span>
                          <p className="font-bold text-emerald-700">{doc.nextAvailableSlot}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-600">Tarifa:</span>
                          <p className="font-black text-slate-900">${doc.consultationFee}.00 USD</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Modalidad y Fecha/Hora */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Paso 3: Modalidad y Horario de Atención</h3>
                  <p className="text-xs text-slate-600">Atención con {selectedDoctor?.name} ({selectedDoctor?.specialty})</p>
                </div>

                {/* Modality selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedModality('virtual')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      selectedModality === 'virtual'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Telemedicina Virtual HD</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Consulta por videollamada cifrada desde tu computadora o celular con receta digital inmediata.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedModality('presencial')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      selectedModality === 'presencial'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Consulta Presencial en Clínica</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Atención en consultorio: {selectedDoctor?.hospital}.</p>
                    </div>
                  </div>
                </div>

                {/* Date & Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Selecciona la Fecha
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min="2026-08-30"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Horarios Disponibles para {selectedDate}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableHours.map((hr) => (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => setSelectedTime(hr)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                            selectedTime === hr
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {hr} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Motivo de Consulta & Síntomas */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Paso 4: Motivo de la Consulta & Síntomas</h3>
                  <p className="text-xs text-slate-600">Esta información ayudará al especialista a preparar tu sesión.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Describe brevemente el motivo principal de tu consulta:
                  </label>
                  <textarea
                    rows={4}
                    value={consultationReason}
                    onChange={(e) => setConsultationReason(e.target.value)}
                    placeholder="Ej. Chequeo de rutina, control de hipertensión, dolor de cabeza..."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Síntomas o temas a tratar (Selecciona o añade):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Monitoreo de presión', 'Cefalea', 'Ajuste de medicación', 'Chequeo anual', 'Revisión de análisis', 'Dermatología preventiva'].map((sym) => {
                      const isSelected = symptoms.includes(sym);
                      return (
                        <button
                          type="button"
                          key={sym}
                          onClick={() => {
                            if (isSelected) {
                              setSymptoms(symptoms.filter(s => s !== sym));
                            } else {
                              setSymptoms([...symptoms, sym]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{sym}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Resumen & Confirmación */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Paso 5: Revisa y Confirma tu Cita</h3>
                  <p className="text-xs text-slate-600">Verifica los datos antes de finalizar la reserva.</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200">
                    <img
                      src={selectedDoctor?.photoUrl}
                      alt={selectedDoctor?.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedDoctor?.name}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{selectedDoctor?.specialty}</p>
                      <p className="text-[11px] text-slate-600">{selectedDoctor?.hospital}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600">Fecha y Hora:</span>
                      <p className="font-bold text-slate-900">{selectedDate} a las {selectedTime} hrs</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Modalidad:</span>
                      <p className="font-bold text-blue-700">{selectedModality === 'virtual' ? 'Teleconsulta Virtual HD' : 'Presencial en Consultorio'}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Paciente:</span>
                      <p className="font-bold text-slate-900">{patient.name} ({patient.documentId})</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Seguro Aplicado:</span>
                      <p className="font-bold text-emerald-700">{patient.insurance.provider} (85% Cobertura)</p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Honorarios médicos:</span>
                      <span>${selectedDoctor?.consultationFee}.00 USD</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Cobertura Plan Sanitas (85%):</span>
                      <span>-${((selectedDoctor?.consultationFee || 100) * 0.85).toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                      <span>Copago Total Final:</span>
                      <span className="text-blue-600">${((selectedDoctor?.consultationFee || 100) * 0.15).toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>
              ) : <div />}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  id="confirm-final-booking-btn"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar y Reservar Cita</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
