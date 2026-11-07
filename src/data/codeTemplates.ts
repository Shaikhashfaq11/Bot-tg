export const SUNPAY_NODE_TELEGRAF_CODE = `/**
 * PRODUCTION TELEGRAM BOT SERVER WITH SUNPAY (ttpay.business)
 * Merchant ID: 63471842
 * Stack: Node.js + TypeScript/Express + Telegraf + SunPay API
 * Features:
 *  - SunPay Pay-in Order creation (POST https://ttpay.business/api/public/v1/payins)
 *  - HMAC-SHA256 signature generation (header x-signature)
 *  - SunPay Async Webhook listener (/api/webhook/sunpay)
 *  - Telegram Bot createChatInviteLink with member_limit: 1 (ANTI-PIRACY)
 *  - Instant delivery of VIP Private Channel & Course Files to Student
 */

import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9166895702:AAEF9FZyOKav9-lDYnZpQJTB66LZy_v3zLs';
const SUNPAY_BASE_URL = process.env.SUNPAY_BASE_URL || 'https://ttpay.business';
const SUNPAY_MERCHANT_ID = process.env.SUNPAY_MERCHANT_ID || '63471842';
const SUNPAY_PAYIN_API_KEY = process.env.SUNPAY_PAYIN_API_KEY!;
const SUNPAY_PAYIN_API_SECRET = process.env.SUNPAY_PAYIN_API_SECRET!;
const SUNPAY_WEBHOOK_SECRET = process.env.SUNPAY_WEBHOOK_SECRET!;
const SERVER_URL = process.env.SERVER_URL || 'https://your-server.onrender.com';

// Course Catalogue with linked Telegram Private Channels
const COURSES: Record<string, {
  title: string;
  priceInRupees: number;
  privateChannelId: string; // starts with -100
  materialsUrl: string;
  description: string;
}> = {
  'web_ai_course': {
    title: 'Full Stack Web & AI Mastery (Hindi + Eng)',
    priceInRupees: 999,
    privateChannelId: process.env.TELEGRAM_PRIVATE_CHANNEL_ID || '-1001928374829',
    materialsUrl: 'https://drive.google.com/drive/folders/demo-fullstack-vault',
    description: 'Complete Web Dev + AI SaaS development from scratch.'
  },
  'trading_mastery': {
    title: 'Crypto, Forex & Price Action Trading Pro',
    priceInRupees: 1499,
    privateChannelId: process.env.TELEGRAM_PRIVATE_CHANNEL_ID || '-1001928374829',
    materialsUrl: 'https://notion.site/demo-trading-vault',
    description: 'Master institutional SMC order blocks & risk management.'
  }
};

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Use express.raw for webhook endpoint to verify exact HMAC signature without tampering
app.use('/api/webhook/sunpay', express.raw({ type: '*/*' }));
app.use(express.json());

// 1. /start Command: Welcome & Course Selection
bot.command('start', async (ctx) => {
  const userName = ctx.from.first_name || 'Student';
  const text = 
    \`Namaste \${userName}! 🚀\\n\\n\` +
    \`Welcome to Seedhemout Coder Academy.\\n\` +
    \`Aap yahan se direct courses purchase kar sakte hain SunPay UPI Gateway ke dwara.\\n\\n\` +
    \`Payment hote hi aapko instant milega:\\n\` +
    \`✅ VIP Private Telegram Channel ka 1-Time Single-Use Invite Link\\n\` +
    \`✅ Full Course Video Lectures & Source Code Vault\\n\\n\` +
    \`Kripya apna manpasand course chunein:\`;

  const buttons = Object.entries(COURSES).map(([id, c]) => [
    Markup.button.callback(\`📚 \${c.title} — ₹\${c.priceInRupees}\`, \`view_\${id}\`)
  ]);

  await ctx.reply(text, Markup.inlineKeyboard(buttons));
});

// 2. View Course & Buy Button
bot.action(/^view_(.+)$/, async (ctx) => {
  const courseId = ctx.match[1];
  const course = COURSES[courseId];
  if (!course) return ctx.reply('Course nahi mila!');

  await ctx.answerCbQuery();
  const text = 
    \`📖 *\${course.title}*\\n\\n\` +
    \`📝 *Details:* \${course.description}\\n\\n\` +
    \`💰 *Price:* ₹\${course.priceInRupees} (One-Time Lifetime Access)\\n\` +
    \`🔒 *Access:* VIP Private Channel + Drive Vault\\n\\n\` +
    \`Click below to generate SunPay UPI payment link:\`;

  await ctx.replyWithMarkdown(text, Markup.inlineKeyboard([
    [Markup.button.callback(\`💳 Pay ₹\${course.priceInRupees} via SunPay UPI\`, \`buy_sunpay_\${courseId}\`)],
    [Markup.button.callback('⬅️ Back to Courses', 'back_courses')]
  ]));
});

// 3. Create SunPay Pay-in Order (API: POST /api/public/v1/payins)
bot.action(/^buy_sunpay_(.+)$/, async (ctx) => {
  const courseId = ctx.match[1];
  const course = COURSES[courseId];
  const userId = ctx.from.id.toString();
  const userName = ctx.from.username || ctx.from.first_name || 'Customer';

  await ctx.answerCbQuery('SunPay payment gateway link ban raha hai...');

  try {
    const orderId = \`ORD_\${Date.now()}_\${userId}\`;
    
    // SunPay Payin Payload
    const payload = {
      order_id: orderId,
      amount: course.priceInRupees, // amount in major units (e.g. 999 means ₹999.00)
      currency: 'INR',
      method: 'upi', // upi | bank | usdt
      customer_name: userName,
      customer_phone: '9999999999',
      customer_email: \`user_\${userId}@telegram.me\`,
      notify_url: \`\${SERVER_URL}/api/webhook/sunpay\`,
      metadata: {
        telegram_user_id: userId,
        course_id: courseId,
        user_name: userName
      }
    };

    const bodyString = JSON.stringify(payload);

    // Compute HMAC-SHA256 signature using SUNPAY_PAYIN_API_SECRET
    const signature = crypto
      .createHmac('sha256', SUNPAY_PAYIN_API_SECRET)
      .update(bodyString)
      .digest('hex');

    // Call SunPay API
    const response = await fetch(\`\${SUNPAY_BASE_URL}/api/public/v1/payins\`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': SUNPAY_PAYIN_API_KEY,
        'x-signature': signature
      },
      body: bodyString
    });

    const data: any = await response.json();

    if (data.checkout_url || data.payment_url) {
      const checkoutUrl = data.checkout_url || data.payment_url;
      await ctx.replyWithMarkdown(
        \`✅ *SunPay Payment Link Ready!*\\n\\n\` +
        \`Course: *\${course.title}*\\n\` +
        \`Payable Amount: *₹\${course.priceInRupees}*\\n\` +
        \`Order ID: \`\${orderId}\`\\n\\n\` +
        \`Niche diye gaye button par click karein aur UPI (GPay/PhonePe/Paytm/QR) se payment karein:\\n\\n\` +
        \`⚡ *Note:* Payment complete hote hi yeh bot aapko VIP Channel ka 1-time invite link aur course files turant yahi bhej dega!\`,
        Markup.inlineKeyboard([
          [Markup.button.url(\`💳 Pay ₹\${course.priceInRupees} (SunPay UPI)\`, checkoutUrl)]
        ])
      );
    } else {
      throw new Error(data.message || 'Failed to get checkout URL');
    }
  } catch (err: any) {
    console.error('SunPay order creation error:', err);
    await ctx.reply('SunPay gateway se link banane me samasya aayi. Kripya dobara koshish karein.');
  }
});

// Back handler
bot.action('back_courses', async (ctx) => {
  await ctx.answerCbQuery();
  const buttons = Object.entries(COURSES).map(([id, c]) => [
    Markup.button.callback(\`📚 \${c.title} — ₹\${c.priceInRupees}\`, \`view_\${id}\`)
  ]);
  await ctx.reply('Select a course:', Markup.inlineKeyboard(buttons));
});

// 4. SunPay Async Notification Webhook Endpoint
app.post('/api/webhook/sunpay', async (req, res) => {
  try {
    const raw = req.body.toString('utf8');
    
    // Verify HMAC-SHA256 signature using WEBHOOK_SECRET or PAYIN_API_SECRET
    const expected = crypto
      .createHmac('sha256', SUNPAY_WEBHOOK_SECRET || SUNPAY_PAYIN_API_SECRET)
      .update(raw)
      .digest('hex');

    const given = req.header('x-signature') || '';

    const ok = expected.length === given.length && 
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given));

    if (!ok) {
      console.warn('⚠️ Bad SunPay Webhook signature mismatch');
      return res.status(401).send('bad signature');
    }

    const evt = JSON.parse(raw);
    console.log('SunPay Webhook received:', evt);

    // Check payment status ('success' or event 'payin.success' / 'payin.updated')
    const isSuccess = evt.status === 'success' || evt.event === 'payin.success';

    if (isSuccess) {
      const metadata = evt.metadata || {};
      const telegramUserId = metadata.telegram_user_id;
      const courseId = metadata.course_id;

      if (telegramUserId && courseId && COURSES[courseId]) {
        const course = COURSES[courseId];
        const utr = evt.utr || evt.id;

        // 🔒 CRITICAL STEP: CREATE 1-MEMBER INVITE LINK (ANTI-LEAK)
        const invite = await bot.telegram.createChatInviteLink(course.privateChannelId, {
          name: \`SunPay_Buyer_\${telegramUserId}_\${Date.now()}\`,
          member_limit: 1, // Only this 1 buyer can join. Cannot be forwarded!
          expire_date: Math.floor(Date.now() / 1000) + (48 * 3600) // 48 hours validity
        });

        // Instant Delivery Message to User
        const successMessage = 
          \`🎉 *CONGRATULATIONS! Payment Successful via SunPay!* 🚀\\n\\n\` +
          \`Course: *\${course.title}*\\n\` +
          \`Amount Paid: *₹\${evt.amount || course.priceInRupees}*\\n\` +
          \`UTR / Ref: \`\${utr}\`\\n\\n\` +
          \`Yahan aapke VIP access details hain:\\n\\n\` +
          \`1️⃣ *VIP Private Channel Invite (1-Time Use):*\\n\` +
          \`👉 \${invite.invite_link}\\n\` +
          \`⚠️ *Note:* Yeh link sirf aapke liye hai (1 Member Limit). Ek baar join karte hi yeh expire ho jayegi.\\n\\n\` +
          \`2️⃣ *Course Video & Source Code Vault:*\\n\` +
          \`👉 \${course.materialsUrl}\\n\\n\` +
          \`Happy Learning!\`;

        await bot.telegram.sendMessage(telegramUserId, successMessage, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Join VIP Private Channel Now', url: invite.invite_link }],
              [{ text: '📂 Open Course Video Vault', url: course.materialsUrl }]
            ]
          }
        });

        console.log(\`✅ Sent SunPay course access & single-use invite to user \${telegramUserId}\`);
      }
    }

    // Acknowledge webhook within 8 seconds
    res.status(200).send('ok');
  } catch (err: any) {
    console.error('Error handling SunPay webhook:', err);
    res.status(500).send('internal error');
  }
});

// Launch server & bot
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

bot.launch().then(() => {
  console.log('🤖 Telegram Bot @Seedhemout_coder_bot is running live with SunPay!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
`;

