import { Heart, Clock, MapPin, CreditCard, Sparkles } from 'lucide-react';
import SectionBadge from './SectionBadge';

export default function FeaturesBentoGrid() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge
            icon={<Heart className="w-4 h-4 text-primary-600" />}
            text="Why guests love us"
          />
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-8">
            The <span className="text-gradient-gold">TabPay</span> difference
          </h2>
          <p className="text-xl text-slate-600 leading-[1.6] max-w-2xl mx-auto">
            We're not just another ordering app. We built TabPay for the casino floor.
          </p>
        </div>

        {/* Bento-style feature grid */}
        <div className="grid lg:grid-cols-6 gap-6">
          {/* Large feature - Never leave your seat */}
          <div className="lg:col-span-4 group relative bg-white rounded-3xl p-8 lg:p-10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden border-t-[6px] border-primary-500">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Never leave your lucky seat</h3>
              <p className="text-slate-600 text-lg leading-[1.6] mb-6 max-w-lg">
                Hot streak? Don't break it. Order from your phone while you play. No more missing hands or spins while you wait for a server.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100">
                  <span className="text-2xl font-bold text-primary-600">~8</span>
                  <span className="text-sm text-primary-700">min delivery</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                  <span className="text-2xl font-bold text-slate-700">0</span>
                  <span className="text-sm text-slate-600">hands missed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature - GPS delivery */}
          <div className="lg:col-span-2 group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 border-t-[6px] border-gold-500">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-5 shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">We'll find you</h3>
              <p className="text-slate-600 text-sm leading-[1.6]">
                Table 7? Slot #432? The penny machines in the back corner? Just tell us where you are, and we'll handle the rest.
              </p>
            </div>
          </div>

          {/* Feature - Secure payments */}
          <div className="lg:col-span-3 group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 border-t-[6px] border-green-500">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-5 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pay your way</h3>
              <p className="text-slate-600 text-sm leading-[1.6]">
                Apple Pay, Google Pay, or card. One tap checkout. Your payment info stays secure and never leaves your device.
              </p>
            </div>
          </div>

          {/* Wide feature - Rewards */}
          <div className="lg:col-span-3 group relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 shadow-xl shadow-gold-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Earn rewards with every sip</h3>
                <p className="text-slate-300 text-lg leading-[1.6] max-w-xl">
                  Every order earns you points. Rack up rewards, unlock exclusive perks, and enjoy complimentary drinks on us. The more you order, the more you earn.
                </p>
              </div>
              <div className="flex flex-row lg:flex-col gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 ring-1 ring-white/10 text-center min-w-[120px]">
                  <p className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">50K+</p>
                  <p className="text-sm text-slate-400">Orders placed</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4 ring-1 ring-white/10 text-center min-w-[120px]">
                  <p className="text-3xl font-bold text-white">$12K</p>
                  <p className="text-sm text-slate-400">Rewards given</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
