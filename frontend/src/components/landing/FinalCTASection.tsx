import { Link } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';
import { Button } from '../ui';

interface FinalCTASectionProps {
  isAuthenticated: boolean;
}

export default function FinalCTASection({ isAuthenticated }: FinalCTASectionProps) {
  return (
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
  );
}
