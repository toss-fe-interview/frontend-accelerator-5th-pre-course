export const formatMoney = (amount: number) => {
  return amount.toLocaleString('ko-KR');
};

export const extractDigits = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};
