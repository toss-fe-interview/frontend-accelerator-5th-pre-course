# 토스 Frontend Accelerator 5기 Precourse 🔥

## 개요

목표 금액을 달성하기 위한 적금 상품을 추천 받을 수 있는 적금계산기 입니다.

유지보수성과 확장성을 고려한 설계에 집중하면서, 2시간 내에 전체 기능을 구현하도록 노력했습니다.

## 가설을 세우고 진행한 부분

- 월 납입액이 없으면 월 납입액과 관련 없이 모든 적금 상품을 보여주도록 하였음
- 한 번 선택한 상품을 더블클릭으로 해제할 수 없음(계산 결과에 사용하기 위해 상품 선택을 유도하기 위함)

## 리뷰 받고 싶은 부분

### 폴더 구조

크게 역할에 따른 분리 방식을 채택하였습니다. (`components`, `hooks`, `utils`, `queries`)

페이지 안에서 사용될 컴포넌트들을 `/components/pages/페이지명` 에 넣어 `/pages` 폴더와 통일성을 주려고 했습니다.

`hooks`와 `utils`의 경우 특정 페이지에서만 사용될 가능성도 커보이는데 그렇다고 `/components` 하위에 두는 것은 잘못된 분류라고 생각해서 외부에 유지했습니다. (`hooks`와 `utils` 내부에도 `/pages`와 `/common`을 두는 것도 괜찮았을 것 같습니다.)

feature(기능) 기반으로 한 구조는, 특정 컴포넌트를 어디다 둬야하는지 애매해질 수 있다는 생각이 들어서 역할 > 페이지에 따른 분류를 선호했는데, 기능이 많아질 경우 역할 > 페이지에 따른 분류가 부적합하게 느껴질지 우려가 됩니다.

```plain-text
  src/
  │
  ├── components/
  │   ├── common/
  │   │   ├── Loading.tsx
  │   │   └── TextFieldForKRW.tsx
  │   │
  │   └── pages/
  │       └── SavingCalulatorPage/
  │           ├── CalculationResultSummary.tsx
  │           ├── CalculatorFormInputs.tsx
  │           ├── CalculationResult.tsx
  │           ├── ProductItem.tsx
  │           ├── RecommendProductList.tsx
  │           └── SavingProductList.tsx
  │
  ├── hooks/
  │   └── useSavingCalculatorTab.tsx
  │
  ├── pages/
  │   ├── Routes.tsx
  │   └── SavingsCalculatorPage.tsx
  │
  ├── queries/
  │   ├── types.ts
  │   └── useSavingProductsQuery.ts
  │
  ├── utils/
  │   ├── savingCalculator.ts
  │   ├── savingCalculator.test.ts
  │   ├── savingProductFilter.ts
  │   └── savingProductFilter.test.ts
```

### 컴포넌트를 나눈 기준

아래와 같은 기준으로 컴포넌트를 나누려고 노력했습니다. 하지만 시간 내에 개발하려다 보니 급하게 손이 가는데로 나눠지기도 한 것 같습니다.

1. 단순 렌더링이 아니라, 내부에서 처리할 로직이 있다.(CalculationResultSummary, RecommendProductList, SavingProductList 등)
2. 재사용이 필요하다. (TextFieldForKRW, ProductItem 등)
3. 길이가 길어서 가독성을 저해한다.

급하게 개발하다보니, 추상화 레벨에 따른 분리를 고려하지 못한 것 같습니다. 개발 중에 컴포넌트의 위계까지 고려하면서 구조를 잡기가 어려워 본능적으로(?) 분리하는 문제가 있는 거 같은데, 어떻게 하면 나아질 수 있을지 궁금합니다.

또한 ProductItem(적금 상품 아이템)의 경우 완전히 동일한 컴포넌트가 반복되고 있어서 현재는 분리해두었는데, 그랬더니 RecommendProductList랑 SavingProductList가 너무 유사한가?하는 생각이 듭니다. 추후에 분기될 가능성을 고려해서 성급한 추상화를 하지 않는게 나았을지도 궁금합니다.

