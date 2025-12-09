import { createBrowserRouter } from 'react-router-dom';
import Landing from '../pages/Landing';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Confirmation from '../pages/Confirmation';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
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
