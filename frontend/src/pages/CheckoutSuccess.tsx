import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [progress, setProgress] = useState(0);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const duration = 2500;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 100));
    }, interval);

    const navigationTimer = setTimeout(() => {
      navigate(`/confirmation/${orderId}`, { replace: true });
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate, orderId]);

  // Allow tap to skip
  const handleSkip = () => {
    navigate(`/confirmation/${orderId}`, { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex flex-col items-center justify-center px-6 cursor-pointer"
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleSkip();
      }}
      aria-label="Tap to continue to order confirmation"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        {/* Success checkmark */}
        <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 ring-4 ring-white/30 shadow-2xl shadow-black/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircleIcon className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        {/* Main message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>

          {/* Delivery message */}
          <div className="flex items-center justify-center gap-2.5 text-white/90 mb-10">
            <MapPinIcon className="w-6 h-6 flex-shrink-0" />
            <p className="text-lg leading-relaxed">
              Your items will be delivered
              <br />
              <span className="font-semibold text-white">directly to your seat</span>
            </p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="w-52"
        >
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
          <p className="text-sm text-white/60 text-center mt-4 font-medium">
            Tap anywhere to continue
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
