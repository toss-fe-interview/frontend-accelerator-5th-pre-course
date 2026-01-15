export function formatDifference(value: number) {
  if (value > 0) {
    return `-${value.toLocaleString()}원`;
  } else if (value < 0) {
    return `+${Math.abs(value).toLocaleString()}원`;
  }
  return '0원';
}
