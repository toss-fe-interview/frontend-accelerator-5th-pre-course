export const formatMoney = (amount: number) => {
  return amount.toLocaleString('ko-KR');
};

export const formatDifference = (amount: number) => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatMoney(Math.round(amount))}원`;
};

export const extractDigits = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};
