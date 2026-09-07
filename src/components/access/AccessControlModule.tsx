import React, { useState, useRef, useEffect } from 'react';
import {
  ScanFace,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  RotateCw,
  Camera,
  Activity,
  User,
  Clock,
  Radio,
  ArrowRight,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member, AccessLog } from '../../types';

export const AccessControlModule: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    accessLogs,
    verifyAccess,
    turnstileUnlocked,
    lastTurnstileResult,
  } = useApp();

  // Test scanner states
  const [selectedSimMemberId, setSelectedSimMemberId] = useState<string>(members[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'detecting' | 'validating' | 'finished'>('idle');
  const [liveDisplayLog, setLiveDisplayLog] = useState<AccessLog | null>(lastTurnstileResult);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [logFilter, setLogFilter] = useState<'Todos' | 'Concedidos' | 'Denegados'>('Todos');
  const videoFeedRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (lastTurnstileResult) {
      setLiveDisplayLog(lastTurnstileResult);
    }
  }, [lastTurnstileResult]);

  const startLiveCamera = async () => {
    try {
      setIsLiveCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoFeedRef.current) {
        videoFeedRef.current.srcObject = stream;
        videoFeedRef.current.play();
      }
    } catch (e) {
      console.warn('Camera feed fallback to simulated optical stream', e);
      setIsLiveCameraActive(true);
    }
  };

  const stopLiveCamera = () => {
    if (videoFeedRef.current && videoFeedRef.current.srcObject) {
      const stream = videoFeedRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoFeedRef.current.srcObject = null;
    }
    setIsLiveCameraActive(false);
  };

  const handleSimulateFaceScan = (memberIdToScan: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStep('detecting');

    // Step 1: Detect face & extract vectors (< 300ms)
    setTimeout(() => {
      setScanStep('validating');

      // Step 2: Instant database query & IoT pulse (< 650ms total)
      setTimeout(() => {
        const result = verifyAccess(memberIdToScan, 'Face ID');
        setLiveDisplayLog(result);
        setScanStep('finished');
        setIsScanning(false);
      }, 350);
    }, 300);
  };

  const filteredLogs = accessLogs.filter((l) => {
    if (logFilter === 'Concedidos') return l.status === 'Acceso Concedido';
    if (logFilter === 'Denegados') return l.status === 'Acceso Denegado';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner with IoT Relay indicator */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Módulo 2 • Torniquete y Hardware
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Controlador Relé IoT: Conectado (IP 192.168.1.120)</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Control de Acceso Automatizado (Face ID)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Reconocimiento facial biométrico, validación de vigencia en tiempo real y pulso a torniquete
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Módulo Activo</span>
            <span className="text-xs font-bold text-emerald-700 capitalize">
              {activeTab === 'acceso-vivo' && 'Face ID en Acceso'}
              {activeTab === 'monitor-display' && 'Monitor de Bienvenida'}
              {activeTab === 'bitacora' && 'Bitácora en Tiempo Real'}
              {activeTab === 'asistencia-clases' && 'Áreas & Clases'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FACE ID EN ACCESO (CÁMARA Y PULSO A TORNIQUETE)                        */}
      {/* ========================================================================= */}
      {activeTab === 'acceso-vivo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Camera Feed / Point of Access Viewport */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl text-white space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
                  CÁMARA TORN_01 • EN VIVO (30 FPS)
                </span>
              </div>
              <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Latencia: &lt; 400ms
              </span>
            </div>

            {/* Video / Simulator Viewport */}
            <div className="relative aspect-16/10 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
              {isLiveCameraActive ? (
                <video
                  ref={videoFeedRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  {(() => {
                    const chosen = members.find((m) => m.id === selectedSimMemberId) || members[0];
                    return (
                      <img
                        src={chosen.photoUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-85"
                      />
                    );
                  })()}
                </div>
              )}

              {/* HUD / Biometric bounding target box */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-emerald-400/80 rounded-2xl relative flex flex-col justify-between p-2 animate-pulse">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/40">
                      {isScanning ? 'PROCESANDO VECTORES' : 'DETECTANDO ROSTRO'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Scanning laser beam effect */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#34d399] animate-pulse top-1/3" />
              )}
            </div>

            {/* Hardware Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {!isLiveCameraActive ? (
                  <button
                    onClick={startLiveCamera}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                  >
                    Activar Cámara Real
                  </button>
                ) : (
                  <button
                    onClick={stopLiveCamera}
                    className="py-2 px-3 bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 text-xs font-medium rounded-lg transition"
                  >
                    Detener Cámara
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={isScanning}
                  onClick={() => handleSimulateFaceScan(selectedSimMemberId)}
                  className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  <ScanFace className="w-4 h-4" />
                  <span>{isScanning ? 'Validando...' : 'Escanear Rostro en Torniquete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Quick Member Selector for Testing & IoT Relay Status */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Torniquete Mechanical Relay Status Box */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              turnstileUnlocked
                ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-400/50 shadow-lg'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Zap className={`w-4 h-4 ${turnstileUnlocked ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
                  <span>Torniquete Mecánico 01</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  turnstileUnlocked
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {turnstileUnlocked ? 'DESBLOQUEADO (4s)' : 'BLOQUEADO'}
                </span>
              </div>

              <p className="text-xs text-slate-600">
                {turnstileUnlocked
                  ? '⚡ Pulso enviado por relé serie/IP. Torniquete girando. Paso peatonal permitido.'
                  : 'Esperando validación de identidad y vigencia de cuota para conmutar electroimán.'}
              </p>
            </div>

            {/* Selector of members to test instantly */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  Simular Paso de Socios en Acceso
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Prueba Rápida</span>
              </div>
              <p className="text-xs text-slate-500">
                Prueba socios activos, cuotas vencidas y socios suspendidos para verificar la respuesta del sistema:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {members.map((m) => {
                  const isSelected = selectedSimMemberId === m.id;
                  const isAct = m.status === 'Activo';
                  const isExp = m.status === 'Vencido';

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedSimMemberId(m.id);
                        handleSimulateFaceScan(m.id);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img src={m.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs text-slate-900 truncate">{m.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                            <span>{m.plan}</span>
                            <span>•</span>
                            <span className={isAct ? 'text-emerald-600 font-semibold' : isExp ? 'text-rose-600 font-bold' : 'text-amber-600'}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className={`p-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                          isAct
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        Pasar Face ID
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PANTALLA / MONITOR DE BIENVENIDA EN ACCESO (DISPLAY LOCAL)             */}
      {/* ========================================================================= */}
      {activeTab === 'monitor-display' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Display Local / Monitor de Bienvenida en Acceso
              </h3>
              <p className="text-xs text-slate-500">
                Pantalla montada sobre el torniquete visible para el socio y el personal de seguridad
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              RESOLUCIÓN DISPLAY: 1920x1080 (MONITOR 01)
            </span>
          </div>

          {/* Large Screen Display Simulation */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 border-4 border-slate-800 shadow-2xl text-white relative overflow-hidden">
            {/* Display Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl">
                  MG
                </div>
                <div>
                  <h4 className="font-extrabold text-lg tracking-tight">CLUB MG • CONTROL DE ACCESO</h4>
                  <p className="text-xs text-slate-400 font-mono">Punto de Acceso Torniquete 01</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-emerald-400">SISTEMA ACTIVO</div>
                <div className="text-xs text-slate-400">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Display Body */}
            {liveDisplayLog ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative">
                    <img
                      src={liveDisplayLog.photoUrl}
                      alt=""
                      className={`w-52 h-52 sm:w-64 sm:h-64 rounded-3xl object-cover border-4 shadow-2xl ${
                        liveDisplayLog.status === 'Acceso Concedido'
                          ? 'border-emerald-500 ring-8 ring-emerald-500/20'
                          : 'border-rose-500 ring-8 ring-rose-500/20'
                      }`}
                    />
                    <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${
                        liveDisplayLog.status === 'Acceso Concedido'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}>
                        {liveDisplayLog.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                      Identificación del Usuario:
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {liveDisplayLog.memberName}
                    </h2>
                    <p className="text-sm font-mono text-blue-300 mt-1">
                      ID Socio: {liveDisplayLog.memberId} • Verificado en {liveDisplayLog.latencyMs} ms
                    </p>
                  </div>

                  {/* Big Banner Result */}
                  <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
                    liveDisplayLog.status === 'Acceso Concedido'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                  }`}>
                    {liveDisplayLog.status === 'Acceso Concedido' ? (
                      <CheckCircle className="w-12 h-12 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-12 h-12 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                        {liveDisplayLog.status === 'Acceso Concedido'
                          ? '¡ACCESO CONCEDIDO! ADELANTE'
                          : 'ACCESO DENEGADO'}
                      </div>
                      <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                        {liveDisplayLog.status === 'Acceso Concedido'
                          ? 'Membresía al día. Pase por el torniquete antes de 4 segundos.'
                          : liveDisplayLog.reason || 'Cuota vencida. Favor de pasar a Recepción.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <ScanFace className="w-16 h-16 mx-auto opacity-40 text-blue-400 animate-pulse" />
                <h3 className="text-lg font-bold text-slate-300">Esperando usuario frente a la cámara...</h3>
                <p className="text-xs text-slate-500">
                  Ponte frente a la cámara de acceso para activar el reconocimiento facial.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BITÁCORA EN TIEMPO REAL                                                */}
      {/* ========================================================================= */}
      {activeTab === 'bitacora' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">Bitácora de Accesos en Tiempo Real</h3>
              <p className="text-xs text-slate-500">Historial de validaciones biométricas y pases con torniquete</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              {(['Todos', 'Concedidos', 'Denegados'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                    logFilter === filter
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Hora & Fecha</th>
                    <th className="py-3 px-4">Socio Identificado</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4">Punto / Torniquete</th>
                    <th className="py-3 px-4">Resultado</th>
                    <th className="py-3 px-4">Latencia IA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredLogs.map((log) => {
                    const isGranted = log.status === 'Acceso Concedido';

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={log.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">{log.memberName}</div>
                              {log.reason && (
                                <div className="text-[10px] text-rose-600 font-medium">{log.reason}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            {log.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{log.turnstileId}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isGranted ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {isGranted ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                            <span>{log.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {log.latencyMs} ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASISTENCIA A CLASES Y ÁREAS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'asistencia-clases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { area: 'Sala de Musculación y Pesas', capacity: '38 / 60 personas', status: 'Normal', instructor: 'Brenda Esquivel Pineda', icon: '🏋️‍♂️' },
            { area: 'Spinning & Ciclo Indoor', capacity: '18 / 25 bicicletas', status: 'Clase en Curso', instructor: 'Tania Méndez Barajas', icon: '🚴‍♀️' },
            { area: 'Cross Training & Funcional', capacity: '14 / 20 personas', status: 'Normal', instructor: 'Javier Domínguez Silva', icon: '⚡' },
            { area: 'Alberca Semiolímpica', capacity: '8 / 15 carriles', status: 'Supervisada', instructor: 'Adrián Cordero Sosa', icon: '🏊‍♂️' },
          ].map((zone, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{zone.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{zone.area}</h4>
                    <p className="text-xs text-slate-500">Coach: {zone.instructor}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {zone.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Ocupación Actual:</span>
                <span className="font-bold text-slate-900 font-mono">{zone.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
