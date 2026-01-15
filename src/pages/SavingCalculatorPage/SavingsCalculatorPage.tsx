import { useQuery } from '@tanstack/react-query';
import { isSuitableSavingProduct, SavingProduct } from 'models/SavingProduct';
import { useState } from 'react';
import { Border, http, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { priceFormatterToString, priceParserToNumber } from 'utils/priceFormatter';
import { SavingProductList } from './components/SavingProductList';
import { CalculationResult } from './components/CalculationResult';

type TabType = 'products' | 'results';
export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(50000);
  const [term, setTerm] = useState<number>(12);

  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingProduct | null>(null);

  const [selectedTab, setSelectedTab] = useState<TabType>('products');

  const { data: savingsProducts = [] } = useQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingProduct[]>('/api/savings-products'),
    select: data => data.filter(product => isSuitableSavingProduct(product, monthlyPayment, term)),
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={priceFormatterToString(targetAmount)}
        onChange={e => setTargetAmount(priceParserToNumber(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={priceFormatterToString(monthlyPayment)}
        onChange={e => setMonthlyPayment(priceParserToNumber(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => setTerm(value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabType)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'products' && (
        <SavingProductList
          savingsProducts={savingsProducts}
          selectedSavingProduct={selectedSavingProduct}
          selectSavingProduct={product => setSelectedSavingProduct(product)}
        />
      )}

      {selectedTab === 'results' && (
        <div>
          <Spacing size={8} />

          {selectedSavingProduct ? (
            <CalculationResult
              selectedSavingProduct={selectedSavingProduct}
              targetAmount={targetAmount}
              monthlyPayment={monthlyPayment}
              term={term}
            />
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <SavingProductList
            savingsProducts={savingsProducts.slice(0, 2) ?? []}
            selectedSavingProduct={selectedSavingProduct}
            selectSavingProduct={product => setSelectedSavingProduct(product)}
          />

          <Spacing size={40} />
        </div>
      )}
    </>
  );
}
