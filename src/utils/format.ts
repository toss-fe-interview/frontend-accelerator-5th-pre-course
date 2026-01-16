export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(Number(amount));
};

export const parseNumberInput = (value: string) => {
  const parsedStringValue = value.replace(/[^0-9]/g, '');
  return parsedStringValue ? parseInt(parsedStringValue) : null;
};

export const percentageToDecimal = (percentage: number) => percentage / 100;
