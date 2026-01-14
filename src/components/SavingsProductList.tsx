import type { SavingsProduct } from 'api/savings-products';
import { Assets, colors, ListRow } from 'tosslib';
import { addComma } from 'utils/add-comma';

interface SavingsProductListProps {
  savingsProducts: SavingsProduct[];
  selectedSavingsProductId: string | undefined;
  onSelectedSavingsProductChange: (product: SavingsProduct | undefined) => void;
}

export const SavingsProductList = ({
  savingsProducts,
  selectedSavingsProductId,
  onSelectedSavingsProductChange,
}: SavingsProductListProps) => {
  /**
   * 적금 상품 선택
   */
  const handleSelectedSavingsProductChange = (product: SavingsProduct) => {
    if (selectedSavingsProductId === product.id) {
      onSelectedSavingsProductChange(undefined);
    } else {
      onSelectedSavingsProductChange(product);
    }
  };

  // 적금 상품이 없을 경우
  if (savingsProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 상품이 없습니다." />} />;
  }

  return (
    <>
      {savingsProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={'기본 정기적금'}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${addComma(product.minMonthlyAmount)}원 ~ ${addComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedSavingsProductId === product.id && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => handleSelectedSavingsProductChange(product)}
        />
      ))}
    </>
  );
};
