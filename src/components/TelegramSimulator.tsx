import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  ExternalLink, 
  CheckCheck, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Radio, 
  FileText, 
  FolderLock, 
  ArrowLeft,
  MessageSquare,
  Zap,
  Info,
  Lock,
  Bot
} from 'lucide-react';
import { Course, TelegramMessage } from '../types';
import { PaymentModal } from './PaymentModal';

interface TelegramSimulatorProps {
  courses: Course[];
  onOrderCompleted?: (orderData: any) => void;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  courses,
  onOrderCompleted
}) => {
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `👋 **Namaste! Welcome to TeleCourse Academy Official Bot.**\n\nAap yahan se direct course khareed sakte hain. Payment confirm hote hi bot turant aapko **VIP Private Channel ka 1-Time Invite Link** aur **Full Course Video Vault** provide karega.\n\n👇 Niche diye gaye kisi bhi course ko select karein:`,
      timestamp: '12:00 PM',
      buttons: courses.map(c => ({
        text: `📚 ${c.title} — ₹${c.price}`,
        action: 'select_course',
        payload: c.id
      }))
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCourseForPayment, setActiveCourseForPayment] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'bot' | 'channel'>('bot');
  const [joinedChannel, setJoinedChannel] = useState<{ name: string; id: string } | null>(null);

  // Webhook event inspection log
  const [webhookLogs, setWebhookLogs] = useState<{
    id: string;
    event: string;
    timestamp: string;
    details: string;
    status: 'success' | 'pending';
  }[]>([
    {
      id: 'log-1',
      event: 'bot.started',
      timestamp: 'Just now',
      details: 'Telegram Polling active. Bot listening to commands.',
      status: 'success'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotReply = (text: string, buttons?: TelegramMessage['buttons'], accessDelivery?: TelegramMessage['accessDelivery']) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'm_' + Date.now(),
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          buttons,
          accessDelivery
        }
      ]);
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: TelegramMessage = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    // Handle commands
    if (userText.toLowerCase() === '/start' || userText.toLowerCase() === 'start') {
      addBotReply(
        `👋 **Namaste! TeleCourse Bot me aapka swagat hai.**\n\nKripya apna manpasand course chunein:`,
        courses.map(c => ({
          text: `📚 ${c.title} — ₹${c.price}`,
          action: 'select_course',
          payload: c.id
        }))
      );
    } else if (userText.toLowerCase().includes('course') || userText.toLowerCase().includes('price')) {
      addBotReply(
        `Hamare paas yeh premium courses uplabdh hain:\n\n${courses.map(c => `• **${c.title}**: ₹${c.price}`).join('\n')}\n\nKisi bhi course pe click karke purchase karein:`,
        courses.map(c => ({
          text: `Buy ${c.title.split(' ')[0]} (₹${c.price})`,
          action: 'select_course',
          payload: c.id
        }))
      );
    } else {
      addBotReply(
        `Mujhe samajh nahi aaya! Kripya niche diye gaye buttons ka upyog karein ya \`/start\` type karein:`,
        [
          { text: '📚 Browse All Courses', action: 'browse_all' },
          { text: '❓ How Payment Works', action: 'help' }
        ]
      );
    }
  };

  const handleButtonClick = (action: string, payload?: string) => {
    if (action === 'select_course') {
      const selected = courses.find(c => c.id === payload);
      if (!selected) return;

      // User simulated click
      setMessages(prev => [
        ...prev,
        {
          id: 'm_' + Date.now(),
          sender: 'user',
          text: `Selected: ${selected.title}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      addBotReply(
        `📖 **${selected.title}**\n\n` +
        `📝 **Details:** ${selected.description}\n\n` +
        `📚 **Curriculum:**\n${selected.curriculum.map(m => `• ${m}`).join('\n')}\n\n` +
        `💰 **Price:** ~~₹${selected.originalPrice}~~ **₹${selected.price}** (One-time Lifetime)\n` +
        `🔒 **Includes:** Private VIP Channel Access + Downloadable Vault\n\n` +
        `Payment karne ke liye niche "💳 Pay ₹${selected.price}" button dabayein:`,
        [
          { text: `💳 Pay ₹${selected.price} (Razorpay / UPI)`, action: 'initiate_payment', payload: selected.id },
          { text: '⬅️ Back to Courses', action: 'browse_all' }
        ]
      );
    } else if (action === 'initiate_payment') {
      const selected = courses.find(c => c.id === payload);
      if (!selected) return;
      setActiveCourseForPayment(selected);
      setIsPaymentModalOpen(true);
    } else if (action === 'browse_all') {
      addBotReply(
        `📚 **Available Courses Catalogue:**`,
        courses.map(c => ({
          text: `📚 ${c.title} — ₹${c.price}`,
          action: 'select_course',
          payload: c.id
        }))
      );
    } else if (action === 'help') {
      addBotReply(
        `ℹ️ **Payment & Delivery Process:**\n\n1. Select your course\n2. Click "Pay Now" to open Razorpay / UPI Gateway\n3. Pay via UPI, Card or Netbanking\n4. Once confirmed, this bot immediately generates a single-use Private Channel invite link and gives you the Drive link!`
      );
    } else if (action === 'join_channel') {
      if (payload) {
        const course = courses.find(c => c.id === payload);
        if (course) {
          setJoinedChannel({ name: course.channelName, id: course.channelId });
          setCurrentView('channel');
        }
      }
    }
  };

  const handlePaymentSuccess = (txnId: string, paymentMethod: string) => {
    if (!activeCourseForPayment) return;
    const course = activeCourseForPayment;

    // Generate unique single-use invite hash
    const inviteHash = '+join_' + Math.random().toString(36).substring(2, 9).toUpperCase() + '_DEMO';
    const inviteLink = `https://t.me/${inviteHash}`;

    // Add to webhook inspection log
    setWebhookLogs(prev => [
      {
        id: 'wh_' + Date.now(),
        event: 'payment_link.paid',
        timestamp: 'Just now',
        details: `Txn: ${txnId} | Course: ${course.title} | Amount: ₹${course.price} | Method: ${paymentMethod}`,
        status: 'success'
      },
      {
        id: 'api_' + (Date.now() + 1),
        event: 'telegram.createChatInviteLink',
        timestamp: 'Just now',
        details: `Chat: ${course.channelId} | member_limit: 1 | single_use: true`,
        status: 'success'
      },
      ...prev
    ]);

    if (onOrderCompleted) {
      onOrderCompleted({
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        courseId: course.id,
        courseTitle: course.title,
        userTelegramId: '682910452',
        userName: '@user_student',
        amount: course.price,
        currency: 'INR',
        paymentMethod,
        status: 'paid',
        transactionId: txnId,
        createdAt: 'Just now',
        inviteLink,
        linkUsed: false
      });
    }

    // Bot sends instant congratulations and links
    addBotReply(
      `🎉 **PAYMENT CONFIRMED! Dhanyawad!** 🚀\n\n` +
      `Course: **${course.title}**\n` +
      `Amount Paid: **₹${course.price}**\n` +
      `Transaction ID: \`${txnId}\`\n\n` +
      `Aapke access links niche tayyar hain:\n\n` +
      `1️⃣ **VIP Private Channel Invite Link (Single-Use):**\n` +
      `👉 ${inviteLink}\n` +
      `⚠️ *Note:* Yeh link sirf aapke liye generate hui hai (1 Member Limit). Ek baar join karte hi yeh expire ho jayegi taaki koi aur ise use na kar sake!\n\n` +
      `2️⃣ **Course Video & Resource Vault:**\n` +
      `👉 ${course.materialsLink}\n\n` +
      `Aap turant channel join kar sakte hain:`,
      [
        { text: `🚀 Join ${course.channelName}`, action: 'join_channel', payload: course.id },
        { text: `📂 Open Course Video Files`, action: 'help', url: course.materialsLink },
        { text: '📚 View Other Courses', action: 'browse_all' }
      ],
      {
        courseId: course.id,
        courseTitle: course.title,
        inviteLink,
        courseAccessUrl: course.materialsLink,
        transactionId: txnId,
        validityHours: 48
      }
    );
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'bot',
        text: `👋 **Namaste! Welcome to TeleCourse Academy Official Bot.**\n\nAap yahan se direct course khareed sakte hain. Payment confirm hote hi bot turant aapko **VIP Private Channel ka 1-Time Invite Link** aur **Full Course Video Vault** provide karega.\n\n👇 Niche diye gaye kisi bhi course ko select karein:`,
        timestamp: '12:00 PM',
        buttons: courses.map(c => ({
          text: `📚 ${c.title} — ₹${c.price}`,
          action: 'select_course',
          payload: c.id
        }))
      }
    ]);
    setCurrentView('bot');
    setJoinedChannel(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Simulator Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Interactive Real-Time Simulator</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Live Telegram Bot & Payment Flow</h2>
          <p className="text-sm text-slate-400 mt-1">
            Test karein ki user kaise bot pe aayega, course select karega, payment karega, aur instant private channel link receive karega.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flow</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Telegram Phone / Device Screen */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] relative">
            
            {/* Telegram Screen Top Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              {currentView === 'channel' ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentView('bot')}
                    className="text-cyan-400 hover:text-white p-1 rounded cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    VIP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[200px]">
                      {joinedChannel?.name || 'VIP Private Channel'}
                    </h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400 inline" /> Private Channel · 482 members
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">TeleCourse Official Bot</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    </div>
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                      bot · online
                    </span>
                  </div>
                </div>
              )}

              {/* View toggle badge */}
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {currentView === 'bot' ? 'Bot Chat' : 'VIP Channel'}
              </div>
            </div>

            {/* Content View: Bot Chat or Joined VIP Channel */}
            {currentView === 'bot' ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 text-slate-200 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line text-xs font-sans">
                        {m.text}
                      </div>

                      {/* If message delivered private invite link, highlight nicely */}
                      {m.accessDelivery && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>1-Time Single-Use Private Channel Link</span>
                          </div>
                          <div className="p-1.5 rounded bg-slate-900 font-mono text-[10px] text-cyan-300 truncate select-all">
                            {m.accessDelivery.inviteLink}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Valid for 1 member join only. Member limit locked.
                          </div>
                        </div>
                      )}

                      <div className={`mt-1.5 text-[9px] text-right font-mono ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.timestamp}
                      </div>
                    </div>

                    {/* Telegram Inline Buttons below message */}
                    {m.buttons && m.buttons.length > 0 && (
                      <div className="mt-2 space-y-1.5 w-full max-w-[85%]">
                        {m.buttons.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => {
                              if (btn.url) {
                                window.open(btn.url, '_blank');
                              } else {
                                handleButtonClick(btn.action, btn.payload);
                              }
                            }}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-xl text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                              btn.action === 'initiate_payment'
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold'
                                : btn.action === 'join_channel'
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold'
                                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50'
                            }`}
                          >
                            <span>{btn.text}</span>
                            {btn.action === 'initiate_payment' && <Zap className="w-3.5 h-3.5" />}
                            {btn.action === 'join_channel' && <Users className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-2 bg-slate-900/80 rounded-xl max-w-[120px] text-slate-400 text-[11px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-300" />
                    <span className="ml-1 text-[10px]">bot typing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            ) : (
              /* Channel View: Simulation of joining the VIP Private Channel */
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 text-slate-200 text-xs">
                <div className="text-center py-3">
                  <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-emerald-400 font-mono">
                    ✅ You joined via 1-time single-use invite link
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Pinned Announcement: Welcome to VIP Hub</span>
                    <span className="text-[10px] text-slate-400 font-mono">10:00 AM</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Sabhi naye students ka swagat hai! Yahan aapko daily live session links, doubt clearing classes, code files aur VIP updates milenge.
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-400">
                    <span className="font-mono">📂 28 Files · 14 Videos</span>
                    <button 
                      onClick={() => setCurrentView('bot')}
                      className="hover:underline cursor-pointer"
                    >
                      Return to Bot
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-purple-400 font-mono">SESSION 01: COURSE LECTURE DROP</span>
                  <p className="text-xs text-slate-300">
                    Module 1 & 2 Video Files + Starter Project Source Code upload ho gaya hai. Check the drive folder provided by the bot!
                  </p>
                </div>
              </div>
            )}

            {/* Message Input Field */}
            {currentView === 'bot' && (
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type /start or select a course..."
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Webhook & Backend Telemetry Inspector */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Flow Navigator Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Simulate Preset Actions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click below to instantly trigger typical user journey milestones:
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setInputText('/start');
                  setTimeout(() => handleSendMessage(), 50);
                }}
                className="py-2 px-3 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
              >
                1. Send <code className="text-cyan-400 font-mono">/start</code>
              </button>

              <button
                onClick={() => handleButtonClick('select_course', courses[0].id)}
                className="py-2 px-3 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
              >
                2. Select Course
              </button>

              <button
                onClick={() => {
                  setActiveCourseForPayment(courses[0]);
                  setIsPaymentModalOpen(true);
                }}
                className="py-2 px-3 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-950/60 rounded-lg text-left transition-colors cursor-pointer"
              >
                3. Open Gateway Modal
              </button>

              <button
                onClick={() => handlePaymentSuccess('pay_DEMO_999_INSTANT', 'Direct Simulator')}
                className="py-2 px-3 text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-950/60 rounded-lg text-left transition-colors cursor-pointer"
              >
                4. Trigger Webhook & Invite
              </button>
            </div>
          </div>

          {/* Webhook & Server Log Inspector */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Server Webhook Events</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">HMAC SHA256 Verified</span>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {webhookLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-semibold">{log.event}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-mono break-all">{log.details}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Yeh kaise secure rehta hai:</strong> Gateway payment verify karke secret signature ke saath aapke server pe hit karta hai. Server signature match hone par hi link generate karta hai, taaki fake payment ka koi risk na rahe.
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Checkout Modal */}
      {activeCourseForPayment && (
        <PaymentModal
          course={activeCourseForPayment}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFail={() => {
            setIsPaymentModalOpen(false);
            addBotReply('❌ Payment fail ya cancel ho gaya. Agar aap dobara koshish karna chahte hain toh "Buy Now" dabayein.');
          }}
        />
      )}
    </div>
  );
};
