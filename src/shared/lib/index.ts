export const sortBy = <T>(array: T[], getValue: (item: T) => number, order: 'desc' | 'asc' = 'asc'): T[] => {
  const modifier = order === 'desc' ? -1 : 1;
  return [...array].sort((a, b) => (getValue(a) - getValue(b)) * modifier);
};

export const takeFromHead = <T>(array: T[], number: number) => {
  return array.slice(0, number);
};

export const isBetween = ({
  value,
  min,
  max,
  inclusive = true,
}: {
  value: number;
  min: number;
  max: number;
  inclusive?: boolean;
}) => (inclusive ? min <= value && value <= max : min < value && value < max);
