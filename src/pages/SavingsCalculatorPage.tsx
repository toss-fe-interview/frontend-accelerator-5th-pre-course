import { useState } from 'react';
import { Border, ListHeader, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

import { CalculationResult } from 'components/CalculationResult';
import { EmptyListItem } from 'components/common/EmptyListItem';
import { SavingsProductList } from 'components/SavingsProductList';
import { useSavingsProducts } from 'hooks/queries/useSavingsProducts';
import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import { SavingsProduct } from 'types/SavingsProduct.type';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';
import { formatTextFieldValue } from 'utils/formatTextFieldValue';

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsCalculatorFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState<string | null>(null);
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

  const handleSelectProduct = (savingsProduct: SavingsProduct | null) => {
    setSelectedSavingsProductId(savingsProduct?.id || null);
  };

  const selectedSavingsProduct = filteredSavingsProducts.find(
    savingsProduct => savingsProduct.id === selectedSavingsProductId
  );

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
        <SavingsProductList
          savingsProducts={filteredSavingsProducts}
          selectedSavingsProductId={selectedSavingsProductId}
          handleSelectProduct={handleSelectProduct}
          emptyText="적합한 적금 상품이 없습니다."
        />
      )}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          <>
            {selectedSavingsProduct ? (
              <CalculationResult formState={formState} selectedSavingsProduct={selectedSavingsProduct} />
            ) : (
              <EmptyListItem message="상품을 선택해주세요." />
            )}
          </>

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <SavingsProductList
            savingsProducts={recommendedSavingsProducts}
            selectedSavingsProductId={selectedSavingsProductId}
            handleSelectProduct={handleSelectProduct}
            emptyText="적합한 추천 상품이 없습니다."
          />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
