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
        px-4 py-2
        rounded-full
        font-medium text-sm
        whitespace-nowrap
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${
          active
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`
            text-xs
            ${active ? 'text-primary-200' : 'text-gray-500'}
          `}
        >
          ({count})
        </span>
      )}
    </button>
  );
}
