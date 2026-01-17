export function getNumericStringOnly(value: string) {
  return value.replace(/[^0-9]/g, '');
}

// TODO: 함수명 자체에 Thousand 값이 포함되어 1000단위 반올림 밖에 할수 없습니다.
// 천원이하의 금액은 0으로 나오기 때문에 1000이하의 숫자는 그대로 return 해야할 필요도 있다.
export function roundToThousand(value: number) {
  // +1, -1
  const sign = Math.sign(value);
  return sign * Math.round(Math.abs(value) / 1000) * 1000;
}