export const NODE_TELEGRAF_CODE = `/**
 * PRODUCTION TELEGRAM BOT SERVER (RAZORPAY VERSION)
 * Stack: Node.js + TypeScript/Express + Telegraf + Razorpay
 */
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9166895702:AAEF9FZyOKav9-lDYnZpQJTB66LZy_v3zLs';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

const COURSES: Record<string, {
  title: string;
  priceInRupees: number;
  privateChannelId: string;
  materialsUrl: string;
  description: string;
}> = {
  'web_ai_course': {
    title: 'Full Stack Web & AI Mastery (Hindi + Eng)',
    priceInRupees: 999,
    privateChannelId: process.env.TELEGRAM_PRIVATE_CHANNEL_ID || '-1001928374829',
    materialsUrl: 'https://drive.google.com/drive/folders/demo-course-files',
    description: 'Complete Web Dev + AI SaaS building curriculum from scratch.'
  }
};

const bot = new Telegraf(BOT_TOKEN);
const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
const app = express();
app.use(express.json());

bot.command('start', async (ctx) => {
  const buttons = Object.entries(COURSES).map(([id, c]) => [
    Markup.button.callback(\`📚 \${c.title} — ₹\${c.priceInRupees}\`, \`buy_\${id}\`)
  ]);
  await ctx.reply('Welcome! Select a course to buy:', Markup.inlineKeyboard(buttons));
});

bot.action(/^buy_(.+)$/, async (ctx) => {
  const courseId = ctx.match[1];
  const course = COURSES[courseId];
  const userId = ctx.from.id.toString();

  const paymentLink = await razorpay.paymentLink.create({
    amount: course.priceInRupees * 100,
    currency: 'INR',
    description: \`Payment for \${course.title}\`,
    notes: { telegram_user_id: userId, course_id: courseId }
  });

  await ctx.reply(\`Pay ₹\${course.priceInRupees} via UPI / Card:\`, Markup.inlineKeyboard([
    [Markup.button.url('💳 Pay via Razorpay', paymentLink.short_url)]
  ]));
});

app.post('/api/webhook/razorpay', async (req, res) => {
  const event = req.body.event;
  if (event === 'payment_link.paid' || event === 'payment.captured') {
    const notes = req.body.payload.payment.entity.notes;
    const userId = notes.telegram_user_id;
    const courseId = notes.course_id;
    const course = COURSES[courseId];

    if (userId && course) {
      // Create single-use invite link (member_limit: 1)
      const invite = await bot.telegram.createChatInviteLink(course.privateChannelId, {
        name: \`Buyer_\${userId}\`,
        member_limit: 1
      });

      await bot.telegram.sendMessage(userId, 
        \`🎉 Payment Successful!\\n\\n1️⃣ VIP Channel Link (1-Time Use):\\n\${invite.invite_link}\\n\\n2️⃣ Course Files:\\n\${course.materialsUrl}\`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: '🚀 Join VIP Channel', url: invite.invite_link }]]
          }
        }
      );
    }
  }
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
bot.launch();
`;

