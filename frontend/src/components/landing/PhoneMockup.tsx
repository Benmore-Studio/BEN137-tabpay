import { Martini, Sparkles, Zap, Shield, Clock, MapPin, Bell, ChevronRight, Heart, Users } from 'lucide-react';

export default function PhoneMockup() {
  return (
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
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-slate-50/80 via-white/90 to-slate-50/80">
          {/* Decorative background blobs - more subtle */}
          <div className="absolute top-20 -right-10 w-32 h-32 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-32 -left-10 w-28 h-28 bg-gold-200/20 rounded-full blur-3xl" />

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
  );
}
