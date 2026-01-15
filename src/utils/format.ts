export const formatKRAmount = (amount: number) => {
  if (!amount) {
    return '';
  }
  return amount.toLocaleString('ko-KR');
};
