import React from 'react';
import {
  Users,
  Camera,
  CreditCard,
  FileText,
  Briefcase,
  BarChart3,
  ScanFace,
  QrCode,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeRole, setActiveRole, activeTab, setActiveTab, resetToDefaults } = useApp();

  if (!activeRole) return null;

  const roleLabels: Record<string, string> = {
    admin: 'Dirección / Admin',
    instructor: 'Instructor / Docente',
    member: 'Alumno / Socio',
    compliance: 'Normativa STPS',
  };

  // Nav items configured per role
  const getNavItems = () => {
    switch (activeRole) {
      case 'admin':
        return [
          { id: 'socios', label: 'Gestión de Socios', icon: Users, desc: 'CRUD y estatus' },
          { id: 'biometria', label: 'Registro Facial', icon: Camera, desc: 'Enrolamiento Face ID' },
          { id: 'pos', label: 'Punto de Venta (POS)', icon: CreditCard, desc: 'Cobros y membresías' },
          { id: 'recibos', label: 'Emisión Comprobantes', icon: FileText, desc: 'WhatsApp y PDF' },
          { id: 'empleados', label: 'Plantilla Empleados', icon: Briefcase, desc: '25 Colaboradores' },
          { id: 'reportes', label: 'Reportes Financieros', icon: BarChart3, desc: 'Caja y accesos' },
        ];
      case 'instructor':
        return [
          { id: 'acceso-vivo', label: 'Face ID en Acceso', icon: ScanFace, desc: 'Cámara en vivo' },
          { id: 'monitor-display', label: 'Monitor de Bienvenida', icon: ShieldCheck, desc: 'Pantalla de acceso' },
          { id: 'bitacora', label: 'Bitácora en Tiempo Real', icon: CheckCircle, desc: 'Registro y torniquete' },
          { id: 'asistencia-clases', label: 'Asistencia y Clases', icon: Users, desc: 'Control de áreas' },
        ];
      case 'member':
        return [
          { id: 'credencial', label: 'Credencial Digital', icon: QrCode, desc: 'QR dinámico 30s' },
          { id: 'estado-cuenta', label: 'Estado de Cuenta', icon: CreditCard, desc: 'Vigencia y pagos' },
          { id: 'notificaciones', label: 'Alertas y Avisos', icon: FileText, desc: 'Recordatorios cuotas' },
          { id: 'historial-visitas', label: 'Mis Visitas', icon: BarChart3, desc: 'Registro en torniquete' },
        ];
      case 'compliance':
        return [
          { id: 'dc3', label: 'Constancias STPS (DC-3)', icon: Award, desc: 'Formato oficial' },
          { id: 'conocer', label: 'Estándares CONOCER', icon: BookOpen, desc: 'EC0217 & EC0076' },
          { id: 'matriz-empleados', label: 'Matriz 25 Colaboradores', icon: Briefcase, desc: 'Cumplimiento' },
          { id: 'seguridad-higiene', label: 'Auditoría NOMs', icon: ShieldCheck, desc: 'NOM-019 / 030 / 035' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out lg:static ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isOpenMobile ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {/* Active Role Card & Exit button */}
          <div className="mb-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Rol en Sesión
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {roleLabels[activeRole]}
                  </div>
                </div>
              )}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition ml-auto shrink-0"
                title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => {
                setActiveRole(null);
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition shadow-2xs cursor-pointer"
              title="Cerrar sesión actual para ir a otros roles"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>

          <div className="px-2 mb-1">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Módulos del Sistema
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {!collapsed && (
                  <div className="overflow-hidden">
                    <div className="text-xs truncate">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & reset */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          {!collapsed && (
            <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Control IoT Activo</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Relé serie/IP torniquete listo en 390ms.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              setActiveRole(null);
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Cerrar sesión actual y cambiar a otro rol"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Restablecer datos demo iniciales de Club MG?')) {
                resetToDefaults();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-medium text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition"
            title="Restablecer datos originales de prueba"
          >
            <RotateCcw className="w-3 h-3" />
            {!collapsed && <span>Restablecer demo</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
