export interface Course {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  curriculum: string[];
  materialsLink: string;
  channelName: string;
  channelId: string;
  badge?: string;
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  buttons?: {
    text: string;
    action: string;
    payload?: string;
    url?: string;
  }[];
  media?: {
    type: 'photo' | 'document' | 'video';
    url: string;
    caption?: string;
  };
  invoiceDetails?: {
    courseId: string;
    courseTitle: string;
    amount: number;
    currency: string;
  };
  accessDelivery?: {
    courseId: string;
    courseTitle: string;
    inviteLink: string;
    courseAccessUrl: string;
    transactionId: string;
    validityHours: number;
  };
}

export interface OrderRecord {
  id: string;
  courseId: string;
  courseTitle: string;
  userTelegramId: string;
  userName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
  inviteLink: string;
  linkUsed: boolean;
}

export type PaymentGateway = 'sunpay' | 'razorpay' | 'cashfree' | 'stripe' | 'upi_qr' | 'telegram_stars';

export interface SunPayConfig {
  merchantId: string;
  payinApiKey: string;
  payinApiSecret: string;
  webhookSecret: string;
  baseUrl: string;
  notifyUrl: string;
}

export interface BotConfig {
  botName: string;
  botUsername: string;
  botToken: string;
  channelId: string;
  channelTitle: string;
  paymentGateway: PaymentGateway;
  gatewayKeyId: string;
  gatewaySecret: string;
  webhookUrl: string;
  currency: 'INR' | 'USD';
  sunpayConfig?: SunPayConfig;
}
