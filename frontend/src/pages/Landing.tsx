import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';
import { useAuth } from '../context';
import { Button } from '../components';
import HeroSection from '../components/landing/HeroSection';
import FeaturesBentoGrid from '../components/landing/FeaturesBentoGrid';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';

function isAppInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isStandalone, setIsStandalone] = useState(false);

  // Check if running as installed PWA and redirect to menu
  useEffect(() => {
    if (isAppInstalled()) {
      setIsStandalone(true);
      navigate('/menu', { replace: true });
    }
  }, [navigate]);

  // Show loading state while checking auth or redirecting PWA users
  if (isLoading || isStandalone) {
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50 shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Martini className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-lg sm:text-xl text-slate-900 leading-tight">TabPay</span>
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

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500" />

      <FeaturesBentoGrid />

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500" />

      <HowItWorksSection />

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500" />

      <FinalCTASection isAuthenticated={isAuthenticated} />

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500" />

      <LandingFooter />
    </div>
  );
}
