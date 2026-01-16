import { ChangeEvent, useMemo, useState } from 'react';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { useSavingsProducts } from 'shared/hooks';

// ============================================
// 상수 정의
// ============================================
const SIMPLE_INTEREST_COEFFICIENT = 0.5;
const ROUNDING_UNIT = 1000;
const RECOMMENDED_PRODUCTS_COUNT = 2;

export interface SavingsFormState {
  goalAmount: number | null;
  monthlyAmount: number | null;
  term: number;
}

const DEFAULT_SAVINGS_FORM_STATE: SavingsFormState = {
  goalAmount: null,
  monthlyAmount: null,
  term: 12,
};

const TAB_VALUES = {
  SAVINGS_PRODUCTS: 'savingsProducts',
  CALCULATED_RESULT: 'calculatedResult',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const { data: products = [] } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsFormState>(DEFAULT_SAVINGS_FORM_STATE);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>(TAB_VALUES.SAVINGS_PRODUCTS);

  // ============================================
  // 숫자 포맷팅 함수 #1 (SavingsForm용)
  // ============================================
  const formatNumberForForm = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // ============================================
  // 목표 금액 핸들러
  // ============================================
  const handleGoalAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/,/g, '').replace(/[^0-9]/g, '');

    if (numericString === '') {
      setFormState(prev => ({ ...prev, goalAmount: null }));
      return;
    }

    const numericValue = parseInt(numericString, 10);
    setFormState(prev => ({ ...prev, goalAmount: numericValue }));
  };

  // ============================================
  // 월 납입액 핸들러
  // ============================================
  const handleMonthlyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/,/g, '').replace(/[^0-9]/g, '');

    if (numericString === '') {
      setFormState(prev => ({ ...prev, monthlyAmount: null }));
      return;
    }

    const numericValue = parseInt(numericString, 10);
    setFormState(prev => ({ ...prev, monthlyAmount: numericValue }));
  };

  // ============================================
  // 저축 기간 핸들러
  // ============================================
  const handleTermChange = (value: number) => {
    setFormState(prev => ({ ...prev, term: value }));
  };

  // ============================================
  // 상품 선택 핸들러
  // ============================================
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  // ============================================
  // 필터링된 상품 목록 계산
  // ============================================
  const filteredProducts = useMemo(() => {
    const { monthlyAmount, term } = formState;

    if (monthlyAmount === null) {
      return products;
    }

    return products.filter(
      product =>
        product.minMonthlyAmount < monthlyAmount &&
        monthlyAmount < product.maxMonthlyAmount &&
        product.availableTerms === term
    );
  }, [products, formState]);

  // ============================================
  // 선택된 상품
  // ============================================
  const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

  // ============================================
  // 추천 상품 목록
  // ============================================
  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, RECOMMENDED_PRODUCTS_COUNT);
  }, [filteredProducts]);

  // ============================================
  // 계산 결과
  // ============================================
  const { goalAmount, monthlyAmount, term } = formState;

  const calculationResult = useMemo(() => {
    if (selectedProduct === null) {
      return null;
    }

    const actualMonthlyAmount = monthlyAmount ?? 0;
    const annualRate = selectedProduct.annualRate / 100;
    const interestMultiplier = 1 + annualRate * SIMPLE_INTEREST_COEFFICIENT;

    const expectedProfit = actualMonthlyAmount * term * interestMultiplier;
    const goalDifference = goalAmount !== null ? goalAmount - expectedProfit : null;
    const recommendedMonthlyAmount =
      goalAmount !== null ? Math.round(goalAmount / (term * interestMultiplier) / ROUNDING_UNIT) * ROUNDING_UNIT : null;

    return { expectedProfit, goalDifference, recommendedMonthlyAmount };
  }, [selectedProduct, monthlyAmount, term, goalAmount]);

  // ============================================
  // 숫자 포맷팅 함수 #2 (ProductList용)
  // ============================================
  const formatNumberForProductList = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // ============================================
  // 숫자 포맷팅 함수 #3 (CalculationResult용)
  // ============================================
  const formatNumberForCalculation = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // ============================================
  // 표시할 값 계산
  // ============================================
  const goalAmountDisplay = formState.goalAmount !== null ? formatNumberForForm(formState.goalAmount) : '';
  const monthlyAmountDisplay = formState.monthlyAmount !== null ? formatNumberForForm(formState.monthlyAmount) : '';

  // ============================================
  // 렌더링
  // ============================================
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* ============================================ */}
      {/* SavingsForm 영역 (인라인) */}
      {/* ============================================ */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmountDisplay}
        onChange={handleGoalAmountChange}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmountDisplay}
        onChange={handleMonthlyAmountChange}
      />

      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={handleTermChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* ============================================ */}
      {/* Tab 영역 */}
      {/* ============================================ */}
      <Tab onChange={value => setSelectedTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.SAVINGS_PRODUCTS} selected={selectedTab === TAB_VALUES.SAVINGS_PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.CALCULATED_RESULT} selected={selectedTab === TAB_VALUES.CALCULATED_RESULT}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* ============================================ */}
      {/* SavingsProductList 영역 (인라인) */}
      {/* ============================================ */}
      {selectedTab === TAB_VALUES.SAVINGS_PRODUCTS &&
        filteredProducts.map(product => {
          const isSelected = selectedProductId === product.id;

          return (
            <ListRow
              key={product.id}
              contents={
                <ListRow.Texts
                  type="3RowTypeA"
                  top={product.name}
                  topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                  middle={`연 이자율: ${product.annualRate}%`}
                  middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                  bottom={`${formatNumberForProductList(product.minMonthlyAmount)}원 ~ ${formatNumberForProductList(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              onClick={() => handleSelectProduct(product.id)}
              right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
            />
          );
        })}

      {/* ============================================ */}
      {/* CalculationResult 영역 (인라인) */}
      {/* ============================================ */}
      {selectedTab === TAB_VALUES.CALCULATED_RESULT && (
        <>
          {selectedProduct === null || calculationResult === null ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <Spacing size={8} />

              {/* 예상 수익 금액 */}
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${formatNumberForCalculation(calculationResult.expectedProfit ?? 0)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              {/* 목표 금액과의 차이 */}
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="목표 금액과의 차이"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${formatNumberForCalculation(calculationResult.goalDifference ?? 0)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              {/* 추천 월 납입 금액 */}
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="추천 월 납입 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${formatNumberForCalculation(calculationResult.recommendedMonthlyAmount ?? 0)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {/* 추천 상품 목록 */}
              {recommendedProducts.map(product => {
                const isSelected = selectedProductId === product.id;

                return (
                  <ListRow
                    key={product.id}
                    contents={
                      <ListRow.Texts
                        type="3RowTypeA"
                        top={product.name}
                        topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                        middle={`연 이자율: ${product.annualRate}%`}
                        middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                        bottom={`${formatNumberForCalculation(product.minMonthlyAmount)}원 ~ ${formatNumberForCalculation(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                        bottomProps={{ fontSize: 13, color: colors.grey600 }}
                      />
                    }
                    right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  />
                );
              })}

              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
