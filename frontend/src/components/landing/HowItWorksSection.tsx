import { Zap, QrCode, Martini, Clock, CreditCard, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks';
import SectionBadge from './SectionBadge';

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.4,
      delay: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-50 via-transparent to-gold-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <SectionBadge
            icon={<Zap className="w-4 h-4 text-primary-600" />}
            text="Simple as 1-2-3"
            variant="purple"
          />
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-8">
            How TabPay works
          </h2>
          <p className="text-xl text-slate-600 leading-[1.6] max-w-2xl mx-auto">
            From scan to sip in under 10 minutes. No app download required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-[60px] left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-[2px] origin-left">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={lineVariants}
              className="h-full bg-gradient-to-r from-primary-300 via-gold-300 to-green-300 rounded-full"
            />
          </div>

          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid sm:grid-cols-3 gap-12 lg:gap-8"
          >
            {/* Step 1 */}
            <motion.div variants={stepVariants} className="relative text-center">
              <div className="relative inline-flex mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 25px 50px -15px rgba(124,58,237,0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(124,58,237,0.4)]"
                >
                  <QrCode className="w-14 h-14 text-white" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-primary-100">
                  <span className="text-xl font-bold text-primary-600">1</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">Scan the QR code</h3>
              <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                Find a QR code at your table or slot machine. Just point your camera—no app needed.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-sm text-primary-700 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>2 seconds</span>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={stepVariants} className="relative text-center">
              <div className="relative inline-flex mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 25px 50px -15px rgba(212,175,55,0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)]"
                >
                  <Martini className="w-14 h-14 text-white" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-gold-100">
                  <span className="text-xl font-bold text-gold-600">2</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">Browse & order</h3>
              <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                Pick your drinks, customize to taste, and pay with Apple Pay, Google Pay, or card.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 text-sm text-gold-700 font-medium">
                <CreditCard className="w-3.5 h-3.5" />
                <span>One-tap checkout</span>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={stepVariants} className="relative text-center">
              <div className="relative inline-flex mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 25px 50px -15px rgba(34,197,94,0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="w-[120px] h-[120px] rounded-[2rem] bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(34,197,94,0.4)]"
                >
                  <Zap className="w-14 h-14 text-white" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-11 h-11 rounded-full bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center ring-4 ring-green-100">
                  <span className="text-xl font-bold text-green-600">3</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">Stay & enjoy</h3>
              <p className="text-slate-600 leading-relaxed mb-4 max-w-xs mx-auto">
                Track your order live. Stay at your seat while your drink comes straight to you.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-sm text-green-700 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>~8 min delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
