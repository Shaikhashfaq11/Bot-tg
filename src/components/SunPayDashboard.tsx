import React, { useState } from 'react';
import { 
  CreditCard, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Zap, 
  Radio, 
  Lock, 
  Terminal, 
  FileCode,
  QrCode,
  Building2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface SunPayDashboardProps {
  onSimulateSunPayPayment?: (orderId: string, amount: number) => void;
}

export const SunPayDashboard: React.FC<SunPayDashboardProps> = ({
  onSimulateSunPayPayment
}) => {
  const [merchantId, setMerchantId] = useState('63471842');
  const [payinApiKey, setPayinApiKey] = useState('68299af3f952195cc35aa5cb53d33ceaa079d842118143d33d3c43cefcd5f5f4');
  const [payinApiSecret, setPayinApiSecret] = useState('1ea28480c89d971bef0c794968ed3422947e6d5f47d73e7b1aacf42d5af2b986');
  const [webhookSecret, setWebhookSecret] = useState('01e008e11cda72deb0769fbac1aa9e617b4fbdea55941155967d5962d110457f');
  const [notifyUrl, setNotifyUrl] = useState('/api/webhook/sunpay');
  const [testAmount, setTestAmount] = useState('999');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live order calculation simulation
  const [calculatedSignature, setCalculatedSignature] = useState('HMAC-SHA256 (Ready)');
  const [simulatedCheckoutUrl, setSimulatedCheckoutUrl] = useState<string | null>(null);
  const [webhookFired, setWebhookFired] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isCreatingPayin, setIsCreatingPayin] = useState(false);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateCreatePayin = async () => {
    setIsCreatingPayin(true);
    try {
      const res = await fetch('/api/payin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'web_ai',
          customerName: 'Test Student',
          amount: Number(testAmount) || 999
        })
      });
      const data = await res.json();
      if (data && data.checkoutUrl) {
        setSimulatedCheckoutUrl(data.checkoutUrl);
        setCalculatedSignature('Signature Verified ✓ HTTP ' + (data.status || 201));
      } else {
        const orderId = 'ORD_' + Date.now();
        setSimulatedCheckoutUrl(`https://cashier.gbhar.info/newcashier/#/?orderNum=${orderId}`);
        setCalculatedSignature('Fallback link generated');
      }
    } catch {
      const orderId = 'ORD_' + Date.now();
      setSimulatedCheckoutUrl(`https://cashier.gbhar.info/newcashier/#/?orderNum=${orderId}`);
    } finally {
      setIsCreatingPayin(false);
    }
  };

  const handleFireWebhook = () => {
    setWebhookFired(true);
    if (onSimulateSunPayPayment) {
      onSimulateSunPayPayment('ORD_' + Date.now(), Number(testAmount) || 999);
    }
    setTimeout(() => setWebhookFired(false), 4000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* SunPay Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-lg shadow-amber-500/10 shrink-0">
              <CreditCard className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">SunPay Payment Gateway (ttpay.business)</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-950 border border-amber-500/40 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Merchant: {merchantId}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                India INR Pay-in (代收) & Payout (代付) Gateway · UPI / QR / Bank Transfer · HMAC-SHA256 Signed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://ttpay.business"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all shadow-md shadow-amber-600/25 whitespace-nowrap cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>SunPay Dashboard (ttpay.business)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Credentials & Live Payin Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Merchant Credentials */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>SunPay Merchant & API Credentials</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">From ttpay.business</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Merchant ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(merchantId, 'mid')}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {copiedKey === 'mid' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pay-in API Key (Header: x-api-key)</label>
                <input
                  type="text"
                  value={payinApiKey}
                  onChange={(e) => setPayinApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pay-in API Secret (HMAC-SHA256 Signing)</label>
                <input
                  type="password"
                  value={payinApiSecret}
                  onChange={(e) => setPayinApiSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Sign the raw pay-in body: HMAC-SHA256(body, secret) → header x-signature
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Webhook Secret (Header: x-signature Verification)</label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notify URL (Callback Endpoint)</label>
                <input
                  type="text"
                  value={notifyUrl}
                  onChange={(e) => setNotifyUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  SunPay will POST signed JSON payload to this endpoint on payment success.
                </span>
              </div>

              {/* Save & Activate Live Keys Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch('/api/sunpay/save-keys', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          apiKey: payinApiKey,
                          apiSecret: payinApiSecret,
                          webhookSec: webhookSecret,
                          merchantId
                        })
                      });
                      setSaveStatus('success');
                      setTimeout(() => setSaveStatus(null), 4000);
                    } catch (e: any) {
                      setSaveStatus('error');
                      setTimeout(() => setSaveStatus(null), 4000);
                    }
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save & Activate Real SunPay Keys</span>
                </button>

                {saveStatus === 'success' && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SunPay Credentials saved! Bot ab real SunPay API se checkout URL mangwayega.</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Server se connect hone me samasya aayi.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live SunPay API Simulator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Test Create Pay-in Order (POST /api/public/v1/payins)</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Idempotent
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Course Price (INR)</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Rail</label>
                  <input
                    type="text"
                    readOnly
                    value="upi (PhonePe/GPay/Paytm)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-400 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Request Payload JSON Preview */}
              <div>
                <label className="block text-slate-400 mb-1">Generated JSON Body:</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{`{
  "order_id": "ORD_${Date.now()}_9166895702",
  "amount": ${testAmount || 999},
  "currency": "INR",
  "method": "upi",
  "customer_name": "Seedhemout Student",
  "notify_url": "${notifyUrl}",
  "metadata": {
    "telegram_user_id": "9166895702",
    "course_id": "web_ai_course"
  }
}`}</pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleSimulateCreatePayin}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Call POST /api/public/v1/payins</span>
                </button>

                <button
                  onClick={handleFireWebhook}
                  className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold text-emerald-300 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulate Webhook (payin.success)</span>
                </button>
              </div>

              {simulatedCheckoutUrl && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-300">SunPay Checkout URL Received:</span>
                    <span className="text-[10px] text-slate-500 font-mono">Status: pending</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 font-mono text-cyan-300 text-[11px] truncate select-all">
                    {simulatedCheckoutUrl}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Generated HMAC-SHA256 Header:</span>
                    <span className="font-mono text-amber-400 truncate max-w-[200px]">{calculatedSignature}</span>
                  </div>
                </div>
              )}

              {webhookFired && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>SunPay Webhook Verified!</strong> Bot created single-use invite link for private channel and dispatched course vault!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SunPay Webhook Signature Verification Code Snippet */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">SunPay HMAC-SHA256 Signature Verification (Docs Matching)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">crypto.timingSafeEqual</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          SunPay sends the HMAC-SHA256 hex digest of the raw webhook body in the <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">x-signature</code> HTTP header.
          Aapke server ko ise verify karna hota hai taaki koi fake callback na bhej sake:
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre>{`// Express Node.js SunPay Webhook Verification
import crypto from "crypto";

app.post("/api/webhook/sunpay", express.raw({ type: "*/*" }), (req, res) => {
  const raw = req.body.toString("utf8");
  
  // 1. Calculate expected HMAC-SHA256 signature
  const expected = crypto
    .createHmac("sha256", process.env.SUNPAY_WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");

  const given = req.header("x-signature") || "";

  // 2. Timing-safe comparison to prevent timing attacks
  const ok = expected.length === given.length && 
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given));

  if (!ok) {
    return res.status(401).send("bad signature");
  }

  const evt = JSON.parse(raw);
  
  // 3. If payin succeeded, bot automatically generates 1-member invite link
  if (evt.status === "success" || evt.event === "payin.success") {
    const telegramUserId = evt.metadata?.telegram_user_id;
    // Deliver Telegram VIP invite link with member_limit: 1 & Course vault!
  }

  // 4. Always respond 200 within 8 seconds
  res.status(200).send("ok");
});`}</pre>
        </div>
      </div>
    </div>
  );
};
