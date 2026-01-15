// TODO: 함수명 자체에 Thousand 값이 포함되어 1000단위 반올림 밖에 할수 없습니다.
export function roundToThousand(value: number) {
  // +1, -1
  const sign = Math.sign(value);
  return sign * Math.round(Math.abs(value) / 1000) * 1000;
}
