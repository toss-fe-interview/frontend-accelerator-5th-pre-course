const calculateInterestMultiplier = (terms: number, annualRate: number) => terms * (1 + annualRate * 0.5);

export const calculateExpectedAmount = ({
  annualRate,
  monthlyPayment,
  terms,
}: {
  annualRate: number;
  monthlyPayment: number;
  terms: number;
}) => {
  return monthlyPayment * calculateInterestMultiplier(terms, annualRate);
};

export const calculateRecommendedMonthlyPayment = ({
  targetAmount,
  annualRate,
  terms,
}: {
  targetAmount: number;
  annualRate: number;
  terms: number;
}) => {
  return Math.round(targetAmount / calculateInterestMultiplier(terms, annualRate) / 1000) * 1000;
};
