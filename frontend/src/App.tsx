import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider, CartProvider } from './context';
import { ToastProvider, ErrorBoundary } from './components';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
