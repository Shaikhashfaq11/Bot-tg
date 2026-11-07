import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  SUNPAY_NODE_TELEGRAF_CODE, 
  PYTHON_SUNPAY_CODE, 
  NODE_TELEGRAF_CODE, 
  ENV_TEMPLATE 
} from '../data/codeTemplates';

export const CodeGenerator: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'sunpay_node' | 'sunpay_python' | 'razorpay' | 'env'>('sunpay_node');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (selectedLanguage) {
      case 'sunpay_node':
        return SUNPAY_NODE_TELEGRAF_CODE;
      case 'sunpay_python':
        return PYTHON_SUNPAY_CODE;
      case 'razorpay':
        return NODE_TELEGRAF_CODE;
      case 'env':
        return ENV_TEMPLATE;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="pb-6 mb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Ready-to-Deploy Production Code</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">SunPay (ttpay.business) Bot Server Code</h2>
          <p className="text-sm text-slate-400 mt-1">
            SunPay API (POST /api/public/v1/payins) + HMAC-SHA256 Signature + Webhook Receiver + Single-Use Telegram Invite Link.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-400/20"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Code Copied!' : 'Copy Entire Code'}</span>
        </button>
      </div>

      {/* Language / File Tab Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-2xl mb-4">
        <button
          onClick={() => setSelectedLanguage('sunpay_node')}
          className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedLanguage === 'sunpay_node'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>SunPay Node.js (Telegraf)</span>
        </button>
        <button
          onClick={() => setSelectedLanguage('sunpay_python')}
          className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedLanguage === 'sunpay_python'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>SunPay Python (FastAPI)</span>
        </button>
        <button
          onClick={() => setSelectedLanguage('razorpay')}
          className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedLanguage === 'razorpay'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Razorpay Version</span>
        </button>
        <button
          onClick={() => setSelectedLanguage('env')}
          className={`flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedLanguage === 'env'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>.env Config</span>
        </button>
      </div>

      {/* Code Container */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="ml-2 text-slate-300">
              {selectedLanguage === 'sunpay_node' ? 'server_sunpay.ts' : selectedLanguage === 'sunpay_python' ? 'bot_sunpay.py' : selectedLanguage === 'razorpay' ? 'server_razorpay.ts' : '.env'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Includes SunPay Webhook + Telegram Single-Use Invite API</span>
            <button
              onClick={handleCopy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto max-h-[550px] font-mono text-xs leading-relaxed text-slate-300">
          <pre className="selection:bg-cyan-500 selection:text-white">
            <code>{getActiveCode()}</code>
          </pre>
        </div>
      </div>

      {/* Quick Run Commands */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Terminal Setup Commands (Apne computer ya server pe run karein)</span>
        </h3>
        
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 space-y-2">
          <div className="text-slate-500"># 1. Project folder banayein aur dependencies install karein</div>
          <div>mkdir telegram-course-bot && cd telegram-course-bot</div>
          <div>npm init -y</div>
          <div>npm install telegraf express razorpay dotenv</div>
          <div>npm install -D typescript tsx @types/node @types/express</div>
          <div className="text-slate-500 mt-2"># 2. Bot start karein</div>
          <div>npx tsx server.ts</div>
        </div>
      </div>
    </div>
  );
};
