import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/views/DashboardOverview';
import { ScheduleAppointmentView } from './components/views/ScheduleAppointmentView';
import { MyAppointmentsView } from './components/views/MyAppointmentsView';
import { DoctorsDirectoryView } from './components/views/DoctorsDirectoryView';
import { DigitalPrescriptionsView } from './components/views/DigitalPrescriptionsView';
import { VitalSignsView } from './components/views/VitalSignsView';
import { MedicalHistoryView } from './components/views/MedicalHistoryView';
import { PaymentsBillingView } from './components/views/PaymentsBillingView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { PrescriptionModal } from './components/modals/PrescriptionModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { TelehealthVideoRoomModal } from './components/modals/TelehealthVideoRoomModal';
import { RescheduleModal } from './components/modals/RescheduleModal';
import { CancelModal } from './components/modals/CancelModal';
import { DoctorProfileModal } from './components/modals/DoctorProfileModal';
import { MedicalRecordDetailModal } from './components/modals/MedicalRecordDetailModal';
import { SOSModal } from './components/modals/SOSModal';
import { AddVitalModal } from './components/modals/AddVitalModal';

// Mock Data
import { 
  mockPatient, 
  mockDoctors, 
  mockAppointments, 
  mockPrescriptions, 
  mockWeeklyVitals, 
  mockMonthlyVitals, 
  mockYearlyVitals, 
  mockMedicalHistory, 
  mockPayments,
  mockNotifications
} from './data/mockData';

import { 
  NavigationTab, 
  PatientProfile, 
  Doctor, 
  Appointment, 
  Prescription, 
  VitalSignDataPoint, 
  MedicalHistoryItem, 
  PaymentItem,
  AppNotification
} from './types';

