import { useState } from 'react';
import { Assets, ListRow, Tab, colors } from 'tosslib';
import { savingsProductsQuery } from '../qeuries/savings-products.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { formatCurrency } from 'utils/format';
import { SavingsProduct } from '../models/savings-products.dto';

type Tab = 'products' | 'results';
function isTab(value: string): value is Tab {
  return value === 'products' || value === 'results';
}

interface Props {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: 6 | 12 | 24;
}

export function SavingsCalculatorContent({ targetAmount, monthlyPayment, term }: Props) {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery);

  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(prev => (prev?.id === product.id ? null : product));
  };

  const filteredSavingsProducts = filterSavingsProducts(savingsProducts, monthlyPayment, term);
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

      {filteredSavingsProducts.map(product => (
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
          right={selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => handleSelectProduct(product)}
        />
      ))}
    </>
  );
}

function filterSavingsProducts(savingsProducts: SavingsProduct[], monthlyPayment: number | null, term: number) {
  return savingsProducts.filter(product => {
    if (monthlyPayment) {
      if (monthlyPayment < product.minMonthlyAmount || product.maxMonthlyAmount < monthlyPayment) {
        return false;
      }
    }

    if (product.availableTerms !== term) {
      return false;
    }

    return true;
  });
}
