
import React, { useState } from 'react';
import { OPERATOR_NAME } from '../constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  price: number;
  onSuccess: () => void;
  isInternal?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, itemName, price, onSuccess, isInternal }) => {
  const [step, setStep] = useState<'SELECT' | 'METHOD_CHOICE' | 'PROCESS' | 'SUCCESS'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<'PAYONEER' | 'PAYPAL' | null>(null);

  if (!isOpen) return null;

  const handlePaymentStart = (method: 'PAYONEER' | 'PAYPAL') => {
    setSelectedMethod(method);
    setStep('PROCESS');
    
    // Simulacija bankarske transakcije
    // PayPal u ovom slučaju služi kao gateway, ali isplata ide na Payoneer kreatora
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('SELECT');
        setSelectedMethod(null);
      }, 2000);
    }, 2500);
  };

  const baksisAmount = price * 0.95;
  const platformFee = price * 0.05;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
        
        {step === 'SELECT' && (
          <div className="p-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2 text-left">Potvrda</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8 text-left">Ekskluzivna narudžbina</p>

            <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-8 border border-gray-100">
               <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 text-left">Sadržaj</div>
               <div className="text-sm font-bold text-gray-900 mb-6 text-left">{itemName}</div>
               
               <div className="space-y-3 pt-4 border-t border-gray-200">
                  {!isInternal ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kreatoru na Payoneer (95%)</span>
                        <span className="text-xs font-bold text-gray-900">€{baksisAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">bakšis.net provizija (5%)</span>
                        <span className="text-xs font-bold text-indigo-600">€{platformFee.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Interni Projekat (100%)</span>
                      <span className="text-xs font-bold text-gray-900">€{price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 mt-2 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">UKUPNO</span>
                    <span className="text-3xl font-black text-gray-950 tracking-tighter">€{price.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setStep('METHOD_CHOICE')}
              className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Nastavi na plaćanje
            </button>
            <button onClick={onClose} className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-500">Odustani</button>
          </div>
        )}

        {step === 'METHOD_CHOICE' && (
          <div className="p-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2 text-left">Metod</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-10 text-emerald-600 text-left">Svi prihodi se šalju na Payoneer</p>

            <div className="space-y-4">
              <button 
                onClick={() => handlePaymentStart('PAYONEER')}
                className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-between hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Payoneer_logo.svg/1200px-Payoneer_logo.svg.png" className="h-2.5 object-contain" alt="Payoneer" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-tight text-gray-900">Payoneer Card</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Direktna isplata</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>

              <button 
                onClick={() => handlePaymentStart('PAYPAL')}
                className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-between hover:border-[#003087] hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5 object-contain" alt="PayPal" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black uppercase tracking-tight text-gray-900">PayPal Gateway</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Isplata na Payoneer</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-[#003087]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="mt-8 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
               <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest leading-relaxed text-left">
                 💡 INFO: Kada platite putem PayPal-a, naš sistem automatski prebacuje €{baksisAmount.toFixed(2)} na Payoneer nalog kreatora, dok platforma zadržava €{platformFee.toFixed(2)}. Sigurnost: {OPERATOR_NAME}.
               </p>
            </div>

            <button onClick={() => setStep('SELECT')} className="w-full mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Nazad</button>
          </div>
        )}

        {step === 'PROCESS' && (
          <div className="p-20 text-center">
            <div className="relative w-24 h-24 mx-auto mb-10">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              {selectedMethod === 'PAYPAL' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="w-8 opacity-20" alt="" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2 text-center">Obrada...</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed text-center px-6">
              {selectedMethod === 'PAYPAL' 
                ? 'Priprema instant transfera na Payoneer nalog...' 
                : 'Autorizacija Payoneer transakcije...'}
            </p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2 text-center">Uplaćeno!</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 text-center">Sredstva su dostupna na Payoneer nalogu kreatora.</p>
            <div className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 py-3 rounded-xl border border-emerald-100">
               PODRŠKA POSLATA ✅
            </div>
          </div>
        )}
      </div>
    </div>
  );
};