import { Link } from 'react-router-dom';
import { Martini, Sparkles, Zap, Shield, Clock, QrCode, ArrowRight, Star, MapPin, CreditCard, Bell, ChevronRight, Users, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../context';
import { Button } from '../components';

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-pulse-soft">
            <Martini className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Martini className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-xl text-slate-900 leading-tight">TabPay</span>
              <span className="text-base text-primary-600 leading-tight" style={{ fontFamily: 'var(--font-family-script)' }}>Keep the Action Going</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/auth" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/menu">
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-gold-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200/60 mb-6 shadow-sm shadow-primary-500/10">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Casino drink ordering, reimagined</span>
              </div>

              <h1 className="text-[2.25rem] leading-[1.1] sm:text-[3rem] lg:text-[3.75rem] font-bold text-slate-900 tracking-tight mb-6">
                Order drinks <span className="text-primary-600">without missing a moment</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-[1.6] mb-8 max-w-lg mx-auto lg:mx-0">
                Skip the wait at your favorite casino. Order from your phone and get drinks delivered right to your table or slot machine.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start mb-10">
                <Link to={isAuthenticated ? "/menu" : "/auth"}>
                  <Button size="lg" className="sm:w-auto sm:px-10 h-14 text-lg bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                    {isAuthenticated ? 'Start Ordering' : 'Get Started Free'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-900">4.9</span>
                </div>
                <div className="h-5 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-500">10K+ happy guests</p>
                </div>
                <div className="h-5 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <p className="text-sm text-slate-500">50K+ orders</p>
                </div>
              </div>
            </div>

            {/* Right: Phone mockup / Visual */}
            <div className="relative flex justify-center lg:justify-end pt-8 lg:pt-0">
              <div className="relative mx-8 sm:mx-16 group/phone">
                {/* Glow behind phone - animates on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-gold-400/30 rounded-[4rem] blur-3xl scale-110 group-hover/phone:scale-125 group-hover/phone:opacity-80 transition-all duration-700" />

                {/* Phone frame */}
                <div className="relative w-[320px] sm:w-[340px] lg:w-[300px] h-[640px] sm:h-[680px] lg:h-[600px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-[3rem] p-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(100,100,120,0.1)] ring-1 ring-white/10 group-hover/phone:shadow-[0_30px_60px_-15px_rgba(124,58,237,0.3),0_0_0_1px_rgba(100,100,120,0.1)] transition-all duration-500">
                  {/* Highlight edge - top */}
                  <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                  {/* Side button details */}
                  <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-gradient-to-b from-slate-600 to-slate-800 rounded-l-sm" />
                  <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r-sm" />
                  <div className="absolute -left-[2px] top-36 w-[3px] h-16 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r-sm" />

                  {/* Screen bezel glow */}
                  <div className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-b from-primary-500/20 to-transparent opacity-50" />

                  {/* Screen */}
                  <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                    {/* App background - light with subtle texture */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

                    {/* Decorative background blobs */}
                    <div className="absolute top-20 -right-10 w-32 h-32 bg-primary-200/40 rounded-full blur-2xl" />
                    <div className="absolute bottom-32 -left-10 w-28 h-28 bg-gold-200/40 rounded-full blur-2xl" />

                    {/* Screen glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />

                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full flex items-center justify-center gap-2 shadow-lg z-10">
                      <div className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 relative">
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900" />
                      </div>
                    </div>

                    {/* App content preview */}
                    <div className="relative pt-14 px-3 h-full flex flex-col">
                      {/* Header - Purple gradient bar */}
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-3 mb-3 shadow-lg shadow-primary-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                              <Martini className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white/70 text-[9px]">Good evening</p>
                              <p className="text-white font-semibold text-xs">Alex</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-full bg-gold-400/90 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-white" />
                              <span className="text-[9px] font-bold text-white">250</span>
                            </div>
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-white" />
                              </div>
                              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-primary-600" />
                            </div>
                          </div>
                        </div>
                        {/* Location pill inside header */}
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full w-fit mt-2">
                          <MapPin className="w-3 h-3 text-gold-300" />
                          <span className="text-white/90 text-[9px] font-medium">Bellagio • Slot #247</span>
                        </div>
                      </div>

                      {/* Active order card */}
                      <div className="bg-white rounded-2xl p-3 shadow-lg mb-3 ring-1 ring-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                              <Clock className="w-3 h-3 text-primary-600" />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-700">Your order</p>
                          </div>
                          <div className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-semibold">On the way</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center ring-1 ring-amber-200/50">
                            <span className="text-lg">🍸</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-[11px]">Classic Martini</p>
                            <p className="text-[9px] text-slate-500">Dry, with olives</p>
                          </div>
                          <div className="text-right bg-primary-50 px-2 py-1 rounded-lg">
                            <p className="text-sm font-bold text-primary-600">2m</p>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                        </div>
                      </div>

                      {/* Menu section */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-800 text-[10px] font-semibold">Popular drinks</p>
                        <p className="text-primary-600 text-[9px] font-medium">See all</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { emoji: '🍺', name: 'IPA', price: '$8', bg: 'from-amber-50 to-orange-50', ring: 'ring-amber-200/50' },
                          { emoji: '🍷', name: 'Pinot', price: '$12', bg: 'from-red-50 to-pink-50', ring: 'ring-red-200/50' },
                          { emoji: '🥃', name: 'Whiskey', price: '$14', bg: 'from-amber-50 to-yellow-50', ring: 'ring-amber-200/50' },
                        ].map((item) => (
                          <div key={item.name} className={`bg-gradient-to-br ${item.bg} rounded-xl p-2 text-center ring-1 ${item.ring} shadow-sm`}>
                            <span className="text-base block mb-0.5">{item.emoji}</span>
                            <span className="text-slate-800 text-[9px] font-semibold block">{item.name}</span>
                            <span className="text-primary-600 text-[9px] font-bold">{item.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Promo banner */}
                      <div className="bg-gradient-to-r from-gold-400 to-gold-500 rounded-xl p-2.5 mb-3 shadow-md shadow-gold-400/20">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold text-[10px]">Happy Hour!</p>
                            <p className="text-white/80 text-[8px]">2-for-1 cocktails until 7pm</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/60" />
                        </div>
                      </div>

                      {/* Bottom nav */}
                      <div className="mt-auto pb-2">
                        <div className="bg-white rounded-2xl p-2 flex items-center justify-around shadow-lg ring-1 ring-slate-100">
                          <div className="text-center px-3 py-1.5 rounded-xl bg-primary-50">
                            <Martini className="w-4 h-4 text-primary-600 mx-auto" />
                            <span className="text-[8px] text-primary-600 font-semibold">Menu</span>
                          </div>
                          <div className="text-center px-3 py-1.5">
                            <Clock className="w-4 h-4 text-slate-400 mx-auto" />
                            <span className="text-[8px] text-slate-400">Orders</span>
                          </div>
                          <div className="text-center px-3 py-1.5">
                            <Heart className="w-4 h-4 text-slate-400 mx-auto" />
                            <span className="text-[8px] text-slate-400">Saved</span>
                          </div>
                          <div className="text-center px-3 py-1.5">
                            <Users className="w-4 h-4 text-slate-400 mx-auto" />
                            <span className="text-[8px] text-slate-400">Profile</span>
                          </div>
                        </div>
                        {/* Home indicator */}
                        <div className="mt-2 mx-auto w-20 h-1 bg-slate-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification card - top left */}
                <div className="absolute left-0 sm:-left-6 top-16 -translate-x-1/2 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] p-3 hover:scale-105 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Secure Pay</p>
                      <p className="text-[10px] text-slate-500">Apple Pay ready</p>
                    </div>
                  </div>
                </div>

                {/* Floating stat card - bottom right */}
                <div className="absolute right-0 sm:-right-6 bottom-28 translate-x-1/2 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] p-3 hover:scale-105 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">~8 min</p>
                      <p className="text-[10px] text-slate-500">Avg. delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The TabPay Difference - Unique value props */}
      <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white to-slate-50 border border-slate-200/80 shadow-md shadow-slate-900/5 mb-6">
              <Heart className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-slate-700">Why guests love us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] font-bold text-slate-900 tracking-tight mb-6">
              The <span className="text-primary-600">TabPay</span> difference
            </h2>
            <p className="text-lg text-slate-600 leading-[1.6] max-w-2xl mx-auto">
              We're not just another ordering app. We built TabPay for the casino floor.
            </p>
          </div>

          {/* Bento-style feature grid */}
          <div className="grid lg:grid-cols-6 gap-6">
            {/* Large feature - Never leave your seat */}
            <div className="lg:col-span-4 group relative bg-white rounded-3xl p-8 lg:p-10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
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
            <div className="lg:col-span-2 group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500">
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
            <div className="lg:col-span-3 group relative bg-white rounded-3xl p-6 lg:p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500">
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

      {/* How It Works - Expanded */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-50 via-transparent to-gold-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200/60 shadow-md shadow-primary-500/10 mb-6">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Simple as 1-2-3</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] font-bold text-slate-900 tracking-tight mb-6">
              How TabPay works
            </h2>
            <p className="text-lg text-slate-600 leading-[1.6] max-w-2xl mx-auto">
              From scan to sip in under 10 minutes. No app download required.
            </p>
          </div>

          {/* Steps */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connecting line - desktop only */}
            <div className="hidden lg:block absolute top-[60px] left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-[2px]">
              <div className="h-full bg-gradient-to-r from-primary-300 via-gold-300 to-green-300 rounded-full" />
            </div>

            <div className="grid sm:grid-cols-3 gap-12 lg:gap-8">
              {/* Step 1 */}
              <div className="relative group text-center">
                <div className="relative inline-flex mb-8">
                  <div className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(124,58,237,0.4)] group-hover:shadow-[0_25px_50px_-15px_rgba(124,58,237,0.5)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                    <QrCode className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-primary-100">
                    <span className="text-xl font-bold text-primary-600">1</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">Scan the QR code</h3>
                <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                  Find a QR code at your table or slot machine. Just point your camera—no app needed.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-sm text-primary-700 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2 seconds</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group text-center">
                <div className="relative inline-flex mb-8">
                  <div className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)] group-hover:shadow-[0_25px_50px_-15px_rgba(212,175,55,0.5)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                    <Martini className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-gold-100">
                    <span className="text-xl font-bold text-gold-600">2</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">Browse & order</h3>
                <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                  Pick your drinks, customize to taste, and pay with Apple Pay, Google Pay, or card.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 text-sm text-gold-700 font-medium">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>One-tap checkout</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group text-center">
                <div className="relative inline-flex mb-8">
                  <div className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(34,197,94,0.4)] group-hover:shadow-[0_25px_50px_-15px_rgba(34,197,94,0.5)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                    <Zap className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-green-100">
                    <span className="text-xl font-bold text-green-600">3</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">Stay & enjoy</h3>
                <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                  Track your order live. Stay at your seat while your drink comes straight to you.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-sm text-green-700 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>~8 min delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 text-center">
            <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
              <Martini className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] leading-[1.2] font-bold text-slate-900 tracking-tight mb-6">
              Ready to skip the wait?
            </h2>
            <p className="text-lg text-slate-600 leading-[1.6] mb-10 max-w-xl mx-auto">
              Join thousands of guests who order smarter. No app to download—just scan and sip.
            </p>
            <div className="mb-6">
              <Link to={isAuthenticated ? "/menu" : "/auth"}>
                <Button size="lg" className="px-12 h-14 text-lg bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                  {isAuthenticated ? 'Start Ordering' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 text-sm">
              No credit card required • Takes 30 seconds • Guest checkout available
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                  <Martini className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <span className="font-bold text-xl">TabPay</span>
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
    </div>
  );
}
