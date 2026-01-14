import { SavingProduct } from 'queries/types';
import { useFormContext, useWatch } from 'react-hook-form';
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
  const { monthlyAmount, term } = useWatch();

  // TODO : 리팩토링 및 테스트 코드 추가 고려
  const filteredProducts = savingProducts?.filter(savingProduct => {
    const isTermMatched = term === savingProduct.availableTerms;
    const isMonthlyAmountMatched = monthlyAmount
      ? savingProduct.minMonthlyAmount <= monthlyAmount && monthlyAmount <= savingProduct.maxMonthlyAmount
      : true;
    return isTermMatched && isMonthlyAmountMatched;
  });

  return (
    <>
      {/* TODO: suspense 처리 */}
      {filteredProducts?.map(savingProduct => (
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
