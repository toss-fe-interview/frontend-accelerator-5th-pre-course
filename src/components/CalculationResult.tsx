import { SavingsProduct } from 'apis/type';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { commaizeNumber } from 'utils';
import { roundToUnit } from 'utils/roundToUnit';
import { ProductListItem } from './ProductListItem';
import type { SavingsResult } from 'utils/calcSavingsResult';

type CalculationResultProps = {
  result: SavingsResult;
  recommendedProducts: SavingsProduct[];
  selectedProduct?: SavingsProduct;
  onClickProduct?(savingsProduct: SavingsProduct): void;
};

export const CalculationResult = (props: CalculationResultProps) => {
  const { result, recommendedProducts, selectedProduct, onClickProduct } = props;
  const { expectedReturn, differanceFromGoal, recommendedMonthlySaving } = result;

  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${commaizeNumber(roundToUnit(expectedReturn))}원`}
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
            bottom={`${commaizeNumber(roundToUnit(differanceFromGoal))}원`}
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
            bottom={`${commaizeNumber(roundToUnit(recommendedMonthlySaving))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.map(rp => {
        return (
          <ProductListItem
            key={rp.id}
            savingsProduct={rp}
            onClick={onClickProduct}
            selected={rp.id === selectedProduct?.id}
          />
        );
      })}

      <Spacing size={40} />
    </>
  );
};
