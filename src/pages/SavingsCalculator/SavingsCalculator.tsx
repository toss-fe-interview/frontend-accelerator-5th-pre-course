import { filter } from 'es-toolkit/compat';
import { flow } from 'es-toolkit/function';
import { useState } from 'react';
import { SavingsProduct } from 'shared/api/type';
import { CheckCircleIcon } from 'shared/icon';
import { Calculator } from 'shared/ui/Calculator';
import { removeCommas } from 'shared/utils/string';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { CalculationResult } from './ui/CalculationResult';
import { SavingProduct } from './ui/SavingProduct';
import { createSavingsFilter, sortByDesc, takeTop2 } from './utils';

type TabType = 'products' | 'results';

const 저축기간범위 = [6, 12, 24, 48] as const;

export function SavingsCalculator({ savingProducts }: { savingProducts: SavingsProduct[] }) {
  const [목표금액, set목표금액] = useState(0);
  const [월납입액, set월납입액] = useState(0);
  const [저축기간, set저축기간] = useState<(typeof 저축기간범위)[number]>(12);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>();
  const [selectedTab, setSelectedTab] = useState<TabType>('products');

  const savingsFilters = createSavingsFilter({ 월납입액, 저축기간 });
  const filteredProducts = filter(savingProducts, savingsFilters);

  const getRecommendProducts = flow(sortByDesc, takeTop2);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={목표금액.toLocaleString('ko-KR')}
        onChange={e => set목표금액(Number(removeCommas(e.target.value)) || 0)}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={월납입액.toLocaleString('ko-KR')}
        onChange={e => set월납입액(Number(removeCommas(e.target.value)) || 0)}
      />

      <Spacing size={16} />

      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={저축기간} onChange={set저축기간}>
        {저축기간범위.map(value => (
          <SelectBottomSheet.Option key={value} value={value}>
            {value}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabType)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <>
          {filteredProducts.map(product => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingProduct
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={isSelected ? <CheckCircleIcon /> : null}
                onClick={() => setSelectedProduct(product)}
              />
            );
          })}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />
          {selectedProduct ? (
            <>
              <Calculator formula={() => 월납입액 * 저축기간 * (1 + selectedProduct.annualRate * 0.5)}>
                {예상수익금액 => (
                  <ListRow
                    contents={
                      <CalculationResult top="예상 수익 금액" bottom={`${예상수익금액.toLocaleString('ko-KR')} 원`} />
                    }
                  />
                )}
              </Calculator>

              <Calculator formula={() => 월납입액 * 저축기간 * (1 + selectedProduct.annualRate * 0.5)}>
                {예상수익금액 => {
                  const 목표금액과의차이 = 목표금액 - 예상수익금액;
                  return (
                    <ListRow
                      contents={
                        <CalculationResult
                          top="목표 금액과의 차이"
                          bottom={`${목표금액과의차이.toLocaleString('ko-KR')} 원`}
                        />
                      }
                    />
                  );
                }}
              </Calculator>

              <Calculator
                formula={() => Math.round(목표금액 / (저축기간 * (1 + selectedProduct.annualRate * 0.5)) / 1000) * 1000}
              >
                {추천월납입금액 => (
                  <ListRow
                    contents={
                      <CalculationResult
                        top="추천 월 납입 금액"
                        bottom={`${추천월납입금액.toLocaleString('ko-KR')} 원`}
                      />
                    }
                  />
                )}
              </Calculator>
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />

          <Spacing size={12} />

          {getRecommendProducts(filteredProducts).map(product => {
            const isSelected = selectedProduct?.id === product.id;
            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingProduct
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={isSelected ? <CheckCircleIcon /> : null}
                onClick={() => setSelectedProduct(product)}
              />
            );
          })}
        </>
      )}
    </>
  );
}
