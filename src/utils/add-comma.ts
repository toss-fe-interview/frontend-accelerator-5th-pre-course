/**
 * 숫자에 천 단위로 콤마를 추가하는 함수
 *
 * @param value 콤마를 추가할 숫자 혹은 undefined
 * @returns 콤마가 추가된 문자열 혹은 undefined
 */

export const addComma = (value: number | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return value.toLocaleString('en-US');
};
