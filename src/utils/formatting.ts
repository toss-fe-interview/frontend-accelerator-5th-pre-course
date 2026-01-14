export const formatNumberToKo = (num: number | undefined): string => {
  if (num === undefined) {
    return '';
  }

  return num.toLocaleString('ko-KR');
};
