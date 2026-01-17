import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
// import { SavingsCalculatorPage } from './SavingsCalculatorPage';
import { BestMatchingSavingsFinderPage } from './BestMatchingSavingsFinderPage';

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <SavingsCalculatorPage />,
  // },
  {
    path: '/',
    element: <BestMatchingSavingsFinderPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace={true} />,
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
