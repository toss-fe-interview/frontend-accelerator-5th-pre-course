import { type SavingsProduct } from 'api/savings-products';
import { CalculationResult } from 'components/CalculationResult';
import { MoneyInputField } from 'components/controls/MoneyInputField';
import { TermSelectBottomSheet } from 'components/controls/TermSelectBottomSheet';
import GetProductRecommendation from 'components/GetProductRecommendation';
import GetSavingsProductList from 'components/GetSavingsProductList';
import { MessageText } from 'components/MessageText';
import { SavingsProductItem } from 'components/SavingsProductItem';
import { useTab } from 'hooks/useTab';
import { Suspense, useMemo, useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';

const TAB = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;
type TabType = (typeof TAB)[keyof typeof TAB];

export function SavingsCalculatorPage() {
  // 인풋 칸
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(12);
  // 사용자 입력값
  const userInputs = useMemo(() => ({ monthlyAmount, term, targetAmount }), [monthlyAmount, term, targetAmount]);

  // 선택한 적금 상품
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  // 탭
  const { currentTab, handleTabChange } = useTab<TabType[]>([TAB.PRODUCTS, TAB.RESULTS]);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* 인풋 칸 */}
      <MoneyInputField label="목표 금액" value={targetAmount} onValueChange={setTargetAmount} />
      <Spacing size={16} />
      <MoneyInputField label="월 납입액" value={monthlyAmount} onValueChange={setMonthlyAmount} />
      <Spacing size={16} />
      <TermSelectBottomSheet label="저축 기간" value={term} onValueChange={setTerm} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 탭 */}
      <Tab onChange={handleTabChange}>
        <Tab.Item value={TAB.PRODUCTS} selected={currentTab === TAB.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB.RESULTS} selected={currentTab === TAB.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 */}
      {currentTab === TAB.PRODUCTS && (
        <Suspense fallback={<MessageText message="적금 상품을 불러오는 중입니다." />}>
          <GetSavingsProductList {...userInputs}>
            {savingsProducts => {
              const isSavingsProductsEmpty = savingsProducts.length === 0;

              if (isSavingsProductsEmpty) {
                return <MessageText message="적금 상품이 없습니다." />;
              }

              return (
                <>
                  {savingsProducts.map(product => {
                    const isSavingsProductSelected = selectedSavingsProduct?.id === product.id;

                    return (
                      <SavingsProductItem
                        key={product.id}
                        product={product}
                        onClick={() =>
                          isSavingsProductSelected
                            ? setSelectedSavingsProduct(null)
                            : setSelectedSavingsProduct(product)
                        }
                        isSelected={isSavingsProductSelected}
                      />
                    );
                  })}
                </>
              );
            }}
          </GetSavingsProductList>
        </Suspense>
      )}

      {/* 계산 결과 */}
      {currentTab === TAB.RESULTS && (
        <>
          <Spacing size={8} />
          <CalculationResult.ExpectedProfit
            {...userInputs}
            label="예상 수익 금액"
            selectedSavingsProduct={selectedSavingsProduct}
          />
          <CalculationResult.TargetDifference
            {...userInputs}
            label="목표 금액과의 차이"
            selectedSavingsProduct={selectedSavingsProduct}
          />
          <CalculationResult.RecommendedMonthlyAmount
            {...userInputs}
            label="추천 월 납입 금액"
            selectedSavingsProduct={selectedSavingsProduct}
          />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {/* 추천 상품 목록 */}
          <GetProductRecommendation {...userInputs}>
            {recommendedSavingsProducts => {
              const isRecommendedSavingsProductsEmpty = recommendedSavingsProducts.length === 0;

              if (isRecommendedSavingsProductsEmpty) {
                return <MessageText message="추천 상품이 없습니다." />;
              }

              return (
                <>
                  {recommendedSavingsProducts.map(product => (
                    <SavingsProductItem key={product.id} product={product} isSelected={false} />
                  ))}
                </>
              );
            }}
          </GetProductRecommendation>
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
