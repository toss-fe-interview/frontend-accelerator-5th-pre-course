import { SavingProduct } from 'product/type/internal';
import { Border, colors, ListRow, Spacing } from 'tosslib';
import RecommendedProducts from './RecommendedProducts';
import { Suspense } from 'react';
import ErrorBoundary from 'common/components/ErrorBoundary';

interface Props {
  price: string;
  monthlyPayment: string;
  term: number | null;
  selectedProduct: SavingProduct;
}

const SavingResults = ({ price, monthlyPayment, term, selectedProduct }: Props) => {
  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${get예상수익금액(monthlyPayment, term, selectedProduct.annualRate).toLocaleString()}원`}
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
            bottom={`${get목표금액과의차이(price, get예상수익금액(monthlyPayment, term, selectedProduct.annualRate)).toLocaleString()}원`}
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
            bottom={`${get추천월납입금액(price, term, selectedProduct.annualRate).toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ErrorBoundary>
        <Suspense>
          <RecommendedProducts monthlyPayment={monthlyPayment} term={term} selectedProduct={selectedProduct} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const get예상수익금액 = (monthlyPayment: string, term: number | null, annualRate: number) => {
  if (term === null) {
    return 0;
  }

  return Number(monthlyPayment.replace(/,/g, '')) * term * (1 + annualRate * 0.5);
};

const get목표금액과의차이 = (price: string, 예상수익금액: number) => {
  return Number(price.replace(/,/g, '')) - 예상수익금액;
};

const get추천월납입금액 = (price: string, term: number | null, annualRate: number) => {
  if (term === null) {
    return 0;
  }

  return Math.round((Number(price.replace(/,/g, '')) + term * (1 + annualRate * 0.5)) / 1000) * 1000;
};

export default SavingResults;
