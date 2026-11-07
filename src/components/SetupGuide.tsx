import React from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Key, 
  Lock, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  CreditCard,
  Hash,
  EyeOff
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Step-by-Step Practical Blueprint</span>
        </div>
        <h2 className="text-2xl font-bold text-white mt-1">Bot & Channel Banane Ka Pura Tarika</h2>
        <p className="text-sm text-slate-400 mt-1">
          Aapko shuru se lekar live hone tak kya-kya karna hoga, sabhi steps yahan aasan Hindi me diye gaye hain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: BotFather */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-xs font-mono text-slate-500">Telegram App</span>
          </div>
          <h3 className="text-lg font-bold text-white">BotFather Se Bot Banayein & Token Lein</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Telegram me <code className="text-cyan-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">@BotFather</code> search karein aur start karein.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li>Type karein: <code className="text-slate-200 font-mono">/newbot</code></li>
            <li>Bot ka display name daalein (jaise: <em>My Academy Official</em>)</li>
            <li>Bot ka unique username daalein jiske aakhri me <code className="text-slate-200 font-mono">bot</code> ho (jaise: <em>my_course_bot</em>)</li>
            <li>BotFather aapko ek <strong>HTTP API Token</strong> dega (jaise: <code className="text-cyan-300 font-mono">71829...:AAHk...</code>). Ise copy karke sambhal lein.</li>
          </ul>
        </div>

        {/* Step 2: Private Channel Setup */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">2</span>
            <span className="text-xs font-mono text-slate-500">Channel Security</span>
          </div>
          <h3 className="text-lg font-bold text-white">Private Channel Banayein & Bot Ko Admin Banayein</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Telegram me ek naya Channel banayein aur type ko <strong>Private</strong> rakhein.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li>Channel Settings me jayein &gt; <strong>Administrators</strong> &gt; <strong>Add Admin</strong></li>
            <li>Apne banaye huye Bot ke username ko search karke Admin add karein</li>
            <li><strong className="text-emerald-400">Sabse Jaruri:</strong> Bot ki permissions me <strong>"Invite Users via Link"</strong> permission ko ON rakhein! Iske bina bot single-use invite link generate nahi kar payega.</li>
          </ul>
        </div>

        {/* Step 3: Find Channel ID */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">3</span>
            <span className="text-xs font-mono text-slate-500">ID Lookup</span>
          </div>
          <h3 className="text-lg font-bold text-white">Private Channel Ka ID Kaise Nikalein?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Telegram me private channels ka ID aam taur par <code className="text-cyan-300 font-mono">-100</code> se shuru hota hai (jaise: <code className="text-slate-200 font-mono">-1001928374829</code>).
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li>Apne private channel se koi bhi message <code className="text-slate-200 font-mono">@username_to_id_bot</code> ya <code className="text-slate-200 font-mono">@getidsbot</code> ko forward karein.</li>
            <li>Bot aapko channel ka numeric ID bata dega (e.g. <code className="text-cyan-300 font-mono">-100xxxxxxxxxx</code>).</li>
            <li>Ise apne code ke <code className="text-slate-200 font-mono">CHANNEL_ID</code> variable me daalein.</li>
          </ul>
        </div>

        {/* Step 4: Razorpay Webhook */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">4</span>
            <span className="text-xs font-mono text-slate-500">Payment Gateway</span>
          </div>
          <h3 className="text-lg font-bold text-white">Razorpay / UPI Payment Gateway Setup</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Razorpay Dashboard me jakar API Key aur Webhook set karein:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
            <li><strong>Settings &gt; API Keys:</strong> Yahan se <code className="text-slate-200 font-mono">Key Id</code> aur <code className="text-slate-200 font-mono">Key Secret</code> copy karein.</li>
            <li><strong>Settings &gt; Webhooks:</strong> Add New Webhook karein.</li>
            <li>Webhook URL me apne backend server ka endpoint daalein: <code className="text-cyan-300 font-mono">https://your-server.com/api/webhook/razorpay</code></li>
            <li>Events me select karein: <code className="text-emerald-300 font-mono">payment_link.paid</code> aur <code className="text-emerald-300 font-mono">payment.captured</code></li>
            <li>Ek strong Secret daalein aur wahi Secret backend ke <code className="text-slate-200 font-mono">RAZORPAY_WEBHOOK_SECRET</code> me set karein.</li>
          </ul>
        </div>
      </div>

      {/* Security Best Practices & Piracy Prevention */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Course & Channel Content Leak Hone Se Kaise Bachayein?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="text-xs font-bold text-cyan-300">1. member_limit: 1</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bot jo invite link banayega usme <code className="text-slate-200 font-mono">member_limit: 1</code> set rehta hai. Yani sirf wahi buyer ek baar join kar sakta hai.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="text-xs font-bold text-cyan-300">2. Restrict Saving Content</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Telegram Channel Settings &gt; Channel Type me <strong>"Restrict saving content"</strong> ON karein. Isse koi bhi video download ya forward nahi kar payega!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="text-xs font-bold text-cyan-300">3. Time Expiration</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Link me 24 ghante ka expiry time lagayein. Agar user 24 ghante me join na kare toh link automatically expire ho jayegi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
