import { useState } from 'react';
import { Assets, Border, ListHeader, ListRow, Spacing, Tab, colors } from 'tosslib';
import { savingsProductsQuery } from '../qeuries/savings-products.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { formatCurrency } from 'utils/format';
import { SavingsProduct } from '../models/savings-products.dto';
import { match } from 'ts-pattern';

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

      {match(activeTab)
        .with('products', () => (
          <>
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
        ))
        .with('results', () => (
          <CalculationResult //
            targetAmount={targetAmount}
            monthlyPayment={monthlyPayment}
            term={term}
            selectedProduct={selectedProduct}
            products={filteredSavingsProducts}
          />
        ))
        .exhaustive()}
    </>
  );
}

interface CalculationResultProps {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: 6 | 12 | 24;
  selectedProduct: SavingsProduct | null;
  products: SavingsProduct[];
}

function CalculationResult({ targetAmount, monthlyPayment, term, selectedProduct, products }: CalculationResultProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  if (!targetAmount || !monthlyPayment || !term) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="모든 필수 값을 입력해주세요." />} />;
  }

  const annualRate = selectedProduct.annualRate;
  const rateMultiplier = 1 + (annualRate / 100) * 0.5;

  // 예상 수익 금액
  const expectedAmount = monthlyPayment * term * rateMultiplier;

  const difference = targetAmount - expectedAmount;

  // 추천 월 납입 금액 (1,000원 단위 반올림)
  const recommendedMonthlyPayment = Math.round(targetAmount / (term * rateMultiplier) / 1000) * 1000;

  console.log('products', products);
  const recommendedProducts = products.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(Math.round(expectedAmount))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(Math.round(difference))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(recommendedMonthlyPayment)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map(product => (
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
          onClick={() => {}}
        />
      ))}

      {/* <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      /> */}

      <Spacing size={40} />
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
