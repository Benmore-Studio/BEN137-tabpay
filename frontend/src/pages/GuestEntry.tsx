import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Martini, QrCode } from 'lucide-react';
import { useCart } from '../context';
import { mockVenues, mockServiceBars, getVenueById } from '../data/mockVenues';

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
 * This page sets up the guest session and redirects to the menu.
 */
export default function GuestEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setVenue, setServiceBar, setLocation } = useCart();

  useEffect(() => {
    // Get params from URL (simulating QR code data)
    const venueId = searchParams.get('venue') || mockVenues[0].id;
    const barId = searchParams.get('bar');
    const locationId = searchParams.get('location');

    // Find venue
    const venue = getVenueById(venueId) || mockVenues[0];
    setVenue(venue);

    // Find service bar (or default to first bar at venue)
    const venueBars = mockServiceBars.filter((b) => b.venueId === venue.id);
    const serviceBar = barId
      ? mockServiceBars.find((b) => b.id === barId) || venueBars[0]
      : venueBars[0];

    if (serviceBar) {
      setServiceBar(serviceBar);
    }

    // Set location if provided (e.g., Table-42, Slot-A15)
    if (locationId) {
      setLocation(locationId);
    }

    // Redirect to menu after brief loading animation
    const timer = setTimeout(() => {
      navigate('/menu', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, setVenue, setServiceBar, setLocation, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gold-100 rounded-full blur-3xl opacity-40" />
      </div>

      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated logo */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Martini className="w-10 h-10 text-white" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome to TabPay
        </h1>
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
