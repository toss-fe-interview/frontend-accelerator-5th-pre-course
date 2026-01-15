import { useMemo } from 'react';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsFormInput, SavingsProduct } from 'types/savings';
import { calculateSavingsResult } from 'utils/calculateSavings';
import { formatNumber } from 'utils/format';
import SavingsProductList from './SavingsProductList';

interface CalculationResultProps {
  formData: SavingsFormInput;
  selectedProduct: SavingsProduct | null;
  filteredProducts: SavingsProduct[];
}

const CalculationResult = ({ formData, selectedProduct, filteredProducts }: CalculationResultProps) => {
  const result = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }
    return calculateSavingsResult({
      formData,
      annualRate: selectedProduct.annualRate,
    });
  }, [formData, selectedProduct]);

  const recommendedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />
      {result && (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatNumber(Math.round(result.expectedAmount))}원`}
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
                bottom={`${formatNumber(Math.round(result.difference))}원`}
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
                bottom={`${formatNumber(result.recommendMonthlyAmount)}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <SavingsProductList products={recommendedProducts} selectedProductId={selectedProduct?.id ?? null} />

      <Spacing size={40} />
    </>
  );
};

export default CalculationResult;
