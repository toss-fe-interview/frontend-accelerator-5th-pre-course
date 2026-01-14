import { useState } from 'react';
import { Assets, ListRow, Tab, colors } from 'tosslib';
import { savingsProductsQuery } from '../qeuries/savings-products.query';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { formatCurrency } from 'utils/format';

type Tab = 'products' | 'results';
function isTab(value: string): value is Tab {
  return value === 'products' || value === 'results';
}

export function SavingsCalculatorContent() {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery);

  const [activeTab, setActiveTab] = useState<Tab>('products');

  console.log(savingsProducts);
  return (
    <>
      <Tab
        onChange={value => {
          if (isTab(value)) {
            setActiveTab(value);
          }
        }}
      >
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatCurrency(product.minMonthlyAmount)}원 ~ ${formatCurrency(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={<Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {}}
        />
      ))}
    </>
  );
}
