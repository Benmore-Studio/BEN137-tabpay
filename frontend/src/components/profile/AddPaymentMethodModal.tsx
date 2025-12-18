import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import type { PaymentMethod } from '../../types/auth';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: PaymentMethod) => void;
}

export default function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (cardNumber.length < 13 || !expiryDate || !cvc || !name) {
      return;
    }

    // Parse expiry date (MM/YY)
    const [month, year] = expiryDate.split('/').map((v) => parseInt(v, 10));
    const fullYear = 2000 + year;

    // Detect card brand (simple detection)
    const firstDigit = cardNumber.charAt(0);
    let brand = 'visa';
    if (firstDigit === '5') brand = 'mastercard';
    else if (firstDigit === '3') brand = 'amex';
    else if (firstDigit === '6') brand = 'discover';

    // Create payment method
    const newMethod: PaymentMethod = {
      id: `card_${Date.now()}`,
      type: 'card',
      last4: cardNumber.slice(-4),
      brand,
      expiryMonth: month,
      expiryYear: fullYear,
      isDefault,
    };

    onAdd(newMethod);
    onClose();

    // Reset form
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setName('');
    setIsDefault(false);
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 16);
    const groups = limited.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Payment Method</h2>
            <p className="text-sm text-slate-500">Securely save your card for faster checkout</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Card Number"
            type="text"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
            placeholder="1234 5678 9012 3456"
            required
            maxLength={19}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="text"
              value={formatExpiryDate(expiryDate)}
              onChange={(e) => setExpiryDate(e.target.value.replace(/\//g, ''))}
              placeholder="MM/YY"
              required
              maxLength={5}
            />
            <Input
              label="CVC"
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              required
              maxLength={4}
            />
          </div>

          <Input
            label="Cardholder Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="setDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="setDefault" className="text-sm text-slate-700">
              Set as default payment method
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Card
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </Modal>
  );
}
