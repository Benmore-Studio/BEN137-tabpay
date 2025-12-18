interface CategoryChipProps {
  label: string;
  active?: boolean;
  count?: number;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export default function CategoryChip({
  label,
  active = false,
  count,
  onClick,
  icon,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
        px-4 py-3
        min-h-12
        rounded-full
        font-medium text-sm
        whitespace-nowrap
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${
          active
            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
            : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50'
        }
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`
            text-xs
            ${active ? 'text-primary-200' : 'text-slate-400'}
          `}
        >
          ({count})
        </span>
      )}
    </button>
  );
}
