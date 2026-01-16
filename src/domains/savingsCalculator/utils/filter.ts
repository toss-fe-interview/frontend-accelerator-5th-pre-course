interface RangeInProps {
  min: number;
  max: number;
}

export const rangeIn = (value: number, { min, max }: RangeInProps) => {
  return value >= min && value <= max;
};