export function App() {
  // Navigation & State
  const [activeTab, setActiveTab] = useState<NavigationTab>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [patient, setPatient] = useState<PatientProfile>(mockPatient);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [weeklyVitals, setWeeklyVitals] = useState<VitalSignDataPoint[]>(mockWeeklyVitals);
  const [monthlyVitals, setMonthlyVitals] = useState<VitalSignDataPoint[]>(mockMonthlyVitals);
  const [yearlyVitals, setYearlyVitals] = useState<VitalSignDataPoint[]>(mockYearlyVitals);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>(mockMedicalHistory);
  const [payments, setPayments] = useState<PaymentItem[]>(mockPayments);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  // Modals state
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [videoCallAppointment, setVideoCallAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [cancelAppointment, setCancelAppointment] = useState<Appointment | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState<MedicalHistoryItem | null>(null);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAddVitalOpen, setIsAddVitalOpen] = useState(false);
  const [preSelectedDoctorForBooking, setPreSelectedDoctorForBooking] = useState<Doctor | null>(null);

  // Actions
  const handleBookAppointmentFromDoctor = (doc: Doctor) => {
    setPreSelectedDoctorForBooking(doc);
    setActiveTab('agendar');
  };

  const handleAddNewAppointment = (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);
    // Also create corresponding payment item if fee > 0
    const newPay: PaymentItem = {
      id: newApt.paymentId || `pay-${Date.now()}`,
      appointmentId: newApt.id,
      concept: `Consulta ${newApt.modality === 'virtual' ? 'Virtual' : 'Presencial'}`,
      doctorName: newApt.doctorName,
      specialty: newApt.specialty,
      amount: newApt.fee * 0.15, // Copay
      currency: 'USD',
      date: newApt.date,
      status: 'pagado',
      method: 'tarjeta',
      methodLast4: '4242',
      invoiceNumber: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      tax: 3.24,
      insuranceDiscount: newApt.fee * 0.85,
      insuranceCoverage: '85% Sanitas Salud',
    };
    setPayments([newPay, ...payments]);
  };

  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          date: newDate,
          time: newTime,
          notes: `Reprogramada por el paciente para el ${newDate} a las ${newTime} hrs.`,
        };
      }
      return apt;
    }));
  };

  const handleConfirmCancel = (appointmentId: string, reason: string) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status: 'cancelada',
          notes: `Cancelada por el paciente. Motivo: ${reason}`,
        };
      }
      return apt;
    }));
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setPayments(payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'pagado',
          invoiceNumber: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        };
      }
      return p;
    }));
  };

  const handleAddNewVital = (data: Omit<VitalSignDataPoint, 'id'>) => {
    const newPoint: VitalSignDataPoint = {
      ...data,
      id: `v-${Date.now()}`,
    };
    setWeeklyVitals([...weeklyVitals, newPoint]);
    setMonthlyVitals([...monthlyVitals, newPoint]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const pendingPaymentsCount = payments.filter(p => p.status === 'pendiente').length;
  const upcomingAppointmentsCount = appointments.filter(a => a.status === 'confirmada').length;
  const activePrescriptionsCount = prescriptions.filter(p => p.status === 'activa' || p.status === 'por_vencer').length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        patient={patient}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        doctors={doctors}
        onSelectDoctorToBook={handleBookAppointmentFromDoctor}
        onOpenQuickBook={() => setActiveTab('agendar')}
        onToggleMobileSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileSidebarOpen={isSidebarOpen}
        onOpenSOSModal={() => setIsSOSOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          isMobileOpen={isSidebarOpen}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          onClose={() => setIsSidebarOpen(false)}
          patient={patient}
          upcomingCount={upcomingAppointmentsCount}
          activePrescriptionsCount={activePrescriptionsCount}
          pendingPaymentsCount={pendingPaymentsCount}
          onOpenSOSModal={() => setIsSOSOpen(true)}
          onOpenSOS={() => setIsSOSOpen(true)}
          onOpenLogoutModal={() => {
            if (window.confirm('¿Deseas cerrar tu sesión actual de MediConnect?')) {
              setActiveTab('inicio');
            }
          }}
        />

        {/* Dynamic Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {activeTab === 'inicio' && (
            <DashboardOverview
              patient={patient}
              appointments={appointments}
              doctors={doctors}
              prescriptions={prescriptions}
              weeklyVitals={weeklyVitals}
              monthlyVitals={monthlyVitals}
              yearlyVitals={yearlyVitals}
              medicalHistory={medicalHistory}
              payments={payments}
              setActiveTab={setActiveTab}
              onJoinVideoCall={(apt) => setVideoCallAppointment(apt)}
              onRescheduleAppointment={(apt) => setRescheduleAppointment(apt)}
              onCancelAppointment={(apt) => setCancelAppointment(apt)}
              onViewPrescription={(rx) => setSelectedPrescription(rx)}
              onPayBill={(pay) => setSelectedPayment(pay)}
              onViewMedicalRecord={(rec) => setMedicalRecordDetail(rec)}
              onSelectDoctorToBook={handleBookAppointmentFromDoctor}
              onOpenAddVitalModal={() => setIsAddVitalOpen(true)}
            />
          )}

          {activeTab === 'agendar' && (
            <ScheduleAppointmentView
              doctors={doctors}
              patient={patient}
              preSelectedDoctor={preSelectedDoctorForBooking}
              onAppointmentBooked={handleAddNewAppointment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'citas' && (
            <MyAppointmentsView
              appointments={appointments}
              setActiveTab={setActiveTab}
              onJoinVideoCall={(apt) => setVideoCallAppointment(apt)}
              onReschedule={(apt) => setRescheduleAppointment(apt)}
              onCancel={(apt) => setCancelAppointment(apt)}
            />
          )}

          {activeTab === 'medicos' && (
            <DoctorsDirectoryView
              doctors={doctors}
              onSelectDoctorToBook={handleBookAppointmentFromDoctor}
              onViewDoctorProfile={(doc) => setDoctorProfile(doc)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'recetas' && (
            <DigitalPrescriptionsView
              prescriptions={prescriptions}
              onViewPrescription={(rx) => setSelectedPrescription(rx)}
            />
          )}

          {activeTab === 'signos' && (
            <VitalSignsView
              weeklyVitals={weeklyVitals}
              monthlyVitals={monthlyVitals}
              yearlyVitals={yearlyVitals}
              onOpenAddVitalModal={() => setIsAddVitalOpen(true)}
            />
          )}

          {activeTab === 'historial' && (
            <MedicalHistoryView
              medicalHistory={medicalHistory}
              patient={patient}
              onViewRecordDetail={(rec) => setMedicalRecordDetail(rec)}
            />
          )}

          {activeTab === 'pagos' && (
            <PaymentsBillingView
              payments={payments}
              patient={patient}
              onPayBill={(pay) => setSelectedPayment(pay)}
            />
          )}

          {activeTab === 'configuracion' && (
            <SettingsView
              patient={patient}
              onUpdatePatient={(updated) => setPatient(updated)}
            />
          )}

        </main>
      </div>

      {/* Interactive Modals */}
      
      {/* 1. Digital Prescription Modal (Printable + QR) */}
      <PrescriptionModal
        prescription={selectedPrescription}
        patient={patient}
        onClose={() => setSelectedPrescription(null)}
      />

      {/* 2. Payment Checkout Modal */}
      <PaymentModal
        payment={selectedPayment}
        patient={patient}
        onClose={() => setSelectedPayment(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 3. Telehealth HD Video Room */}
      <TelehealthVideoRoomModal
        appointment={videoCallAppointment}
        patient={patient}
        onClose={() => setVideoCallAppointment(null)}
      />

      {/* 4. Reschedule Appointment Modal */}
      <RescheduleModal
        appointment={rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* 5. Cancel Appointment Modal */}
      <CancelModal
        appointment={cancelAppointment}
        onClose={() => setCancelAppointment(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* 6. Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={doctorProfile}
        onClose={() => setDoctorProfile(null)}
        onBookAppointment={handleBookAppointmentFromDoctor}
      />

      {/* 7. Medical Record Detail Modal */}
      <MedicalRecordDetailModal
        record={medicalRecordDetail}
        patient={patient}
        onClose={() => setMedicalRecordDetail(null)}
      />

      {/* 8. SOS Emergency Protocol Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        patient={patient}
      />

      {/* 9. Add Vital Sign Reading Modal */}
      <AddVitalModal
        isOpen={isAddVitalOpen}
        onClose={() => setIsAddVitalOpen(false)}
        onAddVital={handleAddNewVital}
      />

    </div>
  );
}

export default App;
