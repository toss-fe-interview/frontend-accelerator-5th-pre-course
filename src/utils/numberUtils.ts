/**
 * 포맷된 문자열에서 숫자만 추출하여 number로 변환
 * @example parseFormattedNumber("1,000,000") => 1000000
 * @example parseFormattedNumber("") => 0
 */
export const parseFormattedNumber = (str: string): number => {
  return Number(str.replace(/,/g, '')) || 0;
};

/**
 * 문자열에서 숫자만 추출
 * @example extractDigits("abc123def") => "123"
 */
export const extractDigits = (str: string): string => {
  return str.replace(/[^\d]/g, '');
};

/**
 * 사용자 입력값을 콤마 포맷 문자열로 변환
 * @example formatNumberInput("1000000") => "1,000,000"
 * @example formatNumberInput("abc123") => "123"
 */
export const formatNumberInput = (value: string): string => {
  const digits = extractDigits(value);
  return digits ? Number(digits).toLocaleString('ko-KR') : '';
};
