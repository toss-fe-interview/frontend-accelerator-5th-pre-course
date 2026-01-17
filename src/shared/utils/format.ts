export const toCurrency = (amount: number, { locale, unit = '' }: { locale: string; unit?: string }) => {
  return `${amount.toLocaleString(locale)}${unit}`;
};

/**
 * - 추상화 했을 때의 이점은?
 *  - locale과 unit 은 한 쌍으로 움직임. 예를 들어 통화 단위를 변경하려면, locale도 항상 신경써줘야함 ("이 통화 단위에 맞는 localeString인가?")
 *  - "원"화라는 관심사 아래, locale과 unit을 신경쓰지 않아도 됨.
 */
export const toCurrencyWon = (amount: number) => {
  return `${toCurrency(amount, { locale: 'ko-KR', unit: '원' })}`;
};

export const toNumber = (value: string) => {
  return Number(value.replace(/[^0-9]/g, ''));
};
