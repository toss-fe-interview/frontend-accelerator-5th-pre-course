export const formatMoney = (value: number, unit: string, locale: string) => {
  return value.toLocaleString(locale) + unit;
};
