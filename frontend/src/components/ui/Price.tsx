interface PriceProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  strikethrough?: boolean;
}

export default function Price({
  amount,
  currency = '$',
  size = 'md',
  className = '',
  strikethrough = false,
}: PriceProps) {
  const formattedPrice = amount.toFixed(2);

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <span
      className={`
        font-semibold tabular-nums
        ${sizes[size]}
        ${strikethrough ? 'line-through text-gray-400' : 'text-gray-900'}
        ${className}
      `}
    >
      {currency}
      {formattedPrice}
    </span>
  );
}
