import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

export function App() {
  return (
    <>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <GlobalPortal.Provider>
          <Routes />
        </GlobalPortal.Provider>
      </QueryClientProvider>
    </>
  );
}
