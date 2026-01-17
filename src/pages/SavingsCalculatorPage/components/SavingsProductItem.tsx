import { Assets, colors, ListRow } from 'tosslib';
import { commaizeNumber } from 'utils/commaizeNumber';
import { SavingsProduct, SavingsTerm } from '../domain/types';

interface SavingsProductItemProps {
  name: SavingsProduct['name'];
  annualRate: SavingsProduct['annualRate'];
  monthlyRange: {
    min: SavingsProduct['minMonthlyAmount'];
    max: SavingsProduct['maxMonthlyAmount'];
  };
  term: SavingsTerm;
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
          bottom={`${commaizeNumber(monthlyRange.min)}원 ~ ${commaizeNumber(monthlyRange.max)}원 | ${term}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onSelect}
    />
  );
}
