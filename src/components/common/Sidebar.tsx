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
  RotateCcw
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
  const { activeRole, activeTab, setActiveTab, resetToDefaults } = useApp();

  if (!activeRole) return null;

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
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-2 mb-2 flex items-center justify-between">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Módulos del Rol
              </span>
            )}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-auto"
              title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
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
