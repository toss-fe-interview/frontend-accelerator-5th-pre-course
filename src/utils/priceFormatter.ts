export const priceFormatterToLocaleString = (price: number) => {
  return price.toLocaleString('ko-KR');
};

export const priceParserToNumber = (price: string) => {
  return Number(price.replace(/[^0-9]/g, ''));
};
