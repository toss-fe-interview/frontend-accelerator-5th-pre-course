import { Spacing } from 'tosslib';
import { ExpectedProfit } from './ExpectedProfit';
import { GoalDifference } from './GoalDifference';
import { RecommendedDeposit } from './RecommendedDeposit';
import { EmptyState } from '../EmptyState';
import type { SavingsProduct } from '..';
import type { SavingsCalculatorState } from '../Calculator/useSavingsCalculator';

function calculateExpectedProfit(monthlyDeposit: number, period: number, annualRate: number): number {
  // 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
  return monthlyDeposit * period * (1 + annualRate * 0.5);
}

function calculateGoalDifference(goalAmount: number, expectedProfit: number): number {
  // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
  return goalAmount - expectedProfit;
}

function calculateRecommendedDeposit(goalAmount: number, period: number, annualRate: number): number {
  // 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
  const rawAmount = goalAmount / (period * (1 + annualRate * 0.5));
  // 1,000원 단위로 반올림
  return Math.round(rawAmount / 1000) * 1000;
}

interface ResultProps {
  selectedProductId: string | null;
  products: SavingsProduct[];
  calculatorState: SavingsCalculatorState;
}

function ResultRoot({ selectedProductId, products, calculatorState }: ResultProps) {
  if (!selectedProductId) return <EmptyState message="상품을 선택해주세요" />;

  const selectedProduct = products.find(p => p.id === selectedProductId);
  if (!selectedProduct) return <EmptyState message="상품을 선택해주세요" />;

  const monthlyDeposit = Number(calculatorState.monthlyDeposit) || 0;
  const goalAmount = Number(calculatorState.goalAmount) || 0;
  const period = calculatorState.savingsPeriod;
  const annualRate = selectedProduct.annualRate;

  const expectedProfit = calculateExpectedProfit(monthlyDeposit, period, annualRate);
  const goalDifference = calculateGoalDifference(goalAmount, expectedProfit);
  const recommendedDeposit = calculateRecommendedDeposit(goalAmount, period, annualRate);

  return (
    <>
      <Spacing size={8} />
      <Result.ExpectedProfit amount={expectedProfit} />
      <Result.GoalDifference amount={goalDifference} />
      <Result.RecommendedDeposit amount={recommendedDeposit} />
    </>
  );
}

export const Result = Object.assign(ResultRoot, {
  ExpectedProfit,
  GoalDifference,
  RecommendedDeposit,
});
