import { getTop2RecommendedSavingsProducts } from 'domain/savingsFilter';
import { useCalculationResult } from 'hook/useCalculationResult';
import { useSelectedProductStore } from 'store/useSelectedProduct';
import { Assets, Border, colors, ListHeader } from 'tosslib';
import { ListRow } from 'tosslib';
import { Spacing } from 'tosslib';
import type { SavingsProduct } from 'types/savingsProducts';

interface CalculationResultTabProps {
  filteredProducts: SavingsProduct[];
}

const CalculationResultTab = ({ filteredProducts }: CalculationResultTabProps) => {
  const result = useCalculationResult();
  const { expectedProfit, targetAmountDifference, recommendedMonthlyAmount } = result || {};
  const { selectedProduct, setSelectedProduct } = useSelectedProductStore();

  const top2RecommendedSavingsProducts = getTop2RecommendedSavingsProducts(filteredProducts);

  if (!expectedProfit || !targetAmountDifference || !recommendedMonthlyAmount)
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedProfit.toLocaleString()}원`}
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
            bottom={`${targetAmountDifference.toLocaleString()}원`}
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
            bottom={`${recommendedMonthlyAmount.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {top2RecommendedSavingsProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => {
            setSelectedProduct(product);
          }}
        />
      ))}

      <Spacing size={40} />
    </>
  );
};

export default CalculationResultTab;
