interface InRangeParams {
  value: number;
  min: number;
  max: number;
}

function inRange({ value, min, max }: InRangeParams): boolean {
  return value >= min && value <= max;
}

function isEqual<T>(a: T, b: T): boolean {
  return a === b;
}

function descending(a: number, b: number): number {
  return b - a;
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export { inRange, isEqual, descending, isNotNull };
