import { describe, it, expect } from 'vitest';
import { formatNumber, roundToThousand, formatCurrency } from './format';

describe('format utilities', () => {
  describe('formatNumber', () => {
    it('API 응답 데이터: 최소 월 납입액 포맷팅', () => {
      // API 응답에서 실제 나오는 minMonthlyAmount 값들
      expect(formatNumber(10000)).toBe('10,000');
      expect(formatNumber(50000)).toBe('50,000');
      expect(formatNumber(100000)).toBe('100,000');
    });

    it('API 응답 데이터: 최대 월 납입액 포맷팅', () => {
      // API 응답에서 실제 나오는 maxMonthlyAmount 값들
      expect(formatNumber(300000)).toBe('300,000');
      expect(formatNumber(500000)).toBe('500,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('큰 금액 포맷팅', () => {
      expect(formatNumber(10000000)).toBe('10,000,000');
      expect(formatNumber(123456789)).toBe('123,456,789');
    });

    it('작은 금액 포맷팅', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(1000)).toBe('1,000');
    });

    it('음수 포맷팅', () => {
      expect(formatNumber(-10000)).toBe('-10,000');
      expect(formatNumber(-500000)).toBe('-500,000');
    });

    it('소수점이 있는 경우', () => {
      expect(formatNumber(10000.5)).toBe('10,000.5');
      expect(formatNumber(123456.789)).toBe('123,456.789');
    });
  });

  describe('roundToThousand', () => {
    it('1,000원 단위로 반올림 (올림)', () => {
      expect(roundToThousand(10500)).toBe(11000);
      expect(roundToThousand(123600)).toBe(124000);
    });

    it('1,000원 단위로 반올림 (내림)', () => {
      expect(roundToThousand(10499)).toBe(10000);
      expect(roundToThousand(123400)).toBe(123000);
    });

    it('1,000원 단위로 반올림 (정확히 500)', () => {
      expect(roundToThousand(10500)).toBe(11000);
      expect(roundToThousand(11500)).toBe(12000);
    });

    it('이미 1,000원 단위인 경우', () => {
      expect(roundToThousand(10000)).toBe(10000);
      expect(roundToThousand(100000)).toBe(100000);
      expect(roundToThousand(1000000)).toBe(1000000);
    });

    it('명세서 계산 공식 결과 반올림 예시', () => {
      // 목표 금액 1,000,000원, 저축 기간 12개월, 연이자율 3.2%인 경우
      // 월 납입액 = 1000000 ÷ (12 × (1 + 0.032 × 0.5))
      const monthlyAmount = 1000000 / (12 * (1 + 0.032 * 0.5));
      expect(roundToThousand(monthlyAmount)).toBe(82000);
    });

    it('0인 경우', () => {
      expect(roundToThousand(0)).toBe(0);
    });

    it('음수 반올림', () => {
      // Math.round()는 0에 가까운 쪽으로 반올림
      expect(roundToThousand(-10500)).toBe(-10000);
      expect(roundToThousand(-10499)).toBe(-10000);
      expect(roundToThousand(-11500)).toBe(-11000);
    });
  });

  describe('formatCurrency', () => {
    it('API 응답 데이터로 원화 포맷팅', () => {
      expect(formatCurrency(10000)).toBe('10,000원');
      expect(formatCurrency(50000)).toBe('50,000원');
      expect(formatCurrency(100000)).toBe('100,000원');
      expect(formatCurrency(300000)).toBe('300,000원');
      expect(formatCurrency(500000)).toBe('500,000원');
      expect(formatCurrency(1000000)).toBe('1,000,000원');
    });

    it('큰 금액 원화 포맷팅', () => {
      expect(formatCurrency(10000000)).toBe('10,000,000원');
      expect(formatCurrency(123456789)).toBe('123,456,789원');
    });

    it('0원', () => {
      expect(formatCurrency(0)).toBe('0원');
    });

    it('음수 원화 포맷팅 (목표 금액과의 차이)', () => {
      expect(formatCurrency(-500000)).toBe('-500,000원');
    });

    it('예상 수익 금액 계산 예시', () => {
      // 월 납입액 100,000원, 저축 기간 12개월, 연이자율 3.2%
      const expectedAmount = 100000 * 12 * (1 + 0.032 * 0.5);
      expect(formatCurrency(Math.floor(expectedAmount))).toBe('1,219,200원');
    });
  });

  describe('통합 시나리오 테스트', () => {
    it('API 응답 데이터를 화면에 표시할 때의 포맷팅', () => {
      // savings-001: 기본 정기적금
      const product = {
        minMonthlyAmount: 10000,
        maxMonthlyAmount: 500000,
      };

      const displayText = `${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원`;
      expect(displayText).toBe('10,000원 ~ 500,000원');
    });

    it('계산 결과 표시 시나리오', () => {
      const targetAmount = 1000000;
      const monthlyAmount = 82000;
      const savingTerm = 12;
      const annualRate = 0.032;

      // 예상 수익 금액 = 월 납입액 × 저축 기간 × (1 + 연이자율 × 0.5)
      const expectedAmount = monthlyAmount * savingTerm * (1 + annualRate * 0.5);

      // 목표 금액과의 차이
      const difference = targetAmount - expectedAmount;

      // 추천 월 납입 금액 = 목표 금액 ÷ (저축 기간 × (1 + 연이자율 × 0.5))
      const recommendedAmount = targetAmount / (savingTerm * (1 + annualRate * 0.5));

      expect(formatCurrency(Math.floor(expectedAmount))).toBe('999,744원');
      expect(formatCurrency(Math.floor(difference))).toBe('256원');
      expect(formatCurrency(roundToThousand(recommendedAmount))).toBe('82,000원');
    });
  });
});
