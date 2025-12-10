import { createBrowserRouter, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Venues from '../pages/Venues';
import ServiceBars from '../pages/ServiceBars';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';

export const router = createBrowserRouter([
  // Landing / Entry
  {
    path: '/',
    element: <Landing />,
  },
  // Auth (unified login/register)
  {
    path: '/auth',
    element: <Auth />,
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
  // Venue & Service Bar Selection
  {
    path: '/venues',
    element: <Venues />,
  },
  {
    path: '/venues/:venueId/bars',
    element: <ServiceBars />,
  },
  // Ordering Flow
  {
    path: '/menu',
    element: <Menu />,
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
]);
