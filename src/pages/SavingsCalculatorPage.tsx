import CalculationResultTab from 'components/CalculationResultTab';
import ProductListTab from 'components/ProductListTab';
import UserSavingGoalSection from 'components/UserSavingGoalSection';
import { filterSavingsProducts } from 'domain/savingsFilter';
import { useSavingsProducts } from 'hook/useSavingsProducts';
import { useMemo, useState } from 'react';
import { useUserSavingGoalStore } from 'store/useUserSavingGoalStore';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<'productList' | 'calculationResult'>('productList');
  const { data, isLoading, isError } = useSavingsProducts();
  const { userSavingGoal } = useUserSavingGoalStore();

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    if (!userSavingGoal.monthlyAmount || !userSavingGoal.term) return data;
    return filterSavingsProducts(data, userSavingGoal.monthlyAmount, userSavingGoal.term);
  }, [data, userSavingGoal.monthlyAmount, userSavingGoal.term]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <UserSavingGoalSection />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'productList' | 'calculationResult')}>
        <Tab.Item value="productList" selected={selectedTab === 'productList'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculationResult" selected={selectedTab === 'calculationResult'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'productList' ? (
        <ProductListTab filteredProducts={filteredProducts} isLoading={isLoading} isError={isError} />
      ) : (
        <CalculationResultTab filteredProducts={filteredProducts} />
      )}
    </>
  );
}
