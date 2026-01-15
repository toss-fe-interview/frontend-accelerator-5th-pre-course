export const IIFE = <T = () => unknown>(callback: () => T) => {
	return callback();
};

export const withTypeGuard = <T = string>(
	predicate: (value: unknown) => value is T,
	callback: (value: T) => void,
) => {
	return (value: unknown) => {
		if (predicate(value)) {
			return callback(value);
		}
	};
};
