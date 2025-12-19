import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui';
import PhoneMockup from './PhoneMockup';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background - subtle gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-gold-500/5 to-transparent" />
        {/* Accent blob for depth */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gold-400/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center mb-12 sm:mb-16">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200/60 mb-4 sm:mb-6 shadow-sm shadow-primary-500/10">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600" />
              <span className="text-xs sm:text-sm font-medium text-primary-700">Casino drink ordering, reimagined</span>
            </div>

            <h1 className="text-[2rem] leading-[1.1] sm:text-[3rem] sm:leading-[1.05] lg:text-[5.5rem] lg:leading-[0.95] font-extrabold text-slate-900 tracking-tighter mb-6 sm:mb-8">
              Order drinks.{' '}
              <span className="text-gradient-gold">Skip the wait.</span>{' '}
              Stay in the game.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0">
              Get drinks delivered right to your table or slot machine. No waiting, no missing a beat.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <Link to={isAuthenticated ? "/menu" : "/auth"}>
                <Button size="lg" className="sm:w-auto sm:px-10 h-14 text-lg bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-[color,background-color,border-color,box-shadow,transform] duration-300">
                  {isAuthenticated ? 'Start Ordering' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Phone mockup / Visual */}
          <div className="relative flex justify-center lg:justify-end pt-8 lg:pt-0">
            <PhoneMockup />
          </div>
        </div>

        {/* Trust indicators - Centered at bottom */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Rating */}
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-gold-400 to-gold-600 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full shadow-2xl">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 fill-white" />
              ))}
            </div>
            <div className="border-l border-white/30 pl-2 sm:pl-3">
              <div className="text-2xl sm:text-3xl font-bold tabular-nums">4.9</div>
            </div>
          </div>

          {/* User count */}
          <div className="flex items-center gap-2 sm:gap-3 bg-primary-600 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full shadow-2xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold tabular-nums">10K+</div>
              <div className="text-[10px] sm:text-xs opacity-90">guests</div>
            </div>
          </div>

          {/* Orders */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-800 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full shadow-2xl">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold tabular-nums">50K+</div>
              <div className="text-[10px] sm:text-xs opacity-90">orders</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
