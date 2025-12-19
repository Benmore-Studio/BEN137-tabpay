import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Settings, Heart, Receipt, LogOut, Plus, Bell, BellOff } from 'lucide-react';
import { AppLayout, Card, Button } from '../components';
import { PaymentMethodCard, AddPaymentMethodModal } from '../components/profile';
import { useProfile, useAuth } from '../context';
import { useToast } from '../components/ui/Toast';

export default function Profile() {
  const { profile, isGuest, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, updatePreferences } = useProfile();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Redirect guests to auth
  if (isGuest || !profile) {
    return (
      <AppLayout cartCount={0} showBackButton={false}>
        <div className="px-4 pt-6 pb-24 md:pb-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Sign in to view your profile</h3>
            <p className="text-slate-500 mt-1 mb-6">
              Create an account to save payment methods, order history, and more
            </p>
            <Link to="/auth">
              <Button>Sign In / Register</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleRemovePaymentMethod = (id: string) => {
    removePaymentMethod(id);
    showToast('Payment method removed', 'success');
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setDefaultPaymentMethod(id);
    showToast('Default payment method updated', 'success');
  };

  const handleToggleNotifications = () => {
    updatePreferences({ notifications: !profile.preferences.notifications });
    showToast(
      profile.preferences.notifications ? 'Notifications disabled' : 'Notifications enabled',
      'success'
    );
  };

  const handleTipChange = (percent: number) => {
    updatePreferences({ defaultTipPercent: percent });
    showToast(`Default tip set to ${percent}%`, 'success');
  };

  const handleSignOut = () => {
    logout();
    showToast('Signed out successfully', 'success');
    navigate('/auth');
  };

  return (
    <AppLayout cartCount={0} showBackButton={false}>
      <div className="px-4 pt-6 pb-24 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account settings</p>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card variant="elevated">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile.user.firstName.charAt(0)}
                  {profile.user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">
                  {profile.user.firstName} {profile.user.lastName}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">{profile.user.email}</p>
                <p className="text-sm text-slate-600">{profile.user.phone}</p>
              </div>
            </div>
          </Card>

          {/* Payment Methods Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Payment Methods</h3>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddPaymentModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </Button>
            </div>

            {profile.paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {profile.paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onSetDefault={() => handleSetDefaultPaymentMethod(method.id)}
                    onRemove={() => handleRemovePaymentMethod(method.id)}
                  />
                ))}
              </div>
            ) : (
              <Card variant="elevated">
                <div className="text-center py-6">
                  <CreditCard className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm text-slate-600">No payment methods saved</p>
                  <p className="text-xs text-slate-500 mt-1">Add a card for faster checkout</p>
                </div>
              </Card>
            )}
          </div>

          {/* Order Preferences Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Preferences</h3>
            </div>

            <Card variant="elevated">
              <div className="space-y-4">
                {/* Default Tip */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Default Tip
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 18, 20].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => handleTipChange(percent)}
                        className={`
                          px-4 py-2.5 rounded-lg text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150 min-h-[48px]
                          ${
                            profile.preferences.defaultTipPercent === percent
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        `}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    {profile.preferences.notifications ? (
                      <Bell className="w-5 h-5 text-primary-600" />
                    ) : (
                      <BellOff className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900">Order Notifications</p>
                      <p className="text-xs text-slate-500">Get updates on your orders</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${profile.preferences.notifications ? 'bg-primary-600' : 'bg-slate-300'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${profile.preferences.notifications ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/orders">
                <Card variant="elevated" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Order History</p>
                      <p className="text-xs text-slate-500">View past orders</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link to="/favorites">
                <Card variant="elevated" className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Favorites</p>
                      <p className="text-xs text-slate-500">Your saved items</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            variant="secondary"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onAdd={addPaymentMethod}
      />
    </AppLayout>
  );
}
