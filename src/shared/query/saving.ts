import SavingsApi from 'shared/api/savings';

const SavingsQuery = {
  getSavingsProducts: () => ({
    queryKey: ['savings-products'],
    queryFn: () => SavingsApi.getSavingsProducts(),
  }),
};

export default SavingsQuery;
