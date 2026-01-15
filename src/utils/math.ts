export const roundingNumber = (num: number) => {
  if (num >= 1000) {
    const rounded = Math.round(num / 1000);
    return rounded * 1000;
  }
  return 0;
};

export const calculateExpectedProfit = (monthlyAmount: string, savingTerms: number, annualRate: number) => {
  return Number(monthlyAmount) * savingTerms * (1 + annualRate * 0.5);
};

export const calculateRecommendMonthlyPayment = (targetAmount: string, savingTerms: number, annualRate: number) => {
  return roundingNumber(Number(targetAmount) / (savingTerms * (1 + annualRate * 0.5)));
};
