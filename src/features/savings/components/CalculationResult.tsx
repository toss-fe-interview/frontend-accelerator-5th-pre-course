import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import ResultRow from './ResultRow';
import {
  calcDiffAmount,
  calcExpectProfit,
  calcRecommendAmountForMonth,
  getMatchedSavingsProducts,
  slicer,
  sortByRate,
} from '../utils/savings';
import SavingsProductItem from './SavingsProduct';
import { numericFormatter } from 'utils/number';
import { SavingsProduct } from 'model/types';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  savingsProducts: SavingsProduct[];
  goalAmount: string;
  monthlyAmount: string;
  period: number;
}

const CalculationResult = ({
  selectedProduct,
  savingsProducts,
  goalAmount,
  monthlyAmount,
  period,
}: CalculationResultProps) => {
  return (
    <>
      {selectedProduct ? (
        <>
          <Spacing size={8} />
          <ListRow
            contents={
              <ResultRow subject="목표 금액" amount={calcExpectProfit({ selectedProduct, monthlyAmount, period })} />
            }
          />
          <ListRow
            contents={
              <ResultRow
                subject="목표 금액과의 차이"
                amount={calcDiffAmount({
                  goalAmount: numericFormatter(goalAmount),
                  expectedProfit: calcExpectProfit({ selectedProduct, monthlyAmount, period }),
                })}
              />
            }
          />
          <ListRow
            contents={
              <ResultRow
                subject="추천 월 납입 금액"
                amount={calcRecommendAmountForMonth({ selectedProduct, goalAmount, period })}
              />
            }
          />
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {slicer(sortByRate([...getMatchedSavingsProducts({ savingsProducts, monthlyAmount, period })], 'desc'), {
        offset: 0,
        limit: 2,
      }).map(recommendedProduct => {
        return (
          <SavingsProductItem
            key={recommendedProduct.id}
            product={recommendedProduct}
            isSelected={recommendedProduct.id === selectedProduct?.id}
          />
        );
      })}

      <Spacing size={40} />
    </>
  );
};

export default CalculationResult;
