import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Context에서 관리할 상태 타입 정의
interface AppState {
  count: number;
  user: string | null;
}

// 2. Context 값 타입 정의 (상태 + 액션)
interface AppContextValue {
  state: AppState;
  increment: () => void;
  decrement: () => void;
  setUser: (name: string | null) => void;
}

// 3. Context 생성 (초기값은 null로 설정)
const AppContext = createContext<AppContextValue | null>(null);

// 4. Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>({
    count: 0,
    user: null,
  });

  const increment = () => {
    setState((prev) => ({ ...prev, count: prev.count + 1 }));
  };

  const decrement = () => {
    setState((prev) => ({ ...prev, count: prev.count - 1 }));
  };

  const setUser = (name: string | null) => {
    setState((prev) => ({ ...prev, user: name }));
  };

  const value: AppContextValue = {
    state,
    increment,
    decrement,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 5. Context를 사용하기 위한 커스텀 훅
export function useAppContext() {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}

// 6. Context도 export (필요시 직접 접근 가능)
export { AppContext };
