import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Video, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Filter, 
  Calendar, 
  Clock, 
  Building, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Doctor, NavigationTab } from '../../types';

interface DoctorsDirectoryViewProps {
  doctors: Doctor[];
  onSelectDoctorToBook: (doctor: Doctor) => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const DoctorsDirectoryView: React.FC<DoctorsDirectoryViewProps> = ({
  doctors,
  onSelectDoctorToBook,
  onViewDoctorProfile,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [selectedModality, setSelectedModality] = useState<'todas' | 'virtual' | 'presencial'>('todas');
  const [minRating, setMinRating] = useState<number>(0);

  const specialties = ['Todas', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = searchQuery.trim() === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSpec = selectedSpecialty === 'Todas' || doc.specialty === selectedSpecialty;
    const matchMod = selectedModality === 'todas' || doc.modalities.includes(selectedModality);
    const matchRating = doc.rating >= minRating;

    return matchSearch && matchSpec && matchMod && matchRating;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Directorio de Médicos Especialistas</h2>
          <p className="text-xs text-slate-600 mt-0.5">Encuentra a los mejores médicos con certificación oficial y reserva tu consulta al instante.</p>
        </div>

        <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold self-start sm:self-auto">
          {filteredDoctors.length} Especialistas disponibles
        </span>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar médico o tratamiento..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-hidden"
            />
          </div>

          {/* Specialty Select */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec === 'Todas' ? 'Todas las especialidades' : spec}</option>
              ))}
            </select>
          </div>

          {/* Modality Select */}
          <div>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
            >
              <option value="todas">Todas las modalidades</option>
              <option value="virtual">Telemedicina Virtual HD</option>
              <option value="presencial">Presencial en Clínica</option>
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 outline-hidden focus:border-blue-500"
            >
              <option value={0}>Todas las valoraciones</option>
              <option value={4.8}>⭐ 4.8 o más estrellas</option>
              <option value={4.9}>⭐ 4.9 o más estrellas</option>
            </select>
          </div>

        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Doctor Avatar and Specialty */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.photoUrl}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                />
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-blue-600 font-semibold">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500">{doc.licenseNumber}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      {doc.rating}
                    </span>
                    <span className="text-slate-500 text-[11px]">({doc.reviewCount} opiniones)</span>
                  </div>
                </div>
              </div>

              {/* Bio & Hospital */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                <p className="line-clamp-2 leading-relaxed">{doc.bio}</p>
                <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                  <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{doc.hospital}</span>
                </div>
              </div>

              {/* Modality Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.modalities.includes('virtual') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Video className="w-2.5 h-2.5" />
                    Virtual HD
                  </span>
                )}
                {doc.modalities.includes('presencial') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <MapPin className="w-2.5 h-2.5" />
                    Presencial
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Next slot, fee, and actions */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500">Próxima disponibilidad:</span>
                  <p className="font-bold text-emerald-700">{doc.nextAvailableSlot}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">Tarifa:</span>
                  <p className="font-black text-slate-900">${doc.consultationFee}.00 USD</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewDoctorProfile(doc)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => onSelectDoctorToBook(doc)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-colors"
                >
                  Agendar Cita
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
