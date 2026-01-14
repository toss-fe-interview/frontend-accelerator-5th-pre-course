# 토스 적금 계산기 - 과제 명세서

## 프로젝트 개요
- **목표**: 토스 사용자들이 목표 금액을 달성하기 위한 월 납입액을 계산하고, 최적의 적금 상품을 추천받을 수 있는 "토스 적금 계산기" 구현
- **제한 시간**: 2시간
- **중요**: 서비스의 유지보수나 장기적인 확장성을 고려한 설계, 추상화 관점에 집중

## 기술 스택
- Node 22
- React 18
- TypeScript
- Vite
- Emotion (CSS-in-JS)
- tosslib (토스 UI 라이브러리 및 HTTP client)

## API 엔드포인트

### 1. 상품 목록 가져오기
```
GET /api/savings-products
```

**Response Type:**
```typescript
interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;        // 연 이자율
  minMonthlyAmount: number;  // 최소 월 납입액
  maxMonthlyAmount: number;  // 최대 월 납입액
  availableTerms: number;    // 저축 기간 (개월)
}
```

**HTTP Client 사용법:**
```typescript
import { http, isHttpError } from 'tosslib';

const response = await http.get<SavingsProduct[]>('/api/savings-products');

// 오류 처리
try {
  await http.post(...);
} catch (e) {
  if (isHttpError(e)) {
    console.log(e.message);
  }
}
```

## 구현 요구사항

### 1. 적금 상품 목록 연동하기 ✅
- [ ] 서버에서 적금 상품 목록 불러오기
- [ ] `tosslib`의 `http` 사용
- [ ] 적금 상품 목록 화면에 출력
- [ ] 원단위 콤마(,) 출력 처리

**주요 파일**: `/src/pages/SavingsCalculatorPage.tsx`

### 2. 저축 목표 입력 기능 만들기 ✅
사용자 입력 필드:
- [ ] 목표 금액 (TextField)
- [ ] 월 납입액 (TextField)
- [ ] 저축 기간 (SelectBottomSheet: 6개월, 12개월, 24개월)

**필터링 조건**:
- [ ] 월 납입액 필터링:
  - `product.minMonthlyAmount` < 입력값 < `product.maxMonthlyAmount`
- [ ] 저축 기간 필터링:
  - `product.availableTerms` === 선택한 기간

### 3. 적금 상품 목록에서 선택 기능 만들기 ✅
- [ ] 상품 클릭 시 선택 아이콘 표시 (`<Assets.Icon name="icon-check-circle-green" />`)
- [ ] 하나의 상품만 선택 가능 (단일 선택)
- [ ] 선택한 상품 정보는 "계산 결과" 탭에서 사용

### 4. 계산 결과 탭 만들기 ✅

#### 탭 전환 기능
- [ ] "적금 상품" / "계산 결과" 탭 전환 구현
- [ ] 계산 결과 탭 선택 시 `CalculationResult` 컴포넌트 표시

#### 계산 결과 (선택한 상품 있을 때)
- [ ] **예상 수익 금액**
  ```
  최종 금액 = 월 납입액 × 저축 기간 × (1 + 연이자율 × 0.5)
  ```

- [ ] **목표 금액과의 차이**
  ```
  목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
  ```

- [ ] **추천 월 납입 금액**
  ```
  월 납입액 = 목표 금액 ÷ (저축 기간 × (1 + 연이자율 × 0.5))
  ```
  - 1,000원 단위로 반올림

#### 계산 결과 (선택한 상품 없을 때)
- [ ] "상품을 선택해주세요" 메시지 출력

#### 추천 상품 목록
- [ ] 입력 조건에 맞는 상품 중 **연 이자율이 가장 높은 2개** 상품 출력
- [ ] 선택한 상품이 있다면 선택 아이콘 표시

## 프로젝트 구조

```
src/
├── App.tsx                          # 앱 엔트리
├── main.tsx                         # React 진입점
├── pages/
│   ├── Routes.tsx                   # 라우팅 설정
│   └── SavingsCalculatorPage.tsx   # 메인 페이지 (작업 대상)
└── vite-env.d.ts
```

## 주요 컴포넌트 (tosslib)

### UI 컴포넌트
- `NavigationBar` - 네비게이션 바
- `TextField` - 입력 필드
- `SelectBottomSheet` - 바텀시트 선택 컴포넌트
- `Tab` - 탭 컴포넌트
- `ListRow` - 리스트 행
- `ListHeader` - 리스트 헤더
- `Assets.Icon` - 아이콘 컴포넌트
- `Spacing` - 간격 컴포넌트
- `Border` - 구분선

### 유틸리티
- `colors` - 색상 상수
- `http` - HTTP 클라이언트
- `isHttpError` - HTTP 오류 체크

## 개발 서버 실행

```bash
yarn dev
```

## 주의사항

1. **숫자 포맷팅**: 원단위는 반드시 콤마(,)로 구분하여 출력
2. **단일 선택**: 적금 상품은 하나만 선택 가능
3. **필터링**: 입력 조건에 맞지 않는 상품은 목록에서 제외
4. **반올림**: 추천 월 납입 금액은 1,000원 단위로 반올림
5. **확장성**: 유지보수와 장기적인 확장성을 고려한 설계
6. **UX**: 사용자 경험 개선 지점이 있다면 구현하거나 문서화

## 구현 팁

### 숫자 포맷팅
```typescript
// 콤마 추가
const formatNumber = (num: number) => num.toLocaleString('ko-KR');

// 1,000원 단위 반올림
const roundToThousand = (num: number) => Math.round(num / 1000) * 1000;
```

### 상태 관리 고려사항
- 목표 금액
- 월 납입액
- 저축 기간
- 선택한 상품
- 현재 활성 탭
- 적금 상품 목록

## 제출 방법
1. `feature` 브랜치에서 작업
2. GitHub에 푸시
3. Pull Request 생성
4. 리뷰받고 싶은 부분 PR 내용에 작성