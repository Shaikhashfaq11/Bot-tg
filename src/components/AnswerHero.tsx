import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Smartphone, 
  CreditCard, 
  Bot, 
  Radio, 
  Users, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AnswerHeroProps {
  onTestClick: () => void;
  onViewCode: () => void;
}

export const AnswerHero: React.FC<AnswerHeroProps> = ({ onTestClick, onViewCode }) => {
  return (
    <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative subtle background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Direct Jawāb Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Aapke Sawal Ka Direct Jawāb: Bilkul 100% Possible Hai!</span>
          </div>
          <a
            href="https://t.me/Seedhemout_coder_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Aapka Bot: @Seedhemout_coder_bot (Live Connected)</span>
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl text-balance">
          Telegram Course & Automated Payment Bot Architecture
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Haan! User aayega, course dekhega, amount display hoga, payment gateway (Razorpay/UPI) pe pay karega, 
          aur payment confirm hote hi bot usko <strong className="text-cyan-300 font-semibold">1-Time Single-Use Private Channel Invite Link</strong> aur <strong className="text-cyan-300 font-semibold">Course Materials</strong> turant deliver kar dega.
        </p>

        {/* Highlighted Value Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Zero Manual Work</h3>
                <p className="text-xs text-slate-400 mt-0.5">Payment confirm hote hi 2 second me auto-delivery hoti hai.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Anti-Piracy (Single Use)</h3>
                <p className="text-xs text-slate-400 mt-0.5"><code className="text-cyan-300 font-mono">member_limit: 1</code> se link koi aur join nahi kar sakta.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Indian & Global Gateways</h3>
                <p className="text-xs text-slate-400 mt-0.5">UPI, GPay, PhonePe, Paytm, Cards, NetBanking, ya Stripe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Visual Flow Chart */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">End-to-End Pipeline</span>
              <h2 className="text-xl font-bold text-white mt-1">Yeh Process Kaise Kaam Karta Hai (Step-by-Step)</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onTestClick}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                Simulator Me Test Karein
              </button>
              <button
                onClick={onViewCode}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                Ready Code Dekhein
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">1</span>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">User Telegram Bot Pe Aata Hai</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                User <code className="text-cyan-300 font-mono">/start</code> karta hai. Bot courses, syllabus aur price (jaise ₹999) show karta hai.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">2</span>
                <CreditCard className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">Payment Link Generate Hota Hai</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                User "Buy Now" pe click karta hai. Bot Razorpay API se unique link banata hai jisme <code className="text-cyan-300 font-mono">user_id</code> attached hoti hai.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">3</span>
                <Radio className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">User Gateway Pe Pay Karta Hai</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                User UPI (GPay/PhonePe), Paytm ya Card se pay karta hai aur wapas bot pe redirect hota hai.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">4</span>
                <Zap className="w-4 h-4 text-slate-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">Instant Webhook Server Pe Aata Hai</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Payment gateway instant <code className="text-cyan-300 font-mono">payment_link.paid</code> webhook bhejta hai with user metadata.
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">5</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-emerald-300">1-Time Channel Link & Files Delivery</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Bot Telegram API call karke <code className="text-emerald-300 font-mono">createChatInviteLink</code> banata hai aur user ko direct deliver karta hai.
              </p>
            </div>
          </div>

          {/* Golden Pro Tip Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold">Sabse Important Security Rule (Anti-Leak):</strong>{' '}
              Normal invite link share karne par log dosto ko link forward kar dete hain. Lekin jab bot Telegram API method{' '}
              <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">createChatInviteLink(channel_id, &#123; member_limit: 1, expire_date: ... &#125;)</code>{' '}
              use karta hai, toh woh link sirf wahi 1 buyer use kar sakta hai. Ek baar click karke join karne ke baad woh link turant expire ho jati hai!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
