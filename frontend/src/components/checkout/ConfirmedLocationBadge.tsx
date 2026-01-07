import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/outline';

interface ConfirmedLocationBadgeProps {
  location: string;
  onEdit?: () => void;
  showEditButton?: boolean;
  variant?: 'default' | 'compact';
}

export default function ConfirmedLocationBadge({
  location,
  onEdit,
  showEditButton = true,
  variant = 'default',
}: ConfirmedLocationBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 ring-1 ring-green-200">
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">{location}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 ring-1 ring-green-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <MapPinIcon className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Location Confirmed</span>
          </div>
          <p className="font-bold text-slate-900">{location}</p>
        </div>
      </div>
      {showEditButton && onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
      )}
    </div>
  );
}
