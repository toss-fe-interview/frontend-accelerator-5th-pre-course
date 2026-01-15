import { SAVINGS_DURATIONS } from 'entities/savings/config/constant';
import { extractNumbers, formatNumberWithCommas } from 'entities/savings/lib';
import { SavingsTab, useSavingsProducts } from 'entities/savings/model';
import { useState } from 'react';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingDuration, setSavingDuration] = useState(12);
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState('');
  const [tab, setTab] = useState<SavingsTab>('products');
  const { filteredSavingsProducts, recommendedSavingsProducts, selectedSavingsProduct } = useSavingsProducts({
    savingDuration,
    monthlyDeposit,
    selectedSavingsProductId,
  });

  const onTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAmount(extractNumbers(e.target.value));
  };

  const onMonthlyDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyDeposit(extractNumbers(e.target.value));
  };

  const onSavingDurationChange = (duration: number) => {
    setSavingDuration(duration);
  };

  const onSavingsTabChange = (value: string) => {
    setTab(value as SavingsTab);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumberWithCommas(targetAmount)}
        onChange={onTargetPriceChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={onMonthlyDepositChange}
        value={formatNumberWithCommas(monthlyDeposit)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingDuration}
        onChange={onSavingDurationChange}
      >
        {SAVINGS_DURATIONS.map(duration => (
          <SelectBottomSheet.Option key={duration} value={duration}>
            {`${duration}개월`}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={onSavingsTabChange}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {tab === 'products' &&
        filteredSavingsProducts?.map(product => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={product.id === selectedSavingsProductId && <Assets.Icon name="icon-check-circle-green" />}
            onClick={() => {
              setSelectedSavingsProductId(product.id);
            }}
          />
        ))}
      {tab === 'results' && (
        <>
          {selectedSavingsProduct && (
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${(
                      Number(monthlyDeposit) *
                      selectedSavingsProduct.availableTerms *
                      (1 + selectedSavingsProduct.annualRate * 0.5)
                    ).toLocaleString()}원`}
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
                    bottom={`${(
                      Number(targetAmount) -
                      Number(monthlyDeposit) *
                        selectedSavingsProduct.availableTerms *
                        (1 + selectedSavingsProduct.annualRate * 0.5)
                    ).toLocaleString()}`}
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
                    bottom={`${(
                      Math.round(
                        Number(targetAmount) /
                          (selectedSavingsProduct.availableTerms * (1 + selectedSavingsProduct.annualRate * 0.5)) /
                          1000
                      ) * 1000
                    ).toLocaleString()}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />
            </>
          )}
          {!selectedSavingsProduct && (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}
          {recommendedSavingsProducts?.length > 0 && (
            <>
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />
              {recommendedSavingsProducts?.map(product => (
                <ListRow
                  key={product.id}
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={product.name}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: ${product.annualRate}%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  right={product.id === selectedSavingsProductId && <Assets.Icon name="icon-check-circle-green" />}
                />
              ))}
              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
