import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <nav className="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Rampa</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/docs" className="text-sm text-white font-medium">Docs</Link>
            <Link href="/get-started" className="text-sm text-gray-400 hover:text-white transition-colors">Get Started</Link>
            <Link href="/get-started" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Create account</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 text-sm">
            {[
              { title: 'Overview', items: ['Introduction', 'Authentication', 'Errors'] },
              { title: 'Onramp', items: ['Payment Methods', 'Exchange Rates', 'Create Order', 'Order Status'] },
              { title: 'Verification', items: ['Verify Payment (Public)', 'Verify Payment (Partner)'] },
              { title: 'Webhooks', items: ['Webhook Events', 'Webhook Security'] },
            ].map(({ title, items }) => (
              <div key={title}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{title}</p>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item}><a href={`#${item.toLowerCase().replace(/[^a-z]/g, '-')}`} className="text-gray-400 hover:text-white transition-colors block py-1">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0 space-y-16">

          <section id="introduction">
            <div className="inline-flex items-center border border-white/10 rounded-full px-3 py-1 text-xs text-gray-400 mb-6">API Reference v1</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">API Documentation</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">The Rampa API lets you integrate mobile money onramp and offramp into your application. Accept M-Pesa, Airtel Money, Tigo Pesa, and Halopesa — settle automatically in USDT/USDC on BEP20, TRC20, Base, or Polygon.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[['Base URL', 'rampa-production.up.railway.app'], ['Version', 'v1'], ['Auth', 'X-API-Key header']].map(([label, value]) => (
                <div key={label} className="bg-[#161b22] border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-sm font-mono text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="authentication">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Authentication</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">All partner API requests require an API key in the <code className="bg-white/5 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">X-API-Key</code> header. Public endpoints (customer payment verification) require no auth.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">Request header</span></div>
              <div className="p-5 font-mono text-sm"><span className="text-gray-500">X-API-Key: </span><span className="text-orange-400">sk_live_your_api_key_here</span></div>
            </div>
          </section>

          <section id="payment-methods">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500/10 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-500/20 font-mono">GET</span>
              <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
            </div>
            <p className="text-gray-400 mb-4">Returns active payment methods for a country.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">GET /api/v1/partner/payment-methods?country_code=TZ</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/payment-methods?country_code=TZ'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_key'</span>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"payment_methods"</span>: [{'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"id"</span>: <span className="text-orange-400">"lipa-number"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"provider"</span>: <span className="text-orange-400">"Lipa Number (All Providers)"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"account_number"</span>: <span className="text-orange-400">"70005436"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"limits"</span>: {'{'} <span className="text-green-400">"min"</span>: <span className="text-yellow-400">1000</span>, <span className="text-green-400">"max"</span>: <span className="text-yellow-400">10000000</span> {'}'}<br/>
                &nbsp;&nbsp;{'}'}]<br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="create-order">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20 font-mono">POST</span>
              <h2 className="text-2xl font-bold tracking-tight">Create Order (Onramp)</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Creates a buy order. Returns payment instructions. Once the customer pays and verifies, USDT/USDC is automatically sent to their wallet.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">POST /api/v1/partner/onramp</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_usdt"</span>: <span className="text-yellow-400">10</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"destination_address"</span>: <span className="text-orange-400">"0xYourWalletAddress"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"payment_method_id"</span>: <span className="text-orange-400">"lipa-number"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"user_phone"</span>: <span className="text-orange-400">"255765123456"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"country_code"</span>: <span className="text-orange-400">"TZ"</span><br/>
                {'}'}
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  {['Parameter','Type','Required','Description'].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['amount_usdt','number','Yes','Amount of USDT/USDC to send'],
                    ['destination_address','string','Yes','Customer wallet address'],
                    ['payment_method_id','string','Yes','"lipa-number" for Tanzania'],
                    ['network','string','Yes','BEP20 | TRC20 | BASE | POLYGON'],
                    ['country_code','string','Yes','TZ | KE | UG'],
                    ['user_phone','string','No','Customer phone number'],
                  ].map(([p,t,r,d]) => (
                    <tr key={p}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-300">{p}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{t}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{r}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"PENDING"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_fiat"</span>: <span className="text-yellow-400">25800</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"TZS"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"payment_instructions"</span>: {'{'} <span className="text-green-400">"account_number"</span>: <span className="text-orange-400">"70005436"</span> {'}'}<br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="exchange-rates">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500/10 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-500/20 font-mono">GET</span>
              <h2 className="text-2xl font-bold tracking-tight">Exchange Rates</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Returns current exchange rates for a country. Rates are refreshed every 5 minutes from live market data.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">GET /api/v1/partner/rates?country_code=TZ</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/rates?country_code=TZ'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_key'</span>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"country"</span>: {'{'} <span className="text-green-400">"code"</span>: <span className="text-orange-400">"TZ"</span>, <span className="text-green-400">"currency"</span>: <span className="text-orange-400">"TZS"</span> {'}'},<br/>
                &nbsp;&nbsp;<span className="text-green-400">"rates"</span>: {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"USDT_TZS"</span>: <span className="text-yellow-400">2580</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"USDC_TZS"</span>: <span className="text-yellow-400">2578</span><br/>
                &nbsp;&nbsp;{'}'},<br/>
                &nbsp;&nbsp;<span className="text-green-400">"updated_at"</span>: <span className="text-orange-400">"2026-02-20T12:00:00.000Z"</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="order-status">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500/10 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-500/20 font-mono">GET</span>
              <h2 className="text-2xl font-bold tracking-tight">Order Status</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Retrieve the current status and details of an order by its order number. Use this to poll for updates or display order details to your customer.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">GET /api/v1/partner/orders/{'{orderNumber}'}</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/orders/ORD-20260220-7450'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_key'</span>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order"</span>: {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"type"</span>: <span className="text-orange-400">"BUY"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"amount_crypto"</span>: <span className="text-yellow-400">10</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"crypto_type"</span>: <span className="text-orange-400">"USDT"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"amount_fiat"</span>: <span className="text-yellow-400">25800</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"TZS"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"destination_address"</span>: <span className="text-orange-400">"0xYourWalletAddress"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172..."</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"created_at"</span>: <span className="text-orange-400">"2026-02-20T12:30:00.000Z"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"completed_at"</span>: <span className="text-orange-400">"2026-02-20T12:35:00.000Z"</span><br/>
                &nbsp;&nbsp;{'}'}<br/>
                {'}'}
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Meaning</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['PENDING', 'Order created, awaiting customer payment'],
                    ['PROCESSING', 'Payment verified, sending crypto to wallet'],
                    ['COMPLETED', 'Crypto successfully sent to destination wallet'],
                    ['FAILED', 'Order failed — check error_message field'],
                    ['EXPIRED', 'Order expired before payment was received'],
                  ].map(([status, meaning]) => (
                    <tr key={status}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-300">{status}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="verify-payment--public-">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20 font-mono">POST</span>
              <h2 className="text-2xl font-bold tracking-tight">Verify Payment (Public)</h2>
            </div>
            <p className="text-gray-400 mb-2 leading-relaxed">Customer submits their SMS Transaction ID. No API key required. On success, USDT is automatically sent to their wallet.</p>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs text-amber-400">No authentication required — safe to call from client-side or mobile app.</p>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">POST /api/v1/public/verify-payment</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"transaction_id"</span>: <span className="text-orange-400">"QH12345678"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"phone_number"</span>: <span className="text-orange-400">"255765123456"</span><br/>
                {'}'}
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"message"</span>: <span className="text-orange-400">"Payment verified! Your crypto has been sent."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_sent"</span>: <span className="text-orange-400">"10 USDT"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172..."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"explorer_url"</span>: <span className="text-orange-400">"https://bscscan.com/tx/0x5ab..."</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="verify-payment--partner-">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/20 font-mono">POST</span>
              <h2 className="text-2xl font-bold tracking-tight">Verify Payment (Partner)</h2>
            </div>
            <p className="text-gray-400 mb-2 leading-relaxed">Partner-side endpoint to verify a customer's payment on their behalf. Requires API key. Useful when you want to handle verification server-side rather than exposing it to the customer.</p>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs text-blue-400">Requires <code className="bg-white/5 px-1 rounded font-mono">X-API-Key</code> authentication. Call this from your backend only.</p>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">POST /api/v1/partner/verify-payment</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl -X POST </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/verify-payment'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_key'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'Content-Type: application/json'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-d </span><span className="text-green-400">'{'{'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"transaction_id"</span>: <span className="text-orange-400">"QH12345678"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"phone_number"</span>: <span className="text-orange-400">"255765123456"</span><br/>
                &nbsp;&nbsp;<span className="text-green-400">{'}'}'</span>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response 200</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"message"</span>: <span className="text-orange-400">"Payment verified and crypto sent successfully."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_sent"</span>: <span className="text-orange-400">"10 USDT"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172..."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"explorer_url"</span>: <span className="text-orange-400">"https://bscscan.com/tx/0x5ab..."</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="webhook-events">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Webhook Events</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">Configure a webhook URL to receive real-time order status updates as POST requests.</p>
            <div className="space-y-3 mb-6">
              {[
                ['order.created','A new order has been created and is awaiting payment.'],
                ['order.processing','Payment verified, crypto is being sent.'],
                ['order.completed','Crypto successfully sent to the destination wallet.'],
                ['order.failed','Order failed. Check error_message for details.'],
              ].map(([event, desc]) => (
                <div key={event} className="bg-[#161b22] border border-white/10 rounded-lg px-4 py-3 flex items-start gap-4">
                  <code className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded whitespace-nowrap">{event}</code>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Webhook payload (order.completed)</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"event"</span>: <span className="text-orange-400">"order.completed"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_crypto"</span>: <span className="text-yellow-400">10</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"USDT"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172a968fb..."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"timestamp"</span>: <span className="text-orange-400">"2026-02-20T12:35:00.000Z"</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="webhook-security">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Webhook Security</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">Every webhook request includes an <code className="bg-white/5 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">X-Rampa-Signature</code> header. Always verify it before processing the payload.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Verify signature — Node.js</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-blue-400">const</span> crypto = <span className="text-blue-400">require</span>(<span className="text-orange-400">'crypto'</span>);<br/><br/>
                <span className="text-blue-400">function</span> <span className="text-green-400">verifyWebhook</span>(payload, signature, secret) {'{'}<br/>
                &nbsp;&nbsp;<span className="text-blue-400">const</span> computed = crypto<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;.createHmac(<span className="text-orange-400">'sha256'</span>, secret)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;.update(<span className="text-blue-400">JSON</span>.stringify(payload))<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;.digest(<span className="text-orange-400">'hex'</span>);<br/>
                &nbsp;&nbsp;<span className="text-blue-400">return</span> computed === signature;<br/>
                {'}'}
              </div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-amber-400">Always reject webhooks with invalid signatures. Never process a webhook payload without verifying it first.</p>
            </div>
          </section>

          <section id="errors">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Errors</h2>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Meaning</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {[['400','Bad Request — missing or invalid parameters'],['401','Unauthorized — invalid or missing API key'],['404','Not Found — order does not exist'],['409','Conflict — order already verified'],['429','Too Many Requests — rate limit exceeded'],['500','Internal Server Error']].map(([code, meaning]) => (
                    <tr key={code}>
                      <td className="px-4 py-3 font-mono text-xs text-red-400">{code}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>

      <footer className="border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center"><Sparkles className="w-3 h-3 text-white" /></div>
            <span className="text-sm text-gray-500">Rampa</span>
          </Link>
          <p className="text-sm text-gray-600">© 2026 Rampa. Open-source fiat-to-crypto onramp API.</p>
        </div>
      </footer>
    </div>
  );
}
