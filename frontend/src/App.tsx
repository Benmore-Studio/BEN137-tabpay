import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider, CartProvider, OrderHistoryProvider, FavoritesProvider, ProfileProvider } from './context';
import { ToastProvider, ErrorBoundary } from './components';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <CartProvider>
            <OrderHistoryProvider>
              <FavoritesProvider>
                <ToastProvider>
                  <RouterProvider router={router} />
                </ToastProvider>
              </FavoritesProvider>
            </OrderHistoryProvider>
          </CartProvider>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
