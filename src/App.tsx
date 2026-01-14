import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </GlobalPortal.Provider>
    </>
  );
}
