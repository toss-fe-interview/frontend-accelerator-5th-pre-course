import { ListRow } from 'tosslib';
import { SavingsProduct } from '../types';
import { CalculationResultItem } from './CalculationResultItem';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from '../utils/calculate';

type CalculationResultListProps = {
  product?: SavingsProduct;
  targetAmount: number;
  monthlyPayment: number;
  terms: number;
};

export const CalculationResultList = ({ product, targetAmount, monthlyPayment, terms }: CalculationResultListProps) => {
  if (!product) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const expectedAmount = calculateExpectedAmount({
    annualRate: product.annualRate,
    monthlyPayment,
    terms,
  });

  const difference = targetAmount - expectedAmount;

  const recommendedPayment = calculateRecommendedMonthlyPayment({
    targetAmount,
    annualRate: product.annualRate,
    terms,
  });

  return (
    <>
      <CalculationResultItem label="예상 수익 금액" value={expectedAmount} />
      <CalculationResultItem label="목표 금액과의 차이" value={difference} />
      <CalculationResultItem label="추천 월 납입 금액" value={recommendedPayment} />
    </>
  );
};
