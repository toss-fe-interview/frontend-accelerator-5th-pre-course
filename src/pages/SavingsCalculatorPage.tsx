import { calculateExpectedProfit, calculateRecommendMonthlyPayment } from 'utils/calculate';
import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  NavigationBar,
  Spacing,
  Border,
  TextField,
  SelectBottomSheet,
  Tab,
  ListRow,
  ListHeader,
  colors,
  Assets,
  HttpError,
} from 'tosslib';
import SavingsProductItem from 'features/savings-product-item/ui/SavingsProductItem';
import { ProductTabs, SavingsProduct } from 'features/savings-products/model/types';
import { savingsProductsApi } from 'features/savings-products/api/savings-products';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [savingTerms, setSavingTerms] = useState(12);
  const [selectedTab, setSelectedTab] = useState<ProductTabs>('products');
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  const { data: products = [], error } = useQuery<SavingsProduct[], HttpError>({
    queryKey: ['savings-products'],
    queryFn: savingsProductsApi,
  });

  const expectedProfit = calculateExpectedProfit(
    monthlyAmount ?? 0,
    savingTerms,
    selectedSavingProduct?.annualRate ?? 0
  );

  const diffAmount = (targetAmount ?? 0) - expectedProfit;
  const recommendMonthlyPayment = calculateRecommendMonthlyPayment(
    targetAmount ?? 0,
    savingTerms,
    selectedSavingProduct?.annualRate ?? 0
  );

  const hasAllValues = targetAmount && monthlyAmount && savingTerms;
  const filteredProducts = hasAllValues
    ? products.filter(product => {
        return (
          product.availableTerms === savingTerms &&
          monthlyAmount <= product.maxMonthlyAmount &&
          monthlyAmount >= product.minMonthlyAmount
        );
      })
    : products;

  const recommendedProducts = [...filteredProducts].sort((prev, curr) => curr.annualRate - prev.annualRate).slice(0, 2);

  if (error) {
    return <div>적금 상품 데이터를 가져오는데 실패했어요.</div>;
  }

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <>
        <TextField
          label="목표 금액"
          placeholder="목표 금액을 입력하세요"
          suffix="원"
          value={targetAmount?.toString()}
          onChange={e => {
            const value = e.target.value;
            if (value.length > 13) return;
            const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
            setTargetAmount(Number(onlyNumber));
          }}
        />
        <Spacing size={16} />
        <TextField
          label="월 납입액"
          placeholder="희망 월 납입액을 입력하세요"
          suffix="원"
          value={monthlyAmount?.toString()}
          onChange={e => {
            const value = e.target.value;
            if (value.length > 13) return;
            const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
            setMonthlyAmount(Number(onlyNumber));
          }}
        />
        <Spacing size={16} />
        <SelectBottomSheet
          label="저축 기간"
          title="저축 기간을 선택해주세요"
          value={savingTerms}
          onChange={setSavingTerms}
        >
          <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
          <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
          <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
        </SelectBottomSheet>
      </>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as ProductTabs)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' ? (
        <>
          {filteredProducts.map(product => {
            const isSelected = selectedSavingProduct?.id === product.id;

            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingsProductItem
                    상품이름={product.name}
                    상품이율={product.annualRate}
                    납입조건={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}`}
                  />
                }
                right={isSelected && <CheckedIcon />}
                onClick={() => setSelectedSavingProduct(product)}
              />
            );
          })}
        </>
      ) : (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                bottom={`${expectedProfit.toLocaleString('ko-KR')}원`}
                // HOW
                topProps={{ color: colors.grey600 }}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="목표 금액과의 차이"
                bottom={`${diffAmount.toLocaleString('ko-KR')}원`}
                // HOW
                topProps={{ color: colors.grey600 }}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="추천 월 납입 금액"
                bottom={`${(recommendMonthlyPayment ?? 0).toLocaleString('ko-KR')}원`}
                // HOW
                topProps={{ color: colors.grey600 }}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />

          <Border height={16} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedProducts.length > 0 ? (
            recommendedProducts.map(product => {
              const isSelected = selectedSavingProduct?.id === product.id;

              return (
                <ListRow
                  key={product.id}
                  contents={
                    <SavingsProductItem
                      상품이름={product.name}
                      상품이율={product.annualRate}
                      납입조건={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}`}
                    />
                  }
                  right={isSelected && <CheckedIcon />}
                  onClick={() => setSelectedSavingProduct(product)}
                />
              );
            })
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 추천 상품이 없습니다." />} />
          )}
        </>
      )}
    </>
  );
}

const CheckedIcon = () => {
  return <Assets.Icon name="icon-check-circle-green" />;
};
