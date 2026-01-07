import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './index';
import { useNotifications } from '../../context';

interface NotificationPromptProps {
  onDismiss: () => void;
}

export default function NotificationPrompt({ onDismiss }: NotificationPromptProps) {
  const { requestPermission, permissionState } = useNotifications();

  // Don't show if not supported or already granted
  if (!permissionState.isSupported || permissionState.permission === 'granted') {
    return null;
  }

  const handleEnable = async () => {
    await requestPermission();
    onDismiss();
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[105] animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/5 p-4">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Dismiss"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <BellIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-slate-900">Stay Updated</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Get notified when your order is ready for delivery.
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="secondary" onClick={onDismiss} className="flex-1">
            Not Now
          </Button>
          <Button onClick={handleEnable} className="flex-1">
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}
