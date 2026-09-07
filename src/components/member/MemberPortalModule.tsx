import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CreditCard,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  Download,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MemberPortalModule: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    currentMemberId,
    setCurrentMemberId,
    currentMember,
    transactions,
    verifyAccess,
    notifications,
  } = useApp();

  // Dynamic QR countdown timer (refreshes every 30 seconds)
  const [countdown, setCountdown] = useState(30);
  const [qrToken, setQrToken] = useState('MG-TOKEN-948271');
  const [accessTestResult, setAccessTestResult] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Generate new token
          setQrToken(`MG-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!currentMember) return null;

  const isExpired = currentMember.status === 'Vencido';
  const memberTransactions = transactions.filter((t) => t.memberId === currentMember.id);

  const handleTestQRAccess = () => {
    const log = verifyAccess(currentMember.id, 'QR Dinámico');
    if (log.status === 'Acceso Concedido') {
      setAccessTestResult('¡Acceso Concedido! Torniquete 02 desbloqueado con código QR.');
    } else {
      setAccessTestResult(`Acceso Denegado: ${log.reason}`);
    }
    setTimeout(() => setAccessTestResult(null), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Member Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Módulo 3 • Portal del Socio / Alumno
            </span>
            <span className="text-xs text-slate-500 font-medium">Club MG App Móvil</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Mi Cuenta y Credencial de Acceso
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Credencial digital con QR dinámico anti-fraude, estado de cuenta y notificaciones
          </p>
        </div>

        {/* Member Selector for Demo */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 font-medium whitespace-nowrap">Ver como:</label>
          <select
            value={currentMemberId}
            onChange={(e) => setCurrentMemberId(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-hidden"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} ({m.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto max-w-full">
        {[
          { id: 'credencial', label: 'Credencial Digital con QR', icon: QrCode },
          { id: 'estado-cuenta', label: 'Estado de Cuenta & Pagos', icon: CreditCard },
          { id: 'notificaciones', label: 'Notificaciones & Recordatorios', icon: Bell },
          { id: 'historial-visitas', label: 'Mis Asistencias', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. CREDENCIAL DIGITAL CON QR DINÁMICO (30S REFRESH)                       */}
      {/* ========================================================================= */}
      {activeTab === 'credencial' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Digital Credential Card */}
          <div className="md:col-span-6 lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-2xl border border-blue-800/40 relative overflow-hidden">
              {/* Background badge */}
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-blue-500/10 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">
                    MG
                  </div>
                  <div>
                    <div className="font-extrabold text-sm tracking-tight leading-none">CLUB MG</div>
                    <div className="text-[9px] text-blue-300 font-mono tracking-widest uppercase">
                      CREDENCIAL DIGITAL
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentMember.status === 'Activo'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {currentMember.status}
                </span>
              </div>

              {/* Photo & Member info */}
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={currentMember.photoUrl}
                  alt={currentMember.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-base text-white tracking-tight leading-snug">
                    {currentMember.fullName}
                  </h3>
                  <div className="text-xs text-blue-200 font-mono font-medium">
                    {currentMember.code}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Plan: <strong className="text-white">{currentMember.plan}</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="bg-white rounded-2xl p-4 text-center text-slate-900 shadow-inner">
                {/* SVG QR Code Simulation */}
                <div className="relative w-44 h-44 mx-auto bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-200">
                  <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
                    {/* Corner Position Targets */}
                    <rect x="10" y="10" width="30" height="30" rx="4" fill="#0f172a" />
                    <rect x="16" y="16" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="20" y="20" width="10" height="10" rx="1" fill="#0f172a" />

                    <rect x="80" y="10" width="30" height="30" rx="4" fill="#0f172a" />
                    <rect x="86" y="16" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="90" y="20" width="10" height="10" rx="1" fill="#0f172a" />

                    <rect x="10" y="80" width="30" height="30" rx="4" fill="#0f172a" />
                    <rect x="16" y="86" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="20" y="90" width="10" height="10" rx="1" fill="#0f172a" />

                    {/* Center dynamic pattern lines based on countdown */}
                    <rect x="48" y="20" width="8" height="8" fill="#1e40af" />
                    <rect x="62" y="20" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="34" width="22" height="8" fill="#0f172a" />
                    <rect x="20" y="48" width="8" height="22" fill="#1e40af" />
                    <rect x="34" y="48" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="48" width="24" height="24" rx="4" fill="#2563eb" />
                    <circle cx="60" cy="60" r="6" fill="#ffffff" />
                    <rect x="80" y="48" width="20" height="8" fill="#0f172a" />
                    <rect x="80" y="62" width="8" height="8" fill="#1e40af" />
                    <rect x="92" y="62" width="18" height="8" fill="#0f172a" />
                    <rect x="48" y="80" width="8" height="20" fill="#0f172a" />
                    <rect x="62" y="80" width="18" height="8" fill="#1e40af" />
                    <rect x="80" y="80" width="10" height="10" fill="#0f172a" />
                    <rect x="100" y="80" width="10" height="10" fill="#0f172a" />
                    <rect x="80" y="100" width="30" height="10" fill="#0f172a" />
                  </svg>
                </div>

                {/* Refresh Countdown bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                      QR Dinámico de Seguridad
                    </span>
                    <span className="text-blue-700">Se actualiza en {countdown}s</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000"
                      style={{ width: `${(countdown / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer note */}
              <div className="mt-4 text-center text-[10px] text-blue-200/80">
                Acerca este código al escáner del torniquete 02 si la cámara facial no está disponible.
              </div>
            </div>
          </div>

          {/* Right info & contingency tester */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-base text-slate-900">
                Instrucciones de Acceso y Contingencia
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                El acceso principal en Club MG se realiza mediante <strong>Reconocimiento Facial (Face ID)</strong> automático al acercarse a la cámara del torniquete 01. En caso de contingencia (iluminación, accesorios o falla óptica), presenta tu <strong>QR Dinámico</strong> en el lector del torniquete 02.
              </p>

              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 text-xs text-blue-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Seguridad Anti-Capturas de Pantalla</span>
                </div>
                <p className="text-blue-800 text-[11px]">
                  El código QR rota su token criptográfico cada 30 segundos (<code className="font-mono bg-blue-100 px-1 py-0.5 rounded">{qrToken}</code>). No uses capturas de pantalla fijas ya que serán rechazadas.
                </p>
              </div>

              {/* Test Access Button */}
              <div className="pt-2">
                <button
                  onClick={handleTestQRAccess}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  <Zap className="w-4 h-4" />
                  <span>Simular Paso por Torniquete con este QR</span>
                </button>
              </div>

              {accessTestResult && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  accessTestResult.includes('Concedido')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {accessTestResult.includes('Concedido') ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{accessTestResult}</span>
                </div>
              )}
            </div>

            {/* Account quick status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Resumen de Membresía</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Días Restantes</span>
                  <span className={`text-xl font-black ${isExpired ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {currentMember.daysRemaining >= 0 ? `${currentMember.daysRemaining} días` : `${Math.abs(currentMember.daysRemaining)} d. vencido`}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Fecha Límite</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-1 block">
                    {currentMember.endDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ESTADO DE CUENTA & PAGOS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'estado-cuenta' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Estado de Cuenta de Membresía</h3>
              <p className="text-xs text-slate-500">Plan actual, saldo y comprobantes de pago digitales</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Estatus Actual</span>
              <span className={`text-sm font-bold ${currentMember.status === 'Activo' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currentMember.status} ({currentMember.daysRemaining} días de vigencia)
              </span>
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-800">
              Historial de Pagos y Cuotas Registradas
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase">
                    <th className="py-3 px-4">Folio Recibo</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Conceptos</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {memberTransactions.length > 0 ? (
                    memberTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">{tx.receiptNumber}</td>
                        <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                        <td className="py-3 px-4">
                          {tx.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                        </td>
                        <td className="py-3 px-4">{tx.paymentMethod}</td>
                        <td className="py-3 px-4 text-right font-bold font-mono text-slate-900">
                          ${tx.total.toFixed(2)} MXN
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No hay pagos recientes registrados para este socio.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. NOTIFICACIONES & RECORDATORIOS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'notificaciones' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Alertas y Avisos de Gimnasio</h3>
              <p className="text-xs text-slate-500">Recordatorios de vigencia, horarios especiales y promociones</p>
            </div>
          </div>

          <div className="space-y-3">
            {isExpired && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-rose-900">Membresía Vencida</h4>
                  <p className="mt-1 leading-relaxed">
                    Tu plan ha expirado. Para mantener tu acceso por los torniquetes biométricos sin interrupciones, acude al área de recepción o realiza tu pago vía transferencia.
                  </p>
                </div>
              </div>
            )}

            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{notif.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MIS ASISTENCIAS & VISITAS                                              */}
      {/* ========================================================================= */}
      {activeTab === 'historial-visitas' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registro de Entrenamientos y Visitas</h3>
              <p className="text-xs text-slate-500">Total acumulado: {currentMember.totalVisits} ingresos por torniquetes</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {currentMember.totalVisits} Días Activo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Último Ingreso</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">
                {currentMember.lastVisit || 'Hoy temprano'}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Método Habitual</span>
              <span className="text-sm font-bold text-blue-700 block mt-1">
                Reconocimiento Facial
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Puntualidad de Asistencia</span>
              <span className="text-sm font-bold text-emerald-600 block mt-1">
                Constante (4 veces / sem)
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
