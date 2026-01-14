/**
 * 숫자를 3자리마다 콤마(,)를 추가한 문자열로 변환합니다.
 * @param value - 포맷팅할 숫자
 * @returns 콤마가 포함된 문자열 (예: 1000000 -> "1,000,000")
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR');
};
