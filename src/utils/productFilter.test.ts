import { describe, it, expect } from 'vitest';
import { filterProducts } from './productFilter';
import type { SavingsProduct } from '../types/savings';

// API 응답 데이터를 기반으로 한 테스트 데이터
const mockProducts: SavingsProduct[] = [
  {
    id: 'savings-001',
    name: '기본 정기적금',
    annualRate: 3.2,
    minMonthlyAmount: 10000,
    maxMonthlyAmount: 500000,
    availableTerms: 12,
  },
  {
    id: 'savings-002',
    name: '자유적금 플러스',
    annualRate: 2.8,
    minMonthlyAmount: 50000,
    maxMonthlyAmount: 1000000,
    availableTerms: 24,
  },
  {
    id: 'savings-003',
    name: '청년 희망적금',
    annualRate: 3.5,
    minMonthlyAmount: 10000,
    maxMonthlyAmount: 300000,
    availableTerms: 12,
  },
  {
    id: 'savings-004',
    name: '스타 정기적금',
    annualRate: 3.1,
    minMonthlyAmount: 10000,
    maxMonthlyAmount: 500000,
    availableTerms: 24,
  },
  {
    id: 'savings-010',
    name: '원큐 정기적금',
    annualRate: 3.3,
    minMonthlyAmount: 50000,
    maxMonthlyAmount: 1000000,
    availableTerms: 6,
  },
];

describe('filterProducts', () => {
  describe('월 납입액 필터링', () => {
    it('월 납입액 100,000원 - 해당 범위의 상품만 반환', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 100000 });

      // minMonthlyAmount <= 100000 <= maxMonthlyAmount인 상품들
      expect(result).toHaveLength(5);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 100000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 100000 <= 1000000
      expect(result.map(p => p.id)).toContain('savings-003'); // 10000 <= 100000 <= 300000
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 100000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-010'); // 50000 <= 100000 <= 1000000
    });

    it('월 납입액 50,000원 - 최소 금액 경계값 테스트 (등호 포함)', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 50000 });

      // minMonthlyAmount <= 50000인 상품들 (등호 포함)
      expect(result).toHaveLength(5);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 50000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 50000 <= 1000000
      expect(result.map(p => p.id)).toContain('savings-003'); // 10000 <= 50000 <= 300000
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 50000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-010'); // 50000 <= 50000 <= 1000000
    });

    it('월 납입액 500,000원 - 최대 금액 경계값 테스트 (등호 포함)', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 500000 });

      // maxMonthlyAmount >= 500000인 상품들 (등호 포함)
      expect(result).toHaveLength(4);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 500000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 500000 <= 1000000
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 500000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-010'); // 50000 <= 500000 <= 1000000
    });

    it('월 납입액 200,000원 - 일반적인 입력값', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 200000 });

      expect(result).toHaveLength(5);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 200000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 200000 <= 1000000
      expect(result.map(p => p.id)).toContain('savings-003'); // 10000 <= 200000 <= 300000
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 200000 <= 500000
      expect(result.map(p => p.id)).toContain('savings-010'); // 50000 <= 200000 <= 1000000
    });

    it('월 납입액 0원 - 필터링하지 않음', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 0 });

      expect(result).toHaveLength(mockProducts.length);
    });

    it('월 납입액이 매우 높을 때 - 빈 배열 반환', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 2000000 });

      expect(result).toHaveLength(0);
    });

    it('월 납입액이 매우 낮을 때 - 빈 배열 반환', () => {
      const result = filterProducts(mockProducts, { monthlyAmount: 5000 });

      expect(result).toHaveLength(0);
    });
  });

  describe('저축 기간 필터링', () => {
    it('저축 기간 12개월 - 해당 기간의 상품만 반환', () => {
      const result = filterProducts(mockProducts, { savingTerm: 12 });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-001');
      expect(result.map(p => p.id)).toContain('savings-003');
    });

    it('저축 기간 24개월 - 해당 기간의 상품만 반환', () => {
      const result = filterProducts(mockProducts, { savingTerm: 24 });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-002');
      expect(result.map(p => p.id)).toContain('savings-004');
    });

    it('저축 기간 6개월 - 해당 기간의 상품만 반환', () => {
      const result = filterProducts(mockProducts, { savingTerm: 6 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('savings-010');
    });

    it('저축 기간 18개월 - 해당 기간의 상품 없음', () => {
      const result = filterProducts(mockProducts, { savingTerm: 18 });

      expect(result).toHaveLength(0);
    });
  });

  describe('복합 필터링 (월 납입액 + 저축 기간)', () => {
    it('월 납입액 100,000원 + 저축 기간 12개월', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: 100000,
        savingTerm: 12,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 100000 <= 500000, 12개월
      expect(result.map(p => p.id)).toContain('savings-003'); // 10000 <= 100000 <= 300000, 12개월
    });

    it('월 납입액 100,000원 + 저축 기간 24개월', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: 100000,
        savingTerm: 24,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 100000 <= 1000000, 24개월
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 100000 <= 500000, 24개월
    });

    it('월 납입액 200,000원 + 저축 기간 12개월', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: 200000,
        savingTerm: 12,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-001'); // 10000 <= 200000 <= 500000, 12개월
      expect(result.map(p => p.id)).toContain('savings-003'); // 10000 <= 200000 <= 300000, 12개월
    });

    it('월 납입액 300,000원 + 저축 기간 24개월', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: 300000,
        savingTerm: 24,
      });

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('savings-002'); // 50000 <= 300000 <= 1000000, 24개월
      expect(result.map(p => p.id)).toContain('savings-004'); // 10000 <= 300000 <= 500000, 24개월
    });

    it('조건을 만족하는 상품이 없는 경우', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: 2000000,
        savingTerm: 12,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('필터링 조건 없음', () => {
    it('빈 조건 객체 - 모든 상품 반환', () => {
      const result = filterProducts(mockProducts, {});

      expect(result).toHaveLength(mockProducts.length);
    });

    it('undefined 조건 - 모든 상품 반환', () => {
      const result = filterProducts(mockProducts, {
        monthlyAmount: undefined,
        savingTerm: undefined,
      });

      expect(result).toHaveLength(mockProducts.length);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 상품 목록', () => {
      const result = filterProducts([], { monthlyAmount: 100000 });

      expect(result).toHaveLength(0);
    });

    it('원본 배열을 수정하지 않음 (불변성)', () => {
      const originalLength = mockProducts.length;
      const originalFirstId = mockProducts[0].id;

      filterProducts(mockProducts, { monthlyAmount: 100000 });

      expect(mockProducts).toHaveLength(originalLength);
      expect(mockProducts[0].id).toBe(originalFirstId);
    });
  });
});
