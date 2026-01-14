import { useEffect, useMemo, useState } from 'react';
import {
  Assets,
  Border,
  colors,
  isHttpError,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { type SavingsProduct, getSavingsProducts } from 'api/savings-products';
import { addComma } from 'utils/add-comma';
import {
  calculateExpectedProfit,
  calculateRecommendedMonthlyAmount,
  calculateTargetDifference,
} from 'utils/savings-calculator';
import { roundNumber } from 'utils/round-number';

const TAB = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabType = (typeof TAB)[keyof typeof TAB];

export function SavingsCalculatorPage() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  // 적금 계산기
  const [targetAmount, setTargetAmount] = useState<number | undefined>(undefined);
  const [monthlyAmount, setMonthlyAmount] = useState<number | undefined>(undefined);
  const [term, setTerm] = useState<number>(12);

  // 선택한 적금 상품
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | undefined>(undefined);

  // 탭
  const [currentTab, setCurrentTab] = useState<TabType>(TAB.PRODUCTS);

  useEffect(() => {
    getSavingsProducts()
      .then(response => {
        setSavingsProducts(response);
      })
      .catch(e => {
        if (isHttpError(e)) {
          console.log(e.message);
        }
      });
  }, []);

  // 적금계산기를 통한 필터링
  const filteredSavingsProducts = useMemo(() => {
    return savingsProducts.filter(product => {
      if (product.availableTerms !== term) {
        return false;
      }

      if (monthlyAmount === undefined) {
        return true;
      }

      return product.minMonthlyAmount <= monthlyAmount && product.maxMonthlyAmount >= monthlyAmount;
    });
  }, [savingsProducts, monthlyAmount, term]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 적금 계산기 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        // TODO: 0 이 아닌 undefined 로 처리
        value={addComma(targetAmount)}
        onChange={e => {
          const numericValue = e.target.value.replace(/\D/g, '');
          setTargetAmount(numericValue === '' ? undefined : Number(numericValue));
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        // TODO: 0 이 아닌 undefined 로 처리
        value={addComma(monthlyAmount)}
        onChange={e => {
          // TODO: 공통 함수로 좀 묶기
          const numericValue = e.target.value.replace(/\D/g, '');
          setMonthlyAmount(numericValue === '' ? undefined : Number(numericValue));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => {
          setTerm(value);
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setCurrentTab(value as TabType);
        }}
      >
        <Tab.Item value={TAB.PRODUCTS} selected={currentTab === TAB.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB.RESULTS} selected={currentTab === TAB.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {currentTab === TAB.PRODUCTS && (
        <>
          {/* TODO: 별도의 컴포넌트로 분리 */}
          {filteredSavingsProducts.map(product => (
            <ListRow
              key={product.id}
              contents={
                <ListRow.Texts
                  type="3RowTypeA"
                  top={'기본 정기적금'}
                  topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                  middle={`연 이자율: ${product.annualRate}%`}
                  middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                  bottom={`${addComma(product.minMonthlyAmount)}원 ~ ${addComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                  bottomProps={{ fontSize: 13, color: colors.grey600 }}
                />
              }
              right={selectedSavingsProduct?.id === product.id && <Assets.Icon name="icon-check-circle-green" />}
              onClick={() => {
                if (selectedSavingsProduct?.id === product.id) {
                  setSelectedSavingsProduct(undefined);
                } else {
                  setSelectedSavingsProduct(product);
                }
              }}
            />
          ))}
        </>
      )}

      {currentTab === TAB.RESULTS && (
        <>
          <Spacing size={8} />

          {/* 상품 선택 강제 */}
          {!selectedSavingsProduct && (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}
          {/* 적금계산기 강제 */}
          {!(monthlyAmount && targetAmount) && (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="적금 계산기를 완료해주세요." />} />
          )}

          {targetAmount && monthlyAmount && selectedSavingsProduct && (
            <>
              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${addComma(roundNumber(calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct?.annualRate), 0))}원`}
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
                    bottom={`${addComma(roundNumber(calculateTargetDifference(targetAmount, calculateExpectedProfit(monthlyAmount, term, selectedSavingsProduct?.annualRate)), 0))}원`}
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
                    bottom={`${addComma(roundNumber(calculateRecommendedMonthlyAmount(targetAmount, term, selectedSavingsProduct?.annualRate), 3))}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />
            </>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {targetAmount && monthlyAmount && (
            <>
              {filteredSavingsProducts
                .sort((productA, productB) => productB.annualRate - productA.annualRate)
                .slice(0, 2)
                .map(product => (
                  <ListRow
                    key={product.id}
                    contents={
                      <ListRow.Texts
                        type="3RowTypeA"
                        top={'고급 정기적금'}
                        topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                        middle={`연 이자율: ${product.annualRate}%`}
                        middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                        bottom={`${addComma(product.minMonthlyAmount)}원 ~ ${addComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
                        bottomProps={{ fontSize: 13, color: colors.grey600 }}
                      />
                    }
                  />
                ))}
            </>
          )}

          <Spacing size={40} />
        </>
      )}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
