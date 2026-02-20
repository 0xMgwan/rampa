import Link from 'next/link';
import { ArrowLeft, Key, TrendingUp, Activity, DollarSign, Copy, Check, Globe, Zap, AlertCircle } from 'lucide-react';

export default function PartnerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
              OnRampa Partner
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Demo Partner</span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                DP
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">Partner Dashboard</h1>
          <p className="text-xl text-gray-400">Monitor your onramp integration and earnings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">$12,450</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Volume</h3>
            <p className="text-green-400 text-xs mt-1">+18% this month</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">156</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Transactions</h3>
            <p className="text-blue-400 text-xs mt-1">24 this week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">$374</span>
            </div>
            <h3 className="text-gray-400 text-sm">Commission Earned</h3>
            <p className="text-purple-400 text-xs mt-1">3% per transaction</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">98.7%</span>
            </div>
            <h3 className="text-gray-400 text-sm">Success Rate</h3>
            <p className="text-green-400 text-xs mt-1">Excellent performance</p>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">API Credentials</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">API Key</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-cyan-300">
                  sk_test_demo_partner_key_12345
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-xl transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">Use this key in the X-API-Key header for all API requests</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Webhook URL</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="https://your-domain.com/webhooks/onrampa"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors">
                  Save
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">We'll send order status updates to this URL</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">Rate Limit</h3>
                <p className="text-gray-400 text-sm">100 requests per minute</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">IP Whitelist</h3>
                <p className="text-gray-400 text-sm">All IPs allowed (dev mode)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
            </div>
            <Link href="/docs" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
              View API Docs →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Commission</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-cyan-400 font-mono text-sm">ORD-20260220-1234</td>
                  <td className="py-4 px-4 text-white">Buy (Onramp)</td>
                  <td className="py-4 px-4 text-white font-semibold">50 USDT</td>
                  <td className="py-4 px-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Completed</span>
                  </td>
                  <td className="py-4 px-4 text-green-400 font-semibold">$1.50</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">2 hours ago</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-cyan-400 font-mono text-sm">ORD-20260220-1235</td>
                  <td className="py-4 px-4 text-white">Buy (Onramp)</td>
                  <td className="py-4 px-4 text-white font-semibold">100 USDC</td>
                  <td className="py-4 px-4">
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-xs">Pending</span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">$0.00</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">5 hours ago</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-cyan-400 font-mono text-sm">ORD-20260220-1236</td>
                  <td className="py-4 px-4 text-white">Sell (Offramp)</td>
                  <td className="py-4 px-4 text-white font-semibold">75 USDT</td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs">Processing</span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">$0.00</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">1 day ago</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-cyan-400 font-mono text-sm">ORD-20260219-8821</td>
                  <td className="py-4 px-4 text-white">Buy (Onramp)</td>
                  <td className="py-4 px-4 text-white font-semibold">200 USDT</td>
                  <td className="py-4 px-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Completed</span>
                  </td>
                  <td className="py-4 px-4 text-green-400 font-semibold">$6.00</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">2 days ago</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-cyan-400 font-mono text-sm">ORD-20260218-7745</td>
                  <td className="py-4 px-4 text-white">Buy (Onramp)</td>
                  <td className="py-4 px-4 text-white font-semibold">25 USDC</td>
                  <td className="py-4 px-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Completed</span>
                  </td>
                  <td className="py-4 px-4 text-green-400 font-semibold">$0.75</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">3 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Integration Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">API Key Active</span>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Live</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Webhook Configured</span>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Test Mode</span>
                </div>
                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-xs">Sandbox</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Quick Stats</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400">Avg. Transaction Size</span>
                <span className="text-white font-semibold">$79.80</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400">Countries Served</span>
                <span className="text-white font-semibold">Tanzania, Kenya</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-gray-400">Supported Networks</span>
                <span className="text-white font-semibold">BEP20, TRC20, Base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/docs" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all text-center group">
            <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">API Documentation</h3>
            <p className="text-gray-400 text-sm">Integration guides & examples</p>
          </Link>
          
          <button className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all text-center group">
            <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Test API</h3>
            <p className="text-gray-400 text-sm">Try sample requests</p>
          </button>
          
          <button className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all text-center group">
            <Key className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Generate New Key</h3>
            <p className="text-gray-400 text-sm">Rotate your API credentials</p>
          </button>
        </div>
      </div>
    </div>
  );
}
