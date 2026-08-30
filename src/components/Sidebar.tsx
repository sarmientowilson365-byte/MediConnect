import React from 'react';
import { 
  Home, 
  CalendarPlus, 
  Calendar, 
  UserCheck, 
  FileText, 
  ClipboardList, 
  Activity, 
  CreditCard, 
  Settings, 
  LogOut, 
  HeartPulse, 
  PhoneCall, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NavigationTab, PatientProfile } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isMobileOpen?: boolean;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  onClose?: () => void;
  patient?: PatientProfile;
  upcomingCount?: number;
  activePrescriptionsCount?: number;
  pendingPaymentsCount?: number;
  onOpenSOSModal?: () => void;
  onOpenSOS?: () => void;
  onOpenLogoutModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  isOpen,
  onCloseMobile,
  onClose,
  patient,
  upcomingCount = 0,
  activePrescriptionsCount = 0,
  pendingPaymentsCount = 0,
  onOpenSOSModal,
  onOpenSOS,
  onOpenLogoutModal = () => {}
}) => {
  const isCurrentlyOpen = isMobileOpen ?? isOpen ?? false;
  const handleClose = onCloseMobile ?? onClose ?? (() => {});
  const handleOpenSOS = onOpenSOSModal ?? onOpenSOS ?? (() => {});

  const menuItems = [
    {
      id: 'inicio' as NavigationTab,
      label: 'Inicio',
      icon: Home,
      badge: null,
    },
    {
      id: 'agendar' as NavigationTab,
      label: 'Agendar cita',
      icon: CalendarPlus,
      badge: 'Nuevo',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'citas' as NavigationTab,
      label: 'Mis citas',
      icon: Calendar,
      badge: upcomingCount > 0 ? upcomingCount.toString() : null,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'medicos' as NavigationTab,
      label: 'Médicos especialistas',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'recetas' as NavigationTab,
      label: 'Recetas digitales',
      icon: FileText,
      badge: activePrescriptionsCount > 0 ? activePrescriptionsCount.toString() : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'historial' as NavigationTab,
      label: 'Historial médico',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'signos' as NavigationTab,
      label: 'Signos vitales',
      icon: Activity,
      badge: 'Óptimo',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      id: 'pagos' as NavigationTab,
      label: 'Pagos y facturación',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Pendiente` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-semibold',
    },
    {
      id: 'configuracion' as NavigationTab,
      label: 'Configuración',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    handleClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isCurrentlyOpen && (
        <div 
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 lg:w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isCurrentlyOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Medi<span className="text-blue-600">Connect</span>
              </span>
              <p className="text-[11px] text-slate-600 font-medium">
                Salud Digital & Telemedicina
              </p>
            </div>
          </div>
        </div>

        {/* Patient Mini Summary Card */}
        {patient && (
          <div className="px-4 py-3.5 mx-3 mt-3 bg-gradient-to-br from-blue-50/80 via-slate-50 to-teal-50/60 rounded-2xl border border-blue-100/70">
            <div className="flex items-center gap-3">
              <img
                src={patient.avatar || patient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={patient.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {patient.name}
                </p>
                <p className="text-[11px] text-slate-600 truncate">
                  {patient.documentId}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Seguro Activo ({patient.insurance?.provider?.split(' ')[0] || 'Sanitas'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-3 mb-2">
            Menú Principal
          </p>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions: SOS / Emergency & Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          
          {/* Emergency Protocol Button */}
          <button
            id="sidebar-sos-btn"
            onClick={handleOpenSOS}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100/90 text-rose-700 border border-rose-200/80 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Emergencias SOS (106)</span>
            </div>
            <span className="text-[10px] bg-rose-200/80 text-rose-800 px-1.5 py-0.5 rounded-md">
              24/7
            </span>
          </button>

          {/* Cerrar Sesión */}
          <button
            id="sidebar-logout-btn"
            onClick={onOpenLogoutModal}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
