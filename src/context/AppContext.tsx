import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Member,
  Employee,
  ProductOrService,
  POSTransaction,
  AccessLog,
  STPSCertificate,
  NotificationItem
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_EMPLOYEES,
  PRODUCTS_CATALOG,
  INITIAL_TRANSACTIONS,
  INITIAL_ACCESS_LOGS,
  INITIAL_STPS_CERTIFICATES,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface AppContextType {
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  members: Member[];
  employees: Employee[];
  products: ProductOrService[];
  transactions: POSTransaction[];
  accessLogs: AccessLog[];
  stpsCertificates: STPSCertificate[];
  notifications: NotificationItem[];
  
  // Active member (for Alumno/Socio portal)
  currentMemberId: string;
  setCurrentMemberId: (id: string) => void;
  currentMember: Member | undefined;

  // Turnstile state
  turnstileUnlocked: boolean;
  lastTurnstileResult: AccessLog | null;

  // Actions
  addMember: (member: Omit<Member, 'id' | 'daysRemaining' | 'totalVisits'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  enrollBiometrics: (id: string, photoDataUrl: string) => void;
  recordSale: (tx: Omit<POSTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>) => POSTransaction;
  verifyAccess: (memberId: string, method: 'Face ID' | 'QR Dinámico' | 'Manual Recepción') => AccessLog;
  triggerRelayPulse: () => void;
  addSTPSCertificate: (cert: Omit<STPSCertificate, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'club_mg_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('club_mg_role');
    return (saved as UserRole) || null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [products] = useState<ProductOrService[]>(PRODUCTS_CATALOG);

  const [transactions, setTransactions] = useState<POSTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tx`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_LOGS;
  });

  const [stpsCertificates, setStpsCertificates] = useState<STPSCertificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stps`);
    return saved ? JSON.parse(saved) : INITIAL_STPS_CERTIFICATES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentMemberId, setCurrentMemberId] = useState<string>('mem-001');
  const [turnstileUnlocked, setTurnstileUnlocked] = useState<boolean>(false);
  const [lastTurnstileResult, setLastTurnstileResult] = useState<AccessLog | null>(null);

  // Sync to storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tx`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(accessLogs));
  }, [accessLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stps`, JSON.stringify(stpsCertificates));
  }, [stpsCertificates]);

  const setActiveRole = (role: UserRole | null) => {
    setActiveRoleState(role);
    if (role) {
      localStorage.setItem('club_mg_role', role);
      // Default initial tabs for each role
      if (role === 'admin') setActiveTab('socios');
      else if (role === 'instructor') setActiveTab('acceso-vivo');
      else if (role === 'member') setActiveTab('credencial');
      else if (role === 'compliance') setActiveTab('dc3');
    } else {
      localStorage.removeItem('club_mg_role');
      setActiveTab('dashboard');
    }
  };

  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];

  const addMember = (newMemData: Omit<Member, 'id' | 'daysRemaining' | 'totalVisits'>) => {
    const start = new Date(newMemData.startDate);
    const end = new Date(newMemData.endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const newMember: Member = {
      ...newMemData,
      id: `mem-${Date.now()}`,
      daysRemaining,
      totalVisits: 0,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (updates.endDate) {
            const end = new Date(updates.endDate);
            const now = new Date();
            const diffTime = end.getTime() - now.getTime();
            updated.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const enrollBiometrics = (id: string, photoDataUrl: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            photoUrl: photoDataUrl,
            biometricEnrolled: true,
            biometricFeaturesCount: 128,
          };
        }
        return m;
      })
    );
  };

  const recordSale = (txData: Omit<POSTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>): POSTransaction => {
    const count = transactions.length + 1;
    const pad = String(count).padStart(4, '0');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTx: POSTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      receiptNumber: `REC-2025-${pad}`,
      date: dateStr,
      status: 'Completado',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If a membership product was bought for a member, update member's validity
    if (txData.memberId) {
      const isMembership = txData.items.some((it) => it.productName.includes('Membresía'));
      if (isMembership) {
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];
        updateMember(txData.memberId, {
          status: 'Activo',
          endDate: nextMonthStr,
          daysRemaining: 30,
        });
      }
    }

    return newTx;
  };

  const triggerRelayPulse = () => {
    setTurnstileUnlocked(true);
    setTimeout(() => {
      setTurnstileUnlocked(false);
    }, 4000);
  };

  const verifyAccess = (memberId: string, method: 'Face ID' | 'QR Dinámico' | 'Manual Recepción'): AccessLog => {
    const member = members.find((m) => m.id === memberId);
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let status: 'Acceso Concedido' | 'Acceso Denegado' = 'Acceso Concedido';
    let reason: string | undefined = undefined;

    if (!member) {
      status = 'Acceso Denegado';
      reason = 'Usuario no registrado en base de datos Club MG.';
    } else if (member.status === 'Vencido') {
      status = 'Acceso Denegado';
      reason = `Cuota Vencida (${member.daysRemaining} días). Favor de pasar a Recepción para regularización.`;
    } else if (member.status === 'Suspendido') {
      status = 'Acceso Denegado';
      reason = 'Membresía Suspendida temporalmente por administración médica/operativa.';
    } else if (method === 'Face ID' && !member.biometricEnrolled) {
      status = 'Acceso Denegado';
      reason = 'Rostro no enrolado en base biométrica. Utilice credencial QR en torniquete 02.';
    }

    const log: AccessLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      memberId: member ? member.id : 'unknown',
      memberName: member ? member.fullName : 'Usuario Desconocido',
      photoUrl: member ? member.photoUrl : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      method,
      status,
      reason,
      turnstileId: method === 'QR Dinámico' ? 'Torniquete 02 (Escáner QR)' : 'Torniquete Principal 01 (Entrada)',
      latencyMs: Math.floor(Math.random() * 150) + 280,
    };

    setAccessLogs((prev) => [log, ...prev]);
    setLastTurnstileResult(log);

    if (status === 'Acceso Concedido') {
      triggerRelayPulse();
      if (member) {
        updateMember(member.id, {
          totalVisits: (member.totalVisits || 0) + 1,
          lastVisit: timeStr,
        });
      }
    }

    return log;
  };

  const addSTPSCertificate = (cert: Omit<STPSCertificate, 'id'>) => {
    const newCert: STPSCertificate = {
      ...cert,
      id: `dc3-${Date.now()}`,
    };
    setStpsCertificates((prev) => [newCert, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetToDefaults = () => {
    setMembers(INITIAL_MEMBERS);
    setEmployees(INITIAL_EMPLOYEES);
    setTransactions(INITIAL_TRANSACTIONS);
    setAccessLogs(INITIAL_ACCESS_LOGS);
    setStpsCertificates(INITIAL_STPS_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(`${STORAGE_KEY}_members`);
    localStorage.removeItem(`${STORAGE_KEY}_employees`);
    localStorage.removeItem(`${STORAGE_KEY}_tx`);
    localStorage.removeItem(`${STORAGE_KEY}_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_stps`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        members,
        employees,
        products,
        transactions,
        accessLogs,
        stpsCertificates,
        notifications,
        currentMemberId,
        setCurrentMemberId,
        currentMember,
        turnstileUnlocked,
        lastTurnstileResult,
        addMember,
        updateMember,
        deleteMember,
        enrollBiometrics,
        recordSale,
        verifyAccess,
        triggerRelayPulse,
        addSTPSCertificate,
        markNotificationRead,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
