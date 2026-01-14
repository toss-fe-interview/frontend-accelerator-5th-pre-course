import { formatAmount } from 'utils/formatAmount';

export const formatTextFieldValue = (amount: number): string => (amount > 0 ? formatAmount(amount) : '');
