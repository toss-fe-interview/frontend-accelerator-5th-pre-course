# useSavingsProduct Hook

적금 계산기 페이지에서 사용하는 상태 관리 훅입니다. 적금 상품 데이터 조회, 사용자 입력 상태, 그리고 다양한 파생 상태를 하나의 인터페이스로 제공합니다.

## 설계 목표

### 1. 페이지 스코프 상태 관리

- **원칙**: 페이지 컴포넌트에서 훅을 한 번만 호출하여 상태 관리
- **구현**: `useState`를 사용한 로컬 상태 관리
- **결과**: 페이지 언마운트 시 자동으로 상태 초기화, 추가 라이브러리 불필요

### 2. Co-location (응집도)

- **원칙**: 페이지와 관련된 모든 로직을 함께 배치
- **구조**:

  ```text
  SavingsCalculatorPage/
  ├── index.tsx                    # 페이지 컴포넌트
  └── useSavingsProduct/           # 페이지 전용 훅
      ├── README.md               # 이 문서
      ├── index.ts                # 메인 훅 (useState + useMemo)
      ├── api.ts                  # React Query API 호출
      └── types.ts                # 타입 정의
  ```

- **장점**: 페이지 이해가 쉽고, 삭제/이동 시 관련 코드를 한꺼번에 처리 가능

### 3. 파생 상태 관리

- **도구**: React의 `useMemo`를 활용하여 파생 상태를 계산
- **이점**:
  - 컴포넌트에서 복잡한 계산 로직을 분리
  - 의존성 배열로 명확한 재계산 조건 명시
  - 표준 React 패턴 사용으로 학습 곡선 감소

## API

### 반환값

```typescript
{
  // 데이터
  products: SavingsProduct[];              // 전체 적금 상품 목록
  filteredProducts: SavingsProduct[];      // 필터링된 상품 목록
  selectedProduct: SavingsProduct | null;  // 선택한 상품
  recommendedProducts: SavingsProduct[];   // 추천 상품 목록 (상위 2개)

  // 상태
  targetAmount: number | null;             // 목표 금액
  monthlyAmount: number | null;            // 월 납입액
  savingsTerm: number;                     // 저축 기간 (기본값: 12)

  // 파생 상태
  expectedRevenue: number | null;          // 예상 수익 금액
  targetDifference: number | null;         // 목표 금액과의 차이
  recommendedMonthlyAmount: number | null; // 추천 월 납입 금액

  // Setters
  setTargetAmount: (value: number | null) => void;
  setMonthlyAmount: (value: number | null) => void;
  setSavingsTerm: (value: number) => void;
  setSelectedProduct: (product: SavingsProduct | null) => void;
}
```

## 파생 상태 로직

### 1. filteredProducts (필터링된 상품 목록)

**조건**:

- 월 납입액이 `null`이면 빈 배열 반환
- `product.minMonthlyAmount ≤ monthlyAmount ≤ product.maxMonthlyAmount`
- `product.availableTerms === savingsTerm`

### 2. expectedRevenue (예상 수익 금액)

**공식**: `월 납입액 × 저축 기간 × (1 + 연이자율 × 0.5)`

**조건**:

- `selectedProduct === null` 또는 `monthlyAmount === null`이면 `null` 반환

### 3. targetDifference (목표 금액과의 차이)

**공식**: `목표 금액 - 예상 수익 금액`

**조건**:

- `expectedRevenue === null` 또는 `targetAmount === null`이면 `null` 반환

### 4. recommendedMonthlyAmount (추천 월 납입 금액)

**공식**: `목표 금액 ÷ (저축 기간 × (1 + 연이자율 × 0.5))`

- 1,000원 단위로 반올림

**조건**:

- `selectedProduct === null` 또는 `targetAmount === null`이면 `null` 반환

### 5. recommendedProducts (추천 상품 목록)

**로직**:

- `filteredProducts`를 연이자율 기준 내림차순 정렬
- 상위 2개만 반환

## 설계 결정 (Design Decisions)

### Q: 왜 Jotai나 Context를 사용하지 않았나요?

**A**:

- 이 훅은 페이지 최상위에서 한 번만 호출되고 props로 전달
- 여러 컴포넌트에서 독립적으로 호출할 필요가 없음
- `useState` + `useMemo`가 가장 간단하고 명확한 솔루션
- 추가 라이브러리나 보일러플레이트 불필요

### Q: 여러 컴포넌트에서 이 훅을 호출하면 어떻게 되나요?

**A**:

- 각 컴포넌트가 독립적인 상태를 가짐 (상태 공유 안 됨)
- React Query는 캐싱되므로 API 중복 호출은 발생하지 않음
- 파생 상태 계산은 각 컴포넌트마다 실행 (~0.1ms, 무시할 수 있는 수준)
- **권장 패턴**: 페이지 최상위에서 한 번만 호출 + props 전달

### Q: Props drilling이 깊어지면 어떻게 하나요?

**A**:

- 3 depth 이상 깊어지면 Context 도입 고려
- 또는 컴포넌트 구조를 재설계하여 depth 줄이기
- 성능 최적화가 필요하면 Jotai 같은 상태 관리 라이브러리 재도입

### Q: 월 납입액이 null일 때 왜 빈 배열을 반환하나요?

**A**:

- 요구사항에 따라 사용자가 월 납입액을 입력하기 전에는 상품 목록을 보여주지 않음
- 사용자에게 "입력을 해야 결과를 볼 수 있다"는 명확한 UX 제공

## 요구사항 매핑

| 요구사항            | 구현 위치                                          |
| ------------------- | -------------------------------------------------- |
| 적금 상품 목록 연동 | `api.ts` - `useSavingsProductsQuery`               |
| 목표 금액 입력      | `index.ts` - `useState` (targetAmount)             |
| 월 납입액 입력      | `index.ts` - `useState` (monthlyAmount)            |
| 저축 기간 선택      | `index.ts` - `useState` (savingsTerm, 기본값: 12)  |
| 조건별 필터링       | `index.ts` - `useMemo` (filteredProducts)          |
| 상품 선택           | `index.ts` - `useState` (selectedProduct)          |
| 예상 수익 금액 계산 | `index.ts` - `useMemo` (expectedRevenue)           |
| 목표 금액과의 차이  | `index.ts` - `useMemo` (targetDifference)          |
| 추천 월 납입 금액   | `index.ts` - `useMemo` (recommendedMonthlyAmount)  |
| 추천 상품 목록      | `index.ts` - `useMemo` (recommendedProducts)       |

## 참고 문서

- [프로젝트 요구사항](.docs/accelerator-plan.md)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
