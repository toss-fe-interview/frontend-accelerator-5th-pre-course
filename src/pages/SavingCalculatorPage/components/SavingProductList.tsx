import { SavingProduct } from 'models/SavingProduct';
import { Assets, colors, ListRow } from 'tosslib';
import { priceFormatterToLocaleString } from 'utils/priceFormatter';

export const SavingProductList = ({
  savingsProducts,
  selectedSavingProduct,
  selectSavingProduct,
}: {
  savingsProducts: SavingProduct[];
  selectedSavingProduct: SavingProduct | null;
  selectSavingProduct: (product: SavingProduct) => void;
}) => {
  if (savingsProducts.length === 0) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="더 많은 상품을 준비 중이에요!" />} />;
  }

  return (
    <div>
      {savingsProducts?.map(product => {
        const isSelected = selectedSavingProduct?.id === product.id;
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
                bottom={`${priceFormatterToLocaleString(product.minMonthlyAmount)}원 ~ ${priceFormatterToLocaleString(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
            onClick={() => selectSavingProduct(product)}
          />
        );
      })}
    </div>
  );
};
