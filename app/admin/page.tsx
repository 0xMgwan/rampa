import Link from 'next/link';
import { ArrowLeft, Database, DollarSign, Globe, Activity, Users, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-purple-400" />
            OnRampa Admin
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-xl text-gray-400">Manage your onramp API configuration and monitor transactions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">24</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Orders</h3>
            <p className="text-green-400 text-xs mt-1">+12% from last week</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">$12.5K</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Volume</h3>
            <p className="text-green-400 text-xs mt-1">+8% from last week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-gray-400 text-sm">Active Partners</h3>
            <p className="text-gray-400 text-xs mt-1">1 demo account</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">95%</span>
            </div>
            <h3 className="text-gray-400 text-sm">Success Rate</h3>
            <p className="text-green-400 text-xs mt-1">Excellent performance</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Countries</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">Tanzania (TZ)</h3>
                  <p className="text-gray-400 text-sm">TZS • 4 payment methods</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">Kenya (KE)</h3>
                  <p className="text-gray-400 text-sm">KES • 1 payment method</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">Uganda (UG)</h3>
                  <p className="text-gray-400 text-sm">UGX • 2 payment methods</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
            </div>
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
              Add New Country
            </button>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Payment Providers</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">M-Pesa Tanzania</h3>
                  <p className="text-gray-400 text-sm">Mobile Money</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">Tigo Pesa</h3>
                  <p className="text-gray-400 text-sm">Mobile Money</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-white font-semibold">Airtel Money</h3>
                  <p className="text-gray-400 text-sm">Mobile Money</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">Active</span>
              </div>
            </div>
            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors">
              Add Payment Provider
            </button>
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Exchange Rates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Country</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Currency</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Buy Rate (USDT)</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Sell Rate (USDT)</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white">Tanzania</td>
                  <td className="py-4 px-4 text-gray-300">TZS</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">2,580</td>
                  <td className="py-4 px-4 text-orange-400 font-semibold">2,520</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">2 hours ago</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white">Kenya</td>
                  <td className="py-4 px-4 text-gray-300">KES</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">128</td>
                  <td className="py-4 px-4 text-orange-400 font-semibold">125</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">2 hours ago</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white">Uganda</td>
                  <td className="py-4 px-4 text-gray-300">UGX</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">3,720</td>
                  <td className="py-4 px-4 text-orange-400 font-semibold">3,630</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">2 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Update Rates
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-white font-semibold">ORD-20260220-1234</h3>
                <p className="text-gray-400 text-sm">50 USDT • M-Pesa Tanzania</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">129,000 TZS</p>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-xs">Completed</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-white font-semibold">ORD-20260220-1235</h3>
                <p className="text-gray-400 text-sm">100 USDC • Airtel Money</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">258,000 TZS</p>
                <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-xs">Pending</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex-1">
                <h3 className="text-white font-semibold">ORD-20260220-1236</h3>
                <p className="text-gray-400 text-sm">25 USDT • Tigo Pesa</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">64,500 TZS</p>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs">Processing</span>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition-colors">
            View All Orders
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Link href="/docs" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all text-center group">
            <Database className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">API Documentation</h3>
            <p className="text-gray-400 text-sm">View integration guides</p>
          </Link>
          
          <button className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all text-center group">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Manage Partners</h3>
            <p className="text-gray-400 text-sm">Add or edit API partners</p>
          </button>
          
          <button className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all text-center group">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold mb-2">Analytics</h3>
            <p className="text-gray-400 text-sm">View detailed reports</p>
          </button>
        </div>
      </div>
    </div>
  );
}
