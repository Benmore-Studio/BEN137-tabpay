import { MapPinIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../ui';

interface LocationConfirmationStepProps {
  locationInput: string;
  onLocationChange: (value: string) => void;
  onConfirm: () => void;
  error: string;
}

export default function LocationConfirmationStep({
  locationInput,
  onLocationChange,
  onConfirm,
  error,
}: LocationConfirmationStepProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
      {/* Back to cart link */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to cart
      </Link>

      {/* Main content centered */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Hero icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/30 mb-6">
          <MapPinIcon className="w-10 h-10 text-white" />
        </div>

        {/* Title and helper text */}
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Confirm Your Location
        </h1>
        <p className="text-slate-500 text-center mb-8 max-w-xs">
          Enter your Seat or Location ID.
          <br />
          <span className="text-sm">You'll see this number next to the QR code.</span>
        </p>

        {/* Location input card */}
        <Card variant="elevated" className="w-full max-w-sm mb-6">
          <Input
            label="Seat / Location ID"
            placeholder="e.g., Seat 42, Machine 123"
            value={locationInput}
            onChange={(e) => onLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
            error={error}
            className="text-center text-lg"
            autoFocus
          />
        </Card>

        {/* Confirm button */}
        <Button variant="gold" size="lg" onClick={onConfirm} className="w-full max-w-sm">
          Confirm Location
        </Button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mt-auto pt-6">
        <div className="w-2 h-2 rounded-full bg-primary-500" />
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <span className="text-xs text-slate-400 ml-2">Step 1 of 2</span>
      </div>
    </div>
  );
}
