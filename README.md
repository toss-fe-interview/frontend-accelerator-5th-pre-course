# 토스 적금 계산기 구현

## 1. 구현 목표

유지보수성, 확장성, 추상화를 고려하여 적금 계산기 구현

### 주요 설계 고려사항

- **타입 안정성**: TypeScript를 활용한 엄격한 타입 정의
- **컴포넌트 분리**: UI 컴포넌트를 작은 기능 단위로 나누어 재사용성 향상
- **상태 관리**: 단일 객체로 폼 상태를 관리하여 일관성 유지
- **로직 분리**: 비즈니스 로직(필터링, 계산)을 유틸 함수로 분리하여 테스트 용이성 증가

## 2. 프로젝트 구조

```
src/
├── apis/
│   └── savings.ts              # API 호출 및 React Query hooks
├── components/
│   ├── ProductList.tsx         # 상품 목록 컴포넌트
│   ├── SavingsForm.tsx         # 입력 폼 컴포넌트
│   └── CalculationResult.tsx   # 계산 결과 컴포넌트
├── hooks/
│   ├── useSavingsForm.ts       # 폼 상태 관리 훅
│   └── useSavingsCalculator.ts # 필터링/계산 로직 훅
├── pages/
│   └── SavingsCalculatorPage.tsx
├── types/
│   └── savings.ts              # 타입 정의 (SavingPeriod, SavingsFormData 등)
└── utils/
    ├── numberUtils.ts          # 숫자 변환 유틸
    ├── filterProducts.ts       # 상품 필터링 로직
    └── calculateSavings.ts     # 계산 로직 (예상 수익, 추천 월 납입액 등)
```

## 3. 고민한 부분

### 타입 가드 vs 타입 단언

탭 전환 시 `SelectBottomSheet`의 `onChange`에서 넘어오는 `string` 값 처리 방법

**선택**: 타입 가드 사용

```typescript
const handleChangeTab = (tab: string) => {
  if (tab === 'products' || tab === 'results') {
    setSelectedTab(tab);
  }
};
```

- **이유**: 런타임 안전성 보장, 예상치 못한 값 무시, 디버깅 용이

---

### 필터링 로직의 빈 값 처리

월 납입액 미입력 시 처리 방법

**선택**: 빈 문자열일 경우 전체 상품 표시

```typescript
if (formData.monthlyAmount === '') {
  return products;
}
```

- **이유**: 0원 입력과 미입력 상태를 구분하여 사용자가 결정하지 않은 상태에서도 전체 옵션 확인 가능

---

### UX 개선 포인트

- 입력값이 0원일 경우 에러 메시지 표시 필요
- 로딩/에러 상태에서 스켈레톤 UI나 재시도 버튼 제공

---

### 설계 결정

- **월 납입액 미입력 시 전체 상품 표시**: 사용자가 조건 입력 전에도 상품을 탐색할 수 있도록 함
- **상태 관리 라이브러리 미사용**: 현재 규모에서는 Custom Hook으로 충분, 추후 확장 시 도입 고려
