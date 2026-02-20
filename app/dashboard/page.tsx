'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowLeft, Copy, Check, TrendingUp, Activity, DollarSign, Zap, RefreshCw, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

const API_KEY = 'sk_test_demo_partner_key_12345';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

const explorers: Record<string, string> = {
  BEP20: 'https://bscscan.com',
  TRC20: 'https://tronscan.org',
  BASE: 'https://basescan.org',
  POLYGON: 'https://polygonscan.com',
};

const statusColors: Record<string, string> = {
  COMPLETED: 'text-green-400 bg-green-500/10',
  PROCESSING: 'text-blue-400 bg-blue-500/10',
  PENDING: 'text-yellow-400 bg-yellow-500/10',
  FAILED: 'text-red-400 bg-red-500/10',
  EXPIRED: 'text-gray-400 bg-gray-500/10',
};

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);
  const [markup, setMarkup] = useState('2.5');
  const [activeProvider, setActiveProvider] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [rateSaved, setRateSaved] = useState(false);
  const [liquidityChain, setLiquidityChain] = useState('BEP20');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [liquidityToken, setLiquidityToken] = useState('USDT');
  const [liquiditySaved, setLiquiditySaved] = useState(false);
  const [dashData, setDashData] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/partner/dashboard', { headers: { 'X-API-Key': API_KEY } });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load');
      setDashData(data);
      if (data.partner?.webhookUrl) setWebhookUrl(data.partner.webhookUrl);
      if (data.providers?.length) setActiveProvider(data.providers[0].id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWallets = useCallback(async () => {
    setWalletsLoading(true);
    try {
      const res = await fetch('/api/v1/partner/wallet-balances', { headers: { 'X-API-Key': API_KEY } });
      const data = await res.json();
      if (data.success) setWallets(data.balances);
    } catch {
      // wallets fail if keys not configured
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); fetchWallets(); }, [fetchDashboard, fetchWallets]);

  const handleCopy = () => { navigator.clipboard.writeText(API_KEY); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleSaveRate = () => { setRateSaved(true); setTimeout(() => setRateSaved(false), 2000); };
  const handleSetLiquidity = () => { setLiquiditySaved(true); setTimeout(() => setLiquiditySaved(false), 2000); };

  const baseRate = dashData?.rates?.find((r: any) => r.currency === 'TZS')?.usdtBuy || 0;
  const markupPct = parseFloat(markup) || 0;
  const effectiveRate = baseRate > 0 ? Math.round(baseRate * (1 + markupPct / 100)) : 0;
  const activeWallet = wallets.find(w => w.network === liquidityChain);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="bg-[#161b22] border border-red-500/20 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  const { stats, recentOrders, rates, providers, partner } = dashData || {};

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
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
            <button onClick={() => { fetchDashboard(); fetchWallets(); }} className="text-gray-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              {partner?.name?.slice(0, 2).toUpperCase() || 'DP'}
            </div>
            <span className="text-sm text-gray-400">{partner?.name || 'Partner'}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Partner Dashboard</h1>
          <p className="text-gray-400 text-sm">Monitor your integration, manage providers, and customize exchange rates.</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: 'Total Volume', value: `${parseFloat(stats?.totalVolume || '0').toFixed(2)} USDT`, sub: stats?.monthGrowth !== undefined ? `${stats.monthGrowth >= 0 ? '+' : ''}${stats.monthGrowth}% this month` : 'No data yet', color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Activity, label: 'Total Transactions', value: String(stats?.totalTransactions ?? 0), sub: `${stats?.thisWeekTransactions ?? 0} this week`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: TrendingUp, label: 'Commission Earned', value: `${parseFloat(stats?.commission || '0').toFixed(2)} USDT`, sub: '3% per transaction', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Zap, label: 'Success Rate', value: `${stats?.successRate ?? '0.0'}%`, sub: parseFloat(stats?.successRate || '0') >= 95 ? 'Excellent performance' : parseFloat(stats?.successRate || '0') >= 80 ? 'Good performance' : 'Needs attention', color: 'text-orange-400', bg: 'bg-orange-500/10' },
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

        {/* Exchange Rates + Providers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Exchange Rates</h2>
                <p className="text-xs text-gray-500 mt-0.5">Live rates from database · Add your markup</p>
              </div>
              <button onClick={fetchDashboard} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {rates && rates.length > 0 ? rates.map((r: any) => (
                <div key={r.country} className="flex items-center justify-between bg-[#0d1117] rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-mono font-medium">USDT / {r.currency}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Updated {timeAgo(r.updatedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">{r.usdtBuy.toLocaleString()}</p>
                    <p className="text-xs text-green-400">Live</p>
                  </div>
                </div>
              )) : (
                <div className="bg-[#0d1117] rounded-lg px-4 py-3 text-xs text-gray-500">No exchange rates configured yet.</div>
              )}
            </div>
            <div className="border-t border-white/5 pt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Markup</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-2">
                  <input type="number" value={markup} onChange={e => setMarkup(e.target.value)} className="bg-transparent text-white text-sm font-mono w-full outline-none" step="0.1" min="0" max="10" />
                  <span className="text-gray-500 text-sm">%</span>
                </div>
                <button onClick={handleSaveRate} className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${rateSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {rateSaved ? '✓ Saved' : 'Save'}
                </button>
              </div>
              {baseRate > 0 && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-400">
                    Customers see: <span className="text-white font-mono font-medium">1 USDT = {effectiveRate.toLocaleString()} TZS</span>
                    <span className="text-blue-400 ml-2">(base {baseRate.toLocaleString()} + {markupPct}%)</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Payment Providers</h2>
                <p className="text-xs text-gray-500 mt-0.5">Select your active payment method</p>
              </div>
              {providers && <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">{providers.length} active</span>}
            </div>
            <div className="space-y-3">
              {providers && providers.length > 0 ? providers.map((p: any) => (
                <button key={p.id} onClick={() => setActiveProvider(p.id)}
                  className={`w-full text-left rounded-xl p-4 border transition-all ${activeProvider === p.id ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 bg-[#0d1117] hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeProvider === p.id ? 'bg-blue-400' : 'bg-gray-600'}`} />
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    {activeProvider === p.id && <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Active</span>}
                  </div>
                  <p className="text-xs text-gray-500 ml-4">Account: <span className="font-mono text-gray-400">{p.account}</span><span className="ml-2 text-gray-600">· {p.country}</span></p>
                </button>
              )) : (
                <div className="bg-[#0d1117] rounded-lg px-4 py-3 text-xs text-gray-500">No providers configured yet.</div>
              )}
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
                <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 truncate">{API_KEY}</div>
                <button onClick={handleCopy} className="bg-[#0d1117] border border-white/10 rounded-lg p-3 hover:border-white/20 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">Use in <code className="text-gray-500">X-API-Key</code> header for all partner API requests</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Webhook URL</p>
              <div className="flex items-center gap-2">
                <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-domain.com/webhooks/rampa"
                  className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors">Save</button>
              </div>
              <p className="text-xs text-gray-600 mt-2">We will POST order status updates to this URL</p>
            </div>
          </div>
        </div>

        {/* Hot Wallet Liquidity */}
        <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold">Hot Wallet Liquidity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Live balances per chain for automatic payouts</p>
            </div>
            <button onClick={fetchWallets} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg px-3 py-1.5">
              <RefreshCw className={`w-3.5 h-3.5 ${walletsLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mb-6">
            {(['BEP20', 'TRC20', 'BASE', 'POLYGON'] as const).map(chain => {
              const w = wallets.find(x => x.network === chain);
              const bal = parseFloat(w?.usdt || '0');
              return (
                <button key={chain} onClick={() => setLiquidityChain(chain)}
                  className={`text-left rounded-xl p-4 border transition-all ${liquidityChain === chain ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 bg-[#0d1117] hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-semibold ${liquidityChain === chain ? 'text-blue-400' : 'text-gray-400'}`}>{chain}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${walletsLoading ? 'bg-gray-600' : w?.error ? 'bg-red-400' : bal > 100 ? 'bg-green-400' : bal > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                  </div>
                  {walletsLoading ? (
                    <div className="h-7 w-16 bg-white/5 rounded animate-pulse mb-1" />
                  ) : (
                    <p className="text-lg font-bold text-white">{w?.error ? 'N/A' : parseFloat(w?.usdt || '0').toFixed(2)}</p>
                  )}
                  <p className="text-xs text-gray-500">USDT available</p>
                </button>
              );
            })}
          </div>
          <div className="bg-[#0d1117] rounded-xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-white mb-1">{liquidityChain} Hot Wallet</p>
                {activeWallet?.address
                  ? <p className="text-xs font-mono text-gray-500 truncate max-w-xs">{activeWallet.address}</p>
                  : <p className="text-xs text-gray-600">Address not configured — set HOT_WALLET_PRIVATE_KEY_{liquidityChain} in env</p>}
              </div>
              {activeWallet?.address && (
                <a href={`${explorers[liquidityChain]}/address/${activeWallet.address}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-2">Token</p>
                <div className="flex gap-2">
                  {['USDT', 'USDC'].map(token => (
                    <button key={token} onClick={() => setLiquidityToken(token)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${liquidityToken === token ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#161b22] border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {token}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Set Liquidity Amount</p>
                <div className="flex items-center bg-[#161b22] border border-white/10 rounded-lg px-3 py-2.5 gap-2">
                  <input type="number" value={liquidityAmount} onChange={e => setLiquidityAmount(e.target.value)} placeholder="e.g. 500"
                    className="bg-transparent text-white text-sm font-mono w-full outline-none placeholder-gray-600" />
                  <span className="text-xs text-gray-500 font-mono">{liquidityToken}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <button onClick={handleSetLiquidity}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${liquiditySaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {liquiditySaved ? '✓ Updated' : `Set ${liquidityChain} Liquidity`}
                </button>
              </div>
            </div>
            {activeWallet && !activeWallet.error && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#161b22] rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">USDT Balance</p>
                  <p className="text-sm font-mono font-semibold text-white">{parseFloat(activeWallet.usdt || '0').toFixed(4)}</p>
                </div>
                <div className="bg-[#161b22] rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">USDC Balance</p>
                  <p className="text-sm font-mono font-semibold text-white">{parseFloat(activeWallet.usdc || '0').toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Orders</h2>
            <Link href="/docs#order-status" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              API Docs <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="divide-y divide-white/5">
              {recentOrders.map((order: any) => (
                <div key={order.orderNumber} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="text-sm font-mono text-white">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{timeAgo(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{order.amount}</p>
                      <p className="text-xs text-gray-500">{order.fiat}</p>
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded hidden md:block">{order.network}</span>
                    {order.txHash && (
                      <a href={`${explorers[order.network] || '#'}/tx/${order.txHash}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 hidden lg:flex items-center gap-1">
                        Tx <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || 'text-gray-400 bg-gray-500/10'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">No orders yet. Create your first order via the API.</p>
              <Link href="/get-started" className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Get Started <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
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
