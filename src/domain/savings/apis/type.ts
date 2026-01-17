export type SavingsProduct = {
  /** 적금 상품 ID */
  id: string;
  /** 적금 상품 이름 */
  name: string;
  /** 연 이자율 */
  annualRate: number;
  /** 최소 납입액 */
  minMonthlyAmount: number;
  /** 최대 납입액 */
  maxMonthlyAmount: number;
  /** 저축 기간 */
  availableTerms: number;
};

export type SavingsProductsFilterParams = {
  monthlySaving?: number;
  savingPeriod?: number;
};
