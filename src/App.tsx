import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export function App() {
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
