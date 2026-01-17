export const formatPrice = (price: number, locale = 'ko-KR') => {
  return new Intl.NumberFormat(locale).format(price);
};
