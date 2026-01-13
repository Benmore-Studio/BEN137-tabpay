import { Star } from 'lucide-react';
import FullLogo from '../../assets/Full_Logo.png';

export default function LandingFooter() {
  return (
    <footer className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center mb-4">
              <img src={FullLogo} alt="TabPay" className="h-[102px] brightness-0 invert" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Casino drink ordering, reimagined. Skip the wait and stay in the game.
            </p>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
              ))}
              <span className="ml-2 text-sm font-semibold">4.9</span>
            </div>
            <p className="text-xs text-slate-500">Rated by 10K+ guests</p>
          </div>

          {/* Product links */}
          <div className="lg:col-span-4">
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {['How it works', 'Features', 'Pricing'].map((item) => (
                <li key={item}>
                  <button className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-4">
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help center', 'Contact us', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <button className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TabPay. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 ring-1 ring-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400">Demo Mode • Enter any credentials</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
