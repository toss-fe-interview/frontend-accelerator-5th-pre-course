import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';

import CalculationResult from 'domains/savingsCalculator/components/CalculationResult';
import SavingsProduct from 'domains/savingsCalculator/components/SavingsProduct';
import { getRecommendedProducts, validatorSavingsProduct } from 'domains/savingsCalculator/utils/filter';

import IconCheckCircle from 'shared/components/Icon/IconCheckCircle';
import { SavingsProductType } from 'shared/types/api/savings';
import CurrencyInput from 'domains/savingsCalculator/components/form/CurrencyInput';
import Select from 'domains/savingsCalculator/components/form/Select';
import { SAVINGS_PRODUCT_TABS } from 'domains/savingsCalculator/constants/savings';
import SavingsCalculator from 'domains/savingsCalculator/components/SavingsCalculator';
import GetSavingsProducts from 'domains/savingsCalculator/components/api/GetSavingsProductst';

type SavingsProductTabId = (typeof SAVINGS_PRODUCT_TABS)[keyof typeof SAVINGS_PRODUCT_TABS];

export function SavingsCalculatorPage() {
  /** refactor : useSavingsInputs 훅 제거하기
   * 1. 기존에 해당 훅은 무슨 역할이었을까? -> 목표금액, 월 납입액, 저축 기간의 상태를 관리하고 있었다.
   * 2. 훅으로 분리했을 때 얻을 수 있는 이점이 있는가? (코드가 짧아진다? -> 짧으면 왜 좋지? -> 짧은 게 가독성에 좋은건가? -> 한 번에 파악해야 하는 정보의 양이 줄어드는 장점)
   * 3. 훅으로 분리했을 때 가지는 단점은 무엇인가? (어떤 값이 있는지 모른다 + 각 값의 초기값과 타입을 명시적으로 알 수 없다)
   * => 정보의 양을 줄이는 것 vs 정보를 드러내는 것 => 정보를 드러내서 오히려 의도를 더 잘 나타낼 수 있다.
   * */
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<6 | 12 | 24>(12);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProductType | null>(null);
  const [activeTabId, setActiveTabId] = useState<SavingsProductTabId>(SAVINGS_PRODUCT_TABS.PRODUCTS);

  const getValidSavingsProducts = (products: SavingsProductType[]) => {
    return products
      .filter(product => validatorSavingsProduct(product).isSameTerm(term))
      .filter(product => validatorSavingsProduct(product).isInMonthlyPaymentRange(monthlyPayment));
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <CurrencyInput
        label="목표 금액"
        value={targetAmount}
        placeholder="목표 금액을 입력하세요"
        onChange={value => setTargetAmount(value)}
      />
      <Spacing size={16} />
      <CurrencyInput
        label="월 납입액"
        value={monthlyPayment}
        placeholder="월 납입액을 입력하세요"
        onChange={value => setMonthlyPayment(value)}
      />
      <Spacing size={16} />
      <Select
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        selectedValue={term}
        options={[
          { value: 6, label: '6개월' },
          { value: 12, label: '12개월' },
          { value: 24, label: '24개월' },
        ]}
        onChange={value => setTerm(value)}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setActiveTabId(value as SavingsProductTabId)}>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.PRODUCTS} selected={activeTabId === SAVINGS_PRODUCT_TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.RESULTS} selected={activeTabId === SAVINGS_PRODUCT_TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTabId === SAVINGS_PRODUCT_TABS.PRODUCTS && (
        <GetSavingsProducts queryOptions={{ select: getValidSavingsProducts }}>
          {matchedSavingsProducts => {
            const hasNoMatchedProducts = matchedSavingsProducts.length === 0;

            if (hasNoMatchedProducts) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요." />} />;
            }

            return matchedSavingsProducts.map(product => {
              const isSelected = selectedProduct?.id === product.id;
              return (
                <ListRow
                  key={product.id}
                  contents={<SavingsProduct product={product} />}
                  right={isSelected && <IconCheckCircle />}
                  onClick={() => setSelectedProduct(product)}
                />
              );
            });
          }}
        </GetSavingsProducts>
      )}

      {activeTabId === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          <Spacing size={8} />

          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <SavingsCalculator
              inputs={{ targetAmount, monthlyPayment, term }}
              ouptuts={({ toExpectedProfit, toDiffFromTargetAmount, toRecommendedMonthlyPayment }) => (
                <>
                  <ListRow
                    contents={
                      <CalculationResult label="예상 수익 금액" value={toExpectedProfit(selectedProduct.annualRate)} />
                    }
                  />
                  <ListRow
                    contents={
                      <CalculationResult
                        label="목표 금액과의 차이"
                        value={toDiffFromTargetAmount(selectedProduct.annualRate)}
                      />
                    }
                  />
                  <ListRow
                    contents={
                      <CalculationResult
                        label="추천 월 납입 금액"
                        value={toRecommendedMonthlyPayment(selectedProduct.annualRate)}
                      />
                    }
                  />
                </>
              )}
            />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <GetSavingsProducts queryOptions={{ select: getValidSavingsProducts }}>
            {savingsProducts => {
              const recommendedSavingsProducts = getRecommendedProducts(savingsProducts);
              const hasNoRecommendedProducts = recommendedSavingsProducts.length === 0;

              if (hasNoRecommendedProducts) {
                return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요." />} />;
              }

              return recommendedSavingsProducts.map(product => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={<SavingsProduct product={product} />}
                    right={isSelected && <IconCheckCircle />}
                  />
                );
              });
            }}
          </GetSavingsProducts>
        </>
      )}
    </>
  );
}
