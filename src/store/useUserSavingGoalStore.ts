import { create } from 'zustand';

interface UserSavingGoal {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

interface UserSavingGoalStore {
  userSavingGoal: UserSavingGoal;
  setUserSavingGoal: (userSavingGoal: UserSavingGoal) => void;
}

export const useUserSavingGoalStore = create<UserSavingGoalStore>(set => ({
  userSavingGoal: {
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  },
  setUserSavingGoal: (userSavingGoal: UserSavingGoal) => set({ userSavingGoal }),
}));
