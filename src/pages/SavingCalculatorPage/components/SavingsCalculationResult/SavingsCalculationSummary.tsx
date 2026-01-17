import styled from "@emotion/styled";
import { useSuspenseQuery } from "@tanstack/react-query";
import { commaizeNumber } from "@toss/utils";
import { useAtomValue } from "jotai";
import { monthlyPaymentAtom, savingsPeriodAtom, targetAmountAtom } from "pages/SavingCalculatorPage/atoms/savingsCaculationInputs";
import { savingsProductsQueryOptions } from "pages/SavingCalculatorPage/remotes/savingsProducts";
import { ListRow, colors } from "tosslib";

interface SavingsCalculationSummaryProps {
    selectedSavingsProductId: string;
}

export function SavingsCalculationSummary({ selectedSavingsProductId }: SavingsCalculationSummaryProps) {
    const targetAmount = useAtomValue(targetAmountAtom);
    const monthlyPayment = useAtomValue(monthlyPaymentAtom);
    const savingsPeriod = useAtomValue(savingsPeriodAtom);

    // NOTE: 상품 상세 API가 없어서 임시로 상품 목록 API를 사용합니다.
    const { data: savingsProduct } = useSuspenseQuery({
        ...savingsProductsQueryOptions(),
        queryKey: ['savingsProduct', selectedSavingsProductId],
        select: (data) =>
            data.find((product) => product.id === selectedSavingsProductId),
    });

    const annualRate = (savingsProduct?.annualRate ?? 0) / 100;

    const expectedAmount = Math.round(monthlyPayment * savingsPeriod * (1 + annualRate * 0.5));
    const amountDifference = targetAmount - expectedAmount;
    const recommendedMonthlyPayment = Math.round(targetAmount / (savingsPeriod * (1 + annualRate * 0.5)) / 1000) * 1000;

    return (
        <Container>
            <ListRow
                contents={
                    <ListRow.Texts
                        type="2RowTypeA"
                        top="예상 수익 금액"
                        topProps={{ color: colors.grey600 }}
                        bottom={`${commaizeNumber(expectedAmount)}원`}
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
                        bottom={`${commaizeNumber(amountDifference)}원`}
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
                        bottom={`${commaizeNumber(recommendedMonthlyPayment)}원`}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                    />
                }
            />
        </Container>
    )
}

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
})