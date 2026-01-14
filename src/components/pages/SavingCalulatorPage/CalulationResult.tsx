import { useSavingProductsQuery } from 'queries/useSavingProductsQuery';
import { useWatch } from 'react-hook-form';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { isAffordableProducts } from 'utils/savingProductFilter';
import { ProductItem } from './ProductItem';
import { SavingProduct } from 'queries/types';

export const CalulationResult = ({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: SavingProduct | null;
  setSelectedProduct: (product: SavingProduct) => void;
}) => {
  const { data: savingProducts } = useSavingProductsQuery();
  const { monthlyAmount, term } = useWatch();

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

      {savingProducts
        ?.filter(product => isAffordableProducts(product, monthlyAmount, term))
        .sort((a, b) => b.annualRate - a.annualRate)
        .slice(0, 2)
        .map(product => (
          <ProductItem
            savingProduct={product}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        ))}

      <Spacing size={40} />

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
};
