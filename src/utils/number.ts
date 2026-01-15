export const isInRange = (value: number, min: number, max: number) =>
	value >= min && value <= max;

export const getRatio = (value: number, total: number) => value / total;

export const percentageToFloat = (value: number) => value / 100;
