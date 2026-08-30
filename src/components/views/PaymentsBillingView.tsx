import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  Calendar, 
  Receipt, 
  FileText, 
  DollarSign, 
  ArrowUpRight
} from 'lucide-react';
import { PaymentItem, PatientProfile } from '../../types';

interface PaymentsBillingViewProps {
  payments: PaymentItem[];
  patient: PatientProfile;
  onPayBill: (payment: PaymentItem) => void;
}

export const PaymentsBillingView: React.FC<PaymentsBillingViewProps> = ({
  payments,
  patient,
  onPayBill,
}) => {
  const [filter, setFilter] = useState<'todos' | 'pagados' | 'pendientes'>('todos');

  const filteredPayments = payments.filter(p => {
    if (filter === 'pagados') return p.status === 'pagado';
    if (filter === 'pendientes') return p.status === 'pendiente';
    return true;
  });

  const totalSpent = payments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pagos, Facturación & Coberturas</h2>
          <p className="text-xs text-slate-600 mt-0.5">Historial de transacciones, copagos de seguro y descarga de facturas electrónicas.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
            Pasarela Segura Cifrada SSL 256-bit
          </span>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Abonado (2026)</span>
          <p className="text-2xl font-black text-slate-900 mt-1">${totalSpent.toFixed(2)} USD</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Con cobertura de seguro activa</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Saldos Pendientes</span>
          <p className="text-2xl font-black text-rose-600 mt-1">${pendingAmount.toFixed(2)} USD</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {pendingAmount > 0 ? '1 consulta pendiente de abono' : 'Todos tus pagos al día'}
          </p>
        </div>

        <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-blue-200">Seguro Primario</span>
            <p className="text-base font-bold mt-0.5">{patient.insurance.provider}</p>
            <p className="text-[11px] text-blue-100">Póliza: {patient.insurance.policyNumber}</p>
          </div>
          <div className="pt-2 flex justify-between items-center text-xs">
            <span>Copago habitual: 15%</span>
            <span className="font-bold text-teal-300">Vigente</span>
          </div>
        </div>

      </div>

      {/* Saved Payment Methods & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900">Historial de Transacciones</h3>
            
            {/* Filter */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs">
              {(['todos', 'pagados', 'pendientes'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    filter === f ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-slate-100">
            {filteredPayments.map((pay) => (
              <div key={pay.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    pay.status === 'pagado' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{pay.concept}</h4>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        pay.status === 'pagado' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pay.status === 'pagado' ? 'Abonado' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Médico: {pay.doctorName} • {pay.specialty}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Fecha: {pay.date} • Método: {pay.method === 'tarjeta' ? `Tarjeta (*${pay.methodLast4 || '4242'})` : pay.method.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <p className="text-base font-black text-slate-900">${pay.amount.toFixed(2)} USD</p>
                    {pay.insuranceCoverage && (
                      <p className="text-[10px] text-emerald-700 font-semibold">{pay.insuranceCoverage} cubierto</p>
                    )}
                  </div>

                  {pay.status === 'pendiente' ? (
                    <button
                      onClick={() => onPayBill(pay)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Pagar Ahora
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Descargando comprobante fiscal PDF de pago: ${pay.invoiceNumber || pay.id}`)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Descargar Comprobante"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Saved Payment Methods */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Métodos de Pago Guardados</h3>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </div>

            {/* Credit card item */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Tarjeta de Crédito</span>
                <span className="font-bold text-white uppercase tracking-wider">VISA</span>
              </div>
              <p className="font-mono text-base tracking-widest">•••• •••• •••• 4242</p>
              <div className="flex justify-between items-center text-[10px] text-slate-300">
                <span>Vence: 08/29</span>
                <span>{patient.name}</span>
              </div>
            </div>

            <button
              onClick={() => alert('Abrir modal de registro de nueva tarjeta')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Método</span>
            </button>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía de Satisfacción Médica</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Si tu teleconsulta sufre interrupciones técnicas o necesitas reagendar con más de 2 horas de anticipación, tu saldo queda 100% protegido.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
