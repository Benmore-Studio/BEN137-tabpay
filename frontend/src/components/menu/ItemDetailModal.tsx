import { useState, useMemo } from 'react';
import { Modal, Button, QuantitySelector, Price, Input } from '../ui';
import type { MenuItem, SelectedModifier, ModifierOption } from '../../types';

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

  // Reset state when modal opens with new item
  useMemo(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions('');
      // Initialize required modifiers with first option
      const initial: Record<string, ModifierOption[]> = {};
      item.modifiers?.forEach((mod) => {
        if (mod.required && mod.options.length > 0) {
          initial[mod.id] = [mod.options[0]];
        }
      });
      setSelectedModifiers(initial);
    }
  }, [item?.id]);

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
          const { [modifierId]: _, ...rest } = prev;
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
    .reduce((sum, opt) => sum + opt.priceAdjustment, 0);

  const totalPrice = (item.price + modifierTotal) * quantity;

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
      <div className="space-y-6">
        {/* Image */}
        {item.image && (
          <div className="aspect-video -mx-4 -mt-4 overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            <Price amount={item.price} size="lg" />
          </div>
          <p className="mt-2 text-gray-600">{item.description}</p>

          {/* Dietary tags */}
          {item.dietary && (
            <div className="mt-3 flex gap-2">
              {item.dietary.vegetarian && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Vegetarian
                </span>
              )}
              {item.dietary.vegan && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Vegan
                </span>
              )}
              {item.dietary.glutenFree && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                  Gluten Free
                </span>
              )}
            </div>
          )}
        </div>

        {/* Modifiers */}
        {item.modifiers && item.modifiers.length > 0 && (
          <div className="space-y-4">
            {item.modifiers.map((modifier) => (
              <div key={modifier.id}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900">{modifier.name}</h3>
                  {modifier.required && (
                    <span className="text-xs text-red-600 font-medium">Required</span>
                  )}
                  {modifier.maxSelections && modifier.maxSelections > 1 && (
                    <span className="text-xs text-gray-500">
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
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                          }
                        `}
                      >
                        {option.name}
                        {option.priceAdjustment > 0 && (
                          <span className={isSelected ? 'text-primary-200' : 'text-gray-500'}>
                            {' '}
                            +${option.priceAdjustment.toFixed(2)}
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
            placeholder="Any allergies or special requests?"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Quantity</span>
          <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!isValid}
            className="flex-1"
          >
            Add to Cart - ${totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
