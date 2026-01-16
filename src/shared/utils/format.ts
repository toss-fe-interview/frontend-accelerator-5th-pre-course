export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR');
};

export const toNumber = (value: string) => {
  return Number(value.replace(/[^0-9]/g, ''));
};
