import { describe, it, expect } from 'vitest';
import { isAffordableProducts } from './savingProductFilter';
import { SavingProduct } from 'queries/types';

const createMockProduct = (overrides: Partial<SavingProduct> = {}): SavingProduct => ({
  id: '1',
  name: '기본 적금',
  annualRate: 3.5,
  minMonthlyAmount: 100000,
  maxMonthlyAmount: 500000,
  availableTerms: 12,
  ...overrides,
});

describe('isAffordableProducts', () => {
  describe('term 검증', () => {
    it('term이 일치하면 true를 반환한다', () => {
      const product = createMockProduct({ availableTerms: 12 });
      expect(isAffordableProducts(product, 200000, 12)).toBe(true);
    });

    it('term이 일치하지 않으면 false를 반환한다', () => {
      const product = createMockProduct({ availableTerms: 12 });
      expect(isAffordableProducts(product, 200000, 24)).toBe(false);
    });
  });

  describe('monthlyAmount 검증', () => {
    it('monthlyAmount가 undefined이면 term만 검증한다', () => {
      const product = createMockProduct({ availableTerms: 12 });
      expect(isAffordableProducts(product, undefined as any, 12)).toBe(true);
    });

    it('monthlyAmount가 0이면 term만 검증한다', () => {
      const product = createMockProduct({ availableTerms: 12 });
      expect(isAffordableProducts(product, 0, 12)).toBe(true);
    });

    it('monthlyAmount가 최소값과 같으면 true를 반환한다', () => {
      const product = createMockProduct({ minMonthlyAmount: 100000, maxMonthlyAmount: 500000, availableTerms: 12 });
      expect(isAffordableProducts(product, 100000, 12)).toBe(true);
    });

    it('monthlyAmount가 최대값과 같으면 true를 반환한다', () => {
      const product = createMockProduct({ minMonthlyAmount: 100000, maxMonthlyAmount: 500000, availableTerms: 12 });
      expect(isAffordableProducts(product, 500000, 12)).toBe(true);
    });

    it('monthlyAmount가 범위 내에 있으면 true를 반환한다', () => {
      const product = createMockProduct({ minMonthlyAmount: 100000, maxMonthlyAmount: 500000, availableTerms: 12 });
      expect(isAffordableProducts(product, 300000, 12)).toBe(true);
    });

    it('monthlyAmount가 최소값보다 작으면 false를 반환한다', () => {
      const product = createMockProduct({ minMonthlyAmount: 100000, maxMonthlyAmount: 500000, availableTerms: 12 });
      expect(isAffordableProducts(product, 50000, 12)).toBe(false);
    });

    it('monthlyAmount가 최대값보다 크면 false를 반환한다', () => {
      const product = createMockProduct({ minMonthlyAmount: 100000, maxMonthlyAmount: 500000, availableTerms: 12 });
      expect(isAffordableProducts(product, 600000, 12)).toBe(false);
    });
  });

  describe('통합 테스트', () => {
    it('term이 일치하고 monthlyAmount가 범위 내면 true를 반환한다', () => {
      const product = createMockProduct({
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 12,
      });
      expect(isAffordableProducts(product, 300000, 12)).toBe(true);
    });

    it('term이 일치하지만 monthlyAmount가 범위를 벗어나면 false를 반환한다', () => {
      const product = createMockProduct({
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 12,
      });
      expect(isAffordableProducts(product, 600000, 12)).toBe(false);
    });

    it('monthlyAmount는 범위 내지만 term이 일치하지 않으면 false를 반환한다', () => {
      const product = createMockProduct({
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 12,
      });
      expect(isAffordableProducts(product, 300000, 24)).toBe(false);
    });

    it('term도 일치하지 않고 monthlyAmount도 범위를 벗어나면 false를 반환한다', () => {
      const product = createMockProduct({
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 12,
      });
      expect(isAffordableProducts(product, 600000, 24)).toBe(false);
    });
  });

  describe('실제 사용 시나리오', () => {
    const products: SavingProduct[] = [
      createMockProduct({
        id: '1',
        name: '기본 적금',
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 12,
      }),
      createMockProduct({
        id: '2',
        name: '프리미엄 적금',
        minMonthlyAmount: 300000,
        maxMonthlyAmount: 1000000,
        availableTerms: 12,
      }),
      createMockProduct({
        id: '3',
        name: '장기 적금',
        minMonthlyAmount: 100000,
        maxMonthlyAmount: 500000,
        availableTerms: 24,
      }),
    ];

    it('12개월, 200000원 조건으로 필터링하면 기본 적금만 선택된다', () => {
      const filtered = products.filter(p => isAffordableProducts(p, 200000, 12));
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });

    it('12개월, 400000원 조건으로 필터링하면 기본 적금과 프리미엄 적금이 선택된다', () => {
      const filtered = products.filter(p => isAffordableProducts(p, 400000, 12));
      expect(filtered).toHaveLength(2);
      expect(filtered.map(p => p.id)).toEqual(['1', '2']);
    });

    it('24개월, 300000원 조건으로 필터링하면 장기 적금만 선택된다', () => {
      const filtered = products.filter(p => isAffordableProducts(p, 300000, 24));
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('3');
    });

    it('12개월, monthlyAmount 없이 필터링하면 12개월 상품 모두 선택된다', () => {
      const filtered = products.filter(p => isAffordableProducts(p, undefined as any, 12));
      expect(filtered).toHaveLength(2);
      expect(filtered.map(p => p.id)).toEqual(['1', '2']);
    });
  });
});
