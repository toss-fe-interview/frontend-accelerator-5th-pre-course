export const validateAmount = (amount: number) => {
  if (isNaN(amount) || amount <= 0) {
    return false;
  }

  return true;
};
