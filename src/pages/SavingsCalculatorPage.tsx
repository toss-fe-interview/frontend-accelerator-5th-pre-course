import CalculationResult from 'CalculationResult';
import { useState } from 'react';
import RecommendedProductList from 'RecommendedProductList';
import SavingsProductList from 'SavingsProductList';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import useSavingsProductFilters, { Term } from 'useSavingsProductFilters';
import useSelectedSavingsProduct from 'useSelectedSavingsProduct';

function parseKoKrLocaleStringToNumber(value: string): number {
  return Number(value.replace(/,/g, ''));
}

export function SavingsCalculatorPage() {
  const { targetAmount, monthlyPayment, term, handleTargetAmountChange, handleMonthlyPaymentChange, handleTermChange } =
    useSavingsProductFilters();
  const { selectedSavingsProduct, handleSelectSavingsProduct } = useSelectedSavingsProduct();

  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount.toLocaleString('ko-KR')}
        onChange={e => handleTargetAmountChange(parseKoKrLocaleStringToNumber(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment.toLocaleString('ko-KR')}
        onChange={e => handleMonthlyPaymentChange(parseKoKrLocaleStringToNumber(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet<Term>
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={handleTermChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
          filters={{ targetAmount, monthlyPayment, term }}
          onSelect={handleSelectSavingsProduct}
          selectedSavingsProduct={selectedSavingsProduct}
        />
      )}

      <Spacing size={8} />

      {selectedTab === 'results' &&
        (selectedSavingsProduct ? (
          <>
            <CalculationResult
              targetSavingsProduct={selectedSavingsProduct}
              parameters={{ targetAmount, monthlyPayment, term }}
            />
            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />

            <RecommendedProductList
              filters={{ targetAmount, monthlyPayment, term }}
              selectedSavingsProduct={selectedSavingsProduct}
            />

            <Spacing size={40} />
          </>
        ) : (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        ))}
    </>
  );
}
