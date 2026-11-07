import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnswerHero } from './components/AnswerHero';
import { TelegramSimulator } from './components/TelegramSimulator';
import { CodeGenerator } from './components/CodeGenerator';
import { SetupGuide } from './components/SetupGuide';
import { CourseManager } from './components/CourseManager';
import { LiveBotTester } from './components/LiveBotTester';
import { SunPayDashboard } from './components/SunPayDashboard';
import { INITIAL_COURSES, INITIAL_ORDERS } from './data/mockData';
import { Course, OrderRecord } from './types';
import { Send, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'architecture' | 'sunpay' | 'code' | 'guide' | 'admin' | 'tester'>('simulator');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleSunPaySimulatedOrder = (orderId: string, amount: number) => {
    const newOrd: OrderRecord = {
      id: orderId,
      courseId: courses[0]?.id || 'course-1',
      courseTitle: courses[0]?.title || 'Full Stack Web & AI Mastery',
      userTelegramId: '9166895702',
      userName: '@Seedhemout_coder_bot',
      amount,
      currency: 'INR',
      paymentMethod: 'SunPay UPI (代收)',
      status: 'paid',
      transactionId: 'tx_01HZX' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      createdAt: 'Just now',
      inviteLink: `https://t.me/+join_sunpay_${Math.random().toString(36).substring(2, 8)}_DEMO`,
      linkUsed: false
    };
    handleOrderCompleted(newOrd);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchSimulation={() => setActiveTab('simulator')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Solution & Architecture Tab or Always at top when 'architecture' is selected */}
        {activeTab === 'architecture' && (
          <AnswerHero
            onTestClick={() => setActiveTab('simulator')}
            onViewCode={() => setActiveTab('code')}
          />
        )}

        {/* When on simulator, show a compact hero banner first so the answer is immediately visible, followed by the simulator */}
        {activeTab === 'simulator' && (
          <>
            <AnswerHero
              onTestClick={() => {
                const el = document.getElementById('live-simulator-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewCode={() => setActiveTab('code')}
            />
            <div id="live-simulator-anchor">
              <TelegramSimulator
                courses={courses}
                onOrderCompleted={handleOrderCompleted}
              />
            </div>
          </>
        )}

        {/* Dedicated SunPay Gateway Tab */}
        {activeTab === 'sunpay' && (
          <SunPayDashboard
            onSimulateSunPayPayment={handleSunPaySimulatedOrder}
          />
        )}

        {activeTab === 'code' && (
          <CodeGenerator />
        )}

        {activeTab === 'guide' && (
          <SetupGuide />
        )}

        {activeTab === 'admin' && (
          <CourseManager
            courses={courses}
            orders={orders}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}

        {activeTab === 'tester' && (
          <LiveBotTester />
        )}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">TeleCourse Bot System</span>
            <span aria-hidden="true">·</span>
            <span>Automated Telegram Course Sales, Razorpay/UPI Webhook & Single-Use Private Channel Invites</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Telegram Bot API 7.0+</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">member_limit: 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
