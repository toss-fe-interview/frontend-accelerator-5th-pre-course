import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { SavingsProduct } from './types/types';
import { useEffect, useState } from 'react';

import { formatCurrency } from './lib/formatCurrency';
import { extractNumbers } from './lib/extractNumbers';
import { SavingsProductItem } from './components/SavingsProductItem';
import { SavingsCalculationSummary } from './components/SavingsCalculationSummary';
import {
  calculateDifference,
  calculateExpectedAmount,
  calculateRecommendedMonthlyAmount,
} from './util/savingsCalculations';
import { getSavingsProducts } from './api/getSavingsProducts';

type SavingsInput = {
  targetAmount: string;
  monthlyAmount: string;
  savingsTerm: number;
};

export function SavingsCalculatorPage() {
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });
  const [savingsProductTab, setSavingsProductTab] = useState<'products' | 'results'>('products');
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  // const { filteredSavingsProducts, recommendedSavingsProducts } = useSavingsProducts({ savingsInput });
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      const response = await getSavingsProducts();

      if (response) {
        setSavingsProducts(response);
      }
    };

    fetchSavingsProducts();
  }, []);

  //   - 월 납입액
  //   - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
  //   - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
  // - 저축 기간
  //   - `product.availableTerms` (저축 기간)와 동일해야 함
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

  // 사용자가 입력한 조건에 맞는 적금 상품 중 연 이자율이 가장 높은 2개의 상품을 출력해주세요.
  const getTopProductsByRate = (products: SavingsProduct[], count = 2) => {
    return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
  };

  const recommendedSavingsProducts = getTopProductsByRate(filteredSavingsProducts, 2);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={savingsInput.targetAmount && formatCurrency(Number(savingsInput.targetAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, targetAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={savingsInput.monthlyAmount && formatCurrency(Number(savingsInput.monthlyAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, monthlyAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsInput.savingsTerm}
        onChange={value => setSavingsInput({ ...savingsInput, savingsTerm: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

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
}
