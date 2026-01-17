import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from 'react-query';

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
