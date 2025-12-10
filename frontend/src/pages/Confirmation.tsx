import { Link, useParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { AppLayout, Button, Card } from '../components';
import type { OrderStatus } from '../types';

const orderStages: { status: OrderStatus; label: string }[] = [
  { status: 'received', label: 'Order Received' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'delivering', label: 'On the Way' },
  { status: 'delivered', label: 'Delivered' },
];

// Mock current status - in production this would come from real-time updates
const currentStatus: OrderStatus = 'preparing';

export default function Confirmation() {
  const { orderId } = useParams<{ orderId: string }>();

  const currentStageIndex = orderStages.findIndex((s) => s.status === currentStatus);

  return (
    <AppLayout showHeader={false}>
      <div className="min-h-screen flex flex-col px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-1">Thank you for your order</p>
          <p className="text-lg font-mono font-semibold text-primary-600 mt-2">
            #{orderId}
          </p>
        </div>

        {/* Estimated Time */}
        <Card className="mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Estimated Delivery Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">15-20 minutes</p>
          </div>
        </Card>

        {/* Order Status Tracker */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
            <div
              className="absolute left-4 top-4 w-0.5 bg-primary-600 transition-all duration-500"
              style={{
                height: `${(currentStageIndex / (orderStages.length - 1)) * 100}%`,
              }}
            />

            {/* Stages */}
            <div className="space-y-6">
              {orderStages.map((stage, index) => {
                const isComplete = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stage.status} className="flex items-center gap-4">
                    {/* Status Dot */}
                    <div
                      className={`
                        relative z-10 w-8 h-8 rounded-full
                        flex items-center justify-center
                        transition-colors duration-300
                        ${
                          isComplete
                            ? 'bg-primary-600'
                            : 'bg-white border-2 border-gray-300'
                        }
                      `}
                    >
                      {isComplete && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <p
                        className={`
                          font-medium
                          ${isCurrent ? 'text-primary-600' : isComplete ? 'text-gray-900' : 'text-gray-400'}
                        `}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-gray-500">In progress...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <p className="text-sm text-gray-500 text-center mb-6">
          A server will bring your order to your location.
          <br />
          Please stay nearby to receive your order.
        </p>

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <Link to="/menu" className="block">
            <Button variant="primary" className="w-full">
              Order More
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button variant="secondary" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
