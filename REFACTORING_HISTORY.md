# 리팩토링 히스토리

## 2026-01-16: filteredProducts What/How 분리

### 배경
디스코드에서 논의된 "what과 how 분리" 원칙을 `filteredProducts` 로직에 적용

### 분석 과정

**1. 코드가 무엇을 하려는지 정의**
- `filteredProducts`: 입력된 필터링 값을 기반으로 상품 목록을 필터링
- `isValidMonthly`: 월 납입액이 상품의 min/max 범위 내인지 확인
- `isValidTerm`: 저축 기간이 동일한지 확인
- `isValidTargetAmount`: 총 납입액이 목표 금액을 초과하는지 확인

**2. 패턴 파악**
- undefined 체크가 각 isValid 변수에서 반복됨
- isValid~ 변수명이 "왜" 이 조건을 체크하는지 설명하지 못함
- 계산 로직(how)이 직접 노출되어 가독성 저하

**3. What/How 정의**
- **what**: 필터링에 필요한 값 (무엇을 기준으로 필터링할지)
- **how**: 실제 계산 로직 (어떻게 필터링할지)

### 변경 내용

**새 파일: `src/utils/savings-filter.ts`**
```typescript
// how가 함수 내부에 숨겨짐
const isMonthlyPaymentInRange = (monthlyPayment, product) => {
  return monthlyPayment > product.minMonthlyAmount && monthlyPayment < product.maxMonthlyAmount;
};

const isTermMatching = (term, product) => {
  return product.availableTerms === term;
};

const canExceedTargetAmount = (monthlyPayment, term, targetAmount) => {
  return monthlyPayment * term > targetAmount;
};

export const filterSavingsProducts = (products, params) => { ... };
```

**수정: `src/pages/SavingsCalculatorPage.tsx`**

Before:
```typescript
const filteredProducts = useMemo(() => {
  return savingsProducts.filter(product => {
    if (monthlyPayment === undefined || availableTerms === undefined || targetAmount === undefined) {
      return false;
    }
    const isValidMonthly = monthlyPayment > product.minMonthlyAmount && monthlyPayment < product.maxMonthlyAmount;
    const isValidTerm = product.availableTerms === availableTerms;
    const isValidTargetAmount = monthlyPayment * availableTerms > targetAmount;
    return isValidMonthly && isValidTerm && isValidTargetAmount;
  });
}, [...]);
```

After:
```typescript
// what: 필터링에 필요한 모든 값이 있는지
const hasAllFilterValues = monthlyPayment !== undefined && availableTerms !== undefined && targetAmount !== undefined;

const filteredProducts = useMemo(() => {
  if (!hasAllFilterValues) return [];
  // what: 필터링 조건에 맞는 상품 반환 (how는 함수 내부에 숨김)
  return filterSavingsProducts(savingsProducts, { monthlyPayment, availableTerms, targetAmount });
}, [...]);
```

### 추가 개선
- `hasAllFilterValues` 재사용으로 중복 제거
- `selectedSavingsProduct && selectedSavingsProduct` → `selectedSavingsProduct` (의미없는 코드 제거)

---

## 추가 학습: "안에서 밖으로" 추상화

### 피드백 내용
```typescript
const top2Products = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
```
이 코드도 how가 노출되어 있음.

### 두 가지 추상화 방식

**❌ 밖에서 안으로 (전체를 통째로 감싸기)**
```typescript
const top2Products = getTop2ProductsByAnnualRate(filteredProducts);
```
- 유연성이 떨어짐

**✅ 안에서 밖으로 (콜백만 떼서 이름 붙이기)**
```typescript
const byAnnualRateDesc = (a, b) => b.annualRate - a.annualRate;
const top2Products = [...filteredProducts].sort(byAnnualRateDesc).slice(0, 2);
```
- 읽히는 방식: "금리 내림차순으로 정렬해서 상위 2개"
- 재사용 가능, 조합 가능

### 핵심
- 전체를 한 번에 감싸지 말고
- **가장 작은 how**(콜백)부터 **의미 있는 이름(what)**을 붙여서 추출
- 코드가 문장처럼 읽히면서도 유연성을 잃지 않음
