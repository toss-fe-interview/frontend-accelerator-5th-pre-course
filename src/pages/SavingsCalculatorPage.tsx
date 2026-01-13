import { useState } from 'react';
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
import { useSavingsProducts } from 'hooks/queries';
import { useCalculationResult } from 'hooks/useCalculationResult';

const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

const formatNumber = (num: number) => num.toLocaleString('ko-KR');

export function SavingsCalculatorPage() {
  const { products } = useSavingsProducts();
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [term, setTerm] = useState<number>(12);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);

  const depositAmount = Number(monthlyDeposit.replace(/,/g, '')) || 0;
  const filteredProducts = products.filter(product => {
    const termMatch = product.availableTerms === term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });

  const selectedProduct = products.find(product => product.id === selectedProductId) ?? null;

  const recommendedProducts = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const calculationResult = useCalculationResult({
    selectedProduct,
    monthlyDeposit,
    targetAmount,
    term,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyDeposit}
        onChange={e => setMonthlyDeposit(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={term} onChange={setTerm}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setActiveTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.PRODUCTS} selected={activeTab === TAB_VALUES.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.RESULTS} selected={activeTab === TAB_VALUES.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === TAB_VALUES.PRODUCTS &&
        filteredProducts.map(product => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            onClick={() => setSelectedProductId(product.id)}
            right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          />
        ))}

      {activeTab === TAB_VALUES.RESULTS && (
        <>
          {selectedProduct && calculationResult ? (
            <>
              <Spacing size={8} />
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${formatNumber(Math.round(calculationResult.expectedReturn))}원`}
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
                    bottom={`${formatNumber(Math.round(calculationResult.difference))}원`}
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
                    bottom={`${formatNumber(calculationResult.recommendedDeposit)}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
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
                  bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              onClick={() => setSelectedProductId(product.id)}
              right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
            />
          ))}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
