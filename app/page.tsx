import Link from 'next/link';
import { ArrowRight, Globe, Zap, Shield, Code, Check, Sparkles, Coins, Network } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">OnRampa</h1>
            </div>
            <div className="flex gap-6">
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/api/v1/partner/rates?country=TZ" className="text-gray-300 hover:text-white transition-colors">
                API
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400 text-sm font-medium">🚀 Production Ready • Multi-Country Support</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
            Fiat to Crypto
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Onramp API</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade USDC/USDT onramp and offramp API. Customizable for any country.
            Integrate mobile money payments with blockchain in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/docs"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              View Documentation
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>4 Blockchain Networks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>3 Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>RESTful API</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Webhook Support</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all group">
            <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Multi-Country</h3>
            <p className="text-gray-400 leading-relaxed">
              Support for Tanzania, Kenya, Uganda, and easily add more countries
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all group">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Fast Integration</h3>
            <p className="text-gray-400 leading-relaxed">
              RESTful API with comprehensive documentation and SDKs
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all group">
            <div className="bg-green-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Secure & Reliable</h3>
            <p className="text-gray-400 leading-relaxed">
              API key authentication, IP whitelisting, and webhook signatures
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-sm hover:border-orange-500/40 transition-all group">
            <div className="bg-orange-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Developer Friendly</h3>
            <p className="text-gray-400 leading-relaxed">
              Clear API responses, detailed error messages, and sandbox mode
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-xl p-10">
          <h3 className="text-3xl font-bold mb-8 text-white">Supported Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-lg text-white">Payment Methods</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> M-Pesa (TZ & KE)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Tigo Pesa</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Airtel Money</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Halo Pesa</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-lg text-white">Blockchain Networks</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> BEP20 (BSC)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> TRC20 (Tron)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Base (Coinbase)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Polygon</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold text-lg text-white">Cryptocurrencies</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> USDC</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> USDT</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-orange-400" />
                <h4 className="font-semibold text-lg text-white">API Features</h4>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Real-time rates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Webhooks</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Order tracking</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Rate limiting</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Check out our documentation to integrate OnRampa into your application and start accepting payments today
            </p>
            <Link
              href="/docs"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 shadow-xl transition-all"
            >
              View Documentation →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            © 2026 OnRampa. Open-source fiat-to-crypto onramp API.
          </p>
        </div>
      </footer>
    </div>
  );
}
