import { http, isHttpError } from 'tosslib';

type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

export const getSavingsProducts = async () => {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error: unknown) {
    if (isHttpError(error)) {
      throw new Error(`${error.message}`);
    }
  }
};
