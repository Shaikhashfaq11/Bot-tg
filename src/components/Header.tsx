import React from 'react';
import { Send, Play, Terminal, BookOpen, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'architecture' | 'sunpay' | 'code' | 'guide' | 'admin' | 'tester';
  setActiveTab: (tab: 'simulator' | 'architecture' | 'sunpay' | 'code' | 'guide' | 'admin' | 'tester') => void;
  onLaunchSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLaunchSimulation }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Send className="w-5 h-5 -rotate-12 translate-x-px" />
          </div>
          <button 
            onClick={() => setActiveTab('simulator')} 
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                TeleCourse <span className="text-cyan-400">Bot</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>@Seedhemout_coder_bot</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'simulator' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Bot Simulator
          </button>
          <button
            onClick={() => setActiveTab('sunpay')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'sunpay' ? 'text-amber-400 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SunPay Gateway</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'architecture' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Architecture & Solution
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'code' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Source Code (SunPay)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'guide' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'admin' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tester' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Live Token Tester
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLaunchSimulation}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Bot Live</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-2 px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'simulator' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Bot Simulator
        </button>
        <button
          onClick={() => setActiveTab('sunpay')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'sunpay' ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30' : 'text-slate-400'
          }`}
        >
          ☀️ SunPay Gateway
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Source Code
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'architecture' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Solution & Jawāb
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Setup Guide
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'admin' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab('tester')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'tester' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
          }`}
        >
          Token Tester
        </button>
      </div>
    </header>
  );
};
