import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Martini, QrCode, Smartphone } from 'lucide-react';
import Button from '../ui/Button';

function isMobileDevice(): boolean {
  // Check for mobile user agent
  const ua = navigator.userAgent;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  // Also check for touch capability and screen width as fallback
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isNarrowScreen = window.innerWidth <= 768;

  // Check if running as standalone PWA (always allow)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  return isMobileUA || isStandalone || (isTouchDevice && isNarrowScreen);
}

function DesktopBlocker() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gold-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Martini className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            TabPay
          </span>
        </div>

        {/* Card */}
        <div className="relative max-w-md w-full">
          <div className="absolute -inset-2 bg-gradient-to-b from-primary-200/40 via-slate-200/50 to-gold-200/40 rounded-[2.5rem] blur-2xl opacity-70" />

          <div className="relative bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 p-8 text-center">
            {/* Phone icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-primary-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Use Your Phone
            </h1>
            <p className="text-slate-500 mb-6">
              TabPay is designed for mobile ordering. Scan the QR code at your table or slot machine to start ordering.
            </p>

            {/* QR illustration */}
            <div className="inline-flex items-center justify-center w-32 h-32 mb-6 rounded-2xl bg-slate-100 ring-1 ring-slate-200">
              <QrCode className="w-16 h-16 text-slate-400" />
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Look for QR codes at your venue to access the ordering experience on your mobile device.
            </p>

            {/* Back to home */}
            <Link to="/">
              <Button variant="secondary" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-slate-400 text-center max-w-sm">
          Need help? Ask a server or visit the casino service desk for assistance.
        </p>
      </div>
    </div>
  );
}

export default function MobileOnlyLayout() {
  const [isMobile, setIsMobile] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check for dev mode bypass (?dev=true)
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('dev') === 'true';

    if (devMode) {
      setIsMobile(true);
      setIsChecking(false);
      return; // Skip resize listener in dev mode
    }

    setIsMobile(isMobileDevice());
    setIsChecking(false);

    // Re-check on resize (for responsive testing in dev tools)
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show nothing while checking (prevents flash)
  if (isChecking) {
    return null;
  }

  // Desktop view - show blocker
  if (!isMobile) {
    return <DesktopBlocker />;
  }

  // Mobile view - render child routes
  return <Outlet />;
}
