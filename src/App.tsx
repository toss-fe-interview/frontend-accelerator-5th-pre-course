import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './pages/Routes';

export function App() {
  return (
    <>
      <GlobalStyles />
      <GlobalPortal.Provider>
        <Routes />
      </GlobalPortal.Provider>
    </>
  );
}
