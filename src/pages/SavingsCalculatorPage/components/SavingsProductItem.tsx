import { Assets, colors, ListRow } from 'tosslib';

interface SavingsProductItemProps {
  name: string;
  annualRate: number;
  monthlyRange: {
    min: number;
    max: number;
  };
  term: number;
  selected: boolean;
  onSelect: () => void;
}

/**
 * 적금 상품 아이템
 *
 * 본질: "적금 상품의 이름, 연이자율, 월납입 범위, 기간을 행으로 보여주고 선택할 수 있다"
 * - Props와 UI 구조가 1:1 매핑:
 *   - name → 1행 (상품명)
 *   - annualRate → 2행 (연 이자율)
 *   - monthlyRange → 3행 왼쪽 (월납입 범위)
 *   - term → 3행 오른쪽 (기간)
 */
export function SavingsProductItem({ name, annualRate, monthlyRange, term, selected, onSelect }: SavingsProductItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${monthlyRange.min.toLocaleString()}원 ~ ${monthlyRange.max.toLocaleString()}원 | ${term}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onSelect}
    />
  );
}
