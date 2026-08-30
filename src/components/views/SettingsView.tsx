import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  FileText, 
  Smartphone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Heart, 
  Globe, 
  Key,
  ShieldCheck,
  Save
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface SettingsViewProps {
  patient: PatientProfile;
  onUpdatePatient: (updated: PatientProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  patient,
  onUpdatePatient,
}) => {
  const [formData, setFormData] = useState({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    address: patient.address,
    allergies: patient.allergies.join(', '),
    emergencyContactName: patient.emergencyContact.name,
    emergencyContactPhone: patient.emergencyContact.phone,
    emergencyContactRelation: patient.emergencyContact.relationship,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    whatsappReminders: true,
    emailReminders: true,
    vitalAlerts: true,
    prescriptionExpiration: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient({
      ...patient,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelation,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Configuración de la Cuenta & Perfil</h2>
          <p className="text-xs text-slate-600 mt-0.5">Administra tus datos personales, datos de contacto de emergencia y preferencias de seguridad.</p>
        </div>

        {savedSuccess && (
          <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ¡Cambios guardados correctamente!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Datos Personales */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Información Personal del Paciente</h3>
              <p className="text-xs text-slate-500">Datos visibles en recetas oficiales y expedientes clínicos</p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-2">
            <img
              src={patient.avatarUrl}
              alt={patient.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
            />
            <div>
              <p className="font-bold text-sm text-slate-900">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.documentId} • {patient.age} años</p>
              <button
                type="button"
                onClick={() => alert('Seleccionar foto')}
                className="mt-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                Cambiar fotografía
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dirección Domiciliaria</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contacto de Emergencia & Alergias */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Salud Crítica & Contacto de Emergencia</h3>
              <p className="text-xs text-slate-500">Se usará en caso de emergencia médica durante consultas o botón SOS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre del Contacto</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Parentesco</label>
              <input
                type="text"
                value={formData.emergencyContactRelation}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono de Emergencia</label>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Alergias Conocidas (Separar por comas)</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden font-semibold text-rose-700"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notificaciones */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Preferencias de Alertas & Recordatorios</h3>
              <p className="text-xs text-slate-500">Configura canales de notificación antes de tus citas</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Recordatorios de Citas por WhatsApp y SMS</p>
                <p className="text-slate-500 text-[11px]">Recibirás un enlace directo 15 minutos antes de la videollamada.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.whatsappReminders}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, whatsappReminders: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Alerta de Recetas por Vencer</p>
                <p className="text-slate-500 text-[11px]">Aviso automático 5 días antes para agendar cita de renovación.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.prescriptionExpiration}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, prescriptionExpiration: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>

      </form>

    </div>
  );
};
