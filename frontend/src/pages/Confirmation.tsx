import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout, Button, Card, EmptyState, NotificationPrompt } from '../components';
import { useCart, useNotifications } from '../context';
import type { OrderStatus } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
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

const orderStages: { status: OrderStatus; label: string }[] = [
  { status: 'received', label: 'Order Received' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'delivering', label: 'On the Way' },
  { status: 'delivered', label: 'Delivered' },
];

// Mock current status - in production this would come from real-time updates
const currentStatus: OrderStatus = 'preparing';

export default function Confirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { queuePosition, setQueuePosition, serviceBar, location } = useCart();
  const {
    permissionState,
    notifyOrderStatus,
    hasPromptedForPermission,
    setHasPromptedForPermission,
  } = useNotifications();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Show notification prompt after initial delay (if not previously prompted)
  useEffect(() => {
    if (!hasPromptedForPermission && permissionState.isSupported && permissionState.permission !== 'granted') {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasPromptedForPermission, permissionState.isSupported, permissionState.permission]);

  // Notify on status changes (when permission granted)
  useEffect(() => {
    if (permissionState.permission === 'granted' && orderId) {
      notifyOrderStatus(orderId, currentStatus);
    }
  }, [currentStatus, orderId, notifyOrderStatus, permissionState.permission]);

  // Handle missing order ID
  if (!orderId) {
    return (
      <AppLayout showHeader={false} showBottomNav={false}>
        <EmptyState
          icon={AlertCircle}
          title="Order not found"
          description="We couldn't find this order. Please check your order history."
          actionLabel="View Orders"
          actionTo="/orders"
          variant="error"
        />
      </AppLayout>
    );
  }

  const currentStageIndex = orderStages.findIndex((s) => s.status === currentStatus);

  // Simulate queue position decreasing over time
  useEffect(() => {
    if (queuePosition && queuePosition > 1) {
      const interval = setInterval(() => {
        setQueuePosition(Math.max(1, queuePosition - 1));
      }, 150000); // Decrease by 1 every 2.5 minutes

      return () => clearInterval(interval);
    }
  }, [queuePosition, setQueuePosition]);

  return (
    <AppLayout showHeader={false} showBottomNav={false}>
      <div className="min-h-screen flex flex-col px-4 py-8 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-green-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-primary-100 rounded-full blur-3xl opacity-40" />
        </div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
            >
              <CheckCircleIcon className="w-14 h-14 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-900">Order Confirmed!</h1>
            <p className="text-slate-500 mt-1">Thank you for your order</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 ring-1 ring-slate-200">
              <span className="text-sm text-slate-500">Order</span>
              <span className="text-base tabular-nums font-bold text-primary-600 tracking-tight">
                #{orderId}
              </span>
            </div>
          </motion.div>

          {/* Delivery Location */}
          {location && (
            <motion.div variants={itemVariants}>
              <Card variant="elevated" className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md shadow-green-500/20">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Delivering to</p>
                    <p className="text-lg font-bold text-slate-900">{location}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Queue Position */}
          {queuePosition && queuePosition > 0 && (
            <motion.div variants={itemVariants}>
              <Card variant="elevated" className="mb-5">
                <div className="text-center py-2">
                  <p className="text-sm text-slate-500 mb-1">Your Position in Queue</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      #{queuePosition}
                    </p>
                    <span className="text-sm text-slate-500">in line</span>
                  </div>
                  {serviceBar && (
                    <p className="text-xs text-slate-400 mt-1">{serviceBar.name}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Scheduled Time / Estimated Time */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" className="mb-5">
              <div className="text-center py-2">
                <p className="text-sm text-slate-500 mb-1">
                  {/* TODO: Get isASAP from order data when available */}
                  Estimated Delivery Time
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  {serviceBar ? `${serviceBar.estimatedWaitMinutes}-${serviceBar.estimatedWaitMinutes + 5} min` : '15-20 min'}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Order Status Tracker */}
          <motion.div variants={itemVariants}>
            <Card variant="elevated" className="mb-5">
            <h2 className="font-bold text-slate-900 mb-4">Order Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
              <div
                className="absolute left-4 top-4 w-0.5 bg-gradient-to-b from-primary-500 to-primary-600 transition-all duration-500"
                style={{
                  height: `${(currentStageIndex / (orderStages.length - 1)) * 100}%`,
                }}
              />

              {/* Stages */}
              <div className="space-y-6">
                {orderStages.map((stage, index) => {
                  const isComplete = index <= currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div key={stage.status} className="flex items-center gap-4">
                      {/* Status Dot */}
                      <div
                        className={`
                          relative z-10 w-8 h-8 rounded-full
                          flex items-center justify-center
                          transition-all duration-300
                          ${
                            isComplete
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/30'
                              : 'bg-white ring-2 ring-slate-200'
                          }
                        `}
                      >
                        {isComplete && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Label */}
                      <div>
                        <p
                          className={`
                            font-semibold
                            ${isCurrent ? 'text-primary-600' : isComplete ? 'text-slate-900' : 'text-slate-400'}
                          `}
                        >
                          {stage.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                            In progress...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </Card>
          </motion.div>

          {/* Help Text */}
          <motion.div
            className="mb-6 p-4 rounded-xl bg-slate-100 ring-1 ring-slate-200 text-center"
            variants={itemVariants}
          >
            <p className="text-sm text-slate-600">
              A server will bring your order to your location.
              <br />
              <span className="font-medium text-slate-700">Please stay nearby to receive your order.</span>
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div className="mt-auto space-y-3" variants={itemVariants}>
            <Link to="/menu" className="block">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button variant="primary" className="w-full">
                  Order More
                </Button>
              </motion.div>
            </Link>
            <Link to="/" className="block">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button variant="secondary" className="w-full">
                  Back to Home
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <NotificationPrompt
          onDismiss={() => {
            setShowNotificationPrompt(false);
            setHasPromptedForPermission(true);
          }}
        />
      )}
    </AppLayout>
  );
}
