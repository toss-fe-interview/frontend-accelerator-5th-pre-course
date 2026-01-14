import { ListRow, colors, Assets } from 'tosslib';
import { SavingsProduct } from '../schemas/savingsProduct';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsProductListProps {
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
  clickable?: boolean;
  changeSelectedProduct?: (newValue: string) => void;
}

export default function SavingsProductList({
  savingsProducts,
  selectedProductId,
  clickable = false,
  changeSelectedProduct,
}: SavingsProductListProps) {
  const handleClick = (productId: string) => {
    if (clickable && changeSelectedProduct) {
      changeSelectedProduct(productId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, productId: string) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      changeSelectedProduct?.(productId);
    }
  };

  return (
    <>
      {savingsProducts.map(product => (
        <div
          key={product.id}
          role={clickable ? 'button' : undefined}
          tabIndex={0}
          aria-selected={clickable ? selectedProductId === product.id : undefined}
          onKeyDown={clickable ? e => handleKeyDown(e, product.id) : undefined}
          onClick={
            clickable
              ? () => {
                  handleClick(product.id);
                }
              : undefined
          }
        >
          <ListRow
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatNumberWithComma(product.minMonthlyAmount)}원 ~ ${formatNumberWithComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          />
        </div>
      ))}
    </>
  );
}
