import { useFormContext } from 'react-hook-form';
import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'hooks/useSavingsProducts';

interface SavingsSummaryProps {
  products: SavingsProduct[] | undefined;
  selectedProductId: string | null;
}

const SavingsSummary = ({ products, selectedProductId }: SavingsSummaryProps) => {
  const { watch } = useFormContext();
  const targetAmount = Number(watch('targetAmount')) || 0;

  // 폼 값
  const monthlyAmount = Number(watch('monthlyAmount')) || 0;
  const savingPeriod = Number(watch('savingPeriod')) || 0;

  // 선택된 상품
  const selectedProduct = products?.find(item => item.id === selectedProductId);
  const annualRate = selectedProduct?.annualRate ?? 0;

  // 계산 로직
  const expectedAmount = monthlyAmount * savingPeriod * (1 + (annualRate / 100) * 0.5);
  const difference = targetAmount - expectedAmount;
  const recommendedMonthly =
    savingPeriod > 0 ? Math.round(targetAmount / (savingPeriod * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000 : 0;

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedAmount.toLocaleString()}원`}
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
            bottom={`${difference >= 0 ? '+' : ''}${difference.toLocaleString()}원`}
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
            bottom={`${recommendedMonthly.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
};

export default SavingsSummary;
