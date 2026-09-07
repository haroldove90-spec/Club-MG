import React from 'react';
import {
  Users,
  Camera,
  CreditCard,
  FileText,
  ScanFace,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Award,
  BookOpen,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomBar: React.FC = () => {
  const { activeRole, activeTab, setActiveTab } = useApp();

  if (!activeRole) return null;

  const getBottomItems = () => {
    switch (activeRole) {
      case 'admin':
        return [
          { id: 'socios', label: 'Socios', icon: Users },
          { id: 'biometria', label: 'Biometría', icon: Camera },
          { id: 'pos', label: 'Cobros POS', icon: CreditCard },
          { id: 'recibos', label: 'Recibos', icon: FileText },
          { id: 'reportes', label: 'Reportes', icon: BarChart3 },
        ];
      case 'instructor':
        return [
          { id: 'acceso-vivo', label: 'Face ID', icon: ScanFace },
          { id: 'monitor-display', label: 'Monitor', icon: ShieldCheck },
          { id: 'bitacora', label: 'Bitácora', icon: CheckCircle },
          { id: 'asistencia-clases', label: 'Clases', icon: Users },
        ];
      case 'member':
        return [
          { id: 'credencial', label: 'QR Pase', icon: QrCode },
          { id: 'estado-cuenta', label: 'Estado', icon: CreditCard },
          { id: 'notificaciones', label: 'Avisos', icon: FileText },
          { id: 'historial-visitas', label: 'Visitas', icon: BarChart3 },
        ];
      case 'compliance':
        return [
          { id: 'dc3', label: 'STPS DC-3', icon: Award },
          { id: 'conocer', label: 'CONOCER', icon: BookOpen },
          { id: 'matriz-empleados', label: '25 Empleados', icon: Briefcase },
          { id: 'seguridad-higiene', label: 'NOMs', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const items = getBottomItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg safe-bottom">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[54px] ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
