export const roundToUnit = (num: number, unit = 1000) => {
  return Math.round(num / unit) * unit;
};
