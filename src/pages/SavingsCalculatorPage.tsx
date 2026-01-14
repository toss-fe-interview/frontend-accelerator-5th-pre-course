import { useState } from 'react';
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

import { SavingsProductListItem } from 'components/SavingsProductListItem';
import { useSavingsProducts } from 'hooks/queries/useSavingsProducts';
import { SavingsProduct } from 'types/SavingsProduct.type';
import { formatAmount } from 'utils/formatAmount';

type SavingsCalculatorFormState = {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
};

const filterSavingsProduct = (savingsProduct: SavingsProduct, formState: SavingsCalculatorFormState) => {
  return (
    savingsProduct.minMonthlyAmount <= formState.monthlyAmount &&
    savingsProduct.maxMonthlyAmount >= formState.monthlyAmount &&
    savingsProduct.availableTerms === formState.term
  );
};

const formatTextFieldValue = (amount: number) => {
  return amount > 0 ? formatAmount(amount) : '';
};

// TODO: annualRate가 %라서 100으로 나눠줘야 하나?
const calculateFinalAmount = (monthlyAmount: number, term: number, annualRate: number) => {
  return monthlyAmount * term * (1 + (annualRate / 100) * 0.5);
};

const calculateDifferenceAmount = (targetAmount: number, finalAmount: number) => {
  return targetAmount - finalAmount;
};

const calculateRecommendedMonthlyAmount = (targetAmount: number, term: number, annualRate: number) => {
  return Math.round(targetAmount / (term * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000;
};

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsCalculatorFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  const handleChangeTextField = (key: keyof SavingsCalculatorFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setFormState({ ...formState, [key]: 0 });
      return;
    }

    const digits = value.replace(/[^0-9]/g, '');
    const parsedValue = Number(digits);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      return;
    }
    setFormState({ ...formState, [key]: parsedValue });
  };

  const filteredSavingsProducts = savingsProducts.filter(savingsProduct =>
    filterSavingsProduct(savingsProduct, formState)
  );

  const recommendedSavingsProducts = [...filteredSavingsProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 계산기 form 영역 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.targetAmount)}
        onChange={handleChangeTextField('targetAmount')}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.monthlyAmount)}
        onChange={handleChangeTextField('monthlyAmount')}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={value => setFormState({ ...formState, term: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* Tab 버튼 영역 */}
      <Tab onChange={tab => setSelectedTab(tab as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 리스트 영역 */}
      {/* TODO: 적금 상품 리스트 Empty 컴포넌트 */}
      {selectedTab === 'products' && (
        <>
          {filteredSavingsProducts.map(savingsProduct => {
            const isSelected = selectedSavingsProduct?.id === savingsProduct.id;
            return (
              <SavingsProductListItem
                key={savingsProduct.id}
                savingsProduct={savingsProduct}
                isSelected={isSelected}
                setSelectedSavingsProduct={setSelectedSavingsProduct}
              />
            );
          })}
        </>
      )}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          <>
            {selectedSavingsProduct ? (
              <>
                <ListRow
                  contents={
                    <ListRow.Texts
                      type="2RowTypeA"
                      top="예상 수익 금액"
                      topProps={{ color: colors.grey600 }}
                      bottom={`${formatAmount(calculateFinalAmount(formState.monthlyAmount, formState.term, selectedSavingsProduct.annualRate))}원`}
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
                      bottom={`${formatAmount(calculateDifferenceAmount(formState.targetAmount, calculateFinalAmount(formState.monthlyAmount, formState.term, selectedSavingsProduct.annualRate)))}원`}
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
                      bottom={`${formatAmount(calculateRecommendedMonthlyAmount(formState.targetAmount, formState.term, selectedSavingsProduct.annualRate))}원`}
                      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                    />
                  }
                />
              </>
            ) : (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}
          </>

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedSavingsProducts.map(savingsProduct => {
            const isSelected = selectedSavingsProduct?.id === savingsProduct.id;
            return (
              <SavingsProductListItem
                key={savingsProduct.id}
                savingsProduct={savingsProduct}
                isSelected={isSelected}
                setSelectedSavingsProduct={setSelectedSavingsProduct}
              />
            );
          })}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
