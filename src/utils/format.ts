export const formatMoney = (value: number, unit: string, locale: string) => {
  return value.toLocaleString(locale) + unit;
};

export const roundTo = (value: number, to: number) => {
  return Math.round(value / to) * to;
};
