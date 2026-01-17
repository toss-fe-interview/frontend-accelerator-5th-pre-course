export const roundToUnit = (price: number, unit: number) => {
  return Math.round(price / unit) * unit;
};
