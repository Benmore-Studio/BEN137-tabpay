import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { AppLayout, Card, Badge } from '../components';
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
  const serviceBars = venueId ? getServiceBarsForVenue(venueId) : [];

  // Redirect if venue not found
  if (!venue) {
    navigate('/menu');
    return null;
  }

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
                    <Badge variant={getStatusColor(bar.status)} size="sm">
                      {getStatusLabel(bar.status)}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-500 mb-3">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{bar.location}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-sm">
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
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{bar.availableServers} servers</span>
                    </div>
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
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <UserGroupIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No service bars available</h3>
            <p className="text-slate-500 mt-1">
              This venue doesn't have any active service bars
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
