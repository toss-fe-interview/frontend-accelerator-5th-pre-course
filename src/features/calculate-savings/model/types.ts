interface SavingsGoalFormData {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

interface SavingsGoalFormChangeHandler {
  (data: SavingsGoalFormData): void;
}

export type { SavingsGoalFormData, SavingsGoalFormChangeHandler };
