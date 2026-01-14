import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './Routes';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <Routes />
      </GlobalPortal.Provider>
    </QueryClientProvider>
  );
}
