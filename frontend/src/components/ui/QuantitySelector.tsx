import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizes = {
    sm: {
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      value: 'w-8 text-sm',
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      value: 'w-10 text-base',
    },
  };

  const s = sizes[size];

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`
          ${s.button}
          flex items-center justify-center
          rounded-full
          bg-gray-100 text-gray-700
          hover:bg-gray-200 active:bg-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-label="Decrease quantity"
      >
        <MinusIcon className={s.icon} />
      </button>

      <span
        className={`${s.value} text-center font-semibold text-gray-900`}
        aria-label={`Quantity: ${value}`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`
          ${s.button}
          flex items-center justify-center
          rounded-full
          bg-gray-100 text-gray-700
          hover:bg-gray-200 active:bg-gray-300
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-label="Increase quantity"
      >
        <PlusIcon className={s.icon} />
      </button>
    </div>
  );
}
