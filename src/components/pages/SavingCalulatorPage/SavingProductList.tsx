import { SavingProduct } from 'queries/types';
import { Assets, colors, ListRow } from 'tosslib';

export const SavingProductList = ({
  savingProducts,
  selectedProduct,
  setSelectedProduct,
}: {
  savingProducts?: SavingProduct[];
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  return (
    <>
      {/* TODO: suspense 처리 */}
      {savingProducts?.map(savingProduct => (
        <ListRow
          key={savingProduct.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={savingProduct.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${savingProduct.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${savingProduct.minMonthlyAmount.toLocaleString('kr-KR')}원 ~ ${savingProduct.maxMonthlyAmount.toLocaleString('kr-KR')}원 | ${savingProduct.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProduct?.id === savingProduct.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => {
            setSelectedProduct(savingProduct);
          }}
        />
      ))}
    </>
  );
};
