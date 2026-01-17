import { SavingsTerm } from './types';
import { roundToUnit } from 'utils/roundToUnit';

export const calculateExpectedRevenue = (monthlyAmount: number, savingsTerm: SavingsTerm, annualRate: number) => {
  return monthlyAmount * savingsTerm * (1 + (annualRate / 100) * 0.5);
};

export const calculateDifference = (targetAmount: number, expectedRevenue: number) => {
  return targetAmount - expectedRevenue;
};

export const calculateRecommendedAmount = (targetAmount: number, savingsTerm: SavingsTerm, annualRate: number) => {
  const recommendedAmount = targetAmount / (savingsTerm * (1 + (annualRate / 100) * 0.5));
  return roundToUnit(recommendedAmount, 1000);
};
