import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Martini, Share, PlusSquare, MoreVertical, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../components';

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export default function Install() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    // Check if already installed as PWA
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }, []);

  // If already installed, show success
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-green-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-primary-100 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            You're all set!
          </h1>
          <p className="text-slate-500 text-center mb-8">
            TabPay is installed and ready to use.
          </p>
          <Link to="/menu">
            <Button size="lg">Start Ordering</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isIOS = platform === 'ios';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-gold-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-50 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Header */}
      <div className="relative px-6 pt-12 pb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 mx-auto mb-5">
          <Martini className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Install TabPay
        </h1>
        <p className="text-slate-500">
          Add TabPay to your home screen for the best experience
        </p>
      </div>

      {/* Platform Toggle with sliding indicator */}
      <div className="relative px-6 mb-6">
        <div className="relative flex bg-slate-100 rounded-xl p-1">
          {/* Sliding indicator */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-out ${
              isIOS ? 'left-1' : 'left-[calc(50%+2px)]'
            }`}
          />
          <button
            onClick={() => setPlatform('ios')}
            className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
              isIOS ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
              !isIOS ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Android
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="relative flex-1 px-6">
        {isIOS ? (
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Tap the Share button
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Find the share icon at the bottom of Safari
                  </p>
                  <div className="flex items-center justify-center py-4 bg-slate-50 rounded-xl">
                    <Share className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Scroll and tap "Add to Home Screen"
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Scroll down in the share menu to find this option
                  </p>
                  <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-xl">
                    <PlusSquare className="w-6 h-6 text-primary-600" />
                    <span className="font-medium text-slate-700">Add to Home Screen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Tap "Add" to confirm
                  </h3>
                  <p className="text-sm text-slate-500">
                    TabPay will appear on your home screen like a regular app
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Tap the menu button
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Find the three dots in the top right of Chrome
                  </p>
                  <div className="flex items-center justify-center py-4 bg-slate-50 rounded-xl">
                    <MoreVertical className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Tap "Install app" or "Add to Home screen"
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    Look for the install option in the menu
                  </p>
                  <div className="flex items-center gap-3 py-3 px-4 bg-slate-50 rounded-xl">
                    <Download className="w-6 h-6 text-primary-600" />
                    <span className="font-medium text-slate-700">Install app</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-600">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Tap "Install" to confirm
                  </h3>
                  <p className="text-sm text-slate-500">
                    TabPay will be added to your home screen and app drawer
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative px-6 py-6 space-y-3">
        <Link to="/menu" className="block">
          <Button variant="primary" className="w-full" size="lg">
            Continue to Menu
          </Button>
        </Link>
        <p className="text-xs text-slate-400 text-center">
          You can always install later from the browser menu
        </p>
      </div>
    </div>
  );
}
