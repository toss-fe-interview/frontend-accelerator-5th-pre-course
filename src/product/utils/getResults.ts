export const get예상수익금액 = (monthlyPayment: string, term: number | null, annualRate: number) => {
  if (term === null) {
    return 0;
  }

  return Number(monthlyPayment.replace(/,/g, '')) * term * (1 + annualRate * 0.5);
};

export const get목표금액과의차이 = (price: string, 예상수익금액: number) => {
  return Number(price.replace(/,/g, '')) - 예상수익금액;
};

export const get추천월납입금액 = (price: string, term: number | null, annualRate: number) => {
  if (term === null) {
    return 0;
  }

  return Math.round((Number(price.replace(/,/g, '')) + term * (1 + annualRate * 0.5)) / 1000) * 1000;
};
