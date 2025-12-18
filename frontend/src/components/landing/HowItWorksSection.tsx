import { Zap, QrCode, Martini, Clock, CreditCard, MapPin } from 'lucide-react';
import SectionBadge from './SectionBadge';

export default function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-50 via-transparent to-gold-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionBadge
            icon={<Zap className="w-4 h-4 text-primary-600" />}
            text="Simple as 1-2-3"
            variant="purple"
          />
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
  );
}
