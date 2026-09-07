import React from 'react';
import {
  Users,
  ScanFace,
  QrCode,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Building2,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSelectorHome: React.FC = () => {
  const { setActiveRole, members, employees, accessLogs } = useApp();

  const activeMembersCount = members.filter((m) => m.status === 'Activo').length;
  const expiredMembersCount = members.filter((m) => m.status === 'Vencido').length;

  const rolesConfig: {
    role: UserRole;
    title: string;
    subtitle: string;
    badge: string;
    badgeStyle: string;
    borderHover: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    btnClass: string;
    features: string[];
    details: string;
  }[] = [
    {
      role: 'admin',
      title: 'Dirección / Administración',
      subtitle: 'Gerencia y Recepción',
      badge: 'Gerencia & POS',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      borderHover: 'hover:border-blue-500 hover:ring-2 hover:ring-blue-100',
      icon: Building2,
      accentColor: 'text-blue-600 bg-blue-50',
      btnClass: 'bg-blue-700 hover:bg-blue-800 text-white',
      features: [
        'Gestión General de Socios (CRUD y estados)',
        'Registro Biométrico Facial (Enrolamiento)',
        'Punto de Venta (POS) y cobro cuotas/productos',
        'Emisión de Comprobantes (WhatsApp y PDF)',
        'Administración de 25 Empleados del club',
        'Reportes Operativos, Financieros y Caja'
      ],
      details: 'Atención: Oscar Patiño • Gerente de Operación'
    },
    {
      role: 'instructor',
      title: 'Instructor / Docente',
      subtitle: 'Torniquete y Hardware',
      badge: 'Hardware & IoT',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderHover: 'hover:border-emerald-500 hover:ring-2 hover:ring-emerald-100',
      icon: ScanFace,
      accentColor: 'text-emerald-600 bg-emerald-50',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      features: [
        'Reconocimiento Facial Biométrico en tiempo real',
        'Validación instantánea de vigencia de pago',
        'Apertura automatizada de torniquete (Pulso IoT)',
        'Pantalla / Monitor de Bienvenida en Acceso',
        'Bitácora de accesos concedidos y denegados',
        'Control de asistencia a clases y áreas'
      ],
      details: 'Tiempo de respuesta motor IA: < 1.0 segundo'
    },
    {
      role: 'member',
      title: 'Alumno / Socio',
      subtitle: 'App Móvil & Portal Web',
      badge: 'Portal Socio',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderHover: 'hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100',
      icon: QrCode,
      accentColor: 'text-indigo-600 bg-indigo-50',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      features: [
        'Credencial Digital con QR Dinámico (cada 30s)',
        'Consulta de Estado de Cuenta y días restantes',
        'Historial de pagos y recibos digitales',
        'Notificaciones y alertas de vencimiento',
        'Simulación de paso por torniquete',
        'Registro de visitas y metas de entrenamiento'
      ],
      details: 'Acceso seguro con contingencia QR'
    },
    {
      role: 'compliance',
      title: 'Normativa STPS / CONOCER',
      subtitle: 'Auditoría y Certificaciones',
      badge: 'Acentos Ámbar STPS',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300',
      borderHover: 'hover:border-amber-500 hover:ring-2 hover:ring-amber-100',
      icon: Award,
      accentColor: 'text-amber-700 bg-amber-50',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      features: [
        'Generador de Constancias DC-3 STPS oficiales',
        'Estándares CONOCER (EC0217.01 & EC0076)',
        'Matriz de competencias de los 25 empleados',
        'Auditoría NOM-019, NOM-030 y NOM-035',
        'Expediente de capacitación laboral del club',
        'Dictamen de cumplimiento para inspección'
      ],
      details: 'Marco normativo laboral de México'
    }
  ];

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Sistema Integral de Control de Acceso y Gestión</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            CLUB MG • Panel de Control por Roles
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
            Selecciona un perfil operativo para acceder a los módulos de <strong>Recepción y Cobros POS</strong>, <strong>Control de Acceso Automatizado con Reconocimiento Facial</strong>, <strong>Portal del Socio</strong> o <strong>Auditoría STPS/CONOCER</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] sm:text-xs text-slate-400 block">Personal Club</span>
              <span className="text-lg sm:text-2xl font-bold text-white leading-tight block">{employees.length} Staff</span>
              <span className="text-[9px] sm:text-[10px] text-blue-300 block mt-0.5 truncate">Gerente: Oscar Patiño</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] sm:text-xs text-slate-400 block">Socios Registrados</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-2xl font-bold text-white leading-tight">{members.length}</span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">({activeMembersCount})</span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-amber-300 block mt-0.5 truncate">{expiredMembersCount} cuotas vencidas</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] sm:text-xs text-slate-400 block">Hardware & Relé IoT</span>
              <span className="text-lg sm:text-2xl font-bold text-emerald-400 leading-tight block">En Línea</span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 block mt-0.5 truncate">Latencia motor: 390 ms</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/10">
              <span className="text-[10px] sm:text-xs text-slate-400 block">Auditoría STPS</span>
              <span className="text-lg sm:text-2xl font-bold text-amber-400 leading-tight block">88%</span>
              <span className="text-[9px] sm:text-[10px] text-slate-300 block mt-0.5 truncate">Formato DC-3 activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selector Grid: 2 Columns Mobile / 4 Columns Desktop */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Acceso por Roles en Inicio
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Cuadrícula 2 columnas en móvil y 4 columnas en escritorio
            </p>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            4 Perfiles
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => setActiveRole(item.role)}
                className={`group bg-white rounded-2xl p-3 sm:p-5 border border-slate-200 shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between ${item.borderHover}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between mb-3 gap-1">
                    <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${item.accentColor} transition group-hover:scale-105 shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border uppercase tracking-wider truncate max-w-[90px] sm:max-w-none ${item.badgeStyle}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-bold text-xs sm:text-base text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition line-clamp-2 min-h-[32px] sm:min-h-0">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-3 truncate">
                    {item.subtitle}
                  </p>

                  {/* Feature Checklist */}
                  <div className="border-t border-slate-100 pt-2.5 mb-3 space-y-1.5">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Módulos:
                    </p>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {item.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-600">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 mb-2 truncate font-medium">
                    {item.details}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRole(item.role);
                    }}
                    className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-semibold text-[11px] sm:text-xs transition shadow-xs ${item.btnClass}`}
                  >
                    <span>Ingresar</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional Footer note */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Club MG & App Design</strong> • Propuesta de Alcance del Sistema de Control de Acceso y Gestión
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Reconocimiento Facial (Face ID) • Relé IoT • Formato STPS DC-3
        </div>
      </div>

    </div>
  );
};
