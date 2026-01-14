import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClockIcon, MapPinIcon, ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { AppLayout, Card, Price, Button } from '../components';
import { useOrderHistory, useCart, useProfile } from '../context';
import { useToast } from '../components/ui/Toast';
import type { Order } from '../types';

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Active orders go to confirmation page, completed orders expand inline
  const isActiveOrder = ['received', 'preparing', 'delivering'].includes(order.status);

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();

    let unavailableCount = 0;
    let addedCount = 0;

    // Add all items from the order to cart
    order.items.forEach((item) => {
      if (item.menuItem.available) {
        addItem(item.menuItem, item.quantity, item.selectedModifiers, item.specialInstructions);
        addedCount++;
      } else {
        unavailableCount++;
      }
    });

    // Show appropriate toast
    if (unavailableCount > 0) {
      showToast(
        `${addedCount} items added to cart. ${unavailableCount} unavailable items skipped.`,
        'error'
      );
    } else {
      showToast(`Order added to cart (${addedCount} items)`, 'success');
    }

    // Navigate to cart
    navigate('/cart');
  };

  const handleCardClick = () => {
    if (isActiveOrder) {
      navigate(`/confirmation/${order.id}`);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      variant="elevated"
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs tabular-nums font-bold text-primary-600 tracking-tight">#{order.id}</span>
              <span className={`
                px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1
                ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-primary-100 text-primary-700'}
              `}>
                {isActiveOrder && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                )}
                {order.status === 'delivered' ? 'Completed' :
                 order.status === 'cancelled' ? 'Cancelled' :
                 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Price amount={order.total} size="lg" className="font-bold" />
            {isActiveOrder ? (
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            ) : isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShoppingBagIcon className="w-4 h-4" />
            <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4" />
            <span>{order.location}</span>
          </div>
          {order.scheduledFor && !order.isASAP && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              <span>Scheduled</span>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {/* Items List */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-slate-700">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      {item.selectedModifiers.length > 0 && (
                        <div className="ml-4 mt-0.5 text-xs text-slate-500">
                          {item.selectedModifiers.map((mod) => (
                            <div key={mod.modifierId}>
                              {mod.modifierName}: {mod.selectedOptions.map((opt) => opt.name).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <div className="ml-4 mt-0.5 text-xs text-slate-500 italic">
                          Note: {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    <Price amount={item.totalPrice} size="sm" className="flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2 border-t border-slate-100 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <Price amount={order.subtotal} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax</span>
                <Price amount={order.tax} size="sm" />
              </div>
              {order.tip && order.tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Tip</span>
                  <span className="font-medium text-gold-600">${order.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
                <span className="text-slate-900">Total</span>
                <Price amount={order.total} size="md" />
              </div>
            </div>

            {/* Reorder Button */}
            <Button variant="secondary" className="w-full" onClick={handleReorder}>
              Reorder
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function Orders() {
  const { orders, loading, activeOrderIds } = useOrderHistory();
  const { isGuest } = useProfile();

  // For guests, only show active orders from their session
  // For authenticated users, show full order history
  const displayOrders = isGuest
    ? orders.filter((order) => activeOrderIds.includes(order.id))
    : orders;

  return (
    <AppLayout
      cartCount={0}
      showBackButton={isGuest}
      headerTitle={isGuest ? 'Your Orders' : undefined}
      showBarSelector={!isGuest}
    >
      <div className="px-4 pt-6">
        {/* Header - only show for authenticated users (guests get it from AppLayout) */}
        {!isGuest && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
            <p className="text-slate-500 mt-1">View your past orders</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Orders List */}
        {!loading && displayOrders.length > 0 && (
          <div className="space-y-3">
            {displayOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {/* Back to Menu link for guests */}
            {isGuest && (
              <div className="pt-4">
                <Link to="/menu" className="block">
                  <Button variant="secondary" className="w-full">
                    Back to Menu
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayOrders.length === 0 && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ShoppingBagIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {isGuest ? 'No active orders' : 'No orders yet'}
              </h3>
              <p className="text-slate-500 mt-1 mb-6">
                {isGuest
                  ? 'Place an order to see it here'
                  : 'Your order history will appear here'}
              </p>
              <Link to="/menu">
                <Button>Browse Menu</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
