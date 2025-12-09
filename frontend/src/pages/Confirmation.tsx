import { useParams } from 'react-router-dom';

export default function Confirmation() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Order #{orderId}</p>
        </div>
      </div>
    </div>
  );
}
