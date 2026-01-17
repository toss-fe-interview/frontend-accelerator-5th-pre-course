import { ListHeader, Spacing } from 'tosslib';
import { SavingProductList } from './SavingProductList';
import { compareByHighestRate, SavingProduct } from 'models/SavingProduct';

const MAX_RECOMMENDED_COUNT = 2;

export const RecommendedSavingProductList = ({
  savingsProducts,
  selectedSavingProduct,
  selectSavingProduct,
}: {
  savingsProducts: SavingProduct[];
  selectedSavingProduct: SavingProduct | null;
  selectSavingProduct: (product: SavingProduct) => void;
}) => {
  const recommendedSavingsProducts = savingsProducts.sort(compareByHighestRate).slice(0, MAX_RECOMMENDED_COUNT);

  return (
    <div>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      <SavingProductList
        savingsProducts={recommendedSavingsProducts}
        selectedSavingProduct={selectedSavingProduct}
        selectSavingProduct={selectSavingProduct}
      />
    </div>
  );
};
