import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { SavingsCalculatorPage } from './SavingsCalculatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <NuqsAdapter>
        <SavingsCalculatorPage />
      </NuqsAdapter>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace={true} />,
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
