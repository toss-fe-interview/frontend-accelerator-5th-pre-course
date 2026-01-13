// 통화 형식 변환 함수
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ko-KR').format(Number(amount));
}

export function parseNumberInput(value: string) {
  const parsedStringValue = value.replace(/[^0-9]/g, '');
  return parsedStringValue ? parseInt(parsedStringValue) : null;
}
