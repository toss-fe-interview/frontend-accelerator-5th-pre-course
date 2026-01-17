import styled from "@emotion/styled";
import { useSuspenseQuery } from "@tanstack/react-query";
import { commaizeNumber } from "@toss/utils";
import { useAtomValue } from "jotai";
import { ListRow, colors } from "tosslib";
import { monthlyPaymentAtom, savingsPeriodAtom } from "../atoms/savingsCaculationInputs";
import { savingsProductsQueryOptions } from "../remotes/savingsProducts";

export function SavingsProductList() {
  const monthlyPayment = useAtomValue(monthlyPaymentAtom);
  const savingsPeriod = useAtomValue(savingsPeriodAtom);

  const { data: savingsProducts } = useSuspenseQuery({
    ...savingsProductsQueryOptions(),
    select: (data) =>
      data.filter(
        (product) =>
          monthlyPayment >= product.minMonthlyAmount &&
          monthlyPayment <= product.maxMonthlyAmount &&
          savingsPeriod === product.availableTerms
      ),
  });

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