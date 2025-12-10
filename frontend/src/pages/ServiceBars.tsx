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
    navigate('/login');
    return null;
  }

  const venue = venueId ? getVenueById(venueId) : undefined;
  const serviceBars = venueId ? getServiceBarsForVenue(venueId) : [];

  // Redirect if venue not found
  if (!venue) {
    navigate('/venues');
    return null;
  }

  const handleBarSelect = (bar: ServiceBar) => {
    // Store selected venue and bar in cart context
    setVenue(venue);
    setServiceBar(bar);
    navigate('/menu');
  };

  return (
    <AppLayout showBackButton headerTitle={venue.name}>
      <div className="px-4 pt-4 pb-8">
        {/* Venue info header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Select a Service Bar
          </h2>
          <p className="text-gray-600 mt-1">
            Choose where you'd like to order from
          </p>
        </div>

        {/* Real-time info notice */}
        <div className="mb-4 p-3 rounded-lg bg-primary-50 border border-primary-100">
          <p className="text-sm text-primary-700">
            <ClockIcon className="w-4 h-4 inline mr-1.5" />
            Wait times update in real-time based on current orders
          </p>
        </div>

        {/* Service bars list */}
        <div className="space-y-3">
          {serviceBars.map((bar) => (
            <Card
              key={bar.id}
              onClick={() => handleBarSelect(bar)}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Bar name and status */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{bar.name}</h3>
                    <Badge variant={getStatusColor(bar.status)} size="sm">
                      {getStatusLabel(bar.status)}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{bar.location}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-sm">
                    {/* Wait time */}
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className={`font-medium ${
                        bar.status === 'high' ? 'text-red-600' :
                        bar.status === 'medium' ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        ~{bar.estimatedWaitMinutes} min
                      </span>
                    </div>

                    {/* Active orders */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span>{bar.activeOrders} orders ahead</span>
                    </div>

                    {/* Servers */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{bar.availableServers} servers</span>
                    </div>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {serviceBars.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No service bars available</h3>
            <p className="text-gray-500 mt-1">
              This venue doesn't have any active service bars
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
