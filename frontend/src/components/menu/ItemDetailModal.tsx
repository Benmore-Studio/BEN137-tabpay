import { useState, useEffect, useCallback } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Modal, Button, QuantitySelector, Price, Input } from '../ui';
import { useFavorites } from '../../context';
import type { MenuItem, SelectedModifier, ModifierOption } from '../../types';
import { getDisplayPrice, getModifierPrice } from '../../utils/pricing';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    quantity: number,
    selectedModifiers: SelectedModifier[],
    specialInstructions?: string
  ) => void;
}

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, ModifierOption[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  // Compute initial modifiers for required fields
  const computeInitialModifiers = useCallback((menuItem: MenuItem) => {
    const initial: Record<string, ModifierOption[]> = {};
    menuItem.modifiers?.forEach((mod) => {
      if (mod.required && mod.options.length > 0) {
        initial[mod.id] = [mod.options[0]];
      }
    });
    return initial;
  }, []);

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedModifiers(computeInitialModifiers(item));
    }
  }, [item, computeInitialModifiers]);

  if (!item) return null;

  const handleModifierChange = (
    modifierId: string,
    option: ModifierOption,
    maxSelections?: number
  ) => {
    setSelectedModifiers((prev) => {
      const current = prev[modifierId] || [];
      const isSelected = current.some((o) => o.id === option.id);

      if (isSelected) {
        // Deselect
        const filtered = current.filter((o) => o.id !== option.id);
        if (filtered.length === 0) {
          const { [modifierId]: _removed, ...rest } = prev;
          void _removed; // Intentionally unused - destructuring to remove key
          return rest;
        }
        return { ...prev, [modifierId]: filtered };
      } else {
        // Select
        if (maxSelections === 1) {
          return { ...prev, [modifierId]: [option] };
        }
        if (maxSelections && current.length >= maxSelections) {
          // Replace oldest selection
          return { ...prev, [modifierId]: [...current.slice(1), option] };
        }
        return { ...prev, [modifierId]: [...current, option] };
      }
    });
  };

  const isOptionSelected = (modifierId: string, optionId: string) => {
    return selectedModifiers[modifierId]?.some((o) => o.id === optionId) || false;
  };

  const modifierTotal = Object.values(selectedModifiers)
    .flat()
    .reduce((sum, opt) => sum + getModifierPrice(opt.priceAdjustment), 0);

  const totalPrice = (getDisplayPrice(item.price) + modifierTotal) * quantity;

  // Check if all required modifiers are selected
  const isValid = item.modifiers?.every(
    (mod) => !mod.required || (selectedModifiers[mod.id]?.length ?? 0) > 0
  ) ?? true;

  const handleAddToCart = () => {
    const formattedModifiers: SelectedModifier[] = Object.entries(selectedModifiers).map(
      ([modifierId, options]) => {
        const modifier = item.modifiers?.find((m) => m.id === modifierId);
        return {
          modifierId,
          modifierName: modifier?.name || '',
          selectedOptions: options,
        };
      }
    );

    onAddToCart(
      quantity,
      formattedModifiers,
      specialInstructions.trim() || undefined
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-[80vh]">
        {/* Image - compact aspect ratio */}
        {item.image && (
          <div className="aspect-[3/2] -mx-4 -mt-4 overflow-hidden rounded-t-2xl sm:rounded-t-2xl bg-slate-100 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content - no scrolling */}
        <div className="flex-1 -mx-4 px-4 overflow-hidden">
          <div className="space-y-4 pt-4">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{item.name}</h2>
                  {/* Favorite Heart */}
                  <button
                    onClick={() => toggleFavorite(item)}
                    className="flex-shrink-0 p-1.5 -m-1.5 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite(item.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500 animate-scale-in" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors" />
                    )}
                  </button>
                </div>
                <Price amount={getDisplayPrice(item.price)} size="md" className="flex-shrink-0" />
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>

              {/* Dietary tags */}
              {item.dietary && (
                <div className="mt-2 flex gap-1.5">
                  {item.dietary.vegetarian && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                      V
                    </span>
                  )}
                  {item.dietary.vegan && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                      VG
                    </span>
                  )}
                  {item.dietary.glutenFree && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                      GF
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modifiers */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="space-y-3">
                {item.modifiers.map((modifier) => (
                  <div key={modifier.id}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-medium text-slate-900">{modifier.name}</h3>
                      {modifier.required && (
                        <span className="text-xs text-red-600 font-medium">Required</span>
                      )}
                      {modifier.maxSelections && modifier.maxSelections > 1 && (
                        <span className="text-xs text-slate-500">
                          (Choose up to {modifier.maxSelections})
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {modifier.options.map((option) => {
                        const isSelected = isOptionSelected(modifier.id, option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              handleModifierChange(
                                modifier.id,
                                option,
                                modifier.maxSelections || (modifier.required ? 1 : undefined)
                              )
                            }
                            className={`
                              px-4 py-2 rounded-lg text-sm font-medium
                              border transition-colors duration-200
                              ${
                                isSelected
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400'
                              }
                            `}
                            aria-pressed={isSelected}
                            aria-label={`${option.name}${option.priceAdjustment > 0 ? `, add $${getModifierPrice(option.priceAdjustment).toFixed(2)}` : ''}`}
                          >
                            {option.name}
                            {option.priceAdjustment > 0 && (
                              <span className={isSelected ? 'text-primary-200' : 'text-slate-500'}>
                                {' '}
                                +${getModifierPrice(option.priceAdjustment).toFixed(2)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <Input
                label="Special Instructions"
                placeholder="Any allergies or requests?"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
            </div>
          </div>
        </div>

        {/* Fixed Footer - always visible with bottom nav clearance */}
        <div className="flex-shrink-0 flex items-center gap-3 pt-3 pb-20 md:pb-4 border-t border-slate-100 bg-white -mx-4 px-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 !bg-red-50 !text-red-700 !ring-red-200 hover:!bg-red-100 hover:!ring-red-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!isValid}
            className="flex-1 whitespace-nowrap"
          >
            Add ${totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
