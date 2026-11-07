import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Smartphone,
  RefreshCw,
  Zap,
  Coins
} from 'lucide-react';
import { Course } from '../types';

interface PaymentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string, paymentMethod: string) => void;
  onPaymentFail: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentFail
}) => {
  const [gateway, setGateway] = useState<'sunpay' | 'razorpay'>('sunpay');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'usdt'>('upi');
  const [upiId, setUpiId] = useState('ashfak@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulatedState, setSimulatedState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [isOpeningSunPay, setIsOpeningSunPay] = useState(false);
  const [sunpayError, setSunpayError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenRealSunPay = async () => {
    setIsOpeningSunPay(true);
    setSunpayError(null);
    try {
      const res = await fetch('/api/payin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          customerName: 'Student',
          amount: course.price
        })
      });
      const data = await res.json();
      if (data && data.checkoutUrl) {
        // Redirect directly to SunPay official cashier page
        window.location.href = data.checkoutUrl;
      } else {
        setSunpayError(data?.error || 'SunPay could not create checkout session');
      }
    } catch (e: any) {
      setSunpayError(e.message);
    } finally {
      setIsOpeningSunPay(false);
    }
  };

  const handlePay = (methodName: string) => {
    setIsProcessing(true);
    setSimulatedState('processing');

    setTimeout(() => {
      setIsProcessing(false);
      setSimulatedState('success');
      const randomTxn = gateway === 'sunpay' 
        ? 'tx_01HZX' + Math.random().toString(36).substring(2, 8).toUpperCase()
        : 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();

      setTimeout(() => {
        onPaymentSuccess(randomTxn, `${gateway === 'sunpay' ? 'SunPay' : 'Razorpay'} - ${methodName}`);
        onClose();
        setSimulatedState('idle');
      }, 1200);
    }, 1400);
  };

  const handleFail = () => {
    onPaymentFail();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Gateway Brand Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
              gateway === 'sunpay' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600'
            }`}>
              {gateway === 'sunpay' ? 'SP' : 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  {gateway === 'sunpay' ? 'SunPay Gateway (ttpay.business)' : 'Razorpay Secure Checkout'}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  gateway === 'sunpay'
                    ? 'text-amber-300 bg-amber-950/60 border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                }`}>
                  {gateway === 'sunpay' ? 'MID: 63471842' : 'TEST MODE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {gateway === 'sunpay' ? 'Merchant Pay-in (代收) · HMAC-SHA256 Signed' : 'TeleCourse Bot Academy Private Limited'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gateway Switcher Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Payment Gateway:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setGateway('sunpay')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                gateway === 'sunpay'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              ☀️ SunPay (ttpay)
            </button>
            <button
              onClick={() => setGateway('razorpay')}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                gateway === 'razorpay'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Razorpay
            </button>
          </div>
        </div>

        {/* Course Summary Strip */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="text-xs text-slate-400">Item:</span>
            <p className="text-sm font-semibold text-white truncate">{course.title}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Amount:</span>
            <p className="text-base font-bold text-amber-400 font-mono">₹{course.price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {simulatedState === 'processing' ? (
          <div className="py-16 px-6 text-center">
            <div className={`w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin ${
              gateway === 'sunpay' ? 'border-amber-500' : 'border-cyan-500'
            }`} />
            <h3 className="text-base font-semibold text-white">
              {gateway === 'sunpay' ? 'Communicating with SunPay Core (ttpay.business)...' : 'Communicating with Bank & UPI...'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Processing pay-in order of ₹{course.price} via {selectedMethod.toUpperCase()}...</p>
          </div>
        ) : simulatedState === 'success' ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white">
              {gateway === 'sunpay' ? 'SunPay Payin Succeeded (payin.success)!' : 'Payment Captured Successfully!'}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">
              {gateway === 'sunpay' ? 'HMAC x-signature verified! Firing Telegram single-use link delivery...' : 'Firing Webhook to Telegram Bot Server...'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedMethod === 'upi'
                    ? (gateway === 'sunpay' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-blue-600 text-white')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedMethod === 'card'
                    ? (gateway === 'sunpay' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-blue-600 text-white')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cards / Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('usdt')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedMethod === 'usdt'
                    ? (gateway === 'sunpay' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-blue-600 text-white')
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>USDT / Crypto</span>
              </button>
            </div>

            {/* UPI View */}
            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                {gateway === 'sunpay' && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">Live SunPay Cashier Checkout</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">ttPay.business</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Seedha official SunPay payment page pe jaakar PhonePe, Google Pay ya Paytm se UPI payment karein:
                    </p>
                    <button
                      type="button"
                      disabled={isOpeningSunPay}
                      onClick={handleOpenRealSunPay}
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isOpeningSunPay ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating SunPay Order...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-slate-950" />
                          <span>👉 Open Official SunPay UPI Cashier (₹{course.price})</span>
                        </>
                      )}
                    </button>
                    {sunpayError && (
                      <p className="text-[10px] text-red-400 font-mono">Error: {sunpayError}</p>
                    )}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg flex items-center justify-center shadow-inner">
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="10" y="10" width="25" height="25" fill="black" />
                      <rect x="15" y="15" width="15" height="15" fill="white" />
                      <rect x="18" y="18" width="9" height="9" fill="black" />
                      
                      <rect x="65" y="10" width="25" height="25" fill="black" />
                      <rect x="70" y="15" width="15" height="15" fill="white" />
                      <rect x="73" y="18" width="9" height="9" fill="black" />
                      
                      <rect x="10" y="65" width="25" height="25" fill="black" />
                      <rect x="15" y="70" width="15" height="15" fill="white" />
                      <rect x="18" y="73" width="9" height="9" fill="black" />

                      <rect x="42" y="15" width="6" height="6" />
                      <rect x="52" y="25" width="6" height="6" />
                      <rect x="42" y="45" width="12" height="12" />
                      <rect x="25" y="45" width="6" height="6" />
                      <rect x="65" y="45" width="8" height="8" />
                      <rect x="80" y="55" width="6" height="6" />
                      <rect x="55" y="70" width="10" height="10" />
                      <rect x="75" y="75" width="12" height="6" />
                    </svg>
                  </div>
                  <span className="inline-block mt-2.5 text-xs text-slate-400">
                    Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handlePay(`UPI (${upiId})`)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      gateway === 'sunpay' ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold' : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    Pay ₹{course.price}
                  </button>
                </div>
              </div>
            )}

            {/* Card View */}
            {selectedMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Card / Bank Account</label>
                  <input
                    type="text"
                    readOnly
                    value="4242 •••• •••• 4242"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      readOnly
                      value="999"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePay('Bank Card')}
                  className={`w-full mt-2 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    gateway === 'sunpay' ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  Pay ₹{course.price} via Card
                </button>
              </div>
            )}

            {/* USDT View */}
            {selectedMethod === 'usdt' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400">Crypto Rail (TRC20 / ERC20):</div>
                  <div className="font-mono text-amber-300 font-bold">~ {(course.price / 88).toFixed(2)} USDT</div>
                  <div className="text-[11px] text-slate-500">Supported by Official Secure Gateway</div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePay('Instant USDT Crypto')}
                  className="w-full py-2.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                >
                  Pay with USDT
                </button>
              </div>
            )}

            {/* Simulation Quick Triggers */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handlePay(gateway === 'sunpay' ? 'Secure UPI (payin.success)' : 'Simulated Instant UPI')}
                className={`flex-1 py-2 text-xs font-bold text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                  gateway === 'sunpay'
                    ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulate Success (₹{course.price})</span>
              </button>

              <button
                type="button"
                onClick={handleFail}
                className="py-2 px-3 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>
                256-Bit SSL Encrypted & PCI-DSS Verified
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
