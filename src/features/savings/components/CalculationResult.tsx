import { Spacing, ListRow, colors, Border, ListHeader } from 'tosslib';
import SavingsProductList from './SavingsProductList';
import { SavingsProduct } from '../schemas/savingsProduct';
import useRecommendedSavingsProducts from '../hooks/useRecommendedSavingsProducts';

interface CalculationResultProps {
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export default function CalculationResult({ savingsProducts, selectedProductId }: CalculationResultProps) {
  const recommendedSavingsProducts = useRecommendedSavingsProducts(savingsProducts);

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`1,000,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`-500,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`100,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
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
