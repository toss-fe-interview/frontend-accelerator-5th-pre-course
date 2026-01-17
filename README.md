# 토스 적금 계산기

토스 스타일의 적금 계산기 웹 애플리케이션입니다.

## Getting started

```sh
yarn dev
```
## 프로젝트 구조

```
src/
├── components/
│   └── Savings/
│       ├── Calculator/          # 계산기 입력 컴포넌트
│       │   ├── GoalAmountInput.tsx
│       │   ├── MonthlyDepositInput.tsx
│       │   ├── PeriodSelector.tsx
│       │   └── useSavingsCalculator.ts
│       ├── Result/              # 결과 표시 컴포넌트
│       │   ├── ExpectedProfit.tsx
│       │   ├── GoalDifference.tsx
│       │   └── RecommendedDeposit.tsx
│       ├── ProductList/         # 상품 목록 컴포넌트
│       ├── ui/                  # 적금 도메인 UI 컴포넌트
│       └── index.tsx            # Compound Component 조합
├── pages/
│   └── SavingsCalculatorPage.tsx
├── utils/
│   └── savings.ts               # 상품 필터링 유틸리티
└── context.tsx
```

## 설명

추상화 단계를 설정하며 개발합니다. 제 기준은 1depth : UI와 함께 보는 용도, 2depth : 조건, 컴포넌트의 기능 확인, 3depth: 정적인 코드
(스타일) 입니다.

의도 : 추상화 단계를 통해 순차적으로 코드에서 개발자가 각 단계마다 필요한 맥락만 볼 수 있도록 하기 위함입니다.

1depth : Pages/SavingsCalculatorPage.tsx
2depth : 
- components/Savings/Calculator
- components/Savings/ProductList
- components/Savings/Result
3depth : src/components/Savings/ui/ProductList.tsx


각 컴포넌트는 개발할때 어떤 시점에 변경이 일어날 것인지 고민하며 개발하였습니다.
- 적금 계산기의 경우 변경이 일어난다면 플레이스홀더 같은 내부 문구들이 변경될 것으로 예측되며 1depth에서 충분히 찾아갈 수 있다고 생각되어 따로 props로 보이도록 구현하지는 않았습니다.
- 적금 상품, 계산 결과 탭의 경우 탭이 계속 늘어나거나 줄어드는 경우의 변경이 일어날 것으로 예측되었습니다. 그래서 탭을 을 1depth에서 쉽게 컨트롤 할 수 있도록 tabs 변수를 사용하고 Tab 네비게이션 컴포넌트와 내부 내용이 담긴 컴포넌트가 자동으로 보여지도록 설계했습니다.
  - 여기서 고민한 부분은 자동으로 보여진다면 보통 가독성이 떨어집니다. map으로 단순하게 반복문을 돌려서 어떤 탭이 언제 사라질지 모릅니다. 그래서 renderProps 패턴을 이용하여 1depth에서 탭 내부 컴포넌트까지 컨트롤이 가능하도록 구현하였습니다.
```
  const tabs: SavingTabListType = [
    { value: 'products', name: '적금 상품' },
    { value: 'results', name: '계산 결과' },
  ];

   <Savings.TabNavigation tabs={tabs} />
      <Savings.TabContent
        renderProps={(tab) => (
          <>
            {tab === 'products' && <Savings.ProductList/>}
            {tab === 'results' && <>
            <Savings.Result />
            <RecommendedProductHeader />
            </>}
          </>
        )}
      />
```


