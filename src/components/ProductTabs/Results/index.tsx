import { ListRow, ListHeader, Border, Spacing, colors } from 'tosslib';
import { SavingsProduct } from '../types';

type ResultsProps = {
  selectedProduct: SavingsProduct | null;
  expectedProfit: number;
  diffAmount: number;
  recommendMonthlyPayment: number;
  filteredProducts: SavingsProduct[];
};

export function Results({
  selectedProduct,
  expectedProfit,
  diffAmount,
  recommendMonthlyPayment,
  filteredProducts,
}: ResultsProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const recommendedProducts = filteredProducts.sort((prev, curr) => curr.annualRate - prev.annualRate).slice(0, 2);

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedProfit.toLocaleString('ko-KR')}원`}
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
            bottom={`${diffAmount.toLocaleString('ko-KR')}원`}
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
            bottom={`${(recommendMonthlyPayment ?? 0).toLocaleString('ko-KR')}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Border height={16} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.length > 0 ? (
        recommendedProducts.map(product => {
          const { annualRate, minMonthlyAmount, maxMonthlyAmount, id, name, availableTerms } = product;
          const description = `${minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${availableTerms}개월`;

          return (
            <ListRow
              key={id}
              contents={
                <ListRow.Texts
                  type="3RowTypeA"
                  top={name}
                  topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                  middle={`연 이자율: ${annualRate}%`}
                  middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                  bottom={description}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              onClick={() => {}}
            />
          );
        })
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 추천 상품이 없습니다." />} />
      )}
    </>
  );
}
