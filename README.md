# 토스 Frontend Accelorator pre-course 과제 🔥

## Getting started

```sh
yarn dev
```

**궁금 포인트 - 사용자 시나리오**

1. 사용자가 상품을 선택하지 않았을 때 계산 결과 탭에서는 어떤 추천 상품을 보여줘야 할까요? 혹은, 보여주지 않아야 할까요?
   -> 우선 제 판단은 '현재 필터링된 목록 중 이자율 높은 상위 2개를 보여주기!'였습니다.

1-2. 그런데... 상품을 선택하지 않아도, 추천상품을 보여주는게 맞을까? - 유저에게 추천 상품을 보여주면, 궁금증을 유도해서 입력창에 숫자를 넣어볼 수 있을 것 같다 (추측)

2. 사용자가 목표 금액/월납입액/저축 기간을 입력을 안하고, 상품을 선택한 후 계산 결과탭으로 갔을 때 어떤 것을 보여줘야 할까요?
   - 저축 기간은 12개월로 고정이므로 pass! 그러나 목표 금액이나 월납입액은 default 값이 없어서 꼭 입력해야 합니다
   - 만약 둘 중 한 값만 입력을 했다면, 계산 결과를 보여주는 게 좋을까요?
   - 계산 결과를 보여준다: 유저가 실시간 피드백을 느끼며, 서비스가 '빠르다'고 인식할 수 있다.
   - 계산 결과를 안보여준다: 두 값을 다 입력하도록 유도해서, 정확한 계산 결과를 제공할 수 있다.

3. 만약 사용자의 필터 결과에 의해 적금 상품이 없다면, '적금 상품이 없어요'라고 안내한다
   - 적금 상품 결과가 없으면 추천 상품 결과도 없기에 '추천상품 결과가 없어요'라고 안내한다.
   - 그런데, 네트워크 요청이 실패해서 결과가 없는건지, 진짜 검색 결과가 없는건지 구분할 수 있을까요?
     - 내 구현: 우선 메인 페이지에서 isLoading과 Error 케이스에 대해 early return으로 구분한다

**리팩토링**

1. UI 컴포넌트 분리
   메인에 모두 몰려있는 구조에서 컴포넌트 분리를 시도했습니다

- **InputSection** - 입력부 (목표 금액, 월 납입액, 저축 기간)
- **ProductList** - 상품 목록 (적금 상품 탭 + 추천 상품에서 재사용)
- **CalculationResultSection** - 계산 결과 (예상 수익, 목표 차이, 추천 납입액)

2. InputSection Partial 패턴 적용

AS-IS: 개별 onChange 핸들러를 사용해 input form이 추가될 때마다 props가 늘어나는 패턴

```
<InputSection
  targetAmount={targetAmount}
  monthlyDeposit={monthlyDeposit}
  term={term}
  onTargetAmountChange={setTargetAmount}
  onMonthlyDepositChange={setMonthlyDeposit}
  onTermChange={setTerm}
/>
```

TO-BE: partial 패턴을 사용해 onChange 핸들러 1개로 통합

```
<InputSection values={inputValues} onChange={handleInputChange} />
```

- props 6개 -> 2개로 간소화
- 입력 필드 추가 시 핸들러 추가 불필요
- 폼 상태를 단일 객체로 관리

3. useCalculationResult 순수 함수 분리

- 계산 로직을 훅 내부의 순수 함수로 분리하여 단일 책임 원칙을 적용

```
useCalculationResult (훅)
├── parseAmount()           - 문자열 → 숫자 변환
├── calculateExpectedReturn() - 예상 수익 계산
├── calculateDifference()     - 목표 금액 차이 계산
└── calculateRecommendedDeposit() - 추천 월 납입액 계산
```

- 각 함수가 단일 역할만 수행
- 개별 함수 단위 테스트 용이
- 계산 로직 재사용 가능

**코드 디벨롭 고민?**

1. api 응답 타입 -> SavingsProduct에 제네릭 타입 적용하기? 지금 너무 헤비한 스펙인가?

2. InputSection에서 저축기간에 대한 코드는 아래와 같습니다

- 이 코드가 반복된다고 느껴져서 자꾸 const로 [6,12,24]를 빼고, map을 돌리고 싶은 마음이 생깁니다
- 그게 맞는 판단일지 궁급합니다
- 아직은 선택 섹션이 적어서 오히려 코드로 풀어놓는게 가독성이 좋다는 생각이 들기도 합니다.

```
<SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
<SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
<SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
```

3. 입력창에 숫자만 입력하게 만든 후, 화폐 단위 표시를 적용할 수 있을지 고민이 됩니다.
   - 입력하는 값에도 단위 표시를 적용한다면, 숫자 중간 부분을 지우려고 할 때 리렌더링이 일어나며 커서가 맨 뒤로 튕길 것입니다. 사용자 입장에서는 당황할 수 있습니다.

4. useState로 상태를 관리하며 props drilling이 발생하는데, 지금 단계에서는 용인 가능한 수준일까요?
   - 어느 시점에 context나 전역 상태 라이브러리로 전환해야 하는 것일까요?

5. ui 컴포넌트 분리 단위가 현재 적절한지 궁금합니다.
   - 입력부/상품목록/계산결과

6. useCalculationResult로 커스텀 훅을 분리해서 순수함수를 추출했습니다.
   - 이 훅은 크기가 커서 분리했습니다. 다른 filter 함수나 find 함수는 분리하는 게 오히려 오버 엔지니어링일까요?
