export const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

export const DEFAULT_TERM_MONTHS = 12;

export const RECOMMENDED_PRODUCTS_COUNT = 2;

export type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];
