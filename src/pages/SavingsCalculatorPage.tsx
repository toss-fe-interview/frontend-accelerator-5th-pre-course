import { useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

import { CalculationResult } from 'components/CalculationResult';
import { SavingsProductListItem } from 'components/SavingsProductListItem';
import { useSavingsProducts } from 'hooks/queries/useSavingsProducts';
import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import { SavingsProduct } from 'types/SavingsProduct.type';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';
import { formatTextFieldValue } from 'utils/formatTextFieldValue';

/**
 * 남은 버그 - 기간 변경 했는데, 선택은 남아있어서 계산 결과가 나온다
 */
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
      {selectedTab === 'products' && (
        <>
          {filteredSavingsProducts.length > 0 ? (
            filteredSavingsProducts.map(savingsProduct => {
              const isSelected = selectedSavingsProduct?.id === savingsProduct.id;
              return (
                <SavingsProductListItem
                  key={savingsProduct.id}
                  savingsProduct={savingsProduct}
                  isSelected={isSelected}
                  setSelectedSavingsProduct={setSelectedSavingsProduct}
                />
              );
            })
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적합한 적금 상품이 없습니다." />} />
          )}
        </>
      )}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          <>
            {selectedSavingsProduct ? (
              <CalculationResult formState={formState} selectedSavingsProduct={selectedSavingsProduct} />
            ) : (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}
          </>

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedSavingsProducts.length > 0 ? (
            recommendedSavingsProducts.map(savingsProduct => {
              const isSelected = selectedSavingsProduct?.id === savingsProduct.id;
              return (
                <SavingsProductListItem
                  key={savingsProduct.id}
                  savingsProduct={savingsProduct}
                  isSelected={isSelected}
                  setSelectedSavingsProduct={setSelectedSavingsProduct}
                />
              );
            })
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적합한 추천 상품이 없습니다." />} />
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
