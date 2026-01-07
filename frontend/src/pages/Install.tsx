import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Martini, Share, Plus, MoreVertical, Download, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '../components';

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function Install() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }, []);

  // Already installed - show success state
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/25 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            You're all set!
          </h1>
          <p className="text-base text-slate-500 text-center mb-8">
            TabPay is installed and ready to use
          </p>
          <Link to="/menu">
            <Button size="lg">
              Start Ordering
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const isIOS = platform === 'ios';

  const iosSteps = [
    {
      icon: Share,
      title: 'Tap the Share button',
      description: 'Find it at the bottom of Safari',
    },
    {
      icon: Plus,
      title: 'Add to Home Screen',
      description: 'Scroll down in the share menu',
    },
    {
      icon: CheckCircle2,
      title: 'Tap "Add"',
      description: 'TabPay will appear on your home screen',
    },
  ];

  const androidSteps = [
    {
      icon: MoreVertical,
      title: 'Tap the menu button',
      description: 'Three dots in the top right of Chrome',
    },
    {
      icon: Download,
      title: 'Tap "Install app"',
      description: 'Or "Add to Home screen"',
    },
    {
      icon: CheckCircle2,
      title: 'Tap "Install"',
      description: 'TabPay will be added to your apps',
    },
  ];

  const steps = isIOS ? iosSteps : androidSteps;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gold-100 rounded-full blur-3xl opacity-40" />
      </div>

      <motion.div
        className="relative flex-1 flex flex-col px-5 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 mb-5">
            <Martini className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Add TabPay to Home Screen
          </h1>
          <p className="text-base text-slate-500">
            For the best ordering experience
          </p>
        </motion.div>

        {/* Platform Toggle */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="relative flex bg-slate-100 rounded-xl p-1 max-w-xs mx-auto">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm ring-1 ring-slate-200/50 transition-all duration-200 ease-out ${
                isIOS ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />
            <button
              onClick={() => setPlatform('ios')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg z-10 transition-colors ${
                isIOS ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg z-10 transition-colors ${
                !isIOS ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              Android
            </button>
          </div>
        </motion.div>

        {/* Steps Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-6 mb-6"
          variants={itemVariants}
        >
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Step indicator */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                </div>
                {/* Text content */}
                <div className="flex-1 pt-1">
                  <p className="text-base font-semibold text-slate-900 mb-0.5">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-auto"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Smartphone className="w-4 h-4" />
            <span>Works offline</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>Faster access</span>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div className="mt-8 space-y-4" variants={itemVariants}>
          <Link to="/menu" className="block">
            <Button variant="primary" className="w-full" size="lg">
              Continue to Menu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-slate-400 text-center">
            You can install anytime from your browser menu
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
