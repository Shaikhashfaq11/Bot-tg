import { Course, OrderRecord } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full Stack Web & AI Mastery (Hindi + Eng)',
    titleHindi: 'फुल स्टैक वेब & एआई डेवलपमेंट बूटकैंप',
    category: 'Programming',
    price: 999,
    originalPrice: 4999,
    badge: 'Bestseller',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, Next.js, and how to build & monetize AI SaaS applications from zero to hero.',
    curriculum: [
      'Module 1: Web Fundamentals & React 19 Mastery',
      'Module 2: Node.js, Express & PostgreSQL Backend',
      'Module 3: Authentication & Payment Gateway Integration',
      'Module 4: Gemini & OpenAI API SaaS Apps',
      'Module 5: Deployment, Freelancing & Client Acquisition'
    ],
    materialsLink: 'https://drive.google.com/drive/folders/demo-fullstack-course-2026',
    channelName: 'VIP Full Stack Web & AI Lounge',
    channelId: '-1002345891234'
  },
  {
    id: 'course-2',
    title: 'Crypto, Forex & Price Action Trading Pro',
    titleHindi: 'स्टॉक मार्केट & क्रिप्टो प्राइस एक्शन ट्रेडिंग',
    category: 'Finance',
    price: 1499,
    originalPrice: 5999,
    badge: 'High Demand',
    description: 'Master candlestick patterns, smart money concepts, risk management, and live chart analysis with real-time community breakdown.',
    curriculum: [
      'Module 1: Market Structure & Institutional Liquidity',
      'Module 2: Supply & Demand Order Blocks',
      'Module 3: Risk to Reward & Position Sizing Formulas',
      'Module 4: Live Trading Signals & Daily Watchlist'
    ],
    materialsLink: 'https://notion.site/demo-trading-masterclass-vault',
    channelName: 'VIP Trading Alpha & Live Signals Hub',
    channelId: '-1003894726154'
  },
  {
    id: 'course-3',
    title: 'Video Editing & Content Creation Secrets',
    titleHindi: 'प्रो वीडियो एडिटिंग (Premiere + After Effects)',
    category: 'Creative',
    price: 699,
    originalPrice: 2999,
    description: 'Learn cinematic storytelling, sound design, viral retention editing for Reels/YouTube, and Premiere Pro/CapCut workflows.',
    curriculum: [
      'Module 1: Pacing, Jump Cuts & Sound Effects Layering',
      'Module 2: Motion Graphics & Keyframing in After Effects',
      'Module 3: Color Grading & LUTs Implementation',
      'Module 4: 100+ GB Asset Pack (Sound FX, Presets, Fonts)'
    ],
    materialsLink: 'https://drive.google.com/drive/folders/demo-video-editing-pack',
    channelName: 'VIP Editors Syndicate & Asset Drops',
    channelId: '-1004928172910'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-8941',
    courseId: 'course-1',
    courseTitle: 'Full Stack Web & AI Mastery (Hindi + Eng)',
    userTelegramId: '682910452',
    userName: '@rahul_dev',
    amount: 999,
    currency: 'INR',
    paymentMethod: 'UPI (GPay)',
    status: 'paid',
    transactionId: 'pay_Nz9wX02bL1',
    createdAt: '10 minutes ago',
    inviteLink: 'https://t.me/+Ab9Kx_L81920_DEMO',
    linkUsed: true
  },
  {
    id: 'ORD-8940',
    courseId: 'course-2',
    courseTitle: 'Crypto, Forex & Price Action Trading Pro',
    userTelegramId: '791024881',
    userName: '@vikram_trader',
    amount: 1499,
    currency: 'INR',
    paymentMethod: 'Razorpay Cards',
    status: 'paid',
    transactionId: 'pay_Kq3yB90dL8',
    createdAt: '34 minutes ago',
    inviteLink: 'https://t.me/+M2kPq_O99124_DEMO',
    linkUsed: true
  },
  {
    id: 'ORD-8939',
    courseId: 'course-3',
    courseTitle: 'Video Editing & Content Creation Secrets',
    userTelegramId: '542019284',
    userName: '@priya_creates',
    amount: 699,
    currency: 'INR',
    paymentMethod: 'UPI (PhonePe)',
    status: 'paid',
    transactionId: 'pay_Jp1zV88cL4',
    createdAt: '1 hour ago',
    inviteLink: 'https://t.me/+P9xLo_K11048_DEMO',
    linkUsed: false
  }
];
