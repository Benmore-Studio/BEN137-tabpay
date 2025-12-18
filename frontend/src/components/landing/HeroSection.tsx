import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui';
import PhoneMockup from './PhoneMockup';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
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
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
