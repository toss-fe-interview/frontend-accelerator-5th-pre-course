import { formatAmount } from 'shared/lib/formatAmount';

export const formatTextFieldValue = (amount: number): string => (amount > 0 ? formatAmount(amount) : '');
