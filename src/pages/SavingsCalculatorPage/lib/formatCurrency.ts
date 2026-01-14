export function formatCurrency(amount: number, locale = 'ko-KR') {
  return new Intl.NumberFormat(locale).format(amount);
}
