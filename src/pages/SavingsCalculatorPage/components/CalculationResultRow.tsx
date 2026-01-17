import { colors, ListRow } from 'tosslib';
import { commaizeNumber } from 'utils/commaizeNumber';

interface CalculationResultRowProps {
  label: string;
  amount: number;
}

/**
 * 계산 결과 행
 *
 * 본질: "계산 결과 항목을 레이블과 금액으로 보여준다"
 * - Props와 UI 구조가 1:1 매핑:
 *   - label → 1행 (레이블, grey600)
 *   - amount → 2행 (금액, blue600, bold)
 */
export function CalculationResultRow({ label, amount }: CalculationResultRowProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={`${commaizeNumber(amount)}원`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}
