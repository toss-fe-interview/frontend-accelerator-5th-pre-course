# 토스 Frontend Developer 면접 과제 🔥

## Getting started

```sh
yarn dev
```

---

## 설계 방향 (Design Direction)

### 1. 아키텍처 개요

본 프로젝트는 유지보수성과 확장성을 고려하여 다음과 같은 아키텍처 원칙을 따릅니다.

#### 핵심 원칙

- **관심사의 분리(Separation of Concerns)**: 비즈니스 로직과 UI 컴포넌트를 명확히 분리
- **단일 책임 원칙(Single Responsibility Principle)**: 각 모듈은 하나의 명확한 책임만 수행
- **재사용성(Reusability)**: 도메인 로직과 유틸리티 함수의 재사용 가능한 구조화
- **타입 안정성(Type Safety)**: TypeScript를 활용한 강력한 타입 정의

---

### 2. 폴더 구조

```
src/
├── pages/                      # 페이지 컴포넌트
│   └── SavingsCalculatorPage.tsx
├── components/                 # 재사용 가능한 UI 컴포넌트
│   ├── ProductList.tsx        # 적금 상품 목록 컴포넌트
│   ├── CalculationResult.tsx  # 계산 결과 컴포넌트
│   └── ProductListItem.tsx    # 적금 상품 아이템 컴포넌트
├── hooks/                      # Custom React Hooks
│   ├── useSavingsProducts.ts  # 적금 상품 데이터 관리
│   ├── useSavingsCalculator.ts # 적금 계산 로직
│   └── useProductFilter.ts    # 상품 필터링 로직
├── services/                   # API 통신 레이어
│   └── savingsApi.ts          # 적금 상품 API
├── utils/                      # 유틸리티 함수
│   ├── format.ts              # 숫자 포맷팅 (콤마, 원 단위 등)
│   └── calculation.ts         # 적금 계산 공식
├── types/                      # TypeScript 타입 정의
│   └── savings.ts             # 적금 관련 타입
└── constants/                  # 상수 정의
    └── savings.ts             # 적금 관련 상수 (저축 기간 등)
```

---

### 3. 계층별 설계

#### 3.1 데이터 계층 (Data Layer)

**서비스 계층 (`services/`)**

```typescript
// savingsApi.ts
// - HTTP Client를 활용한 API 통신
// - 에러 핸들링 및 재시도 로직
// - API 응답 데이터의 타입 변환
```

**역할**:

- API 통신 추상화
- 비즈니스 로직과 네트워크 레이어 분리
- 에러 핸들링 중앙화

#### 3.2 비즈니스 로직 계층 (Business Logic Layer)

**유틸리티 함수 (`utils/`)**

```typescript
// calculation.ts
// - 예상 수익 금액 계산
// - 목표 금액과의 차이 계산
// - 추천 월 납입 금액 계산 (1,000원 단위 반올림)
```

```typescript
// format.ts
// - 숫자를 천 단위 콤마 형식으로 변환
// - 원 단위 표시 포맷팅
```

**역할**:

- 순수 함수로 구현하여 테스트 용이성 확보
- 비즈니스 로직의 재사용성 극대화
- 도메인 로직의 중앙화

#### 3.3 상태 관리 계층 (State Management Layer)

**Custom Hooks (`hooks/`)**

```typescript
// useSavingsProducts.ts
// - 적금 상품 목록 fetch
// - 로딩 상태 관리
// - 에러 상태 관리
```

```typescript
// useSavingsCalculator.ts
// - 목표 금액, 월 납입액, 저축 기간 입력 상태
// - 선택된 적금 상품 상태
// - 계산 결과 상태 (메모이제이션)
```

```typescript
// useProductFilter.ts
// - 입력 조건에 따른 상품 필터링 로직
// - 상위 이자율 상품 추천 로직
```

**역할**:

- React 컴포넌트에서 상태 관리 로직 분리
- 비즈니스 로직과 UI 로직의 분리
- 상태 변경에 따른 사이드 이펙트 관리

#### 3.4 표현 계층 (Presentation Layer)

**컴포넌트 (`components/`)**

```typescript
// ProductList.tsx
// - 적금 상품 목록 렌더링
// - 상품 선택 이벤트 핸들링
// Props: products, selectedProduct, onSelectProduct
```

```typescript
// CalculationResult.tsx
// - 계산 결과 표시
// - 추천 상품 목록 표시
// Props: calculationData, recommendedProducts
```

```typescript
// ProductListItem.tsx
// - 개별 적금 상품 아이템 렌더링
// - 선택 상태 표시
// Props: product, isSelected, onClick
```

**역할**:

- UI 렌더링에만 집중
- 비즈니스 로직을 props로 주입받음
- 재사용 가능한 컴포넌트 구조

---

### 4. 타입 시스템 설계

```typescript
// types/savings.ts

// 적금 상품 타입
interface SavingsProduct {
  id: string;
  name: string;
  annualInterestRate: number; // 연 이자율 (%)
  minMonthlyAmount: number; // 최소 월 납입액
  maxMonthlyAmount: number; // 최대 월 납입액
  availableTerms: number[]; // 가능한 저축 기간 (개월)
}

// 사용자 입력 타입
interface UserInput {
  targetAmount: number; // 목표 금액
  monthlyPayment: number; // 월 납입액
  savingTerm: number; // 저축 기간 (개월)
}

// 계산 결과 타입
interface CalculationResult {
  expectedAmount: number; // 예상 수익 금액
  differenceFromGoal: number; // 목표 금액과의 차이
  recommendedMonthlyPayment: number; // 추천 월 납입 금액
}
```

