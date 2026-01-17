import AmountInput from 'components/AmountInput';
import CalculationResultListRowTexts from 'components/CalculationResultListRowTexts';
import SavingsProductListRowTexts from 'components/SavingsProductListRowTexts';
import TabContent from 'components/TabContent';
import { useSavingsProducts } from 'hook/useSavingsProducts';
import { useMemo, useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';

type UserSavingGoal = {
  targetAmount: number;
  monthlyAmount: number;
  savingTerm: number;
} | null;

type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

type SelectedTabData = 'productList' | 'calculationResult';

export function BestMatchingSavingsFinderPage() {
  // 사용자 입력 데이터
  // 1. 사용자의 저축 목표 데이터 - UserSavingGoalData -> 내부 데이터
  const [userSavingGoal, setUserSavingGoal] = useState<UserSavingGoal>(null);
  // 2. 선택된 상품 - SelectedSavingsProductData -> 내부 데이터
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  // 3. 선택된 탭 - SelectedTabData -> 내부 데이터
  const [selectedTab, setSelectedTab] = useState<SelectedTabData>('productList');

  // 외부 데이터
  // 1. 적금 상품 목록 - SavingsProductListData -> 외부 데이터
  const { data: savingsProductListData } = useSavingsProducts();

  // 가공해야하는 데이터
  // 1. 적금 상품 목록을 필터링한 데이터
  const filteredProducts = useMemo(() => {
    if (!savingsProductListData) return [];
    if (!userSavingGoal) return savingsProductListData;

    const 월납입액범위내 = (product: SavingsProduct) => {
      if (!userSavingGoal.monthlyAmount) return true;
      return (
        userSavingGoal.monthlyAmount >= product.minMonthlyAmount &&
        userSavingGoal.monthlyAmount <= product.maxMonthlyAmount
      );
    };
    const 저축기간일치 = (product: SavingsProduct) => {
      if (!userSavingGoal.savingTerm) return true;
      return product.availableTerms === userSavingGoal.savingTerm;
    };

    return savingsProductListData.filter(product => 월납입액범위내(product) && 저축기간일치(product));
  }, [savingsProductListData, userSavingGoal]);

  // 2. 계산 결과 데이터 - CalculationResultData -> 내부 데이터 + 외부 데이터
  const calculationResult = useMemo(() => {
    if (!selectedSavingsProduct || !userSavingGoal) return null;
    return {
      expectedProfit:
        userSavingGoal.monthlyAmount *
        selectedSavingsProduct.availableTerms *
        (1 + selectedSavingsProduct.annualRate * 0.5),
      targetAmountDifference:
        userSavingGoal.targetAmount -
        userSavingGoal.monthlyAmount *
          selectedSavingsProduct.availableTerms *
          (1 + selectedSavingsProduct.annualRate * 0.5),
      recommendedMonthlyAmount:
        userSavingGoal.targetAmount / (userSavingGoal.savingTerm * (1 + selectedSavingsProduct.annualRate * 0.5)),
    };
  }, [selectedSavingsProduct, userSavingGoal]);

  // 3. 필터링 된 상품 중 연이자율 상위 2개 상품 출력 - Top2RecommendedSavingsProductsData -> 내부 데이터 + 외부 데이터
  const compareByAnnualRateDesc = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;

  const sortSavingsProductsByHighRate = (products: SavingsProduct[]) => products.toSorted(compareByAnnualRateDesc);

  const top2RecommendedSavingsProducts = sortSavingsProductsByHighRate(filteredProducts).slice(0, 2);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* 사용자가 목표로 하는 저축 금액과 월 납입액, 저축 기간을 입력받는 영역 */}
      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={userSavingGoal?.targetAmount || null}
        onChange={value => setUserSavingGoal({ ...userSavingGoal, targetAmount: value ?? 0 } as UserSavingGoal)}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={userSavingGoal?.monthlyAmount || null}
        onChange={value => setUserSavingGoal({ ...userSavingGoal, monthlyAmount: value ?? 0 } as UserSavingGoal)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={userSavingGoal?.savingTerm ?? null}
        onChange={value => setUserSavingGoal({ ...userSavingGoal, savingTerm: value } as UserSavingGoal)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 선택된 탭이 상품 목록인지 계산 결과인지 결정*/}
      <Tab onChange={value => setSelectedTab(value as 'productList' | 'calculationResult')}>
        <Tab.Item value="productList" selected={selectedTab === 'productList'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculationResult" selected={selectedTab === 'calculationResult'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <TabContent selectedTab={selectedTab}>
        {/* 적금 상품 목록 탭 */}
        <TabContent.Panel value="productList">
          {filteredProducts.map(product => {
            const isSelected = selectedSavingsProduct?.id === product.id;

            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingsProductListRowTexts
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => setSelectedSavingsProduct(isSelected ? null : product)}
              />
            );
          })}
        </TabContent.Panel>

        {/* 계산 결과 탭 */}
        <TabContent.Panel value="calculationResult">
          <Spacing size={8} />

          {selectedSavingsProduct ? (
            <>
              <ListRow
                contents={
                  <CalculationResultListRowTexts
                    label="예상 수익 금액"
                    value={calculationResult?.expectedProfit.toLocaleString() ?? '0'}
                  />
                }
              />
              <ListRow
                contents={
                  <CalculationResultListRowTexts
                    label="목표 금액과의 차이"
                    value={calculationResult?.targetAmountDifference.toLocaleString() ?? '0'}
                  />
                }
              />
              <ListRow
                contents={
                  <CalculationResultListRowTexts
                    label="추천 월 납입 금액"
                    value={calculationResult?.recommendedMonthlyAmount.toLocaleString() ?? '0'}
                  />
                }
              />
            </>
          ) : (
            <>상품을 선택해 주세요.</>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {top2RecommendedSavingsProducts.map(product => {
            const isSelected = selectedSavingsProduct?.id === product.id;
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
                    bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => setSelectedSavingsProduct(product)}
              />
            );
          })}

          <Spacing size={40} />
        </TabContent.Panel>
      </TabContent>
    </>
  );
}
