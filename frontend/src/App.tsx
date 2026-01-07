import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider, CartProvider, OrderHistoryProvider, FavoritesProvider, ProfileProvider, NotificationProvider } from './context';
import { ToastProvider, ErrorBoundary } from './components';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <CartProvider>
            <OrderHistoryProvider>
              <FavoritesProvider>
                <NotificationProvider>
                  <ToastProvider>
                    <RouterProvider router={router} />
                  </ToastProvider>
                </NotificationProvider>
              </FavoritesProvider>
            </OrderHistoryProvider>
          </CartProvider>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
