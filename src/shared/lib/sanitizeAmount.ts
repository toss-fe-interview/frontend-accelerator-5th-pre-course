export const sanitizeAmount = (value: string) => {
  const digits = value.replace(/[^0-9]/g, '');
  return Number(digits);
};
