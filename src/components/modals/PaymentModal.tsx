import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Building2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Receipt,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentItem, PatientProfile } from '../../types';

interface PaymentModalProps {
  payment: PaymentItem | null;
  patient: PatientProfile;
  onClose: () => void;
  onPaymentSuccess: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  payment,
  patient,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'insurance'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9842');
  const [cardHolder, setCardHolder] = useState(patient.name);
  const [expiry, setExpiry] = useState('09/28');
  const [cvv, setCvv] = useState('883');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!payment) return null;

  const originalAmount = payment.amount;
  const insuranceCover = selectedMethod === 'insurance' ? (originalAmount * 0.85) : (payment.insuranceDiscount || 45.00);
  const tax = ((originalAmount - insuranceCover) * 0.18);
  const finalTotal = Math.max(0, (originalAmount - insuranceCover) + tax);

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onPaymentSuccess(payment.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pasarela de Pago Seguro</h3>
              <p className="text-[11px] text-slate-300">Cifrado de 256 bits PCI-DSS Grado Médico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPaid ? (
          /* Payment Success Confirmation */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900">¡Pago Realizado con Éxito!</h3>
              <p className="text-xs text-slate-600 mt-1">
                Hemos enviado el comprobante electrónico (Factura #{payment.invoiceNumber}) a <span className="font-semibold text-slate-800">{patient.email}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Servicio médico:</span>
                <span className="font-bold text-slate-800">{payment.concept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Especialista:</span>
                <span className="font-medium text-slate-800">{payment.doctorName} ({payment.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Monto total abonado:</span>
                <span className="font-black text-emerald-600 text-sm">${finalTotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <span>Transacción ID:</span>
                <span>TXN-{Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Volver al Dashboard
            </button>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmitPayment} className="p-6 space-y-5">
            
            {/* Service Summary Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Factura #{payment.invoiceNumber}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{payment.concept}</h4>
                  <p className="text-xs text-slate-600">{payment.doctorName} • {payment.specialty}</p>
                </div>
                <p className="text-base font-black text-slate-900">${originalAmount.toFixed(2)}</p>
              </div>

              {/* Insurance co-pay discount */}
              <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tarifa médica base:</span>
                  <span>${originalAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Cobertura Sanitas Salud (85%):</span>
                  <span>-${insuranceCover.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Impuesto (IGV 18%):</span>
                  <span>+${tax.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                  <span>Copago Total a Pagar:</span>
                  <span className="text-blue-600">${finalTotal.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Selecciona Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('insurance')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'insurance'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs">Seguro Sanitas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('paypal')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">PayPal</span>
                </button>
              </div>
            </div>

            {/* Card Inputs */}
            {selectedMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Número de Tarjeta (Débito o Crédito)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">VISA</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">MC</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Fecha de Expiración
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/AA"
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Código de Seguridad (CVV)
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      required
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Titular de la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'insurance' && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Póliza Sanitas Verificada</span>
                </div>
                <p className="text-emerald-900">
                  Póliza: <span className="font-semibold">{patient.insurance.policyNumber}</span> ({patient.insurance.plan})
                </p>
                <p className="text-[11px] text-emerald-700">
                  El copago de <span className="font-bold">${finalTotal.toFixed(2)} USD</span> se cargará directamente a su deducible mensual aprobado.
                </p>
              </div>
            )}

            {selectedMethod === 'paypal' && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-center space-y-2">
                <p className="text-slate-700 font-medium">
                  Serás redirigido de forma segura a PayPal para autorizar el pago de <span className="font-bold text-slate-900">${finalTotal.toFixed(2)} USD</span>.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pago protegido y encriptado</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  id="submit-payment-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <span>Procesando pago...</span>
                  ) : (
                    <>
                      <span>Pagar ${finalTotal.toFixed(2)} USD</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
