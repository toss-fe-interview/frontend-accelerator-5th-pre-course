export const parseFormattedNumber = (str: string | undefined | null): number | undefined => {
  if (str === undefined || !str) {
    return undefined;
  }

  return Number(str.replace(/,/g, ''));
};
