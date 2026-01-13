import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ArrowRight, MapPin } from 'lucide-react';
import { useCart } from '../context';
import { mockVenues, mockServiceBars, getVenueById } from '../data/mockVenues';
import { Button } from '../components';
import Logo from '../assets/Logo.png';

/**
 * GuestEntry - Simulates scanning a QR code at a casino table/slot machine
 *
 * URL: /order?venue=venue-001&bar=bar-001&location=Table-42
 *
 * Query Parameters:
 * - venue: Venue ID (defaults to first mock venue)
 * - bar: Service bar ID (defaults to first bar at venue)
 * - location: Seat/table ID (optional, can be entered at checkout)
 *
 * This page sets up the guest session and shows options before redirecting.
 */
export default function GuestEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setVenue, setServiceBar, setLocation, venue, serviceBar } = useCart();
  const [isReady, setIsReady] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Get params from URL (simulating QR code data)
    const venueId = searchParams.get('venue') || mockVenues[0].id;
    const barId = searchParams.get('bar');
    const locationId = searchParams.get('location');

    // Find venue
    const foundVenue = getVenueById(venueId) || mockVenues[0];
    setVenue(foundVenue);

    // Find service bar (or default to first bar at venue)
    const venueBars = mockServiceBars.filter((b) => b.venueId === foundVenue.id);
    const foundBar = barId
      ? mockServiceBars.find((b) => b.id === barId) || venueBars[0]
      : venueBars[0];

    if (foundBar) {
      setServiceBar(foundBar);
    }

    // Set location if provided (e.g., Table-42, Slot-A15)
    if (locationId) {
      setLocation(locationId);
    }

    // Show options after brief loading
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    // Auto-redirect after 4 seconds if no interaction
    const redirectTimer = setTimeout(() => {
      if (!hasInteracted.current) {
        navigate('/menu', { replace: true });
      }
    }, 4000);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(redirectTimer);
    };
  }, [searchParams, setVenue, setServiceBar, setLocation, navigate]);

  const handleContinue = () => {
    hasInteracted.current = true;
    navigate('/menu', { replace: true });
  };

  const handleViewBars = () => {
    hasInteracted.current = true;
    if (venue) {
      navigate(`/venues/${venue.id}/bars`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gold-100 rounded-full blur-3xl opacity-40" />
      </div>

      <motion.div
        className="relative text-center max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated logo */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <img src={Logo} alt="TabPay" className="w-full h-full object-contain" />
        </motion.div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome to TabPay
        </h1>

        {!isReady ? (
          <>
            <p className="text-base text-slate-500 mb-8">
              Setting up your session...
            </p>
            {/* Loading dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Show selected bar info */}
            {serviceBar && (
              <div className="mb-6 p-3 rounded-xl bg-slate-100 ring-1 ring-slate-200">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>Ordering from: <span className="font-semibold text-slate-900">{serviceBar.name}</span></span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ~{serviceBar.estimatedWaitMinutes} min wait
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full"
                size="lg"
              >
                Continue to Menu
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <button
                onClick={handleViewBars}
                className="w-full text-sm text-primary-600 hover:text-primary-700 hover:underline py-2 transition-colors"
              >
                View other service bars
              </button>
            </div>

            {/* Auto-redirect notice */}
            <p className="mt-4 text-xs text-slate-400">
              Auto-continuing in a few seconds...
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* QR simulation note */}
      <motion.div
        className="absolute bottom-8 flex items-center gap-2 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <QrCode className="w-4 h-4" />
        <span>Guest checkout simulation</span>
      </motion.div>
    </div>
  );
}
