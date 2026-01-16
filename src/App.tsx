import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

const queryClient = new QueryClient();

export function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>로딩중...</div>}>
            <Routes />
          </Suspense>
        </QueryClientProvider>
      </GlobalPortal.Provider>
    </>
  );
}
