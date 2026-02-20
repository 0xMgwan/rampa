import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-blue-400" />
            OnRampa
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">API Documentation</h1>
          <p className="text-xl text-gray-400">Complete guide to integrating OnRampa into your application</p>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Authentication</h2>
          <p className="text-gray-300 mb-6 text-lg">
            All API requests require your API key in the <code className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg font-mono text-sm">X-API-Key</code> header.
          </p>
          <div className="relative">
            <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
<code className="text-sm">{`curl https://your-domain.com/api/v1/partner/rates \\
  -H "X-API-Key: sk_live_your_api_key"`}</code>
            </pre>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Base URL</h2>
          <pre className="bg-black/40 border border-white/10 text-cyan-300 p-4 rounded-xl font-mono text-lg">
https://your-domain.com/api/v1/partner
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Get Exchange Rates</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Retrieve current USDC/USDT exchange rates for a specific country.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-green-500/30">GET</span>
            <span className="font-mono text-gray-300 text-lg">/rates?country=TZ</span>
          </div>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Response:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto mb-4">
{`{
  "success": true,
  "rates": {
    "buy_rate_usdc": 2580,
    "sell_rate_usdc": 2520,
    "buy_rate_usdt": 2580,
    "sell_rate_usdt": 2520
  },
  "limits": {
    "min_usdc": 1,
    "max_usdc": 10000,
    "min_usdt": 1,
    "max_usdt": 10000
  },
  "currency": "TZS"
}`}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Get Payment Methods</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Get the list of active payment methods for a country.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-green-500/30">GET</span>
            <span className="font-mono text-gray-300 text-lg">/payment-methods?country=TZ</span>
          </div>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Response:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
{`{
  "success": true,
  "payment_methods": [
    {
      "id": "mpesa-tz",
      "provider": "M-Pesa Tanzania",
      "type": "mobile_money",
      "account_number": "1234567",
      "account_name": "ONRAMPA LTD",
      "instructions": "Dial *150*00#..."
    }
  ]
}`}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Create Buy Order (Onramp)</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Create an order for your user to purchase USDC/USDT with fiat.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-blue-500/30">POST</span>
            <span className="font-mono text-gray-300 text-lg">/onramp</span>
          </div>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Request Body:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto mb-6">
{`{
  "partner_order_id": "ORD-12345",
  "amount_usdt": 50,
  "destination_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "payment_method_id": "mpesa-tz",
  "user_full_name": "John Doe",
  "user_phone": "0765123456",
  "network": "BEP20",
  "country_code": "TZ"
}`}
          </pre>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Response:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
{`{
  "success": true,
  "order": {
    "order_number": "ORD-20260220-1234",
    "status": "pending",
    "amount_crypto": 50,
    "amount_fiat": 129000,
    "payment_instructions": {
      "provider": "M-Pesa Tanzania",
      "account_number": "1234567",
      "amount_to_send": 129000,
      "instructions": "Dial *150*00#..."
    },
    "expires_at": "2026-02-20T12:00:00Z"
  }
}`}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Verify Payment</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Submit the mobile money transaction ID to verify payment and trigger crypto delivery.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-blue-500/30">POST</span>
            <span className="font-mono text-gray-300 text-lg">/onramp/verify</span>
          </div>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Request Body:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
{`{
  "order_number": "ORD-20260220-1234",
  "transaction_id": "ABC123XYZ"
}`}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Create Sell Order (Offramp)</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Create an order for your user to sell USDC/USDT and receive fiat.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-blue-500/30">POST</span>
            <span className="font-mono text-gray-300 text-lg">/offramp</span>
          </div>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Request Body:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
{`{
  "partner_order_id": "SELL-12345",
  "amount_usdt": 100,
  "recipient_phone": "0765123456",
  "network": "BEP20",
  "country_code": "TZ"
}`}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Get Order Status</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Retrieve the current status of any order.
          </p>
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-mono text-sm font-bold border border-green-500/30">GET</span>
            <span className="font-mono text-gray-300 text-lg">/orders/:orderNumber</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Webhooks</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Configure your webhook URL in the admin dashboard. We send POST requests when order status changes.
          </p>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Events:</div>
          <ul className="list-none space-y-2 text-gray-300 mb-6">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_CREATED</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_VERIFYING</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_PROCESSING</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_COMPLETED</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_FAILED</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> ORDER_EXPIRED</li>
          </ul>
          <div className="mb-3 text-sm text-gray-400 font-semibold">Signature Verification:</div>
          <pre className="bg-black/40 border border-white/10 text-gray-100 p-6 rounded-xl overflow-x-auto">
{`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const [tPart, v1Part] = signature.split(',');
  const timestamp = tPart.split('=')[1];
  const expectedSig = v1Part.split('=')[1];
  
  const signedPayload = \`\${timestamp}.\${JSON.stringify(payload)}\`;
  const computedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return computedSig === expectedSig;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
