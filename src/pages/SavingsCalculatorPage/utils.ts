/**
 * 숫자 입력을 파싱하여 number | null로 변환하는 유틸리티 함수
 *
 * @param input - 사용자 입력 문자열 (콤마 포함 가능)
 * @returns 유효한 숫자면 number, 빈 문자열이면 null, 유효하지 않으면 undefined
 *
 * @example
 * parseNumericInput('1,000') // 1000
 * parseNumericInput('') // null
 * parseNumericInput('abc') // undefined (유효하지 않음)
 */
export const parseNumericInput = (input: string): number | null | undefined => {
  const value = input.replace(/,/g, '');

  // 빈 문자열인 경우 null 반환
  if (value === '') {
    return null;
  }

  // 숫자만 포함하는 경우 number 반환
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  // 유효하지 않은 입력인 경우 undefined 반환
  return undefined;
};
