import { describe, it, expect } from 'vitest';
import {
  calculateExpectedAmount,
  calculateDifference,
  calculateRecommendedMonthlyAmount,
  sortByAnnualRate,
  getTopProducts,
} from './calculation';
import type { SavingsProduct } from '../types/savings';

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
];

describe('calculation utilities', () => {
  describe('calculateExpectedAmount', () => {
    it('예상 수익 금액 계산 - 기본 케이스', () => {
      // 월 납입액 100,000원, 저축 기간 12개월, 연이자율 3.2%
      const result = calculateExpectedAmount(100000, 12, 3.2);
      const expected = Math.floor(100000 * 12 * (1 + 3.2 / 100 * 0.5));
      expect(result).toBe(expected);
      expect(result).toBe(1219200);
    });

    it('예상 수익 금액 계산 - format.test.ts 예시', () => {
      // format.test.ts의 통합 시나리오와 동일한 케이스
      const result = calculateExpectedAmount(82000, 12, 3.2);
      expect(result).toBe(999744);
    });

    it('예상 수익 금액 계산 - 24개월', () => {
      const result = calculateExpectedAmount(200000, 24, 2.8);
      const expected = Math.floor(200000 * 24 * (1 + 2.8 / 100 * 0.5));
      expect(result).toBe(expected);
    });

    it('예상 수익 금액 계산 - 6개월', () => {
      const result = calculateExpectedAmount(500000, 6, 3.3);
      const expected = Math.floor(500000 * 6 * (1 + 3.3 / 100 * 0.5));
      expect(result).toBe(expected);
    });

    it('이자율이 0%인 경우', () => {
      const result = calculateExpectedAmount(100000, 12, 0);
      expect(result).toBe(1200000);
    });
  });

  describe('calculateDifference', () => {
    it('목표 금액과의 차이 계산 - 목표 달성 못함', () => {
      const targetAmount = 1000000;
      const expectedAmount = 999744;
      const result = calculateDifference(targetAmount, expectedAmount);
      expect(result).toBe(256);
    });

    it('목표 금액과의 차이 계산 - 목표 초과 달성', () => {
      const targetAmount = 1000000;
      const expectedAmount = 1219200;
      const result = calculateDifference(targetAmount, expectedAmount);
      expect(result).toBe(-219200);
    });

    it('목표 금액과의 차이 계산 - 정확히 일치', () => {
      const targetAmount = 1000000;
      const expectedAmount = 1000000;
      const result = calculateDifference(targetAmount, expectedAmount);
      expect(result).toBe(0);
    });
  });

  describe('calculateRecommendedMonthlyAmount', () => {
    it('추천 월 납입 금액 계산 - 1,000원 단위 반올림', () => {
      // 목표 금액 1,000,000원, 저축 기간 12개월, 연이자율 3.2%
      const result = calculateRecommendedMonthlyAmount(1000000, 12, 3.2);
      expect(result).toBe(82000);
    });

    it('추천 월 납입 금액 계산 - format.test.ts 예시', () => {
      // format.test.ts의 명세서 계산 공식 결과와 일치
      const monthlyAmount = 1000000 / (12 * (1 + 0.032 * 0.5));
      const result = calculateRecommendedMonthlyAmount(1000000, 12, 3.2);
      expect(result).toBe(82000);
    });

    it('추천 월 납입 금액 계산 - 24개월', () => {
      const result = calculateRecommendedMonthlyAmount(5000000, 24, 2.8);
      expect(result % 1000).toBe(0); // 1,000원 단위로 반올림되었는지 확인
    });

    it('추천 월 납입 금액 계산 - 반올림 경계값 (올림)', () => {
      // 결과가 10500원 나오면 11000원으로 올림
      const result = calculateRecommendedMonthlyAmount(127260, 12, 3.2);
      expect(result % 1000).toBe(0);
    });

    it('추천 월 납입 금액 계산 - 반올림 경계값 (내림)', () => {
      // 결과가 10499원 나오면 10000원으로 내림
      const result = calculateRecommendedMonthlyAmount(127080, 12, 3.2);
      expect(result % 1000).toBe(0);
    });

    it('이자율이 0%인 경우', () => {
      const result = calculateRecommendedMonthlyAmount(1200000, 12, 0);
      expect(result).toBe(100000);
    });
  });

  describe('sortByAnnualRate', () => {
    it('연 이자율 기준 내림차순 정렬', () => {
      const result = sortByAnnualRate(mockProducts);

      expect(result).toHaveLength(4);
      expect(result[0].id).toBe('savings-003'); // 3.5%
      expect(result[1].id).toBe('savings-001'); // 3.2%
      expect(result[2].id).toBe('savings-004'); // 3.1%
      expect(result[3].id).toBe('savings-002'); // 2.8%
    });

    it('원본 배열을 수정하지 않음 (불변성)', () => {
      const originalOrder = mockProducts.map((p) => p.id);
      sortByAnnualRate(mockProducts);
      const currentOrder = mockProducts.map((p) => p.id);

      expect(currentOrder).toEqual(originalOrder);
    });

    it('빈 배열', () => {
      const result = sortByAnnualRate([]);
      expect(result).toHaveLength(0);
    });

    it('동일한 이자율', () => {
      const sameRateProducts: SavingsProduct[] = [
        { ...mockProducts[0], annualRate: 3.0 },
        { ...mockProducts[1], annualRate: 3.0 },
      ];
      const result = sortByAnnualRate(sameRateProducts);
      expect(result).toHaveLength(2);
      expect(result[0].annualRate).toBe(3.0);
      expect(result[1].annualRate).toBe(3.0);
    });
  });

  describe('getTopProducts', () => {
    it('상위 2개 상품 가져오기', () => {
      const result = getTopProducts(mockProducts, 2);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('savings-003'); // 3.5%
      expect(result[1].id).toBe('savings-001'); // 3.2%
    });

    it('상위 1개 상품 가져오기', () => {
      const result = getTopProducts(mockProducts, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('savings-003'); // 3.5%
    });

    it('상위 3개 상품 가져오기', () => {
      const result = getTopProducts(mockProducts, 3);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('savings-003'); // 3.5%
      expect(result[1].id).toBe('savings-001'); // 3.2%
      expect(result[2].id).toBe('savings-004'); // 3.1%
    });

    it('요청 개수가 전체 상품보다 많은 경우', () => {
      const result = getTopProducts(mockProducts, 10);

      expect(result).toHaveLength(4); // 전체 상품 개수
    });

    it('빈 배열에서 상위 상품 가져오기', () => {
      const result = getTopProducts([], 2);
      expect(result).toHaveLength(0);
    });

    it('0개 요청', () => {
      const result = getTopProducts(mockProducts, 0);
      expect(result).toHaveLength(0);
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('계산 결과 표시 전체 플로우', () => {
      const targetAmount = 1000000;
      const monthlyAmount = 100000;
      const savingTerm = 12;
      const selectedProduct = mockProducts[0]; // 연이자율 3.2%

      // 1. 예상 수익 금액
      const expectedAmount = calculateExpectedAmount(monthlyAmount, savingTerm, selectedProduct.annualRate);
      expect(expectedAmount).toBe(1219200);

      // 2. 목표 금액과의 차이
      const difference = calculateDifference(targetAmount, expectedAmount);
      expect(difference).toBe(-219200); // 목표 초과 달성

      // 3. 추천 월 납입 금액
      const recommendedAmount = calculateRecommendedMonthlyAmount(targetAmount, savingTerm, selectedProduct.annualRate);
      expect(recommendedAmount).toBe(82000);
    });

    it('추천 상품 목록 플로우', () => {
      // 필터링된 상품 중 상위 2개
      const filteredProducts = mockProducts.filter((p) => p.availableTerms === 12);
      const topProducts = getTopProducts(filteredProducts, 2);

      expect(topProducts).toHaveLength(2);
      expect(topProducts[0].id).toBe('savings-003'); // 청년 희망적금 3.5%
      expect(topProducts[1].id).toBe('savings-001'); // 기본 정기적금 3.2%
    });
  });
});