import { useState, useMemo, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getSavingsProducts } from 'api/savings';
import { useQuery } from '@tanstack/react-query';
import { Border, ListRow, NavigationBar, Spacing, Tab, SelectBottomSheet, ListHeader } from 'tosslib';
import { SavingsFormInput } from 'types/savings';
import NumberInput from 'components/NumberInput';
import SavingProductItem from 'components/SavingProductItem';
import CalculateResultItem from 'components/CalculateResultItem';
import { filterSavingProducts } from 'utils/filterSavingProducts';
import { calculateSavingsResult } from 'utils/calculateSavingsResult';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<'productList' | 'calculationResult'>('productList');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['savings-products'],
    queryFn: getSavingsProducts,
  });

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

  const filteredProducts = useMemo(() => {
    return filterSavingProducts(products, monthlyAmount, terms);
  }, [monthlyAmount, terms, products]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) {
      return null;
    }

    return products.find(product => product.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const { expectedAmount, difference, recommendMonthlyAmount } = calculateSavingsResult({
    targetAmount,
    monthlyAmount,
    terms,
    annualRate: selectedProduct?.annualRate ?? 0,
  });

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  useEffect(() => {
    if (selectedProductId && !filteredProducts.some(product => product.id === selectedProductId)) {
      setSelectedProductId(null);
    }
  }, [filteredProducts, selectedProductId]);

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
        ) : filteredProducts.length === 0 ? (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
        ) : (
          filteredProducts.map(product => (
            <SavingProductItem
              key={product.id}
              product={product}
              isSelected={product.id === selectedProductId}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))
        )
      ) : !selectedProduct ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      ) : (
        <>
          <Spacing size={8} />
          <CalculateResultItem label="예상 수익 금액" value={expectedAmount} />
          <CalculateResultItem label="목표 금액과의 차이" value={difference} />
          <CalculateResultItem label="추천 월 납입 금액" value={recommendMonthlyAmount} />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts.map(product => (
            <SavingProductItem
              key={product.id}
              product={product}
              isSelected={product.id === selectedProductId}
            />
          ))}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
