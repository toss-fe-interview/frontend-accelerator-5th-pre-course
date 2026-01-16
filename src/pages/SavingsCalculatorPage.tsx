import { fetchSavingsProducts } from 'components/ProductTabs/api';
import { ProductTabs, SavingsProduct } from 'components/ProductTabs/types';
import { useEffect, useState } from 'react';
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
} from 'tosslib';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [savingTerms, setSavingTerms] = useState(12);
  const [selectedTab, setSelectedTab] = useState<ProductTabs>('products');
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

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
  const diffAmount = Number(targetAmount ?? 0) - expectedProfit;
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchSavingsProducts();
        setProducts(data);
      } catch (e) {
        console.error('Failed to fetch products:', e);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <>
        <TextField
          label="목표 금액"
          placeholder="목표 금액을 입력하세요"
          suffix="원"
          value={targetAmount.toLocaleString('ko-KR')}
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
          value={monthlyAmount.toLocaleString('ko-KR')}
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
            const description = `${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`;

            return (
              <ListRow
                key={product.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={product.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${product.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={description}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={selectedSavingProduct?.id === product.id && <Assets.Icon name="icon-check-circle-green" />}
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
                topProps={{ color: colors.grey600 }}
                bottom={`${expectedProfit.toLocaleString('ko-KR')}원`}
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
                bottom={`${diffAmount.toLocaleString('ko-KR')}원`}
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
                bottom={`${(recommendMonthlyPayment ?? 0).toLocaleString('ko-KR')}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />

          <Border height={16} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedProducts.length > 0 ? (
            recommendedProducts.map(product => {
              const description = `${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`;

              return (
                <ListRow
                  key={product.id}
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={product.name}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: ${product.annualRate}%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={description}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  right={selectedSavingProduct?.id === product.id && <Assets.Icon name="icon-check-circle-green" />}
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
