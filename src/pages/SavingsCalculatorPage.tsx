import { useState, useMemo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getSavingsProducts } from 'api/savings';
import { useQuery } from '@tanstack/react-query';
import {
  Border,
  ListRow,
  NavigationBar,
  Spacing,
  Tab,
  colors,
  Assets,
  SelectBottomSheet,
  ListHeader,
} from 'tosslib';
import { SavingsFormInput } from 'types/savings';
import { formatNumber } from 'utils/format';
import NumberInput from 'components/NumberInput';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<'productList' | 'calculationResult'>('productList');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SavingsFormInput>({
    targetAmount: 0,
    monthlyAmount: 0,
    terms: 12,
  });

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });

  const filteredProducs = useMemo(() => {
    if (formData.monthlyAmount === 0) {
      return products;
    }

    return products.filter(product => {
      const isMonthlyAmountValid =
        formData.monthlyAmount >= product.minMonthlyAmount && formData.monthlyAmount <= product.maxMonthlyAmount;
      const isTermsValid = product.availableTerms === formData.terms;

      return isMonthlyAmountValid && isTermsValid;
    });
  }, [formData.monthlyAmount, formData.terms, products]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) {
      return null;
    }

    return products.find(product => product.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const { control, watch } = useForm<SavingsFormInput>({
    defaultValues: {
      targetAmount: 0,
      monthlyAmount: 0,
      terms: 12,
    },
    mode: 'onChange',
  });

  const targetAmount = watch('targetAmount');
  const monthlyAmount = watch('monthlyAmount');
  const terms = watch('terms');

  const calculationResult = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }
    const annualRate = selectedProduct.annualRate;
    const expectedAmount = formData.monthlyAmount * formData.terms * (1 + annualRate * 0.01 * 0.5);
    const difference = formData.targetAmount - expectedAmount;
    const recommendMonthlyAmount =
      Math.round(formData.targetAmount / (formData.terms * (1 + annualRate * 0.01 * 0.5)) / 1000) * 1000;

    return { expectedAmount, difference, recommendMonthlyAmount };
  }, [formData, selectedProduct]);

  const recommendedProducts = useMemo(() => {
    return [...filteredProducs].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducs]);

  useEffect(() => {
    setFormData({ targetAmount, monthlyAmount, terms });
  }, [targetAmount, monthlyAmount, terms]);

  useEffect(() => {
    if (selectedProductId && !filteredProducs.some(product => product.id === selectedProductId)) {
      setSelectedProductId(null);
    }
  }, [filteredProducs, selectedProductId]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />
      <Controller
        control={control}
        name="targetAmount"
        render={({ field }) => (
          <NumberInput
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        control={control}
        name="monthlyAmount"
        render={({ field }) => (
          <NumberInput
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        control={control}
        name="terms"
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={field.onChange}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'productList' | 'calculationResult')}>
        <Tab.Item value="productList" selected={selectedTab === 'productList'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculationResult" selected={selectedTab === 'calculationResult'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'productList' ? (
        isLoading ? (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중입니다..." />} />
        ) : isError ? (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중에 오류가 발생했습니다." />} />
        ) : filteredProducs.length === 0 ? (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
        ) : (
          filteredProducs.map(product => (
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
              right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : null}
              onClick={() => setSelectedProductId(product.id)}
            />
          ))
        )
      ) : (
        <>
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <Spacing size={8} />
              {calculationResult && (
                <>
                  <ListRow
                    contents={
                      <ListRow.Texts
                        type="2RowTypeA"
                        top="예상 수익 금액"
                        topProps={{ color: colors.grey600 }}
                        bottom={`${formatNumber(Math.round(calculationResult.expectedAmount))}원`}
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
                        bottom={`${formatNumber(calculationResult.recommendMonthlyAmount)}원`}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                      />
                    }
                  />
                </>
              )}

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
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
                  right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : null}
                />
              ))}

              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
