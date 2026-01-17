import { Border, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import CalculationResult from 'domains/savingsCalculator/components/CalculationResult';
import SavingsProduct from 'domains/savingsCalculator/components/SavingsProduct';
import MonthlyAmountField from 'domains/savingsCalculator/components/form/MonthlyAmountField';
import TargetAmountField from 'domains/savingsCalculator/components/form/TargetAmountField';
import TermField from 'domains/savingsCalculator/components/form/TermField';
import { getRecommendedProducts, rangeIn, sortByAnnualRateDesc } from 'domains/savingsCalculator/utils/filter';
import { round1000, toMultiplier } from 'domains/savingsCalculator/utils/calculate';

import SavingsQuery from 'shared/query/saving';
import TabScreen from 'shared/components/layout/TabScreen';
import IconCheckCircle from 'shared/components/Icon/IconCheckCircle';
import { SavingsProductType } from 'shared/types/api/savings';

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

  const validateMatchedProduct = (product: SavingsProductType) => {
    const 저축_기간이_일치함 = product.availableTerms === term;
    const 월_납입한도_내에_있음 = rangeIn(monthlyPayment, {
      min: product.minMonthlyAmount,
      max: product.maxMonthlyAmount,
    });

    return 저축_기간이_일치함 && 월_납입한도_내에_있음;
  };

  const { data: matchedProducts = [] } = useQuery(
    SavingsQuery.getSavingsProducts({
      select: data => data.filter(validateMatchedProduct),
    })
  );

  const hasNoMatchedProducts = matchedProducts.length === 0;

  return (
    <TabScreen
      headers={<NavigationBar title="적금 계산기" />}
      topContents={
        <>
          {/* 본질이 뭐지? 값을 "보여주기" + 값을 "변경하기" + "어떤 필드"인지 보여주기 */}
          {/* 값을 보여줄 때, 이게 TextField인지, SelectBottomSheet 인지 알 필요가 있을까? => 이건 how 라고 생각된다 */}
          {/* 이런 경우 본질을 더 잘 드러내기 위해 분리하면 어떨까? */}
          <TargetAmountField label="목표 금액" value={targetAmount} onChange={value => setTargetAmount(value)} />
          <Spacing size={16} />
          <MonthlyAmountField label="월 납입액" value={monthlyPayment} onChange={value => setMonthlyPayment(value)} />
          <Spacing size={16} />
          <TermField label="저축 기간" value={term} onChange={value => setTerm(value)} />
        </>
      }
      bottomTabs={[
        {
          id: 'products',
          label: '적금 상품',
          contents: (
            <>
              {/* 본질이 뭘까? 
               - 목표금액, 월 납입액, 저축기간에 따라서 필터링 조건에 맞는 적금 상품을 보여준다. 
               - 사용자 입력이 없으면 ? 보여주지 않는다 or 모두 보여준다 
                - 모두 보여준다
                   -> Case 1) 적금 상품을 선택 가능  -> 계산 결과에 어떻게 보여줄지 결정 & 사용자의 제품 흐름이 입력보다 적금 상품을 선택하는 것부터 시작할 수 있음 
                   -> Case 2) 적금 상품을 선택 불가능 -> 추가 방어 처리 필요
                   => 고려할 사항이 늘어남 (x)
                - 보여주지 않는다 
                   -> 사용자가 입력부터 시작하게 강제하여 자연스럽게 제품이 의도한 방향으로 흘러갈 수 있음 (o)
                   -> 보여줄 상품이 없다는 건 == 조건에 맞는 상품이 없다는 것 (hasNoMatchingProducts)
                   -> 보여줄 상품들 === 조건에 맞는 상품들 (matchingProducts)
              */}
              {hasNoMatchedProducts ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요." />} />
              ) : (
                matchedProducts.map(product => {
                  const isSelected = selectedProduct?.id === product.id;

                  return (
                    <ListRow
                      key={product.id}
                      contents={<SavingsProduct product={product} />}
                      right={isSelected ? <IconCheckCircle /> : undefined}
                      onClick={() => setSelectedProduct(product)}
                    />
                  );
                })
              )}
            </>
          ),
        },
        {
          id: 'results',
          label: '계산 결과',
          contents: (
            <>
              <Spacing size={8} />

              {!selectedProduct ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
              ) : (
                <>
                  <ListRow
                    contents={
                      <CalculationResult
                        label="예상 수익 금액"
                        value={monthlyPayment * term * toMultiplier(selectedProduct.annualRate)}
                      />
                    }
                  />
                  <ListRow
                    contents={
                      <CalculationResult
                        label="목표 금액과의 차이"
                        value={targetAmount - monthlyPayment * term * toMultiplier(selectedProduct.annualRate)}
                      />
                    }
                  />
                  <ListRow
                    contents={
                      <CalculationResult
                        label="추천 월 납입 금액"
                        value={round1000(targetAmount / (term * toMultiplier(selectedProduct.annualRate)))}
                      />
                    }
                  />
                </>
              )}

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {hasNoMatchedProducts ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요." />} />
              ) : (
                getRecommendedProducts(matchedProducts).map(product => {
                  const isSelected = selectedProduct?.id === product.id;

                  return (
                    <ListRow
                      key={product.id}
                      contents={<SavingsProduct product={product} />}
                      right={isSelected ? <IconCheckCircle /> : undefined}
                    />
                  );
                })
              )}
            </>
          ),
        },
      ]}
    />
  );
}
