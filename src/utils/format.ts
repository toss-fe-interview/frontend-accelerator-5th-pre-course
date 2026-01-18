// TODO: optinos 도 같이 받을 수 잇게
export function formatCurrency(value: number) {
  return value.toLocaleString();
}

export function formatDifference(difference: number): string {
  const sign = difference > 0 ? '-' : '+';
  return `${sign}${formatCurrency(Math.abs(difference))}`;
}
