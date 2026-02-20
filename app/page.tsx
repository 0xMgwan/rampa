import Link from 'next/link';
import { ArrowRight, Shield, Check, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Rampa</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</Link>
            <Link href="/get-started" className="text-sm text-gray-400 hover:text-white transition-colors">Get Started</Link>
            <Link href="/get-started" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
            <Shield className="w-4 h-4 text-blue-400" />
            For banks, fintechs &amp; PSPs
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
            Get started with the<br />
            <span className="text-white">Rampa integration</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
            Rampa is a B2B2C payment infrastructure layer. Banks, fintechs, and payment service providers use our APIs to initiate cross-border payouts, while Rampa manages orchestration, digital-asset token settlement, and downstream fiat delivery.
          </p>
          <div className="flex items-center gap-6 mb-12">
            <Link href="/get-started" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create an account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/docs" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Skip to authenticated API docs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
              </div>
              Omni-channel payment layer
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
              </div>
              Pay anywhere, settle everywhere
            </div>
          </div>
        </div>

        {/* Right - Integration panel */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6">
          <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-5">Integration at a glance</p>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="border border-blue-500/40 bg-blue-500/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-white">Initiate a payment order</span>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Your backend creates a payment order with amount, corridor, and recipient details. Rampa assigns the optimal route behind the scenes.
              </p>
              <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed">
                <span className="text-blue-400">POST</span> /api/v1/partner/onramp<br />
                <span className="text-gray-500">X-API-Key: YOUR_API_KEY</span><br />
                <span className="text-gray-500">Content-Type: application/json</span><br />
                <br />
                {'{'}<br />
                &nbsp;&nbsp;<span className="text-green-400">"amount_usdt"</span>: <span className="text-yellow-400">10</span>,<br />
                &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br />
                &nbsp;&nbsp;<span className="text-green-400">"payment_method_id"</span>: <span className="text-orange-400">"lipa-number"</span>,<br />
                &nbsp;&nbsp;<span className="text-green-400">"destination_address"</span>: <span className="text-orange-400">"0xABC..."</span><br />
                {'}'}
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
                <span className="text-sm font-medium text-white">Use one API, multiple fulfillment rails</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                You integrate once with Rampa. We handle routing across M-Pesa, Airtel Money, Tigo Pesa, and Halopesa — with automatic USDT settlement.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full" />
                <span className="text-sm font-medium text-white">Compliance-friendly wording</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The platform abstracts digital-asset tokens used for settlement so banks and regulators see a clean, fiat-first experience in dashboards and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Rampa is for */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Who Rampa is for</h2>
          <p className="text-gray-400 leading-relaxed">
            Start with the track that matches your role. The underlying APIs are the same; what changes is how you expose them to your customers and how revenue is shared.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Senders</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Banks &amp; Financial Institutions</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Offer cross-border payouts to your customers without building settlement rails from scratch. Rampa acts as the orchestration and settlement layer behind your existing channels.
            </p>
            <ul className="space-y-2 mb-6">
              {['Initiate cross-border payouts via a simple REST API', 'Keep full control of pricing and markup', 'White-label experience for web and mobile channels'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/get-started" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View integration steps <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">B2B2C</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Fintechs &amp; Platforms</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Embed cross-border settlement flows into your product. Use Rampa as the payment fabric while you own the end-customer relationship.
            </p>
            <ul className="space-y-2 mb-6">
              {['Server-side APIs for initiating and tracking payment orders', 'Webhook-first design for status and reconciliation', 'Multi-tenant friendly for marketplaces and platforms'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/get-started" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View integration steps <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Providers</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">PSPs &amp; Liquidity Providers</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Plug your payout infrastructure into Rampa to receive order flow from banks and platforms.
            </p>
            <ul className="space-y-2 mb-6">
              {['Expose your fiat corridors and limits via a single integration', 'Receive assigned orders with full metadata', 'Track commissions and settlement performance'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/get-started" className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View integration steps <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Step-by-step integration */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Step-by-step integration</h2>
        <p className="text-gray-400 mb-10 max-w-2xl">
          Choose the track that matches your role. Each guide walks through authentication, creating a payment order, handling webhooks, and reconciling payouts across mobile money and blockchain rails.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <h3 className="text-base font-semibold mb-5">Banks &amp; Financial Institutions – server-side flow</h3>
            <ol className="space-y-4">
              {[
                { n: 1, bold: 'Create an API key in Settings → API Keys', rest: ' (test first, then live).' },
                { n: 2, bold: 'Call the Payment Orders API', rest: ' from your core banking backend or integration layer.' },
                { n: 3, bold: 'Fund the route', rest: ' using your chosen settlement method (mobile money or blockchain).' },
                { n: 4, bold: 'Listen to webhooks', rest: ' to update customer-facing channels and back-office systems.' },
              ].map(({ n, bold, rest }) => (
                <li key={n} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-gray-600 font-mono mt-0.5">{n}.</span>
                  <span><strong className="text-white font-medium">{bold}</strong>{rest}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Right panel */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <h3 className="text-base font-semibold mb-2">Common lifecycle &amp; webhook example</h3>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Regardless of the track, every integration follows the same pattern: create an order, fund it, receive status updates, and reconcile.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-gray-300 leading-relaxed">
              <span className="text-gray-500">{'// Example webhook payload (order.completed)'}</span><br />
              {'{'}<br />
              &nbsp;&nbsp;<span className="text-green-400">"event"</span>: <span className="text-orange-400">"order.completed"</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"order_number"</span>: <span className="text-orange-400">"ORD-20260220-7450"</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"status"</span>: <span className="text-orange-400">"COMPLETED"</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"amount_crypto"</span>: <span className="text-yellow-400">10</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"currency"</span>: <span className="text-orange-400">"USDT"</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"network"</span>: <span className="text-orange-400">"BEP20"</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"tx_hash"</span>: <span className="text-orange-400">"0x5ab827..."</span>,<br />
              &nbsp;&nbsp;<span className="text-green-400">"timestamp"</span>: <span className="text-orange-400">"2026-02-20T12:35:00Z"</span><br />
              {'}'}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-500">Rampa</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 Rampa. Open-source fiat-to-crypto onramp API.</p>
        </div>
      </footer>
    </div>
  );
}
