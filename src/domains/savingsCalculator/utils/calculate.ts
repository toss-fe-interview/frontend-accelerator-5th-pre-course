const round1000 = (value: number) => {
  return Math.round(value / 1000) * 1000;
};

const toMultiplier = (annualRate: number) => {
  const averageInterestRate = annualRate * 0.5;
  return averageInterestRate + 1;
};

export { round1000, toMultiplier };
