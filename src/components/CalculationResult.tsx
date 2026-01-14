import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { ProductItem } from './ProductContainer';
import { FormDataType } from './Calculator';

function roundToThousand(value: number) {
  // +1, -1
  const sign = Math.sign(value);
  return sign * Math.round(Math.abs(value) / 1000) * 1000;
}

interface CalculationResultProps {
  // 필터된 데이터 총 연 이자율 소팅후 2개만
  products: ProductItem[];
  data: FormDataType;
  handleClickProduct: (id: string) => void;
}

export default function CalculationResult({ products, data, handleClickProduct }: CalculationResultProps) {
  // 1. isSelected을 찾아서, 그 정보와 formData를 계산해서 표출시켜줌.

  const selectedProduct = products.find(product => product.isSelected);

  const predictionPrice =
    Number(data.monthlPayment) * data.savingPeriod * (1 + (selectedProduct?.annualRate || 0) * 0.5);
  const differencial = Number(data.targetAmount) - predictionPrice;

  const recommendMonthlyPayment =
    Number(data.targetAmount) / (data.savingPeriod * (1 + (selectedProduct?.annualRate || 0) * 0.5));

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
                bottom={`${roundToThousand(predictionPrice).toLocaleString()}원`}
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
                bottom={`${roundToThousand(differencial).toLocaleString()}원`}
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
                bottom={`${roundToThousand(recommendMonthlyPayment).toLocaleString()}원`}
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
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: 3.2%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`100,000원 ~ 500,000원 | 12개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={product.isSelected && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {
            handleClickProduct(product.id);
          }}
        />
      ))}

      <Spacing size={40} />
    </>
  );
}
