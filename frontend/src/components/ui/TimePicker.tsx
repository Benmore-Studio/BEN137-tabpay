import { ClockIcon, BoltIcon } from '@heroicons/react/24/outline';

interface TimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  isASAP: boolean;
  onASAPChange: (isASAP: boolean) => void;
}

function generateTimeSlots(): Date[] {
  const slots: Date[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
  const endTime = new Date(now.getTime() + 4 * 60 * 60000); // 4 hours from now

  let currentSlot = new Date(startTime);
  // Round to next 15-minute mark
  const minutes = currentSlot.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  currentSlot.setMinutes(roundedMinutes, 0, 0);

  while (currentSlot <= endTime) {
    slots.push(new Date(currentSlot));
    currentSlot = new Date(currentSlot.getTime() + 15 * 60000); // Add 15 minutes
  }

  return slots;
}

function formatTimeSlot(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export default function TimePicker({ value, onChange, isASAP, onASAPChange }: TimePickerProps) {
  const timeSlots = generateTimeSlots();

  const handleASAPClick = () => {
    onASAPChange(true);
    onChange(null);
  };

  const handleTimeSlotClick = (slot: Date) => {
    onASAPChange(false);
    onChange(slot);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900">
        When would you like your order?
      </label>

      {/* ASAP Button - Prominent */}
      <button
        type="button"
        onClick={handleASAPClick}
        className={`
          w-full p-4 rounded-xl text-left
          border-2 transition-all duration-200
          ${
            isASAP
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25'
              : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            ${isASAP ? 'bg-white/20' : 'bg-primary-100'}
          `}
          >
            <BoltIcon
              className={`w-5 h-5 ${isASAP ? 'text-white' : 'text-primary-600'}`}
              strokeWidth={2}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isASAP ? 'text-white' : 'text-slate-900'}`}>
                ASAP
              </span>
              {isASAP && (
                <span className="px-2 py-0.5 text-xs font-medium bg-white/20 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            <p className={`text-sm mt-0.5 ${isASAP ? 'text-primary-100' : 'text-slate-500'}`}>
              Get your order as soon as possible
            </p>
          </div>
        </div>
      </button>

      {/* Time Slots */}
      <div>
        <p className="text-xs text-slate-500 mb-2 px-1">Or schedule for later</p>
        <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
          {timeSlots.map((slot) => {
            const isSelected = !isASAP && value && slot.getTime() === value.getTime();
            return (
              <button
                key={slot.toISOString()}
                type="button"
                onClick={() => handleTimeSlotClick(slot)}
                className={`
                  px-3 py-2.5 rounded-lg text-sm font-medium
                  border transition-all duration-200
                  min-h-[48px] flex items-center justify-center
                  ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                  }
                `}
              >
                <ClockIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                {formatTimeSlot(slot)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
