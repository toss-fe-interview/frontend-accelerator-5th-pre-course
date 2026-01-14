/**
 * 숫자를 한국 원화 형식으로 포맷팅 (콤마 추가)
 * @param num - 포맷팅할 숫자
 * @returns 콤마가 추가된 문자열
 * @example
 * formatNumber(1000000) // "1,000,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 숫자를 1,000원 단위로 반올림
 * @param num - 반올림할 숫자
 * @returns 1,000원 단위로 반올림된 숫자
 * @example
 * roundToThousand(1234567) // 1235000
 */
export function roundToThousand(num: number): number {
  return Math.round(num / 1000) * 1000;
}

/**
 * 숫자를 한국 원화 형식으로 포맷팅하고 "원" 단위 추가
 * @param num - 포맷팅할 숫자
 * @returns 콤마와 "원"이 추가된 문자열
 * @example
 * formatCurrency(1000000) // "1,000,000원"
 */
export function formatCurrency(num: number): string {
  return `${formatNumber(num)}원`;
}