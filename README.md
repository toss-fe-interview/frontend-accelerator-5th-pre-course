# 토스 Frontend Developer 면접 과제 🔥

## Getting started

```sh
yarn dev
```

# 작업관련

1. 필요한 컴포넌트

- SavingsCalculatorPage => 최상단 페이지 컴
- ProductList => 입력에 맞게 필터링 되어서 렌더링 + 적금 선택가능
- CalculationResult => 입력 데이터랑 적금 상품 데이터로 계산하고, 추천상품 목록 렌더링

1. 필요한 데이터

- 클라이언트
  - 사용자가 입력한 데이터
  - 서버에서 받아온 데이터인데, 선택 유무 데이터추가된.
  - 탭 (적금 상품 | 계산 결과)
- 서버 : api call해서 받아온 데이터
-
-
-
-
-

# 순서

1. api call 테스트
2. 컴포넌트 나누기
3. 각 컴포넌트 개발

---- 프로젝트 개선 ----

## 문제점 파악

- 이름들이 너무 일반적이거나 애매모호함. => 네이밍
- onProductSelect이 SavingCalculator에서 사용되지 않고, props로 전달만됨. => 컴포넌트 구조
- 폼이 길어졌을때 form자체를 별도의 컴포넌트로 추출 유무 판단 필요. => 컴포넌트 구조
- 적금 아이템이 현재 같은 데이터를 바라보고 있는데, 별도의 element로 분리되어있음. => 컴포넌트 추출
- 값에 대한 엣지 케이스 고려(소수점, 음수, 0 , null, undefined) => 비즈니스 로직 추출
- 컴포넌트와는 상관있지만, 리액트와 상관없는 로직, 변수, 타입들은 별도의 파일로 분리 필요 => 파일 구조
- api 에러 처리가 되어있지 않음 => 기능 개선
- 컴포넌트에 비즈니스 계산 로직들이 포함 추출 => 비즈니스 로직 추출

## 확장성 (서비스 경험에 따른)

- ProductItem로 같은 데이터를 사용하지만, 다른 UI가 추가될 수 있음.
- isSelected 말고도 다른 값으로 추가되어 그 값을 다루기위해 handleSelectItem 같은 함수가 추가될 수 있음.
- getProducts 말고 다른 api call이 일어날 수 있음.
- form 입력에 따라 다른 api call을 해야할 수도 있음.
- productList 데이터 사이에 광고 데이터가 중간에 낄 수 있음.
- 회원 유저는 getProducts가 아닌 해당 회원에 맞는 다른 endpoint를 호출해야할수도 있음.
- CalculationResult에 쿠폰 적용에 따라 계산값이 변경될 수 있음.

## 추상화

- 컴포넌트 레벨로 분리 (추상화 레벨이 맞춰져 있는지?)

## 리팩토링 시작

유지 보수 개선 - 1 (네이밍)

- 변수명 함수명 모두 개선 (최소한의 리소스로 맥락 파악을 쉽게 할 수 있음.)
  - Calculator => 이름이 너무 일반적이라 계산기 역할만 하는 것으로 오해 가능. SavingsCalculator로 개선. 페이지의 이름을 따라감.
  - FormDataType => file객체의 formData와 헷 갈릴수 있음. 계산에 필요한 form의 의미에 가깝도록 CalculatorForm로 개선.
  - 유저 인풋에 따라 필터된 상품들 => filteredProductsByInputs
  - 예상 수익 금액 => expectedReturnAmount
  - 목표 금액과의 차이 => targetGapAmount
  - 추천 월 납입 금액 => recommendedMonthlyContribution

유지 보수 개선 - 2 (파일로 분리)

- 리액트와 상관없으면서 + 재사용될 가능성이 높은 타입, 상수, 함수들은 별도의 파일로 추출 (최소한의 리소스로 컴포넌트 파일 내부 코드량 및 역할을 덜 수 있음)
  - 컴포넌트와는 상관있지만, 리액트와 상관없는 로직, 변수, 타입들은 별도의 파일로 분리 필요 => 파일 구조
  - roundToThousand => 천 단위 반올림 하는 함수 (서비스내에 전체로 사용할수 있으므로 유틸로 추출.)
