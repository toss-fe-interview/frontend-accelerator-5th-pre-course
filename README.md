# 토스 Frontend Developer 면접 과제 🔥

## Getting started

```sh
yarn dev
```

서비스의 유지보수나 장기적인 확장성을 고려한 설계, 추상화 관점에 집중해서 기능을 구현해주세요.

필수 과제 이후로 진행 중 or 후 - 사용자 경험을 개선하고 싶은 지점

## api 관련

```typescript
import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from 'types/SavingsProduct.type';

// GET /api/savings-products
export const getSavingsProducts = async () => await http.get<SavingsProduct[]>(
  '/api/savings-products',
);


// API 오류 캐치하기
try {
  await http.post(...);
} catch (e) {
  if (isHttpError(e)) {
    console.log(e.message);
  }
}
```

## 필터링 조건 관련

- 주어진 과제 요구 사항 조건에서는 필터링 조건에 대하여 다음과 같이 적혀 있었으나,

```
**필터링 조건**

- 월 납입액
    - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
    - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
- 저축 기간
    - `product.availableTerms` (저축 기간)와 동일해야 함
```

사용자가 입력한 월 납입액에 대하여 product.minMonthlyAmount보다 크거나 같고, product.maxMonthlyAmount보다 작거나 같은게 사용자 경험에 더 자연스럽다고 판단하여, 필터링 조건을 설정하였습니다.
