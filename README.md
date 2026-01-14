# 프로젝트 구현 내용

### 1. 구현 목표

유지보수성, 확장성, 추상화를 고려하여 구현해보기

#### 주요 설계 고려사항

- **API 분리**: API 호출 로직을 분리하여 데이터 페칭 로직을 중앙화하고, React Query 옵션도 별도 파일로 관리함.
- **컴포넌트 분리**: UI 컴포넌트를 작은 기능 단위로 나누어 재사용성을 높이려고 함.
- **계산 로직 분리**: 비즈니스 로직을 커스텀 훅으로 분리하여 UI와 로직의 결합도 낮추려고 함.
- **라이브러리 추상화**: 외부 라이브러리 의존성을 훅으로 래핑하여 라이브러리 변경 시 영향을 낮추려고 함.

### 2. 프로젝트 구조

```
src/domain/savings/
├── api/                    # API 관련 로직
│   ├── SavingsApi.ts      # API 호출 클래스
│   ├── SavingsQueryOption.ts  # React Query 옵션
│   └── type.ts            # API 타입 정의
├── components/             # UI 컴포넌트
│   ├── SavingCalculateResults.tsx
│   ├── SavingItem.tsx
│   ├── SavingsFilter.tsx
│   └── SavingsList.tsx
├── hooks/                 # 비즈니스 로직 훅
│   ├── useCalculateExpectedProfit.ts  # 예상 수익 계산 로직
│   ├── useFilterSavings.ts            # 적금 상품 필터링 로직
│   ├── useRecommendSavings.ts         # 추천 상품 로직
│   └── useSavingForm.ts               # 필터링 폼 react-hook-form hook 래핑
└── schema/                # Zod 스키마 정의
    └── form.ts            # 적금 상품 필터링폼 스키마
```

### 3. 고민한 부분

#### 계산 로직의 위치에 대한 고민

`useCalculateExpectedProfit` 훅 내부에 순수한 계산 로직이 포함되어 있습니다. 상태에 따라 변경되는 부분이 있어 훅을 사용했지만, 계산 로직까지 포함하게 되었는데 완전히 분리하는게 더 좋았을까 하는 고민이 있었습니다. 테스트 코드까지 만들었다면 분리하는 게 더 좋았을 것 같다는 생각이 드네요.

```typescript
const useCalculateExpectedProfit = ({ saving, goalAmount, monthlyAmount }: Params) => {
  const canCalculateExpectedProfit = saving && monthlyAmount;
  (...)

  const calculateExpectedProfit = ({
    annualRate,
    availableTerms,
    monthlyAmount,
  }: {
    annualRate: number;
    availableTerms: number;
    monthlyAmount: number;
  }) => {
    return Math.round(monthlyAmount * availableTerms * (1 + annualRate * 0.5));
  };
  (...)

  const getExpectedProfit = () => {
    if (!canCalculateExpectedProfit) {
      return null;
    }

    return calculateExpectedProfit({
      annualRate: saving.annualRate,
      availableTerms: saving.availableTerms,
      monthlyAmount,
    });
  };

  return {
    getExpectedProfit,
  }
```

#### 라이브러리 의존성에 대한 고민

`SavingsFilter` 컴포넌트의 props에 `react-hook-form`의 `UseFormReturn` 타입을 직접 사용하고 있습니다. 컴포넌트에 특정 라이브러리에 대한 의존성이 생기는 것 같은데 별다른 좋은 해결책이 떠오르지는 않아서 사용하게 되었습니다. 다른 라이브러리를 사용하게 되면 수정되는 부분이 많을 것 같아요. Props에 모든 value, onChange를 받는게 더 좋았을까요.

```typescript

interface Props {
  filterForm: UseFormReturn<FormSchema>;
}

export const SavingsFilter = ({ filterForm }: Props) => {
  const goalAmount = filterForm.watch('goalAmount');
  const monthlyAmount = filterForm.watch('monthlyAmount');
  const terms = filterForm.watch('terms');
  (...)

```
