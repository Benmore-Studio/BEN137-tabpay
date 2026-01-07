import type { Variants } from 'framer-motion';

/**
 * Provides reusable animation variants for framer-motion components.
 * Respects the user's prefers-reduced-motion preference.
 */
export function useAnimationVariants() {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const duration = prefersReducedMotion ? 0 : undefined;

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: duration ?? 0.2 },
    },
  };

  const slideUp: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration ?? 0.3, ease: 'easeOut' },
    },
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', duration: duration ?? 0.3 },
    },
  };

  const staggerChildren: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const listItem: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration ?? 0.2 },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : 10,
      transition: { duration: duration ?? 0.15 },
    },
  };

  return {
    fadeIn,
    slideUp,
    scaleIn,
    staggerChildren,
    listItem,
    prefersReducedMotion,
  };
}
