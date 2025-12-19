import { Heart, Clock, MapPin, CreditCard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks';
import SectionBadge from './SectionBadge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

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

export default function FeaturesBentoGrid() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <SectionBadge
            icon={<Heart className="w-4 h-4 text-primary-600" />}
            text="Why guests love us"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4 sm:mb-8">
            The <span className="text-gradient-gold">TabPay</span> difference
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We're not just another ordering app. We built TabPay for the casino floor.
          </p>
        </motion.div>

        {/* Asymmetric bento grid - 70/30 split */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid lg:grid-cols-10 gap-6"
        >
          {/* HUGE primary feature - 7 columns, 2 rows */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 lg:row-span-2 group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] overflow-hidden border-t-[6px] border-primary-500"
          >
            <div className="relative h-full flex flex-col justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 sm:mb-8 shadow-xl shadow-primary-500/20"
              >
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">Never leave your lucky seat</h3>
              <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-2xl">
                Hot streak? Don't break it. Order from your phone while you play. No more missing hands or spins while you wait for a server.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-primary-50 border-2 border-primary-100 shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold text-primary-600 tabular-nums">~8</span>
                  <span className="text-xs sm:text-sm text-primary-700 font-medium">min delivery</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-slate-100 border-2 border-slate-200 shadow-lg">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-700 tabular-nums">0</span>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">hands missed</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vertical stack of smaller cards - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* GPS delivery */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.12)' }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white rounded-3xl p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] border-t-[6px] border-gold-500"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20"
                >
                  <MapPin className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">We'll find you</h3>
                <p className="text-slate-600 text-sm leading-[1.6]">
                  Table 7? Slot #432? The penny machines in the back corner? Just tell us where you are.
                </p>
              </div>
            </motion.div>

            {/* Secure payments */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.12)' }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white rounded-3xl p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] border-t-[6px] border-green-500"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mb-4 shadow-lg shadow-green-500/20"
                >
                  <CreditCard className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Pay your way</h3>
                <p className="text-slate-600 text-sm leading-[1.6]">
                  Apple Pay, Google Pay, or card. One tap checkout. Secure and fast.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Full-width rewards card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)' }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-10 group relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-8">
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4 sm:mb-6 shadow-xl shadow-gold-500/30"
                >
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Earn rewards with every sip</h3>
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                  Every order earns you points. Rack up rewards, unlock exclusive perks, and enjoy complimentary drinks on us. The more you order, the more you earn.
                </p>
              </div>
              <div className="flex flex-row lg:flex-col gap-3 sm:gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 sm:px-6 sm:py-4 ring-1 ring-white/10 text-center flex-1 lg:flex-none lg:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent tabular-nums">50K+</p>
                  <p className="text-xs sm:text-sm text-slate-400">Orders placed</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 sm:px-6 sm:py-4 ring-1 ring-white/10 text-center flex-1 lg:flex-none lg:min-w-[120px]">
                  <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">$12K</p>
                  <p className="text-xs sm:text-sm text-slate-400">Rewards given</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
