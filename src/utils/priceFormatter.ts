export const priceFormatterToString = (price: number) => {
  return price.toLocaleString('ko-KR');
};

export const priceParserToNumber = (price: string) => {
  return Number(price.replace(/,/g, ''));
};
