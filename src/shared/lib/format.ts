function formatPrice(value: number, locale = 'ko-KR') {
  return value.toLocaleString(locale);
}

function formatCurrency(value: number) {
  return `${formatPrice(value)}원`;
}

export { formatPrice, formatCurrency };
