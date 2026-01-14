import { useState } from 'react';
import { SavingsProduct } from 'shared/api/type';
import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useGetSavingProducts } from '../hooks/useGetSavingProducts';
import { useSavingForm } from '../hooks/useSavingForm';
import { getFilterSavingProducts, getRecommendSavingProducts, toNumeric } from '../utils';
import { Products } from './Products';
import { SavingsProducts } from './Products/SavingsProducts';
import { Results } from './Results';
import { CalculationResults } from './Results/CalculationResults';
import { RecommendSavingProducts } from './Results/RecommendSavingProducts';
import { SavingGoals } from './SavingGoals';

export function SavingsCalculatorPage() {
  const { savingProducts } = useGetSavingProducts();
  const { values, handlers } = useSavingForm();

  const [selectedAmount, setSelectedAmount] = useState<SavingsProduct | null>(null);

  const [selectedTab, setSelectedTab] = useState('products');

  const showFilterProducts = Boolean(values.목표금액.length);

  const filteredSavingProducts = getFilterSavingProducts(savingProducts, {
    monthlyDeposit: toNumeric(values.월납입액),
    savingPeriod: values.저축기간,
  });

  const displayedSavingProducts = showFilterProducts ? filteredSavingProducts : savingProducts;

  const recommendSavingProducts = getRecommendSavingProducts(displayedSavingProducts, 2);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingGoals values={values} handlers={handlers} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={setSelectedTab}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <Products data={filteredSavingProducts}>
          <SavingsProducts
            data={filteredSavingProducts}
            right={product =>
              selectedAmount?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
            }
            onClick={setSelectedAmount}
          />
        </Products>
      )}

      {selectedTab === 'results' && (
        <>
          <Results
            data={selectedAmount}
            fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />}
          >
            {selectedAmount && (
              <>
                <CalculationResults
                  monthlyDeposit={toNumeric(values.월납입액)}
                  savingPeriod={values.저축기간}
                  annualRate={selectedAmount.annualRate}
                  targetAmount={toNumeric(values.목표금액)}
                />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />

                <Spacing size={12} />

                <RecommendSavingProducts
                  data={recommendSavingProducts}
                  right={product =>
                    selectedAmount?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
                  }
                  onClick={setSelectedAmount}
                />
              </>
            )}
          </Results>
        </>
      )}
    </>
  );
}
