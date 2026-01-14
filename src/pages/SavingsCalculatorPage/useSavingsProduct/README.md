# useSavingsProduct Hook

적금 계산기 페이지에서 사용하는 상태 관리 훅입니다. 적금 상품 데이터 조회, 사용자 입력 상태, 그리고 다양한 파생 상태를 하나의 인터페이스로 제공합니다.

## 설계 목표

### 1. 페이지 스코프 상태 관리

- **문제**: Jotai의 atom을 전역으로 선언하면 의도치 않게 전역 상태가 되어 페이지를 벗어나도 상태가 유지됨
- **해결**: `SavingsCalculatorPage`를 Jotai의 `Provider`로 감싸서 페이지 스코프로 격리
- **결과**: 페이지 내에서는 하위 컴포넌트들이 자유롭게 상태를 공유하되, 페이지 언마운트 시 자동으로 초기화

### 2. Co-location (응집도)

- **원칙**: 페이지와 관련된 모든 로직을 함께 배치
- **구조**:
  ```
  SavingsCalculatorPage/
  ├── index.tsx                    # 페이지 컴포넌트
  └── useSavingsProduct/           # 페이지 전용 훅
      ├── README.md               # 이 문서
      ├── index.ts                # 메인 훅
      ├── api.ts                  # React Query API 호출
      ├── atoms.ts                # Jotai atoms (상태 + 파생상태)
      └── types.ts                # 타입 정의
  ```
- **장점**: 페이지 이해가 쉽고, 삭제/이동 시 관련 코드를 한꺼번에 처리 가능

### 3. 선언적 파생 상태 관리

- **도구**: Jotai의 atom을 활용하여 파생 상태를 선언적으로 정의
- **이점**:
  - 컴포넌트에서 복잡한 계산 로직을 분리
  - 상태 변경 시 자동으로 파생 상태 재계산
  - `useMemo` 대비 더 명확한 의존성 관리

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

### Q: 왜 useState + useMemo가 아닌 Jotai를 사용했나요?

**A**:

- 파생 상태가 5개로 많고, 의존성 관계가 복잡함
- Jotai의 atom은 선언적으로 파생 상태를 정의할 수 있어 가독성과 유지보수성이 높음
- 컴포넌트가 필요한 상태만 구독하여 불필요한 리렌더링 방지

### Q: 왜 전역 hooks 폴더가 아닌 페이지 폴더에 위치하나요?

**A**:

- 이 훅은 `SavingsCalculatorPage`에만 종속적임
- Co-location 원칙: 관련된 코드를 가까이 배치
- 페이지를 삭제하거나 이동할 때 관련 로직을 함께 처리 가능

### Q: 왜 Suspense를 사용하나요?

**A**:

- React Query의 `useSuspenseQuery`와 함께 사용하여 로딩 상태를 선언적으로 처리
- 컴포넌트에서 로딩 상태 처리 로직을 제거하여 코드 간소화
- 에러 처리는 ErrorBoundary와 함께 사용 가능 (향후 추가 예정)

### Q: 월 납입액이 null일 때 왜 빈 배열을 반환하나요?

**A**:

- 요구사항에 따라 사용자가 월 납입액을 입력하기 전에는 상품 목록을 보여주지 않음
- 사용자에게 "입력을 해야 결과를 볼 수 있다"는 명확한 UX 제공

## 요구사항 매핑

| 요구사항            | 구현 위치                                   |
| ------------------- | ------------------------------------------- |
| 적금 상품 목록 연동 | `api.ts` - `useSavingsProductsQuery`        |
| 목표 금액 입력      | `atoms.ts` - `targetAmountAtom`             |
| 월 납입액 입력      | `atoms.ts` - `monthlyAmountAtom`            |
| 저축 기간 선택      | `atoms.ts` - `savingsTermAtom` (기본값: 12) |
| 조건별 필터링       | `atoms.ts` - `filteredProductsAtom`         |
| 상품 선택           | `atoms.ts` - `selectedProductAtom`          |
| 예상 수익 금액 계산 | `atoms.ts` - `expectedRevenueAtom`          |
| 목표 금액과의 차이  | `atoms.ts` - `targetDifferenceAtom`         |
| 추천 월 납입 금액   | `atoms.ts` - `recommendedMonthlyAmountAtom` |
| 추천 상품 목록      | `atoms.ts` - `recommendedProductsAtom`      |
