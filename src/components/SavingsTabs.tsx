import { useState } from 'react';
import { Tab } from 'tosslib';
import { SavingsFilterForm } from 'hooks/useSavingsFilterForm';
import { CalculationResult } from './CalculationResult';
import { SavingsProduct } from 'apis/type';
import { useFetch } from 'hooks/useFetch';
import { savingsApis } from 'apis';
import { ProductListItem } from './ProductListItem';
import { calcSavingResult } from 'utils/calcSavingsResult';

type SavingsTabsProps = {
  savingsFilterForm: SavingsFilterForm;
};

export const SavingsTabs = (props: SavingsTabsProps) => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <>
      <Tab onChange={setActiveTab}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <Contents activeTab={activeTab} {...props} />
    </>
  );
};

const Contents = ({ activeTab, savingsFilterForm }: SavingsTabsProps & { activeTab: string }) => {
  const { data: savingsProducts = [] } = useFetch(savingsApis.getSavingsProducts);
  const [selectedProduct, setSelectedProductId] = useState<SavingsProduct>();

  const handleClickProduct = (sp: SavingsProduct) => {
    setSelectedProductId(sp);
  };

  const { monthlySaving, savingPeriod } = savingsFilterForm ?? {};

  const filterProduct = (savingsProduct: SavingsProduct) => {
    const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
    // 월 납입액 조건
    const monthlyMatchs =
      monthlySaving === '' || (Number(monthlySaving) >= minMonthlyAmount && Number(monthlySaving) <= maxMonthlyAmount);
    // 저축 기간 조건
    const termMathcs = availableTerms === savingPeriod;

    return monthlyMatchs && termMathcs;
  };

  const filteredProduct = savingsProducts.filter(filterProduct);

  return (
    <>
      {activeTab === 'products' &&
        filteredProduct.map(sp => (
          <ProductListItem
            key={sp.id}
            savingsProduct={sp}
            onClick={handleClickProduct}
            selected={sp.id === selectedProduct?.id}
          />
        ))}
      {activeTab === 'results' && (
        <CalculationResult
          result={calcSavingResult({
            savingsFilterForm,
            selectedProduct,
          })}
          recommendedProducts={[...filteredProduct].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2)}
          selectedProduct={selectedProduct}
          onClickProduct={handleClickProduct}
        />
      )}
    </>
  );
};
