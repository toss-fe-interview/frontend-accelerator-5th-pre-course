import { Assets, colors, ListRow } from 'tosslib';
import { formatNumber } from 'utils/format';
import type { SavingsProduct } from '../api/api';
import { useCalculatorParams } from '../hooks/useCalculatorParams';
import { useSelectProductParams } from '../hooks/useSelectProductParams';

export default function ProductList({ products }: { products?: SavingsProduct[] }) {
  const { monthlyAmount, savingTerms } = useCalculatorParams();
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();

  const filteredProducts = products?.filter(matchesPaymentRange(monthlyAmount)).filter(matchesPeriod(savingTerms));

  if (filteredProducts?.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
  }

  return (
    <div>
      {filteredProducts?.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onProductSelect={() => setSelectedProductId(product.id)}
        />
      ))}
    </div>
  );
}

function ProductItem({
  product,
  right,
  onProductSelect,
}: {
  product: SavingsProduct;
  right: React.ReactNode;
  onProductSelect: () => void;
}) {
  return (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={right}
      onClick={onProductSelect}
    />
  );
}

const matchesPaymentRange = (amount: number | null) => (product: SavingsProduct) => {
  return amount == null || (product.minMonthlyAmount <= amount && product.maxMonthlyAmount >= amount);
};

const matchesPeriod = (period: number | null) => (product: SavingsProduct) => {
  return period == null || product.availableTerms === period;
};
