import { describe, it, expect } from 'vitest';
import { calculateExpectedIncome, calculateTargetDiff, calculateRecommendedMonthlyPayment } from './savingCalculator';

describe('savingCalculator', () => {
  describe('calculateExpectedIncome', () => {
    it('월 납입액, 저축 기간, 연 이자율로 예상 수익 금액을 계산한다', () => {
      // 월 10만원, 12개월, 연 3.5%
      const result = calculateExpectedIncome(100000, 12, 3.5);
      // 100,000 * 12 * (1 + 3.5 * 0.01 * 0.5)
      // = 1,200,000 * 1.0175
      // = 1,221,000
      expect(result).toBe(1221000);
    });

    it('이자율이 0%일 때는 원금만 반환한다', () => {
      const result = calculateExpectedIncome(100000, 12, 0);
      expect(result).toBe(1200000);
    });

    it('월 납입액이 0원일 때는 0을 반환한다', () => {
      const result = calculateExpectedIncome(0, 12, 3.5);
      expect(result).toBe(0);
    });

    it('저축 기간이 0개월일 때는 0을 반환한다', () => {
      const result = calculateExpectedIncome(100000, 0, 3.5);
      expect(result).toBe(0);
    });

    it('다양한 이자율에 대해 정확히 계산한다', () => {
      // 월 50만원, 24개월, 연 4.5%
      const result = calculateExpectedIncome(500000, 24, 4.5);
      // 500,000 * 24 * (1 + 4.5 * 0.01 * 0.5)
      // = 12,000,000 * 1.0225
      // = 12,270,000
      expect(result).toBe(12270000);
    });

    it('소수점이 있는 결과도 정확히 계산한다', () => {
      // 월 15만원, 6개월, 연 2.8%
      const result = calculateExpectedIncome(150000, 6, 2.8);
      // 150,000 * 6 * (1 + 2.8 * 0.01 * 0.5)
      // = 900,000 * 1.014
      // = 912,600
      expect(result).toBe(912600);
    });
  });

  describe('calculateTargetDiff', () => {
    it('목표 금액에서 예상 수익 금액을 뺀 차이를 계산한다', () => {
      const result = calculateTargetDiff(1500000, 1221000);
      expect(result).toBe(279000);
    });

    it('예상 수익이 목표보다 많을 때 음수를 반환한다', () => {
      const result = calculateTargetDiff(1000000, 1221000);
      expect(result).toBe(-221000);
    });

    it('목표와 예상 수익이 같을 때 0을 반환한다', () => {
      const result = calculateTargetDiff(1221000, 1221000);
      expect(result).toBe(0);
    });

    it('목표 금액이 0일 때 음수 예상 수익을 반환한다', () => {
      const result = calculateTargetDiff(0, 1221000);
      expect(result).toBe(-1221000);
    });
  });

  describe('calculateRecommendedMonthlyPayment', () => {
    it('목표 금액 달성을 위한 추천 월 납입 금액을 계산한다', () => {
      // 목표 1,200만원, 12개월, 연 3.5%
      const result = calculateRecommendedMonthlyPayment(12000000, 12, 3.5);
      // 12,000,000 / (12 * 1.0175)
      // = 12,000,000 / 12.21
      // ≈ 982,800
      // 1000원 단위 반올림 = 983,000
      expect(result).toBe(983000);
    });

    it('1000원 단위로 반올림한다', () => {
      // 목표 1,000만원, 12개월, 연 3.5%
      const result = calculateRecommendedMonthlyPayment(10000000, 12, 3.5);
      // 10,000,000 / 12.21
      // ≈ 819,000
      expect(result).toBe(819000);
    });

    it('반올림 경계값: 500원 이상은 올림', () => {
      // 결과가 xxx,500 이상일 때
      const result = calculateRecommendedMonthlyPayment(10005000, 12, 3.5);
      // ≈ 819,409 → 819,000
      expect(result).toBe(819000);
    });

    it('반올림 경계값: 500원 미만은 내림', () => {
      // 결과가 xxx,499 이하일 때
      const result = calculateRecommendedMonthlyPayment(9995000, 12, 3.5);
      // ≈ 818,590 → 819,000
      expect(result).toBe(819000);
    });

    it('이자율이 0%일 때 정확히 계산한다', () => {
      // 목표 1,200만원, 12개월, 연 0%
      const result = calculateRecommendedMonthlyPayment(12000000, 12, 0);
      // 12,000,000 / 12 = 1,000,000
      expect(result).toBe(1000000);
    });

    it('장기 저축 기간에 대해 정확히 계산한다', () => {
      // 목표 2,400만원, 24개월, 연 4.5%
      const result = calculateRecommendedMonthlyPayment(24000000, 24, 4.5);
      // 24,000,000 / (24 * 1.0225)
      // = 24,000,000 / 24.54
      // ≈ 978,000
      expect(result).toBe(978000);
    });

    it('작은 목표 금액에 대해서도 동작한다', () => {
      // 목표 60만원, 6개월, 연 3.0%
      const result = calculateRecommendedMonthlyPayment(600000, 6, 3.0);
      // 600,000 / (6 * 1.015)
      // = 600,000 / 6.09
      // ≈ 98,522 → 99,000
      expect(result).toBe(99000);
    });
  });

  describe('통합 시나리오', () => {
    it('시나리오 1: 목표 금액 달성 가능', () => {
      const monthlyAmount = 100000;
      const targetAmount = 1200000;
      const term = 12;
      const annualRate = 3.5;

      const expectedIncome = calculateExpectedIncome(monthlyAmount, term, annualRate);
      expect(expectedIncome).toBe(1221000);

      const targetDiff = calculateTargetDiff(targetAmount, expectedIncome);
      expect(targetDiff).toBe(-21000); // 목표 초과

      const recommended = calculateRecommendedMonthlyPayment(targetAmount, term, annualRate);
      // 1,200,000 / (12 * 1.0175) ≈ 98,280 → 98,000
      expect(recommended).toBe(98000);
    });

    it('시나리오 2: 목표 금액 미달', () => {
      const monthlyAmount = 50000;
      const targetAmount = 1000000;
      const term = 12;
      const annualRate = 3.5;

      const expectedIncome = calculateExpectedIncome(monthlyAmount, term, annualRate);
      expect(expectedIncome).toBe(610500);

      const targetDiff = calculateTargetDiff(targetAmount, expectedIncome);
      expect(targetDiff).toBe(389500); // 목표 미달

      const recommended = calculateRecommendedMonthlyPayment(targetAmount, term, annualRate);
      // 1,000,000 / (12 * 1.0175) ≈ 81,900 → 82,000
      expect(recommended).toBe(82000);
    });

    it('시나리오 3: 장기 저축', () => {
      const monthlyAmount = 500000;
      const targetAmount = 12000000;
      const term = 24;
      const annualRate = 4.5;

      const expectedIncome = calculateExpectedIncome(monthlyAmount, term, annualRate);
      expect(expectedIncome).toBe(12270000);

      const targetDiff = calculateTargetDiff(targetAmount, expectedIncome);
      expect(targetDiff).toBe(-270000); // 목표 초과

      const recommended = calculateRecommendedMonthlyPayment(targetAmount, term, annualRate);
      expect(recommended).toBe(489000);
    });
  });
});
