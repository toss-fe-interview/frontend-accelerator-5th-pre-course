const koFormat = new Intl.NumberFormat('ko-KR');

export const commaizeNumber = (num: number) => {
  return koFormat.format(num);
};
