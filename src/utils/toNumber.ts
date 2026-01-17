export const toNumber = (value: string): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};
