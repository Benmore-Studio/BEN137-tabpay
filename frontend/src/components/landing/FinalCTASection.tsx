import { Link } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
  isAuthenticated: boolean;
}

export default function FinalCTASection({ isAuthenticated }: FinalCTASectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-100 rounded-full blur-xl opacity-40" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 overflow-hidden">
          <div className="p-8 sm:p-12 lg:p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
              <Martini className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-8">
              Ready to skip the wait?
            </h2>
            <p className="text-xl text-slate-600 leading-[1.6] mb-10 max-w-xl mx-auto">
              Join thousands of casino guests who order smarter, play longer, and never miss a moment.
            </p>
            <div className="mb-6">
              <Link to={isAuthenticated ? "/menu" : "/auth"}>
                <button className="inline-flex items-center justify-center gap-2 px-12 h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:from-primary-700 hover:to-primary-800">
                  {isAuthenticated ? 'Start Ordering' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <p className="text-slate-500 text-sm">
              No app download • No waiting • Just drinks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
