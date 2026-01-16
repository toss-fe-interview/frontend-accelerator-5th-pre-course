export type TabValue = 'products' | 'results';

export interface ProductSelection {
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}
