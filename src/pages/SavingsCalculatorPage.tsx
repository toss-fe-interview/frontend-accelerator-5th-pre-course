import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Assets,
  Border,
  colors,
  http,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { URLS } from 'consts';

type CalculatorForm = {
  monthlyAmount: number | null;
  targetAmount: number | null;
  term: number;
};

const TAB_STATE = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB_STATE)[keyof typeof TAB_STATE];

const isTabType = (value: string): value is TabType => {
  return Object.values(TAB_STATE).includes(value as TabType);
};

type SavingProduct = {
  annualRate: number;
  availableTerms: number;
  id: string;
  maxMonthlyAmount: number;
  minMonthlyAmount: number;
  name: string;
};

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);
  const [tabState, setTabState] = useState<TabType>(TAB_STATE.PRODUCTS);

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
  const { monthlyAmount, term, targetAmount } = useWatch({
    control: methods.control,
  });

  const filteredProducts = (savingProducts ?? []).filter(product => {
    const isTermMatched = product.availableTerms === term;
    const isMonthlyAmountMatched = monthlyAmount
      ? product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount
      : true;
    return isTermMatched && isMonthlyAmountMatched;
  });
  const recommendProductList = filteredProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const expectedIncome = (monthlyAmount ?? 0) * (term ?? 0) * (1 + (selectedProduct?.annualRate ?? 0) * 0.01 * 0.5);
  const targetDiff = (targetAmount ?? 0) - expectedIncome;
  const rawRecommendedMonthlyPayment =
    ((targetAmount ?? 0) / (term ?? 0)) * (1 + (selectedProduct?.annualRate ?? 0) * 0.01 * 0.5);
  const recommendedMonthlyPayment = Math.round(rawRecommendedMonthlyPayment / 1000) * 1000;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <Controller
        name="targetAmount"
        control={methods.control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value ? field.value.toLocaleString('ko-KR') : ''}
            onChange={e => {
              const value = e.target.value.replace(/,/g, '');
              if (value === '' || /^\d+$/.test(value)) {
                field.onChange(value === '' ? null : Number(value));
              }
            }}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={methods.control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value ? field.value.toLocaleString('ko-KR') : ''}
            onChange={e => {
              const value = e.target.value.replace(/,/g, '');
              if (value === '' || /^\d+$/.test(value)) {
                field.onChange(value === '' ? null : Number(value));
              }
            }}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="term"
        control={methods.control}
        render={({ field }) => (
          <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" {...field}>
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          if (isTabType(value)) {
            setTabState(value);
          }
        }}
      >
        <Tab.Item value={TAB_STATE.PRODUCTS} selected={tabState === TAB_STATE.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_STATE.RESULTS} selected={tabState === TAB_STATE.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      <Suspense fallback={<div>Loading...</div>}>
        {tabState === TAB_STATE.PRODUCTS &&
          filteredProducts.map(savingProduct => (
            <ListRow
              key={savingProduct.id}
              contents={
                <ListRow.Texts
                  type="3RowTypeA"
                  top={savingProduct.name}
                  topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                  middle={`연 이자율: ${savingProduct.annualRate}%`}
                  middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                  bottom={`${savingProduct.minMonthlyAmount.toLocaleString('kr-KR')}원 ~ ${savingProduct.maxMonthlyAmount.toLocaleString('kr-KR')}원 | ${savingProduct.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              right={selectedProduct?.id === savingProduct.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
              onClick={() => {
                setSelectedProduct(savingProduct);
              }}
            />
          ))}

        {tabState === TAB_STATE.RESULTS && (
          <>
            <Spacing size={8} />
            {selectedProduct ? (
              <>
                <ListRow
                  contents={
                    <ListRow.Texts
                      type="2RowTypeA"
                      top="예상 수익 금액"
                      topProps={{ color: colors.grey600 }}
                      bottom={`${expectedIncome.toLocaleString('kr-KR')}원`}
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
                      bottom={`${targetDiff.toLocaleString('kr-KR')}원`}
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
                      bottom={`${recommendedMonthlyPayment.toLocaleString('kr-KR')}원`}
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

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />
            {recommendProductList?.map(product => (
              <ListRow
                key={product.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={product.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${product.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={`${product.minMonthlyAmount.toLocaleString('kr-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('kr-KR')}원 | ${product.availableTerms}개월`}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => {
                  setSelectedProduct(product);
                }}
              />
            ))}
            <Spacing size={40} />
          </>
        )}
      </Suspense>
    </>
  );
}
