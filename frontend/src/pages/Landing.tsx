import { Link } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';
import { useAuth } from '../context';
import { Button } from '../components';
import HeroSection from '../components/landing/HeroSection';
import FeaturesBentoGrid from '../components/landing/FeaturesBentoGrid';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';

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

      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesBentoGrid />
      <HowItWorksSection />
      <FinalCTASection isAuthenticated={isAuthenticated} />
      <LandingFooter />
    </div>
  );
}
