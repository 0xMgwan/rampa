'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, ArrowLeft, Copy, Check, TrendingUp, Activity, DollarSign, Zap, RefreshCw, Settings, ChevronDown, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [markup, setMarkup] = useState('2.5');
  const [activeProvider, setActiveProvider] = useState('lipa-number');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [rateSaved, setRateSaved] = useState(false);

  const baseRate = 2580;
  const markupPct = parseFloat(markup) || 0;
  const effectiveRate = Math.round(baseRate * (1 + markupPct / 100));

  const handleCopy = () => {
    navigator.clipboard.writeText('sk_test_demo_partner_key_12345');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRate = () => {
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 2000);
  };

  const providers = [
    { id: 'lipa-number', name: 'Lipa Number (All Providers)', account: '70005436', status: 'active', networks: ['M-Pesa', 'Airtel', 'Tigo', 'Halopesa'] },
    { id: 'mpesa-tz', name: 'M-Pesa Tanzania', account: '1234567', status: 'active', networks: ['M-Pesa'] },
    { id: 'airtel-tz', name: 'Airtel Money', account: '12345678', status: 'active', networks: ['Airtel'] },
    { id: 'tigopesa-tz', name: 'Tigo Pesa', account: '123456', status: 'active', networks: ['Tigo'] },
  ];

  const recentOrders = [
    { id: 'ORD-20260220-7450', amount: '10 USDT', fiat: '25,800 TZS', status: 'COMPLETED', network: 'BEP20', time: '2 min ago' },
    { id: 'ORD-20260220-7449', amount: '5 USDT', fiat: '12,900 TZS', status: 'COMPLETED', network: 'TRC20', time: '15 min ago' },
    { id: 'ORD-20260220-7448', amount: '20 USDT', fiat: '51,600 TZS', status: 'PROCESSING', network: 'BEP20', time: '22 min ago' },
    { id: 'ORD-20260220-7447', amount: '3 USDT', fiat: '7,740 TZS', status: 'PENDING', network: 'BASE', time: '1 hr ago' },
    { id: 'ORD-20260220-7446', amount: '50 USDT', fiat: '129,000 TZS', status: 'COMPLETED', network: 'BEP20', time: '2 hr ago' },
  ];

  const statusColors: Record<string, string> = {
    COMPLETED: 'text-green-400 bg-green-500/10',
    PROCESSING: 'text-blue-400 bg-blue-500/10',
    PENDING: 'text-yellow-400 bg-yellow-500/10',
    FAILED: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Rampa</span>
              <span className="text-gray-600">/</span>
              <span className="text-sm text-gray-400">Partner Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">DP</div>
            <span className="text-sm text-gray-400">Demo Partner</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Partner Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor your integration, manage providers, and customize exchange rates.</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: 'Total Volume', value: '$12,450', sub: '+18% this month', color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Activity, label: 'Total Transactions', value: '156', sub: '24 this week', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: TrendingUp, label: 'Commission Earned', value: '$374', sub: '3% per transaction', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Zap, label: 'Success Rate', value: '98.7%', sub: 'Excellent performance', color: 'text-orange-400', bg: 'bg-orange-500/10' },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="bg-[#161b22] border border-white/10 rounded-xl p-5">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{value}</p>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-xs ${color}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Exchange Rates + Provider Switcher */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Exchange Rates */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Exchange Rates</h2>
                <p className="text-xs text-gray-500 mt-0.5">Base rate from market · Add your markup</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {/* Live base rates */}
            <div className="space-y-3 mb-6">
              {[
                { pair: 'USDT / TZS', base: '2,580', updated: '2 min ago' },
                { pair: 'USDC / TZS', base: '2,578', updated: '2 min ago' },
                { pair: 'USDT / KES', base: '129.5', updated: '2 min ago' },
              ].map(({ pair, base, updated }) => (
                <div key={pair} className="flex items-center justify-between bg-[#0d1117] rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-mono font-medium">{pair}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Updated {updated}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">{base}</p>
                    <p className="text-xs text-green-400">Live</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Markup customization */}
            <div className="border-t border-white/5 pt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Markup</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={markup}
                    onChange={e => setMarkup(e.target.value)}
                    className="bg-transparent text-white text-sm font-mono w-full outline-none"
                    step="0.1"
                    min="0"
                    max="10"
                  />
                  <span className="text-gray-500 text-sm">%</span>
                </div>
                <button
                  onClick={handleSaveRate}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${rateSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {rateSaved ? '✓ Saved' : 'Save'}
                </button>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400">
                  Your customers see: <span className="text-white font-mono font-medium">1 USDT = {effectiveRate.toLocaleString()} TZS</span>
                  <span className="text-blue-400 ml-2">(base {baseRate.toLocaleString()} + {markupPct}% markup)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Provider Switcher */}
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Payment Providers</h2>
                <p className="text-xs text-gray-500 mt-0.5">Select your active payment method</p>
              </div>
              <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">{providers.filter(p => p.status === 'active').length} active</span>
            </div>

            <div className="space-y-3">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setActiveProvider(provider.id)}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${
                    activeProvider === provider.id
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-white/5 bg-[#0d1117] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeProvider === provider.id ? 'bg-blue-400' : 'bg-gray-600'}`} />
                      <span className="text-sm font-medium">{provider.name}</span>
                    </div>
                    {activeProvider === provider.id && (
                      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 ml-4">Account: <span className="font-mono text-gray-400">{provider.account}</span></p>
                  <div className="flex gap-1.5 ml-4 mt-2 flex-wrap">
                    {provider.networks.map(n => (
                      <span key={n} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{n}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
          <h2 className="text-base font-semibold mb-5">API Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-2">API Key</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 truncate">
                  sk_test_demo_partner_key_12345
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#0d1117] border border-white/10 rounded-lg p-3 hover:border-white/20 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Use in <code className="text-gray-500">X-API-Key</code> header for all partner API requests</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Webhook URL</p>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhooks/rampa"
                  className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors">
                  Save
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">We'll POST order status updates to this URL</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Orders</h2>
            <Link href="/docs#order-status" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.map(order => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-mono text-white">{order.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-gray-500">{order.fiat}</p>
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded hidden md:block">{order.network}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Quick Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'API Documentation', desc: 'Full reference for all endpoints', href: '/docs', label: 'View Docs' },
            { title: 'Get Started Guide', desc: 'Step-by-step integration walkthrough', href: '/get-started', label: 'Read Guide' },
            { title: 'Test Payment', desc: 'Try a real payment with your Lipa Number', href: '/get-started#verify-payment', label: 'Test Now' },
          ].map(({ title, desc, href, label }) => (
            <div key={title} className="bg-[#161b22] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                {label} <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
