import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <GlobalStyles />
        <GlobalPortal.Provider>
          <Routes />
        </GlobalPortal.Provider>
      </QueryClientProvider>
    </>
  );
}
