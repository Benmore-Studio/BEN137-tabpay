import { useNavigate } from 'react-router-dom';
import { MapPinIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { AppLayout, Card } from '../components';
import { useAuth } from '../context';
import { mockVenues } from '../data/mockVenues';

export default function Venues() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleVenueSelect = (venueId: string) => {
    navigate(`/venues/${venueId}/bars`);
  };

  return (
    <AppLayout headerTitle="Select Venue">
      <div className="px-4 pt-4 pb-8">
        {/* Welcome message */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome{user?.firstName ? `, ${user.firstName}` : ''}!
          </h2>
          <p className="text-gray-600 mt-1">
            Select a venue to start ordering
          </p>
        </div>

        {/* Venue list */}
        <div className="space-y-4">
          {mockVenues.map((venue) => (
            <Card
              key={venue.id}
              onClick={() => handleVenueSelect(venue.id)}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              padding="none"
            >
              {/* Venue image */}
              {venue.image ? (
                <div className="h-36 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-36 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-16 h-16 text-primary-400" />
                </div>
              )}

              {/* Venue info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {venue.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-gray-500">
                  <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{venue.address}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {mockVenues.length === 0 && (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No venues available</h3>
            <p className="text-gray-500 mt-1">
              Check back later for available venues
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
