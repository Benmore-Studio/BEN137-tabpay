import { Link } from 'react-router-dom';
import { Martini, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks';

interface FinalCTASectionProps {
  isAuthenticated: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },  // Removed scale, reduced y from 40
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,  // Reduced from 0.9s - 44% faster
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,  // Reduced from 0.2s - 60% faster
      delayChildren: 0.15,     // Reduced from 0.3s - 50% faster
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },  // Reduced from 20
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,  // Reduced from 0.7s - 43% faster
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function FinalCTASection({ isAuthenticated }: FinalCTASectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Static decorative blobs - no animation for performance */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-100 rounded-full blur-xl opacity-40" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={cardVariants}
          className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 text-center"
        >
          <motion.div variants={contentVariants} className="relative">
            <motion.div variants={itemVariants} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
              <Martini className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-8">
              Ready to skip the wait?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-600 leading-[1.6] mb-10 max-w-xl mx-auto">
              Join thousands of guests who order smarter. No app to download—just scan and sip.
            </motion.p>
            <motion.div variants={itemVariants} className="mb-6">
              <Link to={isAuthenticated ? "/menu" : "/auth"}>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="inline-flex items-center justify-center gap-2 px-12 h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40"
                >
                  {isAuthenticated ? 'Start Ordering' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
            <motion.p variants={itemVariants} className="text-slate-500 text-sm">
              No credit card required • Takes 30 seconds • Guest checkout available
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
