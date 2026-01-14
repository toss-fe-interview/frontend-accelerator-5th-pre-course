export const parseFormattedNumber = (str: string): number => {
  return Number(str.replace(/,/g, ''));
};
