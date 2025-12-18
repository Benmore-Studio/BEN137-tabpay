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
        bg-slate-200 animate-pulse
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
    <div className="flex gap-4 p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm">
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
    <div className="flex gap-3 p-4 border-b border-slate-100">
      <Skeleton variant="rectangular" width={64} height={64} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={18} width="70%" />
        <Skeleton variant="text" height={14} width="40%" />
      </div>
      <Skeleton variant="text" width={60} height={20} />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="rectangular" width={70} height={20} />
          </div>
          <Skeleton variant="text" width={120} height={14} />
        </div>
        <Skeleton variant="text" width={60} height={24} />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="text" width={100} height={16} />
      </div>
    </div>
  );
}

export function ServiceBarSkeleton() {
  return (
    <div className="p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
        <Skeleton variant="rectangular" width={70} height={24} />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton variant="text" width={100} height={16} />
        <Skeleton variant="text" width={120} height={16} />
      </div>
      <Skeleton variant="rectangular" width="100%" height={40} />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* User info skeleton */}
      <div className="p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm">
        <div className="flex items-start gap-4">
          <Skeleton variant="circular" width={64} height={64} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" height={24} />
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
          </div>
        </div>
      </div>

      {/* Section skeleton */}
      <div className="space-y-3">
        <Skeleton variant="text" width={150} height={20} />
        <div className="p-4 bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-sm space-y-3">
          <Skeleton variant="text" width="80%" height={18} />
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </div>
      </div>
    </div>
  );
}
