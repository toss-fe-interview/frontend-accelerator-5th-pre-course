import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './Routes';

const queryClient = new QueryClient();

export function App() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <GlobalPortal.Provider>
          <Routes />
        </GlobalPortal.Provider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
