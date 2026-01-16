import { ProductListItem } from 'components/ProductListItem';
import { useSavingsProducts } from 'hook/useSavingsProducts';
import { useMemo, useState } from 'react';
import {
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

type CalculationResult = {
  expectedProfit: number;
  targetAmountDifference: number;
  recommendedMonthlyAmount: number;
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
  const {
    data: savingsProductListData,
    isLoading: isLoadingSavingsProductList,
    isError: isErrorSavingsProductList,
  } = useSavingsProducts();

  // 가공해야하는 데이터
  // 1. 적금 상품 목록을 필터링한 데이터
  const filteredProducts = useMemo(() => {
    if (!savingsProductListData) return [];
    if (!userSavingGoal) return savingsProductListData;
    return savingsProductListData
      .filter(
        product =>
          product.minMonthlyAmount >= userSavingGoal.monthlyAmount &&
          product.maxMonthlyAmount <= userSavingGoal.monthlyAmount &&
          product.availableTerms === userSavingGoal.savingTerm
      )
      .sort((a, b) => b.annualRate - a.annualRate);
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
  const top2RecommendedSavingsProducts = useMemo(() => {
    if (!filteredProducts) return [];
    return filteredProducts.slice(0, 2);
  }, [filteredProducts]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 사용자가 목표로 하는 저축 금액과 월 납입액, 저축 기간을 입력받는 영역 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        onChange={e =>
          setUserSavingGoal({ ...userSavingGoal, targetAmount: Number(e.target.value) || 0 } as UserSavingGoal)
        }
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={e =>
          setUserSavingGoal({ ...userSavingGoal, monthlyAmount: Number(e.target.value) || 0 } as UserSavingGoal)
        }
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={userSavingGoal?.savingTerm || 12}
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

      {/* 선택된 탭이 상품 목록일때
      1. 적금 상품 목록 출력
      2. 조건에 맞는 적금 상품 필터링
      3. 상품 클릭하여 선택 가능
      */}
      {selectedTab === 'productList' ? (
        <>
          {filteredProducts.map(product => {
            const isSelected = selectedSavingsProduct?.id === product.id;

            return (
              <ProductListItem
                key={product.id}
                product={product}
                isSelected={isSelected}
                onClick={() => {
                  if (isSelected) {
                    setSelectedSavingsProduct(null);
                  } else {
                    setSelectedSavingsProduct(product);
                  }
                }}
              />
            );
          })}
        </>
      ) : (
        // 선택된 탭이 계산 결과일때
        // 1. 계산 결과 출력
        // 2. 필터링 된 상품 중 연이자율 상위 2개 상품 출력
        <>
          <Spacing size={8} />

          {selectedSavingsProduct ? (
            <>
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${calculationResult?.expectedProfit.toLocaleString()}원`}
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
                    bottom={`${calculationResult?.targetAmountDifference.toLocaleString()}원`}
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
                    bottom={`${calculationResult?.recommendedMonthlyAmount.toLocaleString()}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
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

          {top2RecommendedSavingsProducts.map(product => (
            <ProductListItem
              key={product.id}
              product={product}
              isSelected={selectedSavingsProduct?.id === product.id}
              onClick={() => setSelectedSavingsProduct(product)}
            />
          ))}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
