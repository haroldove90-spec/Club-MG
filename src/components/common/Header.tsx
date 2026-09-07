import React, { useState } from 'react';
import {
  ShieldCheck,
  Download,
  LogOut,
  Wifi,
  WifiOff,
  Bell,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../hooks/usePWA';
import { PWAInstallModal } from './PWAInstallModal';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenInstallModal }) => {
  const { activeRole, setActiveRole, notifications, markNotificationRead } = useApp();
  const { isOnline, isInstalled } = usePWA();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const handleInstall = () => {
    if (onOpenInstallModal) {
      onOpenInstallModal();
    } else {
      setShowInstallModal(true);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleMeta: Record<UserRole, { label: string; badgeBg: string; badgeText: string; icon: string }> = {
    admin: {
      label: 'Dirección / Admin',
      badgeBg: 'bg-blue-50 border-blue-200',
      badgeText: 'text-blue-900',
      icon: 'Gerencia y Recepción',
    },
    instructor: {
      label: 'Instructor / Docente',
      badgeBg: 'bg-emerald-50 border-emerald-200',
      badgeText: 'text-emerald-900',
      icon: 'Control de Acceso / Torniquete',
    },
    member: {
      label: 'Alumno / Socio',
      badgeBg: 'bg-indigo-50 border-indigo-200',
      badgeText: 'text-indigo-900',
      icon: 'Portal Web & QR Dinámico',
    },
    compliance: {
      label: 'Normativa STPS',
      badgeBg: 'bg-amber-50 border-amber-200',
      badgeText: 'text-amber-900',
      icon: 'Auditoría y Certificaciones',
    },
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Left: Brand & Sidebar toggle */}
            <div className="flex items-center gap-3">
              {activeRole && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-hidden"
                  aria-label="Alternar menú"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => setActiveRole(null)}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden"
                title="Ir al selector de roles"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs group-hover:bg-blue-900 transition">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">CLUB MG</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                      Face ID
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 hidden sm:block leading-none mt-0.5">
                    Control de Acceso y Gestión
                  </p>
                </div>
              </button>
            </div>

            {/* Right: Active Role, PWA button, Notifications, Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Online/Offline status badge */}
              <div
                className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>En línea</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sin conexión</span>
                  </>
                )}
              </div>

              {/* PWA Install Button */}
              {!isInstalled && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-medium text-xs shadow-xs transition cursor-pointer shrink-0"
                  title="Instalar aplicación en dispositivo"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Instalar Club MG</span>
                  <span className="hidden xs:inline sm:hidden">Instalar</span>
                </button>
              )}

              {/* Active Role Indicator (Separated Roles) */}
              {activeRole && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs ${roleMeta[activeRole].badgeBg} ${roleMeta[activeRole].badgeText}`}
                  title={`Rol activo: ${roleMeta[activeRole].label}`}
                >
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[100px] xs:max-w-[140px] sm:max-w-none truncate">
                    {roleMeta[activeRole].label}
                  </span>
                </div>
              )}

              {/* Notifications dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
                  aria-label="Ver notificaciones"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 font-bold text-slate-900 border-b border-slate-100 flex items-center justify-between">
                      <span>Notificaciones y Alertas</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                        {unreadCount} nuevas
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markNotificationRead(item.id)}
                          className={`p-3 cursor-pointer hover:bg-slate-50 transition ${
                            !item.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900 text-xs">{item.title}</span>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Logout / Exit Button to switch roles */}
              {activeRole && (
                <button
                  onClick={() => setActiveRole(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 hover:border-rose-300 transition text-xs font-bold shadow-xs cursor-pointer"
                  title="Cerrar sesión actual y volver al selector de roles"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span className="whitespace-nowrap">Cerrar Sesión</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* PWA Install Modal */}
      <PWAInstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </>
  );
};
