import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';
import { QueryProvider } from 'libs/queryProvider';

export function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <QueryProvider>
          <Routes />
        </QueryProvider>
      </GlobalPortal.Provider>
    </>
  );
}
