import { A, pipe } from '@mobily/ts-belt';
import AmountInput from 'AmountInput';
import GetSavingsProducts from 'GetSavingsProducts';
import { useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { SavingsProduct } from 'types';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<Term>(12);

  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyPayment}
        onChange={setMonthlyPayment}
      />
      <Spacing size={16} />
      <SelectBottomSheet<Term> label="저축 기간" title="저축 기간을 선택해주세요" value={term} onChange={setTerm}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* what? 적금 상품 목록 탭과 계산 결과 탭을 표시하는 탭.  */}
      {/* how가 드러나있지는 않은가?   */}
      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* what? 적금 상품 목록 탭 컨텐츠라는 건 알겠는데, 그 아래의 what들이 전혀 안 보임. 일단 한줄한줄 들여다 봐야겠음.  */}
      {selectedTab === 'products' && (
        <GetSavingsProducts
          select={savingsProducts =>
            savingsProducts.filter(product =>
              matchesSavingsCalculatorInput({ savingsProduct: product, input: { monthlyPayment, term } })
            )
          }
        >
          {savingsProducts =>
            savingsProducts.map(product => (
              <ListRow
                key={product.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={product.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${product.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={
                  selectedSavingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null
                }
                onClick={() => setSelectedSavingsProduct(product)}
              />
            ))
          }
        </GetSavingsProducts>
      )}

      {selectedTab === 'results' &&
        (selectedSavingsProduct ? (
          <>
            <Spacing size={8} />
            <ListRow
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="예상 수익 금액"
                  topProps={{ color: colors.grey600 }}
                  bottom={`${(monthlyPayment * term * (1 + selectedSavingsProduct.annualRate * 0.5)).toLocaleString('ko-KR')}원`}
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
                  bottom={`${(targetAmount - monthlyPayment * term * (1 + selectedSavingsProduct.annualRate * 0.5)).toLocaleString('ko-KR')}원`}
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
                  bottom={`${Math.round(targetAmount / term / (1 + selectedSavingsProduct.annualRate * 0.5)).toLocaleString('ko-KR')}원`}
                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                />
              }
            />
            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />

            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />

            {
              // 서스펜스 써서 ~List로 바꿔보면 좋겠다
              <GetSavingsProducts
                select={savingsProducts =>
                  pipe(
                    savingsProducts,
                    A.filter(product =>
                      matchesSavingsCalculatorInput({ savingsProduct: product, input: { monthlyPayment, term } })
                    ),
                    getRecommendedSavingsProducts
                  )
                }
              >
                {savingsProducts =>
                  savingsProducts.map(product => (
                    <ListRow
                      key={product.id}
                      contents={
                        <ListRow.Texts
                          type="3RowTypeA"
                          top={product.name}
                          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                          middle={`연 이자율: ${product.annualRate}%`}
                          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                          bottom={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`}
                          bottomProps={{ fontSize: 13, color: colors.grey600 }}
                        />
                      }
                      right={
                        selectedSavingsProduct?.id === product.id ? (
                          <Assets.Icon name="icon-check-circle-green" />
                        ) : null
                      }
                    />
                  ))
                }
              </GetSavingsProducts>
            }

            <Spacing size={40} />
          </>
        ) : (
          <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
        ))}
    </>
  );
}

type Term = 6 | 12 | 24;

function matchesSavingsCalculatorInput({
  savingsProduct,
  input: { monthlyPayment, term },
}: {
  savingsProduct: SavingsProduct;
  input: { monthlyPayment: number; term: Term };
}) {
  const isMonthlyPaymentInRange =
    savingsProduct.minMonthlyAmount < monthlyPayment && savingsProduct.maxMonthlyAmount > monthlyPayment;
  const isTermMatched = savingsProduct.availableTerms === term;

  return isMonthlyPaymentInRange && isTermMatched;
}

function getRecommendedSavingsProducts(savingsProducts: readonly SavingsProduct[]) {
  return [...savingsProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
}
