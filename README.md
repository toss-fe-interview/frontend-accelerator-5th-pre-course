# 토스 Frontend Developer 면접 과제 🔥

## Getting started

```sh
yarn dev
```

## 주요 기능

1. 적금 상품 목록

- 상품 목록을 조회
- 사용자 입력 조건(월 납입액, 기간)에 따라 필터링
- 상품 선택/해제

2. 저축 목표 입력

- 목표 금액
- 월 납입액
- 저축 기간

3. 계산 결과 탭

- 선택 상품 기준으로 계산
  - 예상 수익 금액
    - 공식: `최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)`
  - 목표 금액과의 차이
    - 공식: `목표 금액과의 차이 = 목표 금액 - 예상 수익 금액`
  - 추천 월 납입 금액
    - 공식: `월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))` -> 1,000원 단위로 반올림

4. 추천 상품 목록

- 필터링 된 상품 중 연이자율 상위 2개 상품 출력
- 선택된 상품은 선택 아이콘 표기

## tech stack

1. zod
2. zustand
3. tanstack query

## 구현 계획

1. 의존성 설치
2. api 연동
   2-1. 타입 안정성 추가

3. 사용자 입력 기능
   3-1. 입력 데이터 타입을 정의
   3-2. 필터 구현 + 데이터 필터링

4. 상품선택 기능
   4-1. selected 상태 추가
   4-2. 선택 토글 기능

5. 계산 결과 탭 만들기
   5-1. 탭 토글 기능
   5-2. 계산 결과 컴포넌트 구현
   5-3. 계산 로직 기능 구현
   5-4. 추천 상품 목록 구현

6. 리팩터링 및 버그 수정
   [] availableTerms 타입 수정(6, 12, 24)

## 설계 결정 사항

### Compound Component 패턴 적용 (TabContent)

탭 컨텐츠 렌더링에 Compound Component 패턴을 적용했습니다.

**Before: 삼항 연산자**

```tsx
{
  selectedTab === 'productList' ? <> ... 적금 상품 목록 ... </> : <> ... 계산 결과 ... </>;
}
```

**After: Compound Component**

```tsx
<TabContent selectedTab={selectedTab}>
  <TabContent.Panel value="productList">... 적금 상품 목록 ...</TabContent.Panel>
  <TabContent.Panel value="calculationResult">... 계산 결과 ...</TabContent.Panel>
</TabContent>
```

**적용 이유**

| 관점   | 설명                                                               |
| ------ | ------------------------------------------------------------------ |
| 추상화 | 탭 전환 로직(`selectedTab === value`)을 `TabContent` 내부에 캡슐화 |
| 선언적 | 조건문 없이 "어떤 탭에 어떤 컨텐츠"인지 코드만 봐도 파악 가능      |
| 확장성 | 탭 추가 시 새로운 `Panel`만 추가하면 됨 (조건문 수정 불필요)       |
| 일관성 | tosslib의 `Tab.Item`, `ListRow.Texts` 등 기존 패턴과 동일한 API    |
