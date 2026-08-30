import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  CalendarPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Activity, 
  ShieldCheck, 
  ChevronDown,
  Stethoscope,
  HeartPulse,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PatientProfile, AppNotification, NavigationTab, Doctor } from '../types';

interface HeaderProps {
  patient: PatientProfile;
  notifications?: AppNotification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  activeTab?: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  doctors?: Doctor[];
  onSelectDoctorToBook?: (doctor: Doctor) => void;
  onOpenQuickBook?: () => void;
  onToggleMobileSidebar?: () => void;
  onToggleSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  onOpenSOSModal?: () => void;
  onOpenSOS?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  notifications = [],
  onMarkNotificationAsRead = (_id: string) => {},
  onMarkAllNotificationsAsRead = () => {},
  activeTab = 'inicio',
  setActiveTab = (_tab: NavigationTab) => {},
  doctors = [],
  onSelectDoctorToBook = (_doctor: Doctor) => {},
  onOpenQuickBook = () => {},
  onToggleMobileSidebar,
  onToggleSidebar,
  isMobileSidebarOpen = false,
  onOpenSOSModal,
  onOpenSOS
}) => {
  const handleToggleSidebar = onToggleMobileSidebar || onToggleSidebar || (() => {});
  const handleOpenSOS = onOpenSOSModal || onOpenSOS || (() => {});

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const safeNotifications = notifications || [];
  const safeDoctors = doctors || [];

  const unreadCount = safeNotifications.filter(n => !n.read).length;

  // Filter search results for doctors, specialties, and treatments
  const filteredDoctors = searchQuery.trim() === '' ? [] : safeDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const specialtySuggestions = [
    { name: 'Cardiología', desc: 'Presión arterial, chequeo cardiovascular', tab: 'medicos' as NavigationTab },
    { name: 'Dermatología', desc: 'Piel, acné, lunares y manchas', tab: 'medicos' as NavigationTab },
    { name: 'Medicina General', desc: 'Chequeo preventivo y recetas', tab: 'medicos' as NavigationTab },
    { name: 'Endocrinología', desc: 'Glucosa, diabetes y tiroides', tab: 'medicos' as NavigationTab },
    { name: 'Neurología', desc: 'Cefalea, migraña e insomnio', tab: 'medicos' as NavigationTab },
    { name: 'Psicología', desc: 'Manejo de estrés y ansiedad', tab: 'medicos' as NavigationTab },
  ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'cita':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'receta':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'pago':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'recordatorio':
        return <Activity className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Trigger & MediConnect Brand */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={handleToggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div 
              onClick={() => setActiveTab('inicio')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Medi<span className="text-blue-600">Connect</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Telemedicina
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium tracking-wide">
                  Portal Integral del Paciente
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
              <input
                id="global-health-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Buscar médico, especialidad, síntoma o tratamiento..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-600 border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 rounded-xl transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-700 bg-slate-200/70 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                {searchQuery.trim() === '' ? (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">
                      Especialidades Frecuentes
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {specialtySuggestions.slice(0, 4).map((spec, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setActiveTab('medicos');
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors text-xs"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800">{spec.name}</p>
                            <p className="text-[10px] text-slate-600 truncate">{spec.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Doctors matched */}
                    {filteredDoctors.length > 0 && (
                      <div className="p-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 py-1">
                          Médicos Especialistas ({filteredDoctors.length})
                        </p>
                        {filteredDoctors.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => {
                              onSelectDoctorToBook(doc);
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/80 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={doc.photoUrl}
                                alt={doc.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="text-xs font-semibold text-slate-900">{doc.name}</p>
                                <p className="text-[11px] text-blue-600 font-medium">{doc.specialty} • {doc.hospital}</p>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                              Agendar
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Specialties matched */}
                    {specialtySuggestions.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 py-1">
                          Especialidades y Áreas
                        </p>
                        {specialtySuggestions.map((spec, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setActiveTab('medicos');
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-teal-600" />
                              <div>
                                <p className="text-xs font-semibold text-slate-900">{spec.name}</p>
                                <p className="text-[11px] text-slate-600">{spec.desc}</p>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                          </div>
                        ))}
                      </div>
                    )}

                    {filteredDoctors.length === 0 && specialtySuggestions.length === 0 && (
                      <div className="p-6 text-center text-slate-600 text-xs">
                        No se encontraron especialistas ni tratamientos para "<span className="font-semibold text-slate-700">{searchQuery}</span>".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Quick Action Button, Notifications, Patient Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Book Button */}
            <button
              id="header-quick-book-btn"
              onClick={onOpenQuickBook}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-xs shadow-blue-500/20 active:scale-98 transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>

            {/* Notifications Menu */}
            <div ref={notifRef} className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 rounded-xl transition-colors ${
                  isNotificationsOpen 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="Ver notificaciones médicas"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">Notificaciones</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">
                          {unreadCount} nuevas
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsAsRead}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-600 text-xs">
                        No tienes notificaciones pendientes.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationAsRead(notif.id);
                            if (notif.targetTab) {
                              setActiveTab(notif.targetTab);
                              setIsNotificationsOpen(false);
                            }
                          }}
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${
                            !notif.read ? 'bg-blue-100/80' : 'bg-slate-100'
                          }`}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('citas');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Ver todas mis actividades y citas →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200" />

            {/* Patient Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                id="header-profile-menu-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="relative">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                
                <div className="hidden xl:block">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {patient.name.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {patient.insurance.provider.split(' ')[0]} • Paciente
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{patient.name}</p>
                    <p className="text-[11px] text-slate-600 truncate">{patient.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {patient.bloodType}
                      </span>
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {patient.age} años
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('configuracion');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      <span>Mi Expediente & Perfil</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('signos');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Activity className="w-4 h-4 text-slate-600" />
                      <span>Mis Signos Vitales</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('configuracion');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span>Configuración y Notificaciones</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        handleOpenSOS();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-rose-500" />
                      <span>Protocolo de Emergencia SOS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
