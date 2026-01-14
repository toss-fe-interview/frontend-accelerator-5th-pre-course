import { SavingsProduct } from 'types/savingsProducts';
import { create } from 'zustand';

type SelectedProductStore = {
  selectedProduct: SavingsProduct | null;
  setSelectedProduct: (product: SavingsProduct | null) => void;
};

export const useSelectedProductStore = create<SelectedProductStore>(set => ({
  selectedProduct: null,
  setSelectedProduct: (product: SavingsProduct | null) => set({ selectedProduct: product }),
}));
