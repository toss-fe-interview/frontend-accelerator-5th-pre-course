import { Tab } from 'tosslib';
import { SavingsInput, SavingsProduct } from '../../types/types';
import { SavingsProductList } from './SavingsProductList';
import { SavingsCalculationResult } from './SavingsCalculationResult';

export function SavingsProductTabView({
  savingsProducts,
  selectedSavingsProduct,
  handleSelectSavingsProduct,
  savingsProductTab,
  handleSelectSavingsProductTab,
  savingsInput,
  recommendedProducts,
}: {
  savingsProducts: SavingsProduct[];
  selectedSavingsProduct: SavingsProduct | null;
  handleSelectSavingsProduct: (product: SavingsProduct) => void;
  savingsProductTab: 'products' | 'results';
  handleSelectSavingsProductTab: (tab: 'products' | 'results') => void;
  savingsInput: SavingsInput;
  recommendedProducts: SavingsProduct[];
}) {
  return (
    <>
      <Tab onChange={value => handleSelectSavingsProductTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={savingsProductTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={savingsProductTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProductTab === 'products' && (
        <SavingsProductList
          savingsProducts={savingsProducts}
          selectedSavingsProduct={selectedSavingsProduct}
          handleSelectSavingsProduct={handleSelectSavingsProduct}
        />
      )}

      {savingsProductTab === 'results' && (
        <SavingsCalculationResult
          selectedSavingsProduct={selectedSavingsProduct}
          savingsInput={savingsInput}
          recommendedProducts={recommendedProducts}
        />
      )}
    </>
  );
}
