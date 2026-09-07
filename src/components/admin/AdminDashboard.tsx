import React, { useState, useRef } from 'react';
import {
  Users,
  Camera,
  CreditCard,
  FileText,
  Briefcase,
  BarChart3,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Smartphone,
  Printer,
  Mail,
  Trash2,
  Edit2,
  Scan,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member, MembershipPlan, MembershipStatus, Employee, POSTransaction } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    addMember,
    updateMember,
    deleteMember,
    enrollBiometrics,
    products,
    transactions,
    recordSale,
    employees,
  } = useApp();

  // --- SUB-STATE FOR MEMBERS CRUD ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCurp, setFormCurp] = useState('');
  const [formPlan, setFormPlan] = useState<MembershipPlan>('Mensual Básica');
  const [formStatus, setFormStatus] = useState<MembershipStatus>('Activo');
  const [formEndDate, setFormEndDate] = useState('');
  const [formPhoto, setFormPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');

  // --- SUB-STATE FOR BIOMETRICS ENROLLMENT ---
  const [selectedMemberForBio, setSelectedMemberForBio] = useState<string>(members[0]?.id || '');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- SUB-STATE FOR POS & CART ---
  const [cart, setCart] = useState<{ productId: string; name: string; price: number; quantity: number }[]>([]);
  const [posMemberId, setPosMemberId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [lastCompletedTx, setLastCompletedTx] = useState<POSTransaction | null>(null);

  // --- SUB-STATE FOR EMPLOYEES ---
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('Todos');

  // --- SUB-STATE FOR RECEIPT VIEWER ---
  const [selectedReceipt, setSelectedReceipt] = useState<POSTransaction | null>(null);

  // ==========================================
  // HANDLERS FOR MEMBERS
  // ==========================================
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openNewMemberModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCurp('');
    setFormPlan('Mensual Básica');
    setFormStatus('Activo');
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setFormEndDate(d.toISOString().split('T')[0]);
    setFormPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250');
    setShowMemberModal(true);
  };

  const openEditMemberModal = (mem: Member) => {
    setEditingMember(mem);
    setFormName(mem.fullName);
    setFormEmail(mem.email);
    setFormPhone(mem.phone);
    setFormCurp(mem.curp);
    setFormPlan(mem.plan);
    setFormStatus(mem.status);
    setFormEndDate(mem.endDate);
    setFormPhoto(mem.photoUrl);
    setShowMemberModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingMember) {
      updateMember(editingMember.id, {
        fullName: formName,
        email: formEmail,
        phone: formPhone,
        curp: formCurp,
        plan: formPlan,
        status: formStatus,
        endDate: formEndDate,
        photoUrl: formPhoto,
      });
    } else {
      const start = new Date().toISOString().split('T')[0];
      const code = `MG-${String(members.length + 101).padStart(4, '0')}`;
      addMember({
        code,
        fullName: formName,
        email: formEmail,
        phone: formPhone,
        curp: formCurp,
        plan: formPlan,
        status: formStatus,
        startDate: start,
        endDate: formEndDate,
        photoUrl: formPhoto,
        biometricEnrolled: false,
        biometricFeaturesCount: 0,
        notes: 'Registro creado desde Recepción',
      });
    }
    setShowMemberModal(false);
  };

  // ==========================================
  // HANDLERS FOR BIOMETRIC ENROLLMENT
  // ==========================================
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Webcam permission not granted, using simulated high-def sensor feed.', err);
      setIsCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleTriggerEnroll = () => {
    if (!selectedMemberForBio) return;
    setIsCapturing(true);
    setScanProgress(15);
    setEnrollSuccess(false);

    // Simulate real vectorization timeline
    setTimeout(() => setScanProgress(45), 300);
    setTimeout(() => setScanProgress(80), 650);
    setTimeout(() => {
      setScanProgress(100);
      setIsCapturing(false);
      setEnrollSuccess(true);
      const chosenMember = members.find((m) => m.id === selectedMemberForBio);
      const finalPhoto = capturedImage || (chosenMember ? chosenMember.photoUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
      enrollBiometrics(selectedMemberForBio, finalPhoto);
      stopCamera();
    }, 1000);
  };

  // ==========================================
  // HANDLERS FOR POS
  // ==========================================
  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof cart
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTax = Number((cartTotal * 0.16).toFixed(2));
  const cartSubtotal = Number((cartTotal - cartTax).toFixed(2));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const member = members.find((m) => m.id === posMemberId);
    const memberName = member ? member.fullName : 'Cliente General / Mostrador';

    const newTx = recordSale({
      memberId: member ? member.id : undefined,
      memberName,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      cashierName: 'Beatriz Solano Morales',
    });

    setLastCompletedTx(newTx);
    setSelectedReceipt(newTx);
    setCart([]);
  };

  // ==========================================
  // EMPLOYEES FILTER
  // ==========================================
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(empSearch.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(empSearch.toLowerCase());
    const matchesDept = empDeptFilter === 'Todos' || emp.department === empDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Module Title & Context */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Módulo 1 • Gerencia y Recepción
            </span>
            <span className="text-xs text-slate-500 font-medium">Atención: Oscar Patiño</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Recepción y Administración General
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Control de socios, captura biométrica facial, punto de venta y corte de caja
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Módulo Activo</span>
            <span className="text-xs font-bold text-blue-700 capitalize">
              {activeTab === 'socios' && 'Gestión de Socios'}
              {activeTab === 'biometria' && 'Registro Facial'}
              {activeTab === 'pos' && 'Punto de Venta'}
              {activeTab === 'recibos' && 'Comprobantes'}
              {activeTab === 'empleados' && 'Plantilla de Personal'}
              {activeTab === 'reportes' && 'Reportes Financieros'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. GESTIÓN GENERAL DE SOCIOS (CRUD)                                       */}
      {/* ========================================================================= */}
      {activeTab === 'socios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, folio MG o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="Todos">Todos los estatus</option>
                <option value="Activo">Activos</option>
                <option value="Vencido">Vencidos</option>
                <option value="Suspendido">Suspendidos</option>
              </select>
            </div>

            <button
              onClick={openNewMemberModal}
              className="flex items-center justify-center gap-1.5 py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Socio</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Socio / Código</th>
                    <th className="py-3 px-4">Plan & Vigencia</th>
                    <th className="py-3 px-4">Estatus Cuota</th>
                    <th className="py-3 px-4">Biometría</th>
                    <th className="py-3 px-4">Visitas</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredMembers.map((member) => {
                    const isExp = member.status === 'Vencido';
                    const isSusp = member.status === 'Suspendido';

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{member.fullName}</div>
                              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                                <span>{member.code}</span>
                                <span>•</span>
                                <span>{member.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{member.plan}</div>
                          <div className="text-[11px] text-slate-500">
                            Vence: <span className="font-medium text-slate-700">{member.endDate}</span>{' '}
                            {member.daysRemaining >= 0 ? (
                              <span className="text-emerald-600 font-medium">({member.daysRemaining} días)</span>
                            ) : (
                              <span className="text-rose-600 font-bold">({Math.abs(member.daysRemaining)} días vencido)</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              member.status === 'Activo'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isExp
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {member.status === 'Activo' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {isExp && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                            {isSusp && <XCircle className="w-3 h-3 text-amber-600" />}
                            <span>{member.status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {member.biometricEnrolled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                              <Scan className="w-3 h-3 text-blue-600" />
                              <span>Enrolado (128-D)</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedMemberForBio(member.id);
                                setActiveTab('biometria');
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md hover:bg-amber-100 transition"
                            >
                              <Camera className="w-3 h-3 text-amber-600" />
                              <span>Pendiente enrolar</span>
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{member.totalVisits} ingresos</div>
                          <div className="text-[10px] text-slate-400">
                            Última: {member.lastVisit || 'Sin registro'}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isExp && (
                              <button
                                onClick={() => {
                                  // Quick renewal shortcut
                                  const nextMonth = new Date();
                                  nextMonth.setDate(nextMonth.getDate() + 30);
                                  updateMember(member.id, {
                                    status: 'Activo',
                                    endDate: nextMonth.toISOString().split('T')[0],
                                    daysRemaining: 30,
                                  });
                                }}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold shadow-xs transition"
                                title="Renovar cuota 30 días"
                              >
                                Renovar
                              </button>
                            )}

                            <button
                              onClick={() => openEditMemberModal(member)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                              title="Editar socio"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar al socio ${member.fullName}?`)) {
                                  deleteMember(member.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
      {/* 2. REGISTRO BIOMÉTRICO FACIAL (ENROLAMIENTO)                              */}
      {/* ========================================================================= */}
      {activeTab === 'biometria' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Member selector & Biometric details */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Captura en Recepción
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Enrolamiento Biométrico Facial (Face ID)
              </h3>
              <p className="text-xs text-slate-500">
                Captura fotográfica y extracción de vectores faciales para el sistema de reconocimiento en torniquetes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seleccionar Socio a Enrolar:
              </label>
              <select
                value={selectedMemberForBio}
                onChange={(e) => {
                  setSelectedMemberForBio(e.target.value);
                  setEnrollSuccess(false);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.code}) — {m.biometricEnrolled ? '✓ Enrolado' : '⚠ Pendiente'}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected member summary */}
            {(() => {
              const currentBioMember = members.find((m) => m.id === selectedMemberForBio);
              if (!currentBioMember) return null;
              return (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentBioMember.photoUrl}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{currentBioMember.fullName}</div>
                      <div className="text-slate-500 font-mono">{currentBioMember.code} • {currentBioMember.curp}</div>
                      <div className="text-[11px] font-semibold text-blue-700">{currentBioMember.plan}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-600">
                    <span>Estado Biométrico:</span>
                    <strong className={currentBioMember.biometricEnrolled ? 'text-emerald-700' : 'text-amber-700'}>
                      {currentBioMember.biometricEnrolled ? 'Registrado en Motor IA' : 'Sin Enrolamiento'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Vectores procesados:</span>
                    <strong className="font-mono text-slate-800">{currentBioMember.biometricFeaturesCount} puntos faciales</strong>
                  </div>
                </div>
              );
            })()}

            {enrollSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block">¡Rostro Enrolado con Éxito!</strong>
                  <span>El socio ya está autorizado para ingresar por los torniquetes biométricos.</span>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Live Camera / Capture interface */}
          <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono text-emerald-400">SENSOR ÓPTICO BIOMÉTRICO 1080P</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  ISO/IEC 19794-5
                </span>
              </div>

              {/* Viewport Frame */}
              <div className="relative w-full aspect-4/3 bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-700 flex items-center justify-center">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {(() => {
                      const m = members.find((x) => x.id === selectedMemberForBio);
                      return (
                        <img
                          src={m?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                          alt="Previsualización"
                          className="w-full h-full object-cover opacity-75"
                        />
                      );
                    })()}
                  </div>
                )}

                {/* Biometric Mesh Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-72 border-2 border-dashed border-blue-400/70 rounded-full relative flex items-center justify-center animate-pulse">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                    <div className="text-[10px] font-mono text-blue-300 bg-slate-900/80 px-2 py-0.5 rounded">
                      Centrar rostro en el óvalo
                    </div>
                  </div>
                </div>

                {/* Scan Laser bar when capturing */}
                {isCapturing && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce top-1/2" />
                )}
              </div>
            </div>

            {/* Progress bar during vectorization */}
            {isCapturing && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs font-mono text-cyan-300">
                  <span>Extrayendo 128 descriptores faciales...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
                  >
                    Activar Cámara Web
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="py-2 px-3 bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 text-xs font-medium rounded-lg transition"
                  >
                    Detener Cámara
                  </button>
                )}
              </div>

              <button
                disabled={isCapturing}
                onClick={handleTriggerEnroll}
                className="flex items-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{isCapturing ? 'Procesando...' : 'Capturar y Enrolar Rostro'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PUNTO DE VENTA Y COBROS (POS)                                          */}
      {/* ========================================================================= */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Products & Memberships Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Catálogo de Productos y Cuotas</h3>
                <p className="text-xs text-slate-500">Haz clic en cualquier concepto para agregarlo al ticket de cobro</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {products.length} Conceptos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {prod.category}
                      </span>
                      {prod.stock !== undefined && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          Stock: {prod.stock}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{prod.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                    <span className="text-sm font-extrabold text-blue-700">
                      ${prod.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <button className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POS Cart & Checkout */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">Caja y Cobro</h3>
                </div>
                <span className="text-xs text-slate-500">Cajera: Beatriz Solano</span>
              </div>

              {/* Select Member to charge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asociar Venta a Socio (Opcional):
                </label>
                <select
                  value={posMemberId}
                  onChange={(e) => setPosMemberId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                >
                  <option value="">Cliente Mostrador / Venta al público</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.code}) — {m.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cart items list */}
              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-52 overflow-y-auto space-y-2">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    El carrito está vacío. Selecciona artículos del catálogo.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200"
                    >
                      <div className="overflow-hidden flex-1">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-slate-500 font-mono text-[11px]">${item.price} c/u</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                          <button
                            onClick={() => updateCartQty(item.productId, -1)}
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.productId, 1)}
                            className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-slate-800 min-w-[50px] text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Método de Pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Efectivo', 'Tarjeta', 'Transferencia'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2 text-center text-xs font-semibold rounded-xl border transition ${
                        paymentMethod === method
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>IVA Trasladado (16%):</span>
                  <span className="font-mono">${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total a Pagar:</span>
                  <span className="font-mono text-base text-blue-700">${cartTotal.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>

            {/* Checkout Trigger */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Cobrar e Imprimir Comprobante</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. EMISIÓN DE COMPROBANTES (WHATSAPP, CORREO, IMPRESIÓN)                  */}
      {/* ========================================================================= */}
      {activeTab === 'recibos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Historial de Recibos y Comprobantes</h3>
              <p className="text-xs text-slate-500">Generación de recibos digitales vía WhatsApp, Correo o Impresos térmicos</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {transactions.length} Comprobantes Emitidos
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Folio Recibo</th>
                    <th className="py-3 px-4">Fecha y Hora</th>
                    <th className="py-3 px-4">Socio / Cliente</th>
                    <th className="py-3 px-4">Conceptos</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{tx.receiptNumber}</td>
                      <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{tx.memberName}</td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600 line-clamp-1 max-w-xs">
                          {tx.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                        ${tx.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceipt(tx)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-semibold text-xs transition"
                        >
                          Ver Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ADMINISTRACIÓN DE EMPLEADOS (PLANTILLA DE 25 COLABORADORES)             */}
      {/* ========================================================================= */}
      {activeTab === 'empleados' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">Plantilla de Personal Club MG</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {employees.length} Colaboradores
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gerencia, instructores, recepción, mantenimiento y cuerpo médico
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar colaborador o puesto..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
              <select
                value={empDeptFilter}
                onChange={(e) => setEmpDeptFilter(e.target.value)}
                className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="Todos">Todos los Deptos</option>
                <option value="Dirección">Dirección</option>
                <option value="Recepción">Recepción</option>
                <option value="Entrenamiento">Entrenamiento</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Médico/Nutrición">Médico/Nutrición</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {emp.employeeNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {emp.department}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">{emp.fullName}</h4>
                  <p className="text-xs font-semibold text-blue-600">{emp.role}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">CURP: {emp.curp}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Turno:</span>
                    <strong className="text-slate-800">{emp.shift}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificaciones STPS:</span>
                    <strong className="text-amber-700">{emp.stpsCertifications.length} vigentes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estándares CONOCER:</span>
                    <strong className="text-emerald-700">
                      {emp.conocerStandards.length > 0 ? emp.conocerStandards.join(', ') : 'En proceso'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REPORTES OPERATIVOS Y FINANCIEROS (CORTE DE CAJA)                      */}
      {/* ========================================================================= */}
      {activeTab === 'reportes' && (
        <div className="space-y-6">
          {/* Key Metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const totalIncome = transactions.reduce((acc, t) => acc + t.total, 0);
              const cashIncome = transactions.filter((t) => t.paymentMethod === 'Efectivo').reduce((acc, t) => acc + t.total, 0);
              const cardIncome = transactions.filter((t) => t.paymentMethod === 'Tarjeta').reduce((acc, t) => acc + t.total, 0);
              const transferIncome = transactions.filter((t) => t.paymentMethod === 'Transferencia').reduce((acc, t) => acc + t.total, 0);

              return (
                <>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Corte Total Diario</span>
                    <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                      ${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{transactions.length} transacciones liquidadas</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Cobro en Efectivo</span>
                    <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                      ${cashIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">En gaveta física de recepción</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Cobro Tarjeta (Terminal POS)</span>
                    <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">
                      ${cardIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Depósito bancario programado</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Transferencias SPEI</span>
                    <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                      ${transferIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Comprobante validado</span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Next Expirations alert section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Próximos Vencimientos de Cuota (Próximos 7 días)
                </h3>
              </div>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Acción Preventiva
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {members
                .filter((m) => m.daysRemaining <= 7 && m.daysRemaining >= -10)
                .map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={m.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{m.fullName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{m.code} • {m.plan}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={m.daysRemaining < 0 ? 'text-rose-600 font-bold' : 'text-amber-600 font-semibold'}>
                        {m.daysRemaining < 0 ? `Vencido hace ${Math.abs(m.daysRemaining)} días` : `Vence en ${m.daysRemaining} días`}
                      </span>

                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Estimado(a) ${m.fullName}, en Club MG le recordamos que su membresía (${m.plan}) vence el ${m.endDate}. Puede renovar en recepción o vía transferencia. ¡Gracias!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Aviso WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRO / EDICIÓN DE SOCIO                                        */}
      {/* ========================================================================= */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm sm:text-base">
                {editingMember ? 'Editar Datos del Socio' : 'Registrar Nuevo Socio en Recepción'}
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Juan Pérez González"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CURP:</label>
                  <input
                    type="text"
                    required
                    value={formCurp}
                    onChange={(e) => setFormCurp(e.target.value.toUpperCase())}
                    placeholder="18 caracteres"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="socio@correo.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono Móvil (WhatsApp):</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+52 55 ..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plan de Membresía:</label>
                  <select
                    value={formPlan}
                    onChange={(e) => setFormPlan(e.target.value as MembershipPlan)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden"
                  >
                    <option value="Mensual Básica">Mensual Básica ($850)</option>
                    <option value="Trimestral Pro">Trimestral Pro ($2,250)</option>
                    <option value="Anual VIP">Anual VIP ($7,800)</option>
                    <option value="Estudiante">Estudiante ($650)</option>
                    <option value="Pase Diario">Pase Diario ($150)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estatus Inicial:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as MembershipStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Fecha Límite de Pago / Vencimiento:</label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs transition"
                >
                  Guardar Socio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VISOR DE RECIBO DIGITAL / TICKET TÉRMICO                           */}
      {/* ========================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
            {/* Ticket Header */}
            <div className="bg-slate-900 text-white p-5 text-center relative">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <div className="text-xl font-black tracking-tight">CLUB MG</div>
              <div className="text-[10px] text-slate-300 font-mono tracking-widest mt-0.5 uppercase">
                Control de Acceso & Gimnasio
              </div>
              <div className="text-[10px] text-blue-300 font-mono mt-1">
                COMPROBANTE OFICIAL DE PAGO
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-5 space-y-3 text-xs text-slate-800 font-mono">
              <div className="border-b border-dashed border-slate-300 pb-2 text-[11px] space-y-0.5">
                <div>Folio: <strong>{selectedReceipt.receiptNumber}</strong></div>
                <div>Fecha: {selectedReceipt.date}</div>
                <div>Cliente: {selectedReceipt.memberName}</div>
                <div>Caja: {selectedReceipt.cashierName}</div>
              </div>

              {/* Items */}
              <div className="space-y-1 py-1">
                {selectedReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <span className="max-w-[180px]">{it.quantity}x {it.productName}</span>
                    <span className="font-bold">${it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-right">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Subtotal:</span>
                  <span>${selectedReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>IVA Trasladado (16%):</span>
                  <span>${selectedReceipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL PAGADO:</span>
                  <span>${selectedReceipt.total.toFixed(2)} MXN</span>
                </div>
                <div className="text-[10px] text-slate-500 text-left pt-1">
                  Método de pago: <strong>{selectedReceipt.paymentMethod}</strong>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                ¡Gracias por tu pago! Presenta tu rostro o QR dinámico en torniquetes.
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*CLUB MG - Comprobante de Pago*\nFolio: ${selectedReceipt.receiptNumber}\nCliente: ${selectedReceipt.memberName}\nTotal: $${selectedReceipt.total.toFixed(2)} MXN\nMétodo: ${selectedReceipt.paymentMethod}\nFecha: ${selectedReceipt.date}\n¡Gracias por tu preferencia!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
