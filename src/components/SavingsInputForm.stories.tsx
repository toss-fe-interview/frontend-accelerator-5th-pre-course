import type { Meta, StoryObj } from '@storybook/react';
import { SavingsInputForm } from './SavingsInputForm';

const meta = {
  title: 'Components/SavingsInputForm',
  component: SavingsInputForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SavingsInputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    targetAmount: 0,
    monthlyAmount: 0,
    savingTerm: 12,
    onTargetAmountChange: (value: string) => console.log('Target Amount:', value),
    onMonthlyAmountChange: (value: string) => console.log('Monthly Amount:', value),
    onSavingTermChange: (value: number) => console.log('Saving Term:', value),
  },
};

export const WithValues: Story = {
  args: {
    targetAmount: 1000000,
    monthlyAmount: 100000,
    savingTerm: 12,
    onTargetAmountChange: (value: string) => console.log('Target Amount:', value),
    onMonthlyAmountChange: (value: string) => console.log('Monthly Amount:', value),
    onSavingTermChange: (value: number) => console.log('Saving Term:', value),
  },
};

export const LargeAmount: Story = {
  args: {
    targetAmount: 50000000,
    monthlyAmount: 2000000,
    savingTerm: 24,
    onTargetAmountChange: (value: string) => console.log('Target Amount:', value),
    onMonthlyAmountChange: (value: string) => console.log('Monthly Amount:', value),
    onSavingTermChange: (value: number) => console.log('Saving Term:', value),
  },
};