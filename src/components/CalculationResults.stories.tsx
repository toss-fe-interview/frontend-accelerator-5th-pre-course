import type { Meta, StoryObj } from '@storybook/react';
import { CalculationResults } from './CalculationResults';

const meta = {
  title: 'Components/CalculationResults',
  component: CalculationResults,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CalculationResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expectedAmount: 1219200,
    difference: -219200,
    recommendedAmount: 82000,
  },
};

export const GoalNotMet: Story = {
  args: {
    expectedAmount: 999744,
    difference: 256,
    recommendedAmount: 82000,
  },
};

export const GoalExceeded: Story = {
  args: {
    expectedAmount: 2500000,
    difference: -1500000,
    recommendedAmount: 100000,
  },
};

export const ZeroValues: Story = {
  args: {
    expectedAmount: 0,
    difference: 0,
    recommendedAmount: 0,
  },
};

export const LargeAmounts: Story = {
  args: {
    expectedAmount: 50000000,
    difference: -10000000,
    recommendedAmount: 2000000,
  },
};