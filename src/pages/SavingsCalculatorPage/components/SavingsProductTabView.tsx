import { Assets, colors, ListRow, Tab } from 'tosslib';
import { SavingsProduct } from '../types/types';
import { formatCurrency } from '../lib/formatCurrency';

export function SavingsProductTabView({ savingsProducts }: { savingsProducts: SavingsProduct[] }) {
  return (
    <>
      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={true}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={false}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatCurrency(product.minMonthlyAmount)} ~ ${formatCurrency(product.maxMonthlyAmount)} | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={<Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {}}
        />
      ))}
    </>
  );
}
