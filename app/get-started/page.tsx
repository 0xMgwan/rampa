import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function GetStartedPage() {
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
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</Link>
            <Link href="/get-started" className="text-sm text-white font-medium">Get Started</Link>
            <Link href="/get-started" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Create account</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 text-sm">
            {[
              { title: 'Quick Start', items: ['Overview', 'Authentication', 'Your First Order'] },
              { title: 'Integration', items: ['Create Order', 'Customer Payment', 'Verify Payment', 'Webhooks'] },
              { title: 'Reference', items: ['Supported Networks', 'Payment Methods', 'Error Codes'] },
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

          <section id="overview">
            <div className="inline-flex items-center border border-white/10 rounded-full px-3 py-1 text-xs text-gray-400 mb-6">Quick Start Guide</div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get Started in Minutes</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">Integrate Rampa into your application and start accepting mobile money payments for crypto in just a few steps.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: '01', title: 'Get API Key', desc: 'Contact us to receive your partner API credentials' },
                { n: '02', title: 'Create Order', desc: 'POST to our API with amount and destination wallet' },
                { n: '03', title: 'Auto Settlement', desc: 'USDT/USDC sent automatically once payment verified' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="bg-[#161b22] border border-white/10 rounded-xl p-5">
                  <p className="text-xs font-mono text-gray-600 mb-3">{n}</p>
                  <p className="text-sm font-semibold text-white mb-1">{title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="authentication">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">1</div>
              <h2 className="text-2xl font-bold tracking-tight">Authentication</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">All partner API requests require your API key in the <code className="bg-white/5 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">X-API-Key</code> header. Never expose this key client-side.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">Example authenticated request</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/rates?country_code=TZ'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_api_key_here'</span>
              </div>
            </div>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-amber-400">Always make API calls from your backend server. Never include API keys in client-side code or mobile apps.</p>
            </div>
          </section>

          <section id="your-first-order">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">2</div>
              <h2 className="text-2xl font-bold tracking-tight">Create Your First Order</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Create a buy order (onramp) to convert TZS to USDT. The response contains payment instructions for the customer.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">POST /api/v1/partner/onramp</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-gray-500">curl -X POST </span><span className="text-orange-400">'https://rampa-production.up.railway.app/api/v1/partner/onramp'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'X-API-Key: sk_live_your_key'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-H </span><span className="text-green-400">'Content-Type: application/json'</span> \<br/>
                &nbsp;&nbsp;<span className="text-gray-500">-d </span><span className="text-green-400">'{'{'}</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"amount_usdt"</span>: <span className="text-yellow-400">10</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"destination_address"</span>: <span className="text-orange-400">"0xYourWalletAddress"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"payment_method_id"</span>: <span className="text-orange-400">"lipa-number"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"user_phone"</span>: <span className="text-orange-400">"255765123456"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"country_code"</span>: <span className="text-orange-400">"TZ"</span><br/>
                &nbsp;&nbsp;<span className="text-green-400">{'}'}'</span>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response — save the order_number</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order"</span>: {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"PENDING"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"amount_fiat"</span>: <span className="text-yellow-400">25800</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"TZS"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"payment_instructions"</span>: {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"account_number"</span>: <span className="text-orange-400">"70005436"</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"instructions"</span>: <span className="text-orange-400">"Pay TZS 25,800 to Lipa Number 70005436"</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                &nbsp;&nbsp;{'}'}<br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="customer-payment">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">3</div>
              <h2 className="text-2xl font-bold tracking-tight">Customer Makes Payment</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Customer pays the TZS amount to Lipa Number <strong className="text-white">70005436</strong> using M-Pesa, Airtel Money, Tigo Pesa, or Halopesa. They receive an SMS with a Transaction ID.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl p-6 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Example SMS from M-Pesa</p>
              <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed">
                You have paid TZS 25,800.00 to VICTOR AMOS MUHAGACHI<br/>
                <span className="text-green-400 font-semibold">Transaction ID: QH12345678</span><br/>
                Date: 20/02/2026 14:30<br/>
                Balance: TZS 50,000.00
              </div>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-400">Customer must save the <strong>Transaction ID</strong> from their SMS to verify payment in the next step.</p>
            </div>
          </section>

          <section id="verify-payment">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">4</div>
              <h2 className="text-2xl font-bold tracking-tight">Verify Payment</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Customer submits their Transaction ID. This endpoint requires no API key — call it directly from your frontend or mobile app. USDT is sent automatically on success.</p>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500 font-mono">POST /api/v1/public/verify-payment — No auth required</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"transaction_id"</span>: <span className="text-orange-400">"QH12345678"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"phone_number"</span>: <span className="text-orange-400">"255765123456"</span><br/>
                {'}'}
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Response — crypto sent automatically</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"success"</span>: <span className="text-blue-400">true</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"message"</span>: <span className="text-orange-400">"Payment verified! Your crypto has been sent."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_sent"</span>: <span className="text-orange-400">"10 USDT"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172..."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"explorer_url"</span>: <span className="text-orange-400">"https://bscscan.com/tx/0x5ab..."</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="webhooks">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">5</div>
              <h2 className="text-2xl font-bold tracking-tight">Receive Webhooks</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">Configure a webhook URL to receive real-time notifications when order status changes. All events are signed with your webhook secret.</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { event: 'order.created', desc: 'New order awaiting payment' },
                { event: 'order.processing', desc: 'Payment verified, sending crypto' },
                { event: 'order.completed', desc: 'Crypto sent to wallet' },
                { event: 'order.failed', desc: 'Order failed, check error_message' },
              ].map(({ event, desc }) => (
                <div key={event} className="bg-[#161b22] border border-white/10 rounded-lg px-4 py-3 flex items-start gap-3">
                  <code className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded whitespace-nowrap">{event}</code>
                  <p className="text-xs text-gray-400 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5"><span className="text-xs text-gray-500">Webhook payload example</span></div>
              <div className="p-5 font-mono text-xs text-gray-300 leading-relaxed">
                {'{'}<br/>
                &nbsp;&nbsp;<span className="text-green-400">"event"</span>: <span className="text-orange-400">"order.completed"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"amount_crypto"</span>: <span className="text-yellow-400">10</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"USDT"</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab8275d60ef7eb172a968fb..."</span>,<br/>
                &nbsp;&nbsp;<span className="text-green-400">"timestamp"</span>: <span className="text-orange-400">"2026-02-20T12:35:00.000Z"</span><br/>
                {'}'}
              </div>
            </div>
          </section>

          <section id="supported-networks">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Supported Networks</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { network: 'BEP20', chain: 'Binance Smart Chain', token: 'USDT / USDC', speed: '~5 seconds' },
                { network: 'TRC20', chain: 'Tron', token: 'USDT / USDC', speed: '~3 seconds' },
                { network: 'BASE', chain: 'Base (Coinbase)', token: 'USDT / USDC', speed: '~2 seconds' },
                { network: 'POLYGON', chain: 'Polygon', token: 'USDT / USDC', speed: '~5 seconds' },
              ].map(({ network, chain, token, speed }) => (
                <div key={network} className="bg-[#161b22] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-sm font-mono font-semibold text-white">{network}</code>
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">{speed}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{chain}</p>
                  <p className="text-xs text-gray-500">{token}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-blue-600 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to go deeper?</h3>
            <p className="text-blue-100 text-sm mb-6">Explore the full API reference for all endpoints, parameters, and response schemas.</p>
            <Link href="/docs" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              Full API Documentation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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
