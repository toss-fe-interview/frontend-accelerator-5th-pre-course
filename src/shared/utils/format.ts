export const toNumber = (value: string | number): number => (typeof value === 'string' ? parseInt(value) : value);
export const toString = (value: string | number): string => (typeof value === 'number' ? value.toString() : value);
