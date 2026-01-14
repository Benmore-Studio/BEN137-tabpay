import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  QrCode,
  Clock,
  Flame,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { StarIcon } from '@heroicons/react/24/solid';
import { AppLayout, Card, Button } from '../components';
import { BarSelectorModal } from '../components/bar';
import { useCart, useProfile, useOrderHistory, useAuth } from '../context';
import Logo from '../assets/Logo.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isGuest } = useProfile();
  const { itemCount, serviceBar, venue } = useCart();
  const { orders, getRecentOrders } = useOrderHistory();
  const [isBarModalOpen, setIsBarModalOpen] = useState(false);

  const recentOrders = getRecentOrders(3);

  // Calculate fun stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    // Estimate time saved (assume 8 min saved per order vs waiting)
    const timeSaved = totalOrders * 8;

    // Find favorite item
    const itemCounts: Record<string, { name: string; count: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.menuItem.id]) {
          itemCounts[item.menuItem.id] = { name: item.menuItem.name, count: 0 };
        }
        itemCounts[item.menuItem.id].count += item.quantity;
      });
    });
    const favoriteItem = Object.values(itemCounts).sort((a, b) => b.count - a.count)[0];

    // Calculate streak (consecutive days with orders - simplified)
    const streak = Math.min(totalOrders, 7);

    return {
      totalOrders,
      totalSpent,
      timeSaved,
      favoriteItem: favoriteItem?.name || null,
      streak,
    };
  }, [orders]);

  const handleScanQR = () => {
    // In a real app, this would open the camera
    // For demo, navigate to guest entry with default params
    navigate('/order?venue=venue-001&bar=bar-001');
  };

  return (
    <AppLayout cartCount={itemCount} showBarSelector>
      <motion.div
        className="px-4 pt-6 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isGuest ? 'Welcome!' : `Hey, ${user?.firstName || 'there'}!`}
              </h1>
              <p className="text-slate-500 mt-0.5">
                {isGuest ? 'Ready to order?' : 'Ready for your next drink?'}
              </p>
            </div>
            <div className="w-12 h-12">
              <img src={Logo} alt="TabPay" className="w-full h-full object-contain" />
            </div>
          </div>
        </motion.div>

        {/* Scan QR Button - Primary Action */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            onClick={handleScanQR}
            size="lg"
            className="w-full justify-center gap-3 h-14"
          >
            <QrCode className="w-5 h-5" />
            Scan QR Code to Order
          </Button>
        </motion.div>

        {/* Ordering From Card - Auth users can change bar here */}
        {!isGuest && serviceBar && venue && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ordering from</span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{serviceBar.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">{venue.name}</span>
                    {serviceBar.status !== 'closed' && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        serviceBar.status === 'low' ? 'bg-green-100 text-green-700' :
                        serviceBar.status === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        ~{serviceBar.estimatedWaitMinutes} min
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsBarModalOpen(true)}
                >
                  Change
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        {!isGuest && stats.totalOrders > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Your Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="text-center py-4">
                <div className="text-2xl font-bold text-primary-600">{stats.totalOrders}</div>
                <div className="text-xs text-slate-500 mt-1">Orders Placed</div>
              </Card>
              <Card className="text-center py-4">
                <div className="text-2xl font-bold text-green-600">{stats.timeSaved}m</div>
                <div className="text-xs text-slate-500 mt-1">Time Saved</div>
              </Card>
              {stats.favoriteItem && (
                <Card className="text-center py-4">
                  <div className="flex justify-center mb-1">
                    <StarIcon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div className="text-sm font-semibold text-slate-900 truncate px-2">{stats.favoriteItem}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Favorite</div>
                </Card>
              )}
              <Card className="text-center py-4">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-500">{stats.streak}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Day Streak</div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Recent Orders */}
        {!isGuest && recentOrders.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Recent Orders</h2>
              <Link to="/orders" className="text-sm text-primary-600 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <Card key={order.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {order.items.map(i => i.menuItem.name).join(', ')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {order.location && (
                          <>
                            <span>•</span>
                            <span>{order.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 ml-3">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State for Guests or New Users */}
        {(isGuest || stats.totalOrders === 0) && (
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="text-center py-8 bg-gradient-to-br from-primary-50 to-white">
              <Sparkles className="w-10 h-10 text-primary-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">
                {isGuest ? 'Skip the Line' : 'Ready to Get Started?'}
              </h3>
              <p className="text-sm text-slate-500 mb-4 max-w-[250px] mx-auto">
                Scan the QR code at your table or slot machine to order drinks instantly
              </p>
              {isGuest && (
                <Link to="/auth">
                  <Button variant="secondary" size="sm">
                    Create Account for Rewards
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Bar selector modal */}
      <BarSelectorModal
        isOpen={isBarModalOpen}
        onClose={() => setIsBarModalOpen(false)}
      />
    </AppLayout>
  );
}
