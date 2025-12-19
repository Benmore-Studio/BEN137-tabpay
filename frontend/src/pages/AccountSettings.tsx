import { useNavigate } from 'react-router-dom';
import { User, Bell, BellOff, DollarSign, LogOut } from 'lucide-react';
import { AppLayout, Card, Button } from '../components';
import { useProfile, useAuth } from '../context';
import { useToast } from '../components/ui/Toast';

export default function AccountSettings() {
  const { profile, isGuest, updatePreferences } = useProfile();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect guests to auth
  if (isGuest || !profile) {
    return (
      <AppLayout cartCount={0} showBackButton={false}>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Sign in to view your profile</h3>
            <p className="text-slate-500 mt-1 mb-6">
              Create an account to save payment methods, order history, and more
            </p>
            <Button onClick={() => navigate('/auth')}>Sign In / Register</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSignOut = () => {
    logout();
    showToast('Signed out successfully', 'success');
    navigate('/auth');
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

  return (
    <AppLayout cartCount={0} showBackButton={false}>
      <div className="min-h-[calc(100vh-3.5rem-5rem)] flex flex-col px-4 pt-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Account</h1>
          <p className="text-slate-500 mt-1">Manage your account and settings</p>
        </div>

        {/* Content - takes available space */}
        <div className="flex-1 space-y-6">
          {/* Profile Card */}
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {profile.user.firstName.charAt(0)}
                  {profile.user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  {profile.user.firstName} {profile.user.lastName}
                </h2>
                <p className="text-sm text-slate-600">{profile.user.email}</p>
                {profile.user.phone && (
                  <p className="text-sm text-slate-600">{profile.user.phone}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Default Tip */}
              <Card variant="elevated">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900">Default Tip</h4>
                      <p className="text-sm text-slate-500">Pre-select your preferred tip amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 18, 20].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => handleTipChange(percent)}
                        className={`
                          px-4 py-3 rounded-lg text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150 min-h-[48px]
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
              </Card>

              {/* Notifications */}
              <Card variant="elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      profile.preferences.notifications ? 'bg-primary-100' : 'bg-slate-100'
                    }`}>
                      {profile.preferences.notifications ? (
                        <Bell className="w-5 h-5 text-primary-600" />
                      ) : (
                        <BellOff className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-slate-900">Order Notifications</h4>
                      <p className="text-sm text-slate-500">Get updates on your order status</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={handleToggleNotifications}
                    className={`
                      relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors
                      ${profile.preferences.notifications ? 'bg-primary-600' : 'bg-slate-300'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform
                        ${profile.preferences.notifications ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Sign Out - pinned near bottom */}
        <div className="pt-8 pb-6">
          <Button
            variant="secondary"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 !text-red-600 !ring-red-200 hover:!bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
