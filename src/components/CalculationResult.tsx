import { SavingsProduct } from 'types/savings';
import { colors, ListRow, Spacing } from 'tosslib';
import { RecommendedProductList } from './RecommendedProductList';
import { formatCurrency } from 'utils/format';

function calculateSavingsResult(
  targetAmount: number,
  monthlyAmount: number,
  savingsTerm: number,
  selectedProduct: SavingsProduct
) {
  const expectedProfit = monthlyAmount * savingsTerm * (1 + selectedProduct?.annualRate * 0.5);
  const differenceProfit = targetAmount - expectedProfit;
  const recommendedMonthlyAmount = targetAmount / (savingsTerm * (1 + selectedProduct?.annualRate * 0.5));

  return { expectedProfit, differenceProfit, recommendedMonthlyAmount };
}

export function CalculationResult({
  selectedProduct,
  targetAmount,
  monthlyAmount,
  savingsTerm,
  recommendedProductList,
  setSelectedProduct,
}: {
  selectedProduct: SavingsProduct | null;
  targetAmount: number | null;
  monthlyAmount: number | null;
  savingsTerm: number | null;
  recommendedProductList: SavingsProduct[];
  setSelectedProduct: (product: SavingsProduct) => void;
}) {
  const safeTargetAmount = targetAmount ?? 0;
  const safeMonthlyAmount = monthlyAmount ?? 0;
  const safeSavingsTerm = savingsTerm ?? 12;

  if (!selectedProduct) {
    return (
      <>
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        <RecommendedProductList
          recommendedProductList={recommendedProductList}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      </>
    );
  }

  const { expectedProfit, differenceProfit, recommendedMonthlyAmount } = calculateSavingsResult(
    safeTargetAmount,
    safeMonthlyAmount,
    safeSavingsTerm,
    selectedProduct
  );

  return (
    <>
      <Spacing size={8} />

      {selectedProduct && (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatCurrency(expectedProfit)}원`}
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
                bottom={`${formatCurrency(differenceProfit)}원`}
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
                bottom={`${formatCurrency(recommendedMonthlyAmount)}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <RecommendedProductList
            recommendedProductList={recommendedProductList}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </>
      )}
    </>
  );
}
