import { GlobalPortal, GlobalStyles } from 'tosslib';
import { Routes } from './Routes';

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
