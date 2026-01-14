import { useState } from 'react';
import { SavingsFormData } from 'types/savings';
import { formatNumberInput, parseFormattedNumber } from 'utils/numberUtils';

interface NumericFormValues {
  targetAmount: number;
  monthlyAmount: number;
  savingPeriod: number;
}

export const useSavingsForm = () => {
  const [formData, setFormData] = useState<SavingsFormData>({
    targetAmount: '',
    monthlyAmount: '',
    savingPeriod: 12,
  });

  const handleChangeInput = <K extends keyof SavingsFormData>(field: K, value: SavingsFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: 'targetAmount' | 'monthlyAmount', value: string) => {
    const formatted = formatNumberInput(value);
    handleChangeInput(field, formatted);
  };

  const getNumericValues = (): NumericFormValues => ({
    targetAmount: parseFormattedNumber(formData.targetAmount),
    monthlyAmount: parseFormattedNumber(formData.monthlyAmount),
    savingPeriod: formData.savingPeriod,
  });

  return {
    formData,
    handleChangeInput,
    handleNumberInput,
    getNumericValues,
  };
};
