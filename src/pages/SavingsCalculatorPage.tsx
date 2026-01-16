import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingsInputForm } from 'components/SavingsInputForm';
import { CalculationResults } from 'components/CalculationResults';
import { ProductInfoTexts } from 'components/ProductInfoTexts';
import { SavingsInput, SavingsProduct } from 'type';
import { savingsProductsQuery } from 'apis/savingsProduct';

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery());
  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectTab, setSelectTab] = useState<'products' | 'results'>('products');

  const matchingProducts = useMemo(() => {
    return savingsProducts.filter(product => {
      return (
        product.minMonthlyAmount <= savingsInput.monthlyAmount &&
        product.maxMonthlyAmount >= savingsInput.monthlyAmount &&
        product.availableTerms === savingsInput.term
      );
    });
  }, [savingsProducts, savingsInput]);

  const topRatedProducts = [...matchingProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const hasValidInput = savingsInput.term && savingsInput.monthlyAmount;
  const hasNoMatchingProducts = matchingProducts.length === 0;
  const hasNoSelectedProduct = !selectedSavingsProduct;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm savingsInput={savingsInput} setSavingsInput={setSavingsInput} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <Spacing size={8} />
      {hasValidInput ? (
        <>
          {selectTab === 'products' && (
            <>
              {hasNoMatchingProducts ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="입력한 조건에 맞는 상품이 없습니다." />} />
              ) : (
                <>
                  {matchingProducts.map(product => {
                    const isSelected = selectedSavingsProduct?.id === product.id;

                    return (
                      <ListRow
                        key={product.id}
                        contents={<ProductInfoTexts product={product} />}
                        right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
                        onClick={() => setSelectedSavingsProduct(product)}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
          {selectTab === 'results' && (
            <>
              {hasNoSelectedProduct ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
              ) : (
                <>
                  <CalculationResults selectedProduct={selectedSavingsProduct} savingsInput={savingsInput} />

                  <Spacing size={8} />
                  <Border height={16} />
                  <Spacing size={8} />

                  <ListHeader
                    title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                  />
                  <Spacing size={12} />
                  {topRatedProducts.map(product => (
                    <ListRow key={product.id} contents={<ProductInfoTexts product={product} />} />
                  ))}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="먼저 저축 기간과 월 납입 금액을 입력해주세요." />} />
      )}
      <Spacing size={40} />
    </>
  );
}
