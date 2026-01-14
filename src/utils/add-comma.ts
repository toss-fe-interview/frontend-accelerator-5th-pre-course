/**
 * 숫자에 천 단위로 콤마를 추가하는 함수
 *
 * @param value 콤마를 추가할 숫자
 * @returns 콤마가 추가된 문자열
 */

export const addComma = (value: number) => {
  return value.toLocaleString('en-US');
};
