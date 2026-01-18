export const numericFormatter = (value: string): number => {
  return Number(value.replace(/,/g, ''));
};

export const interestFactor = (rate: number, weight: number) => 1 + rate * weight;
