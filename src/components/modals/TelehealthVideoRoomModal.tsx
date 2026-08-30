import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  Activity, 
  Share2, 
  ShieldCheck, 
  Users, 
  Send, 
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Stethoscope,
  Clock,
  Download
} from 'lucide-react';
import { Appointment, PatientProfile } from '../../types';

interface TelehealthVideoRoomModalProps {
  appointment: Appointment | null;
  patient: PatientProfile;
  onClose: () => void;
  onOpenPrescription?: () => void;
}

export const TelehealthVideoRoomModal: React.FC<TelehealthVideoRoomModalProps> = ({
  appointment,
  patient,
  onClose,
  onOpenPrescription,
}) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'notes' | 'vitals' | null>('notes');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isDoctor: boolean }>>([
    {
      sender: 'Dr. Alejandro Morales',
      text: '¡Hola Carlos! Bienvenido a la consulta virtual. ¿Cómo te has sentido con la dosis matutina de Losartán?',
      time: '16:30',
      isDoctor: true,
    },
    {
      sender: 'Carlos Mendoza (Tú)',
      text: 'Buenas tardes doctor. En general bien, he registrado mi presión estos 7 días y ha estado alrededor de 120/80 mmHg.',
      time: '16:31',
      isDoctor: false,
    },
    {
      sender: 'Dr. Alejandro Morales',
      text: 'Excelente registro. Veo los datos sincronizados en tu expediente. Continuaremos con la misma dosis.',
      time: '16:32',
      isDoctor: true,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [callDuration, setCallDuration] = useState(195); // seconds
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Doctor speaking simulator
  useEffect(() => {
    const speakInterval = setInterval(() => {
      setIsDoctorSpeaking(prev => !prev);
    }, 4000);
    return () => clearInterval(speakInterval);
  }, []);

  // Real webcam feed with fallback
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isVideoOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission denied or not available, fallback seamlessly
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoOn]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeSidePanel]);

  if (!appointment) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: `${patient.name} (Tú)`,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: false,
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Doctor auto response simulation after 2 seconds
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: appointment.doctorName,
          text: 'Perfecto, anoto este detalle en tu historial clínico para el reporte final.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDoctor: true,
        }
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-100">{appointment.doctorName}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                {appointment.specialty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexión cifrada de alta definición (256-bit AES)</span>
            </p>
          </div>
        </div>

        {/* Timer and Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">{formatTimer(callDuration)}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            title="Minimizar o salir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video & Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left/Center: Video Feeds */}
        <div className="flex-1 bg-slate-950 p-3 sm:p-4 flex flex-col relative justify-center items-center">
          
          {/* Main Stage (Doctor Video Feed) */}
          <div className="relative w-full h-full max-h-[75vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
            <img
              src={appointment.doctorPhoto}
              alt={appointment.doctorName}
              className="w-full h-full object-cover opacity-90 group-hover:scale-101 transition-transform duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

            {/* Doctor Info Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold">{appointment.doctorName}</span>
              {isDoctorSpeaking && (
                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-semibold animate-pulse">
                  Hablando
                </span>
              )}
            </div>

            {/* Speaking audio wave indicator */}
            {isDoctorSpeaking && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700">
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="text-[10px] text-slate-300 ml-1 font-mono">Micro HD</span>
              </div>
            )}

            {/* Patient Floating Picture-in-Picture Video */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-52 aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 border-blue-500 shadow-xl z-20">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-2">
                  <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-400">Cámara Apagada</span>
                </div>
              )}

              {/* Patient Name Badge */}
              <div className="absolute bottom-1.5 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                <span>Tú ({patient.name.split(' ')[0]})</span>
                {!isMicOn && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
              </div>
            </div>

            {/* Quick Diagnostic Callout */}
            <div className="absolute bottom-4 left-4 max-w-sm hidden sm:block bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white">
              <p className="text-[10px] font-bold uppercase text-blue-400">Motivo de teleconsulta</p>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-2">{appointment.consultationReason}</p>
            </div>
          </div>

          {/* Bottom In-Call Control Bar */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 z-20">
            
            {/* Mic Toggle */}
            <button
              id="telehealth-toggle-mic-btn"
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-all ${
                isMicOn 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={isMicOn ? "Silenciar micrófono" : "Activar micrófono"}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              id="telehealth-toggle-cam-btn"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-xl transition-all ${
                isVideoOn 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={isVideoOn ? "Apagar cámara" : "Encender cámara"}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Side Panel Switchers */}
            <div className="h-6 w-px bg-slate-700 mx-1" />

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'notes' ? null : 'notes')}
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSidePanel === 'notes' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Notas & Receta</span>
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'vitals' ? null : 'vitals')}
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSidePanel === 'vitals' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Signos</span>
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')}
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                activeSidePanel === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
              <span className="w-2 h-2 rounded-full bg-blue-400 absolute top-2 right-2" />
            </button>

            <div className="h-6 w-px bg-slate-700 mx-1" />

            {/* End Call Button */}
            <button
              id="telehealth-end-call-btn"
              onClick={onClose}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Finalizar Consulta</span>
            </button>

          </div>

        </div>

        {/* Right Side Drawer: Chat / Notes / Vitals */}
        {activeSidePanel && (
          <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-72 lg:h-auto overflow-hidden">
            
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5">
              <button
                onClick={() => setActiveSidePanel('notes')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'notes' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Expediente & Receta</span>
              </button>

              <button
                onClick={() => setActiveSidePanel('vitals')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'vitals' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Signos Vitales</span>
              </button>

              <button
                onClick={() => setActiveSidePanel('chat')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>

            {/* Panel 1: Notes & Live Prescription */}
            {activeSidePanel === 'notes' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
                <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-blue-300">Receta Digital en Generación</p>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                      Sincronizada
                    </span>
                  </div>
                  <p className="text-slate-200 font-bold text-sm mt-2">Losartán Potásico 50 mg</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">1 comprimido cada 24 horas por 90 días</p>
                  <div className="mt-3 pt-2 border-t border-blue-900/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Firma electrónica Dr. Morales</span>
                    {onOpenPrescription && (
                      <button
                        onClick={onOpenPrescription}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                      >
                        Ver formato oficial →
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2">
                  <p className="font-bold text-slate-200">Recomendaciones del Médico</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                    <li>Mantener ingesta hídrica de 2.5 litros de agua al día.</li>
                    <li>Registrar presión arterial 3 veces por semana en ayunas.</li>
                    <li>Caminatas ligeras de 30 minutos sin sobreesfuerzo.</li>
                    <li>Próximo control programado para dentro de 3 meses.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Panel 2: Live Vital Signs */}
            {activeSidePanel === 'vitals' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                <p className="text-xs font-bold text-slate-300">Telemonitoreo Sincronizado</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400">Presión Arterial</p>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">119/78 <span className="text-[10px] font-normal text-slate-400">mmHg</span></p>
                    <span className="text-[10px] text-emerald-400 font-medium">Óptimo</span>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400">Frecuencia Cardíaca</p>
                    <p className="text-lg font-black text-rose-400 mt-0.5">69 <span className="text-[10px] font-normal text-slate-400">bpm</span></p>
                    <span className="text-[10px] text-slate-400 font-medium">Normal</span>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400">Saturación SpO2</p>
                    <p className="text-lg font-black text-teal-400 mt-0.5">99%</p>
                    <span className="text-[10px] text-teal-400 font-medium">Excelente</span>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400">Glucosa en ayunas</p>
                    <p className="text-lg font-black text-amber-400 mt-0.5">90 <span className="text-[10px] font-normal text-slate-400">mg/dL</span></p>
                    <span className="text-[10px] text-amber-400 font-medium">Controlada</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-[11px] text-slate-300">
                  <p className="font-bold text-blue-300">Dispositivo Conectado:</p>
                  <p className="text-slate-400 mt-0.5">Tensiómetro Inteligente Bluetooth Omron X3 (Sincronización en tiempo real).</p>
                </div>
              </div>
            )}

            {/* Panel 3: In-Call Chat */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.isDoctor ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[10px] text-slate-400 px-1 mb-0.5">{msg.sender} • {msg.time}</span>
                      <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.isDoctor
                          ? 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700'
                          : 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe un mensaje al doctor..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 text-white placeholder:text-slate-500 border border-slate-800 rounded-xl focus:outline-hidden focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
