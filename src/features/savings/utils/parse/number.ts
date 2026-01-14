export const parseNumberInput = (value: string): number => {
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned === '' ? 0 : Number(cleaned);
};
