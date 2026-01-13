import { useState, useEffect, useMemo } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Users } from 'lucide-react';
import { Modal, Badge, Card } from '../ui';
import { useCart, useProfile } from '../../context';
import { getServiceBarsForVenue } from '../../data/mockVenues';
import type { ServiceBar } from '../../types';

interface BarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function BarSelectorModal({ isOpen, onClose }: BarSelectorModalProps) {
  const { venue, serviceBar: currentBar, setServiceBar } = useCart();
  const { isGuest, profile } = useProfile();

  const [serviceBars, setServiceBars] = useState<ServiceBar[]>([]);

  // Load bars when modal opens
  useEffect(() => {
    if (isOpen && venue) {
      const bars = getServiceBarsForVenue(venue.id);
      setServiceBars(bars);
    }
  }, [isOpen, venue]);

  // Get default saved location for logged-in users
  const defaultLocation = !isGuest && profile?.savedLocations?.find(l => l.isDefault);

  // Helper to check if a bar is recommended
  const isBarRecommended = (bar: ServiceBar): boolean => {
    if (isGuest || !defaultLocation) return false;
    const barLoc = bar.location.toLowerCase();
    const savedLoc = defaultLocation.location.toLowerCase();
    return barLoc.includes(savedLoc) || savedLoc.includes(barLoc);
  };

  // Sort bars: recommended first, then by wait time
  const sortedBars = useMemo(() => {
    if (isGuest || !defaultLocation) {
      return [...serviceBars].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
    }

    return [...serviceBars].sort((a, b) => {
      const aRecommended = isBarRecommended(a);
      const bRecommended = isBarRecommended(b);
      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      return a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    });
  }, [serviceBars, isGuest, defaultLocation]);

  const handleSelectBar = (bar: ServiceBar) => {
    setServiceBar(bar);
    onClose();
  };

  if (!venue) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Service Bar" size="lg">
      <div className="space-y-3">
        {/* Info notice */}
        <div className="p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100 mb-4">
          <p className="text-sm text-slate-600">
            <ClockIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Ordering from: <span className="font-semibold">{venue.name}</span>
          </p>
        </div>

        {/* Bars list */}
        {sortedBars.map((bar) => {
          const isCurrentBar = currentBar?.id === bar.id;
          const isRecommended = isBarRecommended(bar);

          return (
            <Card
              key={bar.id}
              onClick={() => handleSelectBar(bar)}
              className={`${isCurrentBar ? 'ring-2 ring-primary-500 bg-primary-50/30' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Bar name and badges */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{bar.name}</h3>
                    {isRecommended && (
                      <Badge variant="primary" size="sm">
                        Recommended
                      </Badge>
                    )}
                    <Badge variant={getStatusColor(bar.status)} size="sm">
                      {getStatusLabel(bar.status)}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{bar.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
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
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>{bar.availableServers} servers</span>
                    </div>
                  </div>
                </div>

                {/* Current indicator */}
                {isCurrentBar && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {sortedBars.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            No service bars available at this venue
          </div>
        )}
      </div>
    </Modal>
  );
}
