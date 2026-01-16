import { flow } from 'es-toolkit/function';
import { useState } from 'react';
import { SavingsProduct } from 'shared/api/type';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';

type TabType = 'products' | 'results';

export function SavingsCalculator({ savingProducts }: { savingProducts: SavingsProduct[] }) {
  const [목표금액, set목표금액] = useState<number>(0);
  const [월납입액, set월납입액] = useState<number>(0);
  const [저축기간, set저축기간] = useState<6 | 12 | 24>(12);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('products');

  const filteredProducts = savingProducts.filter(
    product =>
      product.minMonthlyAmount <= 월납입액 &&
      product.maxMonthlyAmount >= 월납입액 &&
      product.availableTerms === 저축기간
  );

  const sortByHighRate = (products: SavingsProduct[]) => products.toSorted((a, b) => b.annualRate - a.annualRate);
  const takeTop2 = (products: SavingsProduct[]) => products.slice(0, 2);
  const getBestProducts = flow(sortByHighRate, takeTop2);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={toKRW(목표금액)}
        onChange={e => set목표금액(amountToNumber(e.target.value))}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={toKRW(월납입액)}
        onChange={e => set월납입액(amountToNumber(e.target.value))}
      />

      <Spacing size={16} />

      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={저축기간} onChange={set저축기간}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
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
              {(() => {
                const expectedAmount = 월납입액 * 저축기간 * (1 + selectedProduct.annualRate * 0.5);
                return (
                  <ListRow
                    contents={<CalculationResult top="예상 수익 금액" bottom={`${toKRW(expectedAmount)} 원`} />}
                  />
                );
              })()}

              {(() => {
                const expectedAmount = 월납입액 * 저축기간 * (1 + selectedProduct.annualRate * 0.5);
                const diffAmount = 목표금액 - expectedAmount;
                return (
                  <ListRow
                    contents={<CalculationResult top="목표 금액과의 차이" bottom={`${toKRW(diffAmount)} 원`} />}
                  />
                );
              })()}

              {(() => {
                const recommendedMonthly =
                  Math.round(목표금액 / (저축기간 * (1 + selectedProduct.annualRate * 0.5)) / 1000) * 1000;
                return (
                  <ListRow
                    contents={<CalculationResult top="추천 월 납입 금액" bottom={`${toKRW(recommendedMonthly)} 원`} />}
                  />
                );
              })()}
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />

          <Spacing size={12} />

          {getBestProducts(filteredProducts).map(product => {
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

const CheckCircleIcon = () => <Assets.Icon name="icon-check-circle-green" />;

const SavingProduct = ({
  name,
  annualRate,
  minMonthlyAmount,
  maxMonthlyAmount,
  availableTerms,
}: Omit<SavingsProduct, 'id'>) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
      middle={`연 이자율: ${annualRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${minMonthlyAmount.toLocaleString()}원 ~ ${maxMonthlyAmount.toLocaleString()}원 | ${availableTerms}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};

const CalculationResult = ({ top, bottom }: { top: string; bottom: string }) => {
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={top}
      topProps={{ color: colors.grey600 }}
      bottom={bottom}
      bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
    />
  );
};

const toKRW = (amount: number) => amount.toLocaleString('ko-KR');

export const amountToNumber = (value: string) => {
  return Number(value.replace(/,/g, '')) || 0;
};
