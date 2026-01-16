import { fetchSavingsProducts } from 'components/ProductTabs/api';
import { ProductTabs, SavingsProduct } from 'components/ProductTabs/types';
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

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [savingTerms, setSavingTerms] = useState(12);
  const [selectedTab, setSelectedTab] = useState<ProductTabs>('products');
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  const { data: products = [], error } = useQuery<SavingsProduct[], HttpError>({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  const roundingNumber = (num: number) => {
    if (num >= 1000) {
      const rounded = Math.round(num / 1000);
      return rounded * 1000;
    }
    return 0;
  };

  const calculateExpectedProfit = (monthlyAmount: number, savingTerms: number, annualRate: number) => {
    return monthlyAmount * savingTerms * (1 + annualRate * 0.5);
  };

  const calculateRecommendMonthlyPayment = (targetAmount: number, savingTerms: number, annualRate: number) => {
    return roundingNumber(targetAmount) / (savingTerms * (1 + annualRate * 0.5));
  };

  const expectedProfit = calculateExpectedProfit(monthlyAmount, savingTerms, selectedSavingProduct?.annualRate ?? 0);
  const diffAmount = targetAmount - expectedProfit;
  const recommendMonthlyPayment = calculateRecommendMonthlyPayment(
    targetAmount,
    savingTerms,
    selectedSavingProduct?.annualRate ?? 0
  );

  const hasAllValues = targetAmount && monthlyAmount && savingTerms;
  const filteredProducts = hasAllValues
    ? products.filter(product => {
        return (
          product.availableTerms === savingTerms &&
          Number(monthlyAmount) <= product.maxMonthlyAmount &&
          Number(monthlyAmount) >= product.minMonthlyAmount
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
          value={targetAmount.toString()}
          onChange={e => {
            const num = Number(e.target.value);
            setTargetAmount(num);
          }}
        />
        <Spacing size={16} />
        <TextField
          label="월 납입액"
          placeholder="희망 월 납입액을 입력하세요"
          suffix="원"
          value={monthlyAmount.toString()}
          onChange={e => {
            const num = Number(e.target.value);
            setMonthlyAmount(num);
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
                  <ProductListRowTexts
                    productName={product.name}
                    productAnnualRate={product.annualRate}
                    productInfoSummaryText={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}`}
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
                // HOW
                bottom={`${expectedProfit.toLocaleString('ko-KR')}원`}
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
                // HOW
                bottom={`${diffAmount.toLocaleString('ko-KR')}원`}
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
                // HOW
                bottom={`${(recommendMonthlyPayment ?? 0).toLocaleString('ko-KR')}원`}
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
                    <ProductListRowTexts
                      productName={product.name}
                      productAnnualRate={product.annualRate}
                      productInfoSummaryText={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}`}
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

// WHAT은 props로 받아서 본질을 명확히 하기
const ProductListRowTexts = ({
  productName,
  productAnnualRate,
  productInfoSummaryText,
}: {
  productName: string;
  productAnnualRate: number;
  productInfoSummaryText: string;
}) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={productName}
      middle={`연 이자율: ${productAnnualRate}%`}
      bottom={productInfoSummaryText}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};
