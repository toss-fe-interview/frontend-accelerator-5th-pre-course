export const parseFormattedNumber = (str: string | undefined | null): number | undefined => {
  if (str === undefined || !str) {
    return undefined;
  }

  const num = Number(str.replace(/,/g, ''));

  if (isNaN(num)) {
    return undefined;
  }

  return num;
};
