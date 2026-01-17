import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { SavingsCalculatorPage } from './SavingCalculator/ui/SavingsCalculatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SavingsCalculatorPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace={true} />,
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
