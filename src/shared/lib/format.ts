function formatNumber(value: number) {
  return value.toLocaleString('ko-KR');
}

function formatCurrency(value: number) {
  return `${formatNumber(value)}원`;
}

export { formatNumber, formatCurrency };
