import { ErrorBoundary, Suspense } from '@suspensive/react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import SavingsCalculatorPage from './features/savings-calculator/Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Error</div>}>
          <SavingsCalculatorPage />
        </ErrorBoundary>
      </Suspense>
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
