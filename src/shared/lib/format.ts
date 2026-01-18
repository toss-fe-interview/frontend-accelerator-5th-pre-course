function formatPrice(value: number, locale = 'ko-KR') {
  return value.toLocaleString(locale);
}

function formatCurrency(value: number) {
  return `${formatPrice(value)}원`;
}

function parsePrice(value: string): number | null {
  const cleaned = value.replace(/,/g, '');
  if (cleaned === '') {
    return null;
  }
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? null : parsed;
}

export { formatPrice, formatCurrency, parsePrice };
