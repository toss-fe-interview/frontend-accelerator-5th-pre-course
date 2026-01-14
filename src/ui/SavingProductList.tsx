import { SavingsProduct } from 'model/types';
import { Dispatch, SetStateAction } from 'react';
import { Assets, colors, ListRow } from 'tosslib';

const SavingProductList = ({
  state,
  action,
}: {
  state: { filteredProducts: SavingsProduct[]; selectedProduct: SavingsProduct | null };
  action: { setSelectedProduct: Dispatch<SetStateAction<SavingsProduct | null>> };
}) => {
  return (
    <>
      {state.filteredProducts.map(product => {
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
                bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={product.id === state.selectedProduct?.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
            onClick={() => {
              action.setSelectedProduct(product);
            }}
          />
        );
      })}
    </>
  );
};
export default SavingProductList;
