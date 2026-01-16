import { colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';
import { roundToThousand } from 'utils/roundToThousand';
import type { SavingsProduct } from '../api/schema';
import { useCalculatorParams } from '../hooks/useCalculatorParams';

export default function CalculationSummary({ product }: { product: SavingsProduct }) {
  const { targetAmount, monthlyAmount, savingTerms } = useCalculatorParams();

  if (!savingTerms) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="저축 기간을 선택해주세요." />} />;
  }

  const 예상만기금액 = get_예상만기금액(monthlyAmount ?? 0, savingTerms, product.annualRate);
  const 목표금액과의차이 = get_목표금액과의차이(targetAmount ?? 0, 예상만기금액);
  const 추천월납입금액 = get_추천월납입금액(targetAmount ?? 0, savingTerms, product.annualRate);

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(예상만기금액)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(목표금액과의차이)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(추천월납입금액)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}

const 평균적립기간비율 = 0.5;

const get_예상만기금액 = (월납입액: number, 저축기간: number, 연이자율: number) => {
  return 월납입액 * 저축기간 * (1 + (연이자율 / 100) * 평균적립기간비율);
};

const get_목표금액과의차이 = (목표금액: number, 예상만기금액: number) => {
  return 목표금액 - 예상만기금액;
};

const get_추천월납입금액 = (목표금액: number, 저축기간: number, 연이자율: number) => {
  const value = 목표금액 / (저축기간 * (1 + (연이자율 / 100) * 평균적립기간비율));
  return roundToThousand(value);
};
