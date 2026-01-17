import styled from "@emotion/styled";
import { useSuspenseQuery } from "@tanstack/react-query";
import { commaizeNumber } from "@toss/utils";
import { useAtomValue } from "jotai";
import { monthlyPaymentAtom, savingsPeriodAtom } from "pages/SavingCalculatorPage/atoms/savingsCaculationInputs";
import { selectedSavingsProductIdAtom } from "pages/SavingCalculatorPage/atoms/selectedSavingsProductId";
import { savingsProductsQueryOptions } from "pages/SavingCalculatorPage/remotes/savingsProducts";
import { Assets, colors, ListRow } from "tosslib";

export function RecommendSavingsProductList() {
    const selectedSavingsProductId = useAtomValue(selectedSavingsProductIdAtom);
    const monthlyPayment = useAtomValue(monthlyPaymentAtom);
    const savingsPeriod = useAtomValue(savingsPeriodAtom);

    const { data: savingsProducts } = useSuspenseQuery({
        ...savingsProductsQueryOptions(),
        select: (data) =>
            data
                .filter(
                    (product) =>
                        monthlyPayment >= product.minMonthlyAmount &&
                        monthlyPayment <= product.maxMonthlyAmount &&
                        savingsPeriod === product.availableTerms
                )
                .sort((a, b) => b.annualRate - a.annualRate)
                .slice(0, 2),
    });

    return (
        <Container>
            {savingsProducts.map((savingsProduct) => {
                const isSelected = selectedSavingsProductId === savingsProduct.id;

                return (
                    <ListRow
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
                        right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
                    />
                )
            })}
        </Container>
    )
}

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
})