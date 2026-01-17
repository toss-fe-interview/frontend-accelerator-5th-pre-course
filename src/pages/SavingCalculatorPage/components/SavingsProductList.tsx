import styled from "@emotion/styled";
import { useSuspenseQuery } from "@tanstack/react-query";
import { commaizeNumber } from "@toss/utils";
import { ListRow, colors } from "tosslib";
import { savingsProductsQueryOptions } from "../remotes/savingsProducts";

export function SavingsProductList() {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQueryOptions());

  return (
    <Container>
      {savingsProducts.map((savingsProduct) => {
        return (
          <ListRow
            key={savingsProduct.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={savingsProduct.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${savingsProduct.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${commaizeNumber(savingsProduct.minMonthlyAmount)}원 ~ ${commaizeNumber(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
          />
        )
      })}
    </Container>
  );
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
})