export const PYTHON_SUNPAY_CODE = `# PYTHON (FastAPI + aiogram 3.x + SunPay Gateway)
import os, json, hmac, hashlib, time, requests
from fastapi import FastAPI, Request, HTTPException
from aiogram import Bot, Dispatcher, types, F
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "9166895702:AAEF9FZyOKav9-lDYnZpQJTB66LZy_v3zLs")
CHANNEL_ID = os.getenv("TELEGRAM_PRIVATE_CHANNEL_ID", "-1001928374829")

SUNPAY_BASE_URL = "https://ttpay.business"
SUNPAY_PAYIN_API_KEY = os.getenv("SUNPAY_PAYIN_API_KEY", "your_key")
SUNPAY_PAYIN_API_SECRET = os.getenv("SUNPAY_PAYIN_API_SECRET", "your_secret")
SUNPAY_WEBHOOK_SECRET = os.getenv("SUNPAY_WEBHOOK_SECRET", "your_secret")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
app = FastAPI()

COURSE_TITLE = "Full Stack Web & AI Mastery"
COURSE_PRICE = 999
COURSE_VAULT = "https://drive.google.com/drive/folders/demo-vault"

@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=f"💳 Buy via SunPay UPI (₹{COURSE_PRICE})", callback_data="buy_sunpay")]
    ])
    await message.answer(f"Welcome to Seedhemout Coder Academy!\\n\\n*{COURSE_TITLE}* - ₹{COURSE_PRICE}", reply_markup=kb, parse_mode="Markdown")

@dp.callback_query(F.data == "buy_sunpay")
async def create_sunpay_order(call: types.CallbackQuery):
    user_id = str(call.from_user.id)
    order_id = f"ORD_{int(time.time())}_{user_id}"
    
    payload = {
        "order_id": order_id,
        "amount": COURSE_PRICE,
        "currency": "INR",
        "method": "upi",
        "customer_name": call.from_user.first_name,
        "metadata": {"telegram_user_id": user_id, "course_id": "course-1"}
    }
    
    body = json.dumps(payload, separators=(",", ":"))
    signature = hmac.new(SUNPAY_PAYIN_API_SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()
    
    res = requests.post(
        f"{SUNPAY_BASE_URL}/api/public/v1/payins",
        headers={
            "content-type": "application/json",
            "x-api-key": SUNPAY_PAYIN_API_KEY,
            "x-signature": signature
        },
        data=body
    ).json()
    
    checkout_url = res.get("checkout_url") or res.get("payment_url")
    if checkout_url:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💳 Pay Now (SunPay UPI)", url=checkout_url)]
        ])
        await call.message.answer(f"Aapka SunPay link ready hai: ₹{COURSE_PRICE}\\nNiche click karein:", reply_markup=kb)
    await call.answer()

@app.post("/api/webhook/sunpay")
async def sunpay_webhook(request: Request):
    raw = await request.body()
    signature = request.headers.get("x-signature", "")
    expected = hmac.new(SUNPAY_WEBHOOK_SECRET.encode(), raw, hashlib.sha256).hexdigest()
    
    if signature != expected:
        raise HTTPException(status_code=401, detail="bad signature")
    
    data = json.loads(raw)
    if data.get("status") == "success" or data.get("event") == "payin.success":
        user_id = data.get("metadata", {}).get("telegram_user_id")
        if user_id:
            # Create single use invite link
            invite = await bot.create_chat_invite_link(
                chat_id=CHANNEL_ID,
                member_limit=1,
                expire_date=int(time.time()) + (48 * 3600)
            )
            await bot.send_message(
                chat_id=user_id,
                text=f"🎉 *Payment Successful via SunPay!*\\n\\n1️⃣ VIP Channel Link (Single-Use):\\n{invite.invite_link}\\n\\n2️⃣ Course Vault:\\n{COURSE_VAULT}",
                parse_mode="Markdown"
            )
    return {"status": "ok"}
`;

export const ENV_TEMPLATE = `# Telegram Bot Credentials (Seedhemout Coder Bot)
TELEGRAM_BOT_TOKEN="9166895702:AAEF9FZyOKav9-lDYnZpQJTB66LZy_v3zLs"
TELEGRAM_BOT_USERNAME="Seedhemout_coder_bot"

# Telegram Private Channel ID (Add @Seedhemout_coder_bot as Admin with Invite Users rights)
TELEGRAM_PRIVATE_CHANNEL_ID="-1001928374829"

# SunPay Payment Gateway Credentials (ttpay.business)
SUNPAY_BASE_URL="https://ttpay.business"
SUNPAY_MERCHANT_ID="63471842"
SUNPAY_PAYIN_API_KEY="your_sunpay_payin_api_key_here"
SUNPAY_PAYIN_API_SECRET="your_sunpay_payin_api_secret_here"
SUNPAY_WEBHOOK_SECRET="your_sunpay_webhook_secret_here"

# Razorpay Alternative (if needed)
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_key"

# Server URL where this backend is hosted
SERVER_URL="https://your-app.onrender.com"
PORT=3000
`;
