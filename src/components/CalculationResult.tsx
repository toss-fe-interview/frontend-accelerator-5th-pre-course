import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { roundToThousand } from 'utils';
import { type ProductItem } from 'types/products';
import { CalculatorForm } from 'types/calculate';
import Product from './ProductItem';

interface CalculationResultProps {
  // 필터된 데이터 총 연 이자율 소팅후 2개만
  products: ProductItem[];
  userInput: CalculatorForm;
  onClickProduct: (id: string) => void;
}

export default function CalculationResult({ products, userInput, onClickProduct }: CalculationResultProps) {
  // 1. isSelected을 찾아서, 그 정보와 formData를 계산해서 표출시켜줌.

  const selectedProduct = products.find(product => product.isSelected);

  // TODO: 리액트와는 상관없는 비즈니스 로직임. 별도 추출이 필요.
  // 예상 수익 금액
  const expectedReturnAmount =
    Number(userInput.monthlyPayment) * userInput.savingPeriod * (1 + (selectedProduct?.annualRate || 0) * 0.5);
  // 목표 금액과의 차이
  const targetGapAmount = Number(userInput.targetAmount) - expectedReturnAmount;
  // 추천 월 납입 금액
  const recommendedMonthlyContribution =
    Number(userInput.targetAmount) / (userInput.savingPeriod * (1 + (selectedProduct?.annualRate || 0) * 0.5));

  // 2. selected :true가 아무것도 없다면 => 상품 선택 해주세요.
  return (
    <>
      <Spacing size={8} />
      {selectedProduct ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${roundToThousand(expectedReturnAmount).toLocaleString()}원`}
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
                bottom={`${roundToThousand(targetGapAmount).toLocaleString()}원`}
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
                bottom={`${roundToThousand(recommendedMonthlyContribution).toLocaleString()}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
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
      {/* 사용자가 입력한 조건에 맞는 적금 상품 중 연 이자율이 가장 높은 2개의 상품을 출력해주세요. */}

      {products.map(product => (
        <button
          key={product.id}
          onClick={() => {
            onClickProduct(product.id);
          }}
        >
          <Product product={product} isActive={product.isSelected} />
        </button>
      ))}

      <Spacing size={40} />
    </>
  );
}
