import AmountInput from 'components/AmountInput';
import { useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { SavingsProduct, Term } from 'savingsCalculator/types';

import TermSelect from 'savingsCalculator/TermSelect';
import SavingsProductList from 'savingsCalculator/SavingsProductList';
import CalculationResult from 'savingsCalculator/CalculationResult';
import RecommendedSavingsProductList from 'savingsCalculator/RecommendedSavingsProductList';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<Term>(12);

  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  const hasSelectedSavingsProduct = selectedSavingsProduct !== null;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyPayment}
        onChange={setMonthlyPayment}
      />
      <Spacing size={16} />
      <TermSelect label="저축 기간" prompt="저축 기간을 선택해주세요" value={term} onChange={setTerm} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <SavingsProductList
          filter={{ monthlyPayment, term }}
          renderListItem={product => (
            <SavingsProductList.Item
              savingsProduct={product}
              isSelected={selectedSavingsProduct?.id === product.id}
              onSelect={setSelectedSavingsProduct}
            />
          )}
        />
      )}

      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />
          {hasSelectedSavingsProduct ? (
            <>
              <CalculationResult
                title="예상 수익 금액"
                result={`${예상_수입_금액_계산하기(monthlyPayment, term, selectedSavingsProduct.annualRate).toLocaleString('ko-KR')}원`}
              />
              <CalculationResult
                title="목표 금액과의 차이"
                result={`${목표_금액과의_차이_계산하기(targetAmount, 예상_수입_금액_계산하기(monthlyPayment, term, selectedSavingsProduct.annualRate)).toLocaleString('ko-KR')}원`}
              />
              <CalculationResult
                title="추천 월 납입 금액"
                result={`${추천_월_납입_금액_계산하기(targetAmount, term, selectedSavingsProduct.annualRate).toLocaleString('ko-KR')}원`}
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

          <RecommendedSavingsProductList
            filter={{ monthlyPayment, term }}
            renderListItem={product => (
              <RecommendedSavingsProductList.Item
                savingsProduct={product}
                isSelected={selectedSavingsProduct?.id === product.id}
              />
            )}
          />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}

const 예상_수입_금액_계산하기 = (monthlyPayment: number, term: number, annualRate: number) => {
  return monthlyPayment * term * (1 + annualRate * 0.5);
};

const 목표_금액과의_차이_계산하기 = (targetAmount: number, expectedIncome: number) => {
  return targetAmount - expectedIncome;
};

const 추천_월_납입_금액_계산하기 = (targetAmount: number, term: number, annualRate: number) => {
  return Math.round(targetAmount / term / (1 + annualRate * 0.5));
};
