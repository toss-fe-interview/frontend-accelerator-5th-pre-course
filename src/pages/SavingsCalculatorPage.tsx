import { useQuery } from '@tanstack/react-query';
import { AmountDisplay } from 'components/AmountDisplay';
import { AmountInput } from 'components/AmountInput';
import { GetFilteredProducts } from 'components/GetFilteredProuducts';
import { SavingsProductItem } from 'components/SavingsProductItem';
import { SavingsTermSelect } from 'components/SavingsTermSelect';
import { TAB_STATE, Tabs } from 'components/Tabs';
import { SavingProduct } from 'queries/types';
import { URLS } from 'queries/urls';
import { Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Border, http, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';

type CalculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const { data: savingProducts } = useQuery({
    queryKey: [URLS.SAVINGS_PRODUCTS],
    queryFn: () => http.get<SavingProduct[]>(URLS.SAVINGS_PRODUCTS),
  });

  const methods = useForm<CalculatorForm>({
    defaultValues: {
      monthlyAmount: null,
      targetAmount: null,
      term: 12,
    },
  });
  const { monthlyAmount, term, targetAmount } = methods.watch();

  const recommendProductList = savingProducts
    ?.filter(product => filterSavingsProduct(product, monthlyAmount ?? 0, term))
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  const expectedIncome = (monthlyAmount ?? 0) * (term ?? 0) * (1 + (selectedProduct?.annualRate ?? 0) * 0.01 * 0.5);
  const targetDiff = (targetAmount ?? 0) - expectedIncome;
  const rawRecommendedMonthlyPayment =
    ((targetAmount ?? 0) / (term ?? 0)) * (1 + (selectedProduct?.annualRate ?? 0) * 0.01 * 0.5);
  const recommendedMonthlyPayment = Math.round(rawRecommendedMonthlyPayment / 1000) * 1000;

  return (
    <FormProvider {...methods}>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={val => methods.setValue('targetAmount', val)}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyAmount}
        onChange={val => methods.setValue('monthlyAmount', val)}
      />
      <Spacing size={16} />
      <SavingsTermSelect
        label="저축 기간"
        placeholder="저축 기간을 선택해주세요"
        value={term}
        onSelect={val => methods.setValue('term', val)}
        options={[
          { value: 6, label: '6개월' },
          { value: 12, label: '12개월' },
          { value: 24, label: '24개월' },
        ]}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tabs
        trigger={[
          <Tabs.Item key={TAB_STATE.PRODUCTS} value={TAB_STATE.PRODUCTS}>
            적금 상품
          </Tabs.Item>,
          <Tabs.Item key={TAB_STATE.RESULTS} value={TAB_STATE.RESULTS}>
            계산 결과
          </Tabs.Item>,
        ]}
      >
        <Tabs.Panel value={TAB_STATE.PRODUCTS}>
          <Suspense fallback={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />}>
            <GetFilteredProducts>
              {filteredProducts =>
                filteredProducts.map(product => (
                  <SavingsProductItem
                    key={product.id}
                    product={product}
                    checked={selectedProduct?.id === product.id}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))
              }
            </GetFilteredProducts>
          </Suspense>
        </Tabs.Panel>

        <Tabs.Panel value={TAB_STATE.RESULTS}>
          <>
            <Spacing size={8} />
            {selectedProduct ? (
              <>
                <AmountDisplay title="예상 수익 금액" value={expectedIncome} />
                <AmountDisplay title="목표 금액과의 차이" value={targetDiff} />
                <AmountDisplay title="추천 월 납입 금액" value={recommendedMonthlyPayment} />
              </>
            ) : (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}

            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />

            {recommendProductList?.map(product => (
              <SavingsProductItem
                product={product}
                key={product.id}
                checked={selectedProduct?.id === product.id}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
            <Spacing size={40} />
          </>
        </Tabs.Panel>
      </Tabs>
    </FormProvider>
  );
}
