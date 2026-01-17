import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import { Suspense } from "react";
import { Border, ListHeader, ListRow, Spacing } from "tosslib";
import { selectedSavingsProductIdAtom } from "../../atoms/selectedSavingsProductId";
import { RecommendSavingsProductList } from "./RecommendSavingsProductList";
import { SavingsCalculationSummary } from "./SavingsCalculationSummary";

export function SavingsCalculationResult() {
    const selectedSavingsProductId = useAtomValue(selectedSavingsProductIdAtom);

    return (
        <Container>
            <Spacing size={8} />

            {selectedSavingsProductId ? (
                <Suspense fallback="Loading...">
                    <SavingsCalculationSummary selectedSavingsProductId={selectedSavingsProductId} />
                </Suspense>
            ) : (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}

            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader title={
                <ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
            <Spacing size={12} />

            <Suspense fallback="Loading...">
                <RecommendSavingsProductList />
            </Suspense>

            <Spacing size={40} />
        </Container>
    )
}

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
})