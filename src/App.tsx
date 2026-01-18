import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <QueryClientProvider client={new QueryClient()}>
          <Routes />
        </QueryClientProvider>
      </GlobalPortal.Provider>
    </>
  );
}
