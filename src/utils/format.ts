export const formatAmount = (amount: number | null) => {
  if (amount === null) {
    return '';
  }
  return new Intl.NumberFormat('ko-KR').format(Number(amount));
};

export const parseNumber = (value: string) => {
  const parsedStringValue = value.replace(/[^0-9]/g, '');
  return parsedStringValue ? parseInt(parsedStringValue) : null;
};

export const percentageToDecimal = (percentage: number) => percentage / 100;
