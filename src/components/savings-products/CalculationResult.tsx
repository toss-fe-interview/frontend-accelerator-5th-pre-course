import { SavingsProduct } from 'api/savings-products/types';
import { Border, ListRow, Spacing } from 'tosslib';
import CalculattionResultList from './CalculationResultList';
import { Dispatch } from 'react';
import SuggestSavingProductList from './SuggestSavingsProductList';

interface CalculationResultProps {
  filteredProducts: SavingsProduct[];
  targetAmount: number | undefined;
  monthlyPayment: number | undefined;
  selectedProduct: SavingsProduct | null | undefined;
  setSelectedProduct: Dispatch<React.SetStateAction<SavingsProduct | undefined>>;
}

export default function CalculationResult({
  selectedProduct,
  setSelectedProduct,
  filteredProducts,
  targetAmount,
  monthlyPayment,
}: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />

      {selectedProduct && targetAmount && monthlyPayment ? (
        <CalculattionResultList
          selectedProduct={selectedProduct}
          targetAmount={targetAmount}
          monthlyPayment={monthlyPayment}
        />
      ) : (
        <>
          <Spacing size={10} />
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <SuggestSavingProductList
        filteredProducts={filteredProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </>
  );
}
