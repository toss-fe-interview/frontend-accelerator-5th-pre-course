export const extractNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};

export const formatNumberWithCommas = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
