import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './Routes';

export function App() {
  const queryClient = new QueryClient();

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
