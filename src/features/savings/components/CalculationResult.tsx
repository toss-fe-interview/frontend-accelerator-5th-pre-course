import { Spacing, Border, ListHeader } from 'tosslib';
import SavingsProductList from './SavingsProductList';
import { SavingsProduct } from '../schemas/savingsProduct';
import useRecommendedSavingsProducts from '../hooks/useRecommendedSavingsProducts';
import SavingsResult from './SavingsResult';
import { SavingsValues } from '../types/savingsValues';

interface CalculationResultProps {
  savingsValues: SavingsValues;
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export default function CalculationResult({
  savingsValues,
  savingsProducts,
  selectedProductId,
}: CalculationResultProps) {
  const recommendedSavingsProducts = useRecommendedSavingsProducts(savingsProducts);

  return (
    <>
      <Spacing size={8} />

      <SavingsResult
        savingsValues={savingsValues}
        savingsProducts={savingsProducts}
        selectedProductId={selectedProductId}
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <SavingsProductList savingsProducts={recommendedSavingsProducts} selectedProductId={selectedProductId} />

      <Spacing size={40} />
    </>
  );
}
