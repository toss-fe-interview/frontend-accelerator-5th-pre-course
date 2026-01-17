import { Border, ListHeader, ListRow, Spacing, Tab } from 'tosslib';
import { SavingsProductItem } from './SavingsProductItem';
import { SavingsCalculationSummary } from './SavingsCalculationSummary';
import {
  calculateDifference,
  calculateExpectedAmount,
  calculateRecommendedMonthlyAmount,
} from '../utils/savingsCalculations';
import { useState } from 'react';
import { SavingsProduct } from '../types/types';
import { useSavingsProducts } from '../hooks/useSavingsProducts';

type SavingsInput = {
  targetAmount: string;
  monthlyAmount: string;
  savingsTerm: number;
};

export const SavingsResultTabs = ({ savingsInput }: { savingsInput: SavingsInput }) => {
  const [savingsProductTab, setSavingsProductTab] = useState<'products' | 'results'>('products');
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const { data: savingsProducts = [] } = useSavingsProducts();

  const isProductMatchingInput = (product: SavingsProduct, savingsInput: SavingsInput) => {
    const hasMonthlyAmountInput = savingsInput.monthlyAmount.trim() !== '';
    const isMonthlyAmountValid = hasMonthlyAmountInput
      ? Number(savingsInput.monthlyAmount) >= product.minMonthlyAmount &&
        Number(savingsInput.monthlyAmount) <= product.maxMonthlyAmount
      : true;
    const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
    return isMonthlyAmountValid && isTermMatched;
  };

  const filteredSavingsProducts = savingsProducts.filter(product => {
    return isProductMatchingInput(product, savingsInput);
  });

  const getTopProductsByRate = (products: SavingsProduct[], count = 2) => {
    return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
  };

  const recommendedSavingsProducts = getTopProductsByRate(filteredSavingsProducts, 2);

  return (
    <>
      <Tab onChange={value => setSavingsProductTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={savingsProductTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={savingsProductTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProductTab === 'products' && (
        <>
          {filteredSavingsProducts.map(product => {
            const isSelected = selectedSavingsProduct?.id === product.id;
            return (
              <SavingsProductItem
                key={product.id}
                product={product}
                onClick={() => {
                  if (isSelected) {
                    setSelectedSavingsProduct(null);
                  } else {
                    setSelectedSavingsProduct(product);
                  }
                }}
                isSelected={isSelected}
              />
            );
          })}
        </>
      )}

      {savingsProductTab === 'results' && (
        <>
          <Spacing size={8} />
          {selectedSavingsProduct ? (
            <>
              <SavingsCalculationSummary
                label="예상 수익 금액"
                amount={calculateExpectedAmount({
                  월납입액: savingsInput.monthlyAmount,
                  저축기간: savingsInput.savingsTerm,
                  연이자율: selectedSavingsProduct.annualRate,
                })}
              />
              <SavingsCalculationSummary
                label="목표 금액과의 차이"
                amount={calculateDifference({
                  목표금액: savingsInput.targetAmount,
                  월납입액: savingsInput.monthlyAmount,
                  저축기간: savingsInput.savingsTerm,
                  연이자율: selectedSavingsProduct.annualRate,
                })}
              />
              <SavingsCalculationSummary
                label="추천 월 납입 금액"
                amount={calculateRecommendedMonthlyAmount({
                  목표금액: savingsInput.targetAmount,
                  저축기간: savingsInput.savingsTerm,
                  연이자율: selectedSavingsProduct.annualRate,
                })}
              />
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {/* SavingProductList 랑 UI가 같은데 컴포넌트로 분리했다면? */}
          {recommendedSavingsProducts.length > 0 ? (
            recommendedSavingsProducts.map(product => {
              const isSelected = selectedSavingsProduct?.id === product.id;
              return (
                <SavingsProductItem
                  key={product.id}
                  product={product}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedSavingsProduct(null);
                    } else {
                      setSelectedSavingsProduct(product);
                    }
                  }}
                  isSelected={isSelected}
                />
              );
            })
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품이 없습니다." />} />
          )}
          <Spacing size={40} />
        </>
      )}
    </>
  );
};
