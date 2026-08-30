import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  User, 
  Building, 
  AlertTriangle, 
  Share2,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Prescription, PatientProfile } from '../../types';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  patient: PatientProfile;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  patient,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const isExpiringSoon = prescription.status === 'por_vencer';
  const isExpired = prescription.status === 'vencida';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Receta Médica Digital Oficial</h3>
              <p className="text-[11px] text-slate-300">Código de Validación: {prescription.id.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="prescription-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              id="prescription-close-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div id="printable-prescription" ref={printRef} className="p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          
          {/* Header of Prescription */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-blue-600 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                MC
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">MediConnect TeleSalud</h2>
                <p className="text-xs text-slate-600 font-medium">Red Digital de Atención Médica & Farmacia Digital</p>
                <p className="text-[10px] text-slate-600">Registro Sanitario Nacional No. 89401-MINSA</p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                prescription.status === 'activa' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isExpiringSoon 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {prescription.status === 'activa' ? 'Receta Vigente' : isExpiringSoon ? 'Próxima a Vencer' : 'Receta Vencida'}
              </span>
              <p className="text-xs text-slate-600 mt-1 font-semibold">Folio: RX-{prescription.id}</p>
            </div>
          </div>

          {/* Patient and Doctor Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Datos del Paciente</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{patient.name}</p>
              <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                <p><span className="font-semibold text-slate-700">Documento:</span> {patient.documentId}</p>
                <p><span className="font-semibold text-slate-700">Edad / Sexo:</span> {patient.age} años • {patient.gender}</p>
                <p><span className="font-semibold text-slate-700">Seguro:</span> {patient.insurance.provider}</p>
                <p><span className="font-semibold text-rose-600">Alergias:</span> {patient.allergies.join(', ')}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Médico Prescriptor</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{prescription.doctorName}</p>
              <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                <p><span className="font-semibold text-slate-700">Especialidad:</span> {prescription.doctorSpecialty}</p>
                <p><span className="font-semibold text-slate-700">Colegiatura:</span> {prescription.doctorLicense}</p>
                <p><span className="font-semibold text-slate-700">Fecha de Emisión:</span> {prescription.emissionDate}</p>
                <p><span className="font-semibold text-amber-700">Válida Hasta:</span> {prescription.expirationDate}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="p-3.5 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl">
            <p className="text-[10px] font-bold text-blue-900 uppercase">Diagnóstico Clínico Asociado (CIE-10)</p>
            <p className="text-xs font-bold text-blue-950 mt-0.5">{prescription.diagnosis}</p>
          </div>

          {/* Prescribed Medication Box (Rx Symbol) */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
              <span className="font-black text-lg text-blue-700 italic tracking-wider font-serif">℞ RECETA & POSOLOGÍA</span>
              <span className="text-xs font-semibold text-slate-600">Recargas permitidas: {prescription.refillsLeft} de {prescription.refillsAllowed}</span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900">{prescription.medicationName}</h4>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Dosis: {prescription.dosage}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Principio Activo: {prescription.genericName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-700">Frecuencia / Horario:</p>
                  <p className="text-slate-900 mt-0.5">{prescription.frequency}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-700">Duración del Tratamiento:</p>
                  <p className="text-slate-900 mt-0.5">{prescription.duration}</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200">
                <p className="text-xs font-bold text-amber-900">Indicaciones y Cuidados Especiales:</p>
                <p className="text-xs text-amber-950 mt-0.5 leading-relaxed">{prescription.instructions}</p>
              </div>

              {prescription.pharmacyNote && (
                <p className="text-[11px] text-slate-600 italic">
                  Nota farmacéutica: {prescription.pharmacyNote}
                </p>
              )}
            </div>
          </div>

          {/* Footer with QR Code & Digital Signature Verification */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-xs">
                <img 
                  src={prescription.qrCodeUrl} 
                  alt="QR Verificación" 
                  className="w-20 h-20"
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Firma Digital Verificada
                </p>
                <p className="text-[10px] text-slate-600">Certificado SSL SHA-256</p>
                <p className="text-[10px] text-slate-600">Escanee el código QR para validar en farmacias aliadas</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 mb-1">
                <p className="text-xs font-serif italic text-blue-900 font-semibold">{prescription.doctorName}</p>
              </div>
              <p className="text-[11px] font-bold text-slate-800">{prescription.doctorName}</p>
              <p className="text-[10px] text-slate-600">{prescription.doctorLicense}</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-600 hidden sm:block">
            Documento médico con validez legal según Ley de Telemedicina y Receta Electrónica.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
