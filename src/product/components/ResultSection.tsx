import { useSuspenseQuery } from '@tanstack/react-query';
import MatchCase from 'common/components/MatchCase';
import { savingsProductsQueryOptions } from 'product/queries';
import { SavingProduct } from 'product/type/internal';
import { Suspense, useState } from 'react';
import { ListRow, Tab } from 'tosslib';
import SavingProducts from './SavingProducts';
import SavingResults from './SavingResults';
import RecommendedProducts from './RecommendedProducts';
import { get예상수익금액, get목표금액과의차이, get추천월납입금액 } from 'product/utils/getResults';
import ErrorBoundary from 'common/components/ErrorBoundary';
import { productFilter } from 'product/utils/getFilteredProducts';

interface Props {
  price: string;
  monthlyPayment: string;
  term: number | null;
}
const ResultSection = ({ price, monthlyPayment, term }: Props) => {
  const [tab, setTab] = useState<'products' | 'results'>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);

  const { data: savingsProductsData } = useSuspenseQuery({
    ...savingsProductsQueryOptions,
    select: data => data.filter(product => productFilter({ product, monthlyPayment, term })),
  });

  return (
    <>
      <Tab onChange={value => setTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <MatchCase
        matcher={tab}
        cases={{
          products: () => {
            if (savingsProductsData.length === 0) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 없습니다." />} />;
            }

            return (
              <SavingProducts
                data={savingsProductsData}
                selectedProduct={selectedProduct}
                selectProduct={product => setSelectedProduct(product)}
              />
            );
          },
          results: () => {
            if (!selectedProduct) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
            }

            return (
              <>
                <SavingResults
                  results={{
                    예상수익금액: get예상수익금액(monthlyPayment, term, selectedProduct.annualRate),
                    목표금액과의차이: get목표금액과의차이(
                      price,
                      get예상수익금액(monthlyPayment, term, selectedProduct.annualRate)
                    ),
                    추천월납입금액: get추천월납입금액(price, term, selectedProduct.annualRate),
                  }}
                />
                <ErrorBoundary>
                  <Suspense>
                    <RecommendedProducts
                      monthlyPayment={monthlyPayment}
                      term={term}
                      selectedProduct={selectedProduct}
                    />
                  </Suspense>
                </ErrorBoundary>
              </>
            );
          },
        }}
      />
    </>
  );
};

export default ResultSection;
