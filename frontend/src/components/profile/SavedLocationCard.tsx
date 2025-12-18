import { MapPin, Trash2, Check } from 'lucide-react';
import type { SavedLocation } from '../../types/auth';
import { Card, Button } from '../ui';

interface SavedLocationCardProps {
  location: SavedLocation;
  onSetDefault: () => void;
  onRemove: () => void;
}

export default function SavedLocationCard({ location, onSetDefault, onRemove }: SavedLocationCardProps) {
  return (
    <Card variant="elevated" className="relative">
      {location.isDefault && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
          <Check className="w-3 h-3" />
          <span className="text-xs font-medium">Default</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{location.label}</p>
          <p className="text-sm text-slate-600 mt-0.5">{location.venue.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{location.location}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {!location.isDefault && (
          <Button variant="secondary" onClick={onSetDefault} className="flex-1">
            Set as Default
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onRemove}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </Button>
      </div>
    </Card>
  );
}