### Props Drilling

`react-hook-form`의 `FormProvider`를 사용하여 폼의 상태를 관리하고, Props Drilling을 피할 수 있었습니다.

선택된 상품과 관련된 상태인 `selectedProduct`, `setSelectedProduct`는 Context API로 감싸지 않고 props로 전달하여 사용합니다. 폼과 관련된 상태를 컨텍스트로 관리하기 때문에 관리해야할 상태의 개수가 많지 않고, 아직 계층이 깊다고 생각하지 않아서 Props Drilling을 유지하였는데, Props Drilling을 피하기 위한 방식의 도입은 어느 시점이 적절한지 궁금합니다.

### react-hook-form 사용이 오버엔지니어링일까?

아직 input이 세 개 밖에 없어서, 각각의 state로 관리 했어도 충분했을 것 같습니다. 다만, input 수가 늘어나고 유효성 검증 등이 추가되었을 때 훨씬 편리할 것이라고 생각해서 사용하였습니다.

### 필터링, 어떻게 더 선언적으로 구현할 수 있을까?

상품 목록에서 반복적으로 사용되는 필터링 로직은 `isAffordableProducts` 함수를 사용하고, 내부에 `isMonthlyAmountMatched`, `isTermMatched` 함수를 조합하여 구현했습니다. 이러한 방식이 향후 필터링 로직이 분기되거나 복잡해졌을 때 수정하기 용이하다고 생각합니다.

하지만, 계산 결과 추천 상품에서 정렬 후 2개만 뽑는 로직이 filter 함수 밖에 있어서 불편하다는 생각이 들었습니다. 이 부분을 어떻게 개선하면 좋을지 궁금합니다.

```typescript
const recommendProductList = savingProducts
  ?.filter(product => isAffordableProducts(product, monthlyAmount, term))
  .sort((a, b) => b.annualRate - a.annualRate)
  .slice(0, 2);
```

### ResultGuard

`CalculationResultSummary`가 선택한 상품이 있는 상황에만 집중하기 위해서 해당 경우를 별도로 처리할 수 있는 가드를 만들어보았습니다. `CalculationResultSummary`가 자신의 할일에만 집중할 수 있다는 장점이 있지만, 단순한 로직을 굳이 별도 컴포넌트로 분리하면서 가독성이 떨어졌나? 하는 생각도 듭니다. 다른 분들의 의견이 궁금합니다!

### useSavingCalculatorTab

탭과 관련된 타입이나 타입 가드 함수들이 생기면서, 관련 코드가 많다고 생각해 단순 state지만 추상화하여 파일을 분리하게 되었습니다. 과도한 추상화라고 느껴지지 않을지 궁금합니다.

### `TextFieldForKRW`와 `.toLocaleString('ko-KR')`

- `.toLocaleString('ko-KR')` 이 반복적으로 사용되는 것이 신경쓰였는데, 워낙 단순한 코드라 함수로 한번 래핑해도 크게 달라지는 것이 없을 것 같아 그냥두었습니다. 다만, 지금 생각해보니 'ko-KR'은 상수로 빼두면 좋을 것 같습니다.
- `TextFieldForKRW`는 입력값이 원화에 고정되어있을 것이라고 가정하고, 천 단위 콤마 표시를 원활하게 하기 위한 컴포넌트 입니다. 국내 서비스라고 가정했을때 동일한 컴포넌트의 재사용 가능성이 높다고 생각해서 별도로 분리했습니다. 그러나 해외 통화에 대한 고려가 부족한 설계로 비춰질 수 있고, 단순한 컴포넌트를 성급하게 추상화했나 하는 생각이 들어 다른 분들은 어떻게 생각하시는지 궁금합니다.

## 시간상 생략한 부분

- Error boundary를 활용한 에러처리
- form 입력값 검증 (최소값, 최대값)
- 오타나, 마지막에 급하게 리팩토링하면서 놓친 부분을 발견했는데, 따로 코멘트 남겨두겠습니다.
