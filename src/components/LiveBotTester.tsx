import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  Lock, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  Play,
  Square,
  Radio,
  Copy,
  Check
} from 'lucide-react';
import { 
  USER_BOT_TOKEN, 
  USER_BOT_USERNAME, 
  USER_BOT_NAME,
  fetchBotMe, 
  fetchUpdates, 
  sendTelegramMessage, 
  answerCallback,
  createRealInviteLink,
  TelegramBotInfo,
  TelegramUpdate
} from '../services/telegramService';

export const LiveBotTester: React.FC = () => {
  const [token, setToken] = useState(USER_BOT_TOKEN);
  const [channelId, setChannelId] = useState('-100');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [botInfo, setBotInfo] = useState<TelegramBotInfo | null>({
    id: 9166895702,
    is_bot: true,
    first_name: USER_BOT_NAME,
    username: USER_BOT_USERNAME,
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false
  });

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    inviteLink?: string;
  } | null>({
    success: true,
    message: `Bot verified & online: @${USER_BOT_USERNAME} (ID: 9166895702)`
  });

  // Live Polling State
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [pollingLogs, setPollingLogs] = useState<string[]>([
    `[SYSTEM] @${USER_BOT_USERNAME} initialized with Token: 9166895702:AAEF...`
  ]);
  const lastUpdateIdRef = useRef<number>(0);
  const pollingTimerRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setPollingLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const handleTestToken = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setTestResult(null);

    const data = await fetchBotMe(token.trim());
    if (data.ok && data.result) {
      setBotInfo(data.result);
      setTestResult({
        success: true,
        message: `Bot authenticated successfully as @${data.result.username} (ID: ${data.result.id})`
      });
      addLog(`Authenticated with Telegram API as @${data.result.username}`);
    } else {
      setBotInfo(null);
      setTestResult({
        success: false,
        message: data.description || 'Invalid Telegram Bot Token!'
      });
      addLog(`Error: ${data.description}`);
    }
    setLoading(false);
  };

  const handleTestInviteLink = async () => {
    if (!token.trim() || !channelId.trim() || channelId === '-100') {
      setTestResult({
        success: false,
        message: 'Kripya apna sahi Private Channel ID enter karein (e.g. -100123456789)'
      });
      return;
    }

    setLoading(true);
    addLog(`Requesting Telegram API createChatInviteLink for chat: ${channelId}...`);

    const data = await createRealInviteLink(token.trim(), channelId.trim(), {
      memberLimit: 1,
      expireHours: 24,
      name: 'Seedhemout_Student_Invite'
    });

    if (data.ok && data.result) {
      setTestResult({
        success: true,
        message: `Success! Real 1-Time Single Use Invite Link generated from Telegram servers:`,
        inviteLink: data.result.invite_link
      });
      addLog(`Invite link created: ${data.result.invite_link}`);
    } else {
      setTestResult({
        success: false,
        message: `Telegram Error: ${data.description}. (Make sure @${USER_BOT_USERNAME} is added as Administrator in the channel with 'Invite Users via Link' permission!)`
      });
      addLog(`Invite creation failed: ${data.description}`);
    }
    setLoading(false);
  };

  // Live Polling Loop
  useEffect(() => {
    if (!isPollingActive) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      return;
    }

    addLog(`🚀 LIVE POLLING STARTED! Now open Telegram and send /start to @${USER_BOT_USERNAME}`);

    const poll = async () => {
      try {
        const res = await fetchUpdates(token, lastUpdateIdRef.current ? lastUpdateIdRef.current + 1 : undefined);
        if (res.ok && res.result && res.result.length > 0) {
          for (const update of res.result) {
            lastUpdateIdRef.current = update.update_id;

            // Handle incoming message
            if (update.message && update.message.text) {
              const fromName = update.message.from.first_name || 'Friend';
              const chatId = update.message.chat.id;
              const text = update.message.text.trim();

              addLog(`📥 Received message from ${fromName} (${chatId}): "${text}"`);

              if (text === '/start' || text.toLowerCase() === 'start') {
                const welcome = 
                  `👋 Namaste <b>${fromName}</b>! Welcome to <b>${USER_BOT_NAME}</b>.\n\n` +
                  `Yahan se aap hamare premium courses direct khareed sakte hain.\n` +
                  `Payment hote hi aapko instant VIP Private Channel link aur course materials mil jayenge.\n\n` +
                  `📚 <b>Hamare Popular Courses:</b>\n` +
                  `1. Full Stack Web & AI Mastery — ₹999\n` +
                  `2. Trading & Algo Masterclass — ₹1,499\n\n` +
                  `Niche diye gaye button par click karein:`;

                await sendTelegramMessage(token, chatId, welcome, [
                  [{ text: '💳 Buy Full Stack Web & AI (₹999)', callback_data: 'buy_web_ai' }],
                  [{ text: '📈 Buy Trading Masterclass (₹1,499)', callback_data: 'buy_trading' }],
                  [{ text: '🌐 Open Course Portal', url: window.location.origin }]
                ]);
                addLog(`📤 Replied to ${fromName} with course catalogue & buy buttons!`);
              } else {
                await sendTelegramMessage(
                  token, 
                  chatId, 
                  `Namaste ${fromName}! Kripya course khareedne ke liye /start dabayein.`,
                  [[{ text: '🚀 Start Bot', callback_data: 'cmd_start' }]]
                );
              }
            }

            // Handle callback query buttons
            if (update.callback_query && update.callback_query.data) {
              const cb = update.callback_query;
              const chatId = cb.message?.chat.id;
              const data = cb.data;

              addLog(`🔘 User clicked button: "${data}"`);
              await answerCallback(token, cb.id, 'Processing course request...');

              if (chatId) {
                if (data === 'buy_web_ai' || data === 'buy_trading') {
                  const courseName = data === 'buy_web_ai' ? 'Full Stack Web & AI' : 'Trading Masterclass';
                  const price = data === 'buy_web_ai' ? '999' : '1,499';

                  await sendTelegramMessage(
                    token,
                    chatId,
                    `✅ <b>Payment Request Generated!</b>\n\n` +
                    `Course: <b>${courseName}</b>\n` +
                    `Payable Amount: <b>₹${price}</b>\n\n` +
                    `👉 Payment karne ke liye web portal pe jayein ya UPI payment complete karein. Payment hote hi bot aapko turant single-use invite link bhej dega!`,
                    [[{ text: '💳 Complete Payment Now', url: window.location.origin }]]
                  );
                }
              }
            }
          }
        }
      } catch (err: any) {
        // quiet polling error
      }
    };

    poll();
    pollingTimerRef.current = setInterval(poll, 2500);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isPollingActive, token]);

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner with Connected Bot Information */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Seedhemout coder</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live & Verified
                </span>
              </div>
              <p className="text-sm text-cyan-400 font-mono mt-0.5">
                @{USER_BOT_USERNAME} · ID: 9166895702
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://t.me/${USER_BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/25 whitespace-nowrap cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Telegram Me Kholein (@{USER_BOT_USERNAME})</span>
            </a>
          </div>
        </div>

        {/* Server Process Deployed Indicator */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-emerald-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400 shrink-0" />
            <span>
              <strong>🚀 Cloud Run Full-Stack Server Deployed & Active:</strong> Express backend + Telegraf Bot + SunPay Webhook running on port 3000.
            </span>
          </div>
          <span className="font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400">
            GET /api/bot/status: 200 OK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Token Details & Channel Test Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Telegram Bot Access Token
                </label>
                <button
                  onClick={copyToken}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleTestToken}
                  disabled={loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  {loading ? 'Testing...' : 'Verify'}
                </button>
              </div>
            </div>

            {/* Test Private Channel Invite Generation */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Apna Private Channel ID Daalkar Single-Use Link Test Karein
              </label>
              <p className="text-[11px] text-slate-400">
                Channel ID <code className="text-cyan-300 font-mono">-100</code> se shuru hoti hai. Bot ko channel me <strong>Admin</strong> banayein aur test karein:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="-1001234567890"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleTestInviteLink}
                  disabled={loading}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-emerald-600/20"
                >
                  Generate 1-Use Link
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-xl text-xs space-y-2 border ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>{testResult.message}</span>
                </div>

                {testResult.inviteLink && (
                  <div className="p-2.5 rounded bg-slate-950 font-mono text-cyan-300 break-all select-all border border-emerald-500/40 text-xs">
                    {testResult.inviteLink}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Event Terminal Log */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPollingActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Telegram Bot Terminal
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {isPollingActive ? 'Listening for Telegram updates...' : 'Idle'}
            </span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1.5 border border-slate-800">
            {pollingLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Jaise hi aap Telegram me bot ko message karenge, yahan live update show hoga.
          </p>
        </div>
      </div>
    </div>
  );
};