---

### 5. 주요 기능별 설계

#### 5.1 적금 상품 목록 연동

**데이터 흐름**:

```
API (GET /api/savings-products)
  → savingsApi.fetchProducts()
  → useSavingsProducts()
  → ProductList 컴포넌트
```

**구현 포인트**:

- React Query 또는 useState + useEffect를 활용한 데이터 페칭
- 로딩/에러 상태 처리
- 숫자 포맷팅 유틸리티 적용 (천 단위 콤마)

#### 5.2 저축 목표 입력 및 필터링

**데이터 흐름**:

```
사용자 입력
  → useSavingsCalculator() (상태 관리)
  → useProductFilter() (필터링 로직)
  → ProductList 컴포넌트 (필터된 결과 표시)
```

**필터링 로직**:

```typescript
// useProductFilter.ts
const filteredProducts = products.filter(product => {
  const matchesMonthlyAmount = monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount;

  const matchesTerm = product.availableTerms.includes(savingTerm);

  return matchesMonthlyAmount && matchesTerm;
});
```

#### 5.3 적금 상품 선택

**상태 관리**:

```typescript
// useSavingsCalculator.ts
const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
```

**UI 표시**:

- 선택 시 체크 아이콘 표시
- 단일 선택 (Single Selection) 패턴 적용

#### 5.4 계산 결과 표시

**계산 공식** (utils/calculation.ts):

```typescript
// 예상 수익 금액
const calculateExpectedAmount = (monthlyPayment: number, term: number, annualRate: number): number => {
  return monthlyPayment * term * (1 + annualRate * 0.5);
};

// 목표 금액과의 차이
const calculateDifference = (targetAmount: number, expectedAmount: number): number => {
  return targetAmount - expectedAmount;
};

// 추천 월 납입 금액 (1,000원 단위 반올림)
const calculateRecommendedPayment = (targetAmount: number, term: number, annualRate: number): number => {
  const rawAmount = targetAmount / (term * (1 + annualRate * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
};
```

**추천 상품 로직**:

```typescript
// useProductFilter.ts
const getTopRecommendedProducts = (filteredProducts: SavingsProduct[], count: number = 2): SavingsProduct[] => {
  return [...filteredProducts].sort((a, b) => b.annualInterestRate - a.annualInterestRate).slice(0, count);
};
```

---

### 6. 확장성 고려사항

#### 6.1 상태 관리 확장

- 현재: useState 기반 로컬 상태 관리
- 향후: 복잡도 증가 시 Context API, Zustand, Jotai 등으로 확장 가능

#### 6.2 API 레이어 확장

- 현재: 단일 API 엔드포인트
- 향후:
  - 복수 API 엔드포인트 추가 시 API 클라이언트 인스턴스화
  - Axios Interceptor를 활용한 공통 에러 핸들링
  - API 응답 캐싱 전략

#### 6.3 계산 로직 확장

- 현재: 단순 이자 계산
- 향후:
  - 복리 계산 옵션 추가
  - 세금 공제 계산
  - 중도 해지 시 예상 금액 계산

#### 6.4 컴포넌트 재사용성

- 현재: 페이지 내 컴포넌트
- 향후:
  - 다른 금융 계산기에서 재사용 가능한 공통 컴포넌트화
  - 디자인 시스템 통합

---

### 7. 테스트 전략

#### 단위 테스트 (Unit Test)

- `utils/calculation.ts`: 계산 로직 순수 함수 테스트
- `utils/format.ts`: 포맷팅 함수 테스트
- Custom Hooks: 상태 변화 로직 테스트 (React Testing Library)

#### 통합 테스트 (Integration Test)

- 사용자 입력 → 필터링 → 계산 결과 표시 플로우
- API 통신 → 상품 목록 표시 플로우

#### E2E 테스트

- 전체 사용자 시나리오 테스트

---

### 8. 성능 최적화

#### 메모이제이션

```typescript
// useSavingsCalculator.ts
const calculationResult = useMemo(() => {
  if (!selectedProduct) return null;
  return {
    expectedAmount: calculateExpectedAmount(...),
    differenceFromGoal: calculateDifference(...),
    recommendedMonthlyPayment: calculateRecommendedPayment(...)
  };
}, [selectedProduct, targetAmount, monthlyPayment, savingTerm]);
```

#### 렌더링 최적화

- React.memo를 활용한 불필요한 리렌더링 방지
- useCallback을 활용한 이벤트 핸들러 메모이제이션

---

### 9. 코드 품질 관리

- ESLint + Prettier를 활용한 코드 스타일 일관성 유지
- TypeScript strict mode 활성화
- 명확한 네이밍 컨벤션 (camelCase, PascalCase)
- JSDoc 주석을 활용한 함수 문서화

---

## 구현 순서

1. **타입 정의 및 상수 설정** (`types/`, `constants/`)
2. **유틸리티 함수 구현** (`utils/`)
3. **API 서비스 구현** (`services/`)
4. **Custom Hooks 구현** (`hooks/`)
5. **UI 컴포넌트 구현** (`components/`)
6. **페이지 통합** (`pages/SavingsCalculatorPage.tsx`)
7. **테스트 작성 및 검증**
