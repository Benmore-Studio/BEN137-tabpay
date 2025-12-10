interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variants[variant]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton compositions for common use cases
export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
      <Skeleton variant="rectangular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={16} width="80%" />
        <Skeleton variant="text" height={18} width="30%" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-3 p-4 border-b border-gray-100">
      <Skeleton variant="rectangular" width={64} height={64} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={18} width="70%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
      <Skeleton variant="text" width={60} height={20} />
    </div>
  );
}
