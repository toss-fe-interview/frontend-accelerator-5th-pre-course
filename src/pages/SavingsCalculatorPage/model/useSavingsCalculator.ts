import { SavingsProduct } from 'entities/savings-product/model/types';
import { SavingsGoalFormData } from 'features/calculate-savings/model/types';
import { useCallback, useState } from 'react';
import { DEFAULT_TERM_MONTHS, TAB_VALUES, TabValue } from './constants';

export function useSavingsCalculator() {
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [filter, setFilter] = useState<SavingsGoalFormData>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: DEFAULT_TERM_MONTHS,
  });

  const updateFilter = useCallback((data: SavingsGoalFormData) => {
    setFilter(data);
  }, []);

  const selectProduct = useCallback((product: SavingsProduct) => {
    setSelectedProduct(product);
  }, []);

  const changeTab = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    selectedProduct,
    filter,

    updateFilter,
    selectProduct,
    changeTab,
  };
}
