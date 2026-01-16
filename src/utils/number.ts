export function extractDigits(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

export function parseFormattedAmount(value: string): number {
  return Number(value.replace(/,/g, '')) || 0;
}
