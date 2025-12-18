import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MobileOnlyLayout } from '../components';

// Public pages (desktop-friendly)
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Install from '../pages/Install';

// Mobile-only ordering flow
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';
import ServiceBars from '../pages/ServiceBars';
import Orders from '../pages/Orders';
import Favorites from '../pages/Favorites';
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
  // ================================
  // Public Routes (Desktop-Friendly)
  // ================================
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/install',
    element: <Install />,
  },

  // Legacy routes redirect to /auth
  {
    path: '/login',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/auth" replace />,
  },

  // Legacy venues route redirects to menu
  {
    path: '/venues',
    element: <Navigate to="/menu" replace />,
  },

  // ================================
  // Mobile-Only Routes
  // ================================
  {
    element: <MobileOnlyLayout />,
    children: [
      // Ordering flow
      {
        path: '/menu',
        element: <Menu />,
      },
      {
        path: '/favorites',
        element: <Favorites />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/confirmation/:orderId',
        element: <Confirmation />,
      },

      // Service bar selection (for multi-bar venues)
      {
        path: '/venues/:venueId/bars',
        element: <ServiceBars />,
      },

      // Orders history
      {
        path: '/orders',
        element: <Orders />,
      },

      // Profile/Account
      {
        path: '/account',
        element: <Profile />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },

  // ================================
  // Admin Routes (Desktop-Friendly)
  // ================================
  // Future: Admin dashboard, venue management, etc.
  // {
  //   element: <AdminLayout />,
  //   children: [
  //     { path: '/admin', element: <Dashboard /> },
  //   ],
  // },
]);
