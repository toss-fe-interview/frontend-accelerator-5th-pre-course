import styled from "@emotion/styled";
import { commaizeNumber } from "@toss/utils";
import { useAtom } from "jotai";
import { ChangeEventHandler } from "react";
import { SelectBottomSheet, Spacing, TextField } from "tosslib";
import { monthlyPaymentAtom, savingsPeriodAtom, targetAmountAtom } from "../atoms/savingsCaculationInputs";

export function SavingsCalculator() {
    const [targetAmount, setTargetAmount] = useAtom(targetAmountAtom);
    const [monthlyPayment, setMonthlyPayment] = useAtom(monthlyPaymentAtom);
    const [savingsPeriod, setSavingsPeriod] = useAtom(savingsPeriodAtom);

    const handleTargetAmountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = Number(e.target.value.replace(/,/g, ''));
        setTargetAmount(value);
    };
    const handleMonthlyPaymentChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = Number(e.target.value.replace(/,/g, ''));
        setMonthlyPayment(value);
    };
    const handleSavingsPeriodChange = (value: number) => {
        setSavingsPeriod(value);
    };

    return (
        <Container>
            <TextField
                label="목표 금액"
                placeholder="목표 금액을 입력하세요"
                suffix="원"
                value={commaizeNumber(targetAmount)}
                onChange={handleTargetAmountChange}
            />
            <Spacing size={16} />
            <TextField
                label="월 납입액"
                placeholder="희망 월 납입액을 입력하세요"
                suffix="원"
                value={commaizeNumber(monthlyPayment)}
                onChange={handleMonthlyPaymentChange}
            />
            <Spacing size={16} />
            <SelectBottomSheet
                label="저축 기간"
                title="저축 기간을 선택해주세요"
                value={savingsPeriod}
                onChange={handleSavingsPeriodChange}
            >
                <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
                <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
                <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
            </SelectBottomSheet>
        </Container>
    );
}

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
})