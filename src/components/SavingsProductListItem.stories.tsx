import type { Meta, StoryObj } from '@storybook/react';
import { SavingsProductListItem } from './SavingsProductListItem';
import type { SavingsProduct } from '../types/savings';

const meta = {
  title: 'Components/SavingsProductListItem',
  component: SavingsProductListItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SavingsProductListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProduct: SavingsProduct = {
  id: 'savings-001',
  name: '기본 정기적금',
  annualRate: 3.2,
  minMonthlyAmount: 10000,
  maxMonthlyAmount: 500000,
  availableTerms: 12,
};

const highRateProduct: SavingsProduct = {
  id: 'savings-002',
  name: '청년 희망적금',
  annualRate: 3.5,
  minMonthlyAmount: 10000,
  maxMonthlyAmount: 300000,
  availableTerms: 12,
};

export const Default: Story = {
  args: {
    product: mockProduct,
    isSelected: false,
    onSelect: (id: string) => console.log('Selected:', id),
  },
};

export const Selected: Story = {
  args: {
    product: mockProduct,
    isSelected: true,
    onSelect: (id: string) => console.log('Selected:', id),
  },
};

export const HighRate: Story = {
  args: {
    product: highRateProduct,
    isSelected: false,
    onSelect: (id: string) => console.log('Selected:', id),
  },
};

export const HighRateSelected: Story = {
  args: {
    product: highRateProduct,
    isSelected: true,
    onSelect: (id: string) => console.log('Selected:', id),
  },
};