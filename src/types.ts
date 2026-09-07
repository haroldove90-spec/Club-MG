export type UserRole = 'admin' | 'instructor' | 'member' | 'compliance';

export type MembershipStatus = 'Activo' | 'Vencido' | 'Suspendido';

export type MembershipPlan = 'Mensual Básica' | 'Trimestral Pro' | 'Anual VIP' | 'Estudiante' | 'Pase Diario';

export interface Member {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  curp: string;
  plan: MembershipPlan;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  photoUrl: string;
  biometricEnrolled: boolean;
  biometricFeaturesCount: number;
  lastVisit?: string;
  totalVisits: number;
  notes?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  fullName: string;
  role: string;
  department: 'Dirección' | 'Recepción' | 'Entrenamiento' | 'Mantenimiento' | 'Médico/Nutrición';
  shift: 'Matutino' | 'Vespertino' | 'Mixto';
  email: string;
  phone: string;
  curp: string;
  status: 'Activo' | 'Vacaciones' | 'Inactivo';
  stpsCertifications: string[];
  conocerStandards: string[];
  hireDate: string;
}

export interface ProductOrService {
  id: string;
  name: string;
  category: 'Membresía' | 'Suplemento' | 'Accesorio' | 'Bebida' | 'Servicio';
  price: number;
  stock?: number;
  description: string;
}

export interface POSTransaction {
  id: string;
  receiptNumber: string;
  memberId?: string;
  memberName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  date: string;
  cashierName: string;
  status: 'Completado' | 'Cancelado';
}

export interface AccessLog {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  photoUrl: string;
  method: 'Face ID' | 'QR Dinámico' | 'Manual Recepción';
  status: 'Acceso Concedido' | 'Acceso Denegado';
  reason?: string;
  turnstileId: string;
  latencyMs: number;
}

export interface STPSCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  curp: string;
  courseName: string;
  areaThematic: string;
  durationHours: number;
  instructorName: string;
  registrationSTPS: string;
  issueDate: string;
  validUntil: string;
  score: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  read: boolean;
}
