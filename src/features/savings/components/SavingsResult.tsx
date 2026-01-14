import { ListRow, colors } from 'tosslib';
import { calculateEstimatedEaringsAmount } from '../utils/calculation/savings';
import { SavingsValues } from '../types/savingsValues';
import { SavingsProduct } from '../schemas/savingsProduct';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsResultProps {
  savingsValues: SavingsValues;
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
}

export default function SavingsResult({ savingsValues, savingsProducts, selectedProductId }: SavingsResultProps) {
  const selectedProduct = savingsProducts.find(product => product.id === selectedProductId);

  if (!selectedProductId || !selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const { monthlyPaymentAmount, savingsPeriod } = savingsValues;
  const { annualRate } = selectedProduct;

  const resultItems = [
    {
      label: '예상 수익 금액',
      value: calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, annualRate),
    },
    {
      label: '목표 금액과의 차이',
      value: calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, annualRate),
    },
    {
      label: '추천 월 납입 금액',
      value: calculateEstimatedEaringsAmount(monthlyPaymentAmount, savingsPeriod, annualRate),
    },
  ];

  return (
    <>
      {resultItems.map(result => (
        <ListRow
          key={result.label}
          contents={
            <ListRow.Texts
              type="2RowTypeA"
              top={result.label}
              topProps={{ color: colors.grey600 }}
              bottom={`${formatNumberWithComma(result.value)}원`}
              bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
            />
          }
        />
      ))}
    </>
  );
}
