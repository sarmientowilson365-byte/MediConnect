export type Modality = 'virtual' | 'presencial';
export type AppointmentStatus = 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
export type PrescriptionStatus = 'activa' | 'por_vencer' | 'vencida';
export type PaymentStatus = 'pagado' | 'pendiente' | 'reembolsado';
export type PaymentMethod = 'tarjeta' | 'paypal' | 'transferencia' | 'seguro';
export type VitalType = 'presion' | 'cardiaco' | 'glucosa' | 'peso' | 'spo2' | 'temperatura';
export type TimeFilter = 'semana' | 'mes' | 'ano';

export type NavigationTab = 
  | 'inicio' 
  | 'agendar' 
  | 'citas' 
  | 'medicos' 
  | 'recetas' 
  | 'historial' 
  | 'signos' 
  | 'pagos' 
  | 'configuracion';

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  avatarUrl?: string;
  address?: string;
  age: number;
  gender: string;
  birthDate: string;
  bloodType: string;
  documentId: string;
  insurance: {
    provider: string;
    policyNumber: string;
    status: 'activa' | 'vencida';
    plan: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  heightCm: number;
  weightKg: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  title: string;
  licenseNumber: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  photoUrl: string;
  consultationFee: number;
  availableDays: string[];
  nextAvailableSlot: string;
  modalities: Modality[];
  bio: string;
  education: string;
  hospital: string;
  languages: string[];
  availableHours: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  doctorPhoto: string;
  licenseNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  modality: Modality;
  status: AppointmentStatus;
  location?: string;
  meetingUrl?: string;
  consultationReason: string;
  symptoms?: string[];
  fee: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  prescriptionId?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string;
  emissionDate: string;
  expirationDate: string;
  status: PrescriptionStatus;
  qrCodeUrl: string;
  diagnosis: string;
  refillsAllowed: number;
  refillsLeft: number;
  pharmacyNote?: string;
}

export interface VitalSignDataPoint {
  id: string;
  date: string;
  formattedDate: string;
  systolicBP: number;   // mmHg
  diastolicBP: number;  // mmHg
  heartRate: number;    // bpm
  glucose: number;      // mg/dL
  weight: number;       // kg
  spo2: number;         // %
  temperature: number;  // °C
  notes?: string;
}

export interface MedicalHistoryItem {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  doctorPhoto: string;
  modality: Modality;
  diagnosis: string;
  cie10Code?: string;
  treatment: string;
  clinicalNotes: string;
  vitalSummary: string;
  prescriptionGiven?: string;
  attachments?: {
    name: string;
    type: 'pdf' | 'img' | 'lab';
    size: string;
    url?: string;
  }[];
}

export interface PaymentItem {
  id: string;
  appointmentId?: string;
  concept: string;
  doctorName: string;
  specialty: string;
  amount: number;
  currency: string;
  date: string;
  status: PaymentStatus;
  method: PaymentMethod;
  methodLast4?: string;
  invoiceNumber: string;
  tax: number;
  insuranceDiscount?: number;
  insuranceCoverage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'cita' | 'receta' | 'pago' | 'recordatorio' | 'sistema';
  timestamp: string;
  read: boolean;
  targetTab?: NavigationTab;
  actionId?: string;
}
