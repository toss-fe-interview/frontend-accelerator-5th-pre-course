export const parseDigitsOnly = (value: string) => {
  const NON_DIGIT_REGEX = /[^0-9]/g;

  return value.replace(NON_DIGIT_REGEX, '');
};

export const formatNumberWithCommas = (value: string) => {
  const THOUSANDS_SEPARATOR_REGEX = /\B(?=(\d{3})+(?!\d))/g;

  return value.replace(THOUSANDS_SEPARATOR_REGEX, ',');
};
