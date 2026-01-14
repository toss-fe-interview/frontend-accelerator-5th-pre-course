import { useSuspenseQuery } from '@tanstack/react-query';
import MatchCase from 'common/components/MatchCase';
import { savingsProductsQueryOptions } from 'product/queries';
import { SavingProduct } from 'product/type/internal';
import { getFilteredProducts } from 'product/utils/getFilteredProducts';
import { useState } from 'react';
import { ListRow, Tab } from 'tosslib';
import SavingProducts from './SavingProducts';
import SavingResults from './SavingResults';

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
    select: data => getFilteredProducts(data, monthlyPayment, term),
  });

  const selectProduct = (product: SavingProduct) => {
    setSelectedProduct(product);
  };

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
                type="select"
                data={savingsProductsData}
                selectedProduct={selectedProduct}
                selectProduct={selectProduct}
              />
            );
          },
          results: () => {
            if (!selectedProduct) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
            }

            return (
              <SavingResults
                selectedProduct={selectedProduct}
                price={price}
                monthlyPayment={monthlyPayment}
                term={term}
              />
            );
          },
        }}
      />
    </>
  );
};

export default ResultSection;
