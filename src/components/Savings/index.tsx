import { ReactNode, createContext, useContext, useState, useEffect, Children, isValidElement, cloneElement } from 'react';
import { http, ListRow } from 'tosslib';
import { SavingsTabValue } from 'pages/SavingsCalculatorPage';

// 분리된 컴포넌트 import
import { SavingsNavigationBar } from './SavingsNavigationBar';
import { Calculator } from './Calculator';
import { SavingsDivider } from './SavingsDivider';
import { SavingsTabNavigation } from './SavingsTabNavigation';
import { SavingTabContent } from './SavingTabContent';
import { Result } from './Result';
import { ProductList } from './ProductList';
import { SavingsCalculatorState } from './Calculator/useSavingsCalculator';
import { filterSavingsProducts } from 'utils/savings';

// TabContent 타입 export

// hook & context export
export { useSavingsCalculator } from './Calculator';

export interface SavingsProduct {                                                                                   
  id: string;                                                                                                       
  name: string;                                                                                                     
  annualRate: number;                                                                                               
  minMonthlyAmount: number;                                                                                         
  maxMonthlyAmount: number;                                                                                         
  availableTerms: number;                                                                                           
}        

// Context 값 타입
interface SavingsContextValue {
  calculatorState: SavingsCalculatorState;
  products: SavingsProduct[];
  filteredProducts: SavingsProduct[];
  topRateProducts: SavingsProduct[];
  selectedProductId: string | null;
  setSelectProduct: (productId: string) => void;
  selectedTab: SavingsTabValue;
  setSelectedTab: (tab: SavingsTabValue) => void;
}

const SavingsContext = createContext<SavingsContextValue | null>(null);

interface SavingsProviderProps {
  children: ReactNode;
  calculatorState: SavingsCalculatorState;
}

function SavingsRoot({ children, calculatorState }: SavingsProviderProps) {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SavingsProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<SavingsTabValue>('products');

  const setSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      const response = await http.get<SavingsProduct[]>('/api/savings-products');
      setProducts(response);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = filterSavingsProducts(products, {
      monthlyDeposit: Number(calculatorState.monthlyDeposit) || 0,
      period: calculatorState.savingsPeriod,
    });
    setFilteredProducts(filtered)
  },[calculatorState, products])

  // 연이자율 상위 2개 상품
  const topRateProducts = [...filteredProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);


  const value: SavingsContextValue = {
    calculatorState,
    products,
    filteredProducts,
    topRateProducts,
    selectedProductId,
    setSelectProduct,
    selectedTab,
    setSelectedTab,
  };

  return (
    <SavingsContext.Provider value={value}>
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavingsContext() {
  const context = useContext(SavingsContext);

  if (context === null) {
    throw new Error('useSavingsContext must be used within SavingsProvider');
  }

  return context;
}



// ============================================
// Compound Component Assembly
// ============================================
export const Savings = Object.assign(SavingsRoot, {
  NavigationBar: SavingsNavigationBar,
  Calculator,
  Divider: SavingsDivider,
  TabNavigation: SavingsTabNavigation,
  TabContent: SavingTabContent,
  ProductList,
  Result,
});
