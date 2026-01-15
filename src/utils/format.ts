export function formatNumber(value: number) {
  return value.toLocaleString('ko-KR');
}

export function parseNumberInput(value: string): number {
  const numberValue = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(numberValue) ? 0 : numberValue;
}