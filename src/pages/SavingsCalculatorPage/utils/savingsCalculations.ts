export const calculateExpectedAmount = ({
  월납입액,
  저축기간,
  연이자율,
}: {
  월납입액: string;
  저축기간: number;
  연이자율: number;
}): number => {
  // 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
  return Number(월납입액) * 저축기간 * (1 + 연이자율 * 0.5);
};

export const calculateDifference = ({
  목표금액,
  월납입액,
  저축기간,
  연이자율,
}: {
  목표금액: string;
  월납입액: string;
  저축기간: number;
  연이자율: number;
}): number => {
  // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
  const 예상수익금액 = calculateExpectedAmount({ 월납입액, 저축기간, 연이자율 });
  return Number(목표금액) - 예상수익금액;
};

export const calculateRecommendedMonthlyAmount = ({
  목표금액,
  저축기간,
  연이자율,
}: {
  목표금액: string;
  저축기간: number;
  연이자율: number;
}): number => {
  // 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
  const 추천월납입액 = (Number(목표금액) / 저축기간) * (1 + (연이자율 / 100) * 0.5);

  // 1,000원 단위로 반올림
  return Math.round(추천월납입액 / 1000) * 1000;
};
