import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  MapPinIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Users } from 'lucide-react';
import { AppLayout, Card, Badge, EmptyState } from '../components';
import { useAuth, useCart } from '../context';
import { getServiceBarsForVenue, getVenueById } from '../data/mockVenues';
import type { ServiceBar } from '../types';

function getStatusColor(status: ServiceBar['status']): 'success' | 'warning' | 'error' {
  switch (status) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
  }
}

function getStatusLabel(status: ServiceBar['status']): string {
  switch (status) {
    case 'low':
      return 'Low Wait';
    case 'medium':
      return 'Moderate';
    case 'high':
      return 'Busy';
  }
}

// Simulate natural occupancy fluctuations
function updateOccupancy(bar: ServiceBar): ServiceBar {
  // Random walk: +/- 1-3 orders
  const orderChange = Math.floor(Math.random() * 7) - 3; // -3 to +3
  const newActiveOrders = Math.max(0, Math.min(30, bar.activeOrders + orderChange));

  // Occasionally adjust server count (10% chance)
  const serverChange = Math.random() < 0.1 ? (Math.random() < 0.5 ? -1 : 1) : 0;
  const newServers = Math.max(1, Math.min(5, bar.availableServers + serverChange));

  // Calculate wait time: (orders / servers) * 2.5 minutes
  const newWaitMinutes = Math.round((newActiveOrders / newServers) * 2.5);

  // Determine status based on active orders
  let newStatus: ServiceBar['status'];
  if (newActiveOrders < 10) {
    newStatus = 'low';
  } else if (newActiveOrders < 20) {
    newStatus = 'medium';
  } else {
    newStatus = 'high';
  }

  return {
    ...bar,
    activeOrders: newActiveOrders,
    availableServers: newServers,
    estimatedWaitMinutes: newWaitMinutes,
    status: newStatus,
  };
}

export default function ServiceBars() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setServiceBar, setVenue } = useCart();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const venue = venueId ? getVenueById(venueId) : undefined;
  const initialServiceBars = venueId ? getServiceBarsForVenue(venueId) : [];

  // State for real-time updates
  const [serviceBars, setServiceBars] = useState<ServiceBar[]>(initialServiceBars);
  const [changedBarIds, setChangedBarIds] = useState<Set<string>>(new Set());

  // Redirect if venue not found
  if (!venue) {
    navigate('/menu');
    return null;
  }

  // Real-time occupancy simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setServiceBars((prevBars) => {
        const updatedBars = prevBars.map((bar) => {
          const updated = updateOccupancy(bar);

          // Track if status changed for animation
          if (updated.status !== bar.status) {
            setChangedBarIds((prev) => new Set(prev).add(bar.id));

            // Remove from changed set after animation
            setTimeout(() => {
              setChangedBarIds((prev) => {
                const next = new Set(prev);
                next.delete(bar.id);
                return next;
              });
            }, 1000);
          }

          return updated;
        });

        return updatedBars;
      });
    }, 12000); // Update every 12 seconds

    return () => clearInterval(interval);
  }, []);

  const handleBarSelect = (bar: ServiceBar) => {
    // Store selected venue and bar in cart context
    setVenue(venue);
    setServiceBar(bar);
    navigate('/menu');
  };

  return (
    <AppLayout showBackButton headerTitle={venue.name} showBottomNav={false}>
      <div className="px-4 pt-6 pb-8">
        {/* Venue info header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Select a Service Bar
          </h2>
          <p className="text-slate-500 mt-1">
            Choose where you'd like to order from
          </p>
        </div>

        {/* Real-time info notice */}
        <div className="mb-5 p-3.5 rounded-xl bg-primary-50 ring-1 ring-primary-100">
          <p className="text-sm text-primary-700 font-medium">
            <ClockIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Wait times update in real-time based on current orders
          </p>
        </div>

        {/* Service bars list */}
        <div className="space-y-3">
          {serviceBars.map((bar) => (
            <Card
              key={bar.id}
              onClick={() => handleBarSelect(bar)}
              className="group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Bar name and status */}
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="font-semibold text-slate-900">{bar.name}</h3>
                    <Badge
                      variant={getStatusColor(bar.status)}
                      size="sm"
                      className={changedBarIds.has(bar.id) ? 'animate-pulse-soft' : ''}
                    >
                      {getStatusLabel(bar.status)}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-500 mb-3">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{bar.location}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {/* Wait time */}
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4 text-slate-400" />
                      <span className={`font-semibold ${
                        bar.status === 'high' ? 'text-red-600' :
                        bar.status === 'medium' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        ~{bar.estimatedWaitMinutes} min
                      </span>
                    </div>

                    {/* Active orders */}
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span>{bar.activeOrders} orders ahead</span>
                    </div>

                    {/* Servers */}
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>{bar.availableServers} servers</span>
                    </div>
                  </div>

                  {/* Historical average hint */}
                  <div className="mt-2 text-xs text-slate-400">
                    Avg today: {Math.max(5, bar.estimatedWaitMinutes - 2)}-{bar.estimatedWaitMinutes + 2} min
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRightIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {serviceBars.length === 0 && (
          <EmptyState
            icon={Users}
            title="No service bars available"
            description="This venue doesn't have any active service bars"
          />
        )}
      </div>
    </AppLayout>
  );
}